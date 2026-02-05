"""Tests for SAFe Program Increments"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestSAFeProgramIncrement:
    """Test SAFe Program Increments"""
    
    def test_create_pi(self, authenticated_client, safe_program):
        """Test creating Program Increment"""
        url = reverse('safe:pi-list', kwargs={'program_id': safe_program.id})
        data = {
            'name': 'PI 2026.1',
            'iteration_count': 5,
            'start_date': '2026-02-05',
            'end_date': '2026-04-16'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
        assert response.data['iteration_count'] == 5
    
    def test_pi_objectives(self, authenticated_client, safe_program):
        """Test Program Increment objectives"""
        # Create PI
        pi_url = reverse('safe:pi-list', kwargs={'program_id': safe_program.id})
        pi = authenticated_client.post(pi_url, {'name': 'PI 2026.1'})
        
        # Add objectives
        obj_url = reverse('safe:pi-objective-list', 
                         kwargs={'program_id': safe_program.id, 'pi_id': pi.data['id']})
        data = {
            'description': 'Implement new payment system',
            'business_value': 8,
            'committed': True
        }
        response = authenticated_client.post(obj_url, data)
        assert response.status_code == 201
