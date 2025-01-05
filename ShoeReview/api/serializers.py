from django.forms import ValidationError
from rest_framework import serializers
from django.contrib.auth.models import User
from django.db import transaction
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
    shoe_name = serializers.ReadOnlyField(source='Shoe.name')
    wishlist_name = serializers.ReadOnlyField(source='Wishlist.name')

    class Meta:
        model = WishlistItem
        fields = '__all__'

# WishlistItem Serializer
class WishlistItemSerializer(serializers.ModelSerializer):
    shoe_name = serializers.ReadOnlyField(source='Shoe.name')
    shoe_description = serializers.ReadOnlyField(source='Shoe.description')

    class Meta:
        model = WishlistItem
        fields = ['id', 'Wishlist', 'Shoe', 'shoe_name', 'shoe_description']  # Include necessary fields

# Wishlist Serializer
class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'User', 'name', 'items']

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


class OrderSerializer(serializers.ModelSerializer):
    User = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    username = serializers.CharField(source='User.username', read_only=True)
    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        user = validated_data.pop('User', None)
        if not user:
            user = self.context['request'].user  # Default to the authenticated user
        return Order.objects.create(User=user, **validated_data)

    def update(self, instance, validated_data):
        # Update the User field if included in the payload
        if 'User' in validated_data:
            instance.User = validated_data.pop('User')
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance




# Review Serializer
class ReviewSerializer(serializers.ModelSerializer):
    User = UserSerializer(read_only=True)  # Nested User details for reviews
    Shoe = serializers.PrimaryKeyRelatedField(queryset=Shoe.objects.all())  # Allow writable Shoe field

    class Meta:
        model = Review
        fields = '__all__'

    def create(self, validated_data):
        user = self.context['request'].user
        shoe = validated_data['Shoe']

        # Check if the user has already reviewed this shoe
        if Review.objects.filter(User=user, Shoe=shoe).exists():
            raise ValidationError("You have already reviewed this shoe.")

        return Review.objects.create(User=user, **validated_data)


# Style Serializer
class StyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Style
        fields = '__all__'

# Payment Serializer
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
