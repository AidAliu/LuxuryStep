from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import WishlistItem
from ..serializers import WishlistItemSerializer

class WishlistItemListCreateView(APIView):
    def get(self, request):
        wishlist_items = WishlistItem.objects.all()
        serializer = WishlistItemSerializer(wishlist_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = WishlistItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WishlistItemDetailView(APIView):
    def get(self, request, pk):
        try:
            wishlist_item = WishlistItem.objects.get(pk=pk)
            serializer = WishlistItemSerializer(wishlist_item)
            return Response(serializer.data)
        except WishlistItem.DoesNotExist:
            return Response({'error': 'WishlistItem not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            wishlist_item = WishlistItem.objects.get(pk=pk)
            serializer = WishlistItemSerializer(wishlist_item, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except WishlistItem.DoesNotExist:
            return Response({'error': 'WishlistItem not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            wishlist_item = WishlistItem.objects.get(pk=pk)
            wishlist_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except WishlistItem.DoesNotExist:
            return Response({'error': 'WishlistItem not found'}, status=status.HTTP_404_NOT_FOUND)


