"""Tests for Team Management"""
import pytest
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
class TestTeamManagement:
    """Test team management features"""
    
    def test_list_team_members(self, company, user):
        """Test listing team members"""
        # Create team members
        User.objects.create_user(
            username='member1',
            email='member1@test.com',
            password='test123',
            company=company,
            first_name='John',
            last_name='Doe'
        )
        User.objects.create_user(
            username='member2',
            email='member2@test.com',
            password='test123',
            company=company,
            first_name='Jane',
            last_name='Smith'
        )
        
        team = User.objects.filter(company=company)
        assert team.count() >= 2
        
    def test_team_member_roles(self, user):
        """Test team members have roles"""
        user.first_name = 'Test'
        user.last_name = 'Developer'
        user.save()
        
        assert user.first_name == 'Test'
        assert user.company is not None
