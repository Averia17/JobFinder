from collections import defaultdict

from django.db.models import Count
from rest_framework.fields import (
    BooleanField,
    CharField,
    IntegerField,
)
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer

from companies.models import CompanyManager
from responses.models import VacancyResponse
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
        data["company"] = user.company.id
        manager = data.get("manager") if user.is_director else user.companymanager
        if manager:
            data["manager"] = manager
        return super().to_internal_value(data)

    def to_representation(self, instance):
        self.fields["employment_type"] = CharField(source="get_employment_type_display")
        self.fields["experience_option"] = CharField(source="get_experience_option_display")
        res = super().to_representation(instance)
        res["statistics"] = {}
        for status, _ in VacancyResponse.VACANCY_RESPONSE_STATUS:
            res["statistics"][f"count_{status.lower()}_responses"] = instance.responses.filter(status=status).count()
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
                vacancy_views = instance.views.order_by("-created__date")
                chart_data = vacancy_views.values("created__date").annotate(count=Count("created__date"))
                results = vacancy_views.values(
                    "user__id", "user__name", "user__email", "user__resume", "created__date"
                ).exclude(user=user).annotate(count=Count("user__id"))
                grouped_results = defaultdict(list)
                for result in results:
                    grouped_results[str(result.pop("created__date"))].append(result)
                res.update({"views": {"chart_data": chart_data, "results": grouped_results}})
        return res
