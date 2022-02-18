import createFooter from './footer.js';
import animate from './animate.js';
import log from './self-assessment.js';

const body = document.querySelector('body');
const gameField = document.querySelector('.game__field');
const startBtn = document.querySelector('.button__start');
const scoreRes = document.querySelector('.score');
const scoreBestRes = document.querySelector('.score-best');
const recordsBtn = document.querySelector('.button__records');
const records = document.querySelector('.records');
const resordsBest = document.querySelector('.records__score-best');
const resordsLast = document.querySelector('.records__score-last');
const settingsBtn = document.querySelector('.button__settings');
const settings = document.querySelector('.settings');
const sizeBtns = document.querySelectorAll('.size');
const musicBtn = document.querySelector('.settings__music-input');

const state = {
	fieldSize: null,
	fieldMatrix: [],
	score: 0,
	scoreLast: [],
	scoreBest: 0,
	win: false,
};

window.addEventListener('load', () => {
	state.fieldSize = JSON.parse(localStorage.getItem('fieldSize')) ?? 4;
	state.scoreLast = JSON.parse(localStorage.getItem('scoreLast')) ?? [];
	state.scoreBest = JSON.parse(localStorage.getItem('scoreBest')) ?? 0;

	init();
});

window.addEventListener('unload', () => {
	localStorage.setItem('fieldSize', JSON.stringify(state.fieldSize));
	localStorage.setItem('scoreLast', JSON.stringify(state.scoreLast));
	localStorage.setItem('scoreBest', JSON.stringify(state.scoreBest));
});

function createHTMLElement(
	tagName = 'div',
	className = '',
	width = '0',
	height = '0',
	content = ''
) {
	const el = document.createElement(tagName);
	el.className = className;
	el.style.width = width + 'px';
	el.style.height = height + 'px';
	el.textContent = content;

	return el;
}

function createField(size) {
	const fieldMatrix = [];

	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			let cell = { x: i, y: j, value: 0 };
			fieldMatrix.push(cell);
		}
	}

	state.fieldMatrix = fieldMatrix;
}

function renderField(fieldElement, newItem) {
	fieldElement.innerHTML = '';

	for (let i = 0; i < state.fieldMatrix.length; i++) {
		let { x, y, value } = state.fieldMatrix[i];

		let cellElement = createHTMLElement(
			'div',
			`cell cell-${value}`,
			'100',
			'100',
			`${value || ''}`
		);

		if (
			!!newItem &&
			x === newItem.x &&
			y === newItem.y &&
			value === newItem.value
		) {
			animate({
				duration: 150,
				timing(timeFraction) {
					return timeFraction;
				},
				draw(progress) {
					cellElement.style.transform = `scale(${progress})`;
				},
			});
		}

		fieldElement.appendChild(cellElement);
	}
}

function getRandomValue() {
	return Math.random() > 0.9 ? 4 : 2;
}

function getRandomIndex() {
	return Math.round(Math.random() * (state.fieldSize * state.fieldSize - 1));
}

function setRandomValueToMatrix() {
	let ind = getRandomIndex();
	let value = getRandomValue();

	if (state.fieldMatrix[ind].value === 0) {
		state.fieldMatrix[ind].value = value;
		return state.fieldMatrix[ind];
	} else {
		return setRandomValueToMatrix(state.fieldMatrix);
	}
}

function getIsEmptyCellsToMatrix() {
	return state.fieldMatrix.filter((cell) => cell.value === 0).length !== 0;
}

function getIsMerge() {
	let bool = false;
	for (let i = 0; i < state.fieldSize; i++) {
		let itemsRow = state.fieldMatrix.filter((item) => item.x === i);
		let itemsCol = state.fieldMatrix.filter((item) => item.y === i);

		for (let j = 0; j < state.fieldSize - 1; j++) {
			if (itemsRow[j].value === itemsRow[j + 1].value) {
				if (itemsRow[j].value !== 0) {
					bool = true;
				}
			}

			if (itemsCol[j].value === itemsCol[j + 1].value) {
				if (itemsCol[j].value !== 0) {
					bool = true;
				}
			}
		}
	}

	return bool;
}

