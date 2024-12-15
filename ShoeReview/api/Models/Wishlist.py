from django.db import models
from .User import User
from .Shoe import Shoe

class Wishlist(models.Model):
    WishlistID = models.AutoField(primary_key=True)  
    UserID = models.ForeignKey(User, on_delete=models.CASCADE, to_field='UserID')
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# WishlistItem Model
class WishlistItem(models.Model):
    WishlistID = models.ForeignKey(Wishlist, on_delete=models.CASCADE, to_field='WishlistID')
    ShoeID = models.ForeignKey('Shoe', on_delete=models.CASCADE, to_field='ShoeID')
    
    def __str__(self):
        return f"WishlistItem: {self.WishlistID.name} - Shoe: {self.ShoeID.name}"