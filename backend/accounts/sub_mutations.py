import graphene

from accounts.mixins import RegisterMixin
from common.bases import MutationMixin


class Register(MutationMixin, RegisterMixin, graphene.Mutation):
    __doc__ = RegisterMixin.__doc__
