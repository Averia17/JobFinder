from django.db import models
from django.utils.translation import gettext_lazy as _

from core.models import BaseModel


class VacancyResponse(BaseModel):
    viewed = "VIEWED"
    not_viewed = "NOT_VIEWED"
    reject = "REJECT"
    VACANCY_RESPONSE_STATUS = (
        (reject, "Reject"),
        ("INVITE", "Invite"),
        (viewed, "Viewed"),
        (not_viewed, "Not Viewed"),
    )
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
        ordering = ["-created"]

    def __str__(self):
        return f"{self.pk}"
