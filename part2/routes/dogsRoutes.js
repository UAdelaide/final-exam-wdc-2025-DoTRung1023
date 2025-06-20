const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/dogs', async function(req, res, next) {
  try {
    const [rows] = await db.query(`
      select d.name as dog_name, d.size, u.username as owner_name
      from Dogs d
      join Users u on d.owner_id = u.user_id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

module.exports = router;
