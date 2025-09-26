const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// === DB Utenti ===
const usersDbPath = path.resolve(__dirname, "../USERS-DB.sqlite");

const usersDb = new sqlite3.Database(usersDbPath, (err) => {
  if (err) {
    console.error("Errore creazione USERS-DB:", err.message);
  } else {
    console.log("Creato/collegato USERS-DB:", usersDbPath);
  }
});

usersDb.serialize(() => {
  usersDb.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usr TEXT UNIQUE,
      psw TEXT
    )
  `);
});

// 🔮 Qui puoi aggiungere altri database in futuro
// esempio: ORDERS-DB, PRODUCTS-DB, ecc.

usersDb.close();
