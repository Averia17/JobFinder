from rest_framework.mixins import CreateModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.viewsets import GenericViewSet

from favorites.models import FavoriteVacancies
from favorites.serializers import FavoriteVacanciesSerializer


class FavoriteVacanciesViewSet(CreateModelMixin, GenericViewSet):
    queryset = FavoriteVacancies.objects.all().select_related("vacancy")
    serializer_class = FavoriteVacanciesSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        favorites = FavoriteVacancies.objects.filter(
            user=request.user, vacancy=request.data["vacancy"]
        )
        if favorites.exists():
            favorites.delete()
            return Response("Successfully removed", status=HTTP_200_OK)
        return super().create(request, *args, **kwargs)
