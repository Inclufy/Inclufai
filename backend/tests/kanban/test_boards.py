"""Tests for Kanban Boards"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestKanbanBoards:
    """Test Kanban boards"""
    
    def test_create_board(self, authenticated_client, kanban_project):
        """Test creating a kanban board"""
        url = reverse('kanban:kanban-board-list', kwargs={'project_id': kanban_project.id})  # ← FIXED: singular 'board'
        data = {
            'name': 'Development Board',
            'description': 'Main development board'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
        assert response.data['name'] == 'Development Board'
    
    def test_default_columns(self, authenticated_client, kanban_project):
        """Test board creation with default columns"""
        url = reverse('kanban:kanban-board-list', kwargs={'project_id': kanban_project.id})  # ← FIXED: singular 'board'
        data = {'name': 'Test Board'}
        board_response = authenticated_client.post(url, data)
        assert board_response.status_code == 201
        
        # Get columns
        columns_url = reverse('kanban:kanban-columns-list',
                            kwargs={'project_id': kanban_project.id})
        columns_response = authenticated_client.get(columns_url)
        assert columns_response.status_code == 200
