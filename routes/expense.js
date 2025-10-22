const express = require('express');
const router = express.Router();
const Model = require('../models/expenseModel');

router.get('/get-ForTable/', async (req, res) => {
  try {
    const [rows] = await Model.getForTable();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/get-ExpenseWithSpclStr/:str', async (req, res) => {
  try {
    const [rows] = await Model.getExpenseWithSpclStr(req.params.str);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/get-SqlQuery/:str', async (req, res) => {
  try {
    const [rows] = await Model.getSqlQuery(req.params.str);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all
router.get('/', async (req, res) => {
  try {
    const [rows] = await Model.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await Model.getById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ error: 'Expense not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const [result] = await Model.create(req.body);
    res.json({ message: 'Expense Created Successfully..', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    await Model.update(req.params.id, req.body);
    res.json({ message: 'Expense Updated Successfully..' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Model.delete(req.params.id);
    res.json({ message: 'Expense Deleted Successfully..' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
