var express = require('express');
var router = express.Router();
var db = require('../models/db');

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

router.get('/walkrequests/open', async function(req, res, next) {
  try {
    const [rows] = await db.query(`
      select
        wr.request_id,
        d.name as dog_name,
        wr.requested_time,
        wr.duration_minutes,
        wr.location,
        u.username as owner_username
      from WalkRequests wr
      join Dogs d on wr.dog_id = d.dog_id
      join Users u on d.owner_id = u.user_id
      where wr.status = 'open'
      order by wr.requested_time
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
        count(wr_ratings.rating) as total_ratings,
        case
          when count(wr_ratings.rating) > 0
          then round(avg(wr_ratings.rating), 1)
          else NULL
        end as average_rating,
        coalesce(count(distinct completed_walks.request_id), 0) as completed_walks
      from Users u
      left join WalkApplications wa on u.user_id = wa.walker_id and wa.status = 'accepted'
      left join WalkRequests completed_walks on wa.request_id = completed_walks.request_id and completed_walks.status = 'completed'
      left join WalkRatings wr_ratings on completed_walks.request_id = wr_ratings.request_id and wr_ratings.walker_id = u.user_id
      where u.role = 'walker'
      group by u.user_id, u.username
      order by u.username
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch walker summary' });
  }
});

module.exports = router;
