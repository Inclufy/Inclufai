from django.contrib import admin
from .models import Portfolio, GovernanceBoard, Stakeholder, ReportingLine


@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ['name', 'company', 'status', 'owner', 'created_at']
    list_filter = ['status', 'company']
    search_fields = ['name', 'description']


@admin.register(GovernanceBoard)
class GovernanceBoardAdmin(admin.ModelAdmin):
    list_display = ['name', 'board_type', 'chair', 'meeting_frequency', 'is_active']
    list_filter = ['board_type', 'is_active']
    search_fields = ['name', 'description']


@admin.register(Stakeholder)
class StakeholderAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'influence_level', 'is_active']
    list_filter = ['role', 'influence_level', 'is_active']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']


@admin.register(ReportingLine)
class ReportingLineAdmin(admin.ModelAdmin):
    list_display = ['reports_from', 'reports_to', 'reporting_frequency', 'is_active']
    list_filter = ['reporting_frequency', 'is_active']
    search_fields = ['reports_from__email', 'reports_to__email']
