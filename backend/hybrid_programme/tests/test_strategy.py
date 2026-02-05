"""Tests for Hybrid Programme Strategy"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestHybridProgrammeStrategy:
    """Test hybrid programme strategy"""
    
    def test_mixed_governance(self, authenticated_client, hybrid_programme):
        """Test mixed governance approach"""
        url = reverse('hybrid-programme:governance-config-list', 
                     kwargs={'programme_id': hybrid_programme.id})
        data = {
            'primary_framework': 'msp',
            'secondary_frameworks': ['safe', 'pmi'],
            'rationale': 'MSP for overall governance, SAFe for agile delivery'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_adaptive_approach(self, authenticated_client, hybrid_programme):
        """Test adaptive programme approach"""
        url = reverse('hybrid-programme:adaptation-list', 
                     kwargs={'programme_id': hybrid_programme.id})
        data = {
            'trigger': 'market_change',
            'response': 'increase_agility',
            'methodology_adjustment': 'Add SAFe elements'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
