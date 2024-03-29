from rest_framework.exceptions import ValidationError
from rest_framework.fields import CurrentUserDefault, DateTimeField, CharField
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer

from response_messages.models import Message
from responses.models import VacancyResponse
from users.models import User


class MessageSerializer(ModelSerializer):
    user = PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=CurrentUserDefault()
    )
    vacancy_response = PrimaryKeyRelatedField(
        queryset=VacancyResponse.objects.all(), write_only=True
    )
    created = DateTimeField(read_only=True)

    class Meta:
        model = Message
        fields = ("id", "user", "text", "vacancy_response", "created", "is_viewed")

    def validate(self, attrs):
        if attrs["vacancy_response"].status == VacancyResponse.reject:
            raise ValidationError({"error": "Вы не можете отправлять сообщения после отказа"})
        return attrs

    def to_representation(self, instance):
        result = super().to_representation(instance)
        result["user"] = {"id": instance.user.id, "name": instance.user.name}
        return result
