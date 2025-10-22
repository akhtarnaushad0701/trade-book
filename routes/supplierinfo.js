const express = require('express');
const router = express.Router();
const supplierModel = require('../models/supplierModel');

// GET all
router.get('/', async (req, res) => {
  try {
    const [rows] = await Supplier.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
