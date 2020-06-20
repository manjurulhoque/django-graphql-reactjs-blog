import graphene
from django.contrib.auth.models import User
from graphene_django import DjangoObjectType

from core.models import *


class UserType(DjangoObjectType):
    class Meta:
        model = User


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category


class PostType(DjangoObjectType):
    class Meta:
        model = Post


class CustomMessage(graphene.ObjectType):
    ok = graphene.Boolean(required=True)
    message = graphene.String(required=True)
