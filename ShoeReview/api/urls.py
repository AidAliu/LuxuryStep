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
from .views.brand_view import BrandDetailView, BrandListCreateView
from .views.review_view import ReviewDetailView, ReviewListCreateView, ShoeReviewsView
from .views.style_view import StyleDetailView, StyleListCreateView
from .views.order_view import OrderDetailView, OrderListCreateView
from .views.order_item_view import OrderItemDetailView, OrderItemListCreateView
from .views.wishlist_view import WishlistDetailView, WishlistListCreateView
from .views.wishlistitem_view import WishlistItemDetailView, WishlistItemListCreateView
from django.conf import settings
from django.conf.urls.static import static



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

     # Brand API endpoints
    path('brands/', BrandListCreateView.as_view(), name='brand-list'),
    path('brands/<int:pk>/', BrandDetailView.as_view(), name='brand-detail'),

    # Review API endpoints
    path('reviews/', ReviewListCreateView.as_view(), name='review-list'),
    path('reviews/<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
    path('shoes/<int:shoe_id>/reviews/', ShoeReviewsView.as_view(), name='shoe-reviews'),


    # Style API endpoints
    path('styles/', StyleListCreateView.as_view(), name='style-list'),
    path('styles/<int:pk>/', StyleDetailView.as_view(), name='style-detail'),

    #Order/Order Item API endpoints
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('order-items/', OrderItemListCreateView.as_view(), name='order-item-list-create'),
    path('order-items/<int:pk>/', OrderItemDetailView.as_view(), name='order-item-detail'),

    # Wishlist/Wishlist Item API endpoints
    path('wishlists/', WishlistListCreateView.as_view(), name='wishlist-list'),
    path('wishlists/<int:pk>/', WishlistDetailView.as_view(), name='wishlist-detail'),
    path('wishlistitems/', WishlistItemListCreateView.as_view(), name='wishlistitem-list'),
    path('wishlistitems/<int:pk>/', WishlistItemDetailView.as_view(), name='wishlistitem-detail'),

]

if settings.DEBUG:  # Only serve media in development
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)






