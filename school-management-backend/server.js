const express = require('express');
const cors = require('cors');
const jwt = require('jwt-simple');
require('dotenv').config();
const initDb = require('./config/dbInit');
const functions = require('firebase-functions');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const secret = process.env.JWT_SECRET || 'supersecret';

// API Health Check / Root
app.get('/', (req, res) => {
    res.send('<div style="font-family: sans-serif; text-align: center; padding: 100px;"><h1>🚀 EduPro Legendary API is Live</h1><p>Visit <b>http://localhost:5173</b> to access the Frontend Portal.</p></div>');
});

// Database Pool
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
let dbInstance;

const pool = {
    query: async (sql, params) => {
        if (!dbInstance) {
            let dbPath = path.join(__dirname, 'database.sqlite');
            if (process.env.FUNCTION_TARGET || process.env.FUNCTIONS_EMULATOR === 'true') {
                dbPath = '/tmp/database.sqlite';
                if (!fs.existsSync(dbPath)) {
                    fs.copyFileSync(path.join(__dirname, 'database.sqlite'), dbPath);
                }
            }
            dbInstance = await open({
                filename: dbPath,
                driver: sqlite3.Database
            });
        }
        if (/^\s*(SELECT|SHOW|DESCRIBE|PRAGMA)/i.test(sql)) {
           const rows = await dbInstance.all(sql, params);
           return [rows];
        } else {
           const result = await dbInstance.run(sql, params);
           return [result];
        }
    }
};

// Auth Routes
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`🔑 Login Attempt: ${email}`);
    try {
        // Direct match for demo and registered users
        const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        
        if (users.length > 0) {
            const user = users[0];
            const token = jwt.encode({ id: user.id, role: user.role }, secret);
            console.log(`✅ Login Success: ${user.name} (${user.role})`);
            res.json({ token, role: user.role, userId: user.id, name: user.name, profilePic: user.profilePic });
        } else {
            console.warn(`❌ Login Failed: ${email}`);
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) { 
        console.error('🔥 Login Error:', err);
        res.status(500).json(err); 
    }
});

app.post('/api/register', async (req, res) => {
    const { name, email, password, role, profilePic } = req.body;
    try {
        await pool.query('INSERT INTO users (name, email, password, role, profilePic) VALUES (?, ?, ?, ?, ?)', [name, email, password, role, profilePic || null]);
        res.json({ message: 'User registered' });
    } catch (err) { res.status(500).json(err); }
});

// Stats API
app.get('/api/stats', async (req, res) => {
    try {
        const [students] = await pool.query('SELECT COUNT(*) as count FROM students');
        const [teachers] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "teacher"');
        const [notices] = await pool.query('SELECT COUNT(*) as count FROM notices');
        res.json({
            totalStudents: students[0]?.count || 0,
            totalTeachers: teachers[0]?.count || 0,
            activeNotices: notices[0]?.count || 0,
            revenue: 125000 
        });
    } catch (err) { 
        console.error('Error fetching stats:', err);
        res.status(500).json({ error: 'Database error', details: err.message }); 
    }
});

