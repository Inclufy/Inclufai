#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "✅ ProjeXtPal Production Readiness Checklist"
echo "════════════════════════════════════════════════════════════"
echo ""

TOTAL=0
PASSED=0

check_item() {
    ((TOTAL++))
    read -p "✓ $1? (y/n) " answer
    if [ "$answer" = "y" ]; then
        echo "   ✅ Confirmed"
        ((PASSED++))
        return 0
    else
        echo "   ❌ Not done - please complete"
        return 1
    fi
}

echo "🔒 Security:"
check_item "DEBUG=False in .env.prod"
check_item "New SECRET_KEY generated"
check_item "SSL certificate valid"
echo ""

echo "🗄️  Database:"
check_item "PostgreSQL running"
check_item "Backups configured"
check_item "Test restore successful"
echo ""

echo "🐳 Docker:"
check_item "All containers running"
check_item "Production compose file updated"
echo ""

echo "🌐 Networking:"
check_item "Cloudflare Tunnel working"
check_item "Nginx config production-ready"
check_item "HTTPS working"
echo ""

echo "📱 Applications:"
check_item "Backend API responding"
check_item "Frontend accessible"
echo ""

echo "📊 Monitoring:"
check_item "Health check endpoint working"
check_item "Logs being written"
echo ""

echo "🧪 Testing:"
check_item "All 317 tests passing"
check_item "Smoke tests passed"
echo ""

echo "════════════════════════════════════════════════════════════"
echo "Score: $PASSED/$TOTAL completed"
if [ $PASSED -eq $TOTAL ]; then
    echo "🎉 100% Complete! Ready for production! 🚀"
else
    echo "⚠️  Complete remaining items before going live."
fi
echo "════════════════════════════════════════════════════════════"
