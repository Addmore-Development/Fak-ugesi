const { db } = require('../config/database');

const ticketsData = [
    {
        pass_type: 'Full Festival Pass',
        price: 750,
        student_price: 200,
        features: 'All panels & workshops (5 days), Expo & showcases access, Immersive Africa dome screenings, Live performances & music events, Awards ceremony access, Networking mixer invitation'
    },
    {
        pass_type: 'Day Pass',
        price: 340,
        student_price: 135,
        features: 'Full access on your chosen day, All panels & workshops that day, Expo & showcase access, Immersive Africa screenings, Day-specific performances'
    },
    {
        pass_type: 'Industry Pass',
        price: 3500,
        student_price: null,
        features: 'All Full Pass benefits, Exclusive industry networking sessions, Invitation to Awards ceremony & gala, Priority seating at keynotes, VIP lounge access, Curated industry dinners'
    }
];

function seedTickets() {
    const stmt = db.prepare(`
        INSERT INTO tickets (pass_type, price, student_price, features)
        VALUES (?, ?, ?, ?)
    `);

    ticketsData.forEach(ticket => {
        stmt.run([
            ticket.pass_type,
            ticket.price,
            ticket.student_price,
            ticket.features
        ], (err) => {
            if (err) console.error('Error seeding ticket:', err);
        });
    });

    stmt.finalize();
    console.log(`✅ Seeded ${ticketsData.length} tickets`);
}

module.exports = { seedTickets };