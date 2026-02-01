# Authenticated user updates own profile (name, image)
class UpdateOwnProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "first_name",
            "last_name",  # ← ADD THIS
            "image",
        ]
        extra_kwargs = {
            "first_name": {"required": False, "allow_blank": True},
            "last_name": {"required": False, "allow_blank": True},  # ← ADD THIS
            "image": {"required": False, "allow_null": True},
        }

    def update(self, instance: CustomUser, validated_data):
        for field in ["first_name", "last_name", "image"]:  # ← ADD last_name HERE
            if field in validated_data:
                setattr(instance, field, validated_data[field])
        instance.save()
        return instance
