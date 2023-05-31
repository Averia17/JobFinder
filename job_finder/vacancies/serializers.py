from django.db.models import Count
from rest_framework.fields import (
    BooleanField,
    CharField,
    IntegerField,
)
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer

from companies.models import CompanyManager
from responses.serializers import VacancyResponseSerializer
from .models import Vacancy


class VacancySerializer(ModelSerializer):
    is_responded = BooleanField(required=False, read_only=True)
    is_favorite = BooleanField(required=False, read_only=True)

    class Meta:
        model = Vacancy
        fields = (
            "id",
            "title",
            "city",
            "min_salary",
            "max_salary",
            "company",
            "is_active",
            "is_responded",
            "is_favorite",
        )

    def to_representation(self, instance):
        result = super().to_representation(instance)
        company = instance.company
        company_image = company.image.url if company.image else None
        result["company"] = {"id": company.id, "title": company.title, "image": company_image}
        return result


class CompanyVacancySerializer(ModelSerializer):
    count_new_responses = IntegerField(required=False)

    class Meta:
        model = Vacancy
        fields = ("id", "title", "manager", "count_new_responses")

    def to_representation(self, instance):
        res = super().to_representation(instance)
        user = instance.manager.user
        res["manager"] = {"email": user.email, "name": user.name}
        return res


class VacancyDetailSerializer(VacancySerializer):
    manager = PrimaryKeyRelatedField(
        queryset=CompanyManager.objects.all(), write_only=True, required=True
    )

    class Meta(VacancySerializer.Meta):
        fields = VacancySerializer.Meta.fields + (
            "description",
            "experience_option",
            "employment_type",
            "manager",
            "created",
            # "updated",
        )

    def to_internal_value(self, data):
        user = self.context["request"].user
        manager = user.companymanager if user.is_manager else data["manager"]
        data.update({"company": user.company.id, "manager": manager})
        return super().to_internal_value(data)

    def to_representation(self, instance):
        self.fields["employment_type"] = CharField(source="get_employment_type_display")
        self.fields["experience_option"] = CharField(source="get_experience_option_display")
        res = super().to_representation(instance)
        user = self.context["request"].user
        if user.is_authenticated:
            if res.get("is_responded"):
                res["response"] = instance.responses.filter(user=user).first().id
            if (user.is_manager and instance.manager.user == user) or (
                instance.company.director == user
            ):
                res["responses"] = VacancyResponseSerializer(
                    instance.responses.all(), many=True, context=self.context
                ).data
                res["views"] = instance.views.values(
                    "user__id", "user__name", "user__email"
                ).annotate(count=Count("user__id"))
        return res
