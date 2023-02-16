from rest_framework.serializers import ModelSerializer

from companies.models import Company


class CompanySerializer(ModelSerializer):
    class Meta:
        model = Company
        fields = ("title", "address", "description")
