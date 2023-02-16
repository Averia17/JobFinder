from rest_framework.serializers import ModelSerializer
from .models import Vacancy


class VacancySerializer(ModelSerializer):
    class Meta:
        model = Vacancy
        fields = ("title", "min_salary", "max_salary", "company", "is_active")


class VacancyDetailSerializer(VacancySerializer):
    class Meta(VacancySerializer.Meta):
        fields = VacancySerializer.Meta.fields + ("description", "experience_option", "employment_type")
