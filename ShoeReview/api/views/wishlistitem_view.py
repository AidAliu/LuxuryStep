from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Wishlist, WishlistItem 
from ..serializers import WishlistItemSerializer

class WishlistItemListCreateView(APIView):
    def get(self, request):
        try:
            # Filter wishlist items for the logged-in user
            wishlist_items = WishlistItem.objects.filter(Wishlist__User=request.user)
            serializer = WishlistItemSerializer(wishlist_items, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request):
        try:
            # Retrieve the logged-in user's wishlist
            wishlist = Wishlist.objects.get(User=request.user)

            # Add the wishlist to the request data
            data = request.data.copy()
            data['Wishlist'] = wishlist.WishlistID  # Use the ID of the user's wishlist

            # Validate and save the wishlist item
            serializer = WishlistItemSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Wishlist.DoesNotExist:
            return Response({'error': 'User does not have a wishlist.'}, status=status.HTTP_404_NOT_FOUND)

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


