from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Brand
from ..serializers import BrandSerializer

# CRUD for Brands
class BrandListCreateView(APIView):
    def get(self, request):
        brands = Brand.objects.all()
        serializer = BrandSerializer(brands, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BrandSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BrandDetailView(APIView):
    def get(self, request, pk):
        try:
            brand = Brand.objects.get(pk=pk)
            serializer = BrandSerializer(brand)
            return Response(serializer.data)
        except Brand.DoesNotExist:
            return Response({'error': 'Brand not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            brand = Brand.objects.get(pk=pk)
            serializer = BrandSerializer(brand, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Brand.DoesNotExist:
            return Response({'error': 'Brand not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            brand = Brand.objects.get(pk=pk)
            brand.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Brand.DoesNotExist:
            return Response({'error': 'Brand not found'}, status=status.HTTP_404_NOT_FOUND)
