require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const { initDatabase, db } = require('../config/database');
const { seedAwards } = require('./awardsSeed');
const { seedTickets } = require('./ticketsSeed');

async function run() {
    console.log('🌱 Seeding process started...');
    console.log('🔌 DATABASE_URL:', process.env.DATABASE_URL ? '✅ Found' : '❌ MISSING!');

    await initDatabase();

    setTimeout(() => {
        db.get("SELECT COUNT(*) as count FROM awards", [], (err, row) => {
            if (err) {
                console.error('Error checking awards:', err.message);
            } else if (row && row.count == 0) {
                seedAwards();
            } else {
                console.log(`Awards already seeded (${row ? row.count : 0} records)`);
            }
        });

        db.get("SELECT COUNT(*) as count FROM tickets", [], (err, row) => {
            if (err) {
                console.error('Error checking tickets:', err.message);
            } else if (row && row.count == 0) {
                seedTickets();
            } else {
                console.log(`Tickets already seeded (${row ? row.count : 0} records)`);
            }
        });
    }, 1000);
}

run();