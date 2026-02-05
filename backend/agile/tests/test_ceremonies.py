"""Tests for Agile Ceremonies"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestAgileCeremonies:
    """Test Agile ceremonies"""
    
    def test_daily_standup(self, authenticated_client, agile_project, agile_iteration):
        """Test daily standup recording"""
        url = reverse('agile:agile-daily-updates-list', kwargs={'project_id': agile_project.id})
        data = {
            'iteration_id': agile_iteration.id,
            'date': '2026-02-05',
            'yesterday': 'Completed login API',
            'today': 'Working on authentication',
            'blockers': 'None'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_sprint_retrospective(self, authenticated_client, agile_project, agile_iteration):
        """Test sprint retrospective"""
        url = reverse('agile:agile-retrospectives-list', kwargs={'project_id': agile_project.id})
        data = {
            'iteration': agile_iteration.id,
            'date': '2026-02-05',
            'notes': 'What went well: Good team collaboration\nWhat to improve: Better estimation\nAction items: Use planning poker'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
