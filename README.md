# 🌿 Urban Heat Monitoring & Cooling Platform
**Full-Stack Municipal Environmental Platform**

A minimal, robust, and modern MERN full-stack web application that monitors heat hotspots, green cover, weather stations, and cooling initiatives to support sustainable urban planning.

---

## 🚀 Tech Stack

- **MongoDB**: Document database storing environmental collections (`users`, `hotspots`, `greenCover`, `weatherStations`, `coolingInitiatives`).
- **Express.js**: RESTful API backend handling CRUD operations, summary analytics, and CSV exports.
- **React.js**: Clean, responsive, and environment-themed single page application using Vite & React Router.
- **Node.js**: JavaScript runtime powering the server.
- **Axios**: HTTP client for seamless client-to-server API communication.
- **Chart.js (`react-chartjs-2`)**: Data visualizations for heat hotspots, green canopy coverage, and initiative distribution.
- **Leaflet.js**: Spatial map visualization displaying color-coded hotspot locations.

---

## 📂 Project Architecture

```
urban-heat-monitoring/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & auto-seeding
│   ├── controllers/
│   │   ├── authController.js     # Demo authentication
│   │   ├── hotspotController.js  # Hotspots CRUD
│   │   ├── greenCoverController.js # Green cover CRUD
│   │   ├── weatherStationController.js # Weather stations CRUD
│   │   ├── coolingInitiativeController.js # Cooling initiatives CRUD
│   │   └── reportController.js   # Analytics summary & CSV export
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Hotspot.js            # Hotspot schema (with lat/lng)
│   │   ├── GreenCover.js         # Green cover schema
│   │   ├── WeatherStation.js     # Weather station schema
│   │   ├── CoolingInitiative.js  # Cooling initiative schema
│   │   ├── storeAdapter.js       # Auto fallback memory adapter
│   │   └── index.js              # Models export
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── hotspotRoutes.js
│   │   ├── greenCoverRoutes.js
│   │   ├── weatherStationRoutes.js
│   │   ├── coolingInitiativeRoutes.js
│   │   └── reportRoutes.js
│   ├── seed/
│   │   └── seedData.js           # 5 hotspots, 5 green cover, 4 stations, 5 initiatives
│   ├── .env                      # Environment config (PORT, MONGODB_URI)
│   ├── package.json
│   └── server.js                 # Express server entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx       # Environmental sidebar navigation
    │   │   ├── Navbar.jsx        # Live monitoring status bar
    │   │   ├── StatCard.jsx      # Metric cards
    │   │   └── Modal.jsx         # Accessible Add/Edit/View modal
    │   ├── pages/
    │   │   ├── Login.jsx         # Demo login with one-click auto-fill
    │   │   ├── Dashboard.jsx     # 5 cards + 2 charts + Leaflet map
    │   │   ├── HeatHotspots.jsx  # Hotspots table (CRUD) + Leaflet map
    │   │   ├── GreenCover.jsx    # Green cover table (CRUD) + Chart.js
    │   │   ├── WeatherStations.jsx # Weather stations table (CRUD)
    │   │   ├── CoolingInitiatives.jsx # Cooling initiatives table (CRUD)
    │   │   └── Reports.jsx       # 6 stats + 2 charts + CSV download
    │   ├── services/
    │   │   └── api.js            # Axios endpoints service
    │   ├── App.jsx               # React Router configuration
    │   ├── main.jsx              # React DOM render root
    │   └── index.css             # Environment dashboard styles
    ├── index.html
    └── package.json
```

---

## 🔑 Demo Credentials

- **Email**: `admin@gmail.com`
- **Password**: `admin123`
*(Auto-fill button is also provided on the login page for quick demonstration)*

---

## ⚙️ How to Run the Application

### Prerequisites
- **Node.js** (v16+ recommended, tested on Node v24)
- **MongoDB** (Local instance or MongoDB Atlas URI; if MongoDB is not running, the application includes an automatic fallback memory database so you can demo immediately without errors!)

---

### Step 1: Start the Backend Server

Open a terminal window:

```bash
cd backend
npm install   # If not already installed
npm start
```

Backend will run on **http://localhost:5000**.
Sample data (5 hotspots, 5 green cover, 4 weather stations, 5 cooling initiatives, and demo user) will be loaded automatically!

---

### Step 2: Start the Frontend Application

Open a second terminal window:

```bash
cd frontend
npm install   # If not already installed
npm run dev
```

The frontend development server will launch (typically on **http://localhost:5173**).

Open your browser to:
👉 **`http://localhost:5173`**

---

## 📋 Complete Project Demonstration Flow

1. **Login Page (`/login`)**:
   - Enter `admin@gmail.com` and `admin123` (or click "Auto-fill Credentials").
   - Click "Sign In to Dashboard".
2. **Dashboard (`/dashboard`)**:
   - Inspect the **5 environmental metric cards** (Total Hotspots, Avg Temperature, Green Cover %, Active Weather Stations, Active Cooling Initiatives).
   - View the **Heat Hotspot Temperature Bar Chart**.
   - View the **Green Cover by Location Bar Chart**.
   - Interact with the **Spatial Heatmap (Leaflet.js)**: click on markers to view temperature and severity popup information.
3. **Heat Hotspots (`/hotspots`)**:
   - View the data table with Location, Temperature, Severity badge, and Date.
   - Click **Add Hotspot** to create a new hotspot with latitude and longitude.
   - Click **Edit** to modify temperature or severity.
   - Click **View** to inspect details in a modal.
   - Click **Delete** to delete a hotspot record.
   - Notice the Leaflet heatmap below the table updates in real time!
4. **Green Cover (`/green-cover`)**:
   - View urban canopy coverage and tree density table.
   - Add/Edit/View/Delete green cover records.
   - View the comparative **Chart.js** green cover bar chart.
5. **Weather Stations (`/weather-stations`)**:
   - View automated microclimate station records (Station Name, Location, Temperature, Humidity, Status).
   - Add/Edit/View/Delete weather stations.
6. **Cooling Initiatives (`/cooling-initiatives`)**:
   - View municipal heat mitigation projects (Tree Plantation, Cool Roof, Public Park, Water Mist Station).
   - Manage initiative statuses (Planned, Ongoing, Completed).
   - Add/Edit/View/Delete cooling initiatives.
7. **Reports & Analytics (`/reports`)**:
   - View the 6 aggregated environmental summary statistics.
   - View the **Hotspot Severity Distribution Doughnut Chart**.
   - View the **Cooling Initiatives Status Breakdown Bar Chart**.
   - Click **Download Report (CSV)** to generate and download a comprehensive CSV report containing all datasets for submission.
