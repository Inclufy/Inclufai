# 🚀 ProjeXtPal - Settings & Profile - Deployment Checklist

## ✅ Completed Features (Local)

### 1. Settings Page (/settings)
- ✅ Profile tab: Edit first_name & last_name
- ✅ Security tab: Change password + 2FA link
- ✅ Preferences tab: Language (NL/EN) + Theme (Light/Dark/Auto)

### 2. Profile Page (/profile)
- ✅ Display user info (name, email, role, status)
- ✅ Logout functionality

### 3. Signup Page (/signup)
- ✅ First Name + Last Name fields
- ✅ Email validation (checks existing users)
- ✅ Creates user + company
- ✅ Email verification flow

### 4. Navigation
- ✅ Profile link in sidebar
- ✅ Settings link in sidebar
- ✅ Both positioned above Admin Portal

## 📋 Files Changed

### Frontend
1. `frontend/src/lib/api.ts`
   - Added `put()` method to ApiClient class

2. `frontend/src/pages/Settings.tsx`
   - **NEW FILE** - Complete settings page with 3 tabs

3. `frontend/src/pages/Profile.tsx`
   - Existing file - already had profile page

4. `frontend/src/pages/Signup.tsx`
   - Fixed endpoint: /auth/signup/ → /auth/register/

5. `frontend/src/App.tsx`
   - Added Profile route: /profile
   - Added Settings route: /settings

6. `frontend/src/components/AppSidebar.tsx`
   - Added Profile link
   - Added Settings link

7. `frontend/.env`
   - Fixed: Only localhost URL for development
   - Production URL should be in .env.production

### Backend
1. `backend/accounts/serializers.py`
   - UpdateOwnProfileSerializer: Added last_name, removed image field
   - PublicAdminRegisterSerializer: Added last_name, fixed profile_image field

2. `backend/accounts/views.py`
   - UpdateOwnProfileView: Fixed user.image → user.profile_image (line 297)

## 🔧 Production Deployment Steps

### Option 1: SSH Access (When Available)
```bash
# 1. SSH to server
ssh root@31.20.137.168

# 2. Navigate to project
cd /root/projextpal

# 3. Pull latest code
git add .
git commit -m "Add Settings and Profile pages with full functionality"
git push origin main
git pull origin main

# 4. Rebuild and restart containers
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml build --no-cache backend frontend
docker-compose -f docker-compose.production.yml up -d

# 5. Check logs
docker-compose -f docker-compose.production.yml logs -f
```

### Option 2: Hetzner Cloud Console (Current)
1. Login to console.hetzner.cloud
2. Select server: projextpal-prod
3. Click "Console" button
4. Login as root
5. Follow commands from Option 1

## ⚠️ Important Production Notes

### 1. Email Verification
New signups have `is_active=False` by default. Users must verify email before login.

**For Development:** Auto-activate users
```python
# In backend/accounts/serializers.py, line ~163
is_active=True,  # Instead of False
```

**For Production:** Keep email verification
- Users receive verification email
- Must click link to activate account
- Check email settings in backend/.env

### 2. Environment Variables

**Frontend Production (.env.production):**
```bash
VITE_BACKEND_URL=https://api.projextpal.com/api/v1
```

**Frontend Development (.env):**
```bash
VITE_BACKEND_URL=http://localhost:8001/api/v1
```

### 3. Model Field Name
The CustomUser model uses `profile_image` (not `image`).
All serializers and views have been updated to use correct field name.

## 🧪 Testing Checklist

### Before Deployment
- [x] Settings page loads
- [x] Profile update works
- [x] Password change works
- [x] Language toggle works
- [x] Theme toggle works
- [x] Signup with first_name & last_name works
- [x] Email validation works
- [x] Profile page displays correctly

### After Production Deployment
- [ ] Test signup: https://projextpal.com/signup
- [ ] Verify email works
- [ ] Test login: https://projextpal.com/login
- [ ] Test settings: https://projextpal.com/settings
- [ ] Test profile: https://projextpal.com/profile
- [ ] Check sidebar links visible
- [ ] Test on mobile app

## 🎯 Next Steps (Optional Enhancements)

1. **Profile Image Upload**
   - Add upload UI in Settings
   - Use existing endpoint: /auth/user/image/

2. **Email Notifications**
   - Toggle in Settings → Preferences
   - Backend model field needed

3. **Session Management**
   - List active sessions
   - Remote logout

4. **Account Export**
   - Download user data (GDPR)

5. **Delete Account**
   - Self-service account deletion

## 📊 Current Status

**Environment:** Development ✅
**Status:** All features working locally
**Ready for Production:** YES ✅

**Blocked by:** SSH access to production server (port 22 timeout)
**Alternative:** Deploy via Hetzner Cloud Console

---

**Created:** 2026-01-25 10:28 CET
**Last Updated:** 2026-01-25 10:28 CET
**Version:** 1.0.0
