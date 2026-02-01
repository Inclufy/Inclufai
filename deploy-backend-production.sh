#!/bin/bash

echo "🚀 ProjeXtPal Backend Production Deployment"
echo ""
echo "Server Requirements:"
echo "  - Ubuntu 22.04 LTS"
echo "  - 2GB RAM"
echo "  - Docker + Docker Compose"
echo "  - Domain: api-test.projextpal.com (voor nu)"
echo ""
echo "Options:"
echo "  1) Hetzner Cloud - €4/maand (Amsterdam)"
echo "  2) DigitalOcean - €6/maand (Amsterdam)"  
echo "  3) AWS Lightsail - $5/maand (eu-west-1)"
echo ""
read -p "Choose provider (1-3): " choice

case $choice in
  1)
    echo ""
    echo "✅ Hetzner Cloud Setup:"
    echo "1. Go to: https://console.hetzner.cloud"
    echo "2. Create new project: 'ProjeXtPal Production'"
    echo "3. Add server: CPX11 (2 vCPU, 2GB RAM, 40GB SSD) - €4.15/maand"
    echo "4. Location: Falkenstein (DE) or Helsinki (FI)"
    echo "5. Image: Ubuntu 22.04"
    echo "6. Add SSH key"
    echo ""
    echo "After server is created, run:"
    echo "  ssh root@YOUR_SERVER_IP"
    ;;
  2)
    echo ""
    echo "✅ DigitalOcean Setup:"
    echo "1. Go to: https://cloud.digitalocean.com"
    echo "2. Create Droplet"
    echo "3. Choose: Basic - Regular Intel (€6/maand)"
    echo "4. Location: Amsterdam"
    echo "5. Image: Ubuntu 22.04 LTS"
    echo "6. Add SSH key"
    ;;
  3)
    echo ""
    echo "✅ AWS Lightsail Setup:"
    echo "1. Go to: https://lightsail.aws.amazon.com"
    echo "2. Create instance"
    echo "3. Location: Frankfurt (eu-central-1)"
    echo "4. Platform: Linux/Unix"
    echo "5. Blueprint: Ubuntu 22.04"
    echo "6. Plan: $5/month (1GB RAM)"
    ;;
esac

echo ""
echo "📋 After server is ready, save this script to server and run:"
cat > /tmp/server-setup.sh << 'SERVERSCRIPT'
#!/bin/bash

# ProjeXtPal Backend Server Setup Script

set -e

echo "🔧 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

echo "🔧 Installing Docker Compose..."
apt-get update
apt-get install -y docker-compose-plugin

echo "🔧 Installing Nginx..."
apt-get install -y nginx certbot python3-certbot-nginx

echo "🔒 Configuring Firewall..."
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

echo "✅ Server setup complete!"
echo ""
echo "Next steps:"
echo "1. Upload docker-compose.production.yml"
echo "2. Configure domain DNS"
echo "3. Setup SSL certificate"
echo "4. Start containers"
SERVERSCRIPT

cat /tmp/server-setup.sh

