#!/bin/bash
cp docker-compose.production.yml docker-compose.production.yml.backup
sed -i '' 's|http://localhost:8001/api/v1|https://projextpal.com/api/v1|g' docker-compose.production.yml
grep "VITE_" docker-compose.production.yml
docker-compose -f docker-compose.production.yml build frontend --no-cache
docker-compose -f docker-compose.production.yml up -d frontend
echo "✅ Updated to https://projextpal.com"
