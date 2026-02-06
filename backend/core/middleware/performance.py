import time
from django.utils.deprecation import MiddlewareMixin

class PerformanceLoggingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request._start_time = time.time()
        
    def process_response(self, request, response):
        if hasattr(request, '_start_time'):
            duration = time.time() - request._start_time
            response['X-Response-Time'] = f'{duration:.3f}s'
        return response
