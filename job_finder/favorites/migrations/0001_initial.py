# Generated by Django 4.0.5 on 2023-04-09 20:33

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("vacancies", "0003_alter_vacancy_manager"),
    ]

    operations = [
        migrations.CreateModel(
            name="FavoriteVacancies",
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
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="favorite_vacancies",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "vacancy",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="favorite_vacancies",
                        to="vacancies.vacancy",
                    ),
                ),
            ],
        ),
    ]
