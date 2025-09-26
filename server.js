const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const path = require("path");
const db = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5050;

// === Configurazione View Engine ===
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// === Middleware ===
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    store: new SQLiteStore({ db: "sessions.sqlite", dir: __dirname }),
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 15 }, // 15 minuti
  })
);

// === Middleware di protezione ===
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
}

// === Rotte ===
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const hashedPsw = await bcrypt.hash(req.body.psw, 10);
    const sql = `INSERT INTO users (usr, psw) VALUES (?, ?)`;

    db.run(sql, [req.body.usr, hashedPsw], function (err) {
      if (err) {
        console.error("Errore registrazione:", err.message);
        return res.redirect("/register");
      }
      res.redirect("/login");
    });
  } catch (err) {
    console.error("Errore:", err);
    res.redirect("/register");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { usr, psw } = req.body;
  const sql = `SELECT * FROM users WHERE usr = ?`;

  db.get(sql, [usr], async (err, user) => {
    if (err) {
      console.error("Login Error:", err.message);
      return res.redirect("/login");
    }
    if (!user) {
      console.log("User not found.");
      return res.redirect("/login");
    }

    const match = await bcrypt.compare(psw, user.psw);
    if (match) {
      req.session.userId = user.id;
      req.session.username = user.usr;
      return res.redirect("/home");
    } else {
      console.log("Wrong Password.");
      return res.redirect("/login");
    }
  });
});

app.get("/home", requireLogin, (req, res) => {
  res.render("home", { username: req.session.username });
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

// === Avvio server ===
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
