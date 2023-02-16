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
