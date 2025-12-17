document.addEventListener('DOMContentLoaded', function () {
    const signInForm = document.querySelector('.sign-in-form');
    const signUpForm = document.querySelector('.sign-up-form');
    const showSignUpLink = document.getElementById('show-sign-up');
    const showSignInLink = document.getElementById('show-sign-in');

    showSignUpLink.addEventListener('click', function () {
        signInForm.style.display = 'none';
        signUpForm.style.display = 'block';
        document.title = 'Регистрация';
    });

    showSignInLink.addEventListener('click', function () {
        signUpForm.style.display = 'none';
        signInForm.style.display = 'block';
        document.title = 'Вход';
    });
});