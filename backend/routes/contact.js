const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');

// Submit contact form
router.post('/',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('message').notEmpty().withMessage('Message is required'),
        body('subject').optional()
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, subject, message } = req.body;

        db.run(
            `INSERT INTO contact_messages (name, email, subject, message) 
             VALUES (?, ?, ?, ?)`,
            [name, email, subject || 'General Inquiry', message],
            function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.json({ 
                        id: this.lastID, 
                        message: 'Message sent successfully! We\'ll get back to you soon.' 
                    });
                }
            }
        );
    }
);

module.exports = router;