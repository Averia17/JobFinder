from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils.translation import gettext_lazy as _

from core.models import BaseModel


class Resume(BaseModel):
    title = models.CharField(_("Title"), max_length=256, blank=False)
    user = models.ForeignKey(
        "users.User", related_name="resumes", on_delete=models.CASCADE
    )
    city = models.CharField(_("City"), max_length=64, blank=False)
    position = models.CharField(_("Position"), max_length=64, blank=False)
    description = models.CharField(_("Description"), max_length=1024, blank=False)
    experience = models.CharField(_("Experience"), max_length=256, null=True, blank=True)
    education = models.CharField(_("Education"), max_length=64, null=True, blank=True)
    salary = models.PositiveSmallIntegerField(_("Salary"), null=True, blank=True)
    languages = models.JSONField(_("Languages"), default=list)
    skills = ArrayField(models.CharField(max_length=16))

    class Meta:
        app_label = "responses"
        verbose_name_plural = "VacancyResponses"

    def __str__(self):
        return f"{self.pk}"
