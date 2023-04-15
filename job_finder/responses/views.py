from rest_framework import status, mixins
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from companies.permissions import IsManagerOrDirector
from response_messages.serializers import MessageSerializer
from responses.models import VacancyResponse
from responses.serializers import VacancyResponseSerializer
from responses.services import ResponseMessagesService


class VacancyResponseViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    queryset = VacancyResponse.objects.all().select_related("vacancy")
    serializer_class = VacancyResponseSerializer
    permission_classes = [IsAuthenticated]
    permission_to_method = {
        "update": [IsManagerOrDirector],
        "partial_update": [IsManagerOrDirector],
        "retrieve": [IsManagerOrDirector],
    }

    def get_permissions(self):
        return [
            permission()
            for permission in self.permission_to_method.get(
                self.action, self.permission_classes
            )
        ]

    def get_queryset(self):
        # TODO: try to do more elegant
        queryset = super().get_queryset()
        if self.request.user.is_director:
            return queryset.filter(
                vacancy__in=self.request.user.company.vacancies.all()
            )
        elif self.request.user.is_manager:
            return queryset.filter(
                vacancy__in=self.request.user.companymanager.vacancies.all()
            )
        return queryset.filter(user=self.request.user)

    @action(detail=True, methods=["GET", "POST"], serializer_class=MessageSerializer)
    def messages(self, request, pk=None):
        vacancy_response = self.get_object()
        service = ResponseMessagesService(vacancy_response)
        if request.method == "POST":
            request.data.update({"vacancy_response": pk, "user": request.user.id})
            message = service.create_message(request.data)
            return Response(
                self.serializer_class(message).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(
            self.serializer_class(vacancy_response.messages.all(), many=True).data
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if (
            request.user != instance.user
            and instance.status == VacancyResponse.not_viewed
        ):
            instance.status = VacancyResponse.viewed
            instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        vacancy_response = self.get_object()
        vacancy_response.status = request.data.get("status")
        vacancy_response.save()
        serializer = self.get_serializer(vacancy_response)
        return Response(serializer.data)
