from rest_framework.mixins import CreateModelMixin, ListModelMixin
from rest_framework.viewsets import GenericViewSet

from views.models import ResumeView, VacancyView
from views.serializers import ResumeViewSerializer, VacancyViewSerializer


class ResumeViewViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):
    queryset = ResumeView.objects.all()
    serializer_class = ResumeViewSerializer


class VacancyViewViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):
    queryset = VacancyView.objects.all()
    serializer_class = VacancyViewSerializer
