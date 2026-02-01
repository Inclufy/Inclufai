from django.contrib import admin
from .models_requests import DemoRequest, QuoteRequest, InvoiceRequest


@admin.register(DemoRequest)
class DemoRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'company_name', 'contact_name', 'contact_email', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['company_name', 'contact_name', 'contact_email']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Contact Info', {
            'fields': ('company_name', 'contact_name', 'contact_email', 'contact_phone')
        }),
        ('Demo Details', {
            'fields': ('preferred_date', 'preferred_time', 'num_participants', 'message')
        }),
        ('Status', {
            'fields': ('status', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'company_name', 'contact_name', 'contact_email', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['company_name', 'contact_name', 'contact_email']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Contact Info', {
            'fields': ('company_name', 'contact_name', 'contact_email', 'contact_phone')
        }),
        ('Quote Details', {
            'fields': ('num_users', 'requirements')
        }),
        ('Status', {
            'fields': ('status', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(InvoiceRequest)
class InvoiceRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'company_name', 'contact_name', 'plan', 'billing_period', 'status', 'created_at']
    list_filter = ['status', 'billing_period', 'created_at']
    search_fields = ['company_name', 'contact_name', 'contact_email']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Contact Info', {
            'fields': ('company_name', 'company_vat', 'contact_name', 'contact_email', 'contact_phone')
        }),
        ('Plan Details', {
            'fields': ('plan', 'billing_period', 'notes')
        }),
        ('Status', {
            'fields': ('status', 'admin_notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
