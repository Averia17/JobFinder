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
        res["user"] = {"id": instance.user.id, "name": instance.user.name}
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
        res["vacancy"] = {"id": instance.vacancy.id, "title": instance.vacancy.title}
        return res
