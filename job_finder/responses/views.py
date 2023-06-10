from rest_framework import status, mixins
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from companies.permissions import IsManagerOrDirector
from response_messages.serializers import MessageSerializer
from responses.models import VacancyResponse
from responses.serializers import VacancyResponseSerializer
from responses.services import VacancyResponseService


def database_debug(func):
    def inner_func(*args, **kwargs):
        from django.db import connection
        from django.db import reset_queries
        reset_queries()
        res = func(*args, *kwargs)
        query_info = connection.queries
        print('function_name: {}'.format(func.__name__))
        print('query_count: {}'.format(len(query_info)))
        # queries = ['{}\n'.format(query['sql']) for query in query_info]
        # print('queries: \n{}'.format(''.join(queries)))
        return res

    return inner_func


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
        filter_params = {"user": self.request.user}
        if self.request.user.is_manager:
            filter_params = {"vacancy__in": self.request.user.companymanager.vacancies.all()}
        if self.request.user.is_director:
            filter_params = {"vacancy__in": self.request.user.company.vacancies.all()}
        return super().get_queryset().filter(**filter_params)

    @action(detail=True, methods=["GET", "POST"], serializer_class=MessageSerializer)
    def messages(self, request, pk=None):
        vacancy_response = self.get_object()
        service = VacancyResponseService(vacancy_response)
        if request.method == "POST":
            request.data.update({"vacancy_response": pk, "user": request.user.id})
            message = service.create_message(request.data)
            return Response(
                self.serializer_class(message).data,
                status=status.HTTP_201_CREATED,
            )
        service.set_messages_viewed_status(self.request.user)
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
        service = VacancyResponseService(vacancy_response)
        service.update_status(request.data.get("status"))
        serializer = self.get_serializer(vacancy_response)
        return Response(serializer.data)
