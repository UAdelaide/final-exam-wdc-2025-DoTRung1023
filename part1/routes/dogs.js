var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/dogs', async function(req, res, next) {
  try {
    const [rows] = await db.query(`
      SELECT d.name AS dog_name, d.size, u.username AS owner_name
      FROM Dogs d
      JOIN Users u ON d.owner_id = u.user_id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

router.get('/walkrequests/open', async function(req, res, next) {
  try {
    const [rows] = await db.query(`
      SELECT
        wr.request_id,
        d.name AS dog_name,
        wr.requested_time,
        wr.duration_minutes,
        wr.location,
        u.username AS owner_username
      FROM WalkRequests wr
      JOIN Dogs d ON wr.dog_id = d.dog_id
      JOIN Users u ON d.owner_id = u.user_id
      WHERE wr.status = 'open'
      ORDER BY wr.requested_time
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch open walk requests' });
  }
});

router.get('/walkers/summary', async function(req, res, next) {
  try {
    const [rows] = await db.query(`
      select
        u.username as walker_username,
        COALESCE(COUNT(wr_ratings.rating), 0) as total_ratings,
        CASE
          WHEN COUNT(wr_ratings.rating) > 0
          THEN ROUND(AVG(wr_ratings.rating), 1)
          ELSE NULL
        END AS average_rating,
        COALESCE(COUNT(DISTINCT completed_walks.request_id), 0) AS completed_walks
      FROM Users u
      LEFT JOIN WalkApplications wa ON u.user_id = wa.walker_id AND wa.status = 'accepted'
      LEFT JOIN WalkRequests completed_walks ON wa.request_id = completed_walks.request_id AND completed_walks.status = 'completed'
      LEFT JOIN WalkRatings wr_ratings ON completed_walks.request_id = wr_ratings.request_id AND wr_ratings.walker_id = u.user_id
      WHERE u.role = 'walker'
      GROUP BY u.user_id, u.username
      ORDER BY u.username
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch walker summary' });
  }
});

module.exports = router;
