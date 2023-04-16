from rest_framework.fields import CurrentUserDefault
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer

from resumes.models import Resume
from users.models import User


class ResumeSerializer(ModelSerializer):
    class Meta:
        model = Resume
        fields = ("id", "title", "city", "experience", "salary")


class ResumeDetailSerializer(ResumeSerializer):
    user = PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=CurrentUserDefault(), write_only=True
    )

    class Meta(ResumeSerializer.Meta):
        fields = ResumeSerializer.Meta.fields + (
            "description",
            "education",
            "languages",
            "skills",
            "user",
        )
