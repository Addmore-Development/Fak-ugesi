const { initDatabase, db } = require('../config/database');
const { seedAwards } = require('./awardsSeed');
const { seedTickets } = require('./ticketsSeed');

// Initialize database
initDatabase();

// Check if data exists before seeding
db.get("SELECT COUNT(*) as count FROM awards", (err, row) => {
    if (row.count === 0) {
        seedAwards();
    }
});

db.get("SELECT COUNT(*) as count FROM tickets", (err, row) => {
    if (row.count === 0) {
        seedTickets();
    }
});

console.log('🌱 Seeding complete!');