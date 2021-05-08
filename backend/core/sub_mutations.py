import graphene
from PIL import Image
from django.conf import settings
from django.contrib.auth import get_user_model
from graphene_file_upload.scalars import Upload
from graphql import GraphQLError
from graphql_jwt.decorators import login_required

from accounts.mixins import DynamicArgsMixin
from common.bases import MutationMixin
from common.graphql_mixins import SingleObjectMixin
from common.types import ExpectedErrorType
from .forms import PostForm, CategoryForm, ImageUploadForm
from .graphql_mixins import CreateCategoryMixin, UpdateCategoryMixin, DeleteCategoryMixin, CreatePostMixin, \
    UpdatePostMixin, DeletePostMixin
from .inputs import CategoryInput, PostInput
from .models import Category, Post
from .object_types import UserType, CategoryType, PostType
from django.core.files.storage import FileSystemStorage

User = get_user_model()


class CreateCategory(graphene.Mutation):
    class Arguments:
        input = CategoryInput(required=True)

    success = graphene.Boolean()
    errors = graphene.Field(ExpectedErrorType)
    category = graphene.Field(CategoryType)

    @login_required
    def mutate(self, info, input=None):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('You must be logged to create category!')

        form = CategoryForm(input)
        if not form.is_valid():
            return CreateCategory(success=False, errors=form.errors.get_json_data(), category=None)
        category_instance = Category(title=input.title)
        category_instance.save()

        return CreateCategory(success=True, errors=None, category=category_instance)


class CreateCategory2(MutationMixin, DynamicArgsMixin, CreateCategoryMixin, graphene.Mutation):
    __doc__ = CreateCategoryMixin.__doc__
    _required_args = ["title"]


class UpdateCategory(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = CategoryInput(required=True)

    success = graphene.Boolean()
    errors = graphene.Field(ExpectedErrorType)
    category = graphene.Field(CategoryType)

    @login_required
    def mutate(self, info, id, input=None):
        try:
            category_instance = Category.objects.get(pk=id)
            form = CategoryForm(instance=category_instance, data=input)
            if not form.is_valid():
                return UpdateCategory(success=False, errors=form.errors.get_json_data(), category=None)

            category_instance = form.save()
            return UpdateCategory(success=True, errors=None, category=category_instance)
        except Category.DoesNotExist:
            return GraphQLError("Category doesn't exists")


class UpdateCategory2(MutationMixin, DynamicArgsMixin, SingleObjectMixin, UpdateCategoryMixin, graphene.Mutation):
    __doc__ = UpdateCategoryMixin.__doc__
    _required_args = {
        'pk': 'ID',
        "title": 'String'
    }
    model = Category


class DeleteCategory(graphene.Mutation):
    success = graphene.Boolean()
    errors = graphene.Field(ExpectedErrorType)

    class Arguments:
        id = graphene.Int(required=True)

    @login_required
    def mutate(self, info, id):
        try:
            category_instance = Category.objects.get(pk=id)
        except Category.DoesNotExist:
            raise GraphQLError("Category not found")
        if category_instance:
            category_instance.delete()
            return UpdateCategory(success=True, errors=None)
        return UpdateCategory(success=False, errors=None)


class DeleteCategory2(MutationMixin, DynamicArgsMixin, SingleObjectMixin, DeleteCategoryMixin, graphene.Mutation):
    _required_args = {
        'pk': 'ID',
    }
    model = Category


class UploadImage(graphene.Mutation):
    class Arguments:
        file = Upload(required=True)

    success = graphene.Boolean()
    path = graphene.String()

    def mutate(self, info, file=None, **kwargs):

        try:
            fs = FileSystemStorage()
            filename = fs.save("posts/" + file.name, file)
            uploaded_file_url = fs.url(filename)
            # img = Image.open(file)
            # img.thumbnail((500, 500), Image.ANTIALIAS)
            # path = info.context.get_host() + settings.MEDIA_ROOT + file.name
            path = 'http://127.0.0.1:8000' + uploaded_file_url
            return UploadImage(success=True, path=path)
        except:
            pass
        return UploadImage(success=False, path=None)


class CreatePost(graphene.Mutation):
    class Arguments:
        input = PostInput(required=True)
        file = Upload(required=False)

    success = graphene.Boolean()
    errors = graphene.Field(ExpectedErrorType)
    post = graphene.Field(PostType)

    def mutate(self, info, input=None, file=None, **kwargs):
        form = PostForm(input)
        if not form.is_valid():
            return CreatePost(success=False, errors=form.errors.get_json_data(), post=None)
        category = Category.objects.get(id=input.category)
        post_instance = form.save(commit=False)
        post_instance.user_id = 1
        if file:
            post_instance.image = file
        # post_instance = Post(title=input.title, description=input.description, category=category, user_id=1)
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
        file = Upload(required=False)

    post = graphene.Field(PostType)
    success = graphene.Boolean()
    errors = graphene.Field(ExpectedErrorType)

    @staticmethod
    def mutate(root, info, id, input=None, file=None):
        if input.category:
            category = Category.objects.get(id=input.category)
        else:
            raise GraphQLError("Category not found")

        try:
            post_instance = Post.objects.get(id=id)
        except Post.DoesNotExist:
            raise GraphQLError("Post not found")
        form = PostForm(input, instance=post_instance)
        if not form.is_valid():
            return UpdatePost(success=False, errors=form.errors.get_json_data(), post=None)
        post = form.save(commit=False)
        if file:
            post.image = file
        post.save()
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
        except Post.DoesNotExist:
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
