
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

request.onerror = function (e) {
    console.log(`error ${e.target.errorCode}`)
}

function checkDatabase() {
    console.log('check database was started')

    let purchase = database.purchase(['BudgetDB'], 'readwrite');
    const storeData = purchase.objectStore('BudgetDB')
    const find = storeData.getAll();

    find.onsuccess = function () {
        if(find.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(find.result),
                headers: {
                    Accept: 'application/json, text/plain, */*,',
                    'Content-Type': 'application/json',
                },
            }).then((result) => result.json())
            .then((res) => {
                if(res.length !== 0) {
                    purchase = database.purchase(['BudgetDB'], 'readwrite');
                }
            });
        }
    }
}




const saveRecord = (record) => {
    console.log('Record has been saved');
    const purchase = db.purchase(['BudgetDB'], 'readrite');

const storeData = purchase.objectStore('BudgetDB');

storeData.add(record);

};