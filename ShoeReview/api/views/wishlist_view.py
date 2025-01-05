from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated  
from rest_framework.response import Response
from rest_framework import status
from ..models import Wishlist
from ..serializers import WishlistSerializer

# CRUD for Wishlist
class WishlistListCreateView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is logged in

    def get(self, request):
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        # Filter wishlists for the logged-in user
        wishlists = Wishlist.objects.filter(user=request.user)
        serializer = WishlistSerializer(wishlists, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Ensure request contains valid data
        serializer = WishlistSerializer(data=request.data)
        if serializer.is_valid():
            # Assign the logged-in user to the wishlist
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class WishlistDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Wishlist.objects.get(pk=pk, user=user)
        except Wishlist.DoesNotExist:
            return None

    def get(self, request, pk):
        wishlist = self.get_object(pk, request.user)
        if not wishlist:
            return Response({'error': 'Wishlist not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data)

    def put(self, request, pk):
        wishlist = self.get_object(pk, request.user)
        if not wishlist:
            return Response({'error': 'Wishlist not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = WishlistSerializer(wishlist, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        wishlist = self.get_object(pk, request.user)
        if not wishlist:
            return Response({'error': 'Wishlist not found'}, status=status.HTTP_404_NOT_FOUND)
        wishlist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, shoe_ShoeID):
        try:
            wishlists = Wishlist.objects.filter(id__in=wishlist_ids)
            serializer = WishlistSerializer(wishlists, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

