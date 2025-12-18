const express = require('express');
const router = express.Router();
const pool = require('../db');

// Получить журнал посещаемости для конкретной группы
router.get('/group/:groupId', async (req, res) => {
    const { groupId } = req.params;
    try {
        const query = `
            SELECT a.*, s.first_name, s.last_name 
            FROM attendance a
            JOIN students s ON a.student_id = s.id
            WHERE a.group_id = $1
            ORDER BY a.date DESC
        `;
        const result = await pool.query(query, [groupId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Отметить посещаемость (создать запись)
router.post('/', async (req, res) => {
    const { student_id, group_id, date, on_work, start_time, end_time, hours } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO attendance (student_id, group_id, date, on_work, start_time, end_time, hours) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [student_id, group_id, date, on_work, start_time, end_time, hours]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;