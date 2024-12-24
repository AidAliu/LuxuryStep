from django.db import models
from .Order import Order
from .User import User

class Payment(models.Model):
    PaymentID = models.AutoField(primary_key=True)
    OrderID = models.ForeignKey(Order, on_delete=models.CASCADE)
    UserID = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paymentMethod = models.CharField(max_length=50)
    paymentDate = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.PaymentID}"
