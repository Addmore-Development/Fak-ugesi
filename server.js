/**
 * Fak'ugesi Festival - Main Server
 * Serves both frontend and backend API
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const fs = require('fs');

// Load environment variables
require('dotenv').config();

// Import database config
const { initDatabase } = require('./backend/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Compression
app.use(compression());

// Logging
app.use(morgan('dev'));

// CORS
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== STATIC FILES ====================
// Check multiple possible locations for static files
const possibleFrontendPaths = [
    path.join(__dirname, 'frontend'),
    path.join(__dirname, 'frontend', 'public'),
    path.join(__dirname, 'public')
];

let frontendPath = null;
for (const p of possibleFrontendPaths) {
    if (fs.existsSync(p)) {
        frontendPath = p;
        console.log(`✅ Found frontend at: ${p}`);
        break;
    }
}

if (frontendPath) {
    app.use(express.static(frontendPath));
    app.use('/css', express.static(path.join(frontendPath, 'css')));
    app.use('/js', express.static(path.join(frontendPath, 'js')));
    app.use('/images', express.static(path.join(frontendPath, 'images')));
    app.use('/assets', express.static(path.join(frontendPath, 'assets')));
} else {
    console.error('❌ Frontend directory not found!');
}

// Uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize database
initDatabase();

// ==================== API ROUTES ====================

// Awards routes
app.get('/api/awards', (req, res) => {
    const { db } = require('./backend/config/database');
    const { year, category } = req.query;
    let query = "SELECT * FROM awards WHERE 1=1";
    const params = [];

    if (year) {
        query += " AND year = ?";
        params.push(year);
    }
    if (category) {
        query += " AND category = ?";
        params.push(category);
    }

    query += " ORDER BY year DESC, id";

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.get('/api/awards/year/:year', (req, res) => {
    const { db } = require('./backend/config/database');
    db.all("SELECT * FROM awards WHERE year = ? ORDER BY id", [req.params.year], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.get('/api/awards/:id', (req, res) => {
    const { db } = require('./backend/config/database');
    db.get("SELECT * FROM awards WHERE id = ?", [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'Award not found' });
        } else {
            res.json(row);
        }
    });
});

// Tickets routes
app.get('/api/tickets', (req, res) => {
    const { db } = require('./backend/config/database');
    db.all("SELECT * FROM tickets WHERE is_active = 1", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.get('/api/tickets/:id', (req, res) => {
    const { db } = require('./backend/config/database');
    db.get("SELECT * FROM tickets WHERE id = ? AND is_active = 1", [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'Ticket not found' });
        } else {
            res.json(row);
        }
    });
});

// Award submissions
app.post('/api/submissions', (req, res) => {
    const { db } = require('./backend/config/database');
    const { name, email, category, project_title, description } = req.body;

    if (!name || !email || !category || !project_title) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

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
});

// Contact form
app.post('/api/contact', (req, res) => {
    const { db } = require('./backend/config/database');
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

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
});

// Newsletter
app.post('/api/newsletter/subscribe', (req, res) => {
    const { db } = require('./backend/config/database');
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

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
});

app.post('/api/newsletter/unsubscribe', (req, res) => {
    const { db } = require('./backend/config/database');
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
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// ==================== FRONTEND ROUTES ====================

// Function to find HTML files in possible locations
function findHTMLFile(filename) {
    const possiblePaths = [
        path.join(__dirname, 'frontend', filename),
        path.join(__dirname, 'frontend', 'public', filename),
        path.join(__dirname, 'public', filename),
        path.join(__dirname, filename)
    ];
    
    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            return p;
        }
    }
    return null;
}

// Serve HTML pages
const pages = [
    { route: '/', file: 'index.html' },
    { route: '/index', file: 'index.html' },
    { route: '/index.html', file: 'index.html' },
    { route: '/immersive-africa', file: 'immersiveAfrica.html' },
    { route: '/immersive-africa.html', file: 'immersiveAfrica.html' },
    { route: '/awards', file: 'awards.html' },
    { route: '/awards.html', file: 'awards.html' },
    { route: '/tickets', file: 'tickets.html' },
    { route: '/tickets.html', file: 'tickets.html' },
    { route: '/programme', file: 'programme.html' },
    { route: '/programme.html', file: 'programme.html' },
    { route: '/about', file: 'about.html' },
    { route: '/about.html', file: 'about.html' }
];

pages.forEach(({ route, file }) => {
    app.get(route, (req, res) => {
        const filePath = findHTMLFile(file);
        if (filePath) {
            res.sendFile(filePath);
        } else {
            // Try to serve 404
            const notFoundPath = findHTMLFile('404.html');
            if (notFoundPath) {
                res.status(404).sendFile(notFoundPath);
            } else {
                res.status(404).send('<h1>404 - Page Not Found</h1><p>The requested page could not be found.</p>');
            }
        }
    });
});

// 404 handler for any other routes
app.get('*', (req, res) => {
    const notFoundPath = findHTMLFile('404.html');
    if (notFoundPath) {
        res.status(404).sendFile(notFoundPath);
    } else {
        res.status(404).send('<h1>404 - Page Not Found</h1><p>The requested page could not be found.</p>');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!', 
        message: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ⚡⚡⚡ FAK'UGESI FESTIVAL SERVER ⚡⚡⚡
    ==========================================
    🚀 Server running at: http://localhost:${PORT}
    📁 Project: ${__dirname}
    📁 Frontend path: ${frontendPath || 'Not found'}
    
    📄 Available Pages:
       • Home: http://localhost:${PORT}
       • Immersive Africa: http://localhost:${PORT}/immersive-africa
       • Awards: http://localhost:${PORT}/awards
       • Tickets: http://localhost:${PORT}/tickets
       • Programme: http://localhost:${PORT}/programme
       • About: http://localhost:${PORT}/about
    
    🔌 API Endpoints:
       • GET  /api/awards
       • GET  /api/awards/:id
       • GET  /api/awards/year/:year
       • GET  /api/tickets
       • POST /api/submissions
       • POST /api/contact
       • POST /api/newsletter/subscribe
       • GET  /api/health
    ==========================================
    `);
});