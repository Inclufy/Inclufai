# 🚀 ProjeXtPal Production Deployment Checklist

## ✅ Completed
- [x] Code op master branch met "Vraag Demo Aan" feature
- [x] GitLab CI/CD pipeline geconfigureerd (.gitlab-ci.yml)
- [x] Frontend API URLs updated naar https://projextpal.com/api/v1
- [x] Docker images configuration met GitLab Registry
- [x] Lokale test succesvol

## ⏳ To Do

### 1. GitLab CI/CD Variables Setup
Ga naar: https://gitlab.com/inclufy/projextpal/-/settings/ci_cd

**SSH Key genereren:**
```bash
ssh-keygen -t ed25519 -C "gitlab-ci-projextpal" -f ~/.ssh/gitlab_ci_projextpal
ssh-copy-id -i ~/.ssh/gitlab_ci_projextpal.pub root@srv1057200.hstgr.cloud
```

**Variables toevoegen:**
1. SSH_PRIVATE_KEY (type: File, protected: yes)
   - Value: inhoud van `cat ~/.ssh/gitlab_ci_projextpal`
2. SSH_USER (type: Variable)
   - Value: `root`
3. CI_REGISTRY_PASSWORD (type: Variable, masked: yes)
   - Value: GitLab Personal Access Token
   - Maak aan: https://gitlab.com/-/user_settings/personal_access_tokens
   - Scopes: `read_registry`, `write_registry`

### 2. Server Setup (srv1057200.hstgr.cloud)

**SSH naar server en run:**
```bash
ssh root@srv1057200.hstgr.cloud

# Install Docker
curl -fsSL https://get.docker.com | sh

# Create project directory
mkdir -p /var/www/projextpal
cd /var/www/projextpal

# Clone repository
git clone https://gitlab.com/inclufy/projextpal.git .
git checkout master

# Create .env file
cat > .env << 'ENVFILE'
POSTGRES_DB=projextpal
POSTGRES_USER=projextpal
POSTGRES_PASSWORD=your-secure-postgres-password
REDIS_PASSWORD=your-secure-redis-password
DJANGO_SECRET_KEY=your-django-secret-key
ALLOWED_HOSTS=projextpal.com,srv1057200.hstgr.cloud
CORS_ALLOWED_ORIGINS=https://projextpal.com,https://srv1057200.hstgr.cloud
DEBUG=False
ENVFILE

# Test Docker
docker --version
docker-compose --version
```

### 3. DNS Configuration
Point `projextpal.com` to server IP:
- A Record: `projextpal.com` → `[IP of srv1057200.hstgr.cloud]`
- A Record: `www.projextpal.com` → `[IP of srv1057200.hstgr.cloud]`

### 4. SSL Certificate (Let's Encrypt)
```bash
# Install certbot
apt-get update
apt-get install -y certbot

# Get certificate
certbot certonly --standalone -d projextpal.com -d www.projextpal.com

# Certificates at:
# /etc/letsencrypt/live/projextpal.com/fullchain.pem
# /etc/letsencrypt/live/projextpal.com/privkey.pem
```

### 5. Nginx Configuration
Update nginx config voor SSL en reverse proxy

### 6. First Deployment
1. Push trigger pipeline:
```bash
   git push origin master
```
2. Go to: https://gitlab.com/inclufy/projextpal/-/pipelines
3. Wait for build stage to complete
4. Manually trigger deploy-production job

### 7. Post-Deployment
```bash
# SSH to server
ssh root@srv1057200.hstgr.cloud
cd /var/www/projextpal

# Check containers
docker-compose -f docker-compose.production.yml ps

# Create superuser
docker-compose -f docker-compose.production.yml exec backend python manage.py createsuperuser

# Check logs
docker-compose -f docker-compose.production.yml logs -f
```

## 🌐 Access Points
- Frontend: https://projextpal.com
- Backend API: https://projextpal.com/api/v1
- Admin: https://projextpal.com/admin

## 📞 Support
- GitLab: https://gitlab.com/inclufy/projextpal
- Server: srv1057200.hstgr.cloud
