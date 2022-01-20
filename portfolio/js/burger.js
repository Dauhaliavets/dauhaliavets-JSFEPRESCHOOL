const burger = document.querySelector('.burger-btn');
const nav = document.querySelector('.nav');
const navItems = document.querySelectorAll('.nav-item');
const main = document.querySelector('.main');

function toggleBurger(){
    burger.classList.toggle('burger-btn_active');
    nav.classList.toggle('nav_active');
    main.classList.toggle('overlay');
}

function closeMenu(){
    if (nav.classList.contains('nav_active')){
        nav.classList.remove('nav_active');
        burger.classList.remove('burger-btn_active');
        main.classList.remove('overlay');
    };
}

burger.addEventListener('click', toggleBurger);
navItems.forEach(item => item.addEventListener('click', closeMenu));