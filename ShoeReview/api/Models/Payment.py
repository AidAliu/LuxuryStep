from django.db import models
from django.contrib.auth.models import User

class Payment(models.Model):
    PaymentID = models.AutoField(primary_key=True)
    Order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='payments')
    User = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    CASH = 'Cash'
    CARD = 'Card'
    PAYPAL = 'PayPal'

    PAYMENT_METHOD_CHOICES = [
        (CASH, 'Cash'),
        (CARD, 'Card'),
        (PAYPAL, 'PayPal'),
    ]
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES)
    payment_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.PaymentID}: {self.amount} by {self.User.username}"
