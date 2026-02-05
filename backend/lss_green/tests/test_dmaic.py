"""Tests for LSS Green DMAIC Process"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestLSSGreenDMAIC:
    """Test Lean Six Sigma Green Belt DMAIC process"""
    
    def test_create_dmaic_phase(self, authenticated_client, lss_green_project):
        """Test creating DMAIC phase"""
        url = reverse('lss-green:dmaic-phase-list', kwargs={'project_id': lss_green_project.id})
        data = {
            'phase': 'define',
            'objective': 'Define project scope and problem statement',
            'status': 'in_progress'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
        assert response.data['phase'] == 'define'
    
    def test_dmaic_phase_order(self, authenticated_client, lss_green_project, dmaic_phases):
        """Test DMAIC phases follow correct order"""
        url = reverse('lss-green:dmaic-phase-list', kwargs={'project_id': lss_green_project.id})
        
        for order, phase in enumerate(dmaic_phases, 1):
            data = {'phase': phase, 'order': order}
            response = authenticated_client.post(url, data)
            assert response.status_code == 201
        
        # Verify order
        response = authenticated_client.get(url)
        assert len(response.data) == 5
