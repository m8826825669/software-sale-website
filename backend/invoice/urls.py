from django.urls import path
from .views import create_invoice, get_invoice, download_invoice_pdf

urlpatterns = [
    path('create/', create_invoice),
    path('<int:pk>/', get_invoice),
    path('<int:pk>/pdf/', download_invoice_pdf),
]
