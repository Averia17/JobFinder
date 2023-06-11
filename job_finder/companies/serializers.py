import hashlib

from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.hashers import make_password
from django.db.models import Exists, Q, Count
from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer

from companies.models import Company, CompanyManager
from job_finder.settings import SECRET_KEY
from responses.models import VacancyResponse
from users.serializers import UserRegisterSerializer, UserSerializer
from vacancies.serializers import CompanyVacancySerializer


class CompanySerializer(ModelSerializer):
    class Meta:
        model = Company
        exclude = ("director", )


class CompanyDetailSerializer(ModelSerializer):
    vacancies = SerializerMethodField()

    class Meta:
        model = Company
        fields = "__all__"

    def get_vacancies(self, obj):
        vacancies = obj.vacancies
        user = self.context["request"].user
        if user and user.is_authenticated and user.is_manager:
            vacancies = user.companymanager.vacancies
        vacancies = vacancies.annotate(
            count_new_responses=Count(
                "responses", filter=Q(responses__status=VacancyResponse.not_viewed)
            )
        )
        return CompanyVacancySerializer(vacancies, many=True).data


class CompanyManagerCreateSerializer(ModelSerializer):
    user = UserRegisterSerializer(write_only=True)

    class Meta:
        model = CompanyManager
        fields = ("company", "user")

    def to_internal_value(self, data):
        data.update(
            {
                "company": self.context["request"].user.company.id,
                "user": {
                    "email": data.get("email"),
                    "name": data.get("name"),
                    "password": make_password(BaseUserManager().make_random_password()),
                    "is_active": False,
                },
            }
        )
        return super().to_internal_value(data)

    def create(self, validated_data):
        validated_data["user"] = UserRegisterSerializer().create(
            validated_data.pop("user")
        )
        return super().create(validated_data)


class CompanyManagerSerializer(ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = CompanyManager
        fields = ("company", "user")


class PasswordSerializer(serializers.Serializer):
    email = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8)

    def validate(self, data):
        hash_str = data["email"] + SECRET_KEY
        if data["token"] != hashlib.sha256(hash_str.encode()).hexdigest():
            raise serializers.ValidationError({"token": "token is not valid"})
        return data
