import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from projects.models import Project
from agile.models import DefinitionOfDone

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user(db):
    return User.objects.create_user(
        username='testuser',
        email='test@projextpal.com',
        password='testpass123',
        first_name='Test',
        last_name='User'
    )

@pytest.fixture
def project(db, user):
    return Project.objects.create(
        name='Test Agile Project',
        methodology='agile',
        created_by=user
    )

@pytest.fixture
def authenticated_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client

@pytest.mark.django_db
class TestDefinitionOfDoneAPI:
    
    def test_list_dod_items(self, authenticated_client, project):
        """Test listing DoD items"""
        url = f'/api/v1/projects/{project.id}/agile/definition-of-done/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
    
    def test_create_dod_item(self, authenticated_client, project):
        """Test creating a DoD item"""
        url = f'/api/v1/projects/{project.id}/agile/definition-of-done/'
        data = {
            'project': project.id,
            'title': 'Code Review',
            'description': 'All code must be peer reviewed',
            'category': 'quality',
            'is_required': True
        }
        
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == 'Code Review'
        assert response.data['is_required'] is True
        assert DefinitionOfDone.objects.count() == 1
    
    def test_create_optional_dod_item(self, authenticated_client, project):
        """Test creating an optional DoD item"""
        url = f'/api/v1/projects/{project.id}/agile/definition-of-done/'
        data = {
            'project': project.id,
            'title': 'Performance Test',
            'description': 'Optional performance testing',
            'category': 'testing',
            'is_required': False
        }
        
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['is_required'] is False
    
    def test_update_dod_item(self, authenticated_client, project):
        """Test updating a DoD item"""
        dod = DefinitionOfDone.objects.create(
            project=project,
            title='Original Title',
            description='Original description',
            category='quality',
            is_required=True
        )
        
        url = f'/api/v1/projects/{project.id}/agile/definition-of-done/{dod.id}/'
        data = {'title': 'Updated Title', 'is_required': False}
        
        response = authenticated_client.patch(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == 'Updated Title'
        assert response.data['is_required'] is False
    
    def test_delete_dod_item(self, authenticated_client, project):
        """Test deleting a DoD item"""
        dod = DefinitionOfDone.objects.create(
            project=project,
            title='DoD to Delete',
            description='Description',
            category='quality',
            is_required=True
        )
        
        url = f'/api/v1/projects/{project.id}/agile/definition-of-done/{dod.id}/'
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert DefinitionOfDone.objects.count() == 0
