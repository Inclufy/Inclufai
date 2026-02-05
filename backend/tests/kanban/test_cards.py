"""Tests for Kanban Cards"""
import pytest
from django.urls import reverse
from kanban.models import KanbanBoard, KanbanColumn


@pytest.mark.django_db
class TestKanbanCards:
    """Test Kanban cards"""
    
    def test_create_card(self, authenticated_client, kanban_project):
        """Test creating a card"""
        # Create board and column first
        board = KanbanBoard.objects.create(
            project=kanban_project,
            name='Test Board'
        )
        column = KanbanColumn.objects.create(
            board=board,
            name='To Do',
            column_type='todo',
            order=1
        )
        
        url = reverse('kanban:kanban-cards-list', kwargs={'project_id': kanban_project.id})
        data = {
            'board': board.id,  # ← ADDED required field
            'column': column.id,  # ← ADDED required field
            'title': 'Implement Login',
            'description': 'User authentication feature',
            'priority': 'high'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
        assert response.data['title'] == 'Implement Login'
    
    def test_move_card(self, authenticated_client, kanban_project):
        """Test moving card between columns"""
        # Create board and columns
        board = KanbanBoard.objects.create(
            project=kanban_project,
            name='Test Board'
        )
        column1 = KanbanColumn.objects.create(
            board=board,
            name='To Do',
            column_type='todo',
            order=1
        )
        column2 = KanbanColumn.objects.create(
            board=board,
            name='In Progress',
            column_type='in_progress',
            order=2
        )
        
        # Create card
        url = reverse('kanban:kanban-cards-list', kwargs={'project_id': kanban_project.id})
        card_data = {
            'board': board.id,
            'column': column1.id,
            'title': 'Test Card'
        }
        card = authenticated_client.post(url, card_data)
        assert card.status_code == 201
        card_id = card.data['id']
        
        # Move card to column2
        move_url = reverse('kanban:kanban-cards-move', 
                         kwargs={'project_id': kanban_project.id, 'pk': card_id})
        response = authenticated_client.post(move_url, {'column_id': column2.id})
        assert response.status_code == 200
