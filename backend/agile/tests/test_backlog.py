"""Tests for Agile Product Backlog"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestAgileBacklog:
    """Test Agile product backlog"""
    
    def test_create_user_story(self, authenticated_client, agile_project):
        """Test creating a user story"""
        url = reverse('agile:agile-backlog-list', kwargs={'project_id': agile_project.id})
        data = {
            'title': 'As a user, I want to login',
            'description': 'User authentication story',
            'story_points': 5,
            'priority': 'must_have'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_backlog_prioritization(self, authenticated_client, agile_project):
        """Test backlog item prioritization"""
        url = reverse('agile:agile-backlog-list', kwargs={'project_id': agile_project.id})
        
        stories = [
            {'title': 'Story 1', 'priority': 'must_have', 'order': 1},
            {'title': 'Story 2', 'priority': 'should_have', 'order': 2},
            {'title': 'Story 3', 'priority': 'could_have', 'order': 3}
        ]
        
        for story in stories:
            authenticated_client.post(url, story)
        
        response = authenticated_client.get(url)
        assert response.status_code == 200
