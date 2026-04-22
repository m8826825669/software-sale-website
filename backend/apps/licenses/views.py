from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions, status
from django.utils import timezone
from .models import License, LicenseActivation


def license_to_dict(lic):
    return {
        'id': str(lic.id),
        'license_key': lic.license_key,
        'product_name': lic.product.name,
        'product_slug': lic.product.slug,
        'plan_name': lic.plan.name,
        'user_email': lic.user.email,
        'user_name': lic.user.get_full_name() or lic.user.email,
        'is_active': lic.is_active,
        'is_expired': lic.is_expired,
        'is_valid': lic.is_valid,
        'max_activations': lic.max_activations,
        'activation_count': lic.activation_count,
        'download_count': lic.download_count,
        'expires_at': lic.expires_at.isoformat() if lic.expires_at else None,
        'created_at': lic.created_at.isoformat(),
    }


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_licenses(request):
    licenses = License.objects.filter(user=request.user).select_related('product', 'plan')
    return Response([license_to_dict(l) for l in licenses])


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def validate_license(request):
    """Called by the desktop app to validate a license key."""
    key = request.data.get('license_key')
    machine_id = request.data.get('machine_id')

    if not key or not machine_id:
        return Response({'valid': False, 'error': 'Missing required fields.'})

    try:
        lic = License.objects.get(license_key=key)
    except License.DoesNotExist:
        return Response({'valid': False, 'error': 'Invalid license key.'})

    if not lic.is_active:
        return Response({'valid': False, 'error': 'License is deactivated.'})

    if lic.is_expired:
        return Response({'valid': False, 'error': 'License has expired.'})

    # Check/register activation
    activation, created = LicenseActivation.objects.get_or_create(
        license=lic, machine_id=machine_id,
        defaults={
            'machine_name': request.data.get('machine_name', ''),
            'os_info': request.data.get('os_info', ''),
            'ip_address': request.META.get('REMOTE_ADDR'),
        }
    )

    if created:
        if lic.activation_count >= lic.max_activations:
            activation.delete()
            return Response({'valid': False, 'error': f'Maximum activations ({lic.max_activations}) reached.'})
        lic.activation_count += 1
        lic.save()
    elif not activation.is_active:
        return Response({'valid': False, 'error': 'This machine is deactivated.'})

    return Response({
        'valid': True,
        'product': lic.product.name,
        'plan': lic.plan.name,
        'user': lic.user.email,
        'expires_at': lic.expires_at.isoformat() if lic.expires_at else None,
    })


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_licenses(request):
    licenses = License.objects.all().select_related('user', 'product', 'plan')
    return Response({
        'count': licenses.count(),
        'results': [license_to_dict(l) for l in licenses],
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def deactivate_machine(request, license_id):
    """Remove a machine activation from a license to free up a slot."""
    machine_id = request.data.get('machine_id')
    if not machine_id:
        return Response({'error': 'machine_id is required.'}, status=400)
    try:
        lic = License.objects.get(id=license_id, user=request.user)
    except License.DoesNotExist:
        return Response({'error': 'License not found.'}, status=404)

    try:
        activation = LicenseActivation.objects.get(license=lic, machine_id=machine_id)
        activation.delete()
        if lic.activation_count > 0:
            lic.activation_count -= 1
            lic.save()
        return Response({'message': f'Machine {machine_id} deactivated successfully.'})
    except LicenseActivation.DoesNotExist:
        return Response({'error': 'Machine activation not found.'}, status=404)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def license_activations(request, license_id):
    """List all active machines for a license."""
    try:
        lic = License.objects.get(id=license_id, user=request.user)
    except License.DoesNotExist:
        return Response({'error': 'License not found.'}, status=404)

    activations = LicenseActivation.objects.filter(license=lic, is_active=True)
    return Response([{
        'machine_id': a.machine_id,
        'machine_name': a.machine_name or 'Unknown device',
        'os_info': a.os_info,
        'ip_address': a.ip_address,
        'activated_at': a.activated_at.isoformat(),
        'last_seen': a.last_seen.isoformat(),
    } for a in activations])
