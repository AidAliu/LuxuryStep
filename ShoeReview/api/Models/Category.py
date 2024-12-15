from django.db import models

class Category(models.Model):
    CategoryID = models.AutoField(primary_key=True)  
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name