// Функция перемещения элементов по направлению left / right
function moveLeftOrRight(toDirection) {
	let itemsRow = [];
	let newFieldMatrix = [];

	for (let i = 0; i < state.fieldSize; i++) {
		// Фильтруем элементы по рядам
		itemsRow = state.fieldMatrix.filter((el) => el.x === i);
		// Фильтруем элементы отличные от 0
		itemsRow = itemsRow.filter((item) => item.value !== 0);
		if (!itemsRow.length) {
			// itemsRow пуст, т.е. в ряду были все нули, заполняем все items.value = 0
			for (let j = 0; j < state.fieldSize; j++) {
				itemsRow.push({ x: i, y: j, value: 0 });
			}
		} else {
			// itemsRow содержит > 2 элементов, value которых !== 0
			if (itemsRow.length > 1) {
				if (toDirection === 'left') {
					// Если сдвиг влево, то обходим массив itemsRow слева направо
					// суммируя одинаковые элементы current и next
					for (let n = 0; n < itemsRow.length - 1; n++) {
						if (itemsRow[n].value === itemsRow[n + 1].value) {
							itemsRow[n].value += itemsRow[n + 1].value;

							if (itemsRow[n].value === 2048) {
								state.win = true;
							}

							// Когда к текущему элементу добавлен следующий элемент
							// след.элементу устонавливаем значение 0
							// обновляем значение в score
							itemsRow[n + 1].value = 0;
							state.score += itemsRow[n].value;
							// Фильтруем массив от item.value = 0 и выходим из цикла
							itemsRow = itemsRow.filter((item) => item.value !== 0);
							break;
						}
					}
				} else if (toDirection === 'right') {
					// Исли сдвиг вправо, то обходим массив справо налево
					// суммируя одинаковые элементы current и next // itemsRow[3] и itemsRow[2]
					for (let n = itemsRow.length - 1; n > 0; n--) {
						if (itemsRow[n].value === itemsRow[n - 1].value) {
							itemsRow[n].value += itemsRow[n - 1].value;

							if (itemsRow[n].value === 2048) {
								state.win = true;
							}

							// Когда к текущему элементу добавлен следующий элемент
							// след.элементу устонавливаем значение 0
							// обновляем значение в score
							itemsRow[n - 1].value = 0;
							state.score += itemsRow[n].value;
							// Фильтруем массив от item.value = 0 и выходим из цикла
							itemsRow = itemsRow.filter((item) => item.value !== 0);
							break;
						}
					}
				}
			}
			// Если нажали left, то заполняем последние элементы itemsRow объектами с value 0
			// Если нажали right, то заполняем первые элементы itemsRow объектами с value 0
			// Индексы Y не важны
			let arrayOfZeros = new Array(state.fieldSize - itemsRow.length).fill({
				x: i,
				y: 0,
				value: 0,
			});
			if (toDirection === 'left') {
				itemsRow = itemsRow.concat(arrayOfZeros);
			} else if (toDirection === 'right') {
				itemsRow = arrayOfZeros.concat(itemsRow);
			}
		}
		// Восстанавливаем индексы Y
		itemsRow = itemsRow.map((el, ind) => {
			return { x: el.x, y: ind, value: el.value };
		});
		// Каждый массив itemsRow пушим поочередно в промежуточный массив
		newFieldMatrix.push(...itemsRow);
	}
	// Изменяем матрицу в state
	state.fieldMatrix = newFieldMatrix;
}
// Функция перемещения элементов по направлению up / down
function moveUpOrDown(toDirection) {
	let itemsCol = [];
	let newFieldMatrix = [];

	for (let i = 0; i < state.fieldSize; i++) {
		// Фильтруем элементы по рядам
		itemsCol = state.fieldMatrix.filter((el) => el.y === i);
		// Фильтруем элементы отличные от 0
		itemsCol = itemsCol.filter((item) => item.value !== 0);

		if (!itemsCol.length) {
			// itemsCol пуст, т.е. в ряду были все нули, заполняем все items.value = 0
			for (let j = 0; j < state.fieldSize; j++) {
				itemsCol.push({ x: j, y: i, value: 0 });
			}
		} else {
			// itemsCol содержит > 1 элементов, value которых !== 0
			if (itemsCol.length > 1) {
				if (toDirection === 'up') {
					// Исли сдвиг вверх, то обходим массив слева направо
					// суммируя одинаковые элементы current и next
					for (let n = 0; n < itemsCol.length - 1; n++) {
						if (itemsCol[n].value === itemsCol[n + 1].value) {
							itemsCol[n].value += itemsCol[n + 1].value;

							if (itemsCol[n].value === 2048) {
								state.win = true;
							}

							// Когда к текущему элементу добавлен следующий элемент
							// след.элементу устонавливаем значение 0
							// обновляем значение в score
							itemsCol[n + 1].value = 0;
							state.score += itemsCol[n].value;
							// Фильтруем массив от item.value = 0 и выходим из цикла
							itemsCol = itemsCol.filter((item) => item.value !== 0);
							break;
						}
					}
				} else if (toDirection === 'down') {
					// Исли сдвиг вниз, то обходим массив справо налево
					// суммируя одинаковые элементы current и next // itemsCol[3] и itemsCol[2]
					for (let n = itemsCol.length - 1; n > 0; n--) {
						if (itemsCol[n].value === itemsCol[n - 1].value) {
							itemsCol[n].value += itemsCol[n - 1].value;

							if (itemsCol[n].value === 2048) {
								state.win = true;
							}

							// Когда к текущему элементу добавлен следующий элемент
							// след.элементу устонавливаем значение 0
							// обновляем значение в score
							itemsCol[n - 1].value = 0;
							state.score += itemsCol[n].value;
							// Фильтруем массив от item.value = 0 и выходим из цикла
							itemsCol = itemsCol.filter((item) => item.value !== 0);
							break;
						}
					}
				}
			}
			// Если нажали left, то заполняем последние элементы itemsCol объектами с value 0
			// Если нажали right, то заполняем первые элементы itemsCol объектами с value 0
			// Индексы X не важны
			let arrayOfZeros = new Array(state.fieldSize - itemsCol.length).fill({
				x: 0,
				y: i,
				value: 0,
			});
			if (toDirection === 'up') {
				itemsCol = itemsCol.concat(arrayOfZeros);
			} else if (toDirection === 'down') {
				itemsCol = arrayOfZeros.concat(itemsCol);
			}
		}
		// Восстанавливаем индексы Y
		itemsCol = itemsCol.map((el, ind) => {
			return { x: ind, y: el.y, value: el.value };
		});
		// Каждый массив itemsCol пушим поочередно в промежуточный массив
		newFieldMatrix.push(...itemsCol);
	}
	// Восстонавливаем порядок по Х
	newFieldMatrix.sort((a, b) => a.x - b.x);
	// Изменяем матрицу в state
	state.fieldMatrix = newFieldMatrix;
}

