from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DeploymentPlanViewSet,
    StrategyItemViewSet,
    RolloutPhaseViewSet,
    PhaseTaskViewSet,
)

router = DefaultRouter()
router.register(r'deployment-plans', DeploymentPlanViewSet, basename='deployment-plan')
router.register(r'strategy-items', StrategyItemViewSet, basename='strategy-item')
router.register(r'rollout-phases', RolloutPhaseViewSet, basename='rollout-phase')
router.register(r'phase-tasks', PhaseTaskViewSet, basename='phase-task')

urlpatterns = [
    path('', include(router.urls)),
]