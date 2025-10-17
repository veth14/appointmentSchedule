# 🏥 Doctor Meeting Schedule Tracker

A full-stack web application built with **Next.js 15**, **React 18**, **Tailwind CSS v3**, and **Firebase Firestore** for tracking and managing doctor meetings across multiple hospitals.

## 📋 Features

- **📅 Weekly Dashboard**: View all meetings for the week (Monday–Sunday)
- **➕ Meeting Management**: Add, edit, and delete doctor meetings
- **🔍 Search & Filter**: Find meetings by doctor name, hospital, or status
- **📊 Weekly Summary**: Track total, scheduled, completed, and canceled meetings
- **🎨 Status Color Coding**: 
  - 🟢 Done
  - 🟡 Scheduled
  - 🔴 Canceled
- **⏰ Overlap Detection**: Prevents scheduling conflicts for the same doctor
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **🏥 Hospital Management**: Maintain a list of hospitals with addresses

## 🚀 Tech Stack

- **Frontend**: Next.js 15 with App Router, React 18
- **Styling**: Tailwind CSS v3
- **Database**: Firebase Firestore
- **Date Handling**: Day.js
- **Icons**: Lucide React
- **Language**: TypeScript

## 📦 Installation

### Prerequisites

- Node.js 18+ installed
- Firebase account with a Firestore database

### Setup Steps

1. **Clone or navigate to the project directory**:
   ```bash
   cd appointmentSystem
   ```

2. **Dependencies are already installed**. If you need to reinstall:
   ```bash
   npm install
   ```

3. **Set up Firebase**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable **Firestore Database**
   - Go to Project Settings > General > Your apps
   - Copy your Firebase configuration

4. **Create environment file**:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Set up Firestore Collections**:
   
   Create two collections in your Firestore:
   
   **a) `hospitals` collection** - Add some sample hospitals:
   ```json
   {
     "name": "St. Mary's Hospital",
     "address": "123 Medical Center Dr",
     "city": "New York",
     "coordinates": {
       "lat": 40.7580,
       "lng": -73.9855
     }
   }
   ```

   **b) `meetings` collection** - This will be populated automatically when you add meetings via the UI

6. **Run the development server**:
   ```bash
   npm run dev
   ```

7. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
appointmentSystem/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page (redirects to dashboard)
├── components/
│   ├── FilterSearchBar.tsx    # Search and filter component
│   ├── MeetingCard.tsx        # Individual meeting card
│   ├── MeetingFormModal.tsx   # Add/edit meeting modal
│   ├── StatusBadge.tsx        # Status indicator component
│   ├── WeekNavigation.tsx     # Week navigation controls
│   └── WeeklySummaryCard.tsx  # Summary statistics
├── lib/
│   ├── firebase.ts            # Firebase configuration
│   ├── hospitalsService.ts    # Hospital CRUD operations
│   └── meetingsService.ts     # Meeting CRUD operations
├── types/
│   └── index.ts               # TypeScript type definitions
├── .env.local.example         # Environment variables template
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## 🎯 Usage

### Adding a Meeting

1. Click the **"Add Meeting"** button
2. Fill in the meeting details:
   - Doctor name
   - Select hospital from dropdown
   - Choose date and time
   - Add purpose/meeting type (optional)
   - Add notes (optional)
   - Set status (Scheduled/Done/Canceled)
3. Click **"Create Meeting"**

### Editing a Meeting

1. Click the **edit icon** (pencil) on any meeting card
2. Modify the details
3. Click **"Update Meeting"**

### Deleting a Meeting

1. Click the **delete icon** (trash) on any meeting card
2. Confirm the deletion

### Filtering Meetings

- Use the **search bar** to find meetings by doctor name or hospital
- Use the **status dropdown** to filter by Scheduled, Done, Canceled, or All

### Navigating Weeks

- Click **"Previous Week"** or **"Next Week"** to navigate
- Click **"Go to Current Week"** to return to the current week

## 🔧 Configuration

### Firestore Security Rules

Add these security rules to your Firestore (for development):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /meetings/{document} {
      allow read, write: if true;
    }
    match /hospitals/{document} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Note**: For production, implement proper authentication and security rules.

### Adding Sample Hospitals

You can add hospitals directly in Firestore or create a seed script. Example hospitals:

- St. Mary's Hospital
- City General Hospital
- Memorial Medical Center
- University Hospital
- Community Health Center

## 🎨 Design Features

- **Clean, minimal interface** with Tailwind CSS v3
- **Responsive grid layout** that adapts to screen size
- **Color-coded status badges** for quick visual identification
- **Smooth transitions** and hover effects
- **Card-based design** with subtle shadows
- **Today's date highlighted** with blue accent color

## 📝 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

## 🤝 Contributing

This is a personal project for **Ian Angelo Valmores**. Feel free to fork and customize for your needs.

## 📄 License

MIT License - Feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- Built with Next.js 15 and React 18
- Styled with Tailwind CSS v3
- Database powered by Firebase Firestore
- Icons from Lucide React
- Date utilities by Day.js

---

**Made with ❤️ for efficient doctor meeting management**
