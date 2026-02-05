"""Tests for PRINCE2 Products"""
import pytest
from django.urls import reverse
from prince2.models import Product


@pytest.mark.django_db
class TestPRINCE2Products:
    """Test PRINCE2 Products functionality"""
    
    def test_create_product(self, authenticated_client, prince2_project):
        """Test creating a PRINCE2 product"""
        url = reverse('prince2:prince2-products-list', kwargs={'project_id': prince2_project.id})
        data = {
            'title': 'Project Plan',
            'description': 'Detailed project plan document',
            'product_type': 'management',
            'quality_criteria': 'Complete, accurate, approved',
            'status': 'planned'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
        assert response.data['title'] == 'Project Plan'
        assert response.data['product_type'] == 'management'
    
    def test_product_quality_criteria(self, authenticated_client, prince2_project):
        """Test adding quality criteria to product"""
        # Create product first
        product = Product.objects.create(
            project=prince2_project,
            title='Software Module',
            product_type='specialist',
            quality_criteria='Unit tests pass, code reviewed',
            quality_tolerance='Minor bugs acceptable',
            quality_method='Automated testing + peer review'
        )
        
        # Verify quality criteria
        assert product.quality_criteria == 'Unit tests pass, code reviewed'
        assert product.quality_tolerance == 'Minor bugs acceptable'
        assert product.quality_method == 'Automated testing + peer review'
        
        # Test approve action
        url = reverse('prince2:prince2-products-approve', 
                     kwargs={'project_id': prince2_project.id, 'pk': product.id})
        response = authenticated_client.post(url)
        assert response.status_code == 200
        assert response.data['status'] == 'approved'
