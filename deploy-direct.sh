#!/bin/bash
set -e

echo "🚀 Direct Production Deployment (no git)"
echo "========================================"
echo ""

SERVER="root@31.20.137.168"
REMOTE_PATH="/root/projextpal"

# 1. Sync frontend changes
echo "📤 Syncing frontend to server..."
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'dist' \
  --exclude 'build' \
  ./frontend/ ${SERVER}:${REMOTE_PATH}/frontend/

# 2. Deploy
echo "🌐 Deploying on server..."
ssh ${SERVER} << 'ENDSSH'

cd /root/projextpal

echo "🛑 Stopping containers..."
docker-compose -f docker-compose.production.yml down

echo "🔨 Rebuilding frontend (no cache)..."
docker-compose -f docker-compose.production.yml build --no-cache frontend

echo "🚀 Starting containers..."
docker-compose -f docker-compose.production.yml up -d

echo "⏳ Waiting for services..."
sleep 10

echo "✅ Deployment complete!"
echo ""
echo "📊 Container status:"
docker-compose -f docker-compose.production.yml ps

echo ""
echo "📋 Frontend logs:"
docker-compose -f docker-compose.production.yml logs --tail=20 frontend

ENDSSH

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "🌐 Test URLs:"
echo "   https://projextpal.com"
echo "   https://projextpal.com/settings"
echo ""
echo "🔄 Clear browser cache: Cmd+Shift+R"

