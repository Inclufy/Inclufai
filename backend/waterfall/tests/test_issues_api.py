import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from projects.models import Project
from waterfall.models import WaterfallIssue

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
        name='Test Project',
        methodology='waterfall',
        created_by=user
    )

@pytest.fixture
def authenticated_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client

@pytest.mark.django_db
class TestWaterfallIssueAPI:
    
    def test_list_issues(self, authenticated_client, project):
        """Test listing issues"""
        url = f'/api/v1/projects/{project.id}/waterfall/issues/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
    
    def test_create_issue(self, authenticated_client, project):
        """Test creating an issue"""
        url = f'/api/v1/projects/{project.id}/waterfall/issues/'
        data = {
            'project': project.id,
            'title': 'Test Issue',
            'description': 'Test description',
            'category': 'technical',
            'priority': 'high',
            'status': 'open',
            'assignee': 'Test Assignee',
            'reporter': 'Test Reporter',
            'date_reported': '2026-02-05'
        }
        
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == 'Test Issue'
        assert WaterfallIssue.objects.count() == 1
    
    def test_update_issue_status(self, authenticated_client, project):
        """Test updating issue status"""
        issue = WaterfallIssue.objects.create(
            project=project,
            title='Bug Issue',
            description='Description',
            category='technical',
            priority='high',
            status='open',
            assignee='Dev',
            reporter='QA',
            date_reported='2026-02-05'
        )
        
        url = f'/api/v1/projects/{project.id}/waterfall/issues/{issue.id}/'
        data = {
            'status': 'resolved',
            'resolution': 'Fixed in version 1.2'
        }
        
        response = authenticated_client.patch(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['status'] == 'resolved'
        assert response.data['resolution'] == 'Fixed in version 1.2'
    
    def test_delete_issue(self, authenticated_client, project):
        """Test deleting an issue"""
        issue = WaterfallIssue.objects.create(
            project=project,
            title='Issue to Delete',
            description='Description',
            category='technical',
            priority='low',
            assignee='Dev',
            reporter='QA',
            date_reported='2026-02-05'
        )
        
        url = f'/api/v1/projects/{project.id}/waterfall/issues/{issue.id}/'
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert WaterfallIssue.objects.count() == 0
