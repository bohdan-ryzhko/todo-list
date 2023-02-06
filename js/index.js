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
	showActiveBtn: document.querySelector('.active-items-btn'),
	checkedTasksAlert: document.querySelector('.checked-tasks'),
	myULItem: document.querySelectorAll('.todo-list__item'),
	closeBtn: document.getElementsByClassName('close'),
}

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

const LOCAL_KEY = 'localItem';
const SORT_ARROW = 'sortArrow';
const CLOSE_BTN = '\u2573'
const ARROW_DOWN = '\u2193';
const ARROW_UP = '\u2191';


let currentId = 0;

function fillTasksList() {
	const currentState = load(LOCAL_KEY);
	const currentSortArrow = load(SORT_ARROW);
	if (currentState !== undefined) {
		currentState.forEach(({ task, time, isDone, id }) => {
			const { year, month, date, hours, minutes, sec } = time;
			const timeNow =
				`${year}, ${months[month]} ${addLeadingZero(date)}, ${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(sec)}`;
			refs.todoList.appendChild(createItemList(task, timeNow, isDone, id));
			currentId = currentState[currentState.length - 1].id + 1;
		});
	}

	if (currentSortArrow === 'sort-arrow down' && refs.sortArrow.classList.contains('down')) {
		refs.sortArrow.classList.remove('up')
		refs.sortArrow.classList.add('down')
		addArrowSortBtn(ARROW_DOWN);
	} else if (currentSortArrow === 'sort-arrow up' && refs.sortArrow.classList.contains('up')) {
		refs.sortArrow.classList.remove('down')
		refs.sortArrow.classList.add('up')
		addArrowSortBtn(ARROW_UP);
	}
}

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

function save(key, value) {
	try {
		const serializedData = JSON.stringify(value);
		localStorage.setItem(key, serializedData);
	} catch (error) {
		console.log(error);
	}
}

