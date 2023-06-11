import requests
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.hashers import make_password
from rest_framework import mixins
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from job_finder.settings import GOOGLE_ID_TOKEN_INFO_URL, GOOGLE_OAUTH2_CLIENT_ID
from users.models import User
from users.serializers import (
    CustomTokenObtainPairSerializer,
    UserRegisterSerializer,
    UserSerializer,
)


class UserViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.RetrieveModelMixin,
    GenericViewSet,
):
    serializer_class = UserRegisterSerializer
    queryset = User.objects.all()

    @action(
        detail=False,
        methods=["GET", "PATCH"],
        serializer_class=UserSerializer,
        permission_classes=[IsAuthenticated],
    )
    def my(self, request):
        if request.method == "GET":
            serializer = self.get_serializer(request.user)
        else:
            serializer = self.get_serializer(request.user, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        return Response(serializer.data)


class GoogleLoginView(APIView):
    @staticmethod
    def google_validate_id_token(id_token: str) -> bool:
        response = requests.get(GOOGLE_ID_TOKEN_INFO_URL, params={"id_token": id_token})
        if not response.ok:
            raise ValidationError("id_token неверный.")
        audience = response.json()["aud"]
        if audience != GOOGLE_OAUTH2_CLIENT_ID:
            raise ValidationError("Invalid audience.")
        return True

    def post(self, request):
        id_token = request.headers.get("Authorization")
        self.google_validate_id_token(id_token)
        user, _ = User.objects.get_or_create(
            email=request.data["email"],
            defaults={
                "password": make_password(BaseUserManager().make_random_password())
            },
        )
        token = RefreshToken.for_user(user)
        response = {
            "access_token": str(token.access_token),
            "refresh_token": str(token),
        }
        return Response(response)


class CustomTokenObtainPairView(TokenObtainPairView):
    # Replace the serializer with your custom
    serializer_class = CustomTokenObtainPairSerializer
