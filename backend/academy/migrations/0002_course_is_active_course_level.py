from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('academy', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='course',
            name='level',
            field=models.CharField(choices=[('basic', 'Basic'), ('intermediate', 'Intermediate'), ('advanced', 'Advanced')], default='basic', max_length=20),
        ),
    ]