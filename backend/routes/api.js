const express = require('express');
const router = express.Router();

// Import sub-routes
const awardRoutes = require('./awards');
const ticketRoutes = require('./tickets');
const submissionRoutes = require('./submissions');
const contactRoutes = require('./contact');
const newsletterRoutes = require('./newsletter');

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mount routes
router.use('/awards', awardRoutes);
router.use('/tickets', ticketRoutes);
router.use('/submissions', submissionRoutes);
router.use('/contact', contactRoutes);
router.use('/newsletter', newsletterRoutes);

module.exports = router;