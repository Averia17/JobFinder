# Generated by Django 4.0.5 on 2023-02-18 15:21

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Resume",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created", models.DateTimeField(auto_now_add=True, db_index=True)),
                ("updated", models.DateTimeField(auto_now=True, db_index=True)),
                ("title", models.CharField(max_length=256, verbose_name="Title")),
                ("city", models.CharField(max_length=64, verbose_name="City")),
                ("position", models.CharField(max_length=64, verbose_name="Position")),
                (
                    "description",
                    models.CharField(max_length=1024, verbose_name="Description"),
                ),
                (
                    "experience",
                    models.CharField(
                        blank=True, max_length=256, null=True, verbose_name="Experience"
                    ),
                ),
                (
                    "education",
                    models.CharField(
                        blank=True, max_length=64, null=True, verbose_name="Education"
                    ),
                ),
                (
                    "salary",
                    models.PositiveSmallIntegerField(
                        blank=True, null=True, verbose_name="Salary"
                    ),
                ),
                ("languages", models.JSONField(default=list, verbose_name="Languages")),
                (
                    "skills",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=models.CharField(max_length=16), size=None
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="resumes",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Resumes",
            },
        ),
    ]
