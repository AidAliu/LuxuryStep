from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Shoe, 
    Brand, 
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
    Shoe = serializers.PrimaryKeyRelatedField(queryset=Shoe.objects.all())  

    class Meta:
        model = OrderItem
        fields = '__all__'

    # Validation for quantity
    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0.")
        return value

    # Validation for price
    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be a positive number.")
        return value


# Order Serializer
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = '__all__'

    # Custom validation for items field
    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Order must contain at least one item.")
        return value

    # Create method: Handles creation of an Order and its associated OrderItems
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])  # Extract items from validated data
        order = Order.objects.create(**validated_data)  # Create the Order instance
        total_price = 0 

        # Loop through items data to create associated OrderItems
        for item_data in items_data:
            item = OrderItem.objects.create(Order=order, **item_data)
            total_price += item.price * item.quantity  # Update total price

        order.total_price = total_price  # Set the computed total price
        order.save()  # Save the Order with the updated total price
        return order

    # Update method: Handles updating of an Order and its associated OrderItems
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', [])  # Extract items from validated data

        # Update fields for the Order instance
        instance.status = validated_data.get('status', instance.status)
        instance.shipping_address = validated_data.get('shipping_address', instance.shipping_address)
        instance.save()

        # Clear existing OrderItems and calculate the new total price
        instance.items.all().delete()  # Delete all related OrderItems
        total_price = 0  # Initialize total price
        for item_data in items_data:
            item = OrderItem.objects.create(Order=instance, **item_data)
            total_price += item.price * item.quantity  # Update total price

        instance.total_price = total_price  # Set the computed total price
        instance.save()  # Save the Order with updated total price
        return instance

# Review Serializer
class ReviewSerializer(serializers.ModelSerializer):
    User = UserSerializer(read_only=True)  # Nested User details for reviews
    Shoe = serializers.PrimaryKeyRelatedField(queryset=Shoe.objects.all())  # Allow writable Shoe field

    class Meta:
        model = Review
        fields = '__all__'

    def create(self, validated_data):
        # Automatically set the User as the authenticated user
        user = self.context['request'].user
        return Review.objects.create(User=user, **validated_data)


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
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
