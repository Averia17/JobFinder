from rest_framework.fields import CurrentUserDefault, DateTimeField, CharField
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer

from responses.models import VacancyResponse
from users.models import User


class VacancyResponseSerializer(ModelSerializer):
    user = PrimaryKeyRelatedField(queryset=User.objects.all(), default=CurrentUserDefault())
    created = DateTimeField(read_only=True)

    class Meta:
        model = VacancyResponse
        fields = ("id", "user", "status", "created", "vacancy")

    def to_representation(self, instance):
        self.fields["status"] = CharField(source="get_status_display")
        res = super().to_representation(instance)
        user = instance.user
        vacancy = instance.vacancy
        res["user"] = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "resume": user.resume.id if hasattr(user, "resume") else None,
        }
        res["count_new_messages"] = instance.messages.filter(
            is_viewed=False).exclude(user=self.context["request"].user).count()
        res["vacancy"] = {
            "id": vacancy.id,
            "title": vacancy.title,
            "company": vacancy.company.title,
        }
        return res
