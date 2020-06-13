from graphene_django import DjangoObjectType

from core.models import *


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category


class PostType(DjangoObjectType):
    class Meta:
        model = Post
