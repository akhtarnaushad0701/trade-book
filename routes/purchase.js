const express = require("express");
const router = express.Router();
const purModule = require("../models/purchaseModel");

// Save sale with items
router.post('/', async (req, res) => {
  try {
    const { invoice, items } = req.body;
    const result = await purModule.insertPurchase(invoice, items);
    res.json({ success: true,message: "Purchase inserted successfully..", purId: result.purId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to insert Purchase" });
  }
});

// Update sale with items
router.put('/', async (req, res) => {
  try {
    const { invoice, items, id } = req.body;
    const result = await purModule.updatePurchase(invoice, items, id);
    res.json({ success: true,message: "Purchase Updated successfully..", purId: result.purId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update Purchase" });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { id } = req.body;
    const result = await purModule.deletePurchase(id);
    res.json({ success: true,message: "Purchase Deleted successfully..", purId: result.purId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update Purchase" });
  }
});

module.exports = router;
