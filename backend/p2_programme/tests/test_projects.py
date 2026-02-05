"""Tests for P2 Programme Projects"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestP2Projects:
    """Test P2 programme projects"""
    
    def test_create_programme_project(self, authenticated_client, p2_programme):
        """Test creating project within programme"""
        url = reverse('p2:project-list', kwargs={'programme_id': p2_programme.id})
        data = {
            'name': 'Infrastructure Upgrade',
            'methodology': 'prince2',
            'start_date': '2026-02-01',
            'end_date': '2026-08-31'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
