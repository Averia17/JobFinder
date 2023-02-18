from rest_framework.mixins import CreateModelMixin, DestroyModelMixin, ListModelMixin
from rest_framework.viewsets import GenericViewSet

from responses.models import VacancyResponse
from responses.serializers import VacancyResponseSerializer


class VacancyResponseViewSet(
    CreateModelMixin, DestroyModelMixin, ListModelMixin, GenericViewSet
):
    queryset = VacancyResponse.objects.all()
    serializer_class = VacancyResponseSerializer
