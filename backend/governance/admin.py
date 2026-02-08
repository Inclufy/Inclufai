from django.contrib import admin
from .models import Portfolio, GovernanceBoard, BoardMember, GovernanceStakeholder


@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ['name', 'company', 'owner', 'status', 'created_at']
    list_filter = ['status', 'company']
    search_fields = ['name', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(GovernanceBoard)
class GovernanceBoardAdmin(admin.ModelAdmin):
    list_display = ['name', 'board_type', 'portfolio', 'program', 'project', 'chair', 'is_active']
    list_filter = ['board_type', 'is_active']
    search_fields = ['name', 'description']
    readonly_fields = ['id', 'created_at']


@admin.register(BoardMember)
class BoardMemberAdmin(admin.ModelAdmin):
    list_display = ['user', 'board', 'role', 'is_active', 'joined_at']
    list_filter = ['role', 'is_active', 'board']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['id', 'joined_at']


@admin.register(GovernanceStakeholder)
class GovernanceStakeholderAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'influence_level', 'interest_level', 'stakeholder_quadrant', 'is_active']
    list_filter = ['role', 'influence_level', 'interest_level', 'is_active']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['id', 'created_at', 'stakeholder_quadrant']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('user', 'role', 'is_active')
        }),
        ('Power/Interest Matrix', {
            'fields': ('influence_level', 'interest_level', 'stakeholder_quadrant')
        }),
        ('Linked Entities', {
            'fields': ('portfolio', 'program', 'project')
        }),
        ('Engagement', {
            'fields': ('communication_plan', 'notes')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at'),
            'classes': ('collapse',)
        })
    )
