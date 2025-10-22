const express = require('express');
const router = express.Router();
const IndexModel = require('../models/indexModel');

// GET profit/loss summary
router.get('/profit-loss', async (req, res) => {
  try {
    const [rows] = await IndexModel.getProfitLossSummary();
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET total due summary
router.get('/total-due', async (req, res) => {
  try {
    const [rows] = await IndexModel.getTotalDueSummary();
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET monthly sales
router.get('/monthly-sales', async (req, res) => {
  try {
    const [rows] = await IndexModel.getMonthlySales();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
