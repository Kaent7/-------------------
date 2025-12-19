const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/my-students', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.*, g.group_name 
            FROM students s 
            LEFT JOIN groups g ON s.group_id = g.id 
            ORDER BY s.last_name ASC`);
        res.json(result.rows); // Отправляет массив, чтобы .reduce() работал
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Заглушка для организаций
router.get('/organisations-list', async (req, res) => {
    res.json([]); 
});

module.exports = router;