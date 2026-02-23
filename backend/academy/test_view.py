from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.db import connection
import uuid

@api_view(['GET'])
@permission_classes([AllowAny])
def test_course_detail(request, course_id):
    try:
        course_uuid = uuid.UUID(str(course_id))
            
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT COUNT(*) FROM academy_coursemodule WHERE course_id = %s",
                [str(course_uuid)]
            )
            count = cursor.fetchone()[0]
        
        return JsonResponse({
            'success': True,
            'count': count,
            'db': str(connection.settings_dict['NAME']),
            'host': str(connection.settings_dict['HOST']),
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e),
        })
