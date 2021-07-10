
let database;
let budgetTracker

const request = indexedDB.open("ExpenseDB", budgetTracker || 21);

request.onupgradeneeded = function (e) {
    console.log('Upgrade needed in IndexDB')

const { previousVersion } = e;
const newerVersion = e.newerVersion || database.version;

console.log(`Databse has been updated from ${previousVersion} to ${newerVersion}`);

db = e.target.result;

if (database.objectNames.length === 0) {
    database.createObjectStore('BudgetDB', {autoincrement: true});
}

};