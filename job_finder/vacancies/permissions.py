from rest_framework import permissions


class IsOwnerManagerOrDirector(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.is_manager and obj.manager.user == request.user)
            or (request.user.is_director and obj.company == request.user.company)
        )
