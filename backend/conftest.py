import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from projects.models import Project
from accounts.models import Company

User = get_user_model()

@pytest.fixture
def api_client():
    """API client for making requests"""
    return APIClient()

@pytest.fixture
def company(db):
    """Create a test company"""
    return Company.objects.create(
        name='Test Company',
        slug='test-company'
    )

@pytest.fixture
def user(db, company):
    """Create a test user - username MUST be first argument"""
    user = User.objects.create_user(
        'testuser',
        email='test@projextpal.com',
        password='testpass123'
    )
    
    user.first_name = 'Test'
    user.last_name = 'User'
    
    if hasattr(user, 'company'):
        user.company = company
    
    user.save()
    return user

@pytest.fixture
def authenticated_client(api_client, user):
    """Authenticated API client"""
    api_client.force_authenticate(user=user)
    return api_client

@pytest.fixture
def waterfall_project(db, user, company):
    """Create a test Waterfall project"""
    return Project.objects.create(
        name='Test Waterfall Project',
        methodology='waterfall',
        created_by=user,
        company=company
    )

@pytest.fixture
def kanban_project(db, user, company):
    """Create a test Kanban project"""
    return Project.objects.create(
        name='Test Kanban Project',
        methodology='kanban',
        created_by=user,
        company=company
    )

@pytest.fixture
def agile_project(db, user, company):
    """Create a test Agile project"""
    return Project.objects.create(
        name='Test Agile Project',
        methodology='agile',
        created_by=user,
        company=company
    )
