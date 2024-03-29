# Generated by Django 4.0.5 on 2023-04-20 18:16

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("resumes", "0005_resume_file"),
    ]

    operations = [
        migrations.AlterField(
            model_name="resume",
            name="languages",
            field=models.JSONField(
                blank=True, default=dict, null=True, verbose_name="Languages"
            ),
        ),
        migrations.AlterField(
            model_name="resume",
            name="skills",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(max_length=16),
                blank=True,
                null=True,
                size=None,
            ),
        ),
    ]
