from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User


class UserRegisterSerializer(ModelSerializer):
    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(min_length=8)
    name = serializers.CharField(max_length=256, required=False)
    is_active = serializers.BooleanField(default=True, required=False)

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data.pop("email"),
            validated_data.pop("password"),
            **validated_data,
        )
        return user

    class Meta:
        model = User
        fields = ("id", "email", "password", "name", "is_active")


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "phone", "name")
        read_only_fields = ("email",)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["user_id"] = user.id
        if user.is_manager:
            token["company"] = user.companymanager.company.id
            token["is_director"] = hasattr(user, "company")

        return token
