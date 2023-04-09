from django.contrib import admin

from .models import FavoriteVacancies


@admin.register(FavoriteVacancies)
class FavoriteVacanciesAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "vacancy"]
    readonly_fields = ["created", "updated"]
    fieldsets = [
        (
            None,
            {"fields": ["user", "vacancy"]},
        ),
        ("System", {"classes": ["collapse"], "fields": ["created", "updated"]}),
    ]
