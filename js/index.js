const refs = {
	todoList: document.getElementById('todo-list-js'),
	myInput: document.getElementById('todo-input'),
	addBtn: document.querySelector('.add-item-btn'),
	sortBtn: document.querySelector('.sort-items-btn'),
	sortArrow: document.querySelector('.sort-arrow'),
	clearBtn: document.querySelector('.clear-items-btn'),
	addAlert: document.querySelector('.add-alert'),
	oneAlert: document.querySelector('.one-alert'),
	emptyAlert: document.querySelector('.empty-alert'),
	myULItem: document.querySelectorAll('.todo-list__item'),
	closeBtn: document.getElementsByClassName('close'),
}

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

generateRandomColorOfBody(rendomBG);