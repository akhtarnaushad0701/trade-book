const express = require('express');
const router = express.Router();
const Model = require('../models/my_sqlModel');

router.post('/get-SqlQuery', async (req, res) => {
  try {
    const { sql } = req.body;
     if (!sql.trim().toUpperCase().startsWith("SELECT")) {
      return res.status(400).json({ error: "Only SELECT queries allowed" });
    }
    const [rows] = await Model.getSqlQuery(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
