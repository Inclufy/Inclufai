"""Tests for PMI Program Governance"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestPMIGovernance:
    """Test PMI program governance"""
    
    def test_program_board(self, authenticated_client, pmi_program):
        """Test program governance board"""
        url = reverse('pmi:governance-board-list', kwargs={'program_id': pmi_program.id})
        data = {
            'meeting_type': 'steering_committee',
            'meeting_date': '2026-02-05',
            'attendees': ['Sponsor', 'Program Manager', 'Stakeholders'],
            'decisions': ['Approved budget increase']
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
