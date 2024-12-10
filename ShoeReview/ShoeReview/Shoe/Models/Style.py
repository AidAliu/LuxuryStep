from django.db import models

class Style(models.Model):
    Name = models.CharField(max_length=100)
    Description = models.TextField()

    def __str__(self):
        return self.Name
