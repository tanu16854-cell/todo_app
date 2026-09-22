const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`);
// Add user_id column to existing todos table
db.run(
    "ALTER TABLE todos ADD COLUMN user_id INTEGER",
    function(err) {
        if (err && !err.message.includes("duplicate column name")) {
            console.log("User ID column error:", err.message);
        }
    }
);

// Register User
app.post("/api/register", async function(req, res) {

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if (!username || !email || !password) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword],
        function(err) {

            if (err) {
                return res.status(400).json({
                    error: "Email already exists"
                });
            }

            res.json({
                message: "User registered successfully",
                userId: this.lastID
            });
        }
    );
});

// Login User
app.post("/api/login", function(req, res) {

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({
            error: "Email and password are required"
        });
    }

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async function(err, user) {

            if (err) {
                return res.status(500).json({
                    error: "Database error"
                });
            }

            if (!user) {
                return res.status(401).json({
                    error: "Invalid email or password"
                });
            }

            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    error: "Invalid email or password"
                });
            }

            const token = jwt.sign(
                {
                    userId: user.id,
                    username: user.username
                },
                "todo_secret_key",
                {
                    expiresIn: "1h"
                }
            );

            res.json({
                message: "Login successful",
                token: token,
                userId: user.id,
                username: user.username
            });
        }
    );
});

// JWT Authentication Middleware
function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: "Access token required"
        });
    }

    jwt.verify(token, "todo_secret_key", function(err, user) {

        if (err) {
            return res.status(403).json({
                error: "Invalid or expired token"
            });
        }

        req.user = user;

        next();
    });
}

// Get user's todos - Protected Route
app.get("/api/todos", authenticateToken, function(req, res) {

    const userId = req.user.userId;

    db.all(
        "SELECT * FROM todos WHERE user_id = ?",
        [userId],
        function(err, rows) {

            if (err) {
                res.status(500).json({
                    error: "Database error"
                });
                return;
            }

            res.json(rows);
        }
    );
});

// Add todo - Protected Route
app.post("/api/todos", authenticateToken, function(req, res) {

    const task = req.body.task;
    const userId = req.user.userId;

    if (!task || task.trim() === "") {
        return res.status(400).json({
            error: "Task is required"
        });
    }

    db.run(
        "INSERT INTO todos (task, user_id) VALUES (?, ?)",
        [task.trim(), userId],
        function(err) {

            if (err) {
                res.status(500).json({
                    error: "Database error"
                });
                return;
            }

            res.json({
                id: this.lastID,
                task: task.trim(),
                completed: 0,
                userId: userId
            });
        }
    );
});
// Update todo - Protected and User-specific
app.put("/api/todos/:id", authenticateToken, function(req, res) {

    const id = req.params.id;
    const task = req.body.task;
    const completed = req.body.completed;
    const userId = req.user.userId;

    db.run(
        "UPDATE todos SET task = ?, completed = ? WHERE id = ? AND user_id = ?",
        [task, completed, id, userId],
        function(err) {

            if (err) {
                res.status(500).json({
                    error: "Database error"
                });
                return;
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Todo not found or access denied"
                });
            }

            res.json({
                message: "Todo updated successfully"
            });
        }
    );
});
// Delete todo - Protected and User-specific
app.delete("/api/todos/:id", authenticateToken, function(req, res) {

    const id = req.params.id;
    const userId = req.user.userId;

    db.run(
        "DELETE FROM todos WHERE id = ? AND user_id = ?",
        [id, userId],
        function(err) {

            if (err) {
                res.status(500).json({
                    error: "Database error"
                });
                return;
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Todo not found or access denied"
                });
            }

            res.json({
                message: "Todo deleted successfully"
            });
        }
    );
});

// Home route
app.get("/", function(req, res) {
    res.send("TODO Backend is running");
});

const PORT = 3000;

app.listen(PORT, function() {
    console.log("Server running on port " + PORT);
});