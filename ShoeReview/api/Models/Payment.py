from django.db import models
from .Order import Order
from django.contrib.auth.models import User 


class Payment(models.Model):
    PaymentID = models.AutoField(primary_key=True)
    Order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    User = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)  # Renamed to `payment_method` for consistency
    payment_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.PaymentID}: {self.amount} by {self.User.username}"
