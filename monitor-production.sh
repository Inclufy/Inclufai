#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "🔍 ProjeXtPal Production Monitoring"
echo "════════════════════════════════════════════════════════════"
echo ""

# Docker Services Check
echo "📦 Docker Services:"
docker-compose ps
echo ""

# Health Check
echo "🏥 Health Check:"
curl -s http://localhost:8000/api/health/ | python3 -m json.tool 2>/dev/null || echo "Health endpoint not available"
echo ""

# Database Check
echo "🗄️  Database:"
docker-compose exec -T postgres psql -U postgres -d projextpal -c "SELECT COUNT(*) as total_users FROM auth_user;" 2>/dev/null || echo "Database check failed"
echo ""

# Disk Space
echo "💾 Disk Space:"
df -h / | tail -1
echo ""

# Memory Usage
echo "🧠 Memory Usage:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" 2>/dev/null || echo "Docker stats unavailable"
echo ""

# Recent Logs
echo "📋 Recent Errors (last 10):"
docker-compose logs --tail=10 backend 2>/dev/null | grep -i error || echo "No errors found"
echo ""

echo "════════════════════════════════════════════════════════════"
echo "✅ Monitoring complete - $(date)"
echo "════════════════════════════════════════════════════════════"
