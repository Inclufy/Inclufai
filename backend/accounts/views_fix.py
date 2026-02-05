
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_users_list(request):
    """Get all users for team management"""
    from accounts.models import CustomUser
    
    users = CustomUser.objects.all().order_by('first_name', 'email')
    
    data = []
    for user in users:
        image_url = None
        if getattr(user, 'image', None):
            try:
                image_url = request.build_absolute_uri(user.image.url)
            except Exception:
                pass
        
        data.append({
            'id': user.id,
            'email': user.email,
            'username': user.username if hasattr(user, 'username') else user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'name': f"{user.first_name} {user.last_name}".strip() or user.email,
            'is_active': user.is_active,
            'is_staff': user.is_staff if hasattr(user, 'is_staff') else False,
            'is_superuser': user.is_superuser,
            'image': image_url,
            'role': getattr(user, 'role', None),
            'company_name': user.company.name if user.company else None,
            'date_joined': user.date_joined.isoformat() if user.date_joined else None,
        })
    
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_users_list(request):
    """Get all users for team management"""
    from accounts.models import CustomUser
    
    users = CustomUser.objects.all().order_by('first_name', 'email')
    
    data = []
    for user in users:
        image_url = None
        if getattr(user, 'image', None):
            try:
                image_url = request.build_absolute_uri(user.image.url)
            except Exception:
                pass
        
        data.append({
            'id': user.id,
            'email': user.email,
            'username': user.username if hasattr(user, 'username') else user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'name': f"{user.first_name} {user.last_name}".strip() or user.email,
            'is_active': user.is_active,
            'is_staff': user.is_staff if hasattr(user, 'is_staff') else False,
            'is_superuser': user.is_superuser,
            'image': image_url,
            'role': getattr(user, 'role', None),
            'company_name': user.company.name if user.company else None,
            'date_joined': user.date_joined.isoformat() if user.date_joined else None,
        })
    
    return Response(data, status=status.HTTP_200_OK)
