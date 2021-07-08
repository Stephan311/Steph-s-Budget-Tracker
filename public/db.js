const request = indexedDB.open("firstDatabase", 1);

request.onsuccess = event => {
    console.log(request.result);
  }

  request.onupgradeneeded = ( { target }) => {
      const db = target.result;
      const objectStore = db.createObjectStore("Finances")
  };

  request.onsuccess = event => {
      console.log(request.result);
  }