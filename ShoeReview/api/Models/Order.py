from django.db import models
from .User import User
from .Shoe import Shoe

class Order(models.Model):
    User = models.ForeignKey(User, on_delete=models.CASCADE)
    OrderDate = models.DateTimeField(auto_now_add=True)
    PaymentMethod = models.CharField(max_length=50)
    TotalPrice = models.DecimalField(max_digits=10, decimal_places=2)
    ShippingAddress = models.TextField()
    Status = models.CharField(max_length=50)

class OrderItem(models.Model):
    Order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='Items')
    Shoe = models.ForeignKey(Shoe, on_delete=models.CASCADE)
    Quantity = models.IntegerField()
    Price = models.DecimalField(max_digits=10, decimal_places=2)