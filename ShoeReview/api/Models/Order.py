from django.db import models
from .User import User

class Order(models.Model):
    OrderID = models.AutoField(primary_key=True)
    UserID = models.ForeignKey(User, on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_address = models.TextField()
    status = models.CharField(max_length=50)

    def __str__(self):
        return f"Order {self.OrderID}"


class OrderItem(models.Model):
    OrderID = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    ShoeID = models.ForeignKey('Shoe', on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order {self.OrderID.OrderID} - Shoe {self.ShoeID.ShoeID}"
