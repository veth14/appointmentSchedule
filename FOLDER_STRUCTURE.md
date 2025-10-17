# 📁 Project Folder Structure

## Doctor Meeting Schedule Tracker - Clean Folder Organization

```
appointmentSystem/
│
├── 📁 app/                          # Next.js 15 App Router
│   ├── 📁 dashboard/                # Dashboard page route
│   │   └── page.tsx                 # Main dashboard view
│   │
│   ├── 📁 api/                      # API Routes
│   │   ├── 📁 meetings/             # Meeting endpoints
│   │   │   └── route.ts             # GET, POST, PUT, DELETE meetings
│   │   │
│   │   └── 📁 hospitals/            # Hospital endpoints
│   │       └── route.ts             # GET, POST, PUT, DELETE hospitals
│   │
│   ├── layout.tsx                   # Root layout component
│   ├── page.tsx                     # Home page (redirects to dashboard)
│   └── globals.css                  # Global Tailwind CSS styles
│
├── 📁 components/                   # React Components
│   ├── 📁 ui/                       # Reusable UI components
│   │   ├── StatusBadge.tsx          # Status indicator (Done/Scheduled/Canceled)
│   │   ├── Button.tsx               # Custom button component
│   │   └── Modal.tsx                # Modal wrapper component
│   │
│   ├── MeetingCard.tsx              # Individual meeting display card
│   ├── MeetingFormModal.tsx         # Add/Edit meeting form
│   ├── WeekNavigation.tsx           # Week navigation controls
│   ├── FilterSearchBar.tsx          # Search and filter component
│   └── WeeklySummaryCard.tsx        # Weekly statistics display
│
├── 📁 lib/                          # Library & Utilities
│   ├── 📁 services/                 # Service layer for data operations
│   │   ├── meetingsService.ts       # Meeting CRUD operations
│   │   └── hospitalsService.ts      # Hospital CRUD operations
│   │
│   ├── 📁 utils/                    # Utility functions
│   │   ├── dateHelpers.ts           # Date formatting & calculations
│   │   ├── validators.ts            # Form validation functions
│   │   └── mockData.ts              # Mock data generators
│   │
│   └── firebase.ts                  # Firebase configuration (optional)
│
├── 📁 types/                        # TypeScript Type Definitions
│   ├── index.ts                     # Main type exports
│   ├── meeting.ts                   # Meeting-related types
│   └── hospital.ts                  # Hospital-related types
│
├── 📁 hooks/                        # Custom React Hooks
│   ├── useMeetings.ts               # Hook for meeting operations
│   ├── useHospitals.ts              # Hook for hospital operations
│   └── useWeekNavigation.ts         # Hook for week navigation logic
│
├── 📁 constants/                    # Application Constants
│   ├── statusConfig.ts              # Status configuration (colors, labels)
│   └── appConfig.ts                 # General app configuration
│
├── 📁 styles/                       # Additional Styles (if needed)
│   └── theme.css                    # Custom theme variables
│
├── 📁 config/                       # Configuration Files
│   └── firebaseConfig.ts            # Firebase setup (optional)
│
├── 📁 public/                       # Static Assets
│   ├── 📁 images/                   # Images and icons
│   └── favicon.ico                  # Favicon
│
├── 📁 docs/                         # Documentation
│   ├── API.md                       # API documentation
│   ├── SETUP.md                     # Setup instructions
│   └── FEATURES.md                  # Feature documentation
│
├── 📄 .env.local.example            # Environment variables template
├── 📄 .gitignore                    # Git ignore rules
├── 📄 .eslintrc.json                # ESLint configuration
├── 📄 next.config.ts                # Next.js configuration
├── 📄 tailwind.config.ts            # Tailwind CSS v3 configuration
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 postcss.config.js             # PostCSS configuration
├── 📄 package.json                  # Dependencies and scripts
├── 📄 README.md                     # Main documentation
├── 📄 QUICKSTART.md                 # Quick start guide
└── 📄 NO_FIREBASE_SETUP.md          # No-Firebase setup guide
```

---

## 📋 Folder Descriptions

### **app/** - Next.js 15 App Router
- Main application routes and pages
- Uses Next.js 15 App Router architecture
- Contains both pages and API routes

### **components/** - React Components
- All reusable UI components
- Organized by feature and purpose
- `ui/` subfolder for generic UI elements

### **lib/** - Core Business Logic
- Service layer for data operations
- Utility functions and helpers
- Firebase configuration (optional)

### **types/** - TypeScript Definitions
- All TypeScript interfaces and types
- Organized by domain (meetings, hospitals)
- Ensures type safety across the app

### **hooks/** - Custom React Hooks
- Reusable stateful logic
- Data fetching and manipulation
- UI state management

### **constants/** - Application Constants
- Configuration objects
- Status codes and mappings
- App-wide constants

### **styles/** - Additional Styles
- Custom CSS beyond Tailwind
- Theme variables
- Global style overrides

### **config/** - Configuration
- App configuration files
- Environment-specific settings
- Third-party service configs

### **public/** - Static Assets
- Images, icons, fonts
- Static files served directly
- Favicon and manifest

### **docs/** - Documentation
- API documentation
- Setup guides
- Feature specifications

---

## 🎯 File Organization Principles

1. **Separation of Concerns** - Clear boundaries between UI, logic, and data
2. **Modularity** - Each folder has a specific purpose
3. **Scalability** - Easy to add new features without restructuring
4. **Maintainability** - Consistent organization makes code easy to find
5. **Type Safety** - Dedicated types folder for TypeScript definitions

---

## 🚀 Next Steps

Now that the folder structure is ready, you can:

1. Create TypeScript type definitions in `types/`
2. Build reusable components in `components/`
3. Implement service layer in `lib/services/`
4. Add custom hooks in `hooks/`
5. Create pages and routes in `app/`

**The foundation is set! Ready to build your Doctor Meeting Schedule Tracker! 🎉**
