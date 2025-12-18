const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'super-secret-key-123';

router.post('/create-with-students', async (req, res) => {
    const { group_name, curator_full_name, phone_number, students } = req.body;
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ error: "Авторизуйтесь" });

    const client = await pool.connect();
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        await client.query('BEGIN');

        // 1. Создаем группу
        const groupRes = await client.query(
            'INSERT INTO groups (group_name, curator_full_name, phone_number) VALUES ($1, $2, $3) RETURNING id',
            [group_name, curator_full_name, phone_number]
        );
        const groupId = groupRes.rows[0].id;

        // 2. Привязываем группу к пользователю (БЕЗ ЭТОГО ДРУГИЕ НЕ УВИДЯТ)
        // practice_type — обязательное поле в твоей БД, ставим заглушку
        await client.query(
            'INSERT INTO practices (group_id, user_id, practice_type) VALUES ($1, $2, $3)',
            [groupId, userId, 'Учебная']
        );

        // 3. Добавляем студентов
        if (students && students.length > 0) {
            const studentQuery = `
                INSERT INTO students (first_name, last_name, patronymic, group_id, on_budget, organisation_id) 
                VALUES ($1, $2, $3, $4, $5, $6)`;
            
            for (let s of students) {
                await client.query(studentQuery, [
                    s.first_name, s.last_name, s.patronymic, 
                    groupId, s.on_budget, s.organisation_id || null
                ]);
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: "Ошибка сохранения" });
    } finally {
        client.release();
    }
});

module.exports = router;