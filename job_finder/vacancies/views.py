from django.db.models import OuterRef, Exists
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.viewsets import ModelViewSet

from vacancies.filters import VacancyFilter
from vacancies.models import Vacancy
from vacancies.serializers import VacancyDetailSerializer, VacancySerializer


class VacancyViewSet(ModelViewSet):
    queryset = Vacancy.objects.all()
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

    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.serializer_class)

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()
        if self.action == "list":
            queryset = queryset.filter(is_active=True)
        if not user.is_anonymous:
            return queryset.annotate(
                is_responded=Exists(user.responses.filter(vacancy_id=OuterRef("id")))
            )
        return queryset
