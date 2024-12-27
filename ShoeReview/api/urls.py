# file: api/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views.user_view import (
    RegisterView,
    get_control_panel_data,
    get_current_user,
    UserListView,
    UserDetailView
)

urlpatterns = [
    # Login (JWT)
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Register new users
    path('register/', RegisterView.as_view(), name='register'),

    # Returns logged-in user info, including is_staff
    path('me/', get_current_user, name='current_user'),

    # Control panel data (staff only)
    path('control-panel-data/', get_control_panel_data, name='control-panel-data'),

    # Example user endpoints (staff only)
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]
