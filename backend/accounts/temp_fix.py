# Authenticated user updates own profile (name, image)
class UpdateOwnProfileSerializer(serializers.ModelSerializer):
    # Map 'image' from API to 'profile_image' in model
    image = serializers.ImageField(source='profile_image', required=False, allow_null=True)
    
    class Meta:
        model = CustomUser
        fields = [
            "first_name",
            "last_name",
            "image",  # API uses "image", but maps to "profile_image"
        ]
        extra_kwargs = {
            "first_name": {"required": False, "allow_blank": True},
            "last_name": {"required": False, "allow_blank": True},
        }

    def update(self, instance: CustomUser, validated_data):
        # Extract profile_image if present (comes as 'profile_image' due to source mapping)
        profile_image = validated_data.pop('profile_image', None)
        
        for field in ["first_name", "last_name"]:
            if field in validated_data:
                setattr(instance, field, validated_data[field])
        
        if profile_image is not None:
            instance.profile_image = profile_image
            
        instance.save()
        return instance
