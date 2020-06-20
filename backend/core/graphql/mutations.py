import graphene
from graphql import GraphQLError

from .object_types import *
from ..models import *
from .inputs import CategoryInput, PostInput


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


class UpdateCategory(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = CategoryInput(required=True)

    ok = graphene.Boolean()
    category = graphene.Field(CategoryType)

    @staticmethod
    def mutate(root, info, id, input=None):
        ok = False
        category_instance = Category.objects.get(pk=id)
        if category_instance:
            ok = True
            category_instance.title = input.title
            category_instance.save()
            return UpdateCategory(ok=ok, category=category_instance)
        return UpdateCategory(ok=ok, category=None)


class DeleteCategory(graphene.Mutation):
    ok = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        id = graphene.Int(required=True)

    @staticmethod
    def mutate(root, info, id, input=None):
        ok = False
        try:
            category_instance = Category.objects.get(pk=id)
        except:
            category_instance = None
        if category_instance:
            ok = True
            message = 'Category successfully deleted'
            category_instance.delete()
            return DeleteCategory(ok=ok, message=message)
        message = 'Something went wrong'
        # return DeleteCategory(ok=ok, message=message)
        return CustomMessage(ok=ok, message=message)


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


class UpdatePost(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = PostInput(required=True)

    ok = graphene.Boolean()
    post = graphene.Field(PostType)
    message = graphene.String()

    @staticmethod
    def mutate(root, info, id, input=None):
        ok = True
        message = "Post successfully updated"
        if input.category_id:
            category = Category.objects.get(id=input.category_id)
        else:
            category = None

        try:
            post_instance = Post.objects.get(id=id)
        except:
            post_instance = None
        if post_instance:
            post_instance.title = input.title
            post_instance.description = input.description or post_instance.description
            post_instance.category = category or post_instance.category
            post_instance.save()
            return UpdatePost(ok=ok, post=post_instance, message=message)
        message = "Something went wrong"
        return UpdatePost(ok=ok, post=post_instance, message=message)


class Mutation(graphene.ObjectType):
    create_post = CreatePost.Field()
    update_post = UpdatePost.Field()
    create_category = CreateCategory.Field()
    update_category = UpdateCategory.Field()
    delete_category = DeleteCategory.Field()
