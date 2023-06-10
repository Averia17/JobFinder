from django_filters import rest_framework as filters

from resumes.models import Resume


class ResumeFilter(filters.FilterSet):
    experience = filters.NumberFilter(lookup_expr="gte")
    salary = filters.NumberFilter(lookup_expr="lte")

    class Meta:
        model = Resume
        # TODO: add more fields
        fields = ["city", "experience", "salary"]
