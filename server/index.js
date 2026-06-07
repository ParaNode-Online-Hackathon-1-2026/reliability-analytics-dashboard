const express = require('express');
const cors = require('cors');
const vendorsRouter = require('./routes/vendors');
const statsRouter = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const authRouter = require('./routes/auth');

// Routes
app.use('/api/auth', authRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api', statsRouter);         // mounts GET /api/summary
app.use('/api/stats', statsRouter);   // mounts GET /api/stats/complaints + /deliveries

app.get("/", (req, res) => {
  res.json({
    service: "Reliability Analytics Dashboard API",
    status: "running",
    endpoints: [
      "/api/vendors",
      "/api/summary",
      "/api/stats/complaints",
      "/api/stats/deliveries",
      "/api/auth/login"
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
