from rest_framework import permissions


class IsDirector(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        company = obj
        if hasattr(obj, "company"):
            company = obj.company
        return company.director == request.user

    def has_permission(self, request, view):
        return (
                request.user and request.user.is_authenticated and request.user.is_director
        )


class CompanyIsActive(permissions.IsAuthenticated):
    message = "Company is not active. Write to support to make company active"

    def has_object_permission(self, request, view, obj):
        company = obj
        if hasattr(obj, "company"):
            company = obj.company
        return company.is_active

    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.company and request.user.company.is_active


class UserInCompany(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return bool(
            request.user.is_manager
            and request.user.companymanager in obj.managers.all()
            or request.user == obj.director
        )

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)


class IsManagerOrDirector(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.is_manager or request.user.is_director)
        )
