from django.core.validators import RegexValidator
from django.db import models

from core.models import BaseModel
from django.utils.translation import gettext_lazy as _


class Company(BaseModel):
    phone_regex = RegexValidator(
        regex=r"^\+?1?\d{9,13}$",
        message="Phone number must be entered in the format: '+375293332211'. Up to 13 digits allowed.",
    )
    title = models.CharField(_("Title"), max_length=256, blank=False)
    address = models.CharField(_("Address"), max_length=256, null=True, blank=True)
    description = models.CharField(
        _("Description"), max_length=1024, null=True, blank=True
    )
    director = models.OneToOneField(
        "users.User",
        on_delete=models.CASCADE,
        primary_key=False,
        related_name="director_company",
    )
    is_active = models.BooleanField(_("Is active"), default=False)
    employees_number = models.PositiveSmallIntegerField(_("Number of employees"), null=True, blank=True)
    email = models.EmailField(_("Email"), unique=True, max_length=256, null=True, blank=False)
    phone = models.CharField(
        _("Phone number"),
        validators=[phone_regex],
        max_length=13,
        null=True,
        blank=True,
    )
    site = models.URLField(max_length=200, null=True, blank=True)

    class Meta:
        app_label = "companies"
        verbose_name_plural = "Companies"

    def __str__(self):
        return f"{self.pk}: {self.title}"


class CompanyManager(models.Model):
    user = models.OneToOneField(
        "users.User", on_delete=models.CASCADE, primary_key=True
    )
    company = models.ForeignKey(
        Company, related_name="managers", on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.pk}: {self.user.email}, {self.company.title}"
