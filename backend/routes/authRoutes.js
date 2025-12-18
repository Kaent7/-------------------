const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'super-secret-key-123'; // Лучше вынести в .env

// Регистрация
router.post('/register', async (req, res) => {
    const {
        login,
        password,
        first_name,
        last_name
    } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        await pool.query(
            'INSERT INTO users (login, password_hash, first_name, last_name, created_at) VALUES ($1, $2, $3, $4, NOW())',
            [login, hash, first_name, last_name]
        );
        res.status(201).json({
            message: "Пользователь создан"
        });
    } catch (err) {
        res.status(500).json({
            error: "Логин уже занят или ошибка БД"
        });
    }
});

// Вход
router.post('/login', async (req, res) => {
    const {
        login,
        password
    } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
        if (result.rows.length === 0) return res.status(400).json({
            error: "Пользователь не найден"
        });

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({
            error: "Неверный пароль"
        });

        const token = jwt.sign({
            id: user.id
        }, JWT_SECRET, {
            expiresIn: '24h'
        });
        res.json({
            token,
            user: {
                login: user.login,
                name: user.first_name
            }
        });
    } catch (err) {
        res.status(500).json({
            error: "Ошибка сервера"
        });
    }
});

router.post('/register', async (req, res) => {
    try {
        // ... твой код хеширования
        console.log("Пытаюсь создать пользователя:", req.body);

        const result = await pool.query(
            'INSERT INTO users (login, password_hash, first_name, last_name, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [login, hash, first_name, last_name]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("ОШИБКА БД:", err.message); // <-- Это покажет реальную причину в терминале
        res.status(500).json({
            error: err.message
        });
    }
});

// Получение данных текущего пользователя
router.get('/me', async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({
        error: "Нет токена"
    });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // Получаем данные пользователя и его практики
        const userQuery = `
            SELECT login, first_name, last_name, created_at 
            FROM users WHERE id = $1`;
        const groupsQuery = `
            SELECT g.group_name 
            FROM practices p 
            JOIN groups g ON p.group_id = g.id 
            WHERE p.user_id = $1`;

        const user = await pool.query(userQuery, [decoded.id]);
        const groups = await pool.query(groupsQuery, [decoded.id]);

        res.json({
            ...user.rows[0],
            groups: groups.rows
        });
    } catch (err) {
        res.status(401).json({
            error: "Неверный токен"
        });
    }
});

module.exports = router;