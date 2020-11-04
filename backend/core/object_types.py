import graphene
from graphene_django import DjangoObjectType

from core.models import *


class UserType(DjangoObjectType):
    class Meta:
        model = User
        exclude = ('password',)


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category


class PostType(DjangoObjectType):
    user = graphene.Field(UserType, source='user')
    category = graphene.Field(CategoryType, source='category')
    image_url = graphene.String(source='image_url')

    class Meta:
        model = Post


class CustomMessage(graphene.ObjectType):
    ok = graphene.Boolean(required=True)
    message = graphene.String(required=True)
