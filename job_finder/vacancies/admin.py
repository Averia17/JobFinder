from django.contrib import admin

from vacancies.models import Vacancy


@admin.register(Vacancy)
class VacancyAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "company", "is_active"]
    list_filter = ["is_active"]
    readonly_fields = ["created", "updated"]
    fieldsets = [
        (
            None,
            {
                "fields": [
                    "title",
                    "city",
                    "company",
                    "manager",
                    "is_active",
                    "min_salary",
                    "max_salary",
                    "description",
                    "experience_option",
                    "employment_type",
                ]
            },
        ),
        ("System", {"classes": ["collapse"], "fields": ["created", "updated"]}),
    ]
