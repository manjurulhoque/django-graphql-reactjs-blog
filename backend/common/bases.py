import graphene

from .types import ExpectedErrorType


class Output:
    """
    A class to all public classes extend to
    padronize the output
    """

    success = graphene.Boolean(default_value=True)
    errors = graphene.Field(ExpectedErrorType)


class MutationMixin:
    """
    All mutations should extend this class
    """

    @classmethod
    def mutate(cls, root, info, **input):
        return cls.resolve_mutation(root, info, **input)

    @classmethod
    def parent_resolve(cls, root, info, **kwargs):
        return super().mutate(root, info, **kwargs)
