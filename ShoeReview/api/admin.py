from django.contrib import admin
from .models import Shoe, Brand, Style, Category, Wishlist, WishlistItem, Order, OrderItem, Review

admin.site.register(Shoe)
admin.site.register(Brand)
admin.site.register(Style)
admin.site.register(Category)
admin.site.register(Wishlist)
admin.site.register(WishlistItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Review)
