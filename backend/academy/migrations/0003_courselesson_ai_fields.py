from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('academy', '0001_initial'),  # FIXED: was 0002, now 0001
    ]
    
    operations = [
        migrations.AddField(
            model_name='courselesson',
            name='ai_profile',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='courselesson',
            name='simulation_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='courselesson',
            name='practice_set_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
