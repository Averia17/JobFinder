from django.db.models import Count
from rest_framework.fields import CurrentUserDefault, BooleanField, CharField, ListField
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer

from resumes.models import Resume
from users.models import User


class ResumeSerializer(ModelSerializer):
    is_favorite = BooleanField(required=False, read_only=True)

    class Meta:
        model = Resume
        fields = ("id", "title", "city", "experience", "salary", "is_favorite")

    def to_representation(self, instance):
        res = super().to_representation(instance)
        res["user"] = {
            "id": instance.user.id,
            "name": instance.user.name,
            "email": instance.user.email,
        }
        return res


class ResumeDetailSerializer(ResumeSerializer):
    user = PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=CurrentUserDefault(), write_only=True
    )
    # skills = ListField(child=CharField(), required=False)

    class Meta(ResumeSerializer.Meta):
        fields = ResumeSerializer.Meta.fields + (
            "description",
            "education",
            "languages",
            "skills",
            "user",
            "file",
            "image"
        )

    def create(self, validated_data):
        skills = validated_data.pop("skills", [])
        # form data return list with one element
        if isinstance(skills, list) and len(skills) == 1:
            validated_data["skills"] = skills[0].strip(',').split(',')
        return super().create(validated_data)

    def to_representation(self, instance):
        res = super().to_representation(instance)
        user = self.context["request"].user
        if user.is_authenticated and instance.user == user:
            # resume_views = instance.views.order_by("-created__date")
            # chart_data = resume_views.values("created__date").annotate(count=Count("created__date"))
            # results = resume_views.values(
            #     "company__id", "company__title", "created__date").annotate(count=Count("company__id"))
            # res.update({"views": {"chart_data": chart_data, "results": results}})
            res["views"] = instance.views.values(
                "company__id", "company__title"
            ).annotate(count=Count("company__id"))
        return res
