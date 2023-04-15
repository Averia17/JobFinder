from django.db.models import OuterRef, Exists
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from companies.models import Company
from companies.permissions import IsManagerOrDirector
from core.constants import EXPERIENCE_OPTIONS, EMPLOYMENT_TYPE
from vacancies.filters import VacancyFilter
from vacancies.models import Vacancy
from vacancies.permissions import IsOwnerManagerOrDirector
from vacancies.serializers import VacancyDetailSerializer, VacancySerializer
from views.serializers import VacancyViewSerializer


class VacancyViewSet(ModelViewSet):
    queryset = Vacancy.objects.all().select_related("company")
    serializer_class = VacancySerializer
    serializer_classes = {
        "retrieve": VacancyDetailSerializer,
        "create": VacancyDetailSerializer,
        "update": VacancyDetailSerializer,
        "partial_update": VacancyDetailSerializer,
    }
    search_fields = ["title", "description"]
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filterset_class = VacancyFilter

    permission_to_method = {
        "update": [IsOwnerManagerOrDirector],
        "partial_update": [IsOwnerManagerOrDirector],
        "create": [IsManagerOrDirector],
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
        if not user.is_anonymous:
            return queryset.annotate(
                is_responded=Exists(user.responses.filter(vacancy_id=OuterRef("id"))),
                is_favorite=Exists(
                    user.favorite_vacancies.filter(vacancy_id=OuterRef("id"))
                ),
            )
        return queryset

    def retrieve(self, request, pk=None, *args, **kwargs):
        serializer = VacancyViewSerializer(
            data={"vacancy": pk}, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
        return super().retrieve(request, *args, **kwargs)

    @action(detail=False, methods=["GET"])
    def favorites(self, request, *args, **kwargs):
        self.queryset = (
            super()
            .get_queryset()
            .filter(
                id__in=request.user.favorite_vacancies.values_list("vacancy", flat=True)
            )
        )
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=["GET"])
    def filters(self, request, *args, **kwargs):
        return Response(
            {
                "experience_options": EXPERIENCE_OPTIONS,
                "employment_type": EMPLOYMENT_TYPE,
                "companies": Company.objects.exclude(vacancies=None).values(
                    "id", "title"
                ),
            }
        )
