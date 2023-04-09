from rest_framework.fields import BooleanField, CharField
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer

from companies.models import CompanyManager
from responses.serializers import VacancyResponseReadSerializer
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
    manager = PrimaryKeyRelatedField(
        queryset=CompanyManager.objects.all(), write_only=True
    )

    class Meta(VacancySerializer.Meta):
        fields = VacancySerializer.Meta.fields + (
            "description",
            "experience_option",
            "employment_type",
            "manager",
        )

    def to_internal_value(self, data):
        user = self.context["request"].user
        manager = user.companymanager if user.is_manager else data["manager"]
        data.update({"company": user.company.id, "manager": manager})
        return super().to_internal_value(data)

    def to_representation(self, instance):
        self.fields["employment_type"] = CharField(source="get_employment_type_display")
        res = super().to_representation(instance)
        user = self.context["request"].user
        if user.is_authenticated and (
            (user.is_manager and instance.manager.user == user)
            or (instance.company.director == user)
        ):
            res["responses"] = VacancyResponseReadSerializer(
                instance.responses.all(), many=True
            ).data
            res["views"] = instance.views.all().values(
                "id", "user__id", "user__name", "user__email"
            )
        return res
