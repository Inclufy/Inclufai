from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import DeploymentPlan, StrategyItem, RolloutPhase, PhaseTask
from .serializers import (
    DeploymentPlanSerializer,
    StrategyItemCreateUpdateSerializer,
    RolloutPhaseCreateUpdateSerializer,
    PhaseTaskCreateUpdateSerializer,
)


class DeploymentPlanViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Deployment Plan CRUD operations.
    """
    queryset = DeploymentPlan.objects.all()
    serializer_class = DeploymentPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter by project if provided."""
        queryset = super().get_queryset()
        project_id = self.request.query_params.get('project')

        if project_id:
            queryset = queryset.filter(project_id=project_id)

        # Filter by company
        if hasattr(self.request.user, 'company') and self.request.user.company:
            queryset = queryset.filter(project__company=self.request.user.company)

        return queryset

    def perform_create(self, serializer):
        """Set created_by on creation."""
        serializer.save(created_by=self.request.user)


class StrategyItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Strategy Item CRUD operations.
    """
    queryset = StrategyItem.objects.all()
    serializer_class = StrategyItemCreateUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter by deployment_plan if provided."""
        queryset = super().get_queryset()
        deployment_plan_id = self.request.query_params.get('deployment_plan')

        if deployment_plan_id:
            queryset = queryset.filter(deployment_plan_id=deployment_plan_id)

        # Filter by company through deployment_plan
        if hasattr(self.request.user, 'company') and self.request.user.company:
            queryset = queryset.filter(
                deployment_plan__project__company=self.request.user.company
            )

        return queryset


class RolloutPhaseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Rollout Phase CRUD operations.
    """
    queryset = RolloutPhase.objects.all()
    serializer_class = RolloutPhaseCreateUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter by deployment_plan if provided."""
        queryset = super().get_queryset()
        deployment_plan_id = self.request.query_params.get('deployment_plan')

        if deployment_plan_id:
            queryset = queryset.filter(deployment_plan_id=deployment_plan_id)

        # Filter by company through deployment_plan
        if hasattr(self.request.user, 'company') and self.request.user.company:
            queryset = queryset.filter(
                deployment_plan__project__company=self.request.user.company
            )

        return queryset


class PhaseTaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Phase Task CRUD operations.
    """
    queryset = PhaseTask.objects.all()
    serializer_class = PhaseTaskCreateUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter by rollout_phase if provided."""
        queryset = super().get_queryset()
        rollout_phase_id = self.request.query_params.get('rollout_phase')

        if rollout_phase_id:
            queryset = queryset.filter(rollout_phase_id=rollout_phase_id)

        # Filter by company through rollout_phase
        if hasattr(self.request.user, 'company') and self.request.user.company:
            queryset = queryset.filter(
                rollout_phase__deployment_plan__project__company=self.request.user.company
            )

        return queryset