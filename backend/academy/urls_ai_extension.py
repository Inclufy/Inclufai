# AI Content Generation endpoints (add to existing urls.py)
from . import ai_content_api

ai_urlpatterns = [
    path('ai/analyze-lesson/<int:lesson_id>/', ai_content_api.analyze_lesson_content, name='ai-analyze-lesson'),
    path('ai/assign-skills/<int:lesson_id>/', ai_content_api.auto_assign_skills, name='ai-assign-skills'),
    path('ai/generate-visual/<int:lesson_id>/<str:visual_type>/', ai_content_api.generate_visual, name='ai-generate-visual'),
    path('ai/batch-analyze/<uuid:course_id>/', ai_content_api.batch_analyze_course, name='ai-batch-analyze'),
]
