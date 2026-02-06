#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "⚡ ProjeXtPal Performance Monitor"
echo "════════════════════════════════════════════════════════════"
echo ""

# Backend performance
echo "📊 Backend API Performance:"
echo ""
curl -o /dev/null -s -w "Login endpoint: %{time_total}s\n" \
  -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

curl -o /dev/null -s -w "Projects endpoint: %{time_total}s\n" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/projects/

echo ""
echo "🌐 Frontend Performance:"
echo ""
# Use Lighthouse CLI
npx lighthouse http://localhost:5173 \
  --only-categories=performance \
  --quiet \
  --chrome-flags="--headless"

echo ""
echo "📱 Mobile App Performance:"
echo ""
cd mobile
npm run test -- tests/performance
cd ..

echo ""
echo "════════════════════════════════════════════════════════════"
