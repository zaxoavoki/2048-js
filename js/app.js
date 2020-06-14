let WON = false;
let GENERATE_RANDOM = false;
let SCORE = 0;

// Initiate field for game
const HEIGHT = 4;
const WIDTH = 4;
const FIELD = new Array(HEIGHT).fill().map(() => new Array(WIDTH).fill(0));

// Additional function to remove zero values
function removeZeros(array, position = "l") {
	const prev = [...array];

	array = array.filter((e) => e !== 0);
	lPart = position === "l" ? array : [];
	rPart = position === "r" ? array : [];
	array = [...lPart, ...new Array(WIDTH - array.length).fill(0), ...rPart];

	// Check if smth has changed
	if (JSON.stringify(prev) != JSON.stringify(array)) {
		GENERATE_RANDOM = true;
	}

	return array;
}

// Move all numbers to down side
function moveDown() {
	for (let i = 0; i < WIDTH; i++) {
		column = removeZeros(FIELD.map((e) => e[i]), "r");
		column = slideRight(column);
		for (let j = 0; j < HEIGHT; j++) {
			FIELD[j][i] = column[j];
		}
	}
}

// Move numbers to the up side
function moveUp() {
	for (let i = 0; i < WIDTH; i++) {
		column = removeZeros(FIELD.map((e) => e[i]));
		column = slideLeft(column);
		for (let j = 0; j < HEIGHT; j++) {
			FIELD[j][i] = column[j];
		}
	}
}

// Slide all numbers to the left side
function slideLeft(array) {
	for (let j = 0; j < WIDTH - 1; j++) {
		if (array[j] === array[j + 1] && array[j] !== 0) {
			SCORE += array[j] + array[j + 1];
			array[j] = array[j] + array[j + 1];
			if (array[j] === 2048) {
				WON = true;
			}
			array[j + 1] = 0;
			array = removeZeros(array);
			GENERATE_RANDOM = true;
		}
	}
	return array;
}

// Slide all numbers to the right side
function slideRight(array) {
	for (let j = WIDTH - 1; j >= 0; j--) {
		if (array[j] === array[j - 1] && array[j] !== 0) {
			SCORE += array[j] + array[j - 1];
			array[j] = array[j] + array[j - 1];
			if (array[j] === 2048) {
				WON = true;
			}
			array[j - 1] = 0;
			array = removeZeros(array, "r");
			GENERATE_RANDOM = true;
		}
	}
	return array;
}

// Move in left direction
function moveLeft() {
	for (let i = 0; i < HEIGHT; i++) {
		FIELD[i] = removeZeros(FIELD[i]);
		FIELD[i] = slideLeft(FIELD[i]);
	}
}

// Move in right direction
function moveRight() {
	for (let i = 0; i < HEIGHT; i++) {
		FIELD[i] = removeZeros(FIELD[i], "r");
		FIELD[i] = slideRight(FIELD[i]);
	}
}

// Check if there is any move to do
function checkLose() {
	for (let i = 0; i < HEIGHT; i++) {
		for (let j = 0; j < WIDTH; j++) {
			if (FIELD[i][j] === 0) {
				return false;
			}

			if (i < HEIGHT - 1 && FIELD[i][j] == FIELD[i + 1][j]) {
				return false;
			}

			if (j < WIDTH - 1 && FIELD[i][j] == FIELD[i][j + 1]) {
				return false;
			}
		}
	}
	return true;
}

// Change background and write end message
function endGame(background, text) {
	document.getElementById("game-container").style.background = background;
	document.getElementById("game-dialog").innerHTML = text;
	if (text === "Game Over") {
		document.getElementById("game-dialog").style.color = "#776e65";
	}
	document.removeEventListener("keydown", move);
}

// Main key handler
function move(e) {
	GENERATE_RANDOM = false;

	if (e.key == "a") moveLeft();
	if (e.key == "d") moveRight();
	if (e.key == "s") moveDown();
	if (e.key == "w") moveUp();

	if ("adsw".includes(e.key)) {
		if (GENERATE_RANDOM) {
			newRandomCell();
		}
		refreshUI();
		if (WON) {
			endGame("rgba(255, 217, 0, 0.4)", "You win!");
		}
		if (checkLose()) {
			endGame("rgba(255, 255, 255, .6)", "Game Over");
		}
	}
}

// Add new random cell on the field
function newRandomCell() {
	const [i, j] = getRandomCoordinates();
	FIELD[i][j] = 2;
}

// Get coordinates of random cell on the field by finding zeros cell
function getRandomCoordinates() {
	let free = [];
	for (let i = 0; i < HEIGHT; i++) {
		for (let j = 0; j < WIDTH; j++) {
			if (FIELD[i][j] == 0) {
				free.push([i, j]);
			}
		}
	}
	return free[Math.floor(Math.random() * free.length)] || [0, 0];
}

// Refresh UI by redrawing field
function refreshUI() {
	document.getElementById("game-score").innerHTML = SCORE;
	for (let i = 0; i < HEIGHT; i++) {
		for (let j = 0; j < WIDTH; j++) {
			const cell = document.getElementById(i * 4 + j + 1);
			cell.className = "";
			cell.innerHTML = "";
			cell.classList.add(`_${FIELD[i][j]}`, "c");
			if (FIELD[i][j] != 0) {
				cell.innerHTML = FIELD[i][j];
			}
		}
	}
}

// Generate div blocks
function createCells() {
	const f = document.getElementById("field");
	for (let i = 0; i < HEIGHT * WIDTH; i++) {
		const cell = document.createElement("div");
		cell.setAttribute("id", i + 1);
		f.appendChild(cell);
	}
}

document.addEventListener("keydown", move);

// Game begins from two random cells
createCells();
newRandomCell();
newRandomCell();
refreshUI();

// TODO: Change font size
// TODO: Add step back
