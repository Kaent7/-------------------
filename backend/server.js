const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 1. Указываем папку с фронтендом (HTML, CSS, JS)
// Предполагаем, что папка frontend находится на одном уровне с папкой backend
app.use(express.static(path.join(__dirname, '../frontend')));

// 2. Регистрация API роутов (чтобы не было 404 на запросах данных)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/practices', require('./routes/practiceRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));

// 3. Исправление "Cannot GET /user"
// Если вы хотите, чтобы при переходе на /user открывался файл user.html
app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/user.html'));
});

// Аналогично для посещаемости, если нужно:
app.get('/attendance', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/attendance_group.html'));
});

// Глобальная ошибка для неопознанных API запросов
app.use('/api', (req, res) => {
    res.status(404).json({ error: "API роут не найден" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});