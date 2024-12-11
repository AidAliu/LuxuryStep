from django.db import models
from .User import User
from .Shoe import Shoe

class Review(models.Model):
    User = models.ForeignKey(User, on_delete=models.CASCADE)
    Shoe = models.ForeignKey(Shoe, on_delete=models.CASCADE)
    Rating = models.IntegerField()
    Comment = models.TextField()

    def __str__(self):
        return f"{self.User.Name}'s review of {self.Shoe.Name}"
