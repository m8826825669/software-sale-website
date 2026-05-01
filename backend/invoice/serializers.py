from rest_framework import serializers
from .models import Client, Invoice, InvoiceItem


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = '__all__'


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True)

    class Meta:
        model = Invoice
        fields = '__all__'

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        invoice = Invoice.objects.create(**validated_data)

        total = 0
        for item_data in items_data:
            item = InvoiceItem.objects.create(invoice=invoice, **item_data)
            total += item.quantity * item.price

        invoice.total = total
        invoice.save()

        return invoice