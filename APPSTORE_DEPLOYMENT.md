# 📱 ProjeXtPal App Store Deployment Checklist

## 🔧 STAP 1: Backend Server (Voorlopig)

### Server Requirements
- [ ] VPS Server (Hetzner/DigitalOcean/AWS)
- [ ] Ubuntu 22.04 LTS
- [ ] 2GB RAM minimum
- [ ] 2 vCPU
- [ ] 50GB SSD
- [ ] Amsterdam datacenter (snelheid voor NL gebruikers)

### Server Setup
```bash
# SSH naar server
ssh root@YOUR_SERVER_IP

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Setup firewall
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

### Deploy Backend
1. Copy docker-compose.production.yml naar server
2. Setup SSL certificate (Let's Encrypt)
3. Configure nginx reverse proxy
4. Start containers

### DNS Configuration (Voorlopig)
```
Type: A
Name: api-test.projextpal.com (of iets anders)
Content: YOUR_SERVER_IP
TTL: Auto
```

---

## 📱 STAP 2: Mobile App Production Build

### Update app.json
```json
{
  "expo": {
    "name": "ProjeXtPal",
    "slug": "projextpal",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.inclufy.projextpal",
      "buildNumber": "1",
      "supportsTablet": true,
      "infoPlist": {
        "NSCameraUsageDescription": "Voor profiel foto's",
        "NSPhotoLibraryUsageDescription": "Voor project documenten"
      }
    }
  }
}
```

### Update Production URL
```typescript
// mobile/src/services/api.ts
BASE_URL: __DEV__ 
  ? Platform.OS === 'ios' 
    ? 'http://localhost:8001'
    : 'http://192.168.76.240:8001'
  : 'https://api-test.projextpal.com',  // Voorlopige productie URL
```

### Build Commands
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios --profile production
```

---

## 🍎 STAP 3: App Store Submission

### Vereisten
- [ ] Apple Developer Account ($99/jaar)
- [ ] App Store Connect toegang
- [ ] App iconen (alle maten)
- [ ] Screenshots (verschillende iPhone maten)
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] App beschrijving (NL + EN)

### App Store Connect Setup
1. Create new app in App Store Connect
2. Fill in metadata (naam, beschrijving, keywords)
3. Upload screenshots
4. Set pricing (gratis/betaald)
5. Add privacy policy
6. Submit for review

### TestFlight Beta Testing (Optioneel maar aangeraden)
```bash
# Build voor TestFlight
eas build --platform ios --profile preview

# Upload wordt automatisch gedaan door EAS
# Deel TestFlight link met beta testers
```

---

## 🔄 STAP 4: Later - Switch naar api.projextpal.com

### DNS Update
```
Type: A
Name: api.projextpal.com
Content: YOUR_FINAL_SERVER_IP
TTL: Auto
```

### Update Mobile App
```typescript
BASE_URL: __DEV__ 
  ? Platform.OS === 'ios' 
    ? 'http://localhost:8001'
    : 'http://192.168.76.240:8001'
  : 'https://api.projextpal.com',  // Finale productie URL
```

### Submit Update
```bash
# Bump version in app.json
"version": "1.0.1"

# Build nieuwe versie
eas build --platform ios --profile production

# Submit via App Store Connect
```

---

## 📊 Kosten Overzicht

| Item | Kosten |
|------|--------|
| Apple Developer Account | €99/jaar |
| VPS Server (Hetzner) | €4-10/maand |
| Domain (als nieuw) | €10/jaar |
| SSL Certificate | Gratis (Let's Encrypt) |
| **Totaal eerste jaar** | **~€150** |

---

## ⏱️ Timeline

| Fase | Tijd |
|------|------|
| Server setup | 2-4 uur |
| Mobile app configuratie | 1-2 uur |
| App Store submission | 1-2 uur |
| Apple review | 1-7 dagen |
| **Totaal** | **2-7 dagen** |
