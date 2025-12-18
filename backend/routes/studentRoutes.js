const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'super-secret-key-123';

// Только организации (пока общие, так как в таблице нет user_id)
router.get('/organisations-list', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, org_name FROM organisations ORDER BY org_name');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ПОЛУЧЕНИЕ СТУДЕНТОВ ТОЛЬКО ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
router.get('/my-students', async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: "Нет доступа" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        // INNER JOIN с practices гарантирует, что мы увидим только свои группы
        const query = `
            SELECT 
                s.id, s.first_name, s.last_name, s.patronymic, 
                s.on_budget, g.group_name, o.org_name
            FROM students s
            JOIN groups g ON s.group_id = g.id
            JOIN practices p ON g.id = p.group_id
            LEFT JOIN organisations o ON s.organisation_id = o.id
            WHERE p.user_id = $1
            ORDER BY g.group_name, s.last_name;
        `;
        const result = await pool.query(query, [userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

module.exports = router;