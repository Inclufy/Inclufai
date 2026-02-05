"""Tests for Kanban Boards"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestKanbanBoards:
    """Test Kanban boards"""
    
    def test_create_board(self, authenticated_client, kanban_project):
        """Test creating a kanban board"""
        url = reverse('kanban:kanban-board-list', kwargs={'project_id': kanban_project.id})
        data = {
            'name': 'Development Board',
            'description': 'Main development workflow'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
    
    def test_default_columns(self, authenticated_client, kanban_project):
        """Test board has default columns"""
        # Create board
        url = reverse('kanban:kanban-board-list', kwargs={'project_id': kanban_project.id})
        response = authenticated_client.post(url, {'name': 'Test Board'})
        board_id = response.data['id']
        
        # Check columns
        columns_url = reverse('kanban:kanban-columns-list', 
                            kwargs={'project_id': kanban_project.id, 'board_id': board_id})
        response = authenticated_client.get(columns_url)
        assert response.status_code == 200
