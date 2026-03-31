const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error('Database error:', err);
    else console.log('Database connected');
});

// Create tables
db.serialize(() => {
    // Awards table
    db.run(`CREATE TABLE IF NOT EXISTS awards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER,
        category TEXT,
        title TEXT,
        artist TEXT,
        country TEXT,
        description TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tickets table
    db.run(`CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pass_type TEXT,
        price INTEGER,
        student_price INTEGER,
        features TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Submissions table
    db.run(`CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        category TEXT,
        project_title TEXT,
        description TEXT,
        file_path TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert sample awards data
    db.get("SELECT COUNT(*) as count FROM awards", (err, row) => {
        if (row.count === 0) {
            const sampleAwards = [
                [2025, 'Digital Art', 'Unmuted: The Power of African Youth', 'Jopee Dairo', 'Nigeria', 'A striking generative art series exploring protest culture and digital expression.', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400'],
                [2025, 'Immersive Media', 'AfriVerse: Ancestral Futures', 'Athanasius Johnson', 'South Africa', 'An immersive dome experience placing African mythology at the centre of speculative futures.', 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400'],
                [2025, 'Interactive Design', 'Sankofa Interface', 'Amara Diallo', 'Senegal', 'A landmark interface design project drawing on Adinkra symbols and Ubuntu philosophy.', 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400'],
                [2025, 'Technology for Social Impact', 'FarmLink: AI Agricultural Intelligence', 'Nadia Mwangi', 'Kenya', 'Satellite imagery and machine learning for smallholder farmers.', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400']
            ];
            
            const stmt = db.prepare("INSERT INTO awards (year, category, title, artist, country, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
            sampleAwards.forEach(award => stmt.run(award));
            stmt.finalize();
        }
    });

    // Insert sample ticket data
    db.get("SELECT COUNT(*) as count FROM tickets", (err, row) => {
        if (row.count === 0) {
            const sampleTickets = [
                ['Full Festival Pass', 750, 200, 'All panels, workshops, expo, screenings, performances, awards ceremony'],
                ['Day Pass', 340, 135, 'Full access on your chosen day, all panels and workshops that day, expo access'],
                ['Industry Pass', 3500, null, 'Full Pass benefits + exclusive networking, VIP lounge, awards ceremony priority seating']
            ];
            
            const stmt = db.prepare("INSERT INTO tickets (pass_type, price, student_price, features) VALUES (?, ?, ?, ?)");
            sampleTickets.forEach(ticket => stmt.run(ticket));
            stmt.finalize();
        }
    });
});

// API Routes
// Get all awards
app.get('/api/awards', (req, res) => {
    db.all("SELECT * FROM awards ORDER BY year DESC, id", (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

// Get awards by year
app.get('/api/awards/:year', (req, res) => {
    db.all("SELECT * FROM awards WHERE year = ?", [req.params.year], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

// Submit award application
app.post('/api/submit-award', (req, res) => {
    const { name, email, category, project_title, description } = req.body;
    db.run(
        "INSERT INTO submissions (name, email, category, project_title, description) VALUES (?, ?, ?, ?, ?)",
        [name, email, category, project_title, description],
        function(err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID, message: 'Submission received!' });
        }
    );
});

// Get tickets
app.get('/api/tickets', (req, res) => {
    db.all("SELECT * FROM tickets", (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

// Contact form submission
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    db.run(
        "INSERT INTO submissions (name, email, category, project_title, description) VALUES (?, ?, ?, ?, ?)",
        [name, email, subject, 'Contact Form', message],
        function(err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ message: 'Message sent!' });
        }
    );
});

// Newsletter signup
app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    db.run(
        "INSERT INTO submissions (name, email, category, project_title, description) VALUES (?, ?, ?, ?, ?)",
        ['Newsletter Subscriber', email, 'Newsletter', 'Signup', 'Subscribed to newsletter'],
        function(err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ message: 'Subscribed!' });
        }
    );
});

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/:page', (req, res) => {
    const page = req.params.page;
    const validPages = ['index', 'immersive-africa', 'awards', 'tickets', 'programme', 'about'];
    if (validPages.includes(page) || validPages.includes(page.replace('.html', ''))) {
        res.sendFile(path.join(__dirname, 'public', `${page.replace('.html', '')}.html`));
    } else {
        res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});