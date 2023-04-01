import hashlib
from collections import OrderedDict
from urllib.parse import urlencode

from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from rest_framework.decorators import action
from rest_framework.mixins import (
    RetrieveModelMixin,
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_200_OK
from rest_framework.viewsets import GenericViewSet

from companies.models import Company, CompanyManager
from companies.permissions import IsOwnerOrReadOnly, UserInCompany
from companies.serializers import (
    CompanySerializer,
    PasswordSerializer,
    CompanyManagerSerializer,
)
from job_finder.settings import BASE_FRONTEND_URL, SECRET_KEY
from users.models import User
from users.serializers import UserRegisterSerializer
from job_finder.tasks import send_user_email


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
        user_data = {
            "email": request.data.pop("email", None),
            "password": request.data.pop("password", None),
        }
        user_serializer = UserRegisterSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        director = user_serializer.save()
        request.data["director"] = director.id
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=HTTP_201_CREATED)


class CompanyManagerViewSet(CreateModelMixin, DestroyModelMixin, GenericViewSet):
    queryset = CompanyManager.objects.all()
    serializer_class = CompanyManagerSerializer
    # TODO: Check permission
    permission_classes = [IsOwnerOrReadOnly]

    @action(detail=False, methods=["POST"])
    def accept_invite(self, request):
        serializer = PasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(User, email=request.data["email"])
        if user.is_active:
            return Response(
                "You have already accepted the invitation", status=HTTP_400_BAD_REQUEST
            )
        user.set_password(serializer.validated_data["new_password"])
        user.is_active = True
        user.save()
        return Response("Successfully accepted", status=HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        # TODO: make transaction
        request.data.update(
            {
                "company": request.user.company.id,
                "user": {
                    **request.data["user"],
                    "password": make_password(BaseUserManager().make_random_password()),
                    "is_active": False,
                },
            }
        )
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        manager = serializer.save()
        hash_str = manager.user.email + SECRET_KEY
        email_hash = hashlib.sha256(hash_str.encode()).hexdigest()
        send_user_email.delay(
            manager.user.email,
            f"Invite in company {manager.company.title}",
            render_to_string(
                "create_manager.html",
                {
                    "link": f"{BASE_FRONTEND_URL}/register_manager/"
                    f"?{urlencode(OrderedDict(token=email_hash, email=manager.user.email))}",
                    "name": manager.user.name,
                },
            ),
        )
        return Response("Invite mail sent", status=HTTP_200_OK)
