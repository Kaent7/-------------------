document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#students-table-body');

    // Функция для загрузки данных
    async function loadStudents() {
        const response = await fetch('/api/students');
        const students = await response.json();

        tableBody.innerHTML = ''; // Очистить таблицу
        students.forEach(student => {
            const row = `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.last_name} ${student.first_name}</td>
                    <td>${student.group_name || 'Нет группы'}</td>
                    <td>${student.org_name || 'Не назначена'}</td>
                    <td>${student.on_budget ? 'Бюджет' : 'Контракт'}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    loadStudents();
});