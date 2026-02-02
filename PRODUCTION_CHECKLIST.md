# 🚀 ProjeXtPal Local Production Deployment

## ✅ Setup (One-time)

### 1. GitLab CI/CD Variables
Alleen deze variable nodig: https://gitlab.com/inclufy/projextpal/-/settings/ci_cd

**CI_REGISTRY_PASSWORD** (Personal Access Token)
1. Create token: https://gitlab.com/-/user_settings/personal_access_tokens
   - Name: `projextpal-ci-cd`
   - Scopes: ✓ `read_registry`, ✓ `write_registry`
   - Expiration: 1 jaar
2. Add variable in GitLab:
   - Key: `CI_REGISTRY_PASSWORD`
   - Value: [paste token]
   - Type: Variable
   - Masked: Yes

### 2. DNS Configuration
Point `projextpal.com` to this machine's public IP:
```
A Record: projextpal.com → [your public IP]
A Record: www.projextpal.com → [your public IP]
```

Find your public IP: `curl ifconfig.me`

### 3. Firewall/Router
Open ports:
- Port 80 (HTTP)
- Port 443 (HTTPS)
- Port 8083 (Frontend - optional, for direct access)
- Port 8001 (Backend API - optional, for direct access)

### 4. Environment Variables
Already configured in `.env` ✅

## 🚀 Deployment Workflow

### Option A: Automatic (Recommended)
1. **Push code to GitLab:**
```bash
   git add .
   git commit -m "your changes"
   git push origin master
```

2. **Wait for pipeline:**
   - Go to: https://gitlab.com/inclufy/projextpal/-/pipelines
   - Wait for build to complete (~5 minutes)

3. **Deploy locally:**
```bash
   ./deploy-local.sh
```

### Option B: Manual Local Build
```bash
# Stop containers
docker-compose -f docker-compose.production.yml down

# Build locally
cd frontend
npm run build
cd ..

docker build -f frontend/Dockerfile.prod \
  --build-arg VITE_BACKEND_URL=https://projextpal.com/api/v1 \
  -t registry.gitlab.com/inclufy/projextpal/frontend:latest \
  ./frontend

docker build -f backend/Dockerfile.prod \
  -t registry.gitlab.com/inclufy/projextpal/backend:latest \
  ./backend

# Start containers
docker-compose -f docker-compose.production.yml up -d
```

## 📊 Monitoring
```bash
# View all logs
docker-compose -f docker-compose.production.yml logs -f

# View specific service
docker-compose -f docker-compose.production.yml logs -f frontend
docker-compose -f docker-compose.production.yml logs -f backend

# Check status
docker-compose -f docker-compose.production.yml ps

# Restart services
docker-compose -f docker-compose.production.yml restart
```

## 🔧 Maintenance

### Database Backup
```bash
# Manual backup
docker-compose -f docker-compose.production.yml exec postgres \
  pg_dump -U projextpal projextpal > backup_$(date +%Y%m%d).sql

# Restore
cat backup_20250202.sql | docker-compose -f docker-compose.production.yml exec -T postgres \
  psql -U projextpal projextpal
```

### Update Application
```bash
git pull origin master
./deploy-local.sh
```

### Clean Up
```bash
# Remove old images
docker image prune -a

# Remove old containers
docker-compose -f docker-compose.production.yml down --volumes
```

## 🌐 URLs
- Frontend: http://localhost:8083 (local) / https://projextpal.com (public)
- Backend API: http://localhost:8001 (local) / https://projextpal.com/api/v1 (public)
- Admin: http://localhost:8001/admin

## 🆘 Troubleshooting

### Pipeline fails
- Check GitLab Runner status
- Verify CI_REGISTRY_PASSWORD is set correctly

### Containers won't start
```bash
docker-compose -f docker-compose.production.yml logs
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d
```

### Can't access from internet
- Check DNS: `nslookup projextpal.com`
- Check firewall/router port forwarding
- Check if ports are open: `netstat -an | grep LISTEN`
