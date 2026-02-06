from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class InvitationsView(APIView):
    """
    Team/Project invitations endpoint
    Returns empty list for now - feature to be implemented
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response([])
    
    def post(self, request):
        return Response({
            'message': 'Invitation feature coming soon'
        }, status=501)
