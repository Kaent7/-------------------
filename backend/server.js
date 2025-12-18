const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = 3000;

// --- 1. МИДЛВЕРЫ (Настройки сервера) ---
app.use(cors()); // Разрешаем кросс-доменные запросы
app.use(express.json()); // ОБЯЗАТЕЛЬНО: позволяет серверу понимать JSON в теле запроса (req.body)
app.use(morgan('dev')); // Логирует запросы в консоль терминала для отладки

// Указываем путь к папке frontend для статических файлов (css, js, img)
app.use(express.static(path.join(__dirname, '../frontend')));

// --- 2. ПОДКЛЮЧЕНИЕ API РОУТОВ ---
// Убедись, что файлы созданы в папке backend/routes/
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/organisations', require('./routes/organisationRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));

// --- 3. МАРШРУТЫ ДЛЯ СТРАНИЦ (Frontend) ---

// Главная страница (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Автоматический поиск HTML страниц
// Это позволит заходить на http://localhost:3000/students вместо /students.html
app.get('/:page', (req, res) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, `../frontend/${page}.html`);
    
    res.sendFile(filePath, (err) => {
        if (err) {
            // Если файл не найден (например, /abc), отправляем на 404
            res.status(404).send('<h1>404: Страница не найдена</h1>');
        }
    });
});

// --- 4. ОБРАБОТКА ОШИБОК ---
app.use((err, req, res, next) => {
    console.error('Критическая ошибка сервера:', err.stack);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// --- 5. ЗАПУСК СЕРВЕРА ---
app.listen(PORT, () => {
    console.log(`\x1b[36m%s\x1b[0m`, `-----------------------------------------`);
    console.log(`🚀 Сервер ПрактикON запущен!`);
    console.log(`📍 Адрес: http://localhost:${PORT}`);
    console.log(`📂 Статика: ${path.join(__dirname, '../frontend')}`);
    console.log(`\x1b[36m%s\x1b[0m`, `-----------------------------------------`);
});