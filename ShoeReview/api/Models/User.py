from django.db import models

class User(models.Model):
    UserID = models.AutoField(primary_key=True)  
    username = models.CharField(max_length=100)
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)

    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.name
