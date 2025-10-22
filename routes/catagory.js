const express = require('express');
const router = express.Router();
const Catagory = require('../models/catagoryModel');


// GET Cat for fill combobox
router.get('/get-Cat', async (req, res) => {
  try {
    const [rows] = await Catagory.getCat();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all
router.get('/', async (req, res) => {
  try {
    const [rows] = await Catagory.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await Catagory.getById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ error: 'Catagory not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const [result] = await Catagory.create(req.body);
    res.json({ message: 'Catagory created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    await Catagory.update(req.params.id, req.body);
    res.json({ message: 'Catagory updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Catagory.delete(req.params.id);
    res.json({ message: 'Catagory deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
