"""Tests for Waterfall Milestones"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestWaterfallMilestones:
    """Test Waterfall milestones"""
    
    def test_create_milestone(self, authenticated_client, waterfall_project):
        """Test creating a milestone"""
        url = reverse('waterfall:milestone-list', kwargs={'project_id': waterfall_project.id})
        data = {
            'name': 'Requirements Sign-off',
            'description': 'All requirements approved',
            'due_date': '2026-03-01',
            'status': 'pending'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_milestone_completion(self, authenticated_client, waterfall_project):
        """Test marking milestone as complete"""
        url = reverse('waterfall:milestone-list', kwargs={'project_id': waterfall_project.id})
        
        # Create milestone
        milestone = authenticated_client.post(url, {'name': 'Test Milestone'})
        milestone_id = milestone.data['id']
        
        # Complete it
        update_url = reverse('waterfall:milestone-detail', 
                           kwargs={'project_id': waterfall_project.id, 'pk': milestone_id})
        response = authenticated_client.patch(update_url, {'status': 'completed'})
        assert response.status_code == 200
