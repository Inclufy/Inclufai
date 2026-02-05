import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from projects.models import Project

User = get_user_model()

@pytest.fixture
def api_client():
    """API client for making requests"""
    return APIClient()

@pytest.fixture
def user(db):
    """Create a test user - adjust based on your User model"""
    # Try without username first (for custom user models)
    try:
        return User.objects.create_user(
            email='test@projextpal.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
    except TypeError:
        # If that fails, try with username
        return User.objects.create_user(
            username='testuser',
            email='test@projextpal.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )

@pytest.fixture
def authenticated_client(api_client, user):
    """Authenticated API client"""
    api_client.force_authenticate(user=user)
    return api_client

@pytest.fixture
def waterfall_project(db, user):
    """Create a test Waterfall project"""
    return Project.objects.create(
        name='Test Waterfall Project',
        methodology='waterfall',
        created_by=user
    )

@pytest.fixture
def kanban_project(db, user):
    """Create a test Kanban project"""
    return Project.objects.create(
        name='Test Kanban Project',
        methodology='kanban',
        created_by=user
    )

@pytest.fixture
def agile_project(db, user):
    """Create a test Agile project"""
    return Project.objects.create(
        name='Test Agile Project',
        methodology='agile',
        created_by=user
    )
