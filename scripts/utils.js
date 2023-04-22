// function rectangleOverlap(rect1, rect2) {
//     console.log(rect1, rect1);
// 	// Extract coordinates of the two rectangles
// 	const {x: x1, y: y1, width: w1, height: h1} = rect1;
// 	const {x: x2, y: y2, width: w2, height: h2} = rect2;

// 	// Calculate the coordinates of the edges of each rectangle
// 	const rect1Left = x1;
// 	const rect1Right = x1 + w1;
// 	const rect1Top = y1;
// 	const rect1Bottom = y1 + h1;

// 	const rect2Left = x2;
// 	const rect2Right = x2 + w2;
// 	const rect2Top = y2;
// 	const rect2Bottom = y2 + h2;

// 	// Check for overlap
// 	const overlapLeft = Math.max(rect1Left, rect2Left);
// 	const overlapRight = Math.min(rect1Right, rect2Right);
// 	const overlapTop = Math.max(rect1Top, rect2Top);
// 	const overlapBottom = Math.min(rect1Bottom, rect2Bottom);

// 	// Calculate the width and height of the overlap
// 	const overlapWidth = overlapRight - overlapLeft;
// 	const overlapHeight = overlapBottom - overlapTop;

// 	// Determine which edges overlap
// 	const edges = [];
// 	if (overlapWidth > 0) {
// 		if (overlapLeft === rect1Left && overlapRight === rect2Right) {
// 			edges.push("left-right");
// 		} else if (overlapLeft === rect2Left && overlapRight === rect1Right) {
// 			edges.push("right-left");
// 		}
// 	}
// 	if (overlapHeight > 0) {
// 		if (overlapTop === rect1Top && overlapBottom === rect2Bottom) {
// 			edges.push("top-bottom");
// 		} else if (overlapTop === rect2Top && overlapBottom === rect1Bottom) {
// 			edges.push("bottom-top");
// 		}
// 	}

// 	if (edges.length > 0) {
// 		return {
// 			overlap: true,
// 			edges: edges,
// 		};
// 	} else {
// 		return {
// 			overlap: false,
// 			edges: [],
// 		};
// 	}
// }

function rectanglesOverlap(r1, r2) {
	return (
		r1.x <= r2.x + r2.width &&
		r1.x + r1.width >= r2.x &&
		r1.y <= r2.y + r2.height &&
		r1.y + r1.height >= r2.y
	);
}

function findOverlapping(target, others) {
	let overlapping = [];
	for (let other of others) {
		if (rectanglesOverlap(target, other)) {
			overlapping.push(other);
		}
	}
	return overlapping;
}

function randomXYIn(itemWidth, itemHeight, canvasWidth, canvasHeight) {
	return {
		x: randomIntBetween(0, canvasWidth - itemWidth),
		y: randomIntBetween(0, canvasHeight - itemHeight),
	};
}

function randomIntBetween(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFromArray(array) {
	return array[randomIntBetween(0, array.length - 1)];
}

function randomSign() {
	if (randomIntBetween(0, 1) <= 0.5) {
		return -1;
	}
	return 1;
}

function createOscillator(min, max, rate) {
	let currentValue = min;
	let increasing = true;

	return () => {
		if (increasing) {
			currentValue += (rate * (max - min)) / 1000;
			if (currentValue >= max) {
				increasing = false;
			}
		} else {
			currentValue -= (rate * (max - min)) / 1000;
			if (currentValue <= min) {
				increasing = true;
			}
		}
		return currentValue;
	};
}

export {
	rectanglesOverlap,
	findOverlapping,
	randomXYIn,
	randomIntBetween,
	randomFromArray,
	randomSign,
};
