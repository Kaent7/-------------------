const express = require('express');
const router = express.Router();
const pool = require('../db');

// Получить всех студентов (с JOIN групп и организаций)
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT s.*, g.group_name, o.org_name 
            FROM students s
            LEFT JOIN groups g ON s.group_id = g.id
            LEFT JOIN organisations o ON s.organisation_id = o.id
            ORDER BY s.id ASC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Добавить студента
router.post('/', async (req, res) => {
    const { first_name, last_name, patronymic, group_id, on_budget, organisation_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO students (first_name, last_name, patronymic, group_id, on_budget, organisation_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [first_name, last_name, patronymic, group_id, on_budget, organisation_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;