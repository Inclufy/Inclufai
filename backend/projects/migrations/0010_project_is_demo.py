from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0009_project_portfolio_project_program'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='is_demo',
            field=models.BooleanField(default=False),
        ),
    ]
