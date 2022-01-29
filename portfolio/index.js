import i18Obj from './js/translate.js';

const portfolioBtns = document.querySelectorAll('.portfolio-btn');
const portfolioImages = document.querySelectorAll('.portfolio-photo');

const langBtns = document.querySelectorAll('.lang');
const i18nItems = document.querySelectorAll('[data-i18n]');

const changerTheme = document.querySelector('.changer-theme');
const themesBtns = document.querySelectorAll('.theme');

const btns = document.querySelectorAll('.btn');

const selectorsForChangeTheme = [
	document.querySelector('body'),
	document.querySelector('.nav'),
	document.querySelectorAll('.nav-link'),
	document.querySelectorAll(
		'.burger-line',
		'.burger-line::before',
		'.burger-line::after'
	),
	document.querySelectorAll('.section'),
	document.querySelectorAll('.section-title::before'),
	document.querySelectorAll('.section-title'),
	document.querySelectorAll('.section-title__text'),
	portfolioBtns,
];

window.addEventListener('load', getLocalStorage);

function getLocalStorage() {
	const lang = localStorage.getItem('lang');
	const theme = localStorage.getItem('theme');

	if (lang) {
		setLanguage(langBtns, lang);
	}
	if (theme) {
		setTheme(themesBtns, theme, selectorsForChangeTheme);
	}
}

portfolioBtns.forEach((btn) => {
	btn.addEventListener('click', handlerPortfolioBtnClick);
});

langBtns.forEach((btn) => {
	btn.addEventListener('click', handlerLangBtnClick);
});

changerTheme.addEventListener('click', handlerChangeThemeClick);

function handlerPortfolioBtnClick(event) {
	const dataset = event.target.dataset.season;

	portfolioBtns.forEach((btn) => {
		if (btn.dataset.season === dataset) {
			btn.classList.add('active');
			showActiveItems(dataset);
		} else {
			btn.classList.remove('active');
		}
	});
}

function showActiveItems(dataset) {
	portfolioImages.forEach((image, index) => {
		image.src = `./assets/img/${dataset}/${index + 1}.jpg`;
		image.alt = `${dataset}-${index + 1}`;
	});
}

function handlerLangBtnClick(event) {
	const dataset = event.target.dataset['lang'];

	localStorage.setItem('lang', dataset);
	setLanguage(langBtns, dataset);
}

function setLanguage(btns, lang) {
	btns.forEach((btn) => {
		if (btn.dataset['lang'] === lang) {
			btn.classList.add('current');
			i18nItems.forEach((item) => {
				const attr = item.dataset.i18n;
				item.textContent = `${i18Obj[lang][attr]}`;
			});
		} else {
			btn.classList.remove('current');
		}
	});
}

function handlerChangeThemeClick(event) {
	const currentTheme = event.target.closest('.theme');
	const dataAttrTheme = currentTheme.dataset.theme;

	localStorage.setItem('theme', dataAttrTheme);
	setTheme(themesBtns, dataAttrTheme, selectorsForChangeTheme);
}

function setTheme(btns, targetTheme, selectors) {
	btns.forEach((btn) => {
		if (btn.dataset.theme === targetTheme) {
			btn.classList.remove('theme-active');
			selectors.forEach((selector) => {
				if (NodeList.prototype.isPrototypeOf(selector)) {
					selector.forEach((el) => el.classList.toggle('light-theme'));
				} else {
					selector.classList.toggle('light-theme');
				}
			});
		} else {
			btn.classList.add('theme-active');
		}
	});
}

btns.forEach(btn => {
    btn.addEventListener('click', function (e) {
        const x = e.pageX;
        const y = e.pageY;
    
        const buttonTop = e.target.offsetTop;
        const buttonLeft = e.target.offsetLeft;

        const xInside = x - buttonLeft;
        const yInside = y - buttonTop;

        const circle = document.createElement('span');
        circle.classList.add('circle');
        circle.style.top = yInside + 'px';
        circle.style.left = xInside + 'px';
    
        this.appendChild(circle);
    
        setTimeout(() => circle.remove(), 500);
    });
});


// console.log(`    Вёрстка соответствует макету. Ширина экрана 768px +48
// - блок <header> +6
// - секция hero +6
// - секция skills +6
// - секция portfolio +6
// - секция video +6
// - секция price +6
// - секция contacts +6
// - блок <footer> +6
//     Ни на одном из разрешений до 320px включительно не появляется горизонтальная полоса прокрутки. Весь контент страницы при этом сохраняется: не обрезается и не удаляется +15
// - нет полосы прокрутки при ширине страницы от 1440рх до 768рх +5
// - нет полосы прокрутки при ширине страницы от 768рх до 480рх +5
// - нет полосы прокрутки при ширине страницы от 480рх до 320рх +5
//     На ширине экрана 768рх и меньше реализовано адаптивное меню +22
// - при ширине страницы 768рх панель навигации скрывается, появляется бургер-иконка +2
// - при нажатии на бургер-иконку справа плавно появляется адаптивное меню, бургер-иконка изменяется на крестик +4
// - высота адаптивного меню занимает всю высоту экрана. При ширине экрана 768-620рх вёрстка меню соответствует макету, когда экран становится уже, меню занимает всю ширину экрана +4
// - при нажатии на крестик адаптивное меню плавно скрывается уезжая за правую часть экрана, крестик превращается в бургер-иконку +4
// - бургер-иконка, которая при клике превращается в крестик, создана при помощи css-анимаций без использования изображений +2
// - ссылки в адаптивном меню работают, обеспечивая плавную прокрутку по якорям +2
// - при клике по ссылке в адаптивном меню адаптивное меню плавно скрывается, крестик превращается в бургер-иконку +4
// Итого: +85`);
