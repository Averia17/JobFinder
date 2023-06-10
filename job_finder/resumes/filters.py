from django_filters import rest_framework as filters

from resumes.models import Resume


class CharInFilter(filters.BaseInFilter, filters.CharFilter):
    pass


class ResumeFilter(filters.FilterSet):
    experience = filters.NumberFilter(lookup_expr="gte")
    salary = filters.NumberFilter(lookup_expr="lte")
    skills = CharInFilter(lookup_expr="contains")

    class Meta:
        model = Resume
        fields = ["city", "experience", "salary", "skills", "position"]
