const burger = document.querySelector('.burger-btn');
const nav = document.querySelector('.nav');
const navItems = document.querySelectorAll('.nav-item');

function toggleBurger(){
    burger.classList.toggle('burger-btn_active');
    nav.classList.toggle('nav_active');
}

function closeMenu(){
    if (nav.classList.contains('nav_active')){
        nav.classList.remove('nav_active');
        burger.classList.remove('burger-btn_active');
    };
}

burger.addEventListener('click', toggleBurger);
navItems.forEach(item => item.addEventListener('click', closeMenu));