from graphql import GraphQLError

from accounts.mixins import DynamicArgsMixin
from common.bases import MutationMixin
from common.graphql_mixins import SingleObjectMixin
from common.permissions import IsAuthenticated
from .graphql_mixins import CreateCategoryMixin, UpdateCategoryMixin, DeleteCategoryMixin, CreatePostMixin, \
    UpdatePostMixin, DeletePostMixin
from .object_types import *
from .inputs import CategoryInput, PostInput


class CreateCategory2(graphene.Mutation):
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


class CreateCategory(MutationMixin, DynamicArgsMixin, CreateCategoryMixin, graphene.Mutation):
    __doc__ = CreateCategoryMixin.__doc__
    _required_args = ["title"]


class UpdateCategory2(graphene.Mutation):
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


class UpdateCategory(MutationMixin, DynamicArgsMixin, SingleObjectMixin, UpdateCategoryMixin, graphene.Mutation):
    __doc__ = UpdateCategoryMixin.__doc__
    _required_args = {
        'pk': 'ID',
        "title": 'String'
    }
    model = Category


class DeleteCategory2(graphene.Mutation):
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


class DeleteCategory(MutationMixin, DynamicArgsMixin, SingleObjectMixin, DeleteCategoryMixin, graphene.Mutation):
    _required_args = {
        'pk': 'ID',
    }
    model = Category


class CreatePost2(graphene.Mutation):
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


class CreatePost(MutationMixin, DynamicArgsMixin, CreatePostMixin, graphene.Mutation):
    __doc__ = CreatePostMixin.__doc__
    # _required_args = ["title", "description", "category"]
    _required_args = {
        'title': 'String',
        'description': 'String',
        'category': 'Int',
    }


class UpdatePost2(graphene.Mutation):
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


class UpdatePost(MutationMixin, DynamicArgsMixin, SingleObjectMixin, UpdatePostMixin, graphene.Mutation):
    _required_args = {
        "pk": 'ID',
        "title": 'String',
        "description": 'String',
        "category": 'Int',
    }
    model = Post


class DeletePost2(graphene.Mutation):
    ok = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        id = graphene.Int(required=True)

    @staticmethod
    def mutate(root, info, id, input=None):
        ok = False
        try:
            post_instance = Post.objects.get(pk=id)
        except:
            post_instance = None
        if post_instance:
            ok = True
            message = 'Post successfully deleted'
            post_instance.delete()
            return DeletePost(ok=ok, message=message)
        message = 'Something went wrong'
        return DeletePost(ok=ok, message=message)


class DeletePost(MutationMixin, DynamicArgsMixin, SingleObjectMixin, DeletePostMixin, graphene.Mutation):
    _required_args = {
        'pk': 'ID',
    }
    model = Post


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)
    ok = graphene.Boolean()

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, username, password, email):
        if User.objects.filter(username=username, email=email).exists():
            raise GraphQLError('User is already exists')
        user = User(
            username=username,
            email=email,
        )
        user.set_password(password)
        user.save()
        ok = True

        return CreateUser(user=user, ok=ok)
