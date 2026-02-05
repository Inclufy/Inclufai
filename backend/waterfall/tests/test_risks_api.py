import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from projects.models import Project
from waterfall.models import WaterfallRisk

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
        name='Test Project',
        methodology='waterfall',
        created_by=user
    )

@pytest.fixture
def authenticated_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client

@pytest.mark.django_db
class TestWaterfallRiskAPI:
    
    def test_list_risks(self, authenticated_client, project):
        """Test listing risks"""
        url = f'/api/v1/projects/{project.id}/waterfall/risks/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
    
    def test_create_risk(self, authenticated_client, project):
        """Test creating a risk"""
        url = f'/api/v1/projects/{project.id}/waterfall/risks/'
        data = {
            'project': project.id,
            'title': 'Test Risk',
            'description': 'Test description',
            'category': 'technical',
            'probability': 'high',
            'impact': 'high',
            'status': 'identified',
            'owner': 'Test Owner',
            'mitigation': 'Test mitigation',
            'date_identified': '2026-02-04'
        }
        
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == 'Test Risk'
        assert WaterfallRisk.objects.count() == 1
    
    def test_delete_risk(self, authenticated_client, project):
        """Test deleting a risk"""
        risk = WaterfallRisk.objects.create(
            project=project,
            title='Risk to Delete',
            description='Description',
            category='technical',
            probability='low',
            impact='low',
            owner='Owner',
            mitigation='Mitigation',
            date_identified='2026-02-04'
        )
        
        url = f'/api/v1/projects/{project.id}/waterfall/risks/{risk.id}/'
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert WaterfallRisk.objects.count() == 0
