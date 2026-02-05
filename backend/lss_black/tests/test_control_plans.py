"""Tests for LSS Black Control Plans"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestLSSBlackControlPlans:
    """Test LSS Black Belt control plans"""
    
    def test_create_control_plan(self, authenticated_client, lss_black_project):
        """Test creating control plan"""
        url = reverse('lss-black:control-plan-list', kwargs={'project_id': lss_black_project.id})
        data = {
            'process_step': 'Quality Inspection',
            'control_method': 'SPC Chart',
            'measurement_frequency': 'hourly',
            'reaction_plan': 'Stop process and investigate'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_spc_chart(self, authenticated_client, lss_black_project):
        """Test Statistical Process Control chart"""
        url = reverse('lss-black:spc-chart-list', kwargs={'project_id': lss_black_project.id})
        data = {
            'chart_type': 'x_bar_r',
            'ucl': 48.5,
            'center_line': 45.0,
            'lcl': 41.5
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
