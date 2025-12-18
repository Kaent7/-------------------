const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM organisations ORDER BY org_name ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/add', async (req, res) => {
    const { org_name, address, full_name, phone_number } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO organisations (org_name, address, full_name, phone_number) VALUES ($1, $2, $3, $4) RETURNING *',
            [org_name, address, full_name, phone_number]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;