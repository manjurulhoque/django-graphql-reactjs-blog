import graphene


class NewUserInput(graphene.InputObjectType):
    id = graphene.ID()
    username = graphene.String()
    password1 = graphene.String()
    password2 = graphene.String()
    email = graphene.String()
