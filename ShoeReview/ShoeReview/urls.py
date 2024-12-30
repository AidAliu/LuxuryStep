from django.contrib import admin
from django.urls import path, include
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings  
from django.conf.urls.static import static  




from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

@api_view(['GET'])
@permission_classes([AllowAny]) 
def api_root(request):
    """
    A simple root endpoint for the API.
    """
    return Response({
        "message": "Welcome to the API!",
        "endpoints": {
            "Users": "/api/users/",
            "Orders": "/api/orders/",
            "Payments": "/api/payments/",
        }
    })
    
urlpatterns = [
    # Built-in Admin Route
    path('admin/', admin.site.urls),

    # API Root Endpoint
    path('', api_root, name='api-root'),

    # API Routes
    path('api/', include('api.urls')),

    

]


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
