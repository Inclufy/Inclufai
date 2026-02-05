"""Tests for P2 Programme Blueprints"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestP2Blueprints:
    """Test P2 programme blueprints"""
    
    def test_create_blueprint(self, authenticated_client, p2_programme):
        """Test creating programme blueprint"""
        url = reverse('p2:blueprint-list', kwargs={'programme_id': p2_programme.id})
        data = {
            'name': 'Target Operating Model',
            'description': 'Future state blueprint',
            'version': '1.0',
            'status': 'draft'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_blueprint_versioning(self, authenticated_client, p2_programme):
        """Test blueprint version control"""
        url = reverse('p2:blueprint-list', kwargs={'programme_id': p2_programme.id})
        
        # Create versions
        v1 = authenticated_client.post(url, {'name': 'Blueprint', 'version': '1.0'})
        v2 = authenticated_client.post(url, {'name': 'Blueprint', 'version': '1.1'})
        
        assert v1.status_code == 201
        assert v2.status_code == 201
