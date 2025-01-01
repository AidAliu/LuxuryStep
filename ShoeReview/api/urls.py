from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views.user_view import (
    RegisterView,
    get_control_panel_data,
    get_current_user,
    UserListView,
    UserDetailView,
)
from .views.payment_view import PaymentListCreateView, PaymentDetailView
from .views.shoe_view import ShoeListView, ShoeDetailView

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

    # Payments API endpoints
    path('payments/', PaymentListCreateView.as_view(), name='payment-list'),  # List and create payments
    path('payments/<int:pk>/', PaymentDetailView.as_view(), name='payment-detail'),  # Detail, update, delete
    
     # Shoes API endpoints
    path('shoes/', ShoeListView.as_view(), name='shoe-list'),  # List and create shoes
    path('shoes/<int:pk>/', ShoeDetailView.as_view(), name='shoe-detail'),  # Detail, update, delete
]
