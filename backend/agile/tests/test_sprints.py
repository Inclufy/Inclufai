import pytest
from django.urls import reverse
from rest_framework import status
from agile.models import AgileIteration


@pytest.mark.django_db
class TestAgileSprints:
    """Test Agile Sprint/Iteration functionality"""
    
    def test_create_sprint(self, authenticated_client, agile_project):
        """Test creating a sprint"""
        url = reverse('agile:agile-iterations-list', kwargs={'project_id': agile_project.id})
        data = {
            'name': 'Sprint 1',
            'goal': 'Complete user authentication',
            'start_date': '2026-02-01',
            'end_date': '2026-02-15'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
        assert AgileIteration.objects.count() == 1
    
    def test_sprint_duration(self, authenticated_client, agile_project):
        """Test sprint duration validation"""
        url = reverse('agile:agile-iterations-list', kwargs={'project_id': agile_project.id})
        data = {
            'name': 'Sprint 1',
            'start_date': '2026-02-01',
            'end_date': '2026-02-15'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
        assert response.data['start_date'] == '2026-02-01'
        assert response.data['end_date'] == '2026-02-15'
