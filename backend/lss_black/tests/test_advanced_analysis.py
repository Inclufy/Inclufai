"""Tests for LSS Black Advanced Statistical Analysis"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestLSSBlackAdvancedAnalysis:
    """Test Lean Six Sigma Black Belt advanced analysis"""
    
    def test_hypothesis_testing(self, authenticated_client, lss_black_project):
        """Test hypothesis testing"""
        url = reverse('lss-black:hypothesis-test-list', kwargs={'project_id': lss_black_project.id})
        data = {
            'test_type': 't_test',
            'null_hypothesis': 'Mean cycle time is 45 minutes',
            'alternative_hypothesis': 'Mean cycle time is less than 45 minutes',
            'alpha': 0.05,
            'p_value': 0.023
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_doe_experiment(self, authenticated_client, lss_black_project):
        """Test Design of Experiments"""
        url = reverse('lss-black:doe-list', kwargs={'project_id': lss_black_project.id})
        data = {
            'experiment_name': 'Process Optimization',
            'design_type': 'full_factorial',
            'factors': ['temperature', 'pressure', 'time'],
            'levels': 3
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
