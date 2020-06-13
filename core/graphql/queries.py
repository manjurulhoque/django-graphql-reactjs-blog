import graphene

from core.graphql.object_types import *


class Query(graphene.ObjectType):
    post = graphene.Field(PostType, id=graphene.Int())
    category = graphene.Field(CategoryType, id=graphene.Int())
    posts = graphene.List(PostType)
    categories = graphene.List(CategoryType)

    def resolve_posts(self, info):
        return Post.objects.all()

    def resolve_categories(self, info):
        return Category.objects.all()

    def resolve_post(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            return Post.objects.get(pk=id)

        return None

    def resolve_category(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            return Category.objects.get(pk=id)

        return None
