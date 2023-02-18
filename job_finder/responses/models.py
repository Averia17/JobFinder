from django.db import models
from django.utils.translation import gettext_lazy as _

from core.constants import VACANCY_RESPONSE_STATUS
from core.models import BaseModel


class VacancyResponse(BaseModel):
    vacancy = models.ForeignKey(
        "vacancies.Vacancy", related_name="responses", on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        "users.User", related_name="responses", on_delete=models.CASCADE
    )
    status = models.CharField(
        _("Status"),
        max_length=10,
        choices=VACANCY_RESPONSE_STATUS,
        default="NOT_VIEWED",
    )

    class Meta:
        app_label = "responses"
        verbose_name_plural = "VacancyResponses"
        constraints = [
            models.UniqueConstraint(fields=["vacancy", "user"], name="uq_vacancy_user")
        ]

    def __str__(self):
        return f"{self.pk}"
