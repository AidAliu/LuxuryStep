from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from ..models import Payment, Order
from ..serializers import PaymentSerializer
from ..design_patterns.singleton_services import PaymentManagerSingleton, OrderManagerSingleton

class PaymentListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        payments = Payment.objects.all()
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        data = request.data.copy()
        order_id = data.get('OrderID')

        print(f"Debug: Received Payment Data - {data}")

        order_manager = OrderManagerSingleton()
        order = order_manager.get_order_by_id(order_id)
        if not order or order.User != user or order.status != 'Pending':
            return Response({"error": "No pending order found for this user."}, status=status.HTTP_400_BAD_REQUEST)

        payment_manager = PaymentManagerSingleton()
        try:
            payment = payment_manager.create_payment(
                order=order,
                user=user,
                amount=float(data.get('amount', 0)),
                payment_method=data.get('payment_method', 'Cash')
            )
        except Exception as e:
            print(f"Debug: Payment creation error - {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        print(f"Debug: Payment Created - PaymentID: {payment.PaymentID}")

        order.status = 'Shipped'
        order.shipping_address = data.get('shipping_address', order.shipping_address)
        order.save()

        new_order = order_manager.create_order(user, status='Pending')

        payment_serializer = PaymentSerializer(payment)
        return Response(
            {
                "message": "Payment successful! Order completed.",
                "payment": payment_serializer.data,
                "new_order": new_order.OrderID,
            },
            status=status.HTTP_201_CREATED,
        )


class PaymentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """
        GET: single payment detail using PaymentManagerSingleton
        """
        manager = PaymentManagerSingleton()
        payment = manager.get_payment_by_id(pk)
        if not payment:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PaymentSerializer(payment)
        return Response(serializer.data)

    def put(self, request, pk):
        manager = PaymentManagerSingleton()
        updated_payment = manager.update_payment(pk, request.data)
        if not updated_payment:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PaymentSerializer(updated_payment)
        return Response(serializer.data)

    def delete(self, request, pk):
        manager = PaymentManagerSingleton()
        success = manager.delete_payment(pk)
        if success:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)


class PaymentAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        print(f"Debug: Authenticated User - {user.username}")
        print(f"Debug: Incoming Data - {request.data}")

        data = request.data
        order_id = data.get('OrderID')

        order_manager = OrderManagerSingleton()
        order = order_manager.get_order_by_id(order_id)
        if not order or order.User != user:
            return Response({"error": "Order not found or does not belong to user."}, status=status.HTTP_400_BAD_REQUEST)

        payment_manager = PaymentManagerSingleton()
        try:
            payment = payment_manager.create_payment(
                order=order,
                user=user,
                amount=float(data.get('amount', 0)),
                payment_method=data.get('payment_method', 'Cash')
            )
        except Exception as e:
            print(f"Debug: Payment creation error - {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = PaymentSerializer(payment)
        return Response(serializer.data, status=201)
