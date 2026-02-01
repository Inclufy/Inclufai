# 🚀 ProjeXtPal Production Deployment Package

**Complete production deployment with Docker + Tailscale**

---

## 📦 Package Contents

| File | Purpose |
|------|---------|
| **quick-start.sh** | ⭐ One-command deployment |
| **docker-compose.production.yml** | Full stack orchestration |
| **Dockerfile.frontend.prod** | Frontend production build |
| **Dockerfile.backend.prod** | Backend production build |
| **nginx.conf** | Nginx main configuration |
| **default.conf** | Nginx server block (SSL, proxy) |
| **.env.production.template** | Environment variables template |
| **requirements-prod.txt** | Python production packages |
| **setup-tailscale.sh** | Tailscale configuration |
| **backup.sh** | Automated backup script |
| **restore.sh** | Restore from backup |
| **health-check.sh** | Health monitoring |
| **PRODUCTION-DEPLOYMENT.md** | Complete documentation |

---

## ⚡ Quick Deployment (5 minutes)

```bash
# 1. Make executable
chmod +x quick-start.sh

# 2. Run deployment
./quick-start.sh

# 3. Access your app
# http://localhost (or http://[tailscale-ip])
```

**That's it!** The script handles everything:
- ✅ Prerequisites check
- ✅ File setup
- ✅ Environment configuration
- ✅ Security (auto-generated passwords)
- ✅ Docker build
- ✅ Service startup
- ✅ Database initialization
- ✅ Health check

---

## 🎯 What You Get

### Stack
- **Frontend:** React + Vite + Nginx (production optimized)
- **Backend:** Django + Gunicorn + PostgreSQL + Redis
- **Networking:** Tailscale (secure remote access)
- **Monitoring:** Health checks + automated backups

### Features
- ✅ Production-grade Docker setup
- ✅ SSL/HTTPS ready
- ✅ Secure environment variables
- ✅ Auto-generated passwords
- ✅ Database migrations
- ✅ Static file serving
- ✅ Nginx reverse proxy
- ✅ Tailscale VPN
- ✅ Automated backups (daily)
- ✅ Health monitoring
- ✅ One-click restore

---

## 📋 Prerequisites

### Required
- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 20GB disk space

