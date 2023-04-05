from rest_framework.fields import CurrentUserDefault
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer

from users.models import User
from .models import ResumeView


class ResumeViewSerializer(ModelSerializer):
    user = PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=CurrentUserDefault()
    )

    class Meta:
        model = ResumeView
        fields = ("id", "user", "resume")


class VacancyViewSerializer(ModelSerializer):
    user = PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=CurrentUserDefault()
    )

    class Meta:
        model = ResumeView
        fields = ("id", "user", "vacancy")
