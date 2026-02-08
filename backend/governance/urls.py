from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PortfolioViewSet,
    GovernanceBoardViewSet,
    BoardMemberViewSet,
    GovernanceStakeholderViewSet
)

router = DefaultRouter()
router.register(r'portfolios', PortfolioViewSet, basename='portfolio')
router.register(r'boards', GovernanceBoardViewSet, basename='governance-board')
router.register(r'board-members', BoardMemberViewSet, basename='board-member')
router.register(r'stakeholders', GovernanceStakeholderViewSet, basename='governance-stakeholder')

urlpatterns = [
    path('', include(router.urls)),
]
