

class CompanyListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from accounts.models import Company
        if not request.user.is_superuser:
            return Response({'detail': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)
        companies = Company.objects.all().order_by('name')
        data = [{'id': c.id, 'name': c.name} for c in companies]
        return Response(data, status=status.HTTP_200_OK)
    
    def post(self, request):
        from accounts.models import Company
        if not request.user.is_superuser:
            return Response({'detail': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)
        
        name = request.data.get('name', '').strip()
        description = request.data.get('description', '').strip()
        
        if not name:
            return Response({'detail': 'Company name is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if Company.objects.filter(name__iexact=name).exists():
            return Response({'detail': 'Company with this name already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        company = Company.objects.create(
            name=name,
            description=description,
            is_subscribed=False
        )
        return Response({'id': company.id, 'name': company.name, 'description': company.description}, status=status.HTTP_201_CREATED)