function showResult(parentElement, content) {
	const result = createHTMLElement('div', 'result', '', '', content);

	if (!parentElement.children[0].classList.contains('result')) {
		parentElement.insertAdjacentElement('afterbegin', result);
	}
}

function closePopupItem(item, itemClassName) {
	if (item.classList.contains(`${itemClassName}__show`)) {
		item.classList.remove(`${itemClassName}__show`);
	}
}

function toggleShowPopupItem(item, itemClassName) {
	if (item.classList.contains(`${itemClassName}__show`)) {
		item.classList.remove(`${itemClassName}__show`);
	} else {
		item.classList.add(`${itemClassName}__show`);
	}
}

function updateRecords() {
	resordsBest.textContent = state.scoreBest;
	resordsLast.innerHTML = '';

	let number = 1;
	for (let i = state.scoreLast.length - 1; i >= 0; i--) {
		const el = document.createElement('p');
		el.textContent = `${number}. ${state.scoreLast[i]}`;
		number++;
		resordsLast.appendChild(el);
	}
}

function setScoreAfterMove() {
	scoreRes.textContent = `${state.score}`;
	if (state.scoreBest < state.score) {
		state.scoreBest = state.score;
		scoreBestRes.textContent = state.scoreBest;
	}
}

let fieldBlock;
function createGameField() {
	gameField.innerHTML = '';

	fieldBlock = createHTMLElement(
		'div',
		'field',
		state.fieldSize * 110,
		state.fieldSize * 110,
		''
	);

	gameField.appendChild(fieldBlock);
}

