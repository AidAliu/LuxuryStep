from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Style
from ..serializers import StyleSerializer

class StyleListCreateView(APIView):
    def get(self, request):
        styles = Style.objects.all()
        serializer = StyleSerializer(styles, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = StyleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StyleDetailView(APIView):
    def get(self, request, pk):
        try:
            style = Style.objects.get(pk=pk)
            serializer = StyleSerializer(style)
            return Response(serializer.data)
        except Style.DoesNotExist:
            return Response({'error': 'Style not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            style = Style.objects.get(pk=pk)
            serializer = StyleSerializer(style, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Style.DoesNotExist:
            return Response({'error': 'Style not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            style = Style.objects.get(pk=pk)
            style.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Style.DoesNotExist:
            return Response({'error': 'Style not found'}, status=status.HTTP_404_NOT_FOUND)
