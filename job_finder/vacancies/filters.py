from django_filters import rest_framework as filters

from vacancies.models import Vacancy


class VacancyFilter(filters.FilterSet):
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
