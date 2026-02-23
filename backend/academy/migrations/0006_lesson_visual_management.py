from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('academy', '0005_exam_examattempt_lessonresource_quizanswer_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='LessonVisual',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visual_id', models.CharField(max_length=100, help_text='Visual identifier (e.g., project-definition, timeline, stakeholder)')),
                ('ai_confidence', models.DecimalField(max_digits=5, decimal_places=2, help_text='AI confidence score (0-100)')),
                ('status', models.CharField(
                    max_length=20,
                    choices=[
                        ('pending', 'Pending Review'),
                        ('approved', 'Approved'),
                        ('rejected', 'Rejected'),
                    ],
                    default='pending'
                )),
                ('custom_keywords', models.TextField(blank=True, null=True, help_text='Custom keywords if AI suggestion was rejected')),
                ('ai_concepts', models.JSONField(blank=True, null=True, help_text='AI-detected concepts from OpenAI')),
                ('ai_intent', models.CharField(max_length=100, blank=True, null=True, help_text='AI-detected learning intent')),
                ('ai_methodology', models.CharField(max_length=50, blank=True, null=True, help_text='AI-detected methodology')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('approved_at', models.DateTimeField(blank=True, null=True)),
                ('lesson', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='visual', to='academy.courselesson')),
                ('approved_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Lesson Visual',
                'verbose_name_plural': 'Lesson Visuals',
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddIndex(
            model_name='lessonvisual',
            index=models.Index(fields=['status'], name='academy_les_status_idx'),
        ),
        migrations.AddIndex(
            model_name='lessonvisual',
            index=models.Index(fields=['lesson'], name='academy_les_lesson_idx'),
        ),
    ]
