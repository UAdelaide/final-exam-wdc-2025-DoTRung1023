const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/dogs', async function(req, res, next) {
  try {
    const [rows] = await db.query(`
      select d.dog_id, d.name as dog_name, d.size, d.owner_id
      from Dogs d
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

module.exports = router;
