from rest_framework import generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, PricingPlan, Testimonial
from .serializers import (CategorySerializer, ProductListSerializer,
                          ProductDetailSerializer, TestimonialSerializer)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'platform', 'is_featured']
    search_fields = ['name', 'tagline', 'description']
    ordering_fields = ['name', 'rating', 'total_purchases', 'created_at']
    ordering = ['-is_featured', 'sort_order']

    def get_queryset(self):
        return Product.objects.filter(is_active=True).select_related('category').prefetch_related('plans')


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class TestimonialListView(generics.ListAPIView):
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        if self.request.query_params.get('featured'):
            return Testimonial.objects.filter(is_featured=True)
        return Testimonial.objects.all()


# Admin views
class AdminProductListView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def featured_products(request):
    products = Product.objects.filter(is_active=True, is_featured=True).prefetch_related('plans')
    return Response(ProductListSerializer(products, many=True).data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def site_stats(request):
    from apps.orders.models import Order
    return Response({
        'total_products': Product.objects.filter(is_active=True).count(),
        'total_customers': Order.objects.values('user').distinct().count(),
        'total_orders': Order.objects.filter(status='completed').count(),
    })


# ── Admin product view that also handles installer file uploads ────────────
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

class AdminProductDetailViewWithUpload(AdminProductDetailView):
    """Extends admin detail view to accept multipart (file uploads)."""
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
