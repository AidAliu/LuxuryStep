from django.urls import path
from .views.user_view import UserListView
from .views.shoe_view import ShoeListView, ShoeDetailView
from .views.brand_view import BrandListCreateView, BrandDetailView
from .views.category_view import CategoryListCreateView, CategoryDetailView
from .views.shoe_filter_views import ShoesByBrandView, ShoesByCategoryView, ShoesByStyleView
from .views.wishlist_view import WishlistListCreateView, WishlistDetailView
from .views.wishlistitem_view import WishlistItemListCreateView, WishlistItemDetailView
from .views.order_view import OrderListCreateView, OrderDetailView
from .views.review_view import ReviewListCreateView, ReviewDetailView
from .views.style_view import StyleListCreateView, StyleDetailView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # User URLs
    path('users/', UserListView.as_view(), name='user-list'),

    # JWT Authentication Endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # CRUD for Shoes
    path('shoes/', ShoeListView.as_view(), name='shoe-list'),
    path('shoes/<int:pk>/', ShoeDetailView.as_view(), name='shoe-detail'),

    # CRUD for Brands
    path('brands/', BrandListCreateView.as_view(), name='brand-list-create'),
    path('brands/<int:pk>/', BrandDetailView.as_view(), name='brand-detail'),

    # CRUD for Categories
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),

    # CRUD for Wishlist
    path('wishlists/', WishlistListCreateView.as_view(), name='wishlist-list-create'),
    path('wishlists/<int:pk>/', WishlistDetailView.as_view(), name='wishlist-detail'),

    # CRUD for Wishlist Items
    path('wishlist-items/', WishlistItemListCreateView.as_view(), name='wishlist-item-list-create'),
    path('wishlist-items/<int:pk>/', WishlistItemDetailView.as_view(), name='wishlist-item-detail'),

    # CRUD for Orders
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),

    # CRUD for Reviews
    path('reviews/', ReviewListCreateView.as_view(), name='review-list-create'),
    path('reviews/<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),

    # CRUD for Styles
    path('styles/', StyleListCreateView.as_view(), name='style-list-create'),
    path('styles/<int:pk>/', StyleDetailView.as_view(), name='style-detail'),

    # Filter Shoes
    path('shoes/brand/<int:brand_id>/', ShoesByBrandView.as_view(), name='shoes-by-brand'),
    path('shoes/category/<int:category_id>/', ShoesByCategoryView.as_view(), name='shoes-by-category'),
    path('shoes/style/<int:style_id>/', ShoesByStyleView.as_view(), name='shoes-by-style'),
]
