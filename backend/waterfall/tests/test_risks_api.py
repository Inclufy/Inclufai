import pytest
from rest_framework import status
from waterfall.models import WaterfallRisk

@pytest.mark.django_db
class TestWaterfallRiskAPI:
    
    def test_list_risks(self, authenticated_client, waterfall_project):
        """Test listing risks"""
        url = f'/api/v1/projects/{waterfall_project.id}/waterfall/risks/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
    
    def test_create_risk(self, authenticated_client, waterfall_project):
        """Test creating a risk"""
        url = f'/api/v1/projects/{waterfall_project.id}/waterfall/risks/'
        data = {
            'project': waterfall_project.id,
            'title': 'Test Risk',
            'description': 'Test description',
            'category': 'technical',
            'probability': 'high',
            'impact': 'high',
            'status': 'identified',
            'owner': 'Test Owner',
            'mitigation': 'Test mitigation',
            'date_identified': '2026-02-04'
        }
        
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == 'Test Risk'
        assert WaterfallRisk.objects.count() == 1
    
    def test_delete_risk(self, authenticated_client, waterfall_project):
        """Test deleting a risk"""
        risk = WaterfallRisk.objects.create(
            project=waterfall_project,
            title='Risk to Delete',
            description='Description',
            category='technical',
            probability='low',
            impact='low',
            owner='Owner',
            mitigation='Mitigation',
            date_identified='2026-02-04'
        )
        
        url = f'/api/v1/projects/{waterfall_project.id}/waterfall/risks/{risk.id}/'
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert WaterfallRisk.objects.count() == 0
