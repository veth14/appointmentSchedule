# Sample Hospital Data

Copy and paste these sample hospitals into your Firestore `hospitals` collection.

## How to Add:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to your project
3. Click on **Firestore Database**
4. Create a collection called `hospitals`
5. Click **Add Document** and use Auto-ID
6. Add each field manually or use the Firebase Admin SDK

---

## Sample Hospitals

### Hospital 1: St. Mary's Medical Center
```json
{
  "name": "St. Mary's Medical Center",
  "address": "123 Medical Center Drive",
  "city": "New York",
  "coordinates": {
    "lat": 40.7580,
    "lng": -73.9855
  }
}
```

### Hospital 2: City General Hospital
```json
{
  "name": "City General Hospital",
  "address": "456 Healthcare Boulevard",
  "city": "Los Angeles",
  "coordinates": {
    "lat": 34.0522,
    "lng": -118.2437
  }
}
```

### Hospital 3: Memorial Medical Center
```json
{
  "name": "Memorial Medical Center",
  "address": "789 Memorial Way",
  "city": "Chicago",
  "coordinates": {
    "lat": 41.8781,
    "lng": -87.6298
  }
}
```

### Hospital 4: University Hospital
```json
{
  "name": "University Hospital",
  "address": "321 University Avenue",
  "city": "Boston",
  "coordinates": {
    "lat": 42.3601,
    "lng": -71.0589
  }
}
```

### Hospital 5: Community Health Center
```json
{
  "name": "Community Health Center",
  "address": "555 Community Street",
  "city": "San Francisco",
  "coordinates": {
    "lat": 37.7749,
    "lng": -122.4194
  }
}
```

### Hospital 6: Regional Medical Center
```json
{
  "name": "Regional Medical Center",
  "address": "888 Regional Parkway",
  "city": "Miami",
  "coordinates": {
    "lat": 25.7617,
    "lng": -80.1918
  }
}
```

### Hospital 7: Valley View Hospital
```json
{
  "name": "Valley View Hospital",
  "address": "999 Valley View Road",
  "city": "Seattle",
  "coordinates": {
    "lat": 47.6062,
    "lng": -122.3321
  }
}
```

### Hospital 8: Sunrise Medical Center
```json
{
  "name": "Sunrise Medical Center",
  "address": "222 Sunrise Boulevard",
  "city": "Phoenix",
  "coordinates": {
    "lat": 33.4484,
    "lng": -112.0740
  }
}
```

---

## Quick Add via Firebase Console

1. In Firestore, click **Start Collection**
2. Collection ID: `hospitals`
3. For each hospital:
   - Click **Add Document**
   - Click **Auto-ID** for Document ID
   - Add fields as shown above
   - Make sure `coordinates` is a **Map** type with `lat` and `lng` as **numbers**
   - Click **Save**

---

## Note on Timestamps

Firebase will automatically add `createdAt` and `updatedAt` timestamps when you use the hospital management features in the app. For initial seeding, you can omit these fields.
