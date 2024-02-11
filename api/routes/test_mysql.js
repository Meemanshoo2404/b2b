const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const app = express();
const port = 3000; // Choose a port for your server

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: '49.36.210.132',
    user: 'meem',
    password: 'Meem@240401',
    database: 'meem'
});

// Define your API endpoints
router.get('/userData', (req, res) => {
    // Query the database to retrieve all users
    pool.query('SELECT * FROM Users', (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Internal server error' ,ee:error});
        }
        res.json(results);
    });
});




module.exports = router;