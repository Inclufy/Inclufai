import pytest
import time
from django.contrib.auth import get_user_model

User = get_user_model()


class TestAPIPerformance:
    """Test API performance metrics"""
    
    @pytest.mark.django_db
    def test_quick_response(self, client):
        """API should respond quickly"""
        # Create user with username
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com', 
            password='test123'
        )
        
        client.force_login(user)
        
        start = time.time()
        response = client.get('/api/v1/projects/')
        duration = time.time() - start
        
        assert response.status_code == 200
        assert duration < 1.0  # Should respond in under 1 second
