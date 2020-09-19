import graphene
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType

from accounts.mixins import PermissionDjangoObjectType


class UserNode(DjangoObjectType, PermissionDjangoObjectType):
    class Meta:
        model = get_user_model()
        filter_fields = {
            "email": ["exact"],
            "username": ["exact", "icontains", "istartswith"],
            "is_active": ["exact"],
        }
        exclude = ["password"]
        interfaces = (graphene.relay.Node,)
        skip_registry = True

    pk = graphene.Int()

    def resolve_pk(self, info):
        return self.pk
