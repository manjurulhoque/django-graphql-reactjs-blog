from django import forms

from core.models import *


class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ("title",)


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ("title", "description", "category")
