from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Shoe
from ..serializers import ShoeSerializer

# CRUD for Shoes
class ShoeListView(APIView):
    def get(self, request):
        shoes = Shoe.objects.all()
        serializer = ShoeSerializer(shoes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ShoeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ShoeDetailView(APIView):
    def get(self, request, pk):
        try:
            shoe = Shoe.objects.get(pk=pk)
            serializer = ShoeSerializer(shoe)
            return Response(serializer.data)
        except Shoe.DoesNotExist:
            return Response({'error': 'Shoe not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            shoe = Shoe.objects.get(pk=pk)
            serializer = ShoeSerializer(shoe, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Shoe.DoesNotExist:
            return Response({'error': 'Shoe not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            shoe = Shoe.objects.get(pk=pk)
            shoe.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Shoe.DoesNotExist:
            return Response({'error': 'Shoe not found'}, status=status.HTTP_404_NOT_FOUND)
