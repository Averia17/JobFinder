from django.db import models

from core.models import BaseModel
from django.utils.translation import gettext_lazy as _


class View(BaseModel):
    user = models.ForeignKey(
        "users.User",
        related_name="views",
        on_delete=models.CASCADE,
    )

    class Meta:
        app_label = "views"
        verbose_name_plural = "Views"
        abstract = True

    def __str__(self):
        return f"{self.pk}: {self.user}"


class ResumeView(View):
    resume = models.ForeignKey(
        "resumes.Resume",
        related_name="views",
        on_delete=models.CASCADE,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "resume"], name="uq_user_resume")
        ]


class VacancyView(View):
    vacancy = models.ForeignKey(
        "vacancies.Vacancy",
        related_name="views",
        on_delete=models.CASCADE,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "vacancy"], name="uq_user_vacancy")
        ]
