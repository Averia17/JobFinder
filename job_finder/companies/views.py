import hashlib
from collections import OrderedDict
from urllib.parse import urlencode

from django.db import transaction
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from rest_framework.decorators import action
from rest_framework.mixins import (
    RetrieveModelMixin,
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
)

from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_200_OK
from rest_framework.viewsets import GenericViewSet

from companies.models import Company, CompanyManager
from companies.permissions import IsDirector, UserInCompany, CompanyIsActive
from companies.serializers import (
    CompanySerializer,
    PasswordSerializer,
    CompanyManagerCreateSerializer,
    CompanyManagerSerializer, CompanyPrivateSerializer,
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
    # TODO: make title read only
    permission_to_method = {
        "update": [IsDirector, CompanyIsActive],
        "partial_update": [IsDirector, CompanyIsActive],
        "my": [UserInCompany],
    }

    def get_permissions(self):
        return [
            permission()
            for permission in self.permission_to_method.get(
                self.action, self.permission_classes
            )
        ]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update", "my"]:
            self.serializer_class = CompanyPrivateSerializer
        return self.serializer_class

    @transaction.atomic
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
        company = serializer.save()
        CompanyManager.objects.create(user=director, company=company)
        return Response(serializer.data, status=HTTP_201_CREATED)

    @action(detail=False, methods=["GET"])
    def my(self, request):
        resume = get_object_or_404(Company, id=request.user.company.id)
        serializer = self.get_serializer(resume)
        return Response(serializer.data)


class CompanyManagerViewSet(
    CreateModelMixin, DestroyModelMixin, ListModelMixin, GenericViewSet
):
    queryset = CompanyManager.objects.all()
    permission_classes = [IsDirector, CompanyIsActive]
    serializer_class = CompanyManagerSerializer
    serializer_classes = {
        "create": CompanyManagerCreateSerializer,
    }

    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.serializer_class)

    def get_queryset(self):
        return super().get_queryset().filter(company=self.request.user.company)

    @action(
        detail=False,
        methods=["POST"],
        serializer_class=PasswordSerializer,
        permission_classes=[],
    )
    def accept_invite(self, request):
        serializer = self.get_serializer(data=request.data)
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
