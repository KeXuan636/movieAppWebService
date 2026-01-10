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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get('/allmovies', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.movies')
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error for allmovies'});
    }
});

app.post('/addmovie', async (req, res) => {
    const { title, genre, rating } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO movie (title, genre, rating) VALUES (?, ?)', [title, genre, rating]);
        res.status(201).json({ message: 'Movie '+title+'added successfully' });
    } catch (err){
        console.error(err);
        res.status(500).json({ message: 'Server error - could not add movie '+title });
    }
});

app.put("/movies/:id", async (req, res) => {
    const { id } = req.params;
    const { title, genre, rating } = req.body;

    const result = await pool.query(
        "UPDATE movies SET title=$1, genre=$2, rating=$3 WHERE id=$4 RETURNING *",
        [title, genre, rating, id]
    );

    res.json(result.rows[0]);
});

app.delete("/movies/:id", async (req, res) => {
    const { id } = req.params;

    await pool.query("DELETE FROM movies WHERE id=$1", [id]);
    res.json({ message: "Movie deleted" });
});
