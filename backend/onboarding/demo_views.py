"""
Demo environment API views for ProjectPal.
Provides endpoints to seed, reset, and switch industry-specific demo data.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from projects.models import Project
from .demo_data import DEMO_TEMPLATES, DEFAULT_TEMPLATE, generate_demo_projects


INDUSTRY_META = {
    'IT & Software':               {'color': '#8B5CF6', 'icon': 'Cloud'},
    'Bouw & Constructie':          {'color': '#F59E0B', 'icon': 'HardHat'},
    'Zorg & Welzijn':              {'color': '#0EA5E9', 'icon': 'Heart'},
    'Financiële Dienstverlening':   {'color': '#10B981', 'icon': 'Building2'},
    'Consultancy':                 {'color': '#6366F1', 'icon': 'Briefcase'},
    'Retail & E-commerce':         {'color': '#EF4444', 'icon': 'ShoppingCart'},
    'Onderwijs':                   {'color': '#EC4899', 'icon': 'GraduationCap'},
}


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def demo_industries(request):
    """Return available demo industries."""
    industries = []
    for name, meta in INDUSTRY_META.items():
        industries.append({
            'id': name,
            'name': name,
            'color': meta['color'],
            'icon': meta['icon'],
        })
    return Response({'industries': industries})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def demo_status(request):
    """Return current demo data status for the user's company."""
    company = request.user.company
    if not company:
        return Response({'has_data': False, 'project_count': 0, 'active_industry': None})

    demo_projects = Project.objects.filter(company=company, is_demo=True)
    count = demo_projects.count()

    # Determine active industry from first demo project description match
    active_industry = None
    if count > 0:
        first = demo_projects.first()
        if first:
            for industry_name, templates in DEMO_TEMPLATES.items():
                for tpl in templates:
                    if first.name == tpl['name']:
                        active_industry = industry_name
                        break
                if active_industry:
                    break

    return Response({
        'has_data': count > 0,
        'project_count': count,
        'active_industry': active_industry,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def demo_seed(request):
    """Seed demo data for a given industry."""
    company = request.user.company
    if not company:
        return Response(
            {'error': 'User has no company associated'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    industry = request.data.get('industry', 'IT & Software')

    # Don't seed if demo data already exists
    existing = Project.objects.filter(company=company, is_demo=True).count()
    if existing > 0:
        return Response(
            {'error': 'Demo data already exists. Reset first or use switch.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    generate_demo_projects(
        company=company,
        user=request.user,
        industry=industry,
        methodology='agile',
    )

    count = Project.objects.filter(company=company, is_demo=True).count()

    return Response({
        'message': f'Demo data generated for {industry}',
        'projects_created': count,
        'active_industry': industry,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def demo_reset(request):
    """Delete all demo data for the user's company."""
    company = request.user.company
    if not company:
        return Response(
            {'error': 'User has no company associated'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    deleted_count, _ = Project.objects.filter(company=company, is_demo=True).delete()

    return Response({
        'message': f'Demo data reset. {deleted_count} objects removed.',
        'deleted_count': deleted_count,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def demo_switch(request):
    """Switch to a different demo industry (reset + reseed)."""
    company = request.user.company
    if not company:
        return Response(
            {'error': 'User has no company associated'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    industry = request.data.get('industry', 'IT & Software')

    # Delete existing demo data
    Project.objects.filter(company=company, is_demo=True).delete()

    # Seed new industry
    generate_demo_projects(
        company=company,
        user=request.user,
        industry=industry,
        methodology='agile',
    )

    count = Project.objects.filter(company=company, is_demo=True).count()

    return Response({
        'message': f'Switched to {industry}',
        'projects_created': count,
        'active_industry': industry,
    })
