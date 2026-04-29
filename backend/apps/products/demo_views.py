from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions, status
from django.core.mail import EmailMessage
from django.conf import settings
from django.utils import timezone
from django.db import models
import logging

logger = logging.getLogger(__name__)


# ── Inline model (avoids migration headache) ──────────────────────────────────
# Add this to your products/models.py if you want it persistent.
# For now we email requests directly.

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def request_demo(request):
    """
    Handle demo request form submissions.
    Emails the support team and sends auto-reply to requester.
    """
    product_name = request.data.get('product_name', '').strip()
    name         = request.data.get('name', '').strip()
    email        = request.data.get('email', '').strip()
    phone        = request.data.get('phone', '').strip()
    company      = request.data.get('company', '').strip()
    demo_type    = request.data.get('demo_type', 'live')   # 'live' | 'trial'
    preferred_time = request.data.get('preferred_time', '').strip()
    message      = request.data.get('message', '').strip()

    if not all([product_name, name, email]):
        return Response({'error': 'Name, email and product are required.'}, status=400)

    subject = f"{'🎯 Demo Request' if demo_type == 'live' else '📦 Trial Request'} — {product_name} — {name}"

    body = f"""
{'LIVE DEMO' if demo_type == 'live' else 'TRIAL DOWNLOAD'} REQUEST
{'=' * 50}
Product      : {product_name}
Request Type : {demo_type.upper()}
Name         : {name}
Email        : {email}
Phone        : {phone or '—'}
Company      : {company or '—'}
Preferred Time: {preferred_time or 'Flexible'}
Message      : {message or '—'}
Received     : {timezone.now().strftime('%d %b %Y, %I:%M %p IST')}
{'=' * 50}
Reply to this email to contact the prospect.
"""

    try:
        # Notify support team
        EmailMessage(
            subject=subject,
            body=body.strip(),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.SUPPORT_EMAIL],
            reply_to=[f'{name} <{email}>'],
        ).send()

        # Auto-reply to prospect
        if demo_type == 'live':
            auto_reply = f"""Hi {name},

Thank you for requesting a live demo of {product_name}!

Our team will contact you within 4 business hours (9 AM – 6 PM IST, Mon–Sat) to schedule a Google Meet or WhatsApp demo session.

{'Your preferred time: ' + preferred_time if preferred_time else 'We will suggest a convenient time.'}

In the meantime, you can:
• Browse the feature list: https://softcraft.in/products
• Watch the product video (coming soon)
• WhatsApp us directly: +91 98765 43210

━━━━━━━━━━━━━━━━━━━━━━━━━━
SoftCraft Solutions
support@softcraft.in | +91 98765 43210
"""
        else:
            auto_reply = f"""Hi {name},

Thank you for requesting a trial of {product_name}!

Your 15-day trial download link will be emailed to you within 1 hour.

Trial limitations:
• 15-day validity from first launch
• Full features unlocked (no restrictions)
• Data does not carry over to paid license

Purchase the full version anytime at: https://softcraft.in/products

━━━━━━━━━━━━━━━━━━━━━━━━━━
SoftCraft Solutions
support@softcraft.in | +91 98765 43210
"""

        EmailMessage(
            subject=f"{'Demo request confirmed' if demo_type == 'live' else 'Trial request received'} — {product_name}",
            body=auto_reply.strip(),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email],
        ).send()

        logger.info(f"Demo request: {demo_type} for {product_name} from {email}")
        return Response({
            'message': 'live' if demo_type == 'live'
                else 'trial',
            'detail': 'We will contact you within 4 hours.' if demo_type == 'live'
                else 'Trial download link will be emailed within 1 hour.',
        })

    except Exception as e:
        logger.error(f"Demo request email failed: {e}")
        return Response({'error': 'Failed to submit. Please WhatsApp us at +91 98765 43210.'}, status=500)