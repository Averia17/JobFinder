from rest_framework.mixins import RetrieveModelMixin, CreateModelMixin, UpdateModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet

from companies.models import Company
from companies.serializers import CompanySerializer
from users.models import CompanyManager


class CompanyViewSet(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        company = serializer.save()
        CompanyManager.objects.create(company=company, is_general=True, user=self.request.user)