function checkGameOverAfterMove() {
	let newCell;

	if (state.win) {
		showResult(fieldBlock, `You winner! Your score: ${state.score}`);
		updateLastScoreForRecords();
		body.onkeydown = null;
	} else {
		let isEmpryCells = getIsEmptyCellsToMatrix();
		let isMerge;

		if (isEmpryCells) {
			newCell = setRandomValueToMatrix();
			renderField(fieldBlock, newCell);

			isEmpryCells = getIsEmptyCellsToMatrix();
			isMerge = getIsMerge();
			if (!isEmpryCells && !isMerge) {
				showResult(fieldBlock, `You loser! Your score: ${state.score}`);
				updateLastScoreForRecords();
				body.onkeydown = null;
			}
		}
	}
}

function handlerOnKeyDown(e) {
	switch (e.code) {
		case 'ArrowUp':
			moveUpOrDown('up');
			break;
		case 'ArrowDown':
			moveUpOrDown('down');
			break;
		case 'ArrowRight':
			moveLeftOrRight('right');
			break;
		case 'ArrowLeft':
			moveLeftOrRight('left');
			break;
		default:
			break;
	}

	renderField(fieldBlock);
	setScoreAfterMove();
	checkGameOverAfterMove();
}

function updateLastScoreForRecords(){
	if (state.scoreLast.length > 9) {
		state.scoreLast.shift();
	}
	state.scoreLast.push(state.score);
}

function init() {
	const audio = new Audio('./assets/mp3/track.mp3');
	audio.loop = true;
	audio.volume = 0.2;
	body.appendChild(audio);

	scoreBestRes.textContent = state.scoreBest;
	resordsBest.textContent = state.scoreBest;

	createGameField();

	startBtn.addEventListener('click', () => {		
		state.score = 0;
		scoreRes.textContent = `${state.score}`;

		body.onkeydown = (e) => handlerOnKeyDown(e);

		closePopupItem(settings, 'settings');
		closePopupItem(records, 'records');
		createGameField();
		createField(state.fieldSize);
		renderField(fieldBlock);
	});

	recordsBtn.addEventListener('click', () => {
		closePopupItem(settings, 'settings');
		updateRecords();
		toggleShowPopupItem(records, 'records');
	});

	settingsBtn.addEventListener('click', () => {
		closePopupItem(records, 'records');
		toggleShowPopupItem(settings, 'settings');
	});

	sizeBtns.forEach((btn) => {
		if (btn.dataset.size == state.fieldSize) {
			btn.classList.add('active');
		}

		btn.addEventListener('click', (e) => {
			const sizeTarget = e.target.dataset.size;

			sizeBtns.forEach((btn) => {
				if (btn.dataset.size === sizeTarget) {
					btn.classList.add('active');
					state.fieldSize = +sizeTarget;
					createGameField();
				} else {
					btn.classList.remove('active');
				}
			});
		});
	});

	musicBtn.addEventListener('change', (e) => {
		if (e.target.checked) {
			audio.play();
		} else {
			audio.pause();
		}
	});

	// Footer
	const footer = createFooter();
	body.appendChild(footer);
	// Footer
}

log();