# 🚀 Quick Start Guide

Get your Doctor Meeting Schedule Tracker up and running in 5 minutes!

## ✅ Step 1: Install Dependencies

Dependencies are already installed! If you need to reinstall:

```bash
npm install
```

## ✅ Step 2: Set Up Firebase

### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Follow the setup wizard

### Enable Firestore

1. In your Firebase project, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location close to you
5. Click **"Enable"**

### Get Your Firebase Config

1. In Firebase Console, click the **gear icon** ⚙️ > **Project settings**
2. Scroll down to **"Your apps"**
3. Click the **web icon** `</>`
4. Register your app (name it "Doctor Meeting Tracker")
5. Copy the `firebaseConfig` object

## ✅ Step 3: Configure Environment Variables

1. In the project root, copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and paste your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

## ✅ Step 4: Add Sample Hospitals

### Option A: Via Firebase Console (Recommended)

1. Go to **Firestore Database** in Firebase Console
2. Click **"Start collection"**
3. Collection ID: `hospitals`
4. Click **"Add document"** and use **Auto-ID**
5. Add these fields:
   - `name` (string): `"St. Mary's Medical Center"`
   - `address` (string): `"123 Medical Center Drive"`
   - `city` (string): `"New York"`
   - `coordinates` (map):
     - `lat` (number): `40.7580`
     - `lng` (number): `-73.9855`

6. Repeat for more hospitals (see `SAMPLE_HOSPITALS.md` for examples)

### Option B: Add via the App

You can also add hospitals programmatically after launching the app by calling the `createHospital` function.

## ✅ Step 5: Run the Development Server

```bash
npm run dev
```

Open your browser and go to:
```
http://localhost:3000
```

## 🎉 You're Done!

You should now see the dashboard. Try:

1. ✅ **Add a meeting** - Click the "Add Meeting" button
2. 🔍 **Search** - Use the search bar to filter meetings
3. 📅 **Navigate** - Click Previous/Next Week buttons
4. ✏️ **Edit** - Click the pencil icon on any meeting card
5. 🗑️ **Delete** - Click the trash icon on any meeting card

---

## 🐛 Troubleshooting

### "Failed to load data" Error

**Problem**: Cannot connect to Firebase

**Solution**:
- Check that your `.env.local` file exists and has correct values
- Verify your Firebase project is active
- Make sure Firestore is enabled
- Check browser console for specific Firebase errors

### No Hospitals Showing in Dropdown

**Problem**: Hospital dropdown is empty

**Solution**:
- Make sure you've added at least one hospital to Firestore
- Check the collection name is exactly `hospitals` (lowercase, plural)
- Verify Firestore security rules allow read access

### Build Errors

**Problem**: TypeScript or build errors

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run dev
```

---

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [SAMPLE_HOSPITALS.md](SAMPLE_HOSPITALS.md) for more hospital examples
- Customize the app to fit your specific needs
- Deploy to [Vercel](https://vercel.com) for production use

---

**Need Help?** Check the Firebase Console for any error messages or review the browser's developer console (F12) for debugging information.
