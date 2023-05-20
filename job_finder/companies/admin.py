from django.contrib import admin
from companies.models import Company, CompanyManager


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    # inlines = [ManagersInline]
    list_display = ["id", "title", "is_active"]
    search_fields = ["title"]
    list_filter = ["is_active"]
    readonly_fields = ["created", "updated"]
    fieldsets = [
        (
            None,
            {"fields": ["title", "address", "description", "image", "director", "is_active"]},
        ),
        ("System", {"classes": ["collapse"], "fields": ["created", "updated"]}),
    ]


@admin.register(CompanyManager)
class CompanyManager(admin.ModelAdmin):
    list_display = [
        "user",
        "company",
    ]
    fieldsets = [
        (
            None,
            {"fields": ["user", "company"]},
        ),
    ]
