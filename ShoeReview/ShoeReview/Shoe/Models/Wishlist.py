from django.db import models
from .User import User
from .Shoe import Shoe

class Wishlist(models.Model):
    User = models.ForeignKey(User, on_delete=models.CASCADE)
    Name = models.CharField(max_length=100)

    def __str__(self):
        return self.Name

class WishlistItem(models.Model):
    Wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE)
    Shoe = models.ForeignKey(Shoe, on_delete=models.CASCADE)
