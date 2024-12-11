from django.db import models
from .Brand import Brand
from .Style import Style
from .Category import Category

class Shoe(models.Model):
    Name = models.CharField(max_length=100)
    Brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    Style = models.ForeignKey(Style, on_delete=models.CASCADE)
    Category = models.ForeignKey(Category, on_delete=models.CASCADE)
    Price = models.DecimalField(max_digits=10, decimal_places=2)
    Size = models.DecimalField(max_digits=5, decimal_places=2)
    Stock = models.IntegerField()
    Description = models.TextField()
    ImageUrl = models.URLField()

    def __str__(self):
        return self.Name
