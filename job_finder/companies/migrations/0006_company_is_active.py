# Generated by Django 4.0.5 on 2023-04-15 11:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("companies", "0005_alter_company_director"),
    ]

    operations = [
        migrations.AddField(
            model_name="company",
            name="is_active",
            field=models.BooleanField(default=False, verbose_name="Is active"),
        ),
    ]
