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
        if not user.is_anonymous:
            response_subquery = user.responses.filter(vacancy_id=OuterRef('id'))
            return super().get_queryset().annotate(is_responded=Exists(response_subquery))
        return super().get_queryset()

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
