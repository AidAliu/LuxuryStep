from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from ..models import Wishlist, WishlistItem, Shoe
from ..serializers import WishlistItemSerializer
from ..design_patterns.singleton_services import (
    WishlistItemManagerSingleton,
)

class WishlistItemListCreateView(APIView):
    def get(self, request):
        try:
            wishlist_items = WishlistItem.objects.filter(Wishlist__User=request.user)
            serializer = WishlistItemSerializer(wishlist_items, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request):
        try:
            wishlist = Wishlist.objects.get(User=request.user)
        except Wishlist.DoesNotExist:
            return Response({'error': 'User does not have a wishlist.'}, status=status.HTTP_404_NOT_FOUND)

        shoe_id = request.data.get('Shoe')
        if not shoe_id:
            return Response({'error': 'Shoe ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        from ..models import Shoe
        shoe = get_object_or_404(Shoe, pk=shoe_id)

        item_manager = WishlistItemManagerSingleton()
        try:
            new_item = item_manager.create_wishlist_item(wishlist, shoe)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = WishlistItemSerializer(new_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class WishlistItemDetailView(APIView):
    def get(self, request, pk):
        manager = WishlistItemManagerSingleton()
        item = manager.get_wishlist_item_by_id(pk)
        if not item:
            return Response({'error': 'WishlistItem not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = WishlistItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        manager = WishlistItemManagerSingleton()
        updated_item = manager.update_wishlist_item(pk, request.data)
        if not updated_item:
            return Response({'error': 'WishlistItem not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = WishlistItemSerializer(updated_item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        manager = WishlistItemManagerSingleton()
        success = manager.delete_wishlist_item(pk)
        if success:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'error': 'WishlistItem not found'}, status=status.HTTP_404_NOT_FOUND)
