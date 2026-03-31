const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');

// Subscribe to newsletter
router.post('/subscribe',
    [
        body('email').isEmail().withMessage('Valid email is required')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        db.run(
            `INSERT INTO newsletter (email) VALUES (?)`,
            [email],
            function(err) {
                if (err && err.message.includes('UNIQUE')) {
                    res.status(400).json({ error: 'Email already subscribed' });
                } else if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.json({ message: 'Successfully subscribed to newsletter!' });
                }
            }
        );
    }
);

// Unsubscribe
router.post('/unsubscribe',
    [
        body('email').isEmail().withMessage('Valid email is required')
    ],
    (req, res) => {
        const { email } = req.body;

        db.run(
            `UPDATE newsletter SET is_active = 0 WHERE email = ?`,
            [email],
            function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.json({ message: 'Successfully unsubscribed' });
                }
            }
        );
    }
);

module.exports = router;