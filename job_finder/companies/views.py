from rest_framework.mixins import RetrieveModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED
from rest_framework.viewsets import GenericViewSet

from companies.models import Company, CompanyManager
from companies.permissions import IsOwnerOrReadOnly, UserInCompany
from companies.serializers import CompanySerializer, CompanyManagerSerializer
from users.serializers import UserRegisterSerializer


class CompanyViewSet(
    CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet
):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    permission_to_method = {
        "update": [IsAuthenticated, IsOwnerOrReadOnly],
        "partial_update": [IsAuthenticated, IsOwnerOrReadOnly],
        "retrieve": [IsAuthenticated, UserInCompany],
    }

    def get_permissions(self):
        return [
            permission()
            for permission in self.permission_to_method.get(
                self.action, self.permission_classes
            )
        ]

    def create(self, request, *args, **kwargs):
        user_data = {"email": request.data.pop("email", None),
                     "password": request.data.pop("password", None)}
        user_serializer = UserRegisterSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        director = user_serializer.save()
        request.data["director"] = director.id
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=HTTP_201_CREATED)


class CompanyManagerViewSet(
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericViewSet
):
    queryset = CompanyManager.objects.all()
    serializer_class = CompanyManagerSerializer
