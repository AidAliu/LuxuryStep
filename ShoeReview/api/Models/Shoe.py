from django.db import models
from .Brand import Brand
from .Style import Style

class Shoe(models.Model):
    ShoeID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    BrandID = models.ForeignKey(Brand, on_delete=models.CASCADE)
    StyleID = models.ForeignKey(Style, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    size = models.FloatField()
    stock = models.PositiveIntegerField()
    description = models.TextField()
    image_url = models.URLField()

    def __str__(self):
        return self.name
