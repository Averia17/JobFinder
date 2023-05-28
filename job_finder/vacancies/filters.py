from django.db.models import Q
from django_filters import rest_framework as filters

from vacancies.models import Vacancy


class VacancyFilter(filters.FilterSet):
    salary = filters.NumberFilter(field_name="min_salary", method="salary_between")

    def salary_between(self, queryset, name, value):
        return queryset.filter(Q(min_salary__lte=value) | Q(min_salary=None)
                               & Q(max_salary__gte=value) | Q(max_salary=None)
                               ).exclude(min_salary=None, max_salary=None)

    class Meta:
        model = Vacancy
        fields = [
            "min_salary",
            "max_salary",
            "experience_option",
            "employment_type",
            "is_active",
            "company",
        ]
