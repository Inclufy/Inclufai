from accounts.models import CustomUser
from accounts.serializers import UpdateOwnProfileSerializer

# Get user
user = CustomUser.objects.get(id=1)
print(f"Current user: {user.email}")
print(f"First name: {user.first_name}")
print(f"Has last_name: {hasattr(user, 'last_name')}")

# Check all fields
print("\nAll user fields:")
for field in CustomUser._meta.fields:
    print(f"  - {field.name}")

# Try to update via serializer
data = {"first_name": "Sami", "last_name": "Loukili"}
serializer = UpdateOwnProfileSerializer(instance=user, data=data, partial=True)

print("\nValidating...")
if serializer.is_valid():
    print("✅ Serializer valid")
    try:
        serializer.save()
        print("✅ Saved successfully!")
        user.refresh_from_db()
        print(f"Updated: {user.first_name} {getattr(user, 'last_name', 'NO LAST_NAME')}")
    except Exception as e:
        print(f"❌ Save error: {e}")
        import traceback
        traceback.print_exc()
else:
    print(f"❌ Validation errors: {serializer.errors}")
