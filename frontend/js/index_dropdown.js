[].slice.call(document.querySelectorAll('.dropdown')).forEach(function (el) {
    el.addEventListener('mouseenter', onMouseEnter, false);
    el.addEventListener('mouseleave', onMouseLeave, false);
    el.querySelector('.nav-link').addEventListener('click', onClick, false);
});

function onMouseEnter(e) {
    var el = this;
    if (!el.classList.contains('clicked')) {
        showSubMenu(el);
    }
}

function onMouseLeave(e) {
    var el = this;
    if (!el.classList.contains('clicked')) {
        setTimeout(function () {
            if (!el.matches(':hover') && !el.classList.contains('clicked')) {
                hideSubMenu(el);
            }
        }, 100);
    }
}

function onClick(e) {
    if (e.target.closest('.submenu-link')) {
        return;
    }
    e.preventDefault();
    var el = this.parentNode;
    if (el.classList.contains('clicked')) {
        el.classList.remove('clicked');
        hideSubMenu(el);
    } else {
        el.classList.add('clicked');
        showSubMenu(el);
        document.addEventListener('click', onDocClick, false);
    }
}

function onDocClick(e) {
    var dropdowns = document.querySelectorAll('.dropdown.clicked');
    dropdowns.forEach(function (el) {
        if (!el.contains(e.target)) {
            el.classList.remove('clicked');
            hideSubMenu(el);
            document.removeEventListener('click', onDocClick);
        }
    });
}

function showSubMenu(el) {
    el.classList.add('show-submenu');
}

function hideSubMenu(el) {
    el.classList.remove('show-submenu');
}