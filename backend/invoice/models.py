from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Client(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return self.name


class Invoice(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="invoices")

    invoice_number = models.CharField(max_length=50, unique=True)
    date = models.DateField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)

    currency = models.CharField(max_length=10, default="USD")
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.invoice_number


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="items")

    name = models.CharField(max_length=255)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def subtotal(self):
        return self.quantity * self.price
