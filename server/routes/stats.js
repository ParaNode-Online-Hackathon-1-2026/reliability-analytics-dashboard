const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const VENDORS_PATH = path.join(__dirname, '../../data/vendors.json');
const COMPLAINTS_PATH = path.join(__dirname, '../../data/complaints.json');

function computeScore(v) {
  return Math.round((v.completedOrders / (v.completedOrders + v.failedOrders)) * 100);
}

// GET /api/summary
router.get('/summary', (req, res) => {
  try {
    const vendors = JSON.parse(fs.readFileSync(VENDORS_PATH, 'utf-8'));
    const scores = vendors.map(v => computeScore(v));
    const avgReliabilityScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const totalComplaints = vendors.reduce((sum, v) => sum + v.totalComplaints, 0);

    const topVendor = vendors.reduce((best, v) => {
      return computeScore(v) > computeScore(best) ? v : best;
    }, vendors[0]);

    res.json({
      totalVendors: vendors.length,
      avgReliabilityScore,
      totalComplaints,
      topPerformer: {
        id: topVendor.id,
        name: topVendor.name,
        score: computeScore(topVendor)
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load summary' });
  }
});

// GET /api/stats/complaints
router.get('/complaints', (req, res) => {
  try {
    const complaints = JSON.parse(fs.readFileSync(COMPLAINTS_PATH, 'utf-8'));
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load complaints' });
  }
});

// GET /api/stats/deliveries  (aggregate weeklyData across all vendors)
router.get('/deliveries', (req, res) => {
  try {
    const vendors = JSON.parse(fs.readFileSync(VENDORS_PATH, 'utf-8'));
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const aggregated = days.map(day => {
      const dayEntries = vendors
        .map(v => v.weeklyData.find(d => d.day === day))
        .filter(Boolean);

      const avgDeliveryRate = Math.round(
        dayEntries.reduce((sum, d) => sum + d.deliveryRate, 0) / dayEntries.length
      );
      const totalComplaints = dayEntries.reduce((sum, d) => sum + d.complaints, 0);

      return { day, deliveryRate: avgDeliveryRate, complaints: totalComplaints };
    });

    res.json(aggregated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load deliveries' });
  }
});

module.exports = router;
