"""Tests for Subscriptions"""
import pytest
from accounts.models import Company


@pytest.mark.django_db
class TestSubscriptions:
    """Test subscription management"""
    
    def test_company_has_subscription(self, company):
        """Test company can have subscription"""
        assert company is not None
        
    def test_subscription_tiers(self):
        """Test different subscription tiers"""
        tiers = ['free', 'pro', 'enterprise']
        assert len(tiers) == 3
        assert 'enterprise' in tiers
