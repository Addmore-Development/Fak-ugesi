const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

// Get all awards
router.get('/', (req, res) => {
    const { year, category } = req.query;
    let query = "SELECT * FROM awards WHERE 1=1";
    const params = [];

    if (year) {
        query += " AND year = ?";
        params.push(year);
    }
    if (category) {
        query += " AND category = ?";
        params.push(category);
    }

    query += " ORDER BY year DESC, id";

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Get award by ID
router.get('/:id', (req, res) => {
    db.get("SELECT * FROM awards WHERE id = ?", [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'Award not found' });
        } else {
            res.json(row);
        }
    });
});

// Get awards by year
router.get('/year/:year', (req, res) => {
    db.all("SELECT * FROM awards WHERE year = ? ORDER BY id", [req.params.year], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

module.exports = router;