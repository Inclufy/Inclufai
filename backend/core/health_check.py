from django.http import JsonResponse
from django.db import connection
from django.core.cache import cache
import datetime

def health_check(request):
    """Comprehensive health check endpoint"""
    status = {
        'status': 'healthy',
        'timestamp': datetime.datetime.now().isoformat(),
        'checks': {}
    }
    
    # Database check
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        status['checks']['database'] = 'ok'
    except Exception as e:
        status['checks']['database'] = f'error: {str(e)}'
        status['status'] = 'unhealthy'
    
    # Cache check
    try:
        cache.set('health_check', 'ok', 10)
        if cache.get('health_check') == 'ok':
            status['checks']['cache'] = 'ok'
        else:
            status['checks']['cache'] = 'error'
            status['status'] = 'unhealthy'
    except Exception as e:
        status['checks']['cache'] = f'error: {str(e)}'
    
    return JsonResponse(status)
