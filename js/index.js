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

const months = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'June',
	'July',
	'August',
	'Sept',
	'Oct',
	'Nov',
	'Dec'
]

function generateRandomColorOfBody(list) {
	const min = 0;
	const max = list.length - 1;
	const rand = min - 0.5 + Math.random() * (max - min + 1);
	document.body.style.backgroundColor = list[Math.round(rand)];
}

let currentId = 0;

generateRandomColorOfBody(rendomBG);

function addListItem() {
	const description = refs.myInput.value;
	if (description === "") {
		showNotification(refs.addAlert);
		return;
	}

	const dateNow = convertTime(Date.now());
	const { year, month, date, hours, minutes, sec } = dateNow;
	const time =
		`${year}, ${months[month]} ${addLeadingZero(date)}, ${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(sec)}`;

	refs.todoList.appendChild(createItemList(description, time));
	addTaskToStorage(description.trim(), dateNow);

	refs.myInput.value = '';
}

function createItemList(descr, time, isDone = false, id = currentId) {
	const itemList = document.createElement('li');
	itemList.classList.add('todo-list__item');
	itemList.dataset.id = id;
	if (isDone) itemList.classList.add('checked');
	itemList.appendChild(createNodeText(descr, 'todo-list__item-description'));
	itemList.appendChild(createNodeText(time, 'todo-list__item-date'));
	itemList.appendChild(getCloseBtn());
	return itemList;
}

function createNodeText(text, className) {
	const descriptionItem = document.createElement('p');
	descriptionItem.classList.add(className);
	descriptionItem.textContent = text;
	return descriptionItem;
}

function getCloseBtn() {
	const closeBtn = document.createElement('button');
	closeBtn.className = 'close-btn';
	closeBtn.appendChild(document.createTextNode("\u2573"));

	return closeBtn;
}

function showNotification(notification) {
	if (notification.classList.contains('active')) {
		return;
	}
	notification.classList.add('active');
	setTimeout(() => {
		notification.classList.remove('active');
	}, 4000);
}

function convertTime(ms) {
	const d = new Date();
	const year = d.getFullYear();
	const month = d.getMonth();
	const date = d.getDate();
	const daysms = ms % (24*60*60*1000);
	const hours = Math.floor(daysms / (60*60*1000));
	const hoursms = ms % (60*60*1000);
	const minutes = Math.floor(hoursms / (60*1000));
	const minutesms = ms % (60*1000);
	const sec = Math.floor(minutesms / 1000);
	return {year, month, date, hours, minutes, sec}
}

function addLeadingZero(value) {
	return String(value).padStart(2, '0');
}

refs.addBtn.addEventListener('click', addListItem);