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