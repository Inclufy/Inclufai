"""Tests for SAFe Agile Release Train"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestSAFeART:
    """Test SAFe Agile Release Train"""
    
    def test_create_art(self, authenticated_client, safe_program):
        """Test creating Agile Release Train"""
        url = reverse('safe:art-list', kwargs={'program_id': safe_program.id})
        data = {
            'name': 'Platform ART',
            'description': 'Platform development train',
            'team_count': 8
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_art_sync(self, authenticated_client, safe_program):
        """Test ART synchronization"""
        # Create ART
        url = reverse('safe:art-list', kwargs={'program_id': safe_program.id})
        art = authenticated_client.post(url, {'name': 'Test ART'})
        
        # Sync meeting
        sync_url = reverse('safe:art-sync', 
                          kwargs={'program_id': safe_program.id, 'pk': art.data['id']})
        data = {
            'meeting_date': '2026-02-05',
            'attendees': ['RTE', 'Scrum Masters'],
            'decisions': ['Sprint alignment confirmed']
        }
        response = authenticated_client.post(sync_url, data)
        assert response.status_code == 201
