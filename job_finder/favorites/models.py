from django.db import models

from core.models import BaseModel


class FavoriteVacancies(BaseModel):
    user = models.ForeignKey(
        "users.User",
        related_name="favorite_vacancies",
        on_delete=models.CASCADE,
    )
    vacancy = models.ForeignKey(
        "vacancies.Vacancy",
        related_name="favorite_vacancies",
        on_delete=models.CASCADE,
    )

    class Meta:
        app_label = "favorites"

    def __str__(self):
        return f"{self.pk}: {self.user}"


class FavoriteResumes(BaseModel):
    user = models.ForeignKey(
        "users.User",
        related_name="favorite_resumes",
        on_delete=models.CASCADE,
    )
    resume = models.ForeignKey(
        "resumes.Resume",
        related_name="favorite_resumes",
        on_delete=models.CASCADE,
    )

    class Meta:
        app_label = "favorites"

    def __str__(self):
        return f"{self.pk}: {self.user}"
