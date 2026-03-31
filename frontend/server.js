/**
 * Simple static server for Fak'ugesi Festival Frontend
 * Serves HTML, CSS, JS, and image files
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Serve static files
app.use(express.static(__dirname));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));

// Serve HTML pages
const pages = [
    'index.html',
    'immersive-africa.html',
    'awards.html',
    'tickets.html',
    'programme.html',
    'about.html',
    '404.html'
];

pages.forEach(page => {
    const pageName = page.replace('.html', '');
    app.get(`/${pageName === 'index' ? '' : pageName}`, (req, res) => {
        const filePath = path.join(__dirname, page);
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).sendFile(path.join(__dirname, '404.html'));
        }
    });
    
    app.get(`/${page}`, (req, res) => {
        const filePath = path.join(__dirname, page);
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).sendFile(path.join(__dirname, '404.html'));
        }
    });
});

// Catch-all route for 404
app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Server Error - Fak'ugesi Festival</title>
            <style>
                body {
                    font-family: 'DM Sans', sans-serif;
                    background: #0a0a10;
                    color: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                    text-align: center;
                }
                .error-container {
                    max-width: 500px;
                    padding: 40px;
                }
                h1 { font-size: 48px; color: #C8FF00; margin-bottom: 20px; }
                p { color: rgba(255,255,255,0.7); line-height: 1.6; }
                a {
                    color: #C8FF00;
                    text-decoration: none;
                    margin-top: 20px;
                    display: inline-block;
                }
            </style>
        </head>
        <body>
            <div class="error-container">
                <h1>500</h1>
                <p>Something went wrong on our end. Please try again later.</p>
                <a href="/">← Back to Home</a>
            </div>
        </body>
        </html>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ⚡ Fak'ugesi Festival Frontend Server ⚡
    ========================================
    🚀 Server running at: http://localhost:${PORT}
    📁 Serving files from: ${__dirname}
    🎨 Pages available:
       - Home: http://localhost:${PORT}
       - Immersive Africa: http://localhost:${PORT}/immersive-africa
       - Awards: http://localhost:${PORT}/awards
       - Tickets: http://localhost:${PORT}/tickets
       - Programme: http://localhost:${PORT}/programme
       - About: http://localhost:${PORT}/about
    ========================================
    `);
});