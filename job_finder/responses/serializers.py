from rest_framework.fields import CurrentUserDefault
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer

from responses.models import VacancyResponse
from users.models import User


class VacancyResponseSerializer(ModelSerializer):
    user = PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=CurrentUserDefault(), write_only=True
    )

    class Meta:
        model = VacancyResponse
        fields = ("id", "user", "vacancy", "status")
