from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from ..models import Shoe
from ..serializers import ShoeSerializer

class ShoeListView(APIView):
    """
    Handles listing all shoes and creating new shoes (restricted to staff users).
    """
    permission_classes = [IsAuthenticated]  # Ensure user is authenticated

    def get(self, request):
        """
        Retrieve all shoes.
        """
        try:
            shoes = Shoe.objects.all()
            serializer = ShoeSerializer(shoes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        """
        Add a new shoe (staff-only).
        """
        if not request.user.is_staff:  # Restrict to staff
            return Response({'error': 'Only staff members can add shoes'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ShoeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ShoeDetailView(APIView):
    """
    View për marrjen, përditësimin dhe fshirjen e një këpuce të veçantë.
    """
    def get(self, request, pk):
        shoe = get_object_or_404(Shoe, pk=pk)
        serializer = ShoeSerializer(shoe)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        shoe = get_object_or_404(Shoe, pk=pk)
        serializer = ShoeSerializer(shoe, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        shoe = get_object_or_404(Shoe, pk=pk)
        shoe.delete()
        return Response({'message': 'Shoe deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
