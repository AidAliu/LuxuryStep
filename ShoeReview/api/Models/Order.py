from django.db import models
from django.contrib.auth.models import User  

class Order(models.Model):
    OrderID = models.AutoField(primary_key=True)
    User = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_date = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_address = models.TextField(blank=True)
    PENDING = 'Pending'
    SHIPPED = 'Shipped'
    DELIVERED = 'Delivered'
    CANCELLED = 'Cancelled'

    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (SHIPPED, 'Shipped'),
        (DELIVERED, 'Delivered'),
        (CANCELLED, 'Cancelled'),
    ]
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default=PENDING)

    def __str__(self):
        return f"Order {self.OrderID} - {self.User.username}"

    def calculate_total_price(self):
        self.total_price = sum(item.quantity * item.price for item in self.items.all())
        self.save()

    def update_total_price(self):
        self.total_price = sum(item.price for item in self.items.all())
        self.save()

class OrderItem(models.Model):
    Order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='items')
    Shoe = models.ForeignKey('Shoe', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('Order', 'Shoe')

    def __str__(self):
        return f"Order {self.Order.OrderID} - Shoe {self.Shoe.ShoeID} (x{self.quantity})"
    
    def calculate_price(self):
        self.price = self.Shoe.price * self.quantity
        self.save()
    
    