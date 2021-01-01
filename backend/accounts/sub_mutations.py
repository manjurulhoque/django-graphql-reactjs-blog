import graphene
import graphql_jwt
from django.conf import settings
from graphql import GraphQLError

from accounts.mixins import RegisterMixin, DynamicArgsMixin, ObtainJSONWebTokenMixin
from common.types import ExpectedErrorType
from core.object_types import UserType
from .forms import RegisterForm
from .inputs import NewUserInput
from .nodes import UserNode
from .utils import normalize_fields
from common.bases import MutationMixin


class Register2(MutationMixin, DynamicArgsMixin, RegisterMixin, graphene.Mutation):
    __doc__ = RegisterMixin.__doc__
    _required_args = ["username", "password1", "password2", "email"]
    # _required_args = normalize_fields(
    #     settings.REGISTER_MUTATION_FIELDS, ["password1", "password2"]
    # )


class Register(graphene.Mutation):
    class Arguments:
        input = NewUserInput(required=True)

    success = graphene.Boolean()
    errors = graphene.Field(ExpectedErrorType)
    user = graphene.Field(UserType)

    def mutate(self, info, input=None):
        form = RegisterForm(input)
        if not form.is_valid():
            return Register(success=False, errors=form.errors.get_json_data(), user=None)
        new_user = form.save()

        return Register(success=True, errors=None, user=new_user)


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
