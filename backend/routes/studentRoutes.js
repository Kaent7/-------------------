const express = require('express');
const router = express.Router();
const pool = require('../db');

// Получить всех студентов, сгруппированных по названию групп
router.get('/my-students', async (req, res) => {
    try {
        const query = `
            SELECT 
                s.id, s.first_name, s.last_name, s.patronymic, 
                s.on_budget, g.group_name
            FROM students s
            JOIN groups g ON s.group_id = g.id
            ORDER BY g.group_name, s.last_name;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Ошибка при получении студентов:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;