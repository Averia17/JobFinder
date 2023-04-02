import hashlib

from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer

from companies.models import Company, CompanyManager
from job_finder.settings import SECRET_KEY
from users.serializers import UserRegisterSerializer
from vacancies.serializers import VacancySerializer


class CompanySerializer(ModelSerializer):
    vacancies = SerializerMethodField()

    class Meta:
        model = Company
        fields = ("id", "title", "address", "description", "director", "vacancies")

    def get_vacancies(self, obj):
        vacancies = obj.vacancies.all().select_related("company")
        if "request" in self.context:
            request = self.context["request"]
            if request.user.is_manager:
                vacancies = request.user.companymanager.vacancies.all().select_related(
                    "company"
                )
        return VacancySerializer(vacancies, many=True).data


class CompanyManagerSerializer(ModelSerializer):
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


class PasswordSerializer(serializers.Serializer):
    email = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8)

    def validate(self, data):
        hash_str = data["email"] + SECRET_KEY
        if data["token"] != hashlib.sha256(hash_str.encode()).hexdigest():
            raise serializers.ValidationError({"token": "token is not valid"})
        return data
