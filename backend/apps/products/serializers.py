from rest_framework import serializers
from .models import Category, Product, PricingPlan, Testimonial


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'icon', 'description', 'product_count')

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class PricingPlanSerializer(serializers.ModelSerializer):
    discount_percent = serializers.ReadOnlyField()

    class Meta:
        model = PricingPlan
        fields = ('id', 'name', 'price', 'original_price', 'discount_percent',
                  'billing_cycle', 'max_users', 'max_devices', 'features_included',
                  'is_popular', 'sort_order')


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ('id', 'author_name', 'author_role', 'author_company',
                  'author_avatar', 'content', 'rating')


class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    starting_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ('id', 'name', 'slug', 'emoji', 'tagline', 'thumbnail', 'category',
                  'platform', 'version', 'file_size', 'total_purchases',
                  'rating', 'rating_count', 'is_featured', 'starting_price')

    def get_starting_price(self, obj):
        plan = obj.plans.filter(is_active=True).order_by('price').first()
        return float(plan.price) if plan else None


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    plans = PricingPlanSerializer(many=True, read_only=True)
    testimonials = TestimonialSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ('id', 'name', 'slug', 'emoji', 'tagline', 'description', 'features',
                  'tech_stack', 'requirements', 'screenshots', 'thumbnail',
                  'demo_video_url', 'documentation_url', 'platform', 'version',
                  'file_size', 'changelog', 'total_purchases', 'rating',
                  'rating_count', 'category', 'plans', 'testimonials', 'created_at')
