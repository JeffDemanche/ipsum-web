/**
 * Reference script that can be run as a browser snippet to edit an entry.
 */

var connection = indexedDB.open("ipsum");

connection.onsuccess = (e) => {
  var database = e.target.result;
  var transaction = database.transaction(["entries"], "readwrite");
  var objectStore = transaction.objectStore("entries");

  var dateD = "5/31/2022";
  var dateUTC = "2022-05-31T00:00:00.000-04:00";

  objectStore.get(dateD).onsuccess = function (e) {
    var obj = e.target.result;
    objectStore.put({ ...obj, entryKey: dateD, date: new Date(dateUTC) });
  };
};

connection.onerror = (e) => {
  console.log(e.target.error);
};
