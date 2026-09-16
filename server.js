const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./todo.db", function(err) {
    if (err) {
        console.log("Database connection failed");
    } else {
        console.log("Database connected");
    }
});
db.run(`
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task TEXT NOT NULL,
        completed INTEGER DEFAULT 0
    )
`);

const app = express();

const PORT = 3000;
app.use(express.json());
app.get("/", function(req, res) {
    res.send("TODO Backend is running");
});

app.listen(PORT, function() {
    console.log("Server running on port " + PORT);
});