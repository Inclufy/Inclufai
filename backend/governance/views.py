from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Portfolio, GovernanceBoard, BoardMember, GovernanceStakeholder
from .serializers import (
    PortfolioSerializer, GovernanceBoardSerializer, 
    BoardMemberSerializer, GovernanceStakeholderSerializer
)


class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'company']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'superadmin':
            return Portfolio.objects.all()
        return Portfolio.objects.filter(company=user.company)


class GovernanceBoardViewSet(viewsets.ModelViewSet):
    queryset = GovernanceBoard.objects.all()
    serializer_class = GovernanceBoardSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['board_type', 'is_active']
    search_fields = ['name', 'description']


class BoardMemberViewSet(viewsets.ModelViewSet):
    queryset = BoardMember.objects.all()
    serializer_class = BoardMemberSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['board', 'role', 'is_active']


class GovernanceStakeholderViewSet(viewsets.ModelViewSet):
    queryset = GovernanceStakeholder.objects.all()
    serializer_class = GovernanceStakeholderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['role', 'influence_level', 'interest_level', 'is_active']
