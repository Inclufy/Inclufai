import pytest
from django.contrib.auth import get_user_model
from projects.models import Project
from sixsigma.models import SIPOCDiagram

User = get_user_model()


@pytest.mark.django_db
class TestSixSigmaDMAIC:
    """Test Six Sigma DMAIC methodology"""
    
    def test_create_sipoc_diagram(self, user, company):
        """Test creating SIPOC diagram for Define phase"""
        project = Project.objects.create(
            name="Six Sigma Test Project",
            company=company,
            methodology='sixsigma',
            status='active'
        )
        
        sipoc = SIPOCDiagram.objects.create(
            project=project,
            process_name="Order Fulfillment",
            process_description="End-to-end order processing",
            process_start="Customer places order"
        )
        
        assert sipoc.process_name == "Order Fulfillment"
        assert sipoc.project == project
        
    def test_sipoc_process_mapping(self, user, company):
        """Test SIPOC process mapping"""
        project = Project.objects.create(
            name="Six Sigma Project",
            company=company,
            methodology='sixsigma'
        )
        
        sipoc = SIPOCDiagram.objects.create(
            project=project,
            process_name="Manufacturing Process",
            process_description="Widget production line"
        )
        
        assert sipoc is not None
        assert sipoc.project.methodology == 'sixsigma'
        
    def test_multiple_sipoc_not_allowed(self, user, company):
        """Test that only one SIPOC per project is allowed"""
        project = Project.objects.create(
            name="Six Sigma Project",
            company=company,
            methodology='sixsigma'
        )
        
        # Create first SIPOC
        SIPOCDiagram.objects.create(
            project=project,
            process_name="Process 1"
        )
        
        # Attempting second should raise error (OneToOne relationship)
        with pytest.raises(Exception):
            SIPOCDiagram.objects.create(
                project=project,
                process_name="Process 2"
            )
            
    def test_lss_black_belt_project(self, lss_black_project):
        """Test LSS Black Belt project fixture"""
        assert lss_black_project.methodology == 'lss_black'
        assert lss_black_project.company is not None
        
    def test_lss_green_belt_project(self, lss_green_project):
        """Test LSS Green Belt project fixture"""
        assert lss_green_project.methodology == 'lss_green'
        assert lss_green_project.company is not None
