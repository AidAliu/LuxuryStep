# file: brand_view.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from ..models import Brand
from ..serializers import BrandSerializer
from ..design_patterns.singleton_services import BrandManagerSingleton

class BrandListCreateView(APIView):
    def get(self, request):
        """
        Retrieve all brands (same as before).
        We can still do direct queries or use the singleton if you want caching.
        """
        brands = Brand.objects.all()
        serializer = BrandSerializer(brands, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Create a new brand using BrandManagerSingleton, which calls the BrandFactory.
        """
        data = request.data
        brand_manager = BrandManagerSingleton()

        try:
            new_brand = brand_manager.create_brand(
                name=data.get("name"),
                description=data.get("description"),
                website_url=data.get("website_url")
            )
            serializer = BrandSerializer(new_brand)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class BrandDetailView(APIView):
    def get(self, request, pk):
        """
        Retrieve a specific brand by ID, using the singleton for optional caching.
        """
        brand_manager = BrandManagerSingleton()
        brand = brand_manager.get_brand_by_id(pk)
        if not brand:
            return Response({"error": "Brand not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = BrandSerializer(brand)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """
        Update a brand by ID. Use the singleton's update method.
        """
        brand_manager = BrandManagerSingleton()
        updated_brand = brand_manager.update_brand(pk, request.data)
        if not updated_brand:
            return Response({"error": "Brand not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = BrandSerializer(updated_brand)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        """
        Delete a brand by ID via the singleton's delete method.
        """
        brand_manager = BrandManagerSingleton()
        success = brand_manager.delete_brand(pk)
        if success:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "Brand not found"}, status=status.HTTP_404_NOT_FOUND)
