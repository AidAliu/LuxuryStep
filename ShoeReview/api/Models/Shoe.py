from django.db import models
from .Brand import Brand
from .Style import Style
from .Category import Category

class Shoe(models.Model):
    name = models.CharField(max_length=255)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    style = models.ForeignKey(Style, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    size = models.FloatField()
    stock = models.PositiveIntegerField()
    description = models.TextField()
    image_url = models.URLField()

    def __str__(self):
        return self.name
