const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, (req, res) => {
    db.query('SELECT * FROM teachers', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', authenticateToken, (req, res) => {
    const { teacher_id, name, qualification, subject, experience, salary } = req.body;
    const query = 'INSERT INTO teachers (teacher_id, name, qualification, subject, experience, salary) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [teacher_id, name, qualification, subject, experience, salary], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Teacher added' });
    });
});

module.exports = router;
