# Generated by Django 4.0.5 on 2023-03-28 11:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("companies", "0003_company_director"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="companymanager",
            name="is_general",
        ),
    ]