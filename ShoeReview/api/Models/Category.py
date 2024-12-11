from django.db import models

class Category(models.Model):
    Name = models.CharField(max_length=100)
    Description = models.TextField()

    def __str__(self):
        return self.Name