from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Invoice
from .serializers import InvoiceSerializer
from rest_framework.permissions import AllowAny
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML

@api_view(['POST'])
@permission_classes([AllowAny])
def create_invoice(request):
    serializer = InvoiceSerializer(data=request.data)
    if serializer.is_valid():
        invoice = serializer.save()
        return Response({"message": "Invoice created", "id": invoice.id})
    return Response(serializer.errors, status=400)


@api_view(['GET'])
def get_invoice(request, pk):
    try:
        invoice = Invoice.objects.get(pk=pk)
    except Invoice.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    serializer = InvoiceSerializer(invoice)
    return Response(serializer.data)



def download_invoice_pdf(request, pk):
    try:
        invoice = Invoice.objects.get(pk=pk)
    except Invoice.DoesNotExist:
        return HttpResponse("Not found", status=404)

    items = invoice.items.all()

    html_string = render_to_string('invoice/invoice.html', {
        'invoice': invoice,
        'items': items
    })

    html = HTML(string=html_string)
    pdf = html.write_pdf()

    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename=invoice_{invoice.invoice_number}.pdf'

    return response