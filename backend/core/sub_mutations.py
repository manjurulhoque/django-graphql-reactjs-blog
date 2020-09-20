from graphql import GraphQLError
from graphql_jwt.decorators import login_required

from accounts.mixins import DynamicArgsMixin
from common.bases import MutationMixin
from common.graphql_mixins import SingleObjectMixin
from common.types import ExpectedErrorType
from .forms import PostForm
from .graphql_mixins import CreateCategoryMixin, UpdateCategoryMixin, DeleteCategoryMixin, CreatePostMixin, \
    UpdatePostMixin, DeletePostMixin
from .object_types import *
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


class CreateCategory2(MutationMixin, DynamicArgsMixin, CreateCategoryMixin, graphene.Mutation):
    __doc__ = CreateCategoryMixin.__doc__
    _required_args = ["title"]


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


class UpdateCategory2(MutationMixin, DynamicArgsMixin, SingleObjectMixin, UpdateCategoryMixin, graphene.Mutation):
    __doc__ = UpdateCategoryMixin.__doc__
    _required_args = {
        'pk': 'ID',
        "title": 'String'
    }
    model = Category


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


class DeleteCategory2(MutationMixin, DynamicArgsMixin, SingleObjectMixin, DeleteCategoryMixin, graphene.Mutation):
    _required_args = {
        'pk': 'ID',
    }
    model = Category


class CreatePost(graphene.Mutation):
    class Arguments:
        input = PostInput(required=True)

    success = graphene.Boolean()
    errors = graphene.Field(ExpectedErrorType)
    post = graphene.Field(PostType)

    @login_required
    def mutate(self, info, input=None, **kwargs):
        print(info.context.user)
        form = PostForm(input)
        if not form.is_valid():
            return CreatePost(success=False, errors=form.errors.get_json_data(), post=None)
        category = Category.objects.get(id=input.category)
        post_instance = Post(title=input.title, description=input.description, category=category,
                             user=info.context.user)
        post_instance.save()
        return CreatePost(success=True, errors=None, post=post_instance)


class CreatePost2(MutationMixin, DynamicArgsMixin, CreatePostMixin, graphene.Mutation):
    __doc__ = CreatePostMixin.__doc__
    # _required_args = ["title", "description", "category"]
    _required_args = {
        'title': 'String',
        'description': 'String',
        'category': 'Int',
    }


class UpdatePost(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = PostInput(required=True)

    post = graphene.Field(PostType)
    success = graphene.Boolean()
    errors = graphene.Field(ExpectedErrorType)

    @staticmethod
    def mutate(root, info, id, input=None):
        if input.category:
            category = Category.objects.get(id=input.category)
        else:
            raise GraphQLError("Category not found")

        try:
            post_instance = Post.objects.get(id=id)
        except:
            raise GraphQLError("Post not found")
        form = PostForm(**input, instance=post_instance)
        if not form.is_valid():
            return UpdatePost(success=False, errors=form.errors.get_json_data(), post=None)
        post = form.save()
        return UpdatePost(success=True, errors=None, post=post)


class UpdatePost2(MutationMixin, DynamicArgsMixin, SingleObjectMixin, UpdatePostMixin, graphene.Mutation):
    _required_args = {
        "pk": 'ID',
        "title": 'String',
        "description": 'String',
        "category": 'Int',
    }
    model = Post


class DeletePost(graphene.Mutation):
    success = graphene.Boolean()
    errors = graphene.Field(ExpectedErrorType)

    class Arguments:
        id = graphene.Int(required=True)

    @staticmethod
    def mutate(root, info, id, input=None):
        try:
            post_instance = Post.objects.get(pk=id)
        except:
            raise GraphQLError("Post not found")
        post_instance.delete()
        return DeletePost(success=True)


class DeletePost2(MutationMixin, DynamicArgsMixin, SingleObjectMixin, DeletePostMixin, graphene.Mutation):
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
