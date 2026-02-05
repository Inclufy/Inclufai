import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from projects.models import Project
from kanban.models import WorkPolicy

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user(db):
    return User.objects.create_user(
        email='test@projextpal.com',
        password='testpass123',
        first_name='Test',
        last_name='User'
    )

@pytest.fixture
def project(db, user):
    return Project.objects.create(
        name='Test Kanban Project',
        methodology='kanban',
        created_by=user
    )

@pytest.fixture
def authenticated_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client

@pytest.mark.django_db
class TestWorkPolicyAPI:
    
    def test_list_work_policies(self, authenticated_client, project):
        """Test listing work policies"""
        url = f'/api/v1/projects/{project.id}/kanban/work-policies/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
    
    def test_create_work_policy(self, authenticated_client, project):
        """Test creating a work policy"""
        url = f'/api/v1/projects/{project.id}/kanban/work-policies/'
        data = {
            'project': project.id,
            'title': 'Definition of Ready',
            'description': 'All tasks must have acceptance criteria',
            'category': 'entry',
            'applies_to': 'backlog'
        }
        
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == 'Definition of Ready'
        assert WorkPolicy.objects.count() == 1
    
    def test_update_work_policy(self, authenticated_client, project):
        """Test updating a work policy"""
        policy = WorkPolicy.objects.create(
            project=project,
            title='Original Policy',
            description='Original description',
            category='entry',
            applies_to='backlog'
        )
        
        url = f'/api/v1/projects/{project.id}/kanban/work-policies/{policy.id}/'
        data = {'title': 'Updated Policy'}
        
        response = authenticated_client.patch(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == 'Updated Policy'
    
    def test_delete_work_policy(self, authenticated_client, project):
        """Test deleting a work policy"""
        policy = WorkPolicy.objects.create(
            project=project,
            title='Policy to Delete',
            description='Description',
            category='entry',
            applies_to='backlog'
        )
        
        url = f'/api/v1/projects/{project.id}/kanban/work-policies/{policy.id}/'
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert WorkPolicy.objects.count() == 0
