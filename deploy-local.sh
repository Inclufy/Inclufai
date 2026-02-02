#!/bin/bash
set -e

echo "🚀 ProjeXtPal Local Deployment Script"
echo "======================================"
echo ""

# Check if logged in to GitLab registry
echo "📦 Logging in to GitLab Container Registry..."
docker login registry.gitlab.com

echo ""
echo "⬇️  Pulling latest images from GitLab..."
docker-compose -f docker-compose.production.yml pull

echo ""
echo "🛑 Stopping current containers..."
docker-compose -f docker-compose.production.yml down

echo ""
echo "🚀 Starting updated containers..."
docker-compose -f docker-compose.production.yml up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 15

echo ""
echo "✅ Container Status:"
docker-compose -f docker-compose.production.yml ps

echo ""
echo "📊 Recent logs:"
echo ""
echo "--- Frontend ---"
docker-compose -f docker-compose.production.yml logs --tail=10 frontend

echo ""
echo "--- Backend ---"
docker-compose -f docker-compose.production.yml logs --tail=10 backend

echo ""
echo "✅ Deployment completed!"
echo "🌐 Frontend: http://localhost:8083"
echo "🔧 Backend: http://localhost:8001"
echo ""
echo "💡 To view logs: docker-compose -f docker-compose.production.yml logs -f"
