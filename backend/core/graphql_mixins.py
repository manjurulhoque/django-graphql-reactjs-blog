from graphql_jwt.decorators import login_required

from common.bases import Output
from core.forms import CategoryForm, PostForm


class CreateCategoryMixin(Output):
    """
    Create a category
    """

    form = CategoryForm

    @classmethod
    def resolve_mutation(cls, root, info, **kwargs):
        f = cls.form(kwargs)
        if f.is_valid():
            category = f.save()
            return cls(success=True)
        else:
            return cls(success=False, errors=f.errors.get_json_data())


class CreatePostMixin(Output):
    """
    Create a post
    """

    form = PostForm

    @classmethod
    @login_required
    def resolve_mutation(cls, root, info, **kwargs):
        f = cls.form(kwargs)
        if f.is_valid():
            post = f.save()
            return cls(success=True)
        else:
            return cls(success=False, errors=f.errors.get_json_data())


class UpdatePostMixin(Output):
    """
    Update a post
    """

    form = PostForm

    @classmethod
    def resolve_mutation(cls, root, info, **kwargs):
        post = cls.get_object(info, **kwargs)
        f = cls.form(kwargs, instance=post)
        if f.is_valid():
            f.save()
            return cls(success=True)
        else:
            return cls(success=False, errors=f.errors.get_json_data())


class UpdateCategoryMixin(Output):
    """
    Update a category
    """

    form = CategoryForm

    @classmethod
    def resolve_mutation(cls, root, info, **kwargs):
        category = cls.get_object(info, **kwargs)
        f = cls.form(kwargs, instance=category)
        if f.is_valid():
            f.save()
            return cls(success=True)
        else:
            return cls(success=False, errors=f.errors.get_json_data())


class DeleteCategoryMixin(Output):
    """
    Delete a category
    """

    form = CategoryForm

    @classmethod
    def resolve_mutation(cls, root, info, **kwargs):
        category = cls.get_object(info, **kwargs)
        category.delete()
        return cls(success=True)


class DeletePostMixin(Output):
    """
    Delete a post
    """

    form = CategoryForm

    @classmethod
    def resolve_mutation(cls, root, info, **kwargs):
        post = cls.get_object(info, **kwargs)
        post.delete()
        return cls(success=True)
