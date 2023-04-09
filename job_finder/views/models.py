from django.db import models

from core.models import BaseModel


class View(BaseModel):
    class Meta:
        app_label = "views"
        abstract = True

    def __str__(self):
        return f"{self.pk}: {self.user}"


class ResumeView(BaseModel):
    resume = models.ForeignKey(
        "resumes.Resume",
        related_name="views",
        on_delete=models.CASCADE,
    )
    company = models.ForeignKey(
        "companies.Company",
        related_name="views",
        on_delete=models.CASCADE,
    )

    class Meta:
        app_label = "views"

    def __str__(self):
        return f"{self.pk}: {self.company}"


class VacancyView(BaseModel):
    user = models.ForeignKey(
        "users.User",
        related_name="views",
        on_delete=models.CASCADE,
    )
    vacancy = models.ForeignKey(
        "vacancies.Vacancy",
        related_name="views",
        on_delete=models.CASCADE,
    )

    class Meta:
        app_label = "views"

    def __str__(self):
        return f"{self.pk}: {self.user}"
