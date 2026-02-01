# 📱 App Store Submission Checklist

## ✅ VEREISTE ITEMS

### Screenshots (Required)
- [ ] iPhone 6.7" Display (iPhone 14 Pro Max) - 3-10 screenshots
- [ ] iPhone 6.5" Display (iPhone 11 Pro Max) - 3-10 screenshots  
- [ ] Optional: iPad screenshots

**Hoe screenshots maken:**
1. Open Simulator (iPhone 14 Pro Max)
2. Open de app
3. Navigeer naar mooie screens:
   - Login/Landing
   - Dashboard/Home
   - Projects lijst
   - Project detail
   - AI Assistant
   - Profile/Settings
4. Cmd + S voor screenshot
5. Repeat voor iPhone 11 Pro Max

### App Metadata (In App Store Connect)
- [ ] **App Name**: ProjeXtPal
- [ ] **Subtitle**: Project Management Excellence (max 30 chars)
- [ ] **Description**: 
```
ProjeXtPal - AI-Powered Project Management

Transform your project management with ProjeXtPal, the intelligent platform that combines powerful project tools with AI assistance.

KEY FEATURES:
- 📊 Program & Project Management - Manage multiple programs and projects
- 🤖 AI Assistant - Get intelligent suggestions and insights
- ⏱️ Time Tracking - Accurate time and resource tracking
- 📈 Real-time Dashboards - Visual progress and status monitoring
- 📚 Academy - Learn project management methodologies
- 💰 Budget Management - Financial planning and tracking
- ⚠️ Risk Management - Identify and manage project risks
- 👥 Team Collaboration - Effective workflows and communication

METHODOLOGIES SUPPORTED:
- PRINCE2
- Agile & Scrum
- Kanban
- Waterfall
- Hybrid approaches
- MSP (Managing Successful Programmes)

Perfect for:
- Project Managers
- Programme Managers
- Team Leaders
- Consultants
- Students learning PM

Download ProjeXtPal today and experience the future of project management!
```

- [ ] **Keywords**: project management, agile, scrum, kanban, AI assistant, time tracking, project planner, programme management, PRINCE2
- [ ] **Support URL**: https://projextpal.com/support (maak deze pagina)
- [ ] **Marketing URL**: https://projextpal.com
- [ ] **Privacy Policy URL**: https://projextpal.com/privacy (BELANGRIJK!)

### Promotional Text (Optional)
```
🚀 NEW: AI-Powered project insights and recommendations!
Manage projects smarter with intelligent assistance.
```

### App Review Information
- [ ] **Contact Email**: support@projextpal.com
- [ ] **Contact Phone**: +31 [YOUR_NUMBER]
- [ ] **Demo Account** (for Apple reviewers):
  - Email: demo@projextpal.com
  - Password: [STRONG_PASSWORD]
  
### Rating
- [ ] **Age Rating**: 4+ (No objectionable content)

### Pricing
- [ ] **Price**: FREE (or paid if applicable)

---

## 🎯 PRODUCTION URL UPDATE

### Update mobile app voor productie:
```typescript
// mobile/src/services/api.ts
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? Platform.OS === 'ios' 
      ? 'http://localhost:8001'
      : 'http://192.168.76.240:8001'
    : 'https://api.projextpal.com',  // ← Update this when ready
  // ...
};
```

### Build nieuwe versie:
```bash
cd mobile
eas build --platform ios --profile production
```

---

## 📋 SUBMISSION STEPS

1. ✅ Upload screenshots in App Store Connect
2. ✅ Fill in all metadata
3. ✅ Setup backend server
4. ✅ Configure production URL
5. ✅ Build production version
6. ✅ Create demo account for reviewers
7. ✅ Click "Add for Review"
8. ⏳ Wait for Apple review (1-7 days)
9. 🎉 App goes live!

---

## 💰 COSTS

| Item | Cost |
|------|------|
| Server (Hetzner) | €4/maand |
| Domain (already have) | €0 |
| SSL Certificate | €0 (Let's Encrypt) |
| Apple Developer | €99/jaar (already paid) |
| **Total** | **~€50/jaar** |

---

## ⏱️ TIMELINE

| Task | Time |
|------|------|
| Server setup | 2 hours |
| Screenshots maken | 1 hour |
| Metadata invullen | 1 hour |
| Production build | 30 min |
| Submit for review | 15 min |
| Apple review wait | 1-7 days |
| **Total** | **2-8 days** |
