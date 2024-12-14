from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Shoe, Brand, Category, Style
from .serializers import ShoeSerializer, BrandSerializer, CategorySerializer

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


# CRUD for Categories
class CategoryListCreateView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryDetailView(APIView):
    def get(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
            serializer = CategorySerializer(category)
            return Response(serializer.data)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
            serializer = CategorySerializer(category, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
            category.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)


# Shoes by Brand
class ShoesByBrandView(APIView):
    def get(self, request, brand_id):
        try:
            shoes = Shoe.objects.filter(brand_id=brand_id)
            serializer = ShoeSerializer(shoes, many=True)
            return Response(serializer.data)
        except Brand.DoesNotExist:
            return Response({'error': 'Brand not found'}, status=status.HTTP_404_NOT_FOUND)


# Shoes by Category
class ShoesByCategoryView(APIView):
    def get(self, request, category_id):
        try:
            shoes = Shoe.objects.filter(category_id=category_id)
            serializer = ShoeSerializer(shoes, many=True)
            return Response(serializer.data)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)


# Shoes by Style
class ShoesByStyleView(APIView):
    def get(self, request, style_id):
        try:
            shoes = Shoe.objects.filter(style_id=style_id)
            serializer = ShoeSerializer(shoes, many=True)
            return Response(serializer.data)
        except Style.DoesNotExist:
            return Response({'error': 'Style not found'}, status=status.HTTP_404_NOT_FOUND)
