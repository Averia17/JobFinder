from django_filters import rest_framework as filters

from vacancies.models import Vacancy


class VacancyFilter(filters.FilterSet):
    min_salary = filters.NumberFilter(field_name='min_salary', lookup_expr='lte')
    max_salary = filters.NumberFilter(field_name='max_salary', lookup_expr='gte')

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
