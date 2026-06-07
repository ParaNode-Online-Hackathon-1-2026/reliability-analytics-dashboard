# Reliability Analytics Dashboard - Continuation Context

## Current Project

We are building a hackathon project called **Reliability Analytics Dashboard** for the ParaNode Online Hackathon.

The goal is to help hyperlocal vendors and marketplace admins track vendor reliability using delivery success, complaints, response time, ratings, and reliability scores.

One-line pitch:

> We give local vendors data to improve, not just complaints to ignore.

## Workspace

Use this folder as the project root:

```text
C:\Users\rishi\OneDrive\Documents\Paranode Hackathone
```

Do not create a separate outer project folder unless explicitly requested.

## GitHub Repository

Organization repo:

```text
https://github.com/ParaNode-Online-Hackathon-1-2026/reliability-analytics-dashboard.git
```

Suggested git commands:

```bash
git remote add origin https://github.com/ParaNode-Online-Hackathon-1-2026/reliability-analytics-dashboard.git
git branch -M main
git add .
git commit -m "initial project setup"
git push -u origin main
```

If `origin` already exists:

```bash
git remote set-url origin https://github.com/ParaNode-Online-Hackathon-1-2026/reliability-analytics-dashboard.git
```

Important:

- Do not run `git reset --hard`.
- Do not delete existing files without asking.
- If there are no project files yet, create the app first before committing.

## Tech Stack

Frontend:

- React
- Vite
- Tailwind CSS
- Recharts
- Axios
- React Router DOM

Backend:

- Node.js
- Express
- CORS

Data:

- Mock JSON only
- No real database for MVP

Deployment:

- Frontend: Vercel
- Backend: Render

Ports:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

## Required Project Structure

