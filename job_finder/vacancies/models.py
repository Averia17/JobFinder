from django.core.exceptions import ValidationError
from django.db import models

from core.constants import EXPERIENCE_OPTIONS, EMPLOYMENT_TYPE
from core.models import BaseModel
from django.utils.translation import gettext_lazy as _

from job_finder.settings import EMAIL_HOST_USER


class Vacancy(BaseModel):
    title = models.CharField(_("Title"), max_length=256, blank=False)
    min_salary = models.PositiveIntegerField(_("Min salary"), null=True, blank=True)
    max_salary = models.PositiveIntegerField(_("Max salary"), null=True, blank=True)
    city = models.CharField(_("City"), max_length=64)
    description = models.TextField(
        _("Description"), max_length=2048, null=True, blank=True
    )
    experience_option = models.CharField(
        _("Years of experience"), max_length=4, choices=EXPERIENCE_OPTIONS, default="0"
    )
    employment_type = models.CharField(
        _("Employment type"),
        max_length=10,
        choices=EMPLOYMENT_TYPE,
        default="FULL-TIME",
    )
    is_active = models.BooleanField(_("Is active"), default=True)
    company = models.ForeignKey(
        "companies.Company", related_name="vacancies", on_delete=models.CASCADE
    )
    manager = models.ForeignKey(
        "companies.CompanyManager",
        related_name="vacancies",
        on_delete=models.PROTECT,
    )

    class Meta:
        app_label = "vacancies"
        verbose_name_plural = "Vacancies"
        ordering = ["-updated"]

    def __str__(self):
        return f"{self.pk}: {self.title}"

    def clean(self):
        if self.min_salary and self.max_salary and self.min_salary > self.max_salary:
            raise ValidationError("Минимальная зарплата не может быть больше максимальной")
        if self.manager and not self.company.managers.all().contains(self.manager):
            raise ValidationError("Менеджер должен быть из вашей компании")
        if not self.company.is_active:
            raise ValidationError(
                f"Ваша компания неактивна, напишите {EMAIL_HOST_USER} для проверки"
            )

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        self.full_clean()
        return super().save(force_insert, force_update, using, update_fields)
