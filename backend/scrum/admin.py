from django.contrib import admin
from .models import (
    ProductBacklog, BacklogItem, Sprint, SprintBurndown,
    DailyStandup, StandupUpdate, SprintReview, SprintRetrospective,
    Velocity, DefinitionOfDone, ScrumTeam,
    SprintGoal, SprintPlanning, Increment, DoDChecklistCompletion
)


@admin.register(ProductBacklog)
class ProductBacklogAdmin(admin.ModelAdmin):
    list_display = ['project', 'created_at']
    search_fields = ['project__name']


@admin.register(BacklogItem)
class BacklogItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'item_type', 'status', 'priority', 'story_points', 'sprint', 'assignee']
    list_filter = ['item_type', 'status', 'priority']
    search_fields = ['title', 'description']


@admin.register(Sprint)
class SprintAdmin(admin.ModelAdmin):
    list_display = ['name', 'project', 'number', 'status', 'start_date', 'end_date']
    list_filter = ['status']
    ordering = ['-number']


@admin.register(SprintBurndown)
class SprintBurndownAdmin(admin.ModelAdmin):
    list_display = ['sprint', 'date', 'remaining_points', 'completed_points']
    ordering = ['-date']


@admin.register(DailyStandup)
class DailyStandupAdmin(admin.ModelAdmin):
    list_display = ['sprint', 'date']
    ordering = ['-date']


@admin.register(StandupUpdate)
class StandupUpdateAdmin(admin.ModelAdmin):
    list_display = ['standup', 'user']


@admin.register(SprintReview)
class SprintReviewAdmin(admin.ModelAdmin):
    list_display = ['sprint', 'scheduled_date', 'sprint_goal_achieved', 'completed_story_points']
    list_filter = ['sprint_goal_achieved', 'status']
    search_fields = ['sprint__name']


@admin.register(SprintRetrospective)
class SprintRetrospectiveAdmin(admin.ModelAdmin):
    list_display = ['sprint', 'date', 'team_morale']


@admin.register(Velocity)
class VelocityAdmin(admin.ModelAdmin):
    list_display = ['project', 'sprint', 'committed_points', 'completed_points']


@admin.register(DefinitionOfDone)
class DefinitionOfDoneAdmin(admin.ModelAdmin):
    list_display = ['name', 'project', 'scope', 'item', 'order', 'is_active']
    list_filter = ['is_active', 'scope']
    search_fields = ['name', 'item']


@admin.register(ScrumTeam)
class ScrumTeamAdmin(admin.ModelAdmin):
    list_display = ['project', 'user', 'role', 'capacity_per_sprint']
    list_filter = ['role']


# ==================== NEW MODELS ====================

@admin.register(SprintGoal)
class SprintGoalAdmin(admin.ModelAdmin):
    list_display = ['sprint', 'description', 'is_achieved', 'created_by', 'created_at']
    list_filter = ['is_achieved', 'created_at']
    search_fields = ['description', 'sprint__name']


@admin.register(SprintPlanning)
class SprintPlanningAdmin(admin.ModelAdmin):
    list_display = ['sprint', 'scheduled_date', 'status', 'team_capacity', 'committed_story_points']
    list_filter = ['status', 'scheduled_date']
    search_fields = ['sprint__name']


@admin.register(Increment)
class IncrementAdmin(admin.ModelAdmin):
    list_display = ['version', 'project', 'sprint', 'is_released', 'meets_dod', 'release_date']
    list_filter = ['is_released', 'meets_dod', 'created_at']
    search_fields = ['version', 'description', 'project__name']


@admin.register(DoDChecklistCompletion)
class DoDChecklistCompletionAdmin(admin.ModelAdmin):
    list_display = ['definition_of_done', 'item_type', 'item_id', 'completion_percentage', 'is_fully_complete']
    list_filter = ['item_type', 'is_fully_complete']
    search_fields = ['definition_of_done__name']