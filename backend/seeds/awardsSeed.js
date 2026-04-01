const { db } = require('../config/database');

const awardsData = [
    {
        year: 2025,
        category: 'Digital Art',
        title: 'Unmuted: The Power of African Youth Movements',
        artist: 'Jopee Dairo',
        country: 'Nigeria',
        description: 'A striking generative art series exploring the intersection of protest culture and digital expression. Dairo\'s work draws on archival footage of youth movements across the continent, translating collective memory into vivid, algorithmically composed visual poetry.',
        image_url: '/images/VOF_Voices_of_fire_print_Joseph_Dairo.jpg'
    },
    {
        year: 2025,
        category: 'Immersive Media',
        title: 'AfriVerse: Ancestral Futures in 360°',
        artist: 'Athanasius Johnson',
        country: 'South Africa',
        description: 'An immersive dome experience that places African mythology at the centre of speculative futures. Screened at the Wits Anglo American Digital Dome to sold-out audiences.',
        image_url: '/images/IMG_8523_Athanasius_Johnson.png'
    },
    {
        year: 2025,
        category: 'Interactive Design',
        title: 'Sankofa Interface: Reclaiming African UX',
        artist: 'Amara Diallo',
        country: 'Senegal',
        description: 'A landmark interface design project that challenges Western-centric UX paradigms by drawing on Adinkra symbols, Ubuntu philosophy, and East African colour theory.',
        image_url: '/images/cyber1.png'
    },
    {
        year: 2025,
        category: 'Technology for Social Impact',
        title: 'FarmLink: AI-Powered Agricultural Intelligence',
        artist: 'Nadia Mwangi',
        country: 'Kenya',
        description: 'FarmLink uses satellite imagery and machine learning to deliver hyper-local crop yield predictions and soil health reports to smallholder farmers via SMS in 14 African languages.',
        image_url: '/images/_MGL2775.jpg'
    }
];

function seedAwards() {
    const stmt = db.prepare(`
        INSERT INTO awards (year, category, title, artist, country, description, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    awardsData.forEach(award => {
        stmt.run([
            award.year,
            award.category,
            award.title,
            award.artist,
            award.country,
            award.description,
            award.image_url
        ], (err) => {
            if (err) console.error('Error seeding award:', err);
        });
    });

    stmt.finalize();
    console.log(`✅ Seeded ${awardsData.length} awards`);
}

module.exports = { seedAwards };