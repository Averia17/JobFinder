from rest_framework.fields import BooleanField
from rest_framework.serializers import ModelSerializer
from .models import Vacancy


class VacancySerializer(ModelSerializer):
    is_responded = BooleanField(required=False)

    class Meta:
        model = Vacancy
        fields = ("id", "title", "min_salary", "max_salary", "company", "is_active", "is_responded")


class VacancyDetailSerializer(VacancySerializer):
    class Meta(VacancySerializer.Meta):
        fields = VacancySerializer.Meta.fields + (
            "description",
            "experience_option",
            "employment_type",
        )
