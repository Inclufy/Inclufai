# Backend Performance Optimizations

## Database Query Optimization

### 1. Add Database Indexes
```python
# In models.py - add these to frequently queried fields

class Project(models.Model):
    name = models.CharField(max_length=200, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    owner = models.ForeignKey(User, on_delete=CASCADE, db_index=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['owner', '-created_at']),
            models.Index(fields=['methodology', 'status']),
        ]
```

### 2. Use select_related() and prefetch_related()
```python
# Instead of:
projects = Project.objects.all()

# Use:
projects = Project.objects.select_related('owner').prefetch_related('team_members')
```

### 3. Add Query Caching
```python
from django.core.cache import cache

def get_dashboard_data(user_id):
    cache_key = f'dashboard_{user_id}'
    data = cache.get(cache_key)
    
    if data is None:
        data = {
            'projects': list(Project.objects.filter(owner_id=user_id).values()),
            'recent_activity': get_recent_activity(user_id)
        }
        cache.set(cache_key, data, timeout=300)  # 5 minutes
    
    return data
```

### 4. Database Connection Pooling
```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'CONN_MAX_AGE': 600,  # Connection pooling
        'OPTIONS': {
            'connect_timeout': 10,
        }
    }
}
```
