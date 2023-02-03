const rendomBG = [
	'#B15B00',
	'#4E8397',
	'#00896F',
	'#4B4453',
	'#FF8066',
	'#A178DF'
];

function generateRandomColorOfBody(list) {
	const min = 0;
	const max = list.length - 1;
	const rand = min - 0.5 + Math.random() * (max - min + 1);
	document.body.style.backgroundColor = list[Math.round(rand)];
}