from django.db.models import OuterRef, Exists
from rest_framework.viewsets import ModelViewSet

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

    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.serializer_class)

    def get_queryset(self):
        user = self.request.user
        if not user.is_anonymous:
            response_subquery = user.responses.filter(vacancy_id=OuterRef('id'))
            return super().get_queryset().annotate(is_responsed=Exists(response_subquery))
        return super().get_queryset()
