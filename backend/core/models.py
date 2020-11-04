from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Category(models.Model):
    title = models.CharField(max_length=255, unique=True)


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="posts", default="posts/default.png")
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    @property
    def image_url(self):
        return f"http://localhost:8000{self.image.url}"