```text
reliability-dashboard/
├── data/
│   ├── vendors.json      ← includes weeklyData array per vendor
│   └── complaints.json   ← optional/simple complaint analytics file
├── server/
│   ├── index.js
│   └── routes/
│       ├── vendors.js
│       └── stats.js
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── SummaryCard.jsx
│   │   ├── VendorTable.jsx
│   │   ├── StatusBadge.jsx
│   │   └── ChartCard.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   └── VendorDetail.jsx
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

Because the current workspace folder itself is the root, create these folders directly inside:

```text
C:\Users\rishi\OneDrive\Documents\Paranode Hackathone
```

## Data Contract

Create exactly **10 vendors** in `data/vendors.json`.

Each vendor should include:

```json
{
  "id": "v001",
  "name": "SupplyCo",
  "reliabilityScore": 87,
  "status": "good",
  "totalOrders": 320,
  "completedOrders": 278,
  "failedOrders": 42,
  "deliveryRate": 86.9,
  "totalComplaints": 5,
  "avgResponseTime": 12,
  "rating": 4.2,
  "region": "North",
  "weeklyData": [
    { "day": "Mon", "deliveryRate": 85, "complaints": 1 },
    { "day": "Tue", "deliveryRate": 90, "complaints": 0 }
  ]
}
```

Required fields:

- `id`
- `name`
- `reliabilityScore`
- `status`
- `totalOrders`
- `completedOrders`
- `failedOrders`
- `deliveryRate`
- `totalComplaints`
- `avgResponseTime`
- `rating`
- `region`
- `weeklyData`

Weekly data must be embedded inside each vendor object.

Do not create a separate `deliveries.json` file.

Weekly data shape:

```json
[
  { "day": "Mon", "deliveryRate": 85, "complaints": 1 },
  { "day": "Tue", "deliveryRate": 90, "complaints": 0 }
]
```

## Reliability Score Logic

Formula:

```js
reliabilityScore = Math.round(
  (completedOrders / (completedOrders + failedOrders)) * 100
)
```

Status logic:

```text
Score > 80     → Good
Score 60–80    → Average
Score < 60     → Poor
```

Status can be returned as either `Good`, `Average`, `Poor` or lowercase equivalents, but frontend/backend should be consistent.

## Backend API Requirements

Backend runs on port `5000`.

Required endpoints:

```text
GET /api/vendors
GET /api/vendors/:id
GET /api/summary
```

Expected behavior:

### GET /api/vendors

Returns all 10 vendors with computed or included:

- `reliabilityScore`
- `status`
- `deliveryRate`
- `avgResponseTime`
- `rating`
- `totalComplaints`
- order fields
- region

### GET /api/vendors/:id

Returns one vendor, including:

- all core vendor fields
- `weeklyData`
- completed vs failed order data

### GET /api/summary

Returns:

```json
{
  "totalVendors": 10,
  "avgReliabilityScore": 84,
  "topPerformer": "Vendor Name",
  "totalComplaints": 32
}
```

Optional stats route file:

```text
routes/stats.js
├── GET /summary       → mounted as /api/summary
├── GET /complaints    → mounted as /api/stats/complaints
└── GET /deliveries    → mounted as /api/stats/deliveries
```

But the key required route is:

```text
GET /api/summary
```

## Frontend Requirements

Frontend runs on port `5173`.

Pages:

- `Dashboard.jsx`
- `VendorDetail.jsx`

Components:

- `Navbar`
- `SummaryCard`
- `VendorTable`
- `StatusBadge`
- `ChartCard`

Dashboard page must include:

- Total Vendors summary card
- Avg Reliability summary card
- Top Performer summary card
- Total Complaints summary card
- Bar chart for complaints per vendor
- Line chart for weekly delivery rate trend
- Vendor table
- Search filter by vendor name
- Sort by:
  - reliability score
  - complaints
  - rating
- Status badges:
  - Good = green
  - Average = yellow
  - Poor = red

Vendor detail page must include:

- Vendor name
- Reliability score badge
- Status badge
- Pie chart for completed vs failed orders
- Line chart using `weeklyData`
- SummaryCard - Avg Response Time using `avgResponseTime`
- SummaryCard - Rating using `rating`
- SummaryCard - Total Orders using `totalOrders`
- Back button to dashboard

## User Roles And RBAC

Roles:

### Admin

Can:

- View all vendors
- View platform summary
- Search and sort vendors
- Open any vendor detail page
- Identify low performers
- View all analytics

### Vendor

Can:

- View own reliability score
- View own order success/failure data
- View own complaints
- View own response time
- View own rating trends

For MVP:

- Full login is optional.
- RBAC can be explained conceptually.
- A simple role selector can be added if time allows.

## Team Split

Team size: 3 beginners.

### Person 1: Lead / Data / Git / Deployment

Owns:

- `/data/vendors.json`
- README
- GitHub merges
- Vercel deployment
- Render deployment
- Demo screenshots

Tasks:

- Create 10 realistic vendors
- Keep field names consistent
- Connect GitHub repo
- Merge branches
- Prepare final demo

### Person 2: Frontend

Owns:

- `/src`

Tasks:

- Dashboard page
- Vendor detail page
- Components
- Recharts charts
- Search and sort
- Mobile UI polish

Do not edit:

- `/server`
- `/data/vendors.json`

### Person 3: Backend

Owns:

- `/server`

Tasks:

- Express setup
- CORS setup
- API routes
- Reliability score logic
- Status logic
- Summary endpoint

Do not edit:

- `/src`
- `/data/vendors.json`

## Branch Strategy

```text
main      → stable demo-ready branch
frontend  → Person 2
backend   → Person 3
data      → Person 1
```

Merge order:

1. Data branch into main
2. Backend branch into main
3. Frontend branch into main
4. Final polish into main

Commit often:

```bash
git add .
git commit -m "feat: describe what changed"
git push origin branch-name
```

## Build Order

1. Create mock vendor data.
2. Build backend APIs.
3. Test backend endpoints.
4. Build frontend dashboard.
5. Build vendor detail page.
6. Add search and sort.
7. Polish UI and mobile responsiveness.
8. Deploy backend to Render.
9. Deploy frontend to Vercel.
10. Prepare demo script and screenshots.

## Verification Checklist

Before final submission:

- `GET /api/vendors` returns 10 vendors.
- `GET /api/summary` returns correct summary data.
- `GET /api/vendors/:id` returns one vendor with `weeklyData`.
- Vendor table shows 10 rows.
- Search works.
- Sort works.
- Complaints bar chart renders.
- Weekly delivery line chart renders.
- Vendor detail pie chart renders.
- Vendor detail page shows:
  - Avg Response Time
  - Rating
  - Total Orders
- No red browser console errors.
- Backend runs on port 5000.
- Frontend runs on port 5173.
- GitHub repo is connected.
- Deployment links work or localhost backup is ready.

## Prompt To Start Coding In Antigravity / Cursor / OpenCode

Use this prompt:

```text
Build the Reliability Analytics Dashboard from scratch in the current folder.

