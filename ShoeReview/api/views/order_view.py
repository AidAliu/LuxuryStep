from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated

from ..models import Order, OrderItem, Shoe
from ..serializers import OrderSerializer, OrderItemSerializer
from ..design_patterns.singleton_services import (
    OrderManagerSingleton,
    OrderItemManagerSingleton
)

class ActiveOrderView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        order_manager = OrderManagerSingleton()

        order = order_manager.get_or_create_active_order(user)

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OrderListCreateView(APIView):
    def get(self, request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Create a new order using OrderManagerSingleton + factory.
        (Replacing the direct serializer.save() approach with a Singleton call)
        """
        data = request.data
        print("Incoming data:", data)

        status_val = data.get('status', 'Pending')
        shipping_address_val = data.get('shipping_address', '')

        try:
            order_manager = OrderManagerSingleton()
            user = request.user

            new_order = order_manager.create_order(
                user=user,
                status=status_val,
                shipping_address=shipping_address_val
            )

            serializer = OrderSerializer(new_order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("Error creating order:", str(e))
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class OrderDetailView(APIView):
    def get(self, request, pk):
        manager = OrderManagerSingleton()
        order = manager.get_order_by_id(pk)
        if not order:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        manager = OrderManagerSingleton()
        updated_order = manager.update_order(pk, request.data)
        if not updated_order:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = OrderSerializer(updated_order)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        manager = OrderManagerSingleton()
        success = manager.delete_order(pk)
        if success:
            return Response({'message': 'Order deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)


class AddToOrderView(APIView):
    """
    Add an item to the user's active order (Pending status). Creates the order if it doesn't exist.
    """
    def post(self, request):
        user = request.user

        order_manager = OrderManagerSingleton()
        order = order_manager.get_or_create_active_order(user)

        shoe_id = request.data.get('shoe_id')
        quantity = request.data.get('quantity', 1)

        shoe = get_object_or_404(Shoe, ShoeID=shoe_id)

        existing_item = OrderItem.objects.filter(Order=order, Shoe=shoe).first()
        if existing_item:
            from ..design_patterns.singleton_services import OrderItemManagerSingleton
            item_manager = OrderItemManagerSingleton()

            new_quantity = existing_item.quantity + int(quantity)
            updated_data = {
                'quantity': new_quantity,
                'price': shoe.price * new_quantity
            }
            item_manager.update_order_item(existing_item.pk, updated_data)

        else:
            # Create a new item via the OrderItemManagerSingleton
            from ..design_patterns.singleton_services import OrderItemManagerSingleton
            item_manager = OrderItemManagerSingleton()
            item_manager.create_order_item(
                order=order,
                shoe=shoe,
                quantity=int(quantity),
                price=shoe.price * int(quantity)
            )

        # Update the total price in the order
        order.total_price = sum(item.price for item in order.items.all())
        order.save()

        return Response({"message": "Item added to order", "order_id": order.OrderID}, status=status.HTTP_200_OK)


class RemoveFromOrderView(APIView):
    """
    Remove an item from the user's active order.
    """
    def delete(self, request, order_item_id):
        user = request.user

        order_item = OrderItem.objects.filter(
            id=order_item_id,
            Order__User=user,
            Order__status='Pending'
        ).first()

        if not order_item:
            return Response({"error": "OrderItem not found"}, status=status.HTTP_404_NOT_FOUND)

        from ..design_patterns.singleton_services import OrderItemManagerSingleton
        item_manager = OrderItemManagerSingleton()
        item_manager.delete_order_item(order_item.id)

        order = order_item.Order
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
            manager = OrderManagerSingleton()
            order = manager.get_order_by_id(OrderID)
            if not order or order.User != request.user or order.status != 'Pending':
                return Response({'error': 'Order not found or not pending.'}, status=status.HTTP_404_NOT_FOUND)

            shipping_address = request.data.get('shipping_address')
            if not shipping_address:
                return Response({'error': 'Shipping address is required.'}, status=status.HTTP_400_BAD_REQUEST)

            order = manager.finalize_order(order, shipping_address)
            return Response({'message': 'Order finalized successfully.'}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PurchaseOrderView(APIView):
    """
    Complete the purchase of a confirmed order, updating its status to 'Shipped' or 'Delivered'.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, OrderID):
        try:
            manager = OrderManagerSingleton()
            order = manager.get_order_by_id(OrderID)

            if not order or order.User != request.user or order.status != 'Confirmed':
                return Response({'error': 'Order not found or not confirmed.'}, status=status.HTTP_404_NOT_FOUND)

            shipping_address = request.data.get('shipping_address')
            if not shipping_address:
                return Response({'error': 'Shipping address is required.'}, status=status.HTTP_400_BAD_REQUEST)

            print(f"Purchase request: OrderID={OrderID}, Shipping Address={shipping_address}")

            order.shipping_address = shipping_address
            order.status = 'Shipped'  
            order.save()
            manager._order_cache[order.OrderID] = order  

            return Response({'message': 'Purchase successful. Order is now shipped.'}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
