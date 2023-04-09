from rest_framework.fields import CurrentUserDefault
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer
from rest_framework.validators import UniqueTogetherValidator

from users.models import User
from .models import ResumeView, VacancyView


class ResumeViewSerializer(ModelSerializer):
    class Meta:
        model = ResumeView
        fields = ("id", "company", "resume")


class VacancyViewSerializer(ModelSerializer):
    user = PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=CurrentUserDefault()
    )

    class Meta:
        model = VacancyView
        fields = ("id", "user", "vacancy")
