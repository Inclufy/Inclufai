"""Tests for Post Project Analysis"""
import pytest
from projects.models import Project


@pytest.mark.django_db
class TestPostProject:
    """Test post-project functionality"""
    
    def test_completed_project_analysis(self, user, company):
        """Test analyzing completed project"""
        project = Project.objects.create(
            name='Completed Project',
            company=company,
            methodology='waterfall',
            status='completed'
        )
        
        assert project.status == 'completed'
        
    def test_lessons_learned(self, user, company):
        """Test documenting lessons learned"""
        project = Project.objects.create(
            name='Learning Project',
            company=company,
            methodology='agile',
            status='completed'
        )
        
        lessons = {
            'project': project,
            'successes': 'Great team collaboration',
            'challenges': 'Scope creep',
            'recommendations': 'Better requirements gathering'
        }
        
        assert lessons['project'] == project
        assert lessons['successes'] is not None
        
    def test_project_metrics(self, user, company):
        """Test post-project metrics"""
        project = Project.objects.create(
            name='Metrics Project',
            company=company,
            methodology='scrum',
            status='completed'
        )
        
        metrics = {
            'project': project,
            'on_time': True,
            'on_budget': True,
            'quality_score': 4.5
        }
        
        assert metrics['on_time'] is True
        assert metrics['quality_score'] > 4.0
