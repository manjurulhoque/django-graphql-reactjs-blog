from graphene_django import DjangoObjectType
import graphene

from .models import *


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category


class PostType(DjangoObjectType):
    class Meta:
        model = Post


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


class CategoryInput(graphene.InputObjectType):
    id = graphene.ID()
    title = graphene.String()


class PostInput(graphene.InputObjectType):
    id = graphene.ID()
    title = graphene.String()
    description = graphene.String()
    category_id = graphene.Int(name="category")


class CreateCategory(graphene.Mutation):
    class Arguments:
        input = CategoryInput(required=True)

    ok = graphene.Boolean()
    category = graphene.Field(CategoryType)

    @staticmethod
    def mutate(root, info, input=None):
        ok = True
        category_instance = Category(title=input.title)
        category_instance.save()
        return CreateCategory(ok=ok, category=category_instance)


class CreatePost(graphene.Mutation):
    class Arguments:
        input = PostInput(required=True)

    ok = graphene.Boolean()
    post = graphene.Field(PostType)

    @staticmethod
    def mutate(root, info, input=None):
        ok = True
        category = Category.objects.get(id=input.category_id)
        post_instance = Post(title=input.title, description=input.description, category=category)
        post_instance.save()
        return CreatePost(ok=ok, post=post_instance)


class Mutation(graphene.ObjectType):
    create_post = CreatePost.Field()
    create_category = CreateCategory.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
