from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ..models import Shoe
from ..serializers import ShoeSerializer

class ShoeListView(APIView):
    """
    View për listimin dhe krijimin e këpucëve.
    """
    def get(self, request):
        shoes = Shoe.objects.all()
        serializer = ShoeSerializer(shoes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
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
