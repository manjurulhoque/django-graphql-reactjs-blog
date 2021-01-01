from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError


class RegisterForm(UserCreationForm):
    class Meta:
        model = get_user_model()
        fields = ["username", "password1", "password2", "email"]

    def clean_username(self):
        username = self.cleaned_data.get('username', '')
        if len(username) < 3:
            raise ValidationError("Username length should be greater than 5", "length")
        return username
