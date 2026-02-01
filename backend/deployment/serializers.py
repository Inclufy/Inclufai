from rest_framework import serializers
from .models import DeploymentPlan, StrategyItem, RolloutPhase, PhaseTask


class PhaseTaskSerializer(serializers.ModelSerializer):
    """Serializer for individual phase tasks"""

    class Meta:
        model = PhaseTask
        fields = ["id", "task_description", "order"]


class RolloutPhaseSerializer(serializers.ModelSerializer):
    """Serializer for rollout phases with nested tasks"""
    tasks = PhaseTaskSerializer(many=True, read_only=True)

    class Meta:
        model = RolloutPhase
        fields = ["id", "phase_name", "tasks", "order"]


class StrategyItemSerializer(serializers.ModelSerializer):
    """Serializer for strategy items"""

    class Meta:
        model = StrategyItem
        fields = ["id", "title", "description", "order"]


class DeploymentPlanSerializer(serializers.ModelSerializer):
    """Main serializer for deployment plan with nested strategy items and rollout phases"""
    strategy_items = StrategyItemSerializer(many=True, read_only=True)
    rollout_phases = RolloutPhaseSerializer(many=True, read_only=True)
    project_name = serializers.ReadOnlyField(source="project.name")
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = DeploymentPlan
        fields = [
            "id",
            "project",
            "project_name",
            "strategy_overview",
            "strategy_items",
            "rollout_overview",
            "rollout_phases",
            "created_by",
            "created_by_name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_by", "created_at", "updated_at"]

    def get_created_by_name(self, obj):
        if not obj.created_by:
            return None
        return obj.created_by.first_name or obj.created_by.email


class StrategyItemCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating strategy items"""

    class Meta:
        model = StrategyItem
        fields = ["id", "deployment_plan", "title", "description", "order"]


class PhaseTaskCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating phase tasks"""

    class Meta:
        model = PhaseTask
        fields = ["id", "rollout_phase", "task_description", "order"]


class RolloutPhaseCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating rollout phases"""

    class Meta:
        model = RolloutPhase
        fields = ["id", "deployment_plan", "phase_name", "order"]