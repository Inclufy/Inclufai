# Authenticated user updates own profile (name only, image handled separately)
class UpdateOwnProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "first_name",
            "last_name",
        ]
        extra_kwargs = {
            "first_name": {"required": False, "allow_blank": True},
            "last_name": {"required": False, "allow_blank": True},
        }

    def update(self, instance: CustomUser, validated_data):
        for field in ["first_name", "last_name"]:
            if field in validated_data:
                setattr(instance, field, validated_data[field])
        instance.save()
        return instance
