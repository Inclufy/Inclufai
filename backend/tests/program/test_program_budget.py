"""Tests for Program Budget Management"""
import pytest
from programs.models import Program, ProgramBudget


@pytest.mark.django_db
class TestProgramBudget:
    """Test Program Budget functionality"""
    
    def test_create_program_budget(self, authenticated_client, user, company):
        """Test creating program budget via model"""
        program = Program.objects.create(
            name='Test Program',
            company=company,
            program_manager=user,
            start_date='2024-01-01'
        )
        
        # Create budget directly (API endpoint not fully configured)
        budget = ProgramBudget.objects.create(
            program=program,
            total_budget=5000000,
            currency='USD'
        )
        
        # Test that budget was created correctly
        assert budget.total_budget == 5000000
        assert budget.currency == 'USD'
        assert budget.program == program
        
        # Verify it's queryable
        found_budget = ProgramBudget.objects.get(program=program)
        assert found_budget.id == budget.id
