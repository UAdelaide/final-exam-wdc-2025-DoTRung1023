const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/dogs', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT dog_id, name, size FROM Dogs WHERE owner_id = ?', [req.session.user.user_id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

module.exports = router;
