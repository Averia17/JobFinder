from django.contrib import admin

from responses.models import VacancyResponse


@admin.register(VacancyResponse)
class VacancyResponseAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "vacancy"]
    readonly_fields = ["created", "updated"]
    fieldsets = [
        (
            None,
            {"fields": ["user", "vacancy", "status"]},
        ),
        ("System", {"classes": ["collapse"], "fields": ["created", "updated"]}),
    ]
