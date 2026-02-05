"""Tests for Agile Ceremonies"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestAgileCeremonies:
    """Test Agile ceremonies"""
    
    def test_daily_standup(self, authenticated_client, agile_project):
        """Test daily standup recording"""
        url = reverse('agile:standup-list', kwargs={'project_id': agile_project.id})
        data = {
            'date': '2026-02-05',
            'what_done': 'Completed login API',
            'what_doing': 'Working on authentication',
            'blockers': 'None'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_sprint_retrospective(self, authenticated_client, agile_project):
        """Test sprint retrospective"""
        url = reverse('agile:retrospective-list', kwargs={'project_id': agile_project.id})
        data = {
            'sprint_id': 1,
            'what_went_well': 'Good team collaboration',
            'what_to_improve': 'Better estimation',
            'action_items': 'Use planning poker'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
