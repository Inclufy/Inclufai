"""Tests for Waterfall Phases"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestWaterfallPhases:
    """Test Waterfall project phases"""
    
    def test_create_phase(self, authenticated_client, waterfall_project):
        """Test creating a waterfall phase"""
        url = reverse('waterfall:waterfall-phases-list', kwargs={'project_id': waterfall_project.id})
        data = {
            'phase_type': 'requirements',  # ← ADDED required field
            'name': 'Requirements Phase',
            'description': 'Gather all requirements',
            'order': 1,
            'start_date': '2026-02-01',
            'end_date': '2026-03-01'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
        assert response.data['name'] == 'Requirements Phase'
    
    def test_list_phases(self, authenticated_client, waterfall_project):
        """Test listing phases"""
        url = reverse('waterfall:waterfall-phases-list', kwargs={'project_id': waterfall_project.id})
        response = authenticated_client.get(url)
        assert response.status_code == 200
    
    def test_phase_order(self, authenticated_client, waterfall_project):
        """Test phases are ordered correctly"""
        # Create multiple phases
        url = reverse('waterfall:waterfall-phases-list', kwargs={'project_id': waterfall_project.id})
        
        phases = [
            {'phase_type': 'requirements', 'name': 'Requirements', 'order': 1},  # ← ADDED
            {'phase_type': 'design', 'name': 'Design', 'order': 2},  # ← ADDED
            {'phase_type': 'development', 'name': 'Implementation', 'order': 3}  # ← ADDED
        ]
        
        for phase in phases:
            authenticated_client.post(url, phase)
        
        response = authenticated_client.get(url)
        assert response.status_code == 200
        assert len(response.data) >= 3
