# Generated by Django 4.0.5 on 2023-04-15 14:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("vacancies", "0003_alter_vacancy_manager"),
    ]

    operations = [
        migrations.AlterField(
            model_name="vacancy",
            name="description",
            field=models.TextField(
                blank=True, max_length=2048, null=True, verbose_name="Description"
            ),
        ),
    ]
