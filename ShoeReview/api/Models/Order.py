from django.db import models
from django.contrib.auth.models import User  

class Order(models.Model):
    OrderID = models.AutoField(primary_key=True)
    User = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')  
    order_date = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_address = models.TextField()
    status = models.CharField(max_length=50, choices=[
        ('Pending', 'Pending'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled')
    ], default='Pending')

    def __str__(self):
        return f"Order {self.OrderID} - {self.User.username}"


class OrderItem(models.Model):
    Order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    Shoe = models.ForeignKey('Shoe', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order {self.Order.OrderID} - Shoe {self.Shoe.id}"
