from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ..models import Order, OrderItem, Shoe
from ..serializers import OrderSerializer, OrderItemSerializer
from rest_framework.permissions import IsAuthenticated

class ActiveOrderView(APIView):
    """
    Retrieve or create the active (Pending) order for the user.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user

        # Check if the user has an active order
        order = Order.objects.filter(User=user, status='Pending').first()

        if not order:
            order = Order.objects.create(User=user, status='Pending', total_price=0)

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)            

class OrderListCreateView(APIView):
    """
    Handles retrieving all orders and creating a new order.
    """
    def get(self, request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Log the incoming request data for debugging
        print("Incoming data:", request.data)

        # Pass the request context to the serializer
        serializer = OrderSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # Log serializer errors for debugging
        print("Serializer errors:", serializer.errors)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderDetailView(APIView):
    """
    Handles retrieving, updating, and deleting a specific order.
    """
    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        serializer = OrderSerializer(order, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        order.delete()
        return Response({'message': 'Order deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
class AddToOrderView(APIView):
    """
    Add an item to the user's active order (Pending status). Creates the order if it doesn't exist.
    """
    def post(self, request):
        user = request.user

        # Check if the user has an active (Pending) order
        order, created = Order.objects.get_or_create(User=user, status='Pending')

        # Extract data from the request
        shoe_id = request.data.get('shoe_id')
        quantity = request.data.get('quantity', 1)

        # Validate Shoe existence
        shoe = get_object_or_404(Shoe, ShoeID=shoe_id)

        # This block handles the creation or update of an OrderItem
        order_item = OrderItem.objects.filter(Order=order, Shoe=shoe).first()
        if order_item:
            # Update existing item
            order_item.quantity += quantity
            order_item.price = shoe.price * order_item.quantity
        else:
            # Create new item
            order_item = OrderItem.objects.create(
                Order=order,
                Shoe=shoe,
                quantity=quantity,
                price=shoe.price * quantity,
            )

        order_item.save()

        # Update the total price in the Order
        order.total_price = sum(item.price for item in order.items.all())
        order.save()

        return Response({"message": "Item added to order", "order_id": order.OrderID}, status=status.HTTP_200_OK)

class RemoveFromOrderView(APIView):
    """
    Remove an item from the user's active order.
    """
    def delete(self, request, order_item_id):
        user = request.user

        # Find the item in the active order
        order_item = get_object_or_404(OrderItem, id=order_item_id, Order__User=user, Order__status='Pending')

        # Remove the item
        order = order_item.Order
        order_item.delete()

        # Recalculate the total price
        order.total_price = sum(item.price for item in order.items.all())
        order.save()

        return Response({"message": "Item removed from order"}, status=status.HTTP_200_OK)

class FinalizeOrderView(APIView):
    """
    Finalize the user's current (Pending) order by updating its status to 'Confirmed'.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, OrderID):
        try:
            # Retrieve the order using OrderID
            order = get_object_or_404(Order, OrderID=OrderID, User=request.user, status='Pending')

            # Ensure shipping address is provided
            shipping_address = request.data.get('shipping_address')
            if not shipping_address:
                return Response({'error': 'Shipping address is required.'}, status=status.HTTP_400_BAD_REQUEST)

            # Update the order details
            order.shipping_address = shipping_address
            order.status = 'Confirmed'
            order.save()

            return Response({'message': 'Order finalized successfully.'}, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found or not pending.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Log the error for debugging
            print(f"Unexpected error: {str(e)}")
            return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PurchaseOrderView(APIView):
    """
    Complete the purchase of a confirmed order, updating its status to 'Shipped' or 'Delivered'.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, OrderID):
        try:
            # Retrieve the confirmed order using OrderID
            order = get_object_or_404(Order, OrderID=OrderID, User=request.user, status='Confirmed')

            # Ensure shipping address is provided
            shipping_address = request.data.get('shipping_address')
            if not shipping_address:
                return Response({'error': 'Shipping address is required.'}, status=status.HTTP_400_BAD_REQUEST)

            # Log the request for debugging
            print(f"Purchase request: OrderID={OrderID}, Shipping Address={shipping_address}")

            # Update order details
            order.shipping_address = shipping_address
            order.status = 'Shipped'  # Or another appropriate status like 'Delivered'
            order.save()

            return Response({'message': 'Purchase successful. Order is now shipped.'}, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found or not confirmed.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Log the error for debugging
            print(f"Unexpected error: {str(e)}")
            return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
