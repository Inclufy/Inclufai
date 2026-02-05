"""Tests for MSP Benefits Management"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestMSPBenefits:
    """Test MSP benefits management"""
    
    def test_create_benefit(self, authenticated_client, msp_program):
        """Test creating a benefit"""
        url = reverse('msp:benefit-list', kwargs={'program_id': msp_program.id})
        data = {
            'name': 'Cost Reduction',
            'description': '20% reduction in operational costs',
            'target_value': 200000,
            'measurement_method': 'Monthly cost comparison'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_benefit_realization(self, authenticated_client, msp_program):
        """Test benefit realization tracking"""
        # Create benefit
        benefit_url = reverse('msp:benefit-list', kwargs={'program_id': msp_program.id})
        benefit = authenticated_client.post(benefit_url, {'name': 'Test Benefit'})
        
        # Track realization
        track_url = reverse('msp:benefit-realization', 
                           kwargs={'program_id': msp_program.id, 'pk': benefit.data['id']})
        data = {
            'actual_value': 50000,
            'measurement_date': '2026-02-05'
        }
        response = authenticated_client.post(track_url, data)
        assert response.status_code == 201
