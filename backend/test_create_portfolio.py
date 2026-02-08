import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from accounts.models import CustomUser, Company
from governance.models import Portfolio

print("🧪 Testing Portfolio Creation...")
print("")

# Get user
user = CustomUser.objects.first()
print(f"User: {user.email}")
print(f"User Company: {user.company}")

# Try creating portfolio WITHOUT company
try:
    portfolio = Portfolio.objects.create(
        name="Test Portfolio - No Company",
        description="Testing without company requirement",
        owner=user,
        status='active'
    )
    print(f"✅ SUCCESS! Portfolio created: {portfolio.name} (ID: {portfolio.id})")
    print(f"   Company: {portfolio.company}")
except Exception as e:
    print(f"❌ FAILED: {e}")

print("")

# Try creating portfolio WITH company
try:
    company = Company.objects.first()
    if company:
        portfolio2 = Portfolio.objects.create(
            name="Test Portfolio - With Company",
            description="Testing with company",
            company=company,
            owner=user,
            status='active'
        )
        print(f"✅ SUCCESS! Portfolio created: {portfolio2.name} (ID: {portfolio2.id})")
        print(f"   Company: {portfolio2.company}")
    else:
        print("⚠️  No company found, skipping company test")
except Exception as e:
    print(f"❌ FAILED: {e}")

print("")
print("✅ Test complete!")
