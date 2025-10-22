const express = require('express');
const router = express.Router();
const Account = require('../models/accountModel');

// GET all
router.get('/', async (req, res) => {
  try {
    const [rows] = await Account.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await Account.getById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ error: 'Account not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const [result] = await Account.create(req.body);
    res.json({ message: 'Account Created Successfully..', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    await Account.update(req.params.id, req.body);
    res.json({ message: 'Account Updated Successfully..' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Account.delete(req.params.id);
    res.json({ message: 'Account Deleted Successfully..' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
