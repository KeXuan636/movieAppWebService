const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const port = 3000;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

const app = express();
app.use(express.json());

// Test server running
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// GET all movies
app.get('/movies', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM movies');
        res.json(rows);
    } catch (err) {
        console.error("MYSQL ERROR (GET):", err);
        res.status(500).json({ message: 'Server error fetching movies' });
    }
});

// POST a new movie
app.post('/movies', async (req, res) => {
    const { title, genre, rating } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO movies (title, genre, rating) VALUES (?, ?, ?)',
            [title, genre, rating]
        );
        res.status(201).json({ message: `Movie "${title}" added successfully` });
    } catch (err) {
        console.error("MYSQL ERROR (POST):", err);
        res.status(500).json({ message: `Server error - could not add movie "${title}"` });
    }
});

// PUT update a movie
app.put('/movies/:id', async (req, res) => {
    const { id } = req.params;
    const { title, genre, rating } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'UPDATE movies SET title=?, genre=?, rating=? WHERE id=?',
            [title, genre, rating, id]
        );
        res.json({ message: `Movie ID ${id} updated successfully` });
    } catch (err) {
        console.error("MYSQL ERROR (PUT):", err);
        res.status(500).json({ message: `Server error - could not update movie ID ${id}` });
    }
});

// DELETE a movie
app.delete('/movies/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'DELETE FROM movies WHERE id=?',
            [id]
        );
        res.json({ message: `Movie ID ${id} deleted successfully` });
    } catch (err) {
        console.error("MYSQL ERROR (DELETE):", err);
        res.status(500).json({ message: `Server error - could not delete movie ID ${id}` });
    }
});
