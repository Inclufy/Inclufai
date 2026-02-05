import pytest
from rest_framework import status
from waterfall.models import WaterfallIssue

@pytest.mark.django_db
class TestWaterfallIssueAPI:
    
    def test_list_issues(self, authenticated_client, waterfall_project):
        """Test listing issues"""
        url = f'/api/v1/projects/{waterfall_project.id}/waterfall/issues/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
    
    def test_create_issue(self, authenticated_client, waterfall_project):
        """Test creating an issue"""
        url = f'/api/v1/projects/{waterfall_project.id}/waterfall/issues/'
        data = {
            'project': waterfall_project.id,
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
    
    def test_update_issue_status(self, authenticated_client, waterfall_project):
        """Test updating issue status"""
        issue = WaterfallIssue.objects.create(
            project=waterfall_project,
            title='Bug Issue',
            description='Description',
            category='technical',
            priority='high',
            status='open',
            assignee='Dev',
            reporter='QA',
            date_reported='2026-02-05'
        )
        
        url = f'/api/v1/projects/{waterfall_project.id}/waterfall/issues/{issue.id}/'
        data = {
            'status': 'resolved',
            'resolution': 'Fixed in version 1.2'
        }
        
        response = authenticated_client.patch(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['status'] == 'resolved'
    
    def test_delete_issue(self, authenticated_client, waterfall_project):
        """Test deleting an issue"""
        issue = WaterfallIssue.objects.create(
            project=waterfall_project,
            title='Issue to Delete',
            description='Description',
            category='technical',
            priority='low',
            assignee='Dev',
            reporter='QA',
            date_reported='2026-02-05'
        )
        
        url = f'/api/v1/projects/{waterfall_project.id}/waterfall/issues/{issue.id}/'
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert WaterfallIssue.objects.count() == 0
