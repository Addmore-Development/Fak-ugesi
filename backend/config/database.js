const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// We export a db object that mimics SQLite's interface
// so we don't need to rewrite all the routes in server.js
const db = {
    all: (query, params, callback) => {
        // Convert SQLite ? placeholders to PostgreSQL $1, $2...
        const pgQuery = convertPlaceholders(query);
        pool.query(pgQuery, params || [], (err, result) => {
            if (callback) callback(err, result ? result.rows : null);
        });
    },
    get: (query, params, callback) => {
        const pgQuery = convertPlaceholders(query);
        pool.query(pgQuery, params || [], (err, result) => {
            if (callback) callback(err, result && result.rows ? result.rows[0] : null);
        });
    },
    run: (query, params, callback) => {
        const pgQuery = convertPgInsert(query);
        pool.query(pgQuery, params || [], function(err, result) {
            if (callback) {
                // Mimic SQLite's `this.lastID`
                const lastID = result && result.rows && result.rows[0] ? result.rows[0].id : null;
                callback.call({ lastID, changes: result ? result.rowCount : 0 }, err);
            }
        });
    }
};

// Convert SQLite ? to PostgreSQL $1, $2, $3...
function convertPlaceholders(query) {
    let i = 0;
    return query.replace(/\?/g, () => `$${++i}`);
}

// For INSERT statements, add RETURNING id so we get lastID
function convertPgInsert(query) {
    let converted = convertPlaceholders(query);
    if (converted.trim().toUpperCase().startsWith('INSERT') && !converted.includes('RETURNING')) {
        converted += ' RETURNING id';
    }
    return converted;
}

async function initDatabase() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS awards (
                id SERIAL PRIMARY KEY,
                year INTEGER NOT NULL,
                category TEXT NOT NULL,
                title TEXT NOT NULL,
                artist TEXT NOT NULL,
                country TEXT,
                description TEXT,
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS tickets (
                id SERIAL PRIMARY KEY,
                pass_type TEXT NOT NULL,
                price INTEGER NOT NULL,
                student_price INTEGER,
                features TEXT,
                is_active INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS submissions (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                category TEXT NOT NULL,
                project_title TEXT NOT NULL,
                description TEXT,
                file_path TEXT,
                status TEXT DEFAULT 'pending',
                admin_notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS newsletter (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active INTEGER DEFAULT 1
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS contact_messages (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                subject TEXT,
                message TEXT NOT NULL,
                status TEXT DEFAULT 'unread',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('✅ PostgreSQL tables initialized');
    } catch (err) {
        console.error('❌ Database init error:', err.message);
    }
}

module.exports = { db, initDatabase, pool };