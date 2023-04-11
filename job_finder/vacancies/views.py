from django.db.models import OuterRef, Exists
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.viewsets import ModelViewSet

from companies.permissions import IsManagerOrDirector
from vacancies.filters import VacancyFilter
from vacancies.models import Vacancy
from vacancies.permissions import IsOwnerManagerOrDirector
from vacancies.serializers import VacancyDetailSerializer, VacancySerializer
from views.serializers import VacancyViewSerializer


class VacancyViewSet(ModelViewSet):
    queryset = Vacancy.objects.all().select_related("company")
    serializer_class = VacancySerializer
    serializer_classes = {
        "retrieve": VacancyDetailSerializer,
        "create": VacancyDetailSerializer,
        "update": VacancyDetailSerializer,
        "partial_update": VacancyDetailSerializer,
    }
    search_fields = ["title", "description"]
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filterset_class = VacancyFilter

    permission_to_method = {
        "update": [IsOwnerManagerOrDirector],
        "partial_update": [IsOwnerManagerOrDirector],
        "create": [IsManagerOrDirector],
    }

    def get_permissions(self):
        return [
            permission()
            for permission in self.permission_to_method.get(
                self.action, self.permission_classes
            )
        ]

    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.serializer_class)

    def database_debug(func):
        def inner_func(*args, **kwargs):
            from django.db import connection
            from django.db import reset_queries

            reset_queries()
            res = func(*args, *kwargs)
            query_info = connection.queries
            print("function_name: {}".format(func.__name__))
            print("query_count: {}".format(len(query_info)))
            # queries = ['{}\n'.format(query['sql']) for query in query_info]
            # print('queries: \n{}'.format(''.join(queries)))
            return res

        return inner_func

    @database_debug
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()
        if not user.is_anonymous:
            return queryset.annotate(
                is_responded=Exists(user.responses.filter(vacancy_id=OuterRef("id"))),
                is_favorite=Exists(
                    user.favorite_vacancies.filter(vacancy_id=OuterRef("id"))
                ),
            )
        return queryset

    @action(detail=False, methods=["GET"])
    def favorites(self, request, *args, **kwargs):
        self.queryset = super().get_queryset().filter(
            id__in=request.user.favorite_vacancies.values_list("vacancy", flat=True)
        )
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, pk=None, *args, **kwargs):
        serializer = VacancyViewSerializer(
            data={"vacancy": pk}, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
        return super().retrieve(request, *args, **kwargs)
