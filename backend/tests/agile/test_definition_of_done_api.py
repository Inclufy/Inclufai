import pytest
from rest_framework import status
from agile.models import DefinitionOfDone

@pytest.mark.django_db
class TestDefinitionOfDoneAPI:
    
    def test_list_dod_items(self, authenticated_client, agile_project):
        """Test listing DoD items"""
        url = f'/api/v1/projects/{agile_project.id}/agile/definition-of-done/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
    
    def test_create_dod_item(self, authenticated_client, agile_project):
        """Test creating a DoD item"""
        url = f'/api/v1/projects/{agile_project.id}/agile/definition-of-done/'
        data = {
            'project': agile_project.id,
            'description': 'All code must be peer reviewed',  # ← Changed from 'title'
            'category': 'quality',
            'is_required': True
        }
        
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['description'] == 'All code must be peer reviewed'  # ← Changed from 'title'
        assert DefinitionOfDone.objects.count() == 1
    
    def test_delete_dod_item(self, authenticated_client, agile_project):
        """Test deleting a DoD item"""
        dod = DefinitionOfDone.objects.create(
            project=agile_project,
            description='DoD to Delete',  # ← Changed from 'title'
            category='quality',
            is_required=True
        )
        
        url = f'/api/v1/projects/{agile_project.id}/agile/definition-of-done/{dod.id}/'
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert DefinitionOfDone.objects.count() == 0
