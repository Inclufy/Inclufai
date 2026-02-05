"""Tests for LSS Green Metrics"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestLSSGreenMetrics:
    """Test LSS Green Belt metrics"""
    
    def test_process_capability(self, authenticated_client, lss_green_project):
        """Test process capability calculations"""
        url = reverse('lss-green:metric-list', kwargs={'project_id': lss_green_project.id})
        data = {
            'metric_type': 'process_capability',
            'cp': 1.33,
            'cpk': 1.25,
            'defects_per_million': 3.4
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_baseline_measurement(self, authenticated_client, lss_green_project):
        """Test baseline measurement"""
        url = reverse('lss-green:measurement-list', kwargs={'project_id': lss_green_project.id})
        data = {
            'phase': 'measure',
            'metric': 'cycle_time',
            'baseline_value': 45.5,
            'unit': 'minutes'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
