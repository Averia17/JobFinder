import hashlib

from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from companies.models import Company, CompanyManager
from job_finder.settings import SECRET_KEY
from users.serializers import UserRegisterSerializer


class CompanySerializer(ModelSerializer):
    class Meta:
        model = Company
        fields = ("id", "title", "address", "description", "director")


class CompanyManagerSerializer(ModelSerializer):
    user = UserRegisterSerializer(write_only=True)

    class Meta:
        model = CompanyManager
        fields = ("company", "user")

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
