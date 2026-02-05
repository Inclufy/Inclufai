"""Tests for Waterfall Tasks"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestWaterfallTasks:
    """Test Waterfall tasks"""
    
    def test_create_task(self, authenticated_client, waterfall_project):
        """Test creating a task"""
        url = reverse('waterfall:task-list', kwargs={'project_id': waterfall_project.id})
        data = {
            'title': 'Write Requirements Document',
            'description': 'Document all functional requirements',
            'status': 'not_started',
            'priority': 'high'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_task_dependencies(self, authenticated_client, waterfall_project):
        """Test task dependencies"""
        url = reverse('waterfall:task-list', kwargs={'project_id': waterfall_project.id})
        
        # Create first task
        task1 = authenticated_client.post(url, {'title': 'Task 1'})
        task1_id = task1.data['id']
        
        # Create dependent task
        data = {
            'title': 'Task 2',
            'dependencies': [task1_id]
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