Do not create a separate outer project folder.

Stack:
- React + Vite
- Tailwind CSS
- Recharts
- Axios
- React Router DOM
- Node.js + Express
- CORS
- Mock JSON only

Create:
- /src frontend
- /server backend
- /data/vendors.json

Backend:
- port 5000
- GET /api/vendors
- GET /api/vendors/:id
- GET /api/summary
- Compute reliabilityScore from completedOrders and failedOrders
- Add status: Good, Average, Poor

Frontend:
- port 5173
- Dashboard page
- Vendor detail page
- Summary cards
- Vendor table
- Search and sort
- Bar chart for complaints
- Line chart for weekly delivery rate
- Pie chart for completed vs failed orders

Data:
- Create 10 realistic vendors
- Each vendor must include:
  id, name, totalOrders, completedOrders, failedOrders, deliveryRate,
  totalComplaints, avgResponseTime, rating, region, weeklyData

weeklyData format:
[
  { "day": "Mon", "deliveryRate": 85, "complaints": 1 }
]

Keep it beginner-friendly and demo-ready.
```

## Prompt To Verify Generated Files

Use this prompt when files are generated:

```text
Verify the project files against the Reliability Analytics Dashboard plan.

Check:
- required folders exist: /src, /server, /data
- vendors.json has 10 vendors
- vendor fields match required data contract
- weeklyData is embedded in each vendor
- no deliveries.json dependency exists
- backend has GET /api/vendors, /api/vendors/:id, /api/summary
- frontend uses correct API fields
- dashboard has summary cards, charts, table, search, sort
- vendor detail has pie chart, line chart, avg response time, rating, total orders
- no missing imports
- package.json has required dependencies
- app can run on frontend 5173 and backend 5000

Fix only broken parts. Do not rewrite everything.
```

## Existing PDF

A workflow PDF was created in this same directory:

```text
Reliability_Analytics_Dashboard_Workflow_Plan.pdf
```

It was checked and contains:

- 5 pages
- 10 vendor requirement
- `/api/summary`
- `deliveryRate`
- `avgResponseTime`
- `rating`
- embedded `weeklyData`
- vendor detail cards for Avg Response Time, Rating, Total Orders

## Demo Pitch

60-second pitch:

```text
Local vendors have no data on their performance. They only receive complaints after problems happen. We built a Reliability Analytics Dashboard that tracks delivery success, complaint frequency, response time, ratings, and reliability score. Admins can compare vendors, identify low performers, and view clear charts. Vendors can understand their own weak areas and improve service quality. Our goal is to give local vendors data to improve, not just complaints to ignore.
```

Demo order:

1. Dashboard overview.
2. Summary cards.
3. Complaints chart.
4. Vendor table with search/sort.
5. Click one vendor.
6. Show detail page with pie chart, weekly trend, and metric cards.
7. Explain future scope.

## Future Scope

- Real database with MongoDB or PostgreSQL.
- JWT authentication.
- Full RBAC with protected routes.
- ML prediction for future reliability score.
- Automatic alerts for poor performers.
- Complaint category analysis.
- Sentiment analysis from customer reviews.
- PDF/CSV reports.
- Vendor leaderboard.
- Location-wise analytics.
- Delivery agent-level analytics.
