# Generated by Django 4.0.5 on 2023-05-02 20:42

import companies.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0007_company_email_company_employees_number_company_phone_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=companies.models.logo_generate_upload_path, verbose_name='Logo'),
        ),
    ]
