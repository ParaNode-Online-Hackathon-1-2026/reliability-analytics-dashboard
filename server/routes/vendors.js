const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DATA_PATH = path.join(__dirname, '../../data/vendors.json');

// Helper: compute reliabilityScore and status
function computeVendor(v) {
  const score = Math.round((v.completedOrders / (v.completedOrders + v.failedOrders)) * 100);
  const status = score > 80 ? 'good' : score >= 60 ? 'average' : 'poor';
  return { ...v, reliabilityScore: score, status };
}

// GET /api/vendors  (with optional ?search= and ?sort=)
router.get('/', (req, res) => {
  try {
    let vendors = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));

    // Compute score + status for each, strip weeklyData from list view
    vendors = vendors.map(v => {
      const { weeklyData, ...rest } = computeVendor(v);
      return rest;
    });

    // Search
    if (req.query.search) {
      const q = req.query.search.toLowerCase();
      vendors = vendors.filter(v => v.name.toLowerCase().includes(q));
    }

    // Sort
    if (req.query.sort === 'score')      vendors.sort((a, b) => b.reliabilityScore - a.reliabilityScore);
    if (req.query.sort === 'complaints') vendors.sort((a, b) => b.totalComplaints - a.totalComplaints);
    if (req.query.sort === 'rating')     vendors.sort((a, b) => b.rating - a.rating);

    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load vendors' });
  }
});

// GET /api/vendors/:id
router.get('/:id', (req, res) => {
  try {
    const vendors = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
    const vendor = vendors.find(v => v.id === req.params.id);

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.json(computeVendor(vendor));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load vendor' });
  }
});

module.exports = router;
