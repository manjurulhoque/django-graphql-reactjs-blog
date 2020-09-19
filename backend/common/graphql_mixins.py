from django.shortcuts import get_object_or_404

from common.exceptions import DoesNotExistsError


class SingleObjectMixin:
    lookup_field: str = 'pk'
    lookup_url_kwarg = None
    check_object_level_permission: bool = True
    model = None
    select_related_properties = None

    @classmethod
    def get_queryset(cls):
        assert cls.model is not None, (
            'You must define `model` as class attribute in order to use '
            '`SingleObjectParentMixin`'
        )
        queryset = cls.model.objects.all()
        if cls.select_related_properties:
            assert isinstance(cls.select_related_properties, (tuple, list)), (
                '`select_related_properties` must be tuple or list'
            )
            queryset = queryset.select_related(*cls.select_related_properties)
        return queryset

    @classmethod
    def get_object(cls, info, **kwargs):
        """
        Returns the object the endpoint is modifying.
        """

        lookup_url_kwarg = cls.lookup_url_kwarg or cls.lookup_field
        assert lookup_url_kwarg in kwargs, (
                'Expected mutation %s to be called with an object keyword argument '
                'named "%s". Fix your argument conf, or set the `.lookup_field` '
                'attribute on the mixin correctly.' %
                (cls.__name__, lookup_url_kwarg)
        )

        filter_kwargs = {cls.lookup_field: kwargs.get(lookup_url_kwarg, None)}
        obj = get_object_or_404(cls.get_queryset(), **filter_kwargs)
        return obj

        # # May raise a permission denied
        # if cls.check_object_level_permission:
        #     cls.check_object_permissions(info, obj)
