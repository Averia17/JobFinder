# Generated by Django 4.0.5 on 2023-02-18 16:10

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("resumes", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="resume",
            name="city",
            field=models.CharField(max_length=64, null=True, verbose_name="City"),
        ),
        migrations.AlterField(
            model_name="resume",
            name="description",
            field=models.CharField(
                max_length=1024, null=True, verbose_name="Description"
            ),
        ),
        migrations.AlterField(
            model_name="resume",
            name="languages",
            field=models.JSONField(default=list, null=True, verbose_name="Languages"),
        ),
        migrations.AlterField(
            model_name="resume",
            name="position",
            field=models.CharField(max_length=64, null=True, verbose_name="Position"),
        ),
        migrations.AlterField(
            model_name="resume",
            name="skills",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(max_length=16), null=True, size=None
            ),
        ),
    ]
