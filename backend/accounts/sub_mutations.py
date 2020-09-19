import graphene
import graphql_jwt
from django.conf import settings

from accounts.mixins import RegisterMixin, DynamicArgsMixin, ObtainJSONWebTokenMixin
from .nodes import UserNode
from .utils import normalize_fields
from common.bases import MutationMixin


class Register(MutationMixin, DynamicArgsMixin, RegisterMixin, graphene.Mutation):
    __doc__ = RegisterMixin.__doc__
    _required_args = ["username", "password1", "password2", "email"]
    # _required_args = normalize_fields(
    #     settings.REGISTER_MUTATION_FIELDS, ["password1", "password2"]
    # )


class ObtainJSONWebToken(
    MutationMixin, ObtainJSONWebTokenMixin, graphql_jwt.JSONWebTokenMutation
):
    __doc__ = ObtainJSONWebTokenMixin.__doc__
    user = graphene.Field(UserNode)

    @classmethod
    def Field(cls, *args, **kwargs):
        cls._meta.arguments.update({"password": graphene.String(required=True)})
        for field in settings.LOGIN_ALLOWED_FIELDS:
            cls._meta.arguments.update({field: graphene.String()})
        return super(graphql_jwt.JSONWebTokenMutation, cls).Field(*args, **kwargs)
