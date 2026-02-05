"""Tests for Agile Sprints"""
import pytest
from django.urls import reverse
from datetime import datetime, timedelta


@pytest.mark.django_db
class TestAgileSprints:
    """Test Agile sprints"""
    
    def test_create_sprint(self, authenticated_client, agile_project):
        """Test creating a sprint"""
        url = reverse('agile:sprint-list', kwargs={'project_id': agile_project.id})
        data = {
            'name': 'Sprint 1',
            'goal': 'Complete login feature',
            'start_date': datetime.now().date(),
            'end_date': (datetime.now() + timedelta(days=14)).date()
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_sprint_duration(self, authenticated_client, agile_project):
        """Test sprint duration validation"""
        url = reverse('agile:sprint-list', kwargs={'project_id': agile_project.id})
        data = {
            'name': 'Sprint 1',
            'start_date': '2026-02-01',
            'end_date': '2026-02-15'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
        assert response.data['duration_days'] == 14
