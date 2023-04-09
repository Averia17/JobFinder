from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.core.validators import RegexValidator
from django.db import models
from django.utils.translation import gettext_lazy as _


from core.models import BaseModel


class UserManager(BaseUserManager):
    def create_user(self, email, password, **kwargs):
        if not email:
            raise ValueError("The email must be set")
        if not password:
            raise ValueError("The password must be set")

        user = self.model(
            email=self.normalize_email(email),
            **kwargs,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        user = self.create_user(
            email,
            password=password,
        )
        user.is_staff = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, BaseModel):
    phone_regex = RegexValidator(
        regex=r"^\+?1?\d{9,13}$",
        message="Phone number must be entered in the format: '+375293332211'. Up to 13 digits allowed.",
    )

    email = models.EmailField(_("Email"), unique=True, max_length=256, blank=False)
    phone = models.CharField(
        _("Phone number"),
        validators=[phone_regex],
        max_length=13,
        null=True,
        blank=True,
    )
    name = models.CharField(_("Full name"), max_length=256, null=True, blank=True)
    is_staff = models.BooleanField(_("Is staff"), default=False)
    is_active = models.BooleanField(_("Is active"), default=True)
    objects = UserManager()

    USERNAME_FIELD = "email"

    class Meta:
        app_label = "users"
        verbose_name_plural = "Users"

    def __str__(self):
        return f"{self.pk}: {self.email}"

    def has_module_perms(self, app_label):
        return self.is_staff and self.is_active

    def has_perm(self, perm_list, obj=None):
        return self.is_staff and self.is_active

    @property
    def is_manager(self):
        return hasattr(self, "companymanager")

    @property
    def is_director(self):
        return hasattr(self, "director_company")

    @property
    def company(self):
        if self.is_authenticated:
            if self.is_director:
                return self.director_company
            elif self.is_manager:
                return self.companymanager.company
