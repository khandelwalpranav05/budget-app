/* www.youtube.com/CodeExplained */

const balanceEl = document.querySelector('.balance .value');
const incomeTotalEl = document.querySelector('.income-total');
const outcomeTotalEl = document.querySelector('.outcome-total');

// console.log(balanceEl);
// console.log(incomeTotalEl);
// console.log(outcomeTotalEl);

const chartEl = document.querySelector('.chart');

const expenseBtn = document.querySelector('.tab1');
const incomeBtn = document.querySelector('.tab2');
const allBtn = document.querySelector('.tab3');

// console.log(expenseBtn);
// console.log(incomeBtn);
// console.log(allBtn);

const expenseEl = document.querySelector('#expense');
const incomeEl = document.querySelector('#income');
const allEl = document.querySelector('#all');

const incomeList = document.querySelector('#income .list'); 
const expenseList = document.querySelector('#expense .list');
const allList = document.querySelector('#all .list');


const addIncome = document.querySelector('.add-income');
const incomeTitle = document.getElementById('income-title-input');
const incomeAmount = document.getElementById('income-amount-input');

const addExpense = document.querySelector(".add-expense");
const expenseTitle = document.getElementById("expense-title-input");
const expenseAmount = document.getElementById("expense-amount-input");

// Variables
let ENTRY_LIST = JSON.parse(localStorage.getItem('entry_list')) || [];
let balance = 0, income = 0, outcome = 0;

expenseBtn.addEventListener('click',function() {
	active(expenseBtn);
	inactive([incomeBtn,allBtn]);
	show(expenseEl);
	hide([incomeEl,allEl]);
});

incomeBtn.addEventListener('click',function(){
	active(incomeBtn);
	inactive([expenseBtn,allBtn]);
	show(incomeEl);
	hide([expenseEl,allEl]);
});


allBtn.addEventListener('click',function(){
	active(allBtn);
	inactive([expenseBtn,incomeBtn]);
	show(allEl);
	hide([incomeEl,expenseEl]);
});

function active(element){
	element.classList.add('active');
}

function show(element) {
	element.classList.remove('hide');
}

function hide(elementArray) {
	elementArray.forEach(element=>{
		element.classList.add('hide');
	});
}

function inactive(elementArray) {
	elementArray.forEach(element=>{
		element.classList.remove('active');
	});
}

function updateUI() {
	income = calculateTotal("income",ENTRY_LIST);
	outcome = calculateTotal("outcome",ENTRY_LIST);
	balance = Math.abs(calculateBalance(income,outcome));

	let sign = (income>=outcome) ? "$" : "-$";

	balanceEl = `<small></small>${balance}`;
	incomeTotalEl = `<small>$</small>${income}`
	outcomeTotalEl = `<small>$</small>${outcomes}`

	clearElement([incomeList,expenseList,allList]);

	ENTRY_LIST.forEach((entry,index) => {

		if(entry.type=='income'){
			showEntry(incomeList,index,entry.type,entry.title,entry.amount);
		}else if(entry.type=='expense'){
			showEntry(expenseList,index,entry.type,entry.title,entry.amount);
		}
		showEntry(allList,index,entry.type,entry.title,entry.amount);
	});

	// updateChart(income,outcome);
	localStorage.setItem('entry_list',JSON.stringify(ENTRY_LIST));
}

function deleteOrEdit(event) {
	const targetBtn = event.target;

	const ENTRY = targetBtn.parentNode;

	if(targetBtn.id == 'delete'){
		deleteEntry(ENTRY);
	}else if(targetBtn.id=='edit'){
		editEntry(ENTRY);
	}
}

function editEntry(ENTRY){

	let entry = ENTRY_LIST[ENTRY.id];

	if(ENTRY.type=='income'){
		incomeAmount.value = entry.amount;
		incomeTitle.value = entry.title;
	}else if(ENTRY.type=='expense'){
		expenseAmount.value = entry.amount;
		expenseTitle.value = entry.title;
	}

	deleteEntry(ENTRY);
}

function deleteEntry(ENTRY){
	ENTRY_LIST.splice(ENTRY.id,1);
	updateUI();
}

function clearElement(elementArray){
	elementArray.forEach(element => {
		element.innerHTML = '';
	});
}

function calculateBalance(income,outcome){
	return income - outcome;
}

function calculateTotal(type,ENTRY_LIST){
	let sum = 0;

	ENTRY_LIST.forEach(entry => {
		if(entry.type==type){
			sum+=entry.amount;
		}
	});

	return sum;
}

addIncome.addEventListener('click',function(){

	if(!incomeTitle.value || !incomeAmount.value) return;

	let income = {
		type:"income",
		title:incomeTitle.value,
		amount:parseFloat(incomeAmount.value)
	}

	ENTRY_LIST.push(income);

	updateUI();
	console.log(ENTRY_LIST);
	clearInput([incomeTitle,incomeAmount]);
});

addExpense.addEventListener('click',function(){

	if(!expenseTitle.value || !expenseAmount.value) return;	

	let expense = {
		type: "expense",
		title:expenseTitle.value,
		amount:parseFloat(expenseAmount.value),
	}

	ENTRY_LIST.push(expense);

	updateUI();
	clearInput([expenseTitle,expenseAmount]);
});

function clearInput(inputArray){
	inputArray.forEach(input => {
		input.value = "";
	});
}

function showEntry(list,id,type,title,amount){

	const entry = `
					<li id ='${id}' class="${type}">
						<div class="entry">${title}: $ ${amount}</div>
						<div id = "edit"></div>
						<div id="delete"></div>
					</li>`

	const position = 'afterBegin';
	list.insertAdjacentHTML(position,entry);
}