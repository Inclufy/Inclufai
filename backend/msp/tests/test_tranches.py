"""Tests for MSP Programme Tranches"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestMSPTranches:
    """Test MSP programme tranches"""
    
    def test_create_tranche(self, authenticated_client, msp_program):
        """Test creating a tranche"""
        url = reverse('msp:tranche-list', kwargs={'program_id': msp_program.id})
        data = {
            'name': 'Tranche 1',
            'description': 'Initial capability delivery',
            'start_date': '2026-02-01',
            'end_date': '2026-08-31'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_tranche_sequence(self, authenticated_client, msp_program):
        """Test tranche sequencing"""
        url = reverse('msp:tranche-list', kwargs={'program_id': msp_program.id})
        
        tranches = [
            {'name': 'Tranche 1', 'sequence': 1},
            {'name': 'Tranche 2', 'sequence': 2},
            {'name': 'Tranche 3', 'sequence': 3}
        ]
        
        for tranche in tranches:
            response = authenticated_client.post(url, tranche)
            assert response.status_code == 201
