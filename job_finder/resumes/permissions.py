from rest_framework import permissions


class IsOwnerOrHasCompany(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or request.user.company

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)


