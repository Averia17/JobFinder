# Generated by Django 4.0.5 on 2023-01-08 11:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("companies", "0001_initial"),
        ("users", "0003_user_name_companymanager"),
    ]

    operations = [
        migrations.CreateModel(
            name="Vacancy",
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
                (
                    "min_salary",
                    models.PositiveIntegerField(
                        blank=True, null=True, verbose_name="Min salary"
                    ),
                ),
                (
                    "max_salary",
                    models.PositiveIntegerField(
                        blank=True, null=True, verbose_name="Max salary"
                    ),
                ),
                (
                    "description",
                    models.CharField(
                        blank=True,
                        max_length=2048,
                        null=True,
                        verbose_name="Description",
                    ),
                ),
                (
                    "experience_option",
                    models.CharField(
                        choices=[
                            ("0", "0"),
                            ("1-3", "1-3"),
                            ("3-5", "3-5"),
                            ("5+", "5+"),
                        ],
                        default="0",
                        max_length=4,
                        verbose_name="Years of experience",
                    ),
                ),
                (
                    "employment_type",
                    models.CharField(
                        choices=[
                            ("INTERNSHIP", "Internship"),
                            ("PART-TIME", "Part-time"),
                            ("FULL-TIME", "Full-time"),
                        ],
                        default="FULL-TIME",
                        max_length=10,
                        verbose_name="Employment type",
                    ),
                ),
                (
                    "is_active",
                    models.BooleanField(default=True, verbose_name="Is active"),
                ),
                (
                    "company",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="vacancies",
                        to="companies.company",
                    ),
                ),
                (
                    "manager",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="vacancies",
                        to="users.companymanager",
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Vacancies",
            },
        ),
    ]
