# Generated by Django 4.0.5 on 2023-01-08 11:55

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Company",
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
                    "address",
                    models.CharField(
                        blank=True, max_length=256, null=True, verbose_name="Address"
                    ),
                ),
                (
                    "description",
                    models.CharField(
                        blank=True,
                        max_length=1024,
                        null=True,
                        verbose_name="Description",
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Companies",
            },
        ),
    ]
