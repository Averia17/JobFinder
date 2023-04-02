from rest_framework.fields import BooleanField
from rest_framework.serializers import ModelSerializer

from responses.serializers import VacancyResponseSerializer, VacancyResponseReadSerializer
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

    def to_representation(self, instance):
        res = super().to_representation(instance)
        user = self.context["request"].user
        if (user.is_manager and instance.manager.user == user) or (
                user.is_director and instance.company == user.company):
            res["responses"] = VacancyResponseReadSerializer(instance.responses.all(), many=True).data
        return res
