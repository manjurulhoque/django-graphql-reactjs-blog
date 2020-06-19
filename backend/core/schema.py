import graphene

from .graphql.mutations import Mutation
from .graphql.queries import Query

schema = graphene.Schema(query=Query, mutation=Mutation)
