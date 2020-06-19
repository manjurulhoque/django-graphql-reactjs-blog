from django.db import models


class Category(models.Model):
    title = models.CharField(max_length=255)


class Post(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
