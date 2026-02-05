"""Tests for Scrum Sprints"""
import pytest
from django.urls import reverse
from datetime import datetime, timedelta
from scrum.models import Sprint


@pytest.mark.django_db
class TestScrumSprints:
    """Test Scrum Sprint functionality"""
    
    def test_create_sprint(self, authenticated_client, scrum_project):
        """Test creating a sprint"""
        url = reverse('scrum:scrum-sprints-list', kwargs={'project_id': scrum_project.id})
        data = {
            'name': 'Sprint 1',
            'goal': 'Complete user authentication',
            'start_date': datetime.now().date().isoformat(),
            'end_date': (datetime.now() + timedelta(days=14)).date().isoformat(),
            'duration_weeks': 2
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
        assert response.data['name'] == 'Sprint 1'
    
    def test_start_sprint(self, authenticated_client, scrum_project):
        """Test starting a sprint"""
        sprint = Sprint.objects.create(
            project=scrum_project,
            name='Sprint 1',
            start_date=datetime.now().date(),
            end_date=(datetime.now() + timedelta(days=14)).date(),
            status='planned'
        )
        
        url = reverse('scrum:scrum-sprints-start', kwargs={'project_id': scrum_project.id, 'pk': sprint.id})
        response = authenticated_client.post(url)
        assert response.status_code == 200
        assert response.data['status'] == 'active'
    
    def test_complete_sprint(self, authenticated_client, scrum_project):
        """Test completing a sprint"""
        sprint = Sprint.objects.create(
            project=scrum_project,
            name='Sprint 1',
            start_date=datetime.now().date(),
            end_date=datetime.now().date(),
            status='active'
        )
        
        url = reverse('scrum:scrum-sprints-complete', kwargs={'project_id': scrum_project.id, 'pk': sprint.id})
        response = authenticated_client.post(url)
        assert response.status_code == 200
        assert response.data['status'] == 'completed'
    
    def test_record_burndown(self, authenticated_client, scrum_project):
        """Test recording sprint burndown"""
        sprint = Sprint.objects.create(
            project=scrum_project,
            name='Sprint 1',
            start_date=datetime.now().date(),
            end_date=(datetime.now() + timedelta(days=14)).date(),
            status='active'
        )
        
        url = reverse('scrum:scrum-sprints-burndown', kwargs={'project_id': scrum_project.id, 'pk': sprint.id})
        data = {
            'remaining_points': 25
        }
        response = authenticated_client.post(url, data)
        # Burndown endpoint returns 200, not 201
        assert response.status_code == 200
