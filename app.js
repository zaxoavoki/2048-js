// Initiate field for game
let SCORE = 0;
const HEIGHT = 4;
const WIDTH = 4;
const FIELD = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
];
// TODO: Add universal size

// Additional function to remove zero values
function removeZeros(array, position = "l") {
	array = array.filter((e) => e !== 0);
	lPart = position === "l" ? array : [];
	rPart = position === "r" ? array : [];
	return [...lPart, ...new Array(WIDTH - array.length).fill(0), ...rPart];
}

// Move all numbers to down side
function moveDown() {
	for (let i = 0; i < WIDTH; i++) {
        column = removeZeros(FIELD.map((e) => e[i]), 'r');
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
		if (array[j] === array[j + 1]) {
            SCORE += array[j] + array[j + 1];
			array[j] = array[j] + array[j + 1];
			array[j + 1] = 0;
			array = removeZeros(array);
		}
	}
	return array;
}

// Slide all numbers to the right side
function slideRight(array) {
	for (let j = WIDTH - 1; j >= 0; j--) {
		if (array[j] === array[j - 1]) {
            SCORE += array[j] + array[j - 1];
			array[j] = array[j] + array[j - 1];
			array[j - 1] = 0;
			array = removeZeros(array, "r");
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

// Main handler
document.onkeydown = function (e) {
	if (e.key == "a") moveLeft();
	if (e.key == "d") moveRight();
	if (e.key == "s") moveDown();
	if (e.key == "w") moveUp();
    newRandomCell();
    console.log(SCORE)
    refreshUI();
};

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
    // TODO: Add Game over option
	return free[Math.floor(Math.random() * free.length)] || [0, 0];
}

// Refresh UI by redrawing field
function refreshUI() {
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

// Add two first random cells
function initiateCells() {
	newRandomCell();
	newRandomCell();
}

initiateCells();
refreshUI();
