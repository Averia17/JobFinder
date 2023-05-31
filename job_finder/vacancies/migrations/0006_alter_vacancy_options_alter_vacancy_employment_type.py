# Generated by Django 4.0.5 on 2023-05-21 14:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vacancies', '0005_vacancy_city'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='vacancy',
            options={'ordering': ['-updated'], 'verbose_name_plural': 'Vacancies'},
        ),
        migrations.AlterField(
            model_name='vacancy',
            name='employment_type',
            field=models.CharField(choices=[('INTERNSHIP', 'Стажировка'), ('PART-TIME', 'Частичная занятость'), ('FULL-TIME', 'Полная занятость')], default='FULL-TIME', max_length=10, verbose_name='Employment type'),
        ),
    ]