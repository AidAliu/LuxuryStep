from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import OrderItem  
from ..serializers import OrderItemSerializer  

class OrderItemListCreateView(APIView):
    def get(self, request):
        order_items = OrderItem.objects.all()
        serializer = OrderItemSerializer(order_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = OrderItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderItemDetailView(APIView):
    def get(self, request, pk):
        try:
            order_item = OrderItem.objects.get(pk=pk)
            serializer = OrderItemSerializer(order_item)
            return Response(serializer.data)
        except OrderItem.DoesNotExist:
            return Response({'error': 'OrderItem not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            order_item = OrderItem.objects.get(pk=pk)
            serializer = OrderItemSerializer(order_item, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except OrderItem.DoesNotExist:
            return Response({'error': 'OrderItem not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            order_item = OrderItem.objects.get(pk=pk)
            order_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except OrderItem.DoesNotExist:
            return Response({'error': 'OrderItem not found'}, status=status.HTTP_404_NOT_FOUND)
