from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Payment, Order, OrderItem
from ..serializers import PaymentSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

class PaymentListCreateView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure user is authenticated

    def get(self, request, *args, **kwargs):
        # Retrieve all Payment objects
        payments = Payment.objects.all()
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user  # Authenticated user
        data = request.data.copy()  # Make a copy of the incoming data
        order_id = data.get('OrderID')

        # Log the incoming data for debugging
        print(f"Debug: Received Payment Data - {data}")

        try:
            # Fetch the pending order
            order = Order.objects.get(OrderID=order_id, User=user, status='Pending')
            data['Order'] = order.OrderID  # Use OrderID explicitly
        except Order.DoesNotExist:
            return Response({"error": "No pending order found for this user."}, status=status.HTTP_400_BAD_REQUEST)

        # Attach authenticated user to the data
        data['User'] = user.id

        serializer = PaymentSerializer(data=data, context={'request': request})

        if serializer.is_valid():
            payment = serializer.save()  # Save the payment record
            print(f"Debug: Payment Created - PaymentID: {payment.PaymentID}")  # Log payment creation

            # Update the order to "Shipped"
            order.status = 'Shipped'
            order.shipping_address = data.get('shipping_address', order.shipping_address)
            order.save()

            # Optionally create a new pending order for the user
            new_order = Order.objects.create(User=user, status='Pending')
            print(f"Debug: New Order Created - OrderID: {new_order.OrderID}")

            return Response(
                {
                    "message": "Payment successful! Order completed.",
                    "payment": serializer.data,
                    "new_order": new_order.OrderID,
                },
                status=status.HTTP_201_CREATED,
            )

        # Log serializer errors
        print(f"Debug: Serializer Errors - {serializer.errors}")
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


class PaymentAPIView(APIView):
    authentication_classes = [TokenAuthentication]  # If you're using TokenAuthentication
    permission_classes = [IsAuthenticated]  # Ensure user is authenticated

    def post(self, request, *args, **kwargs):
        user = request.user  # Check if the user is being set correctly
        print(f"Debug: Authenticated User - {user.username}")  # Log the user
        print(f"Debug: Incoming Data - {request.data}") 
      
        serializer = PaymentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            print(f"Debug: Serializer Validated Data - {serializer.validated_data}")  
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            print(f"Debug: Serializer Errors - {serializer.errors}")  # Log errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
