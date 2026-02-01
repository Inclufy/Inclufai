from django.contrib import admin
from .models import DeploymentPlan, StrategyItem, RolloutPhase, PhaseTask


class StrategyItemInline(admin.TabularInline):
    model = StrategyItem
    extra = 1
    fields = ('title', 'description', 'order')


class RolloutPhaseInline(admin.TabularInline):
    model = RolloutPhase
    extra = 1
    fields = ('phase_name', 'order')


@admin.register(DeploymentPlan)
class DeploymentPlanAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'created_by', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('project__name',)
    readonly_fields = ('created_at', 'updated_at')
    inlines = [StrategyItemInline, RolloutPhaseInline]

    fieldsets = (
        ('Project Information', {
            'fields': ('project', 'created_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(StrategyItem)
class StrategyItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'deployment_plan', 'order', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('title', 'description', 'deployment_plan__project__name')
    ordering = ('deployment_plan', 'order', 'created_at')


class PhaseTaskInline(admin.TabularInline):
    model = PhaseTask
    extra = 1
    fields = ('task_description', 'order')


@admin.register(RolloutPhase)
class RolloutPhaseAdmin(admin.ModelAdmin):
    list_display = ('id', 'phase_name', 'deployment_plan', 'order', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('phase_name', 'deployment_plan__project__name')
    ordering = ('deployment_plan', 'order', 'created_at')
    inlines = [PhaseTaskInline]


@admin.register(PhaseTask)
class PhaseTaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_phase_name', 'task_description_short', 'order', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('task_description', 'rollout_phase__phase_name')
    ordering = ('rollout_phase', 'order', 'created_at')

    def get_phase_name(self, obj):
        return obj.rollout_phase.phase_name
    get_phase_name.short_description = 'Phase'

    def task_description_short(self, obj):
        return obj.task_description[:50] + '...' if len(obj.task_description) > 50 else obj.task_description
    task_description_short.short_description = 'Task Description'