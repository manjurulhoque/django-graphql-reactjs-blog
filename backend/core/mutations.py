from accounts.mutations import AuthMutation
from .sub_mutations import *


class Mutation(AuthMutation, graphene.ObjectType):
    create_post = CreatePost.Field()
    update_post = UpdatePost.Field()
    delete_post = DeletePost.Field()
    create_category = CreateCategory.Field()
    update_category = UpdateCategory.Field()
    delete_category = DeleteCategory.Field()
    create_user = CreateUser.Field()
