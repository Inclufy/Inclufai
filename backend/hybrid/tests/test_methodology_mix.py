"""Tests for Hybrid Methodology Combinations"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestHybridMethodology:
    """Test Hybrid methodology features"""
    
    def test_combined_approaches(self, authenticated_client, hybrid_project):
        """Test combining multiple methodologies"""
        url = reverse('hybrid:config-list', kwargs={'project_id': hybrid_project.id})
        data = {
            'primary_methodology': 'agile',
            'secondary_methodologies': ['waterfall', 'kanban'],
            'approach_description': 'Agile development with waterfall planning'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_phase_based_methodology_switch(self, authenticated_client, hybrid_project):
        """Test switching methodologies by phase"""
        url = reverse('hybrid:phase-methodology-list', kwargs={'project_id': hybrid_project.id})
        phases = [
            {'phase': 'planning', 'methodology': 'waterfall'},
            {'phase': 'development', 'methodology': 'agile'},
            {'phase': 'deployment', 'methodology': 'kanban'}
        ]
        
        for phase_data in phases:
            response = authenticated_client.post(url, phase_data)
            assert response.status_code == 201
