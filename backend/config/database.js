const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

pool.on('error', (err) => {
    console.error('❌ Unexpected pool error:', err);
});

const db = {
    all: (query, params, callback) => {
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
                const lastID = result && result.rows && result.rows[0] ? result.rows[0].id : null;
                callback.call({ lastID, changes: result ? result.rowCount : 0 }, err);
            }
        });
    }
};

function convertPlaceholders(query) {
    let i = 0;
    return query.replace(/\?/g, () => `$${++i}`);
}

function convertPgInsert(query) {
    let converted = convertPlaceholders(query);
    if (converted.trim().toUpperCase().startsWith('INSERT') && !converted.includes('RETURNING')) {
        converted += ' RETURNING id';
    }
    return converted;
}

async function initDatabase() {
    try {
        const client = await pool.connect();
        console.log('✅ Connected to PostgreSQL');
        client.release();

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
        console.error('❌ Database init error:');
        console.error('   Message:', err.message);
        console.error('   Code:   ', err.code);
        console.error('   Detail: ', err.detail || 'none');
    }
}

module.exports = { db, initDatabase, pool };