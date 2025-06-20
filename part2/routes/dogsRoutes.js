const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/dogs', async function(req, res, next) {
  try {
    const [rows] = await db.query(`
      select * from Dogs
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

module.exports = router;
