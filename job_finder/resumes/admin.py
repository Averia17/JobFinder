from django.contrib import admin

from resumes.models import Resume


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "user"]
    readonly_fields = ["created", "updated"]
    fieldsets = [
        (
            None,
            {
                "fields": [
                    "title",
                    "city",
                    "user",
                    "position",
                    "experience",
                    "salary",
                    "description",
                    "education",
                    "languages",
                    "skills",
                ]
            },
        ),
        ("System", {"classes": ["collapse"], "fields": ["created", "updated"]}),
    ]
