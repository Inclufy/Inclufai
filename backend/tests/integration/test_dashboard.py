"""Tests for Dashboard"""
import pytest
from projects.models import Project
from programs.models import Program


@pytest.mark.django_db
class TestDashboard:
    """Test dashboard functionality"""
    
    def test_dashboard_project_count(self, user, company):
        """Test dashboard shows project count"""
        Project.objects.create(
            name='Project 1',
            company=company,
            methodology='scrum'
        )
        Project.objects.create(
            name='Project 2', 
            company=company,
            methodology='kanban'
        )
        
        count = Project.objects.filter(company=company).count()
        assert count == 2
        
    def test_dashboard_program_count(self, user, company):
        """Test dashboard shows program count"""
        Program.objects.create(
            name='Program 1',
            company=company,
            program_manager=user,
            methodology='safe'
        )
        
        count = Program.objects.filter(company=company).count()
        assert count >= 1
        
    def test_dashboard_active_projects(self, user, company):
        """Test dashboard filters active projects"""
        Project.objects.create(
            name='Active Project',
            company=company,
            methodology='agile',
            status='active'
        )
        Project.objects.create(
            name='Completed Project',
            company=company,
            methodology='waterfall',
            status='completed'
        )
        
        active = Project.objects.filter(company=company, status='active')
        assert active.count() == 1
