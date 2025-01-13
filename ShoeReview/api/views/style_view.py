# file: style_view.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404
from ..models import Style
from ..serializers import StyleSerializer
from ..design_patterns.singleton_services import StyleManagerSingleton

class StyleListCreateView(APIView):
    def get(self, request):
        styles = Style.objects.all()
        serializer = StyleSerializer(styles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        manager = StyleManagerSingleton()

        try:
            new_style = manager.create_style(
                name=data.get('name', ''),
                description=data.get('description', '')
            )
            serializer = StyleSerializer(new_style)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class StyleDetailView(APIView):
    def get(self, request, pk):
        manager = StyleManagerSingleton()
        style_obj = manager.get_style_by_id(pk)
        if not style_obj:
            return Response({'error': 'Style not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = StyleSerializer(style_obj)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        manager = StyleManagerSingleton()
        updated_style = manager.update_style(pk, request.data)
        if not updated_style:
            return Response({'error': 'Style not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = StyleSerializer(updated_style)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        manager = StyleManagerSingleton()
        success = manager.delete_style(pk)
        if success:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Style not found'}, status=status.HTTP_404_NOT_FOUND)
