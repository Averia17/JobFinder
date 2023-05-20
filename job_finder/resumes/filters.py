from django_filters import rest_framework as filters

from resumes.models import Resume


class ResumeFilter(filters.FilterSet):
    class Meta:
        model = Resume
        # TODO: add more fields
        fields = ["city", "experience", "salary"]
