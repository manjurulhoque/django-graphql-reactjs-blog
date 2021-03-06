import graphene


class CategoryInput(graphene.InputObjectType):
    id = graphene.ID()
    title = graphene.String()


class PostInput(graphene.InputObjectType):
    id = graphene.ID()
    title = graphene.String()
    description = graphene.String()
    category = graphene.Int(name="category")
    # user = graphene.Int(name="user")
