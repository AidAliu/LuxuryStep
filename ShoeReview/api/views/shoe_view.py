# file: shoe_view.py

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from ..models import Shoe, Brand, Style
from ..serializers import ShoeSerializer
from ..design_patterns.singleton_services import ShoeManagerSingleton

class ShoeListView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        try:
            shoes = Shoe.objects.all()
            serializer = ShoeSerializer(shoes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        if not request.user.is_staff: 
            return Response({'error': 'Only staff members can add shoes'}, status=status.HTTP_403_FORBIDDEN)

        data = request.data
        brand_id = data.get('BrandID')
        style_id = data.get('StyleID')

        if not brand_id or not style_id:
            return Response({'error': 'BrandID and StyleID are required.'}, status=status.HTTP_400_BAD_REQUEST)

        brand = get_object_or_404(Brand, pk=brand_id)
        style = get_object_or_404(Style, pk=style_id)

        shoe_manager = ShoeManagerSingleton()
        try:
            new_shoe = shoe_manager.create_shoe(
                name=data.get('name'),
                brand=brand,
                style=style,
                price=float(data.get('price', 0)),
                size=float(data.get('size', 0)),
                stock=int(data.get('stock', 0)),
                description=data.get('description', ''),
                image_url=request.FILES.get("image_url") if "image_url" in request.FILES else None
            )
            serializer = ShoeSerializer(new_shoe)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'errors': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ShoeDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        shoe_manager = ShoeManagerSingleton()
        shoe = shoe_manager.get_shoe_by_id(pk)
        if not shoe:
            return Response({'error': 'Shoe not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ShoeSerializer(shoe)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        shoe_manager = ShoeManagerSingleton()
        updated_shoe = shoe_manager.update_shoe(pk, request.data)
        if not updated_shoe:
            return Response({'error': 'Shoe not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ShoeSerializer(updated_shoe)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        shoe_manager = ShoeManagerSingleton()
        success = shoe_manager.delete_shoe(pk)
        if success:
            return Response({'message': 'Shoe deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'error': 'Shoe not found'}, status=status.HTTP_404_NOT_FOUND)