// CRUD for Students
app.get('/api/students', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT s.*, sec.section_name AS section 
            FROM students s
            LEFT JOIN sections sec ON s.section_id = sec.section_id
        `);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});
app.post('/api/students', async (req, res) => {
    try {
        const { student_id, name, email, phone, class_id, section_id, dob, gender, address, blood_group, admission_date } = req.body;
        await pool.query(
            'INSERT INTO students (student_id, name, email, phone, class_id, section_id, dob, gender, address, blood_group, admission_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [student_id, name, email, phone, class_id || null, section_id || null, dob || null, gender || null, address || null, blood_group || null, admission_date || null]
        );
        res.json({ message: 'Student added' });
    } catch (err) {
        console.error('Error adding student:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});
app.delete('/api/students/:student_id', async (req, res) => {
    try {
        const { student_id } = req.params;
        console.log(`🗑️ Deleting student: ${student_id}`);
        // Manually cascade related tables to ensure data integrity
        await pool.query('DELETE FROM attendance WHERE student_id = ?', [student_id]);
        await pool.query('DELETE FROM parents WHERE student_id = ?', [student_id]);
        await pool.query('DELETE FROM fees WHERE student_id = ?', [student_id]);
        await pool.query('DELETE FROM exam_marks WHERE student_id = ?', [student_id]);
        await pool.query('DELETE FROM hostel WHERE student_id = ?', [student_id]);
        await pool.query('DELETE FROM students WHERE student_id = ?', [student_id]);
        
        console.log(`✅ Deleted student: ${student_id} and all related records.`);
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error('🔥 Error deleting student:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// CRUD for Teachers
app.get('/api/teachers', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE role = "teacher"');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching teachers:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});
app.post('/api/teachers', async (req, res) => {
    try {
        const { teacher_id, name, email, phone, subject, qualification, experience, dob, gender, password, avatar } = req.body;
        console.log(`Adding new teacher: ${name} (${email})`);
        await pool.query(
            'INSERT INTO users (teacher_id, name, email, password, role, profilePic, phone, subject, qualification, experience, dob, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [teacher_id, name, email, password || 'demo123', 'teacher', avatar || null, phone || null, subject || null, qualification || null, experience || null, dob || null, gender || null]
        );
        res.json({ message: 'Teacher added successfully' });
    } catch (err) {
        console.error('Error adding teacher:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});
app.put('/api/teachers/:teacher_id', async (req, res) => {
    try {
        const { teacher_id } = req.params;
        const { name, email, phone, subject, qualification, experience, dob, gender, avatar, password } = req.body;
        console.log(`Updating teacher: ${teacher_id}`);
        await pool.query(
            'UPDATE users SET name = ?, email = ?, phone = ?, subject = ?, qualification = ?, experience = ?, dob = ?, gender = ?, profilePic = ?, password = COALESCE(?, password) WHERE teacher_id = ? AND role = "teacher"',
            [name, email, phone || null, subject || null, qualification || null, experience || null, dob || null, gender || null, avatar || null, password || null, teacher_id]
        );
        res.json({ message: 'Teacher updated successfully' });
    } catch (err) {
        console.error('Error updating teacher:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});
app.delete('/api/teachers/:teacher_id', async (req, res) => {
    try {
        const { teacher_id } = req.params;
        console.log(`Deleting teacher: ${teacher_id}`);
        await pool.query('DELETE FROM users WHERE teacher_id = ? AND role = "teacher"', [teacher_id]);
        res.json({ message: 'Teacher deleted successfully' });
    } catch (err) {
        console.error('Error deleting teacher:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// CRUD for Users
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, email, role, created_at, profilePic FROM users');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// CRUD for Notices
app.get('/api/notices', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM notices ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching notices:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});
app.post('/api/notices', async (req, res) => {
    try {
        const { title, content, type } = req.body;
        await pool.query('INSERT INTO notices (title, content, type) VALUES (?, ?, ?)', [title, content, type]);
        res.json({ message: 'Notice posted' });
    } catch (err) {
        console.error('Error posting notice:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});
app.put('/api/notices/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, type } = req.body;
        await pool.query('UPDATE notices SET title = ?, content = ?, type = ? WHERE id = ?', [title, content, type, id]);
        res.json({ message: 'Notice updated' });
    } catch (err) {
        console.error('Error updating notice:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});
app.delete('/api/notices/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM notices WHERE id = ?', [id]);
        res.json({ message: 'Notice deleted' });
    } catch (err) {
        console.error('Error deleting notice:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Attendance
app.get('/api/attendance', async (req, res) => {
    try {
        const { date } = req.query;
        let query = 'SELECT * FROM attendance';
        const params = [];
        if (date) {
            query += ' WHERE date = ?';
            params.push(date);
        }
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching attendance:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});
app.post('/api/attendance', async (req, res) => {
    try {
        const records = Array.isArray(req.body) ? req.body : [req.body];
        const values = records.map(r => [r.student_id, r.status, r.date]);
        
        if (values.length > 0) {
            const studentIds = records.map(r => r.student_id);
            const dateVal = records[0].date;
            // Delete existing records for these students on this date to prevent duplicates
            await pool.query('DELETE FROM attendance WHERE date = ? AND student_id IN (?)', [dateVal, studentIds]);
            // Bulk insert new records
            await pool.query('INSERT INTO attendance (student_id, status, date) VALUES ?', [values]);
        }
        res.json({ message: 'Attendance recorded successfully' });
    } catch (err) {
        console.error('Error recording attendance:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Fees API
app.get('/api/fees', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM fees');
        res.json({
            totalCollected: rows.filter(r => r.status === 'Paid').reduce((sum, r) => sum + Number(r.amount), 0) || 125000,
            pendingAmount: rows.filter(r => r.status === 'Unpaid').reduce((sum, r) => sum + Number(r.amount), 0) || 45000,
            history: rows
        });
    } catch (err) { res.status(500).json(err); }
});
app.post('/api/fees', async (req, res) => {
    try {
        const { student_id, category, amount, status, due_date, payment_method } = req.body;
        await pool.query('INSERT INTO fees (student_id, category, amount, status, due_date, payment_method) VALUES (?, ?, ?, ?, ?, ?)', 
            [student_id, category, amount, status, due_date, payment_method]);
        res.json({ success: true, message: 'Fee record created' });
    } catch (err) { res.status(500).json(err); }
});

// Timetable API
app.get('/api/timetable', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM subjects');
        res.json(rows);
    } catch (err) { res.status(500).json(err); }
});
app.post('/api/timetable', async (req, res) => {
    try {
        const { name, class_id, teacher_id } = req.body;
        await pool.query('INSERT INTO subjects (name, class_id, teacher_id) VALUES (?, ?, ?)', [name, class_id, teacher_id]);
        res.json({ success: true, message: 'Subject scheduled' });
    } catch (err) { res.status(500).json(err); }
});

// Exams API
app.get('/api/exams', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM exams');
        res.json(rows);
    } catch (err) { res.status(500).json(err); }
});
app.post('/api/exams', async (req, res) => {
    try {
        const { exam_name, date, class_id } = req.body;
        await pool.query('INSERT INTO exams (exam_name, date, class_id) VALUES (?, ?, ?)', [exam_name, date, class_id]);
        res.json({ success: true, message: 'Exam created' });
    } catch (err) { res.status(500).json(err); }
});

// Transport API
app.get('/api/transport', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM transport');
        res.json(rows);
    } catch (err) { res.status(500).json(err); }
});
app.post('/api/transport', async (req, res) => {
    try {
        const { route_name, driver_name, vehicle_no, phone } = req.body;
        await pool.query('INSERT INTO transport (route_name, driver_name, vehicle_no, phone) VALUES (?, ?, ?, ?)', 
            [route_name, driver_name, vehicle_no, phone]);
        res.json({ success: true });
    } catch (err) { res.status(500).json(err); }
});

// Hostel API
app.get('/api/hostel', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM hostel');
        res.json(rows);
    } catch (err) { res.status(500).json(err); }
});
app.post('/api/hostel', async (req, res) => {
    try {
        const { room_no, student_id, block, fee_status } = req.body;
        await pool.query('INSERT INTO hostel (room_no, student_id, block, fee_status) VALUES (?, ?, ?, ?)', 
            [room_no, student_id, block, fee_status]);
        res.json({ success: true });
    } catch (err) { res.status(500).json(err); }
});

// Library API
app.get('/api/library', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM library_books');
        res.json(rows);
    } catch (err) { res.status(500).json(err); }
});
app.post('/api/library', async (req, res) => {
    try {
        const { title, author, category, status } = req.body;
        await pool.query('INSERT INTO library_books (title, author, category, status) VALUES (?, ?, ?, ?)', 
            [title, author, category, status || 'Available']);
        res.json({ success: true });
    } catch (err) { res.status(500).json(err); }
});

// Drivers API
app.get('/api/drivers', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM drivers');
        res.json(rows);
    } catch (err) { res.status(500).json(err); }
});
app.post('/api/drivers', async (req, res) => {
    try {
        const { name, license, experience, rating, status, phone, email, assignment, avatar } = req.body;
        await pool.query('INSERT INTO drivers (name, license, experience, rating, status, phone, email, assignment, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [name, license, experience, rating, status, phone, email, assignment, avatar]);
        res.json({ success: true, message: 'Driver created successfully' });
    } catch (err) { res.status(500).json(err); }
});
app.put('/api/drivers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, license, experience, rating, status, phone, email, assignment, avatar } = req.body;
        await pool.query('UPDATE drivers SET name = ?, license = ?, experience = ?, rating = ?, status = ?, phone = ?, email = ?, assignment = ?, avatar = ? WHERE id = ?', 
            [name, license, experience, rating, status, phone, email, assignment, avatar, id]);
        res.json({ success: true, message: 'Driver updated successfully' });
    } catch (err) { res.status(500).json(err); }
});
app.delete('/api/drivers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM drivers WHERE id = ?', [id]);
        res.json({ success: true, message: 'Driver deleted successfully' });
    } catch (err) { res.status(500).json(err); }
});

// Quizzes API
app.get('/api/quizzes', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM quizzes');
        res.json(rows);
    } catch (err) { res.status(500).json(err); }
});
app.post('/api/quizzes', async (req, res) => {
    try {
        const { id, title, subject, questions, time, timeLimitSec, difficulty, status, color } = req.body;
        await pool.query('INSERT INTO quizzes (id, title, subject, questions, time, timeLimitSec, difficulty, status, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [id, title, subject, questions, time, timeLimitSec, difficulty, status, color]);
        res.json({ success: true, message: 'Quiz created successfully' });
    } catch (err) { res.status(500).json(err); }
});
app.put('/api/quizzes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subject, questions, time, timeLimitSec, difficulty, status, color } = req.body;
        await pool.query('UPDATE quizzes SET title = ?, subject = ?, questions = ?, time = ?, timeLimitSec = ?, difficulty = ?, status = ?, color = ? WHERE id = ?', 
            [title, subject, questions, time, timeLimitSec, difficulty, status, color, id]);
        res.json({ success: true, message: 'Quiz updated successfully' });
    } catch (err) { res.status(500).json(err); }
});
app.delete('/api/quizzes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM quizzes WHERE id = ?', [id]);
        res.json({ success: true, message: 'Quiz deleted successfully' });
    } catch (err) { res.status(500).json(err); }
});

// Hostel Allotment Delete API
app.delete('/api/hostel/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM hostel WHERE id = ?', [id]);
        res.json({ success: true, message: 'Hostel allotment deleted successfully' });
    } catch (err) { res.status(500).json(err); }
});

// Messages API
app.get('/api/messages', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) { res.status(500).json(err); }
});
app.post('/api/messages', async (req, res) => {
    try {
        const { sender_id, receiver_id, content } = req.body;
        await pool.query('INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)', 
            [sender_id, receiver_id, content]);
        res.json({ success: true });
    } catch (err) { res.status(500).json(err); }
});

// Start Server
const PORT = process.env.PORT || 5000;
if (process.env.FUNCTION_TARGET || process.env.FUNCTIONS_EMULATOR === 'true') {
    // Export for Firebase Functions
    initDb().catch(console.error); // Init non-blocking
    exports.api = functions.https.onRequest(app);
} else {
    // Run standalone
    initDb().then(() => {
        app.listen(PORT, () => console.log(`🚀 Legendary API running on port ${PORT}`));
    });
}
