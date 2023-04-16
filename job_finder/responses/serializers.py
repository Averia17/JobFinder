from rest_framework.fields import CurrentUserDefault, DateTimeField, CharField
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer

from response_messages.serializers import MessageSerializer
from responses.models import VacancyResponse
from users.models import User


class VacancyResponseReadSerializer(ModelSerializer):
    created = DateTimeField(read_only=True)

    class Meta:
        model = VacancyResponse
        fields = ("id", "user", "status", "created")

    def to_representation(self, instance):
        self.fields["status"] = CharField(source="get_status_display")
        res = super().to_representation(instance)
        user = instance.user
        res["user"] = {"id": user.id, "name": user.name, "email": user.email}
        return res


class VacancyResponseSerializer(VacancyResponseReadSerializer):
    user = PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=CurrentUserDefault(), write_only=True
    )

    class Meta(VacancyResponseReadSerializer.Meta):
        model = VacancyResponse
        fields = VacancyResponseReadSerializer.Meta.fields + ("vacancy",)

    def to_representation(self, instance):
        res = super().to_representation(instance)
        vacancy = instance.vacancy
        res["vacancy"] = {"id": vacancy.id, "title": vacancy.title, "company": vacancy.company.title}
        return res
