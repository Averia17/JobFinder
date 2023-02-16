from django.db import models

from core.models import BaseModel
from django.utils.translation import gettext_lazy as _


class Company(BaseModel):
    title = models.CharField(_("Title"), max_length=256, blank=False)
    address = models.CharField(_("Address"), max_length=256, null=True, blank=True)
    description = models.CharField(
        _("Description"), max_length=1024, null=True, blank=True
    )

    class Meta:
        app_label = "companies"
        verbose_name_plural = "Companies"

    def __str__(self):
        return f"{self.pk}: {self.title}"


class CompanyManager(models.Model):
    user = models.OneToOneField("users.User", on_delete=models.CASCADE, primary_key=True)
    company = models.ForeignKey(
        Company, related_name="managers", on_delete=models.CASCADE
    )
    is_general = models.BooleanField(_("Is general"), default=False)

    def __str__(self):
        return f"{self.pk}: {self.user.email}, {self.company.title}"