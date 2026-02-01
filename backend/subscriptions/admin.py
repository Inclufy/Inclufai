from django.contrib import admin
from .models import SubscriptionPlan, CompanySubscription
from .models_requests import DemoRequest, QuoteRequest, InvoiceRequest


# ============================================
# SUBSCRIPTION MODELS
# ============================================

@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "plan_type",
        "plan_level",
        "price",
        "is_active",
        "created_at",
    ]
    list_filter = ["plan_type", "plan_level", "is_active", "created_at"]
    search_fields = ["name", "stripe_price_id"]
    readonly_fields = ["created_at", "updated_at"]
    ordering = ["-created_at"]

    fieldsets = (
        (
            "Basic Information",
            {"fields": ("name", "plan_type", "plan_level")},
        ),
        ("Pricing", {"fields": ("price", "is_active")}),
        (
            "Stripe Integration",
            {
                "fields": ("stripe_price_id", "stripe_product_id"),
                "classes": ("collapse",),
            },
        ),
        (
            "Plan Features",
            {
                "fields": ("features",),
                "classes": ("collapse",),
            },
        ),
        (
            "Plan Limits",
            {
                "fields": (
                    "max_projects",
                    "max_users",
                    "storage_limit_gb",
                    "priority_support",
                    "advanced_analytics",
                    "custom_integrations",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )


@admin.register(CompanySubscription)
class CompanySubscriptionAdmin(admin.ModelAdmin):
    list_display = [
        "company",
        "plan",
        "status",
        "purchased_by",
        "current_period_end",
        "cancel_at_period_end",
        "created_at",
    ]
    list_filter = [
        "status",
        "cancel_at_period_end",
        "plan__plan_type",
        "plan__plan_level",
        "created_at",
    ]
    search_fields = [
        "company__name",
        "purchased_by__email",
        "purchased_by__first_name",
        "purchased_by__last_name",
        "stripe_subscription_id",
    ]
    readonly_fields = [
        "stripe_subscription_id",
        "stripe_customer_id",
        "created_at",
        "updated_at",
    ]
    ordering = ["-created_at"]

    fieldsets = (
        (
            "Subscription Details",
            {"fields": ("company", "plan", "purchased_by", "status")},
        ),
        ("Billing Period", {"fields": ("current_period_start", "current_period_end")}),
        ("Cancellation", {"fields": ("cancel_at_period_end", "canceled_at")}),
        (
            "Trial Information",
            {"fields": ("trial_start", "trial_end"), "classes": ("collapse",)},
        ),
        (
            "Stripe Integration",
            {
                "fields": ("stripe_subscription_id", "stripe_customer_id"),
                "classes": ("collapse",),
            },
        ),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("company", "plan", "purchased_by")
        )


# ============================================
# REQUEST MODELS (DEMO/QUOTE/INVOICE)
# ============================================

@admin.register(DemoRequest)
class DemoRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'company_name', 'contact_name', 'contact_email', 'status', 'preferred_date', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['company_name', 'contact_name', 'contact_email']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    fieldsets = (
        ('Contact Info', {
            'fields': ('company_name', 'contact_name', 'contact_email', 'contact_phone')
        }),
        ('Demo Details', {
            'fields': ('preferred_date', 'preferred_time', 'num_participants', 'message')
        }),
        ('Status & Notes', {
            'fields': ('status', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_contacted', 'mark_scheduled', 'mark_completed']
    
    def mark_contacted(self, request, queryset):
        updated = queryset.update(status='contacted')
        self.message_user(request, f'{updated} demo(s) marked as contacted')
    mark_contacted.short_description = "✅ Mark as Contacted"
    
    def mark_scheduled(self, request, queryset):
        updated = queryset.update(status='scheduled')
        self.message_user(request, f'{updated} demo(s) marked as scheduled')
    mark_scheduled.short_description = "📅 Mark as Scheduled"
    
    def mark_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} demo(s) marked as completed')
    mark_completed.short_description = "✔️ Mark as Completed"


@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'company_name', 'contact_name', 'contact_email', 'num_users', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['company_name', 'contact_name', 'contact_email']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    fieldsets = (
        ('Contact Info', {
            'fields': ('company_name', 'contact_name', 'contact_email', 'contact_phone')
        }),
        ('Quote Details', {
            'fields': ('num_users', 'requirements')
        }),
        ('Status & Notes', {
            'fields': ('status', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_reviewing', 'mark_sent', 'mark_accepted']
    
    def mark_reviewing(self, request, queryset):
        updated = queryset.update(status='reviewing')
        self.message_user(request, f'{updated} quote(s) marked as reviewing')
    mark_reviewing.short_description = "👀 Mark as Reviewing"
    
    def mark_sent(self, request, queryset):
        updated = queryset.update(status='quote_sent')
        self.message_user(request, f'{updated} quote(s) marked as sent')
    mark_sent.short_description = "📤 Mark as Quote Sent"
    
    def mark_accepted(self, request, queryset):
        updated = queryset.update(status='accepted')
        self.message_user(request, f'{updated} quote(s) marked as accepted')
    mark_accepted.short_description = "✅ Mark as Accepted"


@admin.register(InvoiceRequest)
class InvoiceRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'company_name', 'contact_name', 'plan', 'billing_period', 'status', 'created_at']
    list_filter = ['status', 'billing_period', 'created_at', 'plan']
    search_fields = ['company_name', 'contact_name', 'contact_email', 'company_vat']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    fieldsets = (
        ('Contact Info', {
            'fields': ('company_name', 'company_vat', 'contact_name', 'contact_email', 'contact_phone')
        }),
        ('Plan Details', {
            'fields': ('plan', 'billing_period', 'notes')
        }),
        ('Status & Admin Notes', {
            'fields': ('status', 'admin_notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_approved', 'mark_active', 'mark_declined']
    
    def mark_approved(self, request, queryset):
        updated = queryset.update(status='approved')
        self.message_user(request, f'{updated} invoice(s) marked as approved')
    mark_approved.short_description = "✅ Mark as Approved"
    
    def mark_active(self, request, queryset):
        updated = queryset.update(status='active')
        self.message_user(request, f'{updated} invoice(s) marked as active')
    mark_active.short_description = "🟢 Mark as Active"
    
    def mark_declined(self, request, queryset):
        updated = queryset.update(status='declined')
        self.message_user(request, f'{updated} invoice(s) marked as declined')
    mark_declined.short_description = "❌ Mark as Declined"
