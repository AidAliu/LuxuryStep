# file: order_item_view.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ..models import OrderItem, Order
from ..serializers import OrderItemSerializer
from ..design_patterns.singleton_services import OrderItemManagerSingleton, OrderManagerSingleton
from ..models import Shoe  

class OrderItemListCreateView(APIView):
    def get(self, request):
        order_items = OrderItem.objects.all()
        serializer = OrderItemSerializer(order_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            user = request.user
            order_manager = OrderManagerSingleton()
            active_order = order_manager.get_or_create_active_order(user)

        except Exception:
            return Response({'error': 'No active order found for this user.'}, status=status.HTTP_400_BAD_REQUEST)

        shoe_id = request.data.get("Shoe")
        quantity = int(request.data.get("quantity", 1))

        shoe = get_object_or_404(Shoe, ShoeID=shoe_id)

        item_manager = OrderItemManagerSingleton()
        order_item = item_manager.create_order_item(
            order=active_order,
            shoe=shoe,
            quantity=quantity,
            price=None 
        )

        serializer = OrderItemSerializer(order_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class OrderItemDetailView(APIView):
    def get(self, request, pk):
        item_manager = OrderItemManagerSingleton()
        order_item = item_manager.get_order_item_by_id(pk)
        if not order_item:
            return Response({'error': 'OrderItem not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderItemSerializer(order_item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        item_manager = OrderItemManagerSingleton()
        updated_item = item_manager.update_order_item(pk, request.data)
        if not updated_item:
            return Response({'error': 'OrderItem not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderItemSerializer(updated_item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        item_manager = OrderItemManagerSingleton()
        success = item_manager.delete_order_item(pk)
        if success:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'error': 'OrderItem not found'}, status=status.HTTP_404_NOT_FOUND)
