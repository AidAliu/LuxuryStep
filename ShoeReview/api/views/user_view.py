# file: api/views/user_view.py

from django.contrib.auth.models import User
from django.db import IntegrityError
from django.core.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ..serializers import UserSerializer

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('firstName')
        last_name = request.data.get('lastName')

        if not all([username, email, password, first_name, last_name]):
            return Response(
                {"error": "All fields are required: username, email, password, firstName, lastName."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if User.objects.filter(username=username).exists():
                return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(email=email).exists():
                return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            return Response(
                {
                    "message": "User registered successfully.",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name
                    }
                },
                status=status.HTTP_201_CREATED
            )
        except IntegrityError as e:
            return Response(
                {"error": "Database error while creating the user.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            return Response(
                {"error": "Unexpected error.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_control_panel_data(request):
    try:
        if not request.user.is_staff:
            return Response({"error": "Unauthorized."}, status=403)

        total_users = User.objects.count()

        # Example models: replace with actual models used in your project
        from api.models import Order, Payment
        total_orders = Order.objects.count()
        total_payments = Payment.objects.count()

        recent_payments = Payment.objects.order_by('PaymentID')[:5]
        recent_payments_data = [
            {"id": payment.PaymentID, "amount": payment.amount, "paymentMethod": payment.payment_method}
            for payment in recent_payments
        ]

        data = {
            "total_users": total_users,
            "total_orders": total_orders,
            "total_payments": total_payments,
            "recent_payments": recent_payments_data,
        }
        return Response(data)

    except Exception as e:
        # Log the error
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error in control panel data: {e}")
        return Response({"error": "Internal Server Error", "details": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    user = request.user
    data = {
        "username": user.username,
        "email": user.email,
        "is_staff": user.is_staff,
    }
    return Response(data)

class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            raise PermissionDenied("Only staff can view users.")
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_staff:
            raise PermissionDenied("Only staff can create users.")
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            if not (request.user.is_staff or request.user == user):
                raise PermissionDenied("Not authorized.")
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            if not (request.user.is_staff or request.user == user):
                raise PermissionDenied("Not authorized.")
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            if not request.user.is_staff:
                raise PermissionDenied("Only staff can delete users.")
            user.delete()
            return Response({"message": "User deleted."}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
