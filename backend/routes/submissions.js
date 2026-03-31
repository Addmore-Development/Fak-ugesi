const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');

// Submit award application
router.post('/',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('category').notEmpty().withMessage('Category is required'),
        body('project_title').notEmpty().withMessage('Project title is required'),
        body('description').optional().isLength({ max: 2000 })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, category, project_title, description } = req.body;

        db.run(
            `INSERT INTO submissions (name, email, category, project_title, description) 
             VALUES (?, ?, ?, ?, ?)`,
            [name, email, category, project_title, description || ''],
            function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.json({ 
                        id: this.lastID, 
                        message: 'Application submitted successfully!' 
                    });
                }
            }
        );
    }
);

// Get submissions (admin only - would add auth in production)
router.get('/', (req, res) => {
    db.all("SELECT * FROM submissions ORDER BY created_at DESC", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

module.exports = router;