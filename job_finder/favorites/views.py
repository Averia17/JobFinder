from rest_framework.mixins import CreateModelMixin, ListModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.viewsets import GenericViewSet

from favorites.models import FavoriteVacancies
from favorites.serializers import FavoriteVacanciesSerializer


class FavoriteVacanciesViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):
    queryset = FavoriteVacancies.objects.all().select_related("vacancy")
    serializer_class = FavoriteVacanciesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        favorites = FavoriteVacancies.objects.filter(user=request.user, vacancy=request.data["vacancy"])
        if favorites.exists():
            favorites.delete()
            return Response("Successfully removed", status=HTTP_200_OK)
        return super().create(request, *args, **kwargs)
