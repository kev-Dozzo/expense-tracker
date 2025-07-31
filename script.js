const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-mount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

//This line help us render this recentely uploaded transaction
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormEl.addEventListener("submit", addTransaction);

function addTransaction(e) {
    e.preventDefault();

    //get form values
    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);

    //add the data collected from the user with the push() method in the transaction array
    transactions.push({
        id: Date.now(),
        description, //since the description key and description value are    the same we can use description to represent both
        amount
    });

    localStorage.setItem("transactions", JSON.stringify(transactions))

    updateTransactionList();
    updateSummary();

    transactionFormEl.reset();
}

function updateTransactionList() {
    transactionListEl.innerHTML ="";

    const sortedTransactions = [...transactions].reverse();

    sortedTransactions.forEach((transaction) =>{
        const transactionEl = createTransactionElement(transaction);
        transactionListEl.appendChild(transactionEl);

    })
}

function createTransactionElement(transaction) {
    const li = document.createElement("li")
    li.classList.add("transaction")
    li.classList.add(transaction.amount > 0? "income" : "expense") //simple conditional statement

    li.innerHTML =`
    
    <span>${transaction.description}</span>
    <span> 
        ${formatcurrency(transaction.amount)}
        <button class="delete-btn"  onclick="removeTransaction(${transaction.id})">x</button>
    </span>
    
    `;
    return li;
}

function updateSummary() {
    const balance = transactions.reduce((acc,transaction) => acc + transaction.amount , 0)

    const income = transactions.filter((transaction) => transaction.amount > 0).reduce((acc, transaction) => acc + transaction.amount, 0)

    const expense = transactions.filter((transaction) => transaction.amount < 0).reduce((acc,transaction) => acc+transaction.amount, 0)

    balanceEl.textContent = formatcurrency(balance);
    incomeAmountEl.textContent =formatcurrency(income);
    expenseAmountEl.textContent = formatcurrency(expense);

}

function formatcurrency(number) {
    return new Intl.NumberFormat("fr-CM", {
        style: "currency",
        currency: "XAF",
        minimumFractionDigits: 0,
    }).format(number);
}

function removeTransaction(id) {
    transactions= transactions.filter(transaction => transaction.id !== id);

    localStorage.setItem("transactions",JSON.stringify(transactions))
    updateTransactionList();
    updateSummary();
}

//Initial render
updateSummary();
updateTransactionList();