from rest_framework.serializers import ModelSerializer

from resumes.models import Resume


class ResumeSerializer(ModelSerializer):
    class Meta:
        model = Resume
        fields = ("id", "title", "city", "position", "experience", "salary")


class ResumeDetailSerializer(ResumeSerializer):
    class Meta(ResumeSerializer.Meta):
        fields = ResumeSerializer.Meta.fields + (
            "description",
            "education",
            "languages",
            "skills",
        )
