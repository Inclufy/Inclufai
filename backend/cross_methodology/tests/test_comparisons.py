"""Tests for Cross-Methodology Comparisons"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestMethodologyComparison:
    """Test comparisons across different methodologies"""
    
    def test_project_methodology_list(self, authenticated_client, all_project_methodologies):
        """Test listing all project methodologies"""
        url = reverse('projects:list')
        response = authenticated_client.get(url)
        assert response.status_code == 200
        assert len(response.data) >= 8
    
    def test_methodology_metrics(self, authenticated_client, company):
        """Test metrics across methodologies"""
        url = reverse('analytics:methodology-metrics')
        response = authenticated_client.get(url)
        assert response.status_code == 200
        assert 'waterfall' in str(response.data)
        assert 'agile' in str(response.data)
        assert 'lss_green' in str(response.data)
