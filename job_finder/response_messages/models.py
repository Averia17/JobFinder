from django.db import models
from django.utils.translation import gettext_lazy as _

from core.models import BaseModel


class Message(BaseModel):
    text = models.CharField(_("Message text"), max_length=1024)
    user = models.ForeignKey(
        "users.User", related_name="messages", on_delete=models.CASCADE
    )
    vacancy_response = models.ForeignKey(
        "responses.VacancyResponse", related_name="messages", on_delete=models.CASCADE
    )
    is_viewed = models.BooleanField(default=False)

    class Meta:
        app_label = "response_messages"
        verbose_name_plural = "Messages"
        ordering = ["created"]

    def __str__(self):
        return f"{self.pk} {self.user}"
