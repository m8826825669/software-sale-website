from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions, status
from django.http import FileResponse, Http404
from django.utils import timezone
from datetime import timedelta
import secrets, os

from .models import DownloadToken
from apps.licenses.models import License


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def request_download(request):
    """Generate a secure, time-limited download token for a licensed product."""
    license_id = request.data.get('license_id')
    try:
        lic = License.objects.get(id=license_id, user=request.user)
    except License.DoesNotExist:
        return Response({'error': 'License not found.'}, status=status.HTTP_404_NOT_FOUND)

    if not lic.is_valid:
        return Response({'error': 'License is not valid or has expired.'}, status=status.HTTP_403_FORBIDDEN)

    from django.conf import settings
    max_dl = getattr(settings, 'MAX_DOWNLOADS_PER_LICENSE', 5)
    if lic.download_count >= max_dl:
        return Response({'error': f'Maximum download limit ({max_dl}) reached. Contact support.'}, status=status.HTTP_429_TOO_MANY_REQUESTS)

    token = secrets.token_urlsafe(48)
    expiry_hours = getattr(settings, 'DOWNLOAD_TOKEN_EXPIRY_HOURS', 2)

    dt = DownloadToken.objects.create(
        token=token,
        license=lic,
        user=request.user,
        expires_at=timezone.now() + timedelta(hours=expiry_hours),
        ip_address=request.META.get('REMOTE_ADDR'),
    )

    return Response({
        'download_url': f"/api/downloads/file/{token}/",
        'expires_in_hours': expiry_hours,
        'expires_at': dt.expires_at.isoformat(),
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def serve_download(request, token):
    """Serve the actual file — validates token, streams file, marks as used."""
    try:
        dt = DownloadToken.objects.select_related('license__product', 'user').get(token=token)
    except DownloadToken.DoesNotExist:
        raise Http404("Download link is invalid.")

    if not dt.is_valid:
        return Response(
            {'error': 'This download link has expired or already been used. Request a new one from your dashboard.'},
            status=status.HTTP_410_GONE
        )

    product = dt.license.product
    if not product.installer_file:
        return Response({'error': 'Installer file not yet uploaded. Contact support.'}, status=status.HTTP_404_NOT_FOUND)

    # Mark token as used
    dt.is_used = True
    dt.used_at = timezone.now()
    dt.save()

    # Increment download count on license
    lic = dt.license
    lic.download_count += 1
    lic.save()

    # Stream file
    file_path = product.installer_file.path
    if not os.path.exists(file_path):
        return Response({'error': 'File not found on server. Contact support.'}, status=status.HTTP_404_NOT_FOUND)

    filename = os.path.basename(file_path)
    response = FileResponse(
        open(file_path, 'rb'),
        content_type='application/octet-stream',
        as_attachment=True,
        filename=filename,
    )
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    response['Content-Length'] = os.path.getsize(file_path)
    return response


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def download_history(request):
    tokens = DownloadToken.objects.filter(user=request.user, is_used=True).select_related('license__product')
    return Response([{
        'product': t.license.product.name,
        'downloaded_at': t.used_at.isoformat() if t.used_at else None,
        'ip': t.ip_address,
    } for t in tokens])
