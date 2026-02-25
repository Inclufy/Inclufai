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
        company = getattr(user, 'company', None)
        if not company:
            return Portfolio.objects.none()
        return Portfolio.objects.filter(company=company)

    def perform_create(self, serializer):
        user = self.request.user
        company = getattr(user, 'company', None)
        if company:
            serializer.save(company=company)
        else:
            serializer.save()

    def perform_update(self, serializer):
        user = self.request.user
        company = getattr(user, 'company', None)
        if company:
            serializer.save(company=company)
        else:
            serializer.save()


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


# AI Report Generation
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status as http_status

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_ai_report(request):
    """Generate an AI-powered report."""
    from .ai_reports import generate_report
    from .models import Portfolio, GovernanceBoard, GovernanceStakeholder
    from django.contrib.auth import get_user_model
    
    User = get_user_model()
    report_id = request.data.get('report_id')
    
    if not report_id:
        return Response({"error": "report_id is required"}, status=http_status.HTTP_400_BAD_REQUEST)
    
    user = request.user
    company = getattr(user, 'company', None)
    
    # Gather context data
    portfolios = Portfolio.objects.filter(company=company) if company else Portfolio.objects.none()
    portfolio_names = ", ".join([p.name for p in portfolios]) or "No portfolios"
    
    try:
        from projects.models import Project
        projects = Project.objects.filter(company=company) if company else Project.objects.none()
        project_count = projects.count()
        active_projects = projects.filter(status='active').count()
    except:
        project_count = 0
        active_projects = 0
    
    try:
        from programs.models import Program
        program_count = Program.objects.filter(company=company).count() if company else 0
    except:
        program_count = 0
    
    board_count = GovernanceBoard.objects.filter(portfolio__company=company).count() if company else 0
    stakeholder_count = GovernanceStakeholder.objects.filter(portfolio__company=company).count() if company else 0
    team_count = User.objects.filter(company=company).count() if company else 0
    
    context = {
        "portfolios": portfolio_names,
        "program_count": program_count,
        "project_count": project_count,
        "active_projects": active_projects,
        "company_name": company.name if company else "Unknown",
        "board_count": board_count,
        "stakeholder_count": stakeholder_count,
        "team_count": team_count,
        "user_name": user.get_full_name() or user.email,
        "user_role": user.role,
    }
    
    report = generate_report(report_id, context)
    return Response(report)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_generate_text(request):
    """Simple AI text generation endpoint."""
    from langchain_openai import ChatOpenAI
    from django.conf import settings
    import logging

    logger = logging.getLogger(__name__)

    prompt = request.data.get('prompt', '')
    if not prompt:
        return Response({"error": "prompt is required"}, status=http_status.HTTP_400_BAD_REQUEST)

    api_key = getattr(settings, 'OPENAI_API_KEY', None)
    if not api_key or api_key.startswith('sk-test') or len(api_key) < 20:
        logger.warning("OPENAI_API_KEY is not configured or is a test key")
        return Response(
            {"error": "AI service is not configured. Please set a valid OPENAI_API_KEY."},
            status=http_status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    try:
        llm = ChatOpenAI(
            temperature=0.7,
            model_name="gpt-4o",
            openai_api_key=api_key,
        )
        response = llm.invoke(prompt)
        return Response({"response": response.content.strip()})
    except Exception as e:
        logger.error(f"AI generation failed: {e}")
        return Response(
            {"error": "AI service temporarily unavailable. Please try again later."},
            status=http_status.HTTP_503_SERVICE_UNAVAILABLE,
        )
