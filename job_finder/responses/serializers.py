from rest_framework.serializers import ModelSerializer

from responses.models import VacancyResponse


class VacancyResponseSerializer(ModelSerializer):
    class Meta:
        model = VacancyResponse
        fields = ("user", "vacancy", "status")
