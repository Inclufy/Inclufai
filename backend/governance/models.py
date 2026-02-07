from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Portfolio(models.Model):
    """Strategic Portfolio - highest level"""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    company = models.ForeignKey('accounts.Company', on_delete=models.CASCADE, related_name='portfolios')
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='owned_portfolios')
    
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('active', 'Active'),
        ('on_hold', 'On Hold'),
        ('closed', 'Closed')
    ]
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='planning')
    
    strategic_objectives = models.TextField(blank=True)
    budget_allocated = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Portfolios'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.company.name})"


class GovernanceBoard(models.Model):
    """Steering Committee, Program Board, Project Board"""
    BOARD_TYPES = [
        ('steering_committee', 'Steering Committee'),
        ('program_board', 'Program Board'),
        ('project_board', 'Project Board'),
        ('advisory_board', 'Advisory Board'),
        ('executive_board', 'Executive Board'),
    ]
    
    name = models.CharField(max_length=200)
    board_type = models.CharField(max_length=50, choices=BOARD_TYPES)
    description = models.TextField(blank=True)
    
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, null=True, blank=True, related_name='governance_boards')
    program = models.ForeignKey('programs.Program', on_delete=models.CASCADE, null=True, blank=True, related_name='governance_boards')
    project = models.ForeignKey('projects.Project', on_delete=models.CASCADE, null=True, blank=True, related_name='governance_boards')
    
    meeting_frequency = models.CharField(max_length=100, blank=True)
    quorum_required = models.IntegerField(default=3)
    decision_threshold = models.CharField(max_length=100, default="Simple Majority")
    
    chair = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='chaired_boards')
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['board_type', 'name']

    def __str__(self):
        return f"{self.get_board_type_display()} - {self.name}"


class Stakeholder(models.Model):
    """Key stakeholders with roles and influence levels"""
    STAKEHOLDER_ROLES = [
        ('executive_sponsor', 'Executive Sponsor'),
        ('senior_sponsor', 'Senior Responsible Owner'),
        ('steering_member', 'Steering Committee Member'),
        ('board_member', 'Board Member'),
        ('program_manager', 'Program Manager'),
        ('project_manager', 'Project Manager'),
        ('key_stakeholder', 'Key Stakeholder'),
        ('advisor', 'Advisor'),
    ]
    
    INFLUENCE_LEVELS = [
        ('high', 'High - Decision Maker'),
        ('medium', 'Medium - Influencer'),
        ('low', 'Low - Informed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stakeholder_assignments')
    role = models.CharField(max_length=50, choices=STAKEHOLDER_ROLES)
    influence_level = models.CharField(max_length=20, choices=INFLUENCE_LEVELS, default='medium')
    
    governance_board = models.ForeignKey(GovernanceBoard, on_delete=models.CASCADE, null=True, blank=True, related_name='members')
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, null=True, blank=True, related_name='stakeholders')
    program = models.ForeignKey('programs.Program', on_delete=models.CASCADE, null=True, blank=True, related_name='stakeholders')
    project = models.ForeignKey('projects.Project', on_delete=models.CASCADE, null=True, blank=True, related_name='stakeholders')
    
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-influence_level', 'role']

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.email} - {self.get_role_display()}"


class ReportingLine(models.Model):
    """Defines reporting structure"""
    reports_from = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reporting_to')
    reports_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='direct_reports_in_context')
    
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, null=True, blank=True, related_name='reporting_lines')
    program = models.ForeignKey('programs.Program', on_delete=models.CASCADE, null=True, blank=True, related_name='reporting_lines')
    project = models.ForeignKey('projects.Project', on_delete=models.CASCADE, null=True, blank=True, related_name='reporting_lines')
    
    reporting_frequency = models.CharField(max_length=100, default='Weekly')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['reports_from']

    def __str__(self):
        return f"{self.reports_from.email} reports to {self.reports_to.email}"
