"""Quiz & Exam API"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import CourseLesson, QuizAttempt, Exam, ExamAttempt, Enrollment
import json
import os

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_quiz(request, lesson_id):
    """Get quiz for lesson"""
    try:
        quiz_file = f'/app/academy/data/quizzes/{lesson_id}.json'
        if not os.path.exists(quiz_file):
            return Response({'error': 'Quiz not found'}, status=status.HTTP_404_NOT_FOUND)
        
        with open(quiz_file, 'r') as f:
            quiz_data = json.load(f)
        
        return Response(quiz_data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_quiz(request, lesson_id):
    """Submit quiz"""
    try:
        answers = request.data.get('answers', [])
        quiz_file = f'/app/academy/data/quizzes/{lesson_id}.json'
        
        with open(quiz_file, 'r') as f:
            quiz_data = json.load(f)
        
        correct = sum(1 for i, q in enumerate(quiz_data['questions']) if i < len(answers) and answers[i] == q['correct'])
        total = len(quiz_data['questions'])
        score = int((correct / total) * 100) if total > 0 else 0
        passed = score >= quiz_data.get('passingScore', 70)
        
        return Response({'score': score, 'passed': passed, 'correct': correct, 'total': total})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
