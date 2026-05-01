from django.contrib import admin
from .models import Client, Invoice, InvoiceItem

admin.site.register(Client)
admin.site.register(Invoice)
admin.site.register(InvoiceItem)