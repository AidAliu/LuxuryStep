from django.urls import path
from .views import ShoeListView

urlpatterns = [
    path('shoes/', ShoeListView.as_view(), name='shoe-list'),  
]
