from django.db import models
from projects.models import Project

class WorkPolicy(models.Model):
    CATEGORY_CHOICES = [
        ('workflow', 'Workflow'),
        ('quality', 'Quality'),
        ('team', 'Team'),
        ('process', 'Process'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='work_policies')
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'kanban_work_policies'
        ordering = ['order', 'id']
        
    def __str__(self):
        return f"{self.project.name} - {self.title}"
