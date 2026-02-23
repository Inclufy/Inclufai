from django.contrib import admin
from .models import Course, CourseModule, CourseLesson, LessonVisual




@admin.register(LessonVisual)
class LessonVisualAdmin(admin.ModelAdmin):
    list_display = ['lesson', 'visual_id', 'ai_confidence', 'status', 'created_at', 'approved_by']
    list_filter = ['status', 'created_at', 'ai_methodology']
    search_fields = ['lesson__title', 'visual_id', 'custom_keywords']
    readonly_fields = ['created_at', 'updated_at', 'approved_at', 'ai_concepts', 'ai_intent', 'ai_methodology', 'ai_confidence']
    
    fieldsets = (
        ('Lesson', {
            'fields': ('lesson',)
        }),
        ('AI Suggestion', {
            'fields': ('visual_id', 'ai_confidence', 'ai_concepts', 'ai_intent', 'ai_methodology')
        }),
        ('Review', {
            'fields': ('status', 'custom_keywords')
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at', 'approved_at', 'approved_by'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_visuals', 'reject_visuals']
    
    def approve_visuals(self, request, queryset):
        for visual in queryset:
            visual.approve(request.user)
        self.message_user(request, f'{queryset.count()} visuals approved!')
    approve_visuals.short_description = 'Approve selected visuals'
    
    def reject_visuals(self, request, queryset):
        queryset.update(status='rejected')
        self.message_user(request, f'{queryset.count()} visuals rejected!')
    reject_visuals.short_description = 'Reject selected visuals'
