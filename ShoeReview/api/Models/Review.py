from django.db import models
from django.contrib.auth.models import User  
from .Shoe import Shoe  

class Review(models.Model):
    ReviewID = models.AutoField(primary_key=True)
    User = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')  # Use Django's User model
    Shoe = models.ForeignKey(Shoe, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveIntegerField()  # Ensure rating is non-negative
    comment = models.TextField(blank=True)  # Allow comments to be optional

    def __str__(self):
        return f"{self.User.username}'s review of {self.Shoe.name}"
