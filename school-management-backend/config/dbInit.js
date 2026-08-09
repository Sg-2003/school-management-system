const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
require('dotenv').config();

const initDb = async () => {
    const dbName = process.env.DB_NAME || 'school_db';
    
    console.log(`Connecting to database at ${process.env.DB_HOST || '127.0.0.1'} as ${process.env.DB_USER || 'root'} (Database: ${dbName})...`);
    let connection;
    try {
        connection = await open({
            filename: './database.sqlite',
            driver: sqlite3.Database
        });
        connection.query = async (sql, params) => {
            if (/^\s*(SELECT|SHOW|DESCRIBE|PRAGMA)/i.test(sql)) {
               const rows = await connection.all(sql, params);
               return [rows];
            } else {
               const result = await connection.run(sql, params);
               return [result];
            }
        };
    } catch (err) {
        console.error('\x1b[31m%s\x1b[0m', '❌ ERROR: Failed to create SQLite database:');
        console.error(err);
        process.exit(1);
    }

    // Helper to add column if not exists
    const addColumn = async (table, column, definition) => {
        try {
            await connection.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
        } catch (err) {}
    };

    const tables = [
        // 1. Users & RBAC
        `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100), email VARCHAR(100) UNIQUE, password VARCHAR(255), role TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, profilePic TEXT)`,
        
        // 2. Academics
        `CREATE TABLE IF NOT EXISTS classes (class_id INT PRIMARY KEY, class_name VARCHAR(50), teacher_id INT)`,
        `CREATE TABLE IF NOT EXISTS sections (section_id INTEGER PRIMARY KEY AUTOINCREMENT, class_id INT, section_name VARCHAR(10))`,
        `CREATE TABLE IF NOT EXISTS subjects (subject_id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100), class_id INT, teacher_id INT)`,
        
        // 3. Students & Parents
        `CREATE TABLE IF NOT EXISTS students (student_id VARCHAR(20) PRIMARY KEY, name VARCHAR(100), email VARCHAR(100), phone VARCHAR(20), class_id INT, section_id INT, dob DATE, gender VARCHAR(10), address TEXT, blood_group VARCHAR(5), admission_date DATE, avatar LONGTEXT)`,
        `CREATE TABLE IF NOT EXISTS parents (parent_id INTEGER PRIMARY KEY AUTOINCREMENT, student_id VARCHAR(20), name VARCHAR(100), phone VARCHAR(20), email VARCHAR(100))`,
        
        // 4. Attendance
        `CREATE TABLE IF NOT EXISTS attendance (id INTEGER PRIMARY KEY AUTOINCREMENT, student_id VARCHAR(20), date DATE, status TEXT, type TEXT)`,
        `CREATE TABLE IF NOT EXISTS staff_attendance (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INT, date DATE, check_in TIME, check_out TIME, status VARCHAR(20))`,
        
        // 5. Finance
        `CREATE TABLE IF NOT EXISTS fees (id INTEGER PRIMARY KEY AUTOINCREMENT, student_id VARCHAR(20), category VARCHAR(50), amount DECIMAL(10,2), status TEXT, due_date DATE, payment_method VARCHAR(20))`,
        
        // 6. Examination
        `CREATE TABLE IF NOT EXISTS exams (id INTEGER PRIMARY KEY AUTOINCREMENT, exam_name VARCHAR(100), date DATE, class_id INT)`,
        `CREATE TABLE IF NOT EXISTS exam_marks (id INTEGER PRIMARY KEY AUTOINCREMENT, exam_id INT, student_id VARCHAR(20), subject_id INT, marks_obtained INT, total_marks INT)`,
        
        // 7. Logistics
        `CREATE TABLE IF NOT EXISTS library_books (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(200), author VARCHAR(100), category VARCHAR(50), status TEXT)`,
        `CREATE TABLE IF NOT EXISTS transport (id INTEGER PRIMARY KEY AUTOINCREMENT, route_name VARCHAR(100), driver_name VARCHAR(100), vehicle_no VARCHAR(20), phone VARCHAR(20))`,
        `CREATE TABLE IF NOT EXISTS hostel (id INTEGER PRIMARY KEY AUTOINCREMENT, room_no VARCHAR(10), student_id VARCHAR(20), block VARCHAR(20), fee_status VARCHAR(20))`,
        
        // 8. Communication
        `CREATE TABLE IF NOT EXISTS notices (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(200), content TEXT, type VARCHAR(20), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
        `CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, sender_id INT, receiver_id INT, content TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
        `CREATE TABLE IF NOT EXISTS admissions (id INTEGER PRIMARY KEY AUTOINCREMENT, full_name VARCHAR(100), email VARCHAR(100), phone VARCHAR(20), status VARCHAR(20) DEFAULT 'Pending')`,
        `CREATE TABLE IF NOT EXISTS drivers (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100), license VARCHAR(50), experience VARCHAR(20), rating DECIMAL(2,1), status VARCHAR(20), phone VARCHAR(20), email VARCHAR(100), assignment VARCHAR(100), avatar TEXT)`,
        `CREATE TABLE IF NOT EXISTS quizzes (id VARCHAR(20) PRIMARY KEY, title VARCHAR(150), subject VARCHAR(100), questions INT, time VARCHAR(20), timeLimitSec INT, difficulty VARCHAR(20), status VARCHAR(20), color VARCHAR(20))`
    ];

    for (const table of tables) {
        await connection.query(table);
    }

    // Ensure students table has email column (for retrofitting existing schemas)
    await addColumn('students', 'email', 'VARCHAR(100)');
    await addColumn('users', 'profilePic', 'TEXT');
    await addColumn('users', 'teacher_id', 'VARCHAR(20)');
    await addColumn('users', 'phone', 'VARCHAR(20)');
    await addColumn('users', 'subject', 'VARCHAR(100)');
    await addColumn('users', 'qualification', 'VARCHAR(255)');
    await addColumn('users', 'experience', 'VARCHAR(50)');
    await addColumn('users', 'dob', 'DATE');
    await addColumn('users', 'gender', 'VARCHAR(20)');

    // Seed Default Users if they don't exist
    const [existing] = await connection.query('SELECT * FROM users WHERE email = ?', ['admin@school.com']);
    if (existing.length === 0) {
        await connection.query('INSERT INTO users (name, email, password, role, profilePic) VALUES (?, ?, ?, ?, ?)', 
            ['Super Admin Aarav Sharma', 'admin@school.com', 'demo123', 'admin', 'https://api.dicebear.com/7.x/initials/svg?seed=Aarav%20Sharma']);
        await connection.query('INSERT INTO users (name, email, password, role, profilePic) VALUES (?, ?, ?, ?, ?)', 
            ['Rajesh Verma', 'parent@school.com', 'demo123', 'parent', 'https://api.dicebear.com/7.x/initials/svg?seed=Rajesh%20Verma']);
        console.log('🌱 Seeded Demo Accounts with profile pics: admin@school.com & parent@school.com');
    }

    // Seed default classes if none exist
    const [existingClasses] = await connection.query('SELECT COUNT(*) as count FROM classes');
    if (existingClasses[0].count === 0) {
        await connection.query('INSERT INTO classes (class_id, class_name, teacher_id) VALUES (9, "Grade 9", 1), (10, "Grade 10", 2), (11, "Grade 11", 3), (12, "Grade 12", 4)');
    }

    // Seed sections
    const [existingSections] = await connection.query('SELECT COUNT(*) as count FROM sections');
    if (existingSections[0].count === 0) {
        await connection.query('INSERT INTO sections (class_id, section_name) VALUES (9, "A"), (9, "B"), (10, "A"), (10, "B"), (11, "A"), (12, "A")');
    }

    // Seed students
    await connection.query(`INSERT OR IGNORE INTO students (student_id, name, email, phone, class_id, section_id, dob, gender, address, blood_group, admission_date) VALUES 
    ("STU101", "Aman Verma", "aman.verma@edupro.edu", "+91 98765 43210", 10, 3, "2010-05-12", "Male", "Block C, Sector 62, Noida, UP", "O+", "2026-01-12"),
    ("STU102", "Divya Joshi", "divya.joshi@edupro.edu", "+91 98765 43211", 11, 3, "2009-08-18", "Female", "Preet Vihar, New Delhi", "A-", "2026-01-15"),
    ("STU103", "Rohan Das", "rohan.das@edupro.edu", "+91 98765 43212", 10, 3, "2010-03-05", "Male", "Salt Lake, Kolkata, WB", "B+", "2026-02-02"),
    ("STU104", "Karan Mehta", "karan.mehta@school.edu", "+91 98765 43213", 12, 4, "2008-04-12", "Male", "Andheri West, Mumbai, MH", "AB+", "2026-02-10"),
    ("STU105", "Isha Sen", "isha.sen@school.edu", "+91 98765 43214", 10, 3, "2010-09-23", "Female", "Jayanagar, Bangalore, KA", "O+", "2026-03-05"),
    ("STU106", "Aditi Nair", "aditi.nair@school.edu", "+91 98765 43215", 9, 1, "2011-03-12", "Female", "Adyar, Chennai, TN", "A+", "2026-03-12"),
    ("STU107", "Rahul Kapoor", "rahul.kapoor@school.edu", "+91 98765 43216", 11, 3, "2009-04-01", "Male", "Banjara Hills, Hyderabad, TS", "B-", "2026-04-01"),
    ("STU108", "Neha Sharma", "neha.sharma@school.edu", "+91 98765 43217", 12, 3, "2008-04-15", "Female", "Kothrud, Pune, MH", "AB-", "2026-04-15"),
    ("STU109", "Riya Banerjee", "riya.banerjee@school.edu", "+91 98765 43218", 10, 4, "2010-05-01", "Female", "Lake Town, Kolkata, WB", "O-", "2026-05-01"),
    ("STU110", "Arjun Reddy", "arjun.reddy@school.edu", "+91 98765 43219", 11, 3, "2009-05-05", "Male", "Gachibowli, Hyderabad, TS", "A+", "2026-05-05"),
    ("STU212", "Kavita Krishnan", "kavita.k@example.com", "+91 98765 43220", 11, 3, "2009-11-14", "Female", "Indiranagar, Bangalore, KA", "A+", "2026-11-14"),
    ("1", "Devendra Mishra", "devendra.mishra@edupro.edu", "+91 98765 43221", 10, 3, "2010-02-15", "Male", "Gomti Nagar, Lucknow, UP", "B+", "2026-09-01"),
    ("STU213", "Abhishek Singh", "abhishek.singh@example.com", "+91 98765 43222", 10, 4, "2010-02-15", "Male", "Civil Lines, Jaipur, RJ", "B+", "2026-09-01"),
    ("STU214", "Meera Patel", "meera.patel@example.com", "+91 98765 43223", 12, 4, "2009-07-20", "Female", "Satellite, Ahmedabad, GJ", "AB+", "2026-10-12"),
    ("STU215", "Nisha Patel", "nisha.patel@example.com", "+91 98765 43224", 9, 1, "2009-12-05", "Female", "Vastrapur, Ahmedabad, GJ", "O-", "2026-08-20"),
    ("STU216", "Sameer Khan", "sameer.khan@example.com", "+91 98765 43225", 10, 4, "2008-11-22", "Male", "Bandra, Mumbai, MH", "B-", "2026-09-15")`);

    // Seed teachers if none exist in users
    const [existingTeachers] = await connection.query('SELECT COUNT(*) as count FROM users WHERE role = "teacher"');
    if (existingTeachers[0].count === 0) {
        await connection.query('INSERT INTO users (name, email, password, role, profilePic, subject, qualification, experience, dob, gender, phone, teacher_id) VALUES ("Meera Deshmukh", "meera.d@school.com", "demo123", "teacher", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", "Mathematics", "M.Sc. B.Ed", "10 Years", "1988-04-12", "Female", "+91 98765 43230", "AD10001"), ("Amit Bose", "amit.b@school.com", "demo123", "teacher", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", "Physics", "Ph.D. Physics", "15 Years", "1980-08-18", "Male", "+91 98765 43231", "AD10002")');
    }

    // Seed library books
    const [existingBooks] = await connection.query('SELECT COUNT(*) as count FROM library_books');
    if (existingBooks[0].count === 0) {
        await connection.query(`INSERT INTO library_books (title, author, category, status) VALUES 
        ("Introduction to Algorithms", "Thomas H. Cormen", "Computer Science", "Available"),
        ("A Brief History of Time", "Stephen Hawking", "Physics", "Available"),
        ("The Great Gatsby", "F. Scott Fitzgerald", "Literature", "Issued")`);
    }

    // Seed transport routes
    const [existingTransport] = await connection.query('SELECT COUNT(*) as count FROM transport');
    if (existingTransport[0].count === 0) {
        await connection.query(`INSERT INTO transport (route_name, driver_name, vehicle_no, phone) VALUES 
        ("Noida Sector 62 Route", "Rajinder Singh", "DL-1RT-4412", "+91 98765 43280"),
        ("Preet Vihar Shuttle", "Sohan Lal", "DL-2ST-8829", "+91 98765 43281")`);
    }

    // Seed hostel rooms
    const [existingHostel] = await connection.query('SELECT COUNT(*) as count FROM hostel');
    if (existingHostel[0].count === 0) {
        await connection.query(`INSERT INTO hostel (room_no, student_id, block, fee_status) VALUES 
        ("101", "STU101", "A Block", "Paid"),
        ("102", "1", "A Block", "Paid")`);
    }

    // Seed notices
    const defaultSeedNotices = [
        { title: 'Annual Sports Meet 2026', content: 'The annual sports meet is scheduled for next month. All students are requested to register for events by the end of this week.', type: 'event' },
        { title: 'Summer Vacation Announcement', content: 'The school will remain closed for summer vacation from June 1st to July 15th. Have a great break!', type: 'academic' },
        { title: 'Parent-Teacher Meeting', content: 'PTM for the first quarter will be held this Saturday. Attendance is mandatory for all parents.', type: 'info' },
        { title: 'New Library Policy', content: 'Please note the updated library timings and book issue limits starting next Monday.', type: 'info' },
        { title: 'Semester 2 Academic Syllabus Review', content: 'The revised syllabus for Semester 2 has been updated in the LMS resources directory. All teachers and students are requested to download the updated guides.', type: 'academic' },
        { title: 'Digital Portal Scheduled Maintenance', content: 'The EduPro portal and server database will undergo scheduled security updates this Sunday from 02:00 AM to 06:00 AM. Access might be temporarily offline.', type: 'alert' },
        { title: 'Annual Science Exhibition Registration', content: 'Registration for the Annual Science Exhibition is now open! Please submit your project abstract and team names to the science department by next Friday.', type: 'event' }
    ];

    for (const notice of defaultSeedNotices) {
        const [exist] = await connection.query('SELECT * FROM notices WHERE title = ?', [notice.title]);
        if (exist.length === 0) {
            await connection.query('INSERT INTO notices (title, content, type) VALUES (?, ?, ?)', [notice.title, notice.content, notice.type]);
        }
    }

    // Seed exams
    const [existingExams] = await connection.query('SELECT COUNT(*) as count FROM exams');
    if (existingExams[0].count === 0) {
        await connection.query(`INSERT INTO exams (exam_name, date, class_id) VALUES 
        ("First Term Exams", "2026-06-10", 10),
        ("Final Term Exams", "2026-11-20", 10)`);
    }

    // Seed fees
    const [existingFees] = await connection.query('SELECT COUNT(*) as count FROM fees');
    if (existingFees[0].count === 0) {
        await connection.query(`INSERT INTO fees (student_id, category, amount, status, due_date, payment_method) VALUES 
        ("1", "Tuition Fee", 450.00, "Paid", "2026-05-05", "Online"),
        ("1", "Transport Fee", 80.00, "Paid", "2026-05-05", "Online"),
        ("STU101", "Tuition Fee", 450.00, "Unpaid", "2026-06-05", "Pending")`);
    }

    // Seed drivers
    const [existingDrivers] = await connection.query('SELECT COUNT(*) as count FROM drivers');
    if (existingDrivers[0].count === 0) {
        await connection.query(`INSERT INTO drivers (name, license, experience, rating, status, phone, email, assignment, avatar) VALUES 
        ("Rajesh Verma", "DL-2024-5501", "12 Years", 4.8, "Active", "+91 98765 43210", "r.verma@edupro.com", "North Express", "https://api.dicebear.com/7.x/initials/svg?seed=Rajesh%20Verma"),
        ("Vikram Malhotra", "DL-2023-9982", "8 Years", 4.5, "Active", "+91 98765 43211", "v.malhotra@edupro.com", "Downtown Shuttle", "https://api.dicebear.com/7.x/initials/svg?seed=Vikram%20Malhotra"),
        ("Suman Sharma", "DL-2025-1104", "15 Years", 5.0, "On Leave", "+91 98765 43212", "s.sharma@edupro.com", "Staff Loop", "https://api.dicebear.com/7.x/initials/svg?seed=Suman%20Sharma"),
        ("Manoj Kumar", "DL-2022-4433", "6 Years", 4.2, "Active", "+91 98765 43213", "m.kumar@edupro.com", "Residency Express", "https://api.dicebear.com/7.x/initials/svg?seed=Manoj%20Kumar"),
        ("Jaspreet Singh", "DL-007-GOLD", "20 Years", 4.9, "Active", "+91 98765 43214", "j.singh@edupro.com", "South Connect", "https://api.dicebear.com/7.x/initials/svg?seed=Jaspreet%20Singh")`);
    }

    // Seed quizzes
    const [existingQuizzes] = await connection.query('SELECT COUNT(*) as count FROM quizzes');
    if (existingQuizzes[0].count === 0) {
        await connection.query(`INSERT INTO quizzes (id, title, subject, questions, time, timeLimitSec, difficulty, status, color) VALUES 
        ("QZ-001", "Advanced Algebra Weekly", "Mathematics", 2, "20 mins", 1200, "Medium", "Available", "var(--primary)"),
        ("QZ-002", "Quantum Physics Intro", "Physics", 2, "15 mins", 900, "Hard", "Ongoing", "#EF4444"),
        ("QZ-003", "World War II Summary", "History", 2, "30 mins", 1800, "Easy", "Completed", "#10B981"),
        ("QZ-004", "Organic Chemistry Basics", "Chemistry", 2, "18 mins", 1080, "Hard", "Available", "#F59E0B"),
        ("QZ-005", "Differential Calculus", "Mathematics", 2, "25 mins", 1500, "Hard", "Available", "#EF4444"),
        ("QZ-006", "Global Geography Trivia", "Geography", 2, "15 mins", 900, "Easy", "Available", "#10B981"),
        ("QZ-007", "Cyber Security Ethics", "Technology", 2, "20 mins", 1200, "Medium", "Available", "var(--primary)"),
        ("QZ-008", "Business Law Essentials", "Business", 2, "30 mins", 1800, "Hard", "Ongoing", "#F59E0B")`);
    }

    await connection.close();
};

module.exports = initDb;
