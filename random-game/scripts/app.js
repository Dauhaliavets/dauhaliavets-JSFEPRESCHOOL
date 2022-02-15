import createFooter from './footer.js';

const body = document.querySelector('body');
const gameField = document.querySelector('.game__field');
const startBtn = document.querySelector('.button__start');
const scoreRes = document.querySelector('.score');
const scoreBestRes = document.querySelector('.score-best');
const recordsBtn = document.querySelector('.button__records');
const settingsBtn = document.querySelector('.button__settings');
const settings = document.querySelector('.settings');
const sizeBtns = document.querySelectorAll('.size');
const musicBtn = document.querySelector('.settings__music-input');

const audio = new Audio('./assets/mp3/track.mp3');
audio.loop = true;
audio.autoplay = true;
audio.volume = 0.5;
body.appendChild(audio);

const state = {
	fieldSize: 3,
	fieldMatrix: [],
	score: 0,
	scoreBest: 0,
	win: false,
	playMusic: true,
};

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

function setCell(x, y, value) {
	return { x: x, y: y, value: value };
}

function createField(size) {
	const fieldMatrix = [];

	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			let cell = setCell(i, j, 0);
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
				duration: 200,
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
	const isEmpryCells = getIsEmptyCellsToMatrix();

	if (isEmpryCells) {
		let ind = getRandomIndex();
		let value = getRandomValue();

		if (state.fieldMatrix[ind].value === 0) {
			state.fieldMatrix[ind].value = value;
			return state.fieldMatrix[ind];
		} else {
			return setRandomValueToMatrix(state.fieldMatrix);
		}
	} else {
		let isMerge = getIsMerge();
		if (!isMerge) {
			console.log('GAME OVER after set random value');
		} else {
			alert('Еще не все пропало:) Можно соединить ячейки!');
		}
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
// =============================== Animation ========================================================
function animate({ timing, draw, duration }) {
	let start = performance.now();

	requestAnimationFrame(function animate(time) {
		// timeFraction изменяется от 0 до 1
		let timeFraction = (time - start) / duration;
		if (timeFraction > 1) timeFraction = 1;

		// вычисление текущего состояния анимации
		let progress = timing(timeFraction);

		draw(progress); // отрисовать её

		if (timeFraction < 1) {
			requestAnimationFrame(animate);
		}
	});
}
// ================================= Animation =====================================================

function showResult(parentElement, content) {
	const result = createHTMLElement('div', 'result', '', '', content);

	if (!parentElement.children[0].classList.contains('result')) {
		parentElement.insertAdjacentElement('afterbegin', result);
	}
}

function init() {
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

	createGameField();

	startBtn.addEventListener('click', () => {
		state.score = 0;
		scoreRes.textContent = `${state.score}`;
		createGameField();
		createField(state.fieldSize);
		renderField(fieldBlock);
		toggleShowSettings();
	});

	settingsBtn.addEventListener('click', toggleShowSettings);

	function toggleShowSettings() {
		if (settings.classList.contains('settings__show')) {
			settings.classList.remove('settings__show');
		} else {
			settings.classList.add('settings__show');
		}
	}

	sizeBtns.forEach((btn) =>
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
		})
	);

	musicBtn.addEventListener('change', (e) => {
		console.log(e.target.checked);
		if(e.target.checked) {
			audio.play();
		} else {
			audio.pause();
		}
	});



	body.onkeydown = function (e) {
		let newCell;

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

		scoreRes.textContent = `${state.score}`;
		if (state.scoreBest < state.score) {
			state.scoreBest = state.score;
			scoreBestRes.textContent = state.scoreBest;
		}

		if (state.win) {
			// console.log('winner');
			showResult(fieldBlock, `You winner! Your score: ${state.score}`);
		} else {
			let isEmpryCells = getIsEmptyCellsToMatrix();
			let isMerge = getIsMerge();

			if (isEmpryCells) {
				newCell = setRandomValueToMatrix();
				renderField(fieldBlock, newCell);
			} else if (isMerge) {
				renderField(fieldBlock);
			} else {
				// console.log('Loser');
				showResult(fieldBlock, `You loser! Your score: ${state.score}`);
			}
		}
	};

	// Footer
	const footer = createFooter();
	body.appendChild(footer);
	// Footer
}

init();

// console.log(state)
