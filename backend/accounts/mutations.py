import graphene
import graphql_jwt

from .sub_mutations import Register, ObtainJSONWebToken


class AuthMutation(graphene.ObjectType):
    register = Register.Field()
    login = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
