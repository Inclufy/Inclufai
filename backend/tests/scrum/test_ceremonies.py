"""Tests for Scrum Ceremonies"""
import pytest
from django.urls import reverse
from datetime import datetime, timedelta
from scrum.models import Sprint


@pytest.mark.django_db
class TestScrumCeremonies:
    """Test Scrum ceremony functionality"""
    
    def test_create_daily_standup(self, authenticated_client, scrum_project):
        """Test creating a daily standup"""
        sprint = Sprint.objects.create(
            project=scrum_project,
            name='Sprint 1',
            start_date=datetime.now().date(),
            end_date=(datetime.now() + timedelta(days=14)).date(),
            status='active'
        )
        
        url = reverse('scrum:scrum-standups-list', kwargs={'project_id': scrum_project.id})
        data = {
            'sprint': sprint.id,
            'date': datetime.now().date().isoformat(),
            'notes': 'Team standup'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_sprint_review(self, authenticated_client, scrum_project):
        """Test sprint review"""
        sprint = Sprint.objects.create(
            project=scrum_project,
            name='Sprint 1',
            start_date=datetime.now().date(),
            end_date=datetime.now().date(),
            status='completed'
        )
        
        url = reverse('scrum:scrum-reviews-list', kwargs={'project_id': scrum_project.id})
        data = {
            'sprint': sprint.id,
            'review_date': datetime.now().date().isoformat(),
            'demo_summary': 'Demonstrated features',
            'feedback_summary': 'Positive feedback'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_sprint_retrospective(self, authenticated_client, scrum_project):
        """Test sprint retrospective"""
        sprint = Sprint.objects.create(
            project=scrum_project,
            name='Sprint 1',
            start_date=datetime.now().date(),
            end_date=datetime.now().date(),
            status='completed'
        )
        
        url = reverse('scrum:scrum-retros-list', kwargs={'project_id': scrum_project.id})
        data = {
            'sprint': sprint.id,
            'retro_date': datetime.now().date().isoformat(),
            'what_went_well': 'Good collaboration',
            'what_needs_improvement': 'Better estimation',
            'action_items': 'Practice planning poker'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
