from rest_framework.mixins import CreateModelMixin, ListModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet

from favorites.models import FavoriteVacancies
from favorites.serializers import FavoriteVacanciesSerializer


class FavoriteVacanciesViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):
    queryset = FavoriteVacancies.objects.all().select_related("vacancy")
    serializer_class = FavoriteVacanciesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)
