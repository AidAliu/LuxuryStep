from django.db import models
from .User import User
from .Shoe import Shoe

class Review(models.Model):
    ReviewID = models.AutoField(primary_key=True)
    UserID = models.ForeignKey(User, on_delete=models.CASCADE)
    ShoeID = models.ForeignKey(Shoe, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField()

    def __str__(self):
        return f"{self.UserID.name}'s review of {self.ShoeID.name}"
