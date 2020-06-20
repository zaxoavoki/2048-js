const HEIGHT = 4;
const WIDTH = HEIGHT;
const FIELD = new Array(HEIGHT).fill().map(() => new Array(WIDTH).fill(0));
const COVER = {
	win: {
		color: "rgba(255, 217, 0, .4)",
		text: "You win!",
	},
	lose: {
		color: "rgba(255, 255, 255, .6)",
		text: "Game Over",
	},
};

let WON = false;
let GENERATE_NEXT = false;
let SCORE = 0;

// Additional function to remove zero values
function removeZeros(array, position = "l") {
	const prev = [...array];

	array = array.filter((e) => e !== 0);
	lPart = position === "l" ? array : [];
	rPart = position === "r" ? array : [];
	array = [...lPart, ...new Array(WIDTH - array.length).fill(0), ...rPart];

	// Check if smth has changed
	if (JSON.stringify(prev) != JSON.stringify(array)) {
		GENERATE_NEXT = true;
	}

	return array;
}

// Move all numbers to down side
function moveDown() {
	for (let i = 0; i < WIDTH; i++) {
		column = removeZeros(
			FIELD.map((e) => e[i]),
			"r"
		);
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
			if (array[j] >= 2048) {
				WON = true;
			}
			array[j + 1] = 0;
			array = removeZeros(array);
			GENERATE_NEXT = true;
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
			if (array[j] >= 2048) {
				WON = true;
			}
			array[j - 1] = 0;
			array = removeZeros(array, "r");
			GENERATE_NEXT = true;
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
			if (
				FIELD[i][j] === 0 ||
				(i < HEIGHT - 1 && FIELD[i][j] == FIELD[i + 1][j]) ||
				(j < WIDTH - 1 && FIELD[i][j] == FIELD[i][j + 1])
			) {
				return false;
			}
		}
	}
	return true;
}

// Change background and write end message
function setWrapper(win = true, background, text, btn = "block") {
	document.getElementById("game-dialog").innerHTML = text;
	document.getElementById("game-reset").style.display = btn;
	document.getElementById("game-container").style.background = background;
	document.getElementById("game-dialog").style.color = win ? "fff" : "#776e65";
	document.removeEventListener("keydown", move);
}

// Main key handler
function move(e) {
	GENERATE_NEXT = false;

	if (e.key == "a") moveLeft();
	if (e.key == "d") moveRight();
	if (e.key == "s") moveDown();
	if (e.key == "w") moveUp();

	if ("adsw".includes(e.key)) {
		if (GENERATE_NEXT) newRandomCell();
		refreshUI();
		if (WON) setWrapper(true, COVER.win.color, COVER.win.text);
		if (checkLose()) setWrapper(false, COVER.lose.color, COVER.lose.text);
	}
}

// Add new random cell on the field
function newRandomCell() {
	// Get coordinates of random cell on the field by finding zeros cell
	function getRandomCoordinates() {
		let free = [];
		for (let i = 0; i < HEIGHT; i++) {
			for (let j = 0; j < WIDTH; j++) {
				if (FIELD[i][j] === 0) {
					free.push([i, j]);
				}
			}
		}
		return free[Math.floor(Math.random() * free.length)] || [0, 0];
	}

	const [i, j] = getRandomCoordinates();
	FIELD[i][j] = 2;
}

// Refresh UI by redrawing field
function refreshUI() {
	document.getElementById("game-score").innerHTML = SCORE;
	for (let i = 0; i < HEIGHT; i++) {
		for (let j = 0; j < WIDTH; j++) {
			const cell = document.getElementById(i * HEIGHT + j + 1);
			cell.className = "";
			cell.innerHTML = "";
			cell.classList.add(`_${FIELD[i][j]}`, "c");
			if (FIELD[i][j] !== 0) {
				cell.innerHTML = FIELD[i][j];
			}
		}
	}
}

// Resets game score and cells
function resetGame() {
	SCORE = 0;
	WON = false;
	GENERATE_NEXT = true;
	setWrapper(true, "", "", "none");
	document.addEventListener("keydown", move);

	// Reset field
	for (let i = 0; i < HEIGHT; i++) {
		for (let j = 0; j < WIDTH; j++) {
			FIELD[i][j] = 0;
		}
	}

	newRandomCell();
	newRandomCell();
	refreshUI();
}

// Insert nodes in DOM
function initiateCells() {
	const field = document.getElementById("field");
	for (let i = 0; i < WIDTH * HEIGHT; i++) {
		const cell = document.createElement("div");
		cell.className = "c";
		cell.id = i + 1;
		field.appendChild(cell);
	}

	// Insert style for class .c into css rules
	const style = document.createElement("style");
	document.head.appendChild(style);
	style.sheet.insertRule(
		`.c {
			width: calc(520px / ${WIDTH} - 20px);
			height: calc(520px / ${HEIGHT} - 20px); 
			line-height: calc(520px / ${HEIGHT} - 20px);
		}`
	);
}

document.addEventListener("keydown", move);
document.getElementById("game-reset").addEventListener("click", resetGame);

initiateCells();
resetGame();
