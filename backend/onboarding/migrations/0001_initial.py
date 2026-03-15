from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        settings.AUTH_USER_MODEL.split('.')[0] + '.0001_initial',
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='OnboardingProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_name', models.CharField(max_length=255)),
                ('website', models.URLField(blank=True, default='')),
                ('industry', models.CharField(blank=True, default='', max_length=100)),
                ('country', models.CharField(default='NL', max_length=2)),
                ('description', models.TextField(blank=True, default='')),
                ('analysis_data', models.JSONField(blank=True, null=True)),
                ('default_methodology', models.CharField(blank=True, choices=[('prince2', 'PRINCE2'), ('agile', 'Agile'), ('scrum', 'Scrum'), ('kanban', 'Kanban'), ('waterfall', 'Waterfall'), ('lean_six_sigma_green', 'Lean Six Sigma (Green Belt)'), ('lean_six_sigma_black', 'Lean Six Sigma (Black Belt)'), ('hybrid', 'Hybrid')], default='', max_length=50)),
                ('project_types', models.JSONField(blank=True, default=list)),
                ('team_roles', models.JSONField(blank=True, default=list)),
                ('company_size', models.CharField(blank=True, choices=[('solo', '1 persoon'), ('small', '2-10'), ('medium', '11-50'), ('large', '51-200'), ('enterprise', '200+')], default='small', max_length=20)),
                ('currency', models.CharField(default='EUR', max_length=3)),
                ('time_tracking_enabled', models.BooleanField(default=True)),
                ('risk_management_enabled', models.BooleanField(default=True)),
                ('governance_enabled', models.BooleanField(default=True)),
                ('setup_suggestion', models.JSONField(blank=True, null=True)),
                ('methodology_confirmed', models.BooleanField(default=False)),
                ('roles_confirmed', models.BooleanField(default=False)),
                ('templates_confirmed', models.BooleanField(default=False)),
                ('onboarding_completed', models.BooleanField(default=False)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('company', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='onboarding_profile', to='accounts.company')),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='onboarding_profiles', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Onboarding Profile',
                'verbose_name_plural': 'Onboarding Profiles',
            },
        ),
    ]
