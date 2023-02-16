from django.contrib import admin
from companies.models import Company, CompanyManager
from django import forms


# class CompanyManagerForm(forms.ModelForm):
#     class Meta:
#         model = CompanyManager
#         fields = ["is_general"]
#
#
# class ManagersInline(admin.TabularInline):
#     extra = 1
#     form = CompanyManagerForm
#     model = CompanyManager


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    # inlines = [ManagersInline]
    list_display = [
        "id",
        "title",
    ]
    readonly_fields = ["created", "updated"]
    fieldsets = [
        (
            None,
            {
                "fields": [
                    "title",
                    "address",
                    "description",
                ]
            },
        ),
        ("System", {"classes": ["collapse"], "fields": ["created", "updated"]}),
    ]


@admin.register(CompanyManager)
class CompanyManager(admin.ModelAdmin):
    list_display = [
        "user",
        "company",
    ]
    readonly_fields = ["is_general"]
    fieldsets = [
        (
            None,
            {
                "fields": [
                    "user",
                    "company"
                ]
            },
        ),
        ("Constant", {"fields": ["is_general"]}),
    ]