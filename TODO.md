# TODO: Update React Native Expo App for Real-Device Testing

## Tasks

- [ ] Update services/bookingService.ts: Remove hardcoded localhost fallback from API_BASE_URL
- [ ] Update frontend .env.example: Ensure EXPO_PUBLIC_BACKEND_URL=https://your-ngrok-url.ngrok.io/api
- [ ] Create backend/.env.example with MONGODB_URI, PORT, JWT_SECRET
- [ ] Update backend/server.js: Change default MONGODB_URI to 'mongodb://127.0.0.1:27017/booking'
- [ ] Update TODO.md: Add comprehensive real-device testing instructions with ngrok and APK setup

## Real-Device Testing Setup

1. **Set up backend environment:**

   - Copy `backend/.env.example` to `backend/.env`
   - Update with your MongoDB URI and JWT secret

2. **Run backend locally:**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   Expected: "✅ MongoDB connected successfully" and "Server running on port 5000"

3. **Expose backend with ngrok:**

   ```bash
   # Install ngrok if needed
   npm install -g ngrok
   # Expose port 5000
   ngrok http 5000
   ```

   Copy the HTTPS URL (e.g., https://abc123.ngrok.io)

4. **Update frontend environment:**

   - Copy `.env.example` to `.env`
   - Set `EXPO_PUBLIC_BACKEND_URL=https://abc123.ngrok.io/api`

5. **Build APK:**

   ```bash
   npx expo build:android
   ```

   Or for development build:

   ```bash
   npx expo run:android --variant release
   ```

6. **Install and test on device:**
   - Transfer APK to Android device
   - Install APK
   - Test booking flow: Select trip → Choose seats → Enter passenger info → Book → Pay → Generate QR ticket
   - Verify booking requests reach backend via ngrok (check backend logs for API calls)

## Verification

- [ ] Backend starts successfully with new .env
- [ ] Ngrok exposes port 5000 with HTTPS URL
- [ ] Frontend uses ngrok URL for API calls
- [ ] APK builds without errors
- [ ] Booking button press sends request to backend via ngrok
- [ ] Backend logs show incoming booking requests with correct payload
- [ ] Full booking flow works on physical device
