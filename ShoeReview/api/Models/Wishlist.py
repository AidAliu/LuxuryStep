from django.db import models
from django.contrib.auth.models import User 
from .Shoe import Shoe  


class Wishlist(models.Model):
    """
    Represents a wishlist created by a user.
    """
    WishlistID = models.AutoField(primary_key=True)
    User = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlists')  
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"Wishlist: {self.name} (User: {self.User.username})"


class WishlistItem(models.Model):
    """
    Represents an item in a user's wishlist.
    """
    Wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE, related_name='items')  # Reference Wishlist
    Shoe = models.ForeignKey(Shoe, on_delete=models.CASCADE, related_name='wishlist_items')  # Reference Shoe

    def __str__(self):
        return f"WishlistItem: {self.Wishlist.name} - Shoe: {self.Shoe.name}"
