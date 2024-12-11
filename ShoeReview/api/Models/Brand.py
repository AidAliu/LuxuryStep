from django.db import models

class Brand(models.Model):
    Name = models.CharField(max_length=100)
    Description = models.TextField()
    WebsiteUrl = models.URLField()

    def __str__(self):
        return self.Name