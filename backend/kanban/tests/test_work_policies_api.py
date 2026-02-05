import pytest
from rest_framework import status
from kanban.models import WorkPolicy

@pytest.mark.django_db
class TestWorkPolicyAPI:
    
    def test_list_work_policies(self, authenticated_client, kanban_project):
        """Test listing work policies"""
        url = f'/api/v1/projects/{kanban_project.id}/kanban/work-policies/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
    
    def test_create_work_policy(self, authenticated_client, kanban_project):
        """Test creating a work policy"""
        url = f'/api/v1/projects/{kanban_project.id}/kanban/work-policies/'
        data = {
            'project': kanban_project.id,
            'title': 'Definition of Ready',
            'description': 'All tasks must have acceptance criteria',
            'category': 'workflow'  # ← FIXED: valid choice from model
        }
        
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == 'Definition of Ready'
        assert WorkPolicy.objects.count() == 1
    
    def test_update_work_policy(self, authenticated_client, kanban_project):
        """Test updating a work policy"""
        policy = WorkPolicy.objects.create(
            project=kanban_project,
            title='Original Policy',
            description='Original description',
            category='workflow'  # ← FIXED
        )
        
        url = f'/api/v1/projects/{kanban_project.id}/kanban/work-policies/{policy.id}/'
        data = {'title': 'Updated Policy'}
        
        response = authenticated_client.patch(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == 'Updated Policy'
    
    def test_delete_work_policy(self, authenticated_client, kanban_project):
        """Test deleting a work policy"""
        policy = WorkPolicy.objects.create(
            project=kanban_project,
            title='Policy to Delete',
            description='Description',
            category='quality'  # ← FIXED
        )
        
        url = f'/api/v1/projects/{kanban_project.id}/kanban/work-policies/{policy.id}/'
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert WorkPolicy.objects.count() == 0
