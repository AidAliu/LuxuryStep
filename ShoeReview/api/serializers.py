from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Shoe, 
    Brand, 
    Category, 
    Wishlist, 
    WishlistItem, 
    Order, 
    OrderItem, 
    Review, 
    Style,
    Payment
)

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

# Shoe Serializer
class ShoeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shoe
        fields = '__all__'

# Brand Serializer
class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'

# Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

# WishlistItem Serializer
class WishlistItemSerializer(serializers.ModelSerializer):
    Shoe = ShoeSerializer(read_only=True)  # Nested Shoe details for wishlist items

    class Meta:
        model = WishlistItem
        fields = '__all__'

# Wishlist Serializer
class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)  # Nested WishlistItems

    class Meta:
        model = Wishlist
        fields = '__all__'

# OrderItem Serializer
class OrderItemSerializer(serializers.ModelSerializer):
    Shoe = ShoeSerializer(read_only=True)  # Nested Shoe details for order items

    class Meta:
        model = OrderItem
        fields = '__all__'

# Order Serializer
class OrderSerializer(serializers.ModelSerializer):
    Items = OrderItemSerializer(many=True, read_only=True)  # Nested OrderItems

    class Meta:
        model = Order
        fields = '__all__'

# Review Serializer
class ReviewSerializer(serializers.ModelSerializer):
    User = UserSerializer(read_only=True)  # Nested User details for reviews
    Shoe = ShoeSerializer(read_only=True)  # Nested Shoe details for reviews

    class Meta:
        model = Review
        fields = '__all__'

# Style Serializer
class StyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Style
        fields = '__all__'

# PaymentSerializer
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
