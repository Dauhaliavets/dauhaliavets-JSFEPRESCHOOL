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

console.log(`
1. Смена изображений в секции portfolio +25
    - при кликах по кнопкам Winter, Spring, Summer, Autumn в секции portfolio отображаются изображения из папки с соответствующим названием +20
    - кнопка, по которой кликнули, становится активной т.е. выделяется стилем. Другие кнопки при этом будут неактивными +5
2. Перевод страницы на два языка +25
    - при клике по надписи ru англоязычная страница переводится на русский язык +10
    - при клике по надписи en русскоязычная страница переводится на английский язык +10
    - надписи en или ru, соответствующие текущему языку страницы, становятся активными т.е. выделяются стилем +5
3. Переключение светлой и тёмной темы +25
    Внешний вид тёмной темы соответствует макету, который верстали в предыдущих частях задания, внешний вид светлой темы соответствует одному из двух вариантов макетов на выбор.
    Вариант первый. Блоки и секции header, hero, contacts, footer остались без изменений, в оставшихся секциях цвет фона и шрифта поменялись местами: фон стал белым, шрифт черным Макет в figma - светлая тема - 1
    На страницу добавлен переключатель при клике по которому:
    - тёмная тема приложения сменяется светлой +10
    - светлая тема приложения сменяется тёмной +10
    - после смены светлой и тёмной темы интерактивные элементы по-прежнему изменяют внешний вид при наведении и клике и при этом остаются видимыми на странице (нет ситуации с белым шрифтом на белом фоне) +5
4. Дополнительный функционал: выбранный пользователем язык отображения страницы и светлая или тёмная тема сохраняются при перезагрузке страницы +5
5. Дополнительный функционал: сложные эффекты для кнопок при наведении и/или клике +5.
    
Все требования к функционалу выполнены. 85 / 85 баллов.
`);
