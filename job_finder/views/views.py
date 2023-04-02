from rest_framework.viewsets import ModelViewSet

from views.models import ResumeView
from views.serializers import ResumeViewSerializer


class ResumeViewViewSet(ModelViewSet):
    queryset = ResumeView.objects.all()
    serializer_class = ResumeViewSerializer
