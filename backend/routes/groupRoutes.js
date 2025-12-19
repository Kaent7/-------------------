const express = require('express');
const router = express.Router();
const pool = require('../db');

// Получение всех групп для списков
router.get('/all', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM groups ORDER BY group_name ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Создание группы и студентов
router.post('/create-with-students', async (req, res) => {
    const { group_name, curator_full_name, phone_number, students } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const groupRes = await client.query(
            'INSERT INTO groups (group_name, curator_full_name, phone_number) VALUES ($1, $2, $3) RETURNING id',
            [group_name, curator_full_name, phone_number]
        );
        const groupId = groupRes.rows[0].id;

        if (students && students.length > 0) {
            for (let s of students) {
                await client.query(
                    'INSERT INTO students (first_name, last_name, patronymic, group_id) VALUES ($1, $2, $3, $4)',
                    [s.first_name, s.last_name, s.patronymic, groupId]
                );
            }
        }
        await client.query('COMMIT');
        res.status(201).json({ success: true, groupId });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

module.exports = router;