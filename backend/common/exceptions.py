from django.utils.translation import gettext as _
from graphql import GraphQLError


class GraphQLAuthError(Exception):
    default_message = None

    def __init__(self, message=None):
        if message is None:
            message = self.default_message

        super().__init__(message)


class UserAlreadyVerified(GraphQLAuthError):
    default_message = _("User already verified.")


class InvalidCredentials(GraphQLAuthError):
    default_message = _("Invalid credentials.")


class UserNotVerified(GraphQLAuthError):
    default_message = _("User is not verified.")


class EmailAlreadyInUse(GraphQLAuthError):
    default_message = _("This email is already in use.")


class TokenScopeError(GraphQLAuthError):
    default_message = _("This token is for something else.")


class WrongUsage(GraphQLAuthError):
    """
    internal exception
    """

    default_message = _("Wrong usage, check your code!.")


class PermissionDeniedError(GraphQLError):
    default_message = _("You don't have permission to access this resource."),


class DoesNotExistsError(GraphQLError):
    default_message = _("No object found"),
