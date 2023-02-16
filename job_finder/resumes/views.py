from rest_framework.viewsets import ModelViewSet

from resumes.models import Resume
from resumes.serializers import ResumeSerializer, ResumeDetailSerializer


class ResumeViewSet(ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer

    serializer_classes = {
        "retrieve": ResumeDetailSerializer,
        "create": ResumeDetailSerializer,
        "update": ResumeDetailSerializer,
        "partial_update": ResumeDetailSerializer,
    }

    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.serializer_class)
