from rest_framework import serializers
from .models import Portfolio, GovernanceBoard, BoardMember, GovernanceStakeholder


class PortfolioSerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source='owner.email', read_only=True)
    owner_name = serializers.SerializerMethodField()
    total_boards = serializers.SerializerMethodField()
    
    class Meta:
        model = Portfolio
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_owner_name(self, obj):
        if obj.owner:
            return obj.owner.get_full_name() or obj.owner.email
        return None
    
    def get_total_boards(self, obj):
        return obj.boards.filter(is_active=True).count()


class BoardMemberSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = BoardMember
        fields = '__all__'
        read_only_fields = ['id', 'joined_at']
    
    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.email


class GovernanceBoardSerializer(serializers.ModelSerializer):
    chair_email = serializers.EmailField(source='chair.email', read_only=True)
    chair_name = serializers.SerializerMethodField()
    members = BoardMemberSerializer(many=True, read_only=True)
    member_count = serializers.SerializerMethodField()
    
    class Meta:
        model = GovernanceBoard
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
    
    def get_chair_name(self, obj):
        if obj.chair:
            return obj.chair.get_full_name() or obj.chair.email
        return None
    
    def get_member_count(self, obj):
        return obj.members.filter(is_active=True).count()


class GovernanceStakeholderSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    quadrant = serializers.CharField(source='stakeholder_quadrant', read_only=True)
    
    class Meta:
        model = GovernanceStakeholder
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
    
    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.email
