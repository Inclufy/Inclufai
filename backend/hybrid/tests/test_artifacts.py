"""Tests for Hybrid Project Artifacts"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestHybridArtifacts:
    """Test hybrid project artifacts from multiple methodologies"""
    
    def test_mixed_artifacts(self, authenticated_client, hybrid_project):
        """Test using artifacts from different methodologies"""
        url = reverse('hybrid:artifact-list', kwargs={'project_id': hybrid_project.id})
        
        artifacts = [
            {'name': 'WBS', 'source_methodology': 'waterfall'},
            {'name': 'User Story', 'source_methodology': 'agile'},
            {'name': 'Kanban Board', 'source_methodology': 'kanban'}
        ]
        
        for artifact in artifacts:
            response = authenticated_client.post(url, artifact)
            assert response.status_code == 201
