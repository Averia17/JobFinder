from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.director == request.user


class UserInCompany(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_manager
            and request.user.companymanager in obj.managers.all()
            or request.user == obj.director
        )
