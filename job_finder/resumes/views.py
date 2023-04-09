from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from resumes.models import Resume
from resumes.permissions import IsOwnerOrHasCompany
from resumes.serializers import ResumeSerializer, ResumeDetailSerializer
from views.serializers import ResumeViewSerializer


class ResumeViewSet(ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    serializer_classes = {
        "retrieve": ResumeDetailSerializer,
        "create": ResumeDetailSerializer,
        "update": ResumeDetailSerializer,
        "partial_update": ResumeDetailSerializer,
    }
    permission_to_method = {
        "retrieve": [IsOwnerOrHasCompany],
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
        queryset = super().get_queryset()
        if not self.request.user.is_manager:
            queryset = queryset.filter(user=self.request.user)
        return queryset

    def retrieve(self, request, pk=None, *args, **kwargs):
        company_id = request.user.company.id if request.user.company else None
        serializer = ResumeViewSerializer(data={"resume": pk, "company": company_id})
        if serializer.is_valid():
            serializer.save()
        return super().retrieve(request, *args, **kwargs)
