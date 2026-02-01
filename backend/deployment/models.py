from django.db import models
from django.conf import settings


class DeploymentPlan(models.Model):
    """
    Deployment Plan for a project containing strategy items and rollout phases.
    One-to-one relationship with Project.
    """
    project = models.OneToOneField(
        "projects.Project",
        on_delete=models.CASCADE,
        related_name="deployment_plan"
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="deployment_plans_created"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Top-level editable overviews shown in UI
    strategy_overview = models.TextField(blank=True, default="")
    rollout_overview = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "Deployment Plan"
        verbose_name_plural = "Deployment Plans"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Deployment Plan for {self.project.name}"


class StrategyItem(models.Model):
    """
    Individual strategy item (e.g., Cloud Infrastructure, AI Model Deployment)
    """
    deployment_plan = models.ForeignKey(
        DeploymentPlan,
        on_delete=models.CASCADE,
        related_name="strategy_items"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Strategy Item"
        verbose_name_plural = "Strategy Items"
        ordering = ["order", "created_at"]

    def __str__(self):
        return self.title


class RolloutPhase(models.Model):
    """
    Rollout phase (e.g., Preparation, Alpha Release, Beta Release)
    """
    deployment_plan = models.ForeignKey(
        DeploymentPlan,
        on_delete=models.CASCADE,
        related_name="rollout_phases"
    )
    phase_name = models.CharField(max_length=255)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Rollout Phase"
        verbose_name_plural = "Rollout Phases"
        ordering = ["order", "created_at"]

    def __str__(self):
        return self.phase_name


class PhaseTask(models.Model):
    """
    Individual task within a rollout phase
    """
    rollout_phase = models.ForeignKey(
        RolloutPhase,
        on_delete=models.CASCADE,
        related_name="tasks"
    )
    task_description = models.TextField()
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Phase Task"
        verbose_name_plural = "Phase Tasks"
        ordering = ["order", "created_at"]

    def __str__(self):
        return f"{self.rollout_phase.phase_name} - {self.task_description[:50]}"