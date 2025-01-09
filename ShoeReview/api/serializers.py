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
    price = serializers.ReadOnlyField(source='Shoe.price')
    size = serializers.ReadOnlyField(source='Shoe.size')
    description = serializers.ReadOnlyField(source='Shoe.description')
    stock = serializers.ReadOnlyField(source='Shoe.stock')
    image_url = serializers.ReadOnlyField(source='Shoe.image_url.url')

    class Meta:
        model = WishlistItem
        fields = '__all__'

# Wishlist Serializer
class WishlistSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='User.username')  # Add username field
    items = WishlistItemSerializer(many=True, read_only=True)  # Nested WishlistItems

    class Meta:
        model = Wishlist
        fields = '__all__' 


class OrderItemSerializer(serializers.ModelSerializer):
    Shoe = serializers.PrimaryKeyRelatedField(queryset=Shoe.objects.all())  
    OrderID = serializers.ReadOnlyField(source='Order.OrderID')
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
    items = OrderItemSerializer(many=True, read_only=True)
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
        

        instance.shipping_address = validated_data.get('shipping_address', instance.shipping_address)
        instance.status = validated_data.get('status', instance.status)
       
       
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
    OrderID = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), source='Order')
    
    class Meta:
        model = Payment
        fields = '__all__'

def validate(self, data):
    user = self.context['request'].user
    print(f"Debug: Validating for User - {user.username}")
    print(f"Debug: Incoming Data for Validation - {data}")

    order_id = data.get("OrderID")
    if not Order.objects.filter(OrderID=order_id).exists():
        print(f"Debug: OrderID {order_id} does not exist in the database.")
        raise serializers.ValidationError({"OrderID": f"Order {order_id} does not exist."})

    # Validate amount
    amount = data.get("amount")
    if float(amount) <= 0:
        print(f"Debug: Invalid amount {amount}")
        raise serializers.ValidationError({"amount": "Amount must be greater than 0."})

    return data
















