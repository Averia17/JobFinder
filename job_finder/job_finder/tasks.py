import logging.config
from datetime import timedelta

from celery import shared_task
from django.core.mail import EmailMessage
from django.utils import timezone

from . import settings

logger = logging.getLogger(__name__)


@shared_task
def send_user_email(user_email, subject, message, file_path=""):
    logger.info("start send email task")
    mail = EmailMessage(subject, message, settings.EMAIL_HOST_USER, [user_email])
    mail.content_subtype = "html"
    if file_path:
        with open(file_path, "r", errors="ignore") as file:
            mail.attach(file.name, file.read(), "application/pdf")
    mail.send()
    logger.info("email sent to %s", user_email)
