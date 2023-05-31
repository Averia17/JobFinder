from django.contrib import admin

from users.models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["email", "is_staff", "is_active", "last_login", "is_manager"]
    list_filter = ["last_login", "is_staff"]
    search_fields = ["email"]
    readonly_fields = ["is_staff", "last_login", "created", "updated"]
    fieldsets = [
        (
            None,
            {
                "fields": [
                    "email",
                    "name",
                    "is_active",
                    "is_staff",
                    "last_login",
                ]
            },
        ),
        ("System", {"classes": ["collapse"], "fields": ["created", "updated"]}),
    ]
