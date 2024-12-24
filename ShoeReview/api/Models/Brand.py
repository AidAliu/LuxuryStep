from django.db import models

class Brand(models.Model):
    BrandID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    website_url = models.URLField()

    def __str__(self):
        return self.name
