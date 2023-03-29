from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import CreateModelMixin, DestroyModelMixin, ListModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from core.constants import RESPONSE_MESSAGE_SUBJECT
from response_messages.serializers import MessageSerializer
from responses.models import VacancyResponse
from responses.serializers import VacancyResponseSerializer
from job_finder.tasks import send_user_email


class VacancyResponseViewSet(
    CreateModelMixin, DestroyModelMixin, ListModelMixin, GenericViewSet
):
    queryset = VacancyResponse.objects.all().select_related("vacancy")
    serializer_class = VacancyResponseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # TODO: general manager must see all vacancy responses
        if self.request.user.is_manager:
            return (
                super()
                .get_queryset()
                .filter(vacancy__in=self.request.user.companymanager.vacancies.all())
            )
        return super().get_queryset().filter(user=self.request.user)

    @action(detail=True, methods=["GET", "POST"], serializer_class=MessageSerializer)
    def messages(self, request, pk=None):
        vacancy_response = self.get_object()
        if request.method == "POST":
            request.data.update({"vacancy_response": pk, "user": request.user.id})
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            message = serializer.save()
            if request.user != vacancy_response.user:
                send_user_email.delay(
                    vacancy_response.user.email, RESPONSE_MESSAGE_SUBJECT, message.text
                )
            return Response(
                self.serializer_class(message).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(
            self.serializer_class(vacancy_response.messages.all(), many=True).data
        )
