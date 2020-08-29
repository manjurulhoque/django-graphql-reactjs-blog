from accounts.migrations.forms import RegisterForm
from common.bases import Output


class RegisterMixin(Output):
    """
    Register user with fields defined in the settings.
    If the email field of the user model is part of the
    registration fields (default), check if there is
    no user with that email or as a secondary email.
    If it exists, it does not register the user,
    even if the email field is not defined as unique
    (default of the default django user model).
    When creating the user, it also creates a `UserStatus`
    related to that user, making it possible to track
    if the user is archived, verified and has a secondary
    email.
    Send account verification email.
    If allowed to not verified users login, return token.
    """

    form = RegisterForm

    @classmethod
    def resolve_mutation(cls, root, info, **kwargs):
        f = cls.form(kwargs)
        if f.is_valid():
            user = f.save()
            return cls(success=True)
        else:
            return cls(success=False, errors=f.errors.get_json_data())
