const express = require('express');
const router = express.Router();
const Supplier = require('../models/supplierModel');

// GET all
router.get('/', async (req, res) => {
  try {
    const [rows] = await Supplier.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await Supplier.getById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ error: 'Supplier not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const [result] = await Supplier.create(req.body);
    res.json({ message: 'Supplier created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    await Supplier.update(req.params.id, req.body);
    res.json({ message: 'Supplier updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Supplier.delete(req.params.id);
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
