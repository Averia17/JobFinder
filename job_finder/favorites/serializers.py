from rest_framework.fields import CurrentUserDefault
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer

from resumes.serializers import ResumeSerializer
from users.models import User
from vacancies.serializers import VacancySerializer
from .models import FavoriteVacancies, FavoriteResumes


class FavoriteVacanciesSerializer(ModelSerializer):
    user = PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=CurrentUserDefault(), write_only=True
    )

    class Meta:
        model = FavoriteVacancies
        fields = ("id", "user", "vacancy")


class FavoriteResumesSerializer(ModelSerializer):
    user = PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=CurrentUserDefault(), write_only=True
    )

    class Meta:
        model = FavoriteResumes
        fields = ("id", "user", "resume")
