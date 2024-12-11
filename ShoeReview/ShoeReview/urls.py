from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({"message": "Welcome to the API!"})

urlpatterns = [
    path('admin/', admin.site.urls),
    #path('', api_root, name='api-root'),  # Root of the project
    path('api/', include('api.urls')),   # Include app-level URLs
]
