const express = require("express");
const router = express.Router();
const salesModule = require("../models/salesModel");

// Save sale with items
router.post('/', async (req, res) => {
  try {
    const { invoice, items } = req.body;
    const result = await salesModule.insertSale(invoice, items);
    res.json({ success: true,message: "Sale inserted successfully..", saleId: result.saleId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to insert sale" });
  }
});

// Update sale with items
router.put('/', async (req, res) => {
  try {
    const { invoice, items, id } = req.body;
    const result = await salesModule.updateSale(invoice, items, id);
    res.json({ success: true,message: "Sale Updated successfully..", saleId: result.saleId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update sale" });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { id } = req.body;
    const result = await salesModule.deleteSale(id);
    res.json({ success: true,message: "Sale Deleted successfully..", saleId: result.saleId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update sale" });
  }
});

module.exports = router;
