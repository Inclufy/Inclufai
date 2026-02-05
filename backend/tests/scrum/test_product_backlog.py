"""Tests for Scrum Product Backlog"""
import pytest
from django.urls import reverse
from scrum.models import ProductBacklog, BacklogItem


@pytest.mark.django_db
class TestScrumProductBacklog:
    """Test Scrum Product Backlog functionality"""
    
    def test_create_product_backlog(self, authenticated_client, scrum_project):
        """Test creating a product backlog"""
        url = reverse('scrum:scrum-backlog-list', kwargs={'project_id': scrum_project.id})
        data = {
            'description': 'Main product backlog',
            'vision': 'Build amazing product'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
        assert response.data['description'] == 'Main product backlog'
    
    def test_create_backlog_item(self, authenticated_client, scrum_project):
        """Test creating a backlog item"""
        # Create backlog first
        backlog = ProductBacklog.objects.create(
            project=scrum_project,
            description='Product Backlog'
        )
        
        url = reverse('scrum:scrum-items-list', kwargs={'project_id': scrum_project.id})
        data = {
            'backlog': backlog.id,
            'title': 'User Story 1',
            'description': 'As a user, I want...',
            'item_type': 'user_story',
            'story_points': 5,
            'priority': 'high'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
        assert response.data['title'] == 'User Story 1'
        assert response.data['story_points'] == 5
    
    def test_backlog_item_prioritization(self, authenticated_client, scrum_project):
        """Test prioritizing backlog items"""
        backlog = ProductBacklog.objects.create(
            project=scrum_project,
            description='Product Backlog'
        )
        
        # Create multiple items
        item1 = BacklogItem.objects.create(
            backlog=backlog,
            title='Item 1',
            priority='high',
            order=1
        )
        item2 = BacklogItem.objects.create(
            backlog=backlog,
            title='Item 2',
            priority='medium',
            order=2
        )
        
        # Reorder items
        url = reverse('scrum:scrum-items-reorder', kwargs={'project_id': scrum_project.id})
        data = {
            'items': [
                {'id': item2.id, 'order': 1},
                {'id': item1.id, 'order': 2}
            ]
        }
        response = authenticated_client.post(url, data, format='json')
        assert response.status_code == 200
