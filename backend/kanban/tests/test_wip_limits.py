"""Tests for Kanban WIP Limits"""
import pytest
from django.urls import reverse
from kanban.models import KanbanBoard, KanbanColumn


@pytest.mark.django_db
class TestKanbanWIPLimits:
    """Test Kanban WIP limit functionality"""
    
    def test_set_wip_limit(self, authenticated_client, kanban_project):
        """Test setting WIP limit on column"""
        # Create board and column
        board = KanbanBoard.objects.create(
            project=kanban_project,
            name='Test Board'
        )
        column = KanbanColumn.objects.create(
            board=board,
            name='In Progress',
            column_type='in_progress',
            order=1
        )
        
        # Update column with WIP limit - URL only needs project_id
        column_url = reverse('kanban:kanban-columns-detail',
                           kwargs={'project_id': kanban_project.id, 'pk': column.id})
        
        response = authenticated_client.patch(column_url, {'wip_limit': 3})
        assert response.status_code == 200
        assert response.data['wip_limit'] == 3
