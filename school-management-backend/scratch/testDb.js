const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
    console.log("Database Config:", {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'school_db'
    });
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'school_db'
        });
        console.log("Connected successfully to DB!");
        const [students] = await connection.query("SELECT * FROM students");
        console.log(`Found ${students.length} students:`);
        students.forEach(s => {
            console.log(`- ${s.student_id}: ${s.name} (${s.email})`);
        });
        await connection.end();
    } catch (e) {
        console.error("Failed to query DB:", e);
    }
}

main();
