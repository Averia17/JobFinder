import mimetypes

from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ValidationError

from core.constants import FILE_MAX_SIZE
from core.models import BaseModel


def cv_generate_upload_path(instance, filename):
    return f"resumes/{instance.user.id}/{filename}"


def avatar_generate_upload_path(instance, filename):
    return f"avatars/{instance.user.id}/{filename}"


class FileManager(models.QuerySet):
    def delete(self):
        for obj in self:
            obj.file and obj.file.delete()
        return super().delete()


class Resume(BaseModel):
    title = models.CharField(_("Title"), max_length=256, blank=False)
    user = models.OneToOneField(
        "users.User", on_delete=models.CASCADE, primary_key=False, related_name="resume"
    )
    city = models.CharField(_("City"), max_length=64)
    position = models.CharField(_("Position"), max_length=64, null=True, blank=True)
    description = models.CharField(
        _("Description"), max_length=1024, null=True, blank=True
    )
    experience = models.DecimalField(
        _("Experience years"), max_digits=3, decimal_places=1, default=0
    )
    education = models.CharField(_("Education"), max_length=64, null=True, blank=True)
    salary = models.PositiveSmallIntegerField(_("Salary"), null=True, blank=True)
    languages = models.JSONField(_("Languages"), default=dict, null=True, blank=True)
    skills = ArrayField(models.CharField(max_length=256), null=True, blank=True)
    file = models.FileField(
        _("CV"), upload_to=cv_generate_upload_path, null=True, blank=True
    )
    image = models.ImageField(_("Avatar"), upload_to=avatar_generate_upload_path, null=True, blank=True)
    is_active = models.BooleanField(_("Is active"), default=True)

    objects = FileManager.as_manager()

    class Meta:
        app_label = "resumes"
        verbose_name_plural = "Resumes"
        ordering = ["-updated"]

    def __str__(self):
        return f"{self.pk}"

    def clean(self):
        if self.file:

            def bytes_to_mib(value: int) -> float:
                # 1 bytes = 9.5367431640625E-7 mebibytes
                return value * 9.5367431640625e-7

            guessed_file_type, encoding = mimetypes.guess_type(self.file.name)
            file_type = guessed_file_type or ""
            if file_type != "application/pdf":
                raise ValidationError(
                    f"Некорректный тип файла '{file_type}' (доступен только pdf)"
                )
            if self.file.size > FILE_MAX_SIZE:
                raise ValidationError(
                    f"Файл слишком большой, максимальный размер {bytes_to_mib(FILE_MAX_SIZE)} MB"
                )
        # TODO: check related exists
        # if not self.pk and hasattr(self.user, "resume"):
        #     raise ValidationError("You already have resume")

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        self.full_clean()
        return super().save(force_insert, force_update, using, update_fields)

    def delete(self, using=None, keep_parents=False):
        self.file and self.file.delete()
        return super().delete(using, keep_parents)
