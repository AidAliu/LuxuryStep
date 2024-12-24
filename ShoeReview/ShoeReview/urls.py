from django.contrib import admin
from django.urls import path, include
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view

# Updated API Root View
@api_view(['GET'])
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
            "Control Panel": "/controlpanel/"
        }
    })

urlpatterns = [
    # Built-in Admin Route
    path('admin/', admin.site.urls),

    # API Root Endpoint
    path('', api_root, name='api-root'),

    # API Routes
    path('api/', include('api.urls')),

    # Control Panel Routes
    path('controlpanel/', include('controlpanel.urls')),
]
