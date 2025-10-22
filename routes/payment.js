const express = require('express');
const router = express.Router();
const Payment = require('../models/paymentModel');


router.get('/get-PaymentWithJoin/', async (req, res) => {
  try {
    const [rows] = await Payment.getPaymentWithJoin();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET Cat for fill combobox
router.get('/get-PaymentByCustId/:id', async (req, res) => {
  try {
    const [rows] = await Payment.getPaymentByCustId(req.params.id);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all
router.get('/', async (req, res) => {
  try {
    const [rows] = await Payment.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await Payment.getById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ error: 'Payment not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const [result] = await Payment.create(req.body);
    res.json({ message: 'Payment created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    await Payment.update(req.params.id, req.body);
    res.json({ message: 'Payment updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Payment.delete(req.params.id);
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
