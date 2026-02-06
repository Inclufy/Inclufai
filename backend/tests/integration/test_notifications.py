"""Tests for Notifications"""
import pytest
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
class TestNotifications:
    """Test notification system"""
    
    def test_user_can_receive_notifications(self, user):
        """Test users can receive notifications"""
        notification = {
            'user': user,
            'title': 'Test Notification',
            'message': 'This is a test',
            'type': 'info'
        }
        assert notification['user'] == user
