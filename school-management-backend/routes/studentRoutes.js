const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', authenticateToken, (req, res) => {
    const { student_id, name, dob, gender, address, parent_id, admission_date, blood_group, class_id, section_id } = req.body;
    const query = 'INSERT INTO students (student_id, name, dob, gender, address, parent_id, admission_date, blood_group, class_id, section_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [student_id, name, dob, gender, address, parent_id, admission_date, blood_group, class_id, section_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Student added' });
    });
});

router.delete('/:id', authenticateToken, (req, res) => {
    db.query('DELETE FROM students WHERE student_id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Student deleted' });
    });
});

module.exports = router;
