const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

// Get all tickets
router.get('/', (req, res) => {
    db.all("SELECT * FROM tickets WHERE is_active = 1", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Get ticket by ID
router.get('/:id', (req, res) => {
    db.get("SELECT * FROM tickets WHERE id = ? AND is_active = 1", [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'Ticket not found' });
        } else {
            res.json(row);
        }
    });
});

module.exports = router;