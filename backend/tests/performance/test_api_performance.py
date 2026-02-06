import pytest
import time
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
class TestAPIPerformance:
    
    def test_quick_response(self, client):
        """API should respond quickly"""
        user = User.objects.create_user(
            email='test@example.com',
            password='test123'
        )
        client.force_login(user)
        
        start = time.time()
        response = client.get('/api/projects/')
        duration = time.time() - start
        
        assert response.status_code == 200
        assert duration < 1.0
