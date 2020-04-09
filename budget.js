 const balanceEl = document.querySelector(".balance .value");
const incomeTotalEl = document.querySelector(".income-total");
const outcomeTotalEl = document.querySelector(".outcome-total");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const allEl = document.querySelector("#all");
const incomeList = document.querySelector("#income .list");
const expenseList = document.querySelector("#expense .list");
const allList = document.querySelector("#all .list");

// SELECT BTNS
const expenseBtn = document.querySelector(".tab1");
const incomeBtn = document.querySelector(".tab2");
const allBtn = document.querySelector(".tab3");

// INPUT BTS
const addExpense = document.querySelector(".add-expense");
const expenseTitle = document.getElementById("expense-title-input");
const expenseAmount = document.getElementById("expense-amount-input");

const addIncome = document.querySelector(".add-income");
const incomeTitle = document.getElementById("income-title-input");
const incomeAmount = document.getElementById("income-amount-input");
// Variables
// let ENTRY_LIST = JSON.parse(localStorage.getItem('entry_list')) || [];
let ENTRY_LIST = [];
let balance = 0, income = 0, outcome = 0;

expenseBtn.addEventListener("click", function(){
    show(expenseEl);
    hide( [incomeEl, allEl] );
    active( expenseBtn );
    inactive( [incomeBtn, allBtn] );
});

incomeBtn.addEventListener("click", function(){
    show(incomeEl);
    hide( [expenseEl, allEl] );
    active( incomeBtn );
    inactive( [expenseBtn, allBtn] );
});

allBtn.addEventListener("click", function(){
    show(allEl);
    hide( [incomeEl, expenseEl] );
    active( allBtn );
    inactive( [incomeBtn, expenseBtn] );
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
	outcome = calculateTotal("expense",ENTRY_LIST);
	balance = Math.abs(calculateBalance(income,outcome));

	let sign = (income>=outcome) ? "$" : "-$";

	balanceEl.innerHTML = `<small>${sign}</small>${balance}`;
	incomeTotalEl.innerHTML = `<small>$</small>${income}`
	outcomeTotalEl.innerHTML = `<small>$</small>${outcome}`

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


incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

function deleteOrEdit(event) {
	const targetBtn = event.target;

	const ENTRY = targetBtn.parentNode;

	if(targetBtn.id == "delete"){
		deleteEntry(ENTRY);
	}else if(targetBtn.id=="edit"){
		editEntry(ENTRY);
	}
}

function editEntry(entry){

	let ENTRY = ENTRY_LIST[entry.id];

	if(ENTRY.type=='income'){
		incomeAmount.value = ENTRY.amount;
		incomeTitle.value = ENTRY.title;
	}else if(ENTRY.type=='expense'){
		expenseAmount.value = ENTRY.amount;
		expenseTitle.value = ENTRY.title;
	}

	deleteEntry(entry);
}

function deleteEntry(ENTRY){
	ENTRY_LIST.splice(ENTRY.id,1);
	updateUI();
}

function clearElement(elementArray){
	elementArray.forEach(element => {
		element.innerHTML = "";
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
		amount:parseInt(incomeAmount.value)
	}

	ENTRY_LIST.push(income);

	updateUI();
	// console.log(ENTRY_LIST);
	clearInput([incomeTitle,incomeAmount]);
});

addExpense.addEventListener('click',function(){

	if(!expenseTitle.value || !expenseAmount.value) return;	

	let expense = {
		type: "expense",
		title:expenseTitle.value,
		amount:parseInt(expenseAmount.value),
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

	const entry = `<li id ="${id}" class="${type}">
						<div class="entry">${title}: $ ${amount}</div>
						<div id = "edit"></div>
						<div id="delete"></div>
					</li>`

	const position = 'afterbegin';
	list.insertAdjacentHTML(position,entry);
}