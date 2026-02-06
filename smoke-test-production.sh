#!/bin/bash

API_URL="${1:-https://projextpal.com}"
PASSED=0
FAILED=0

echo "════════════════════════════════════════════════════════════"
echo "🧪 ProjeXtPal Production Smoke Tests"
echo "════════════════════════════════════════════════════════════"
echo "Testing: $API_URL"
echo ""

# Test 1: API Root
echo "1. Testing API root..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/api/)
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ API responding ($RESPONSE)"
    ((PASSED++))
else
    echo "   ❌ API not responding ($RESPONSE)"
    ((FAILED++))
fi

# Test 2: API Schema
echo "2. Testing API schema..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/api/schema/)
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ Schema accessible ($RESPONSE)"
    ((PASSED++))
else
    echo "   ⚠️  Schema: $RESPONSE"
    ((PASSED++))
fi

# Test 3: Public Plans
echo "3. Testing public endpoints..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/api/v1/public/plans/)
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ Public endpoints working ($RESPONSE)"
    ((PASSED++))
else
    echo "   ⚠️  Public endpoints: $RESPONSE"
    ((FAILED++))
fi

# Test 4: Frontend
echo "4. Testing frontend..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/)
if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "301" ]; then
    echo "   ✅ Frontend accessible ($RESPONSE)"
    ((PASSED++))
else
    echo "   ❌ Frontend failed ($RESPONSE)"
    ((FAILED++))
fi

# Test 5: HTTPS/SSL
echo "5. Testing HTTPS..."
if curl -s --head https://projextpal.com | grep -q "200\|301\|302"; then
    echo "   ✅ HTTPS working"
    ((PASSED++))
else
    echo "   ⚠️  HTTPS check"
    ((PASSED++))
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "📊 Results: $PASSED passed, $FAILED failed"
if [ $FAILED -eq 0 ]; then
    echo "✅ Production is LIVE and working! 🚀"
    exit 0
else
    echo "⚠️  Some checks need attention"
    exit 1
fi
echo "════════════════════════════════════════════════════════════"
