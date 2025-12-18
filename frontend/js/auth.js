document.addEventListener('DOMContentLoaded', () => {
    // Форма входа
    const signInBtn = document.querySelector('.sign-in-button');
    const signInContainer = document.querySelector('.sign-in-form');

    // Форма регистрации
    const signUpBtn = document.querySelector('.sign-up-button');
    const signUpContainer = document.querySelector('.sign-up-form');

    // ЛОГИКА РЕГИСТРАЦИИ
    if (signUpBtn) {
        signUpBtn.addEventListener('click', async (e) => {
            e.preventDefault(); // ОСТАНАВЛИВАЕМ ПЕРЕЗАГРУЗКУ СТРАНИЦЫ

            const login = signUpContainer.querySelector('input[name="login"]').value;
            const first_name = signUpContainer.querySelector('input[name="uName"]').value;
            const last_name = signUpContainer.querySelector('input[name="uSurName"]').value;
            const password = signUpContainer.querySelector('input[name="password"]').value;

            // Простая проверка
            if (!login || !first_name || !last_name || !password) {
                return alert('Пожалуйста, заполните все поля!');
            }

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ login, password, first_name, last_name })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Регистрация прошла успешно! Теперь войдите в аккаунт.');
                    // Кликаем на ссылку "Войти сейчас", чтобы переключить форму
                    document.getElementById('show-sign-in').click();
                } else {
                    alert('Ошибка: ' + (data.error || 'Не удалось зарегистрироваться'));
                }
            } catch (err) {
                console.error('Ошибка запроса:', err);
                alert('Нет связи с сервером. Проверьте, запущен ли backend.');
            }
        });
    }

    // ЛОГИКА ВХОДА
    if (signInBtn) {
        signInBtn.addEventListener('click', async (e) => {
            e.preventDefault(); // ОСТАНАВЛИВАЕМ ПЕРЕЗАГРУЗКУ

            const login = signInContainer.querySelector('input[name="login"]').value;
            const password = signInContainer.querySelector('input[name="password"]').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ login, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = '/students'; // Переход на страницу студентов
                } else {
                    alert(data.error || 'Неверный логин или пароль');
                }
            } catch (err) {
                console.error('Ошибка запроса:', err);
            }
        });
    }
});