from django.contrib import admin

from .models import ResumeView, VacancyView


@admin.register(ResumeView)
class ResumeViewAdmin(admin.ModelAdmin):
    list_display = ["id", "company", "resume"]
    readonly_fields = ["created", "updated"]
    fieldsets = [
        (
            None,
            {"fields": ["company", "resume"]},
        ),
        ("System", {"classes": ["collapse"], "fields": ["created", "updated"]}),
    ]


@admin.register(VacancyView)
class VacancyViewAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "vacancy"]
    readonly_fields = ["created", "updated"]
    fieldsets = [
        (
            None,
            {"fields": ["user", "vacancy"]},
        ),
        ("System", {"classes": ["collapse"], "fields": ["created", "updated"]}),
    ]
