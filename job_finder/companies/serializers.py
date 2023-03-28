from rest_framework.serializers import ModelSerializer

from companies.models import Company, CompanyManager


class CompanySerializer(ModelSerializer):
    class Meta:
        model = Company
        fields = ("id", "title", "address", "description", "director")


class CompanyManagerSerializer(ModelSerializer):
    class Meta:
        model = CompanyManager
        fields = ("id", "company")
