from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.conf import settings
from django.utils import timezone
import razorpay
import hmac
import hashlib

from .models import Order
from apps.products.models import PricingPlan
from apps.licenses.models import License
from apps.licenses.utils import generate_license_key


razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)


class OrderSerializer:
    """Simple inline serializer for orders."""
    @staticmethod
    def to_dict(order):
        return {
            'id': str(order.id),
            'order_number': order.order_number,
            'status': order.status,
            'amount': float(order.amount),
            'total_amount': float(order.total_amount),
            'currency': order.currency,
            'razorpay_order_id': order.razorpay_order_id,
            'plan_name': order.plan.name,
            'product_name': order.plan.product.name,
            'product_slug': order.plan.product.slug,
            'billing_name': order.billing_name,
            'billing_email': order.billing_email,
            'invoice_number': order.invoice_number,
            'created_at': order.created_at.isoformat(),
            'completed_at': order.completed_at.isoformat() if order.completed_at else None,
        }


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_order(request):
    """Create a Razorpay order for a pricing plan."""
    plan_id = request.data.get('plan_id')
    billing_name = request.data.get('billing_name', request.user.full_name)
    billing_phone = request.data.get('billing_phone', request.user.phone)
    billing_address = request.data.get('billing_address', '')
    gst_number = request.data.get('gst_number', '')

    try:
        plan = PricingPlan.objects.get(id=plan_id, is_active=True)
    except PricingPlan.DoesNotExist:
        return Response({'error': 'Plan not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Check if user already owns this product
    existing = License.objects.filter(
        user=request.user, product=plan.product, is_active=True
    ).first()
    if existing:
        return Response({'error': 'You already own a license for this product.'}, status=status.HTTP_400_BAD_REQUEST)

    amount = plan.price
    tax = round(amount * 18 / 100, 2)   # 18% GST
    total = amount + tax

    # Create Razorpay order (amount in paise)
    razorpay_order = razorpay_client.order.create({
        'amount': int(total * 100),
        'currency': 'INR',
        'payment_capture': 1,
    })

    # Create DB order
    order = Order.objects.create(
        user=request.user,
        plan=plan,
        amount=amount,
        tax_amount=tax,
        total_amount=total,
        razorpay_order_id=razorpay_order['id'],
        billing_name=billing_name,
        billing_email=request.user.email,
        billing_phone=billing_phone,
        billing_address=billing_address,
        gst_number=gst_number,
    )

    return Response({
        'order_id': order.order_number,
        'razorpay_order_id': razorpay_order['id'],
        'razorpay_key': settings.RAZORPAY_KEY_ID,
        'amount': int(total * 100),
        'currency': 'INR',
        'name': plan.product.name,
        'description': f"{plan.name} License",
        'prefill': {
            'name': billing_name,
            'email': request.user.email,
            'contact': billing_phone,
        },
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def verify_payment(request):
    """Verify Razorpay payment signature and activate license."""
    razorpay_order_id = request.data.get('razorpay_order_id')
    razorpay_payment_id = request.data.get('razorpay_payment_id')
    razorpay_signature = request.data.get('razorpay_signature')

    try:
        order = Order.objects.get(
            razorpay_order_id=razorpay_order_id, user=request.user
        )
    except Order.DoesNotExist:
        return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Verify signature
    msg = f"{razorpay_order_id}|{razorpay_payment_id}"
    expected = hmac.new(
        key=settings.RAZORPAY_KEY_SECRET.encode(),
        msg=msg.encode(),
        digestmod=hashlib.sha256
    ).hexdigest()

    if expected != razorpay_signature:
        order.status = 'failed'
        order.save()
        return Response({'error': 'Payment verification failed.'}, status=status.HTTP_400_BAD_REQUEST)

    # Mark order completed
    order.razorpay_payment_id = razorpay_payment_id
    order.razorpay_signature = razorpay_signature
    order.status = 'completed'
    order.completed_at = timezone.now()
    order.save()

    # Generate license
    license_key = generate_license_key()
    from datetime import timedelta
    expiry = None
    if order.plan.billing_cycle == 'annual':
        expiry = timezone.now() + timedelta(days=365)
    elif order.plan.billing_cycle == 'monthly':
        expiry = timezone.now() + timedelta(days=30)

    license = License.objects.create(
        user=request.user,
        order=order,
        product=order.plan.product,
        plan=order.plan,
        license_key=license_key,
        max_activations=order.plan.max_devices,
        expires_at=expiry,
    )

    # Update product purchase count
    order.plan.product.total_purchases += 1
    order.plan.product.save()

    # Send purchase confirmation email with license key
    try:
        from apps.orders.email_utils import send_purchase_confirmation
        send_purchase_confirmation(order, license_key)
    except Exception:
        pass  # Don't fail the request if email fails

    return Response({
        'message': 'Payment successful! License has been created.',
        'license_key': license_key,
        'order_number': order.order_number,
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_orders(request):
    orders = Order.objects.filter(user=request.user).select_related('plan', 'plan__product')
    return Response([OrderSerializer.to_dict(o) for o in orders])


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_orders(request):
    orders = Order.objects.all().select_related('user', 'plan', 'plan__product')
    return Response({
        'count': orders.count(),
        'results': [OrderSerializer.to_dict(o) for o in orders],
    })
