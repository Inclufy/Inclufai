# backend/academy/migrations/0003_skills_system.py
# Generated migration for skills system

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('academy', '0003_courselesson_ai_fields'),  # Update with your last migration
    ]

    operations = [
        # 1. Create SkillCategory table
        migrations.CreateModel(
            name='SkillCategory',
            fields=[
                ('id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('name_nl', models.CharField(max_length=100)),
                ('icon', models.CharField(max_length=50)),
                ('color', models.CharField(max_length=50)),
                ('order', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'academy_skill_categories',
                'ordering': ['order', 'name'],
            },
        ),
        
        # 2. Create Skill table
        migrations.CreateModel(
            name='Skill',
            fields=[
                ('id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('name_nl', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('description_nl', models.TextField(blank=True)),
                ('level_1_points', models.IntegerField(default=0)),
                ('level_2_points', models.IntegerField(default=100)),
                ('level_3_points', models.IntegerField(default=300)),
                ('level_4_points', models.IntegerField(default=600)),
                ('level_5_points', models.IntegerField(default=1000)),
                ('category', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='skills',
                    to='academy.skillcategory'
                )),
            ],
            options={
                'db_table': 'academy_skills',
                'ordering': ['category__order', 'name'],
            },
        ),
        
        # 3. Create UserSkill table
        migrations.CreateModel(
            name='UserSkill',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('points', models.IntegerField(default=0)),
                ('level', models.IntegerField(default=1)),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('skill', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='user_progress',
                    to='academy.skill'
                )),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='skills',
                    to=settings.AUTH_USER_MODEL
                )),
            ],
            options={
                'db_table': 'academy_user_skills',
                'ordering': ['-points'],
            },
        ),
        
        # 4. Create SkillGoal table
        migrations.CreateModel(
            name='SkillGoal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('target_level', models.IntegerField()),
                ('deadline', models.DateField(blank=True, null=True)),
                ('reason', models.TextField(blank=True)),
                ('achieved', models.BooleanField(default=False)),
                ('achieved_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('skill', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='goals',
                    to='academy.skill'
                )),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='skill_goals',
                    to=settings.AUTH_USER_MODEL
                )),
            ],
            options={
                'db_table': 'academy_skill_goals',
                'ordering': ['-created_at'],
            },
        ),
        
        # 5. Create LessonSkillMapping table
        migrations.CreateModel(
            name='LessonSkillMapping',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lesson_id', models.CharField(db_index=True, max_length=50)),
                ('points_awarded', models.IntegerField()),
                ('quiz_bonus', models.IntegerField(default=0)),
                ('simulation_bonus', models.IntegerField(default=0)),
                ('practice_bonus', models.IntegerField(default=0)),
                ('skill', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='lesson_mappings',
                    to='academy.skill'
                )),
            ],
            options={
                'db_table': 'academy_lesson_skill_mappings',
            },
        ),
        
        # 6. Create SkillActivity table
        migrations.CreateModel(
            name='SkillActivity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activity_type', models.CharField(
                    choices=[
                        ('lesson_complete', 'Lesson Completed'),
                        ('quiz_pass', 'Quiz Passed'),
                        ('simulation_correct', 'Simulation Correct'),
                        ('practice_submit', 'Practice Submitted'),
                        ('achievement_unlock', 'Achievement Unlocked'),
                        ('manual', 'Manual Award'),
                    ],
                    max_length=30
                )),
                ('points', models.IntegerField()),
                ('metadata', models.JSONField(blank=True, default=dict)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('skill', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='activities',
                    to='academy.skill'
                )),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='skill_activities',
                    to=settings.AUTH_USER_MODEL
                )),
            ],
            options={
                'db_table': 'academy_skill_activities',
                'ordering': ['-created_at'],
            },
        ),
        
        # 7. Add unique constraints
        migrations.AddConstraint(
            model_name='userskill',
            constraint=models.UniqueConstraint(
                fields=['user', 'skill'],
                name='unique_user_skill'
            ),
        ),
        migrations.AddConstraint(
            model_name='lessonskillmapping',
            constraint=models.UniqueConstraint(
                fields=['lesson_id', 'skill'],
                name='unique_lesson_skill'
            ),
        ),
        
        # 8. Add indexes for performance
        migrations.AddIndex(
            model_name='userskill',
            index=models.Index(fields=['user', '-points'], name='idx_user_skill_points'),
        ),
        migrations.AddIndex(
            model_name='skillactivity',
            index=models.Index(fields=['user', '-created_at'], name='idx_user_activity_date'),
        ),
    ]
