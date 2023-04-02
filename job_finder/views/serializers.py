from rest_framework.serializers import ModelSerializer

from .models import ResumeView


class ResumeViewSerializer(ModelSerializer):
    class Meta:
        model = ResumeView
        fields = ("id", "user", "resume")
