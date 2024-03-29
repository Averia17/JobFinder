# Generated by Django 4.0.5 on 2023-05-28 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('responses', '0004_alter_vacancyresponse_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vacancyresponse',
            name='status',
            field=models.CharField(choices=[('REJECT', 'Отказ'), ('INVITE', 'Приглашение'), ('VIEWED', 'Просмотрено'), ('NOT_VIEWED', 'Не просмотрено')], default='NOT_VIEWED', max_length=10, verbose_name='Status'),
        ),
    ]
