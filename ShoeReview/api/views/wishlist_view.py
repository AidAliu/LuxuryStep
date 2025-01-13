from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404
from ..models import Wishlist
from ..serializers import WishlistSerializer
from ..design_patterns.singleton_services import WishlistManagerSingleton

class WishlistListCreateView(APIView):
    def get(self, request):
        wishlists = Wishlist.objects.all()
        serializer = WishlistSerializer(wishlists, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        user = request.user
        name = request.data.get('name', f"{user.username}'s Wishlist")

        manager = WishlistManagerSingleton()
        try:
            new_wishlist = manager.create_wishlist(user, name)
            serializer = WishlistSerializer(new_wishlist)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class WishlistDetailView(APIView):
    def get(self, request, pk):
        manager = WishlistManagerSingleton()
        wishlist = manager.get_wishlist_by_id(pk)
        if not wishlist:
            return Response({'error': 'Wishlist not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    def put(self, request, pk):
        manager = WishlistManagerSingleton()
        updated_wishlist = manager.update_wishlist(pk, request.data)
        if not updated_wishlist:
            return Response({'error': 'Wishlist not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = WishlistSerializer(updated_wishlist)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    def delete(self, request, pk):
        manager = WishlistManagerSingleton()
        success = manager.delete_wishlist(pk)
        if success:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Wishlist not found'}, status=status.HTTP_404_NOT_FOUND)
