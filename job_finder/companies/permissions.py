from rest_framework import permissions


class IsDirector(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user and request.user.is_authenticated and obj.director == request.user


class UserInCompany(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_manager
            and request.user.companymanager in obj.managers.all()
            or request.user == obj.director
        )


class IsManagerOrDirector(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_manager
            or request.user.is_director
        )
