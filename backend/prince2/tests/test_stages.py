"""Tests for PRINCE2 Stages"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestPRINCE2Stages:
    """Test PRINCE2 project stages"""
    
    def test_create_stage(self, authenticated_client, prince2_project):
        """Test creating a PRINCE2 stage"""
        url = reverse('prince2:prince2-stages-list', kwargs={'project_id': prince2_project.id})
        data = {
            'name': 'Initiation Stage',
            'description': 'Project initiation',
            'order': 1,
            'start_date': '2026-02-01',
            'end_date': '2026-02-28'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_stage_gate(self, authenticated_client, prince2_project):
        """Test stage gate review"""
        # Create stage
        url = reverse('prince2:prince2-stages-list', kwargs={'project_id': prince2_project.id})
        stage = authenticated_client.post(url, {'name': 'Test Stage'})
        
        # Complete stage gate
        gate_url = reverse('prince2:prince2-stage-gates-detail', 
                         kwargs={'project_id': prince2_project.id, 'pk': stage.data['id']})
        response = authenticated_client.post(gate_url, {'approved': True})
        assert response.status_code == 200
