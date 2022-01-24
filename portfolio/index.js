import i18Obj from './js/translate.js';

const portfolioBtns = document.querySelectorAll('.portfolio-btn');
const portfolioImages = document.querySelectorAll('.portfolio-photo');

const langBtns = document.querySelectorAll('.lang');
const i18nItems = document.querySelectorAll('[data-i18n]');

portfolioBtns.forEach((btn) => {
	btn.addEventListener('click', (e) => {handlerBtnClick(e, 'season', portfolioBtns, 'active', showActiveItems)});
});

langBtns.forEach((btn) => {
	btn.addEventListener('click', (e) => {handlerBtnClick(e, 'lang', langBtns, 'current', changeLanguage)});
});

function handlerBtnClick(event, attr, selectors, activeClass, activeFunction) {
	const dataset = event.target.dataset[attr];

	selectors.forEach((selector) => {
		if (selector.dataset[attr] === dataset) {
			selector.classList.add(activeClass);
			activeFunction(dataset);
		} else {
			selector.classList.remove(activeClass);
		}
	});
}

function showActiveItems(dataset) {
	portfolioImages.forEach((image, index) => {
		image.src = `./assets/img/${dataset}/${index + 1}.jpg`;
		image.alt = `${dataset}-${index + 1}`;
	});
};

function changeLanguage(lang) {
	i18nItems.forEach((item) => {
		const attr = item.dataset.i18n;
		item.textContent = `${i18Obj[lang][attr]}`;
	});
};


// season portfolioBtns 'active' showActiveItems
// function handlerBtnClick(event) {
// 	const dataset = event.target.dataset.season;

// 	portfolioBtns.forEach((btn) => {
// 		if (btn.dataset.season === dataset) {
// 			btn.classList.add('active');
// 			showActiveItems(dataset);
// 		} else {
// 			btn.classList.remove('active');
// 		}
// 	});
// }
// lang langBtns 'current' changeLanguage
// function handlerLangClick(event) {
// 	const dataset = event.target.dataset.lang;

// 	langBtns.forEach((btn) => {
// 		if (btn.dataset.lang === dataset) {
// 			btn.classList.add('current');
// 			changeLanguage(dataset);
// 		} else {
// 			btn.classList.remove('current');
// 		}
// 	});
// };



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
