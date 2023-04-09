from rest_framework.fields import CurrentUserDefault
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer

from users.models import User
from vacancies.serializers import VacancySerializer
from .models import FavoriteVacancies


class FavoriteVacanciesSerializer(ModelSerializer):
    user = PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=CurrentUserDefault(), write_only=True
    )

    class Meta:
        model = FavoriteVacancies
        fields = ("id", "user", "vacancy")

    def to_representation(self, instance):
        res = super().to_representation(instance)
        res["vacancy"] = VacancySerializer(instance.vacancy).data
        return res
