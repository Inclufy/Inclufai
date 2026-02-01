from django.contrib import admin
from .models import StatusReport, TrainingMaterial, ReportingItem, Meeting

# Status Report Admin
@admin.register(StatusReport)
class StatusReportAdmin(admin.ModelAdmin):
    list_display = ['project', 'status', 'progress', 'last_updated', 'created_at']
    list_filter = ['status', 'last_updated', 'project']
    search_fields = ['project__name']
    ordering = ['-created_at']
    
# Training Material Admin
@admin.register(TrainingMaterial)
class TrainingMaterialAdmin(admin.ModelAdmin):
    list_display = ['project', 'name', 'audience', 'format', 'status', 'created_at']
    list_filter = ['project', 'audience', 'format', 'status']
    search_fields = ['name']
    ordering = ['-created_at']
    
# Report Admin
@admin.register(ReportingItem)
class ReportingItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'project', 'name', 'frequency', 'type', 'start_date', 'view', 'created_at']
    list_filter = ['frequency', 'type', 'view', 'project']
    search_fields = ['name', 'project__name']
    ordering = ['-created_at']


@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display = ['id', 'project', 'name', 'type', 'frequency', 'date', 'time', 'status', 'created_at']
    list_filter = ['project', 'type', 'frequency', 'status', 'date']
    search_fields = ['name', 'project__name']
    ordering = ['-created_at']