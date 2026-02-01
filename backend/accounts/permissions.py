from rest_framework.permissions import BasePermission, IsAuthenticated


def HasRole(*roles):
    """
    Factory that returns a DRF permission class which checks that the
    authenticated user has one of the required roles.

    Usage: permission_classes = [HasRole("admin")]
    """

    class _HasRolePermission(BasePermission):
        def has_permission(self, request, view):
            return (
                IsAuthenticated().has_permission(request, view)
                and hasattr(request.user, "role")
                and request.user.role in roles
            )

    return _HasRolePermission


class IsSuperAdmin(BasePermission):
    """
    Permission class that only allows superadmin users.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.is_superuser
        )
