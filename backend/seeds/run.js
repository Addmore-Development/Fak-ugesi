const path = require('path');
const { initDatabase, db } = require('../config/database');
const { seedAwards } = require('./awardsSeed');
const { seedTickets } = require('./ticketsSeed');

// Initialize database first
initDatabase();

// Wait a bit for database to be ready
setTimeout(() => {
    // Check if awards exist and seed
    db.get("SELECT COUNT(*) as count FROM awards", (err, row) => {
        if (err) {
            console.error('Error checking awards:', err);
        } else if (row && row.count === 0) {
            seedAwards();
        } else if (row) {
            console.log(`Awards already seeded (${row.count} records)`);
        }
    });

    // Check if tickets exist and seed
    db.get("SELECT COUNT(*) as count FROM tickets", (err, row) => {
        if (err) {
            console.error('Error checking tickets:', err);
        } else if (row && row.count === 0) {
            seedTickets();
        } else if (row) {
            console.log(`Tickets already seeded (${row.count} records)`);
        }
    });
}, 500);

console.log('🌱 Seeding process started...');