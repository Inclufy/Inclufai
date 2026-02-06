"""Tests for different Program Management methodologies"""
import pytest
from programs.models import Program


@pytest.mark.django_db
class TestProgramMethodologies:
    """Test different program management methodologies"""
    
    def test_create_safe_program(self, user, company):
        """Test creating SAFe (Scaled Agile Framework) program"""
        program = Program.objects.create(
            name='SAFe Program',
            company=company,
            program_manager=user,
            methodology='safe',
            start_date='2024-01-01'
        )
        assert program.methodology == 'safe'
        assert program.name == 'SAFe Program'
        
    def test_create_msp_program(self, user, company):
        """Test creating MSP (Managing Successful Programmes) program"""
        program = Program.objects.create(
            name='MSP Programme',
            company=company,
            program_manager=user,
            methodology='msp',
            start_date='2024-01-01'
        )
        assert program.methodology == 'msp'
        
    def test_create_pmi_program(self, user, company):
        """Test creating PMI Program Management program"""
        program = Program.objects.create(
            name='PMI Program',
            company=company,
            program_manager=user,
            methodology='pmi',
            start_date='2024-01-01'
        )
        assert program.methodology == 'pmi'
        
    def test_create_prince2_programme(self, user, company):
        """Test creating PRINCE2 Programme"""
        program = Program.objects.create(
            name='PRINCE2 Programme',
            company=company,
            program_manager=user,
            methodology='prince2_programme',
            start_date='2024-01-01'
        )
        assert program.methodology == 'prince2_programme'
        
    def test_create_hybrid_programme(self, user, company):
        """Test creating Hybrid Programme"""
        program = Program.objects.create(
            name='Hybrid Programme',
            company=company,
            program_manager=user,
            methodology='hybrid',
            start_date='2024-01-01'
        )
        assert program.methodology == 'hybrid'
        
    def test_all_five_program_methodologies(self, user, company):
        """Test that all 5 program methodologies can be created"""
        methodologies = ['safe', 'msp', 'pmi', 'prince2_programme', 'hybrid']
        
        programs = []
        for methodology in methodologies:
            program = Program.objects.create(
                name=f'{methodology.upper()} Program',
                company=company,
                program_manager=user,
                methodology=methodology,
                start_date='2024-01-01'
            )
            programs.append(program)
            
        assert len(programs) == 5
        created_methodologies = {p.methodology for p in programs}
        assert created_methodologies == set(methodologies)
        
    def test_program_status_transitions(self, user, company):
        """Test program status transitions"""
        program = Program.objects.create(
            name='Test Program',
            company=company,
            program_manager=user,
            methodology='safe',
            start_date='2024-01-01'
        )
        
        assert program.status == 'planning'
        
        program.status = 'active'
        program.save()
        assert program.status == 'active'
        
        program.status = 'completed'
        program.save()
        assert program.status == 'completed'
        
    def test_program_health_status(self, user, company):
        """Test program health status tracking"""
        program = Program.objects.create(
            name='Health Test Program',
            company=company,
            program_manager=user,
            methodology='msp',
            start_date='2024-01-01'
        )
        
        assert program.health_status == 'green'
        
        program.health_status = 'amber'
        program.save()
        assert program.health_status == 'amber'
        
        program.health_status = 'red'
        program.save()
        assert program.health_status == 'red'
        
    def test_program_budget_tracking(self, user, company):
        """Test program budget tracking"""
        program = Program.objects.create(
            name='Budget Test Program',
            company=company,
            program_manager=user,
            methodology='pmi',
            start_date='2024-01-01',
            total_budget=1000000,
            spent_budget=250000
        )
        
        assert program.total_budget == 1000000
        assert program.spent_budget == 250000
        assert program.currency == 'EUR'
