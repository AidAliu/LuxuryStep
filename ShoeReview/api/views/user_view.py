from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ..models import User
from ..serializers import UserSerializer
from django.core.exceptions import PermissionDenied
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_control_panel_data(request):
    if not request.user.is_admin:
        return Response({"error": "Unauthorized access."}, status=403)

    # Mock control panel data - Replace with actual queries
    data = {
        "total_users": User.objects.count(),
        "total_orders": 45,  # Replace with actual query
        "total_payments": 67,  # Replace with actual query
        "recent_payments": [
            {"id": 1, "amount": 200, "paymentMethod": "Credit Card"},
            {"id": 2, "amount": 150, "paymentMethod": "PayPal"}
        ]
    }
    return Response(data)

class UserListView(APIView):
    """
    View to handle listing and creating users.
    - GET: Retrieve all users (restricted to admins).
    - POST: Create a new user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Restrict access to admins only
        if not request.user.is_admin:
            raise PermissionDenied("Only admins can view the user list.")
        
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Allow admins to create users
        if not request.user.is_admin:
            raise PermissionDenied("Only admins can create users.")
        
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    """
    View to handle retrieving, updating, and deleting a single user.
    - GET: Retrieve details of a specific user.
    - PUT: Update user details.
    - DELETE: Delete a user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        # Restrict access to admins or the user themselves
        try:
            user = User.objects.get(pk=pk)
            if not (request.user.is_admin or request.user == user):
                raise PermissionDenied("You are not authorized to view this user's details.")
            
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        # Restrict access to admins or the user themselves
        try:
            user = User.objects.get(pk=pk)
            if not (request.user.is_admin or request.user == user):
                raise PermissionDenied("You are not authorized to update this user's details.")
            
            serializer = UserSerializer(user, data=request.data, partial=True)  # Allows partial updates
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        # Restrict access to admins only
        try:
            user = User.objects.get(pk=pk)
            if not request.user.is_admin:
                raise PermissionDenied("Only admins can delete users.")
            
            user.delete()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        