### Optional
- Tailscale account (free)
- Domain name (for public access)
- SSL certificate (Let's Encrypt)

---

## 🔧 Manual Deployment (Step-by-Step)

### Step 1: Copy Files

```bash
cd ~/Desktop/ProjextPal

# Copy all production files
cp /path/to/production/* ./

# Move Dockerfiles
mv Dockerfile.frontend.prod frontend/Dockerfile.prod
mv Dockerfile.backend.prod backend/Dockerfile.prod

# Move Nginx configs
mkdir -p frontend/nginx-config
mv nginx.conf frontend/nginx-config/
mv default.conf frontend/nginx-config/
```

### Step 2: Environment Setup

```bash
# Create environment file
cp .env.production.template .env.production

# Generate secure passwords
python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'  # Django secret
openssl rand -base64 32  # Database password
openssl rand -base64 32  # Redis password

# Edit .env.production with your values
nano .env.production
```

### Step 3: Tailscale (Optional)

```bash
chmod +x setup-tailscale.sh
./setup-tailscale.sh

# Get your auth key from:
# https://login.tailscale.com/admin/settings/keys

# Add to .env.production:
# TAILSCALE_AUTHKEY=tskey-auth-xxxxx
```

### Step 4: Build & Deploy

```bash
# Build images
docker-compose -f docker-compose.production.yml build

# Start services
docker-compose -f docker-compose.production.yml up -d

# Run migrations
docker-compose -f docker-compose.production.yml exec backend python manage.py migrate

# Collect static files
docker-compose -f docker-compose.production.yml exec backend python manage.py collectstatic --noinput

# Create superuser
docker-compose -f docker-compose.production.yml exec backend python manage.py createsuperuser
```

### Step 5: Verify

```bash
# Run health check
chmod +x health-check.sh
./health-check.sh

# View logs
docker-compose -f docker-compose.production.yml logs -f

# Check status
docker-compose -f docker-compose.production.yml ps
```

---

## 🔐 Tailscale Setup

### Why Tailscale?
- **Secure:** End-to-end encrypted VPN
- **Easy:** No firewall/port forwarding
- **Free:** For personal use
- **Access:** Share with team securely

### Setup

```bash
# 1. Run setup script
./setup-tailscale.sh

# 2. Get auth key
# https://login.tailscale.com/admin/settings/keys

# 3. Add to .env.production
# TAILSCALE_AUTHKEY=tskey-auth-xxxxx-yyyyy

# 4. Restart services
docker-compose -f docker-compose.production.yml restart
```

### Access
```
http://[your-device-name].ts.net
https://[your-device-name].ts.net  # With Tailscale HTTPS
```

---

## 🛡️ Security

### Auto-Generated
- ✅ Django SECRET_KEY
- ✅ Database password
- ✅ Redis password

### Recommended
- ✅ Change default ports
- ✅ Enable SSL/HTTPS
- ✅ Use strong passwords
- ✅ Enable firewall
- ✅ Regular backups
- ✅ Update regularly

---

## 💾 Backups

### Automated Backup

```bash
# Setup daily backups (2 AM)
chmod +x backup.sh

# Add to crontab
(crontab -l; echo "0 2 * * * /path/to/backup.sh") | crontab -

# Manual backup
./backup.sh
```

### Restore

```bash
chmod +x restore.sh
./restore.sh

# Follow prompts to select backup
```

---

## 🏥 Health Monitoring

```bash
# Manual check
./health-check.sh

# Automated monitoring (every hour)
(crontab -l; echo "0 * * * * /path/to/health-check.sh >> /var/log/projextpal-health.log") | crontab -
```

---

## 🚀 Common Commands

```bash
# View logs
docker-compose -f docker-compose.production.yml logs -f

# View specific service
docker-compose -f docker-compose.production.yml logs -f backend

# Stop services
docker-compose -f docker-compose.production.yml stop

# Start services
docker-compose -f docker-compose.production.yml start

# Restart
docker-compose -f docker-compose.production.yml restart

# Rebuild
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up -d

# Execute commands
docker-compose -f docker-compose.production.yml exec backend python manage.py shell

# Access container
docker-compose -f docker-compose.production.yml exec backend bash
```

---

## 🆘 Troubleshooting

### Services not starting
```bash
docker-compose -f docker-compose.production.yml logs
docker-compose -f docker-compose.production.yml build --no-cache
```

### Database errors
```bash
docker-compose -f docker-compose.production.yml exec backend python manage.py check --database default
docker-compose -f docker-compose.production.yml restart postgres
```

### Tailscale not connecting
```bash
docker-compose -f docker-compose.production.yml logs tailscale
docker-compose -f docker-compose.production.yml restart tailscale
```

### Permission errors
```bash
sudo chown -R $USER:$USER ~/Desktop/ProjextPal
```

---

## 📊 Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost/api/v1/ |
| Admin Panel | http://localhost/admin/ |
| Tailscale | http://[device].ts.net |
| Health Check | http://localhost/health |

---

## 🎯 Performance

### Included Optimizations
- ✅ Multi-stage Docker builds (smaller images)
- ✅ Nginx caching + gzip
- ✅ Gunicorn with multiple workers
- ✅ Redis caching
- ✅ PostgreSQL connection pooling
- ✅ Static file serving (CDN-ready)

### Recommendations
- **RAM:** 8GB for production
- **CPU:** 2+ cores
- **Disk:** SSD preferred
- **Network:** Stable internet

---

## 📚 Documentation

- **PRODUCTION-DEPLOYMENT.md** - Complete guide
- **README.md** - This file
- **Docker Compose comments** - Inline documentation

---

## 📞 Support

### Resources
- Documentation: PRODUCTION-DEPLOYMENT.md
- Health Check: ./health-check.sh
- Logs: docker-compose logs

### Common Issues
See PRODUCTION-DEPLOYMENT.md "Troubleshooting" section

---

**Version:** 1.0  
**Date:** 2025-01-22  
**Status:** ✅ Production Ready

---

## 🎉 Quick Start Checklist

- [ ] Run `chmod +x quick-start.sh`
- [ ] Run `./quick-start.sh`
- [ ] Access http://localhost
- [ ] Login to admin panel
- [ ] Configure Tailscale (optional)
- [ ] Setup automated backups
- [ ] Enable SSL (recommended)
- [ ] Test health monitoring

**Done!** You're in production! 🚀
