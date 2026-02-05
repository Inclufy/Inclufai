"""Tests for Program Resource Management"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestProgramResources:
    """Test program resource management"""
    
    def test_shared_resources(self, authenticated_client, program):
        """Test shared resource allocation"""
        url = reverse('program:resource-list', kwargs={'program_id': program.id})
        data = {
            'resource_type': 'team_member',
            'name': 'Senior Developer',
            'allocation_percentage': 50,
            'shared_across_projects': True
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
