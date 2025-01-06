from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Wishlist
from ..serializers import WishlistSerializer

# CRUD for Wishlist
class WishlistListCreateView(APIView):
    def get(self, request):
        wishlists = Wishlist.objects.all()
        serializer = WishlistSerializer(wishlists, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = WishlistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class WishlistDetailView(APIView):
    def get(self, request, pk):
        try:
            wishlist = Wishlist.objects.get(pk=pk)
            serializer = WishlistSerializer(wishlist)
            return Response(serializer.data)
        except Wishlist.DoesNotExist:
            return Response({'error': 'Wishlist not found'}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request, pk):
        try:
            wishlist = Wishlist.objects.get(pk=pk)
            serializer = WishlistSerializer(wishlist, data=request.data)  # Fix here
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Wishlist.DoesNotExist:
            return Response({'error': 'Wishlist not found'}, status=status.HTTP_404_NOT_FOUND)  # Fix here
        
    def delete(self, request, pk):  # Typo fixed
        try:
            wishlist = Wishlist.objects.get(pk=pk)
            wishlist.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Wishlist.DoesNotExist:
            return Response({'error': 'Wishlist not found'}, status=status.HTTP_404_NOT_FOUND)





