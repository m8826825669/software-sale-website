from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions, status
from django.core.mail import EmailMessage
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def contact_form(request):
    """Receive contact form and email support team + auto-reply to sender."""
    name     = request.data.get('name', '').strip()
    email    = request.data.get('email', '').strip()
    subject  = request.data.get('subject', '').strip()
    category = request.data.get('category', 'other').strip()
    message  = request.data.get('message', '').strip()

    if not all([name, email, subject, message]):
        return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)
    if len(message) < 20:
        return Response({'error': 'Message must be at least 20 characters.'}, status=status.HTTP_400_BAD_REQUEST)

    body = f"""New contact form submission from SoftCraft Solutions website.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CONTACT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name     : {name}
Email    : {email}
Category : {category}
Subject  : {subject}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reply directly to this email to respond to the customer.
"""
    try:
        # Email to support team with reply-to set to customer
        EmailMessage(
            subject=f"[Contact — {category.upper()}] {subject}",
            body=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.SUPPORT_EMAIL],
            reply_to=[f"{name} <{email}>"],
        ).send()

        # Auto-reply to the customer
        EmailMessage(
            subject="We received your message — SoftCraft Solutions",
            body=f"""Hi {name},

Thank you for contacting SoftCraft Solutions!

We've received your message about "{subject}" and will get back to you within 24 hours on business days (9 AM – 6 PM IST, Mon–Sat).

If your query is urgent, WhatsApp us at +91 98765 43210.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SoftCraft Solutions
{settings.SITE_URL}
support@softcraft.in
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email],
        ).send()

        logger.info(f"Contact form from {email}: {subject}")
        return Response({'message': "Your message has been sent. We'll reply within 24 hours."})
    except Exception as e:
        logger.error(f"Contact form email failed: {e}")
        return Response(
            {'error': 'Failed to send. Please email support@softcraft.in directly.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
