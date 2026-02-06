#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "🚀 ProjeXtPal Production Deployment"
echo "════════════════════════════════════════════════════════════"
echo ""

# Step 1: Backup current database
echo "1️⃣  Creating backup..."
./backup-database.sh

# Step 2: Pull latest code
echo ""
echo "2️⃣  Pulling latest code..."
git pull origin master

# Step 3: Build containers
echo ""
echo "3️⃣  Building containers..."
docker-compose -f docker-compose.production.yml build

# Step 4: Stop old containers
echo ""
echo "4️⃣  Stopping old containers..."
docker-compose -f docker-compose.production.yml down

# Step 5: Start new containers
echo ""
echo "5️⃣  Starting new containers..."
docker-compose -f docker-compose.production.yml up -d

# Step 6: Run migrations
echo ""
echo "6️⃣  Running migrations..."
docker-compose -f docker-compose.production.yml exec backend python manage.py migrate

# Step 7: Collect static files
echo ""
echo "7️⃣  Collecting static files..."
docker-compose -f docker-compose.production.yml exec backend python manage.py collectstatic --no-input

# Step 8: Run smoke tests
echo ""
echo "8️⃣  Running smoke tests..."
sleep 5  # Wait for services to be ready
./smoke-test-production.sh

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Deployment complete!"
echo "════════════════════════════════════════════════════════════"
