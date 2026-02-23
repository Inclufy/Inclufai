from rest_framework import serializers
from .models import LessonVisual, CourseLesson


class LessonVisualSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    lesson_id = serializers.IntegerField(source='lesson.id', read_only=True)

    class Meta:
        model = LessonVisual
        fields = [
            'id', 'lesson', 'lesson_id', 'lesson_title', 'visual_id', 'ai_confidence',
            'status', 'custom_keywords', 'ai_concepts', 'ai_intent',
            'ai_methodology', 'preview_image_url',
            'created_at', 'updated_at', 'approved_at', 'approved_by'
        ]
        read_only_fields = ['created_at', 'updated_at', 'approved_at', 'approved_by']


class GenerateVisualsSerializer(serializers.Serializer):
    course_id = serializers.UUIDField()
    regenerate = serializers.BooleanField(default=False)
    
    
class ApproveVisualSerializer(serializers.Serializer):
    visual_id = serializers.IntegerField()
    
    
class RejectVisualSerializer(serializers.Serializer):
    visual_id = serializers.IntegerField()
    custom_keywords = serializers.CharField(required=False, allow_blank=True)