"""Tests for Kanban Cards"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestKanbanCards:
    """Test Kanban cards"""
    
    def test_create_card(self, authenticated_client, kanban_project):
        """Test creating a card"""
        url = reverse('kanban:card-list', kwargs={'project_id': kanban_project.id})
        data = {
            'title': 'Implement Login',
            'description': 'User authentication feature',
            'priority': 'high'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_move_card(self, authenticated_client, kanban_project):
        """Test moving card between columns"""
        # Create card
        url = reverse('kanban:card-list', kwargs={'project_id': kanban_project.id})
        card = authenticated_client.post(url, {'title': 'Test Card'})
        card_id = card.data['id']
        
        # Move card
        move_url = reverse('kanban:card-move', 
                         kwargs={'project_id': kanban_project.id, 'pk': card_id})
        response = authenticated_client.post(move_url, {'column_id': 2})
        assert response.status_code == 200
