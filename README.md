# Reliability Analytics Dashboard

A modern, responsive analytics dashboard designed for local vendors to track delivery success, complaint patterns, response times, and overall reliability. Built during a 12-hour hackathon.

## Features
- **Platform Analytics:** Overview of average reliability, total complaints, and top performers.
- **Vendor Directory:** Searchable and sortable directory of vendors with visual reliability indicators.
- **Detailed Metrics:** Vendor-specific pie charts for order completion and line charts for weekly delivery trends.
- **Role-Based Views (Demo):** Toggle between Admin (platform view) and Vendor (specific vendor view) conceptually.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Recharts, React Router, Axios
- **Backend:** Node.js, Express, CORS
- **Data Storage:** Mock JSON files (for hackathon MVP)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. Clone this repository.
2. Install dependencies for the frontend and backend:
   ```bash
   npm install
   cd server
   npm install
   cd ..
   ```

### Running the App Locally

You will need to run the frontend and backend servers simultaneously.

**Terminal 1: Start the Backend (Express)**
```bash
cd server
node index.js
```
The backend will run on `http://localhost:5000`

**Terminal 2: Start the Frontend (Vite)**
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

Open `http://localhost:5173` in your browser to view the application.

## Data Structure
- `data/vendors.json`: Contains vendor objects with integrated `weeklyData`.
- `data/complaints.json`: Used for rendering platform-wide complaint analytics.

## Backend Routes
- `GET /api/vendors` - List all vendors with computed reliability scores
- `GET /api/vendors/:id` - Fetch single vendor with weekly historical data
- `GET /api/summary` - Platform-wide summary statistics
- `GET /api/stats/complaints` - Aggregated complaint data
- `GET /api/stats/deliveries` - Aggregated weekly delivery data
