from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Payment, Order, OrderItem
from ..serializers import PaymentSerializer
from rest_framework.permissions import IsAuthenticated

class PaymentListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET: list all payments
        """
        payments = Payment.objects.all()
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)

    def post(self, request):
        """
        POST: create a new payment and process the associated order
        """
        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            # Save the payment record
            payment = serializer.save()

            # Fetch the order ID from the payment data (assuming it's included in the payment)
            order_id = serializer.validated_data.get('order_id')
            try:
                order = Order.objects.get(OrderID=order_id, User=request.user)

                if order.status != 'Pending':
                    return Response(
                        {"error": "This order has already been processed."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # Mark the order as completed
                order.status = 'Completed'
                order.save()

                # Clear the associated cart items
                OrderItem.objects.filter(Order=order).delete()

                return Response(
                    {
                        "message": "Payment successful! Order completed, and your cart has been cleared.",
                        "payment": serializer.data,
                    },
                    status=status.HTTP_201_CREATED,
                )
            except Order.DoesNotExist:
                return Response(
                    {"error": "Order not found or access denied."},
                    status=status.HTTP_404_NOT_FOUND,
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PaymentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """
        GET: single payment detail
        """
        try:
            payment = Payment.objects.get(pk=pk)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PaymentSerializer(payment)
        return Response(serializer.data)

    def put(self, request, pk):
        """
        PUT: update an existing payment
        """
        try:
            payment = Payment.objects.get(pk=pk)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PaymentSerializer(payment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        DELETE: delete a payment
        """
        try:
            payment = Payment.objects.get(pk=pk)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)

        payment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
