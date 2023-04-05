from django.contrib import admin

from .models import ResumeView


@admin.register(ResumeView)
class ResumeViewAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "resume"]
    readonly_fields = ["created", "updated"]
    fieldsets = [
        (
            None,
            {"fields": ["user", "resume"]},
        ),
        ("System", {"classes": ["collapse"], "fields": ["created", "updated"]}),
    ]
