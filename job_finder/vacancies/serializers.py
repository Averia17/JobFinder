from rest_framework.fields import BooleanField
from rest_framework.serializers import ModelSerializer

from .models import Vacancy


class VacancySerializer(ModelSerializer):
    is_responded = BooleanField(required=False, read_only=True)

    class Meta:
        model = Vacancy
        fields = (
            "id",
            "title",
            "min_salary",
            "max_salary",
            "company",
            "is_active",
            "is_responded",
        )

    def to_representation(self, instance):
        result = super().to_representation(instance)
        result["company"] = {"id": instance.company.id, "title": instance.company.title}
        return result


class VacancyDetailSerializer(VacancySerializer):
    class Meta(VacancySerializer.Meta):
        fields = VacancySerializer.Meta.fields + (
            "description",
            "experience_option",
            "employment_type",
        )
