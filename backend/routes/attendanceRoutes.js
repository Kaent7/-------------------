const express = require('express');
const router = express.Router();
const pool = require('../db');

// Получение данных по группе и дате
router.get('/', async (req, res) => {
    const { group_id, date } = req.query;
    try {
        const query = `
            SELECT s.id as student_id, s.last_name, s.first_name, 
                   a.on_work, a.start_time, a.end_time, a.hours
            FROM students s
            LEFT JOIN attendance a ON s.id = a.student_id AND a.date = $1
            WHERE s.group_id = $2 ORDER BY s.last_name ASC`;
        const result = await pool.query(query, [date, group_id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Сохранение посещаемости
router.post('/save', async (req, res) => {
    const { group_id, date, records } = req.body;
    try {
        await pool.query('BEGIN');
        for (let r of records) {
            await pool.query(`
                INSERT INTO attendance (student_id, group_id, date, on_work, start_time, end_time, hours)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (student_id, date) 
                DO UPDATE SET on_work = $4, start_time = $5, end_time = $6, hours = $7`,
                [r.student_id, group_id, date, r.on_work, r.start_time, r.end_time, r.hours || 0]
            );
        }
        await pool.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await pool.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;