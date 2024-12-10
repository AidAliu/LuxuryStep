from django.db import models

class Brand(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    website_url = models.URLField()

    def __str__(self):
        return self.name