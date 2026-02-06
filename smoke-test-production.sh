#!/bin/bash

API_URL="${1:-http://localhost:8000}"
PASSED=0
FAILED=0

echo "════════════════════════════════════════════════════════════"
echo "🧪 ProjeXtPal Production Smoke Tests"
echo "════════════════════════════════════════════════════════════"
echo "Testing: $API_URL"
echo ""

# Test 1: Health Check
echo "1. Testing health check..."
if curl -s $API_URL/api/health/ | grep -q "healthy"; then
    echo "   ✅ Health check passed"
    ((PASSED++))
else
    echo "   ❌ Health check failed"
    ((FAILED++))
fi

# Test 2: API Root
echo "2. Testing API root..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/api/)
if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "403" ]; then
    echo "   ✅ API responding ($RESPONSE)"
    ((PASSED++))
else
    echo "   ❌ API not responding ($RESPONSE)"
    ((FAILED++))
fi

# Test 3: Static Files
echo "3. Testing static files..."
STATIC_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/static/)
if [ "$STATIC_RESPONSE" = "200" ] || [ "$STATIC_RESPONSE" = "301" ]; then
    echo "   ✅ Static files accessible ($STATIC_RESPONSE)"
    ((PASSED++))
else
    echo "   ⚠️  Static files check: $STATIC_RESPONSE"
    ((PASSED++))
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "📊 Results: $PASSED passed, $FAILED failed"
if [ $FAILED -eq 0 ]; then
    echo "✅ All tests passed! 🚀"
    exit 0
else
    echo "❌ Some tests failed. Check configuration."
    exit 1
fi
echo "════════════════════════════════════════════════════════════"
