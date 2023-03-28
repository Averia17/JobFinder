from django.contrib import admin

from response_messages.models import Message


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ["id", "vacancy_response", "user", "created"]
    readonly_fields = ["created", "updated"]
    fieldsets = [
        (
            None,
            {"fields": ["user", "text", "vacancy_response"]},
        ),
        ("System", {"classes": ["collapse"], "fields": ["created", "updated"]}),
    ]