function load(key) {
	try {
		const serializedState = localStorage.getItem(key);
		return serializedState === null ? undefined : JSON.parse(serializedState);
	} catch (error) {
		console.log(error);
	}
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

function onListItem(event) {
	const currentState = load(LOCAL_KEY);
	if (event.target.nodeName === 'LI') {
		event.target.classList.toggle('checked');

		const taskIndex = currentState.findIndex(
			task => +task.id === +event.target.dataset.id
		);

		currentState[taskIndex].isDone = !currentState[taskIndex].isDone;

	} else if (event.target.nodeName === 'P') {
		event.target.parentElement.classList.toggle('checked');

		const taskIndex = currentState.findIndex(
			task => +task.id === +event.target.parentElement.dataset.id
		);

		currentState[taskIndex].isDone = !currentState[taskIndex].isDone;
		// save(LOCAL_KEY, currentState);

	} else if (event.target.classList.contains('close-btn')) {
		event.target.parentElement.remove();

		const taskIndex = currentState.findIndex(
			task => +task.id === +event.target.parentElement.dataset.id
		);
		currentState.splice(taskIndex, 1);
	}

	save(LOCAL_KEY, currentState);
}

function getCloseBtn() {
	const closeBtn = document.createElement('button');
	closeBtn.className = 'close-btn';
	closeBtn.appendChild(document.createTextNode(CLOSE_BTN));

	return closeBtn;
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

function pressEnter(event) {
	if (event.ctrlKey && event.code === 'Enter') {
		addListItem();
	}
	return;
}

function addArrowSortBtn(arrow) {
	refs.sortArrow.innerHTML = '';
	refs.sortArrow.appendChild(document.createTextNode(arrow));
}

function sortItems() {
	const currentState = load(LOCAL_KEY);
	if (!currentState || currentState.length === 0) {
		showNotification(refs.emptyAlert);
		return;
	} else if (currentState.length === 1) {
		showNotification(refs.oneAlert);
		return;
	}

	const arrow = refs.sortArrow;
	if (arrow.classList.contains('down')) {
		arrow.classList.remove('down');
		arrow.classList.add('up');
		arrow.innerHTML = ''
		addArrowSortBtn(ARROW_UP);
	} else {
		arrow.classList.remove('up');
		arrow.classList.add('down');
		arrow.innerHTML = ''
		addArrowSortBtn(ARROW_DOWN);
	}

	if (arrow.classList.contains('down')) {
		const sortItems = [...currentState].sort((a, b) => {
			return a.id - b.id;
		});
		save(LOCAL_KEY, sortItems);
		const currentClassNameArrow = arrow.getAttribute('class');
		save(SORT_ARROW, currentClassNameArrow)
		refs.todoList.innerHTML = '';
		fillTasksList();

	} else if (refs.sortArrow.classList.contains('up')) {
		const sortItems = [...currentState].sort((a, b) => {
			return b.id - a.id;
		});
		save(LOCAL_KEY, sortItems);
		const currentClassNameArrow = arrow.getAttribute('class');
		save(SORT_ARROW, currentClassNameArrow)
		refs.todoList.innerHTML = '';
		fillTasksList();
	}
}

function showActiveTasks(event) {
	const localItems = JSON.parse(localStorage.getItem(LOCAL_KEY));
	let checkCountDone = 0;
	for (let i = 0; i < localItems.length; i++) {
		const element = localItems[i];
		if (element.isDone) {
			checkCountDone += 1;
		}
	}

	if (checkCountDone === 0) {
		showNotification(refs.checkedTasksAlert);
		return;
	}

	const targetBtn = event.target;
	const activeClass = 'active';

	if (!targetBtn.classList.contains(activeClass)) {
		targetBtn.classList.add(activeClass);
		const checkedItems = localItems.filter(({ isDone }) => !isDone)

		refs.todoList.innerHTML = '';
		checkedItems.forEach(({ task, time, isDone, id }) => {
			const { year, month, date, hours, minutes, sec } = time;
			const timeToActive =
				`${year}, ${months[month]} ${addLeadingZero(date)}, ${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(sec)}`;
			refs.todoList.appendChild(createItemList(task, timeToActive, isDone, id));
		});
	} else {
		targetBtn.classList.remove(activeClass);
		refs.todoList.innerHTML = '';
		localItems.forEach(({ task, time, isDone, id }) => {
			const { year, month, date, hours, minutes, sec } = time;
			const timeToActive =
				`${year}, ${months[month]} ${addLeadingZero(date)}, ${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(sec)}`;
			refs.todoList.appendChild(createItemList(task, timeToActive, isDone, id));
		});
	}
}

function createMurkupList(list) {
	return list.map(({ task, time: { year, month, date, hours, minutes, sec }, isDone }) => {
		return `<li class="todo-list__item ${isDone ? 'checked' : ''}">
		<p class="todo-list__item-description">${task}</p>
		<p class="todo-list__item-date">${year}, ${months[month]} ${addLeadingZero(date)}, ${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(sec)}</p>
		<button class="close-btn">${CLOSE_BTN}</button>
		</li>`
	}).join('');
}

function clearList() {
	if (refs.todoList.children.length === 0) {
		showNotification(refs.emptyAlert)
		return;
	}
	const isClear = confirm('This action is irreversible. Do you want to clean?');
	if (isClear) {
		currentId = 0;
		localStorage.clear();
		refs.todoList.innerHTML = '';
	}
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

function createTaskObject(task, time, isDone) {
	return {
		task,
		time,
		isDone,
		id: currentId,
	}
}

function addTaskToStorage(descr, time, isDone = false) {
	const currentState = load(LOCAL_KEY);
	if (currentState === undefined) {
		save(LOCAL_KEY, [createTaskObject(descr,time, isDone)]);
	} else {
		currentState.push(createTaskObject(descr,time, isDone));
		save(LOCAL_KEY, currentState);
	}
	currentId += 1;
}

function addLeadingZero(value) {
	return String(value).padStart(2, '0');
}

// console.log(localStorage);
refs.addBtn.addEventListener('click', addListItem);
refs.todoList.addEventListener('click', onListItem);
refs.sortBtn.addEventListener('click', sortItems);
refs.clearBtn.addEventListener('click', clearList);
refs.showActiveBtn.addEventListener('click', showActiveTasks);
document.addEventListener('keypress', pressEnter);
window.addEventListener('DOMContentLoaded', fillTasksList);
