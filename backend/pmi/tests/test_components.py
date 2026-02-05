"""Tests for PMI Program Components"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestPMIComponents:
    """Test PMI program components"""
    
    def test_create_component(self, authenticated_client, pmi_program):
        """Test creating program component"""
        url = reverse('pmi:component-list', kwargs={'program_id': pmi_program.id})
        data = {
            'name': 'Phase 1 Implementation',
            'type': 'project',
            'description': 'First phase delivery',
            'start_date': '2026-02-01'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_component_dependencies(self, authenticated_client, pmi_program):
        """Test component dependencies"""
        url = reverse('pmi:component-list', kwargs={'program_id': pmi_program.id})
        
        # Create components
        comp1 = authenticated_client.post(url, {'name': 'Component 1'})
        comp2 = authenticated_client.post(url, {
            'name': 'Component 2',
            'depends_on': [comp1.data['id']]
        })
        
        assert comp2.status_code == 201
