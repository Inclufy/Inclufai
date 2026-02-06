from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid
from datetime import timedelta


class TeamInvitation(models.Model):
    """
    Team/Project invitation model
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('expired', 'Expired'),
    ]
    
    ROLE_CHOICES = [
        ('guest', 'Guest'),
        ('pm', 'Project Manager'),
        ('admin', 'Admin'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Who is being invited
    email = models.EmailField()
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='guest')
    
    # Who sent the invitation
    invited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_invitations'
    )
    
    # What they're invited to
    project = models.ForeignKey(
        'projects.Project',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='invitations'
    )
    
    program = models.ForeignKey(
        'programs.Program',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='invitations'
    )
    
    # Invitation details
    token = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    message = models.TextField(blank=True, help_text="Personal message from inviter")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    accepted_at = models.DateTimeField(null=True, blank=True)
    
    # Accepted user
    accepted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='accepted_invitations'
    )
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"Invitation for {self.email} to {self.project or self.program}"
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(days=7)
        super().save(*args, **kwargs)
    
    @property
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    @property
    def can_be_accepted(self):
        return self.status == 'pending' and not self.is_expired
