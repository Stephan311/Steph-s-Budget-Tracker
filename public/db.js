let database;
let budgetVersion

const request = indexedDB.open('BudgetDB', budgetVersion || 21);

request.onupgradeneeded = function (e) {
  console.log('Upgrade needed in IndexDB');

  const { oldVersion } = e;
  const newVersion = e.newVersion || database.version;

    console.log(`Databse has been updated from ${oldVersion} to ${newVersion}`);

    database = e.target.result;

    if (database.objectStorenames.length === 0) {
        database.createObjectStore('BudgetDB', { autoincrement: true });
    }
};

request.onerror = function (e) {
    console.log(`error ${e.target.errorCode}`)
}

function checkDatabase() {
    console.log('check database was started')

    let transaction = database.transaction(['BudgetStore'], 'readwrite');
    const storeData = transaction.objectStore('BudgetStore')
    const find = storeData.getAll();

    find.onsuccess = function () {
        if (find.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(find.result),
                headers: {
                    Accept: 'application/json, text/plain, */*,',
                    'Content-Type': 'application/json',
                },
            }).then((result) => result.json())
                .then((res) => {
                    if (res.length !== 0) {
                        transaction = database.transaction(['BudgetStore'], 'readwrite');

                        const presentData = transaction.objectStore('BudgetStore');
                        presentData.clear();
                        console.log('clearing data')
                    }
                });
        }
    }
}

request.onsuccess = function (e) {
    console.log('success!');
    database = e.target.result

    if (navigator.onLine) {
        console.log('Program back online')
        checkDatabase;

    }
}

const saveRecord = (record) => {
    console.log('Record has been saved');
    const transaction = database.transaction(['BudgetStore'], 'readwrite');
    const storeData = transaction.objectStore('BudgetStore');
    storeData.add(record);

};

// Listen for app coming back online
window.addEventListener('online', checkDatabase);