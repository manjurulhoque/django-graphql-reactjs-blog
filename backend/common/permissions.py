from typing import NamedTuple, Optional

from django.utils.translation import gettext_lazy as _


class Checking(NamedTuple):
    passed: bool = True
    message: Optional[str] = None
    params: dict = dict()


class BasePermission:
    message = None

    def has_permission(self, request, **kwargs):
        return True

    def has_object_permission(self, request, obj, **kwargs):
        return True

    def set_message_and_get_checking_status(self, checking: Checking, message=None) -> bool:
        self.message = message or checking.message
        return checking.passed


class AllowAny(BasePermission):
    def has_permission(self, request, **kwargs):
        return True


class IsAuthenticated(BasePermission):
    message = _("Unauthenticated request.")

    def has_permission(self, request, **kwargs):
        return bool(request.user and request.user.is_authenticated)


class IsVerifiedUser(BasePermission):
    message = _("User is not verified.")

    def has_permission(self, request, **kwargs):
        return request.user.status.verified


class IsActiveUser(BasePermission):
    message = _("This user is not inactive or deleted.")

    def has_permission(self, request, **kwargs):
        return not request.user.is_invalid()


class IsVerifiedPhoneUser(BasePermission):
    message = _("User must have a verified phone number to perform this action.")

    def has_permission(self, request, **kwargs):
        return bool(request.user.phone and request.user.status.phone_verified)


class IsSuperAdminUser(BasePermission):
    message = _("User must be super admin to perform this action.")

    def has_permission(self, request, **kwargs):
        return bool(request.user and request.user.is_superuser)


class IsSuperAdminOrOwnerOfObject(BasePermission):
    message = _("The user must be super admin or owner of this object.")

    def has_object_permission(self, request, obj, **kwargs):
        return request.user.is_superuser or obj.owner == request.user  # obj.owner or obj.user


class IsActiveObject(BasePermission):
    message = _("Requesting object must be active.")

    def has_object_permission(self, request, obj, **kwargs):
        if request.user.is_superuser:
            return True
        return obj.get_object_validity()
