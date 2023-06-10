from django.db.models import Exists, OuterRef
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from resumes.filters import ResumeFilter
from resumes.models import Resume
from resumes.permissions import IsOwnerOrHasCompany, IsOwner
from resumes.serializers import ResumeSerializer, ResumeDetailSerializer
from views.models import ResumeView
from views.serializers import ResumeViewSerializer


class ResumeViewSet(ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeDetailSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["title", "description"]
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filterset_class = ResumeFilter

    serializer_classes = {
        "list": ResumeSerializer,
    }
    permission_to_method = {
        "retrieve": [IsOwnerOrHasCompany],
        "update": [IsOwner],
        "partial_update": [IsOwner],
        "destroy": [IsOwner],
    }

    def get_permissions(self):
        return [
            permission()
            for permission in self.permission_to_method.get(
                self.action, self.permission_classes
            )
        ]

    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.serializer_class)

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()
        if user.is_manager or user.is_director:
            queryset = queryset.annotate(is_favorite=Exists(
                    user.favorite_resumes.filter(resume_id=OuterRef("id"))
                ),
            )
        return queryset

    def retrieve(self, request, pk=None, *args, **kwargs):
        company_id = request.user.company and request.user.company.id
        company_id and ResumeView.objects.create(company_id=company_id, resume_id=pk)
        return super().retrieve(request, *args, **kwargs)

    @action(detail=False, methods=["GET"])
    def my(self, request):
        resume = get_object_or_404(Resume, user=request.user)
        serializer = self.get_serializer(resume)
        return Response(serializer.data)

    @action(detail=False, methods=["GET"])
    def favorites(self, request, *args, **kwargs):
        self.queryset = (
            super().get_queryset()
            .filter(
                id__in=request.user.favorite_resumes.values_list("resume", flat=True)
            )
        )
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=["GET"])
    def filters(self, request, *args, **kwargs):
        return Response({"city": set(Resume.objects.values_list("city", flat=True))})
