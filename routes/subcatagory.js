const express = require('express');
const router = express.Router();
const subCatagory = require('../models/subcatagoryModel');


router.get('/get-SubCatWithJoin/', async (req, res) => {
  try {
    const [rows] = await subCatagory.getSubCatWithJoin();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET Cat for fill combobox
router.get('/get-SubCatByCatId/:id', async (req, res) => {
  try {
    const [rows] = await subCatagory.getSubCatByCatId(req.params.id);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all
router.get('/', async (req, res) => {
  try {
    const [rows] = await subCatagory.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await subCatagory.getById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ error: 'Sub_Catagory not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const [result] = await subCatagory.create(req.body);
    res.json({ message: 'Sub_Catagory created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    await subCatagory.update(req.params.id, req.body);
    res.json({ message: 'Sub_Catagory updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await subCatagory.delete(req.params.id);
    res.json({ message: 'Sub_Catagory deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
