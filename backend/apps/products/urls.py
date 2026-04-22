from django.urls import path
from . import views

urlpatterns = [
    path('',                    views.ProductListView.as_view(),       name='product_list'),
    path('featured/',           views.featured_products,               name='featured_products'),
    path('categories/',         views.CategoryListView.as_view(),      name='category_list'),
    path('testimonials/',       views.TestimonialListView.as_view(),   name='testimonials'),
    path('stats/',              views.site_stats,                      name='site_stats'),
    path('<slug:slug>/',        views.ProductDetailView.as_view(),     name='product_detail'),
    path('admin/list/',         views.AdminProductListView.as_view(),  name='admin_product_list'),
    path('admin/<slug:slug>/',  views.AdminProductDetailViewWithUpload.as_view(), name='admin_product_detail'),
]
