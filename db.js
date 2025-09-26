const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "USERS-DB.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error occurred when trying to connect to USERS-DB:", err.message);
  } else {
    console.log("Connected to USERS-DB:", dbPath);
  }
});

module.exports = db;
