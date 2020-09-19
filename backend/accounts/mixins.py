import logging

import graphene
from django.conf import settings
from django.contrib.auth.backends import UserModel
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from graphql_jwt.exceptions import JSONWebTokenError

logger = logging.getLogger(__name__)

from accounts.forms import RegisterForm
from accounts.shortcuts import get_user_to_login
from common.bases import Output
from common.constants import Messages
from common.exceptions import WrongUsage, UserNotVerified, InvalidCredentials, PermissionDeniedError


class RegisterMixin(Output):
    """
    Register user with fields defined in the settings.
    If the email field of the user model is part of the
    registration fields (default), check if there is
    no user with that email or as a secondary email.
    If it exists, it does not register the user,
    even if the email field is not defined as unique
    (default of the default django user model).
    When creating the user, it also creates a `UserStatus`
    related to that user, making it possible to track
    if the user is archived, verified and has a secondary
    email.
    Send account verification email.
    If allowed to not verified users login, return token.
    """

    form = RegisterForm

    @classmethod
    def resolve_mutation(cls, root, info, **kwargs):
        kwargs['date_joined'] = timezone.now()
        f = cls.form(kwargs)
        if f.is_valid():
            user = f.save()
            return cls(success=True)
        else:
            return cls(success=False, errors=f.errors.get_json_data())


class DynamicArgsMixin:
    """
    A class that knows how to initialize graphene arguments

    get args from
        cls._args
        cls._required_args
    args is dict { arg_name: arg_type }
    or list [arg_name,] -> defaults to String
    """

    _args = {}
    _required_args = {}

    @classmethod
    def Field(cls, *args, **kwargs):
        if isinstance(cls._args, dict):
            for key in cls._args:
                cls._meta.arguments.update(
                    {key: graphene.Argument(getattr(graphene, cls._args[key]))}
                )
        elif isinstance(cls._args, list):
            for key in cls._args:
                cls._meta.arguments.update({key: graphene.String()})

        if isinstance(cls._required_args, dict):
            for key in cls._required_args:
                cls._meta.arguments.update(
                    {
                        key: graphene.Argument(
                            getattr(graphene, cls._required_args[key]), required=True
                        )
                    }
                )
        elif isinstance(cls._required_args, list):
            for key in cls._required_args:
                cls._meta.arguments.update({key: graphene.String(required=True)})
        return super().Field(*args, **kwargs)


class PermissionMixin:
    permission_classes = []

    @classmethod
    def check_permission(cls, info, **kwargs):
        request = info.context
        for permission in cls.get_permissions():
            if not permission.has_permission(request, **kwargs):
                logger.debug(
                    'Permission denied for Permission class: {}, user: {}, message: {}'.format(
                        permission.__class__.__name__,
                        str(request.user),
                        str(getattr(permission, 'message', None))
                    )
                )
                raise PermissionDeniedError(getattr(permission, 'message', None))

    @classmethod
    def check_object_permissions(cls, info, obj, **kwargs):
        request = info.context
        for permission in cls.get_permissions():
            if not permission.has_object_permission(request, obj, **kwargs):
                logger.debug(
                    'Permission denied for Permission class: {}, user: {}, object: {}, message: {}'.format(
                        permission.__class__.__name__,
                        str(request.user),
                        str(obj),
                        str(getattr(permission, 'message', None))
                    )
                )
                raise PermissionDeniedError(getattr(permission, 'message', None))

    @classmethod
    def get_permissions(cls):
        return [permission() for permission in cls.permission_classes]


class PermissionDjangoObjectType(PermissionMixin):
    class Meta:
        abstract = True

    @classmethod
    def get_queryset(cls, queryset, info):
        try:
            cls.check_permission(info)
        except PermissionDeniedError:
            return cls._meta.model.objects.none()
        return super().get_queryset(queryset, info)

    @classmethod
    def get_node(cls, info, id):
        obj = super().get_node(info, id)
        if obj:
            try:
                cls.check_object_permissions(info, obj)
            except PermissionDeniedError:
                return None
        return obj


class ObtainJSONWebTokenMixin(Output):
    """
    Obtain JSON web token for given user.

    Allow to perform login with different fields,
    and secondary email if set. The fields are
    defined on settings.

    Not verified users can login by default. This
    can be changes on settings.
    """

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(user=info.context.user)

    @classmethod
    def resolve_mutation(cls, root, info, **kwargs):
        if len(kwargs.items()) != 2:
            raise WrongUsage(
                "Must login with password and one of the following fields %s."
                % (settings.LOGIN_ALLOWED_FIELDS)
            )

        try:
            next_kwargs = None
            USERNAME_FIELD = UserModel.USERNAME_FIELD

            # extract USERNAME_FIELD to use in query
            if USERNAME_FIELD in kwargs:
                query_kwargs = {USERNAME_FIELD: kwargs[USERNAME_FIELD]}
                next_kwargs = kwargs
                password = kwargs.get("password")
            else:  # use what is left to query
                password = kwargs.pop("password")
                query_field, query_value = kwargs.popitem()
                query_kwargs = {query_field: query_value}

            user = get_user_to_login(**query_kwargs)

            if not next_kwargs:
                next_kwargs = {
                    "password": password,
                    USERNAME_FIELD: getattr(user, USERNAME_FIELD),
                }

            if user:
                return cls.parent_resolve(
                    root, info, **next_kwargs
                )

            if user.check_password(password):
                raise InvalidCredentials
            raise InvalidCredentials
        except (JSONWebTokenError, ObjectDoesNotExist, InvalidCredentials):
            return cls(success=False, errors=Messages.INVALID_CREDENTIALS)
        except UserNotVerified:
            return cls(success=False, errors=Messages.NOT_VERIFIED)
