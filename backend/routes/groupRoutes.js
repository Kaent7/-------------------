const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'super-secret-key-123';

router.post('/create-with-students', async (req, res) => {
    const { group_name, curator_full_name, phone_number, students } = req.body;
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ error: "Нет токена" });

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Создание группы в таблице groups
        const groupRes = await client.query(
            'INSERT INTO groups (group_name, curator_full_name, phone_number) VALUES ($1, $2, $3) RETURNING id',
            [group_name, curator_full_name, phone_number]
        );
        const groupId = groupRes.rows[0].id;

        // 2. Добавление студентов в таблицу students
        if (students && students.length > 0) {
            const studentQuery = `
                INSERT INTO students (first_name, last_name, patronymic, group_id, on_budget) 
                VALUES ($1, $2, $3, $4, $5)`;
            
            for (let s of students) {
                await client.query(studentQuery, [
                    s.first_name, s.last_name, s.patronymic, groupId, s.on_budget
                ]);
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ success: true, groupId });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Ошибка при сохранении:", err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

module.exports = router;