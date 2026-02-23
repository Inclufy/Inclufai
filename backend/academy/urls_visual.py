from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views_visual import LessonVisualViewSet

router = DefaultRouter()
router.register(r'lesson-visuals', LessonVisualViewSet, basename='lesson-visual')

urlpatterns = [
    path('', include(router.urls)),
]
