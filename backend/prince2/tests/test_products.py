"""Tests for PRINCE2 Products"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestPRINCE2Products:
    """Test PRINCE2 project products"""
    
    def test_create_product(self, authenticated_client, prince2_project):
        """Test creating a product"""
        url = reverse('prince2:product-list', kwargs={'project_id': prince2_project.id})
        data = {
            'name': 'Project Brief',
            'type': 'management',
            'description': 'Initial project brief'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_product_quality_criteria(self, authenticated_client, prince2_project):
        """Test product quality criteria"""
        url = reverse('prince2:product-list', kwargs={'project_id': prince2_project.id})
        data = {
            'name': 'Requirements Document',
            'quality_criteria': ['Complete', 'Reviewed', 'Approved']
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
