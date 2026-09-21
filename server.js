const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());


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

app.use(express.json());

app.get("/api/todos", function(req, res) {
    db.all("SELECT * FROM todos", function(err, rows) {
        if (err) {
            res.status(500).json({ error: "Database error" });
            return;
        }

        res.json(rows);
    });
});
app.post("/api/todos", function(req, res) {

    const task = req.body.task;

    db.run(
        "INSERT INTO todos (task) VALUES (?)",
        [task],
        function(err) {

            if (err) {
                res.status(500).json({ error: "Database error" });
                return;
            }

            res.json({
                id: this.lastID,
                task: task,
                completed: 0
            });
        }
    );
});

app.put("/api/todos/:id", function(req, res) {

    const id = req.params.id;
    const task = req.body.task;
    const completed = req.body.completed;

    db.run(
        "UPDATE todos SET task = ?, completed = ? WHERE id = ?",
        [task, completed, id],
        function(err) {

            if (err) {
                res.status(500).json({ error: "Database error" });
                return;
            }

            res.json({
                message: "Todo updated successfully"
            });
        }
    );
});
app.delete("/api/todos/:id", function(req, res) {

    const id = req.params.id;

    db.run(
        "DELETE FROM todos WHERE id = ?",
        [id],
        function(err) {

            if (err) {
                res.status(500).json({ error: "Database error" });
                return;
            }

            res.json({
                message: "Todo deleted successfully"
            });
        }
    );
});

app.get("/", function(req, res) {
    res.send("TODO Backend is running");
});

const PORT = 3000;

app.listen(PORT, function() {
    console.log("Server running on port " + PORT);
});