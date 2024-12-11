from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .Models import Shoe
from .serializers import ShoeSerializer

class ShoeListView(APIView):
    def get(self, request):
        shoes = Shoe.objects.all()
        serializer = ShoeSerializer(shoes, many=True)
        return Response(serializer.data)