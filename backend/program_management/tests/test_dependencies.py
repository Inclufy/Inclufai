"""Tests for Program Dependencies"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestProgramDependencies:
    """Test program-level dependencies"""
    
    def test_create_dependency(self, authenticated_client, program):
        """Test creating inter-project dependency"""
        url = reverse('program:dependency-list', kwargs={'program_id': program.id})
        data = {
            'predecessor_project_id': 1,
            'successor_project_id': 2,
            'dependency_type': 'finish_to_start',
            'description': 'Project 2 requires Project 1 completion'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
