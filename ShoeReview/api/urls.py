from django.urls import path
from .views import (
    ShoeListView, ShoeDetailView,
    BrandListCreateView, BrandDetailView,
    CategoryListCreateView, CategoryDetailView,
    ShoesByBrandView, ShoesByCategoryView, ShoesByStyleView
)

urlpatterns = [
    # CRUD for Shoes
    path('shoes/', ShoeListView.as_view(), name='shoe-list'),
    path('shoes/<int:pk>/', ShoeDetailView.as_view(), name='shoe-detail'),

    # CRUD for Brands
    path('brands/', BrandListCreateView.as_view(), name='brand-list-create'),
    path('brands/<int:pk>/', BrandDetailView.as_view(), name='brand-detail'),

    # CRUD for Categories
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),

    # Filter Shoes
    path('shoes/brand/<int:brand_id>/', ShoesByBrandView.as_view(), name='shoes-by-brand'),
    path('shoes/category/<int:category_id>/', ShoesByCategoryView.as_view(), name='shoes-by-category'),
    path('shoes/style/<int:style_id>/', ShoesByStyleView.as_view(), name='shoes-by-style'),
]
