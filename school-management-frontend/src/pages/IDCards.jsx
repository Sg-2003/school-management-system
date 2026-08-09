import React, { useState, useEffect } from 'react';
import { User, Printer, Download, CreditCard, ShieldCheck, Search, X, Plus, Minus, Check, Truck, FileText, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStudents } from '../services/service';

import indianMan1 from '../assets/indian_man_portrait_1.png';
import indianMan2 from '../assets/indian_man_portrait_2.png';
import indianWoman1 from '../assets/indian_woman_portrait_1.png';
import indianWoman2 from '../assets/indian_woman_portrait_2.png';

const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

const IDCards = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Physical ID Card Ordering System States
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState({
    finish: 'matte', // 'matte' or 'glossy'
    shipping: 'standard', // 'standard' or 'express'
    quantity: 1,
    address: ''
  });
  const [orderStep, setOrderStep] = useState('form'); // 'form', 'processing', 'success'
  const [orderMsg, setOrderMsg] = useState('');
  const [orderRef, setOrderRef] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // Clear old storage if version is outdated to ensure Liam Fox with distinct classmates loads properly
      const storedVersion = localStorage.getItem('students_version');
      if (storedVersion !== '2026-v11') {
        localStorage.removeItem('students');
        localStorage.setItem('students_version', '2026-v11');
      }

      const stored = localStorage.getItem('students');
      if (stored) {
        const parsed = JSON.parse(stored);
        setStudents(parsed);
        setSelectedStudent(parsed[0]);
        return;
      }

      const data = await getStudents();
      if (data && data.length > 0) {
        // Map avatars to database-seeded students to prevent silhouette fallbacks
        const avatarMap = {
          'STU101': indianMan1,
          'STU102': indianWoman1,
          'STU103': indianMan2,
          'STU104': indianMan1,
          'STU105': indianWoman2,
          'STU106': indianWoman1,
          'STU107': indianMan2,
          'STU108': indianWoman2,
          'STU109': indianWoman1,
          'STU110': indianMan1,
          'STU212': indianWoman2,
          'STU213': indianMan1,
          'STU214': indianWoman1,
          'STU215': indianWoman2,
          'STU216': indianMan2,
          '1': indianMan2,
          'STU-2026-001': indianMan1
        };
        const mappedData = data.map(student => ({
          ...student,
          avatar: student.avatar || avatarMap[student.student_id] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`
        }));
        setStudents(mappedData);
        setSelectedStudent(mappedData[0]);
        localStorage.setItem('students', JSON.stringify(mappedData));
      } else {
        const mockData = [
          { student_id: 'STU101', name: 'Aman Verma', email: 'aman.verma@edupro.edu', phone: '+91 98765 43210', class_id: '10', section: 'A', rollNo: '24', admission_date: '2026-01-12', gender: 'Male', status: 'Active', avatar: indianMan1, dob: '2010-05-12', bloodGroup: 'O+', religion: 'Hinduism', parentName: 'Ramesh Verma', parentOccupation: 'Engineer', parentPhone: '+91 98765 43210', parentEmail: 'ramesh.v@example.com', presentAddress: 'Block C, Sector 62, Noida, UP', permanentAddress: 'Block C, Sector 62, Noida, UP' },
          { student_id: 'STU102', name: 'Divya Joshi', email: 'divya.joshi@edupro.edu', phone: '+91 98765 43211', class_id: '11', section: 'A', rollNo: '12', admission_date: '2026-01-15', gender: 'Female', status: 'Active', avatar: indianWoman1, dob: '2009-08-18', bloodGroup: 'A-', religion: 'Hinduism', parentName: 'Suresh Joshi', parentOccupation: 'Executive', parentPhone: '+91 98765 43211', parentEmail: 'suresh.j@example.com', presentAddress: 'Preet Vihar, New Delhi', permanentAddress: 'Preet Vihar, New Delhi' },
          { student_id: 'STU103', name: 'Rohan Das', email: 'rohan.das@edupro.edu', phone: '+91 98765 43212', class_id: '10', section: 'A', rollNo: '08', admission_date: '2026-02-02', gender: 'Male', status: 'Active', avatar: indianMan2, dob: '2010-03-05', bloodGroup: 'B+', religion: 'Hinduism', parentName: 'Manoj Das', parentOccupation: 'Manager', parentPhone: '+91 98765 43212', parentEmail: 'manoj.d@example.com', presentAddress: 'Salt Lake, Kolkata, WB', permanentAddress: 'Salt Lake, Kolkata, WB' },
          { student_id: 'STU104', name: 'Karan Mehta', email: 'karan.mehta@school.edu', phone: '+91 98765 43213', class_id: '12', section: 'B', rollNo: '14', admission_date: '2026-02-10', gender: 'Male', status: 'Inactive', avatar: indianMan1, dob: '2008-04-12', bloodGroup: 'AB+', religion: 'Hinduism', parentName: 'Harish Mehta', parentOccupation: 'Business', parentPhone: '+91 98765 43213', parentEmail: 'harish.m@example.com', presentAddress: 'Andheri West, Mumbai, MH', permanentAddress: 'Andheri West, Mumbai, MH' },
          { student_id: 'STU105', name: 'Isha Sen', email: 'isha.sen@school.edu', phone: '+91 98765 43214', class_id: '10', section: 'A', rollNo: '15', admission_date: '2026-03-05', gender: 'Female', status: 'Active', avatar: indianWoman2, dob: '2010-09-23', bloodGroup: 'O+', religion: 'Hinduism', parentName: 'Pradip Sen', parentOccupation: 'Lawyer', parentPhone: '+91 98765 43214', parentEmail: 'pradip.s@example.com', presentAddress: 'Jayanagar, Bangalore, KA', permanentAddress: 'Jayanagar, Bangalore, KA' },
          { student_id: 'STU106', name: 'Aditi Nair', email: 'aditi.nair@school.edu', phone: '+91 98765 43215', class_id: '09', section: 'C', rollNo: '02', admission_date: '2026-03-12', gender: 'Female', status: 'Active', avatar: indianWoman1, dob: '2011-03-12', bloodGroup: 'A+', religion: 'Hinduism', parentName: 'Narayanan Nair', parentOccupation: 'Doctor', parentPhone: '+91 98765 43215', parentEmail: 'narayanan.n@example.com', presentAddress: 'Adyar, Chennai, TN', permanentAddress: 'Adyar, Chennai, TN' },
          { student_id: 'STU107', name: 'Rahul Kapoor', email: 'rahul.kapoor@school.edu', phone: '+91 98765 43216', class_id: '11', section: 'B', rollNo: '05', admission_date: '2026-04-01', gender: 'Male', status: 'Active', avatar: indianMan2, dob: '2009-04-01', bloodGroup: 'B-', religion: 'Hinduism', parentName: 'Anil Kapoor', parentOccupation: 'Accountant', parentPhone: '+91 98765 43216', parentEmail: 'anil.k@example.com', presentAddress: 'Banjara Hills, Hyderabad, TS', permanentAddress: 'Banjara Hills, Hyderabad, TS' },
          { student_id: 'STU108', name: 'Neha Sharma', email: 'neha.sharma@school.edu', phone: '+91 98765 43217', class_id: '12', section: 'A', rollNo: '07', admission_date: '2026-04-15', gender: 'Female', status: 'Active', avatar: indianWoman2, dob: '2008-04-15', bloodGroup: 'AB-', religion: 'Hinduism', parentName: 'Satish Sharma', parentOccupation: 'Architect', parentPhone: '+91 98765 43217', parentEmail: 'satish.s@example.com', presentAddress: 'Kothrud, Pune, MH', permanentAddress: 'Kothrud, Pune, MH' },
          { student_id: 'STU109', name: 'Riya Banerjee', email: 'riya.banerjee@school.edu', phone: '+91 98765 43218', class_id: '10', section: 'D', rollNo: '11', admission_date: '2026-05-01', gender: 'Female', status: 'Active', avatar: indianWoman1, dob: '2010-05-01', bloodGroup: 'O-', religion: 'Hinduism', parentName: 'Swapan Banerjee', parentOccupation: 'Teacher', parentPhone: '+91 98765 43218', parentEmail: 'swapan.b@example.com', presentAddress: 'Lake Town, Kolkata, WB', permanentAddress: 'Lake Town, Kolkata, WB' },
          { student_id: 'STU110', name: 'Arjun Reddy', email: 'arjun.reddy@school.edu', phone: '+91 98765 43219', class_id: '11', section: 'A', rollNo: '18', admission_date: '2026-05-05', gender: 'Male', status: 'Active', avatar: indianMan1, dob: '2009-05-05', bloodGroup: 'A+', religion: 'Hinduism', parentName: 'Ramana Reddy', parentOccupation: 'Dentist', parentPhone: '+91 98765 43219', parentEmail: 'ramana.r@example.com', presentAddress: 'Gachibowli, Hyderabad, TS', permanentAddress: 'Gachibowli, Hyderabad, TS' },
          { student_id: 'STU212', name: 'Kavita Krishnan', email: 'kavita.k@example.com', phone: '+91 98765 43220', class_id: '11', section: 'A', rollNo: '03', admission_date: '2026-11-14', gender: 'Female', status: 'Suspended', avatar: indianWoman2, dob: '2009-11-14', bloodGroup: 'A+', religion: 'Hinduism', parentName: 'Gopal Krishnan', parentOccupation: 'Doctor', parentPhone: '+91 98765 43220', parentEmail: 'gopal.k@example.com', presentAddress: 'Indiranagar, Bangalore, KA', permanentAddress: 'Indiranagar, Bangalore, KA' }
        ];
        setStudents(mockData);
        setSelectedStudent(mockData[0]);
        localStorage.setItem('students', JSON.stringify(mockData));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrint = () => {
    if (students.length === 0) return;

    // Read active CSS variable values from the live document so the card
    // always mirrors the current theme, but we embed them as literals so
    // the isolated print window can render them without any stylesheet.
    const root = window.getComputedStyle(document.documentElement);
    const primary   = root.getPropertyValue('--primary').trim()       || '#45b3e0';
    const danger    = root.getPropertyValue('--danger').trim()        || '#dc3545';
    const textMuted = root.getPropertyValue('--text-muted').trim()    || '#718096';

    const printWindow = window.open('', '_blank');
    
    let cardsHtml = '';
    students.forEach((student) => {
      cardsHtml += `
        <div class="card-wrap">
          <div class="shimmer-bar"></div>
          <div class="card-header">
            <div class="orb1"></div>
            <div class="orb2"></div>
            <div class="card-header-inner">
              <div class="school-name">⚡ EDUPRO ACADEMY</div>
              <div class="school-sub">Excellence in Education</div>
            </div>
          </div>

          <div class="photo-ring">
            ${(student.avatar || student.img) ? `
              <img src="${student.avatar || student.img}" style="width: 100%; height: 100%; object-fit: cover;" />
            ` : `
              <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24"
                fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            `}
          </div>

          <div class="card-body">
            <div class="student-name">${student.name}</div>
            <span class="role-badge">STUDENT</span>

            <div class="info-rows">
              <div class="info-row">
                <span class="info-label">Student ID</span>
                <span class="info-value">${student.student_id}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Class</span>
                <span class="info-value">${student.class_id || 'Not Assigned'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Blood Group</span>
                <span class="info-value danger">${student.blood_group || 'O+'}</span>
              </div>
              ${student.phone ? `
              <div class="info-row">
                <span class="info-label">Contact</span>
                <span class="info-value">${student.phone}</span>
              </div>` : ''}
            </div>

            <div class="card-footer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="${primary}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
              <span class="footer-text">Authorized Signatory</span>
            </div>
          </div>
        </div>
      `;
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print All Student ID Cards</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Outfit:wght@700;800;900&display=swap" rel="stylesheet">
          <style>
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
            @page { size: 63mm 100mm; margin: 0; }
            body {
              margin: 0;
              background: #f1f5f9;
              font-family: 'Inter', sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 20px;
              padding: 20px;
            }
            .card-wrap {
              width: 350px;
              height: 520px;
              background: #ffffff;
              border-radius: 28px;
              box-shadow: 0 15px 30px rgba(0,0,0,0.1);
              overflow: hidden;
              position: relative;
              border: 1px solid #e2e8f0;
              page-break-after: always;
              break-after: always;
            }
            /* Holographic top strip */
            .shimmer-bar {
              position: absolute;
              top: 0; left: 0; right: 0;
              height: 4px;
              background: linear-gradient(90deg, ${primary}, #8B5CF6, #10B981, ${primary});
              z-index: 10;
            }
            /* Header */
            .card-header {
              height: 150px;
              background: linear-gradient(135deg, ${primary} 0%, #8B5CF6 100%);
              color: white;
              text-align: center;
              padding: 32px 24px 20px;
              position: relative;
              overflow: hidden;
            }
            .card-header .orb1 {
              position: absolute; top: -30px; right: -30px;
              width: 120px; height: 120px; border-radius: 50%;
              background: rgba(255,255,255,0.07);
            }
            .card-header .orb2 {
              position: absolute; bottom: -20px; left: -20px;
              width: 90px; height: 90px; border-radius: 50%;
              background: rgba(255,255,255,0.05);
            }
            .card-header-inner { position: relative; z-index: 2; }
            .school-name {
              font-family: 'Outfit', sans-serif;
              font-size: 1.25rem; font-weight: 900;
              letter-spacing: 1px; margin-bottom: 6px;
            }
            .school-sub {
              font-size: 0.68rem; font-weight: 600;
              letter-spacing: 2px; text-transform: uppercase;
              opacity: 0.75;
            }
            /* Photo ring */
            .photo-ring {
              width: 116px; height: 116px; border-radius: 50%;
              border: 5px solid #ffffff;
              box-shadow: 0 8px 24px rgba(0,0,0,0.15);
              background: #f1f5f9;
              position: absolute; top: 92px; left: 50%;
              transform: translateX(-50%);
              display: flex; align-items: center; justify-content: center;
              overflow: hidden;
            }
            .photo-ring svg { display: block; }
            /* Body */
            .card-body {
              margin-top: 72px;
              text-align: center;
              padding: 0 24px 24px;
            }
            .student-name {
              font-family: 'Outfit', sans-serif;
              font-size: 1.2rem; font-weight: 900;
              color: #1a202c; margin-bottom: 8px;
            }
            .role-badge {
              display: inline-block;
              background: linear-gradient(135deg, rgba(69,179,224,0.18), rgba(139,92,246,0.18));
              color: ${primary};
              padding: 5px 16px; border-radius: 20px;
              font-size: 0.68rem; font-weight: 800;
              border: 1px solid rgba(69,179,224,0.3);
              letter-spacing: 1px;
            }
            /* Info rows */
            .info-rows { margin-top: 24px; display: flex; flex-direction: column; gap: 8px; text-align: left; }
            .info-row {
              display: flex; justify-content: space-between; align-items: center;
              padding: 10px 14px; border-radius: 12px;
              background: #f8fafc; border: 1px solid #e2e8f0;
            }
            .info-label { color: ${textMuted}; font-size: 0.76rem; font-weight: 600; }
            .info-value { font-weight: 800; font-size: 0.8rem; color: #1a202c; }
            .info-value.danger { color: ${danger}; }
            /* Footer */
            .card-footer {
              margin-top: 20px; padding-top: 16px;
              border-top: 1px dashed #e2e8f0;
              display: flex; align-items: center; justify-content: center; gap: 8px;
            }
            .footer-text {
              font-size: 0.65rem; color: ${textMuted};
              font-weight: 700; letter-spacing: 0.5px;
              text-transform: uppercase;
            }
            @media print {
              body {
                background: none;
                padding: 0;
                gap: 0;
              }
              .card-wrap {
                box-shadow: none;
                margin: 0 auto;
                page-break-after: always;
                break-after: always;
              }
              .card-wrap:last-child {
                page-break-after: avoid;
                break-after: avoid;
              }
            }
          </style>
        </head>
        <body>
          ${cardsHtml}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() { window.close(); }, 300);
              }, 600);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintSingle = () => {
    if (!selectedStudent) return;

    // Read active CSS variable values from the live document so the card
    // always mirrors the current theme, but we embed them as literals so
    // the isolated print window can render them without any stylesheet.
    const root = window.getComputedStyle(document.documentElement);
    const primary   = root.getPropertyValue('--primary').trim()       || '#45b3e0';
    const danger    = root.getPropertyValue('--danger').trim()        || '#dc3545';
    const textMuted = root.getPropertyValue('--text-muted').trim()    || '#718096';

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print ID Card – ${selectedStudent.name}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Outfit:wght@700;800;900&display=swap" rel="stylesheet">
          <style>
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
            @page { size: 63mm 100mm; margin: 0; }
            body {
              margin: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: #f1f5f9;
              font-family: 'Inter', sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .card-wrap {
              width: 350px;
              height: 520px;
              background: #ffffff;
              border-radius: 28px;
              box-shadow: 0 30px 60px -15px rgba(0,0,0,0.25);
              overflow: hidden;
              position: relative;
              border: 1px solid #e2e8f0;
            }
            /* Holographic top strip */
            .shimmer-bar {
              position: absolute;
              top: 0; left: 0; right: 0;
              height: 4px;
              background: linear-gradient(90deg, ${primary}, #8B5CF6, #10B981, ${primary});
              z-index: 10;
            }
            /* Header */
            .card-header {
              height: 150px;
              background: linear-gradient(135deg, ${primary} 0%, #8B5CF6 100%);
              color: white;
              text-align: center;
              padding: 32px 24px 20px;
              position: relative;
              overflow: hidden;
            }
            .card-header .orb1 {
              position: absolute; top: -30px; right: -30px;
              width: 120px; height: 120px; border-radius: 50%;
              background: rgba(255,255,255,0.07);
            }
            .card-header .orb2 {
              position: absolute; bottom: -20px; left: -20px;
              width: 90px; height: 90px; border-radius: 50%;
              background: rgba(255,255,255,0.05);
            }
            .card-header-inner { position: relative; z-index: 2; }
            .school-name {
              font-family: 'Outfit', sans-serif;
              font-size: 1.25rem; font-weight: 900;
              letter-spacing: 1px; margin-bottom: 6px;
            }
            .school-sub {
              font-size: 0.68rem; font-weight: 600;
              letter-spacing: 2px; text-transform: uppercase;
              opacity: 0.75;
            }
            /* Photo ring */
            .photo-ring {
              width: 116px; height: 116px; border-radius: 50%;
              border: 5px solid #ffffff;
              box-shadow: 0 8px 24px rgba(0,0,0,0.15);
              background: #f1f5f9;
              position: absolute; top: 92px; left: 50%;
              transform: translateX(-50%);
              display: flex; align-items: center; justify-content: center;
              overflow: hidden;
            }
            .photo-ring svg { display: block; }
            /* Body */
            .card-body {
              margin-top: 72px;
              text-align: center;
              padding: 0 24px 24px;
            }
            .student-name {
              font-family: 'Outfit', sans-serif;
              font-size: 1.2rem; font-weight: 900;
              color: #1a202c; margin-bottom: 8px;
            }
            .role-badge {
              display: inline-block;
              background: linear-gradient(135deg, rgba(69,179,224,0.18), rgba(139,92,246,0.18));
              color: ${primary};
              padding: 5px 16px; border-radius: 20px;
              font-size: 0.68rem; font-weight: 800;
              border: 1px solid rgba(69,179,224,0.3);
              letter-spacing: 1px;
            }
            /* Info rows */
            .info-rows { margin-top: 24px; display: flex; flex-direction: column; gap: 8px; text-align: left; }
            .info-row {
              display: flex; justify-content: space-between; align-items: center;
              padding: 10px 14px; border-radius: 12px;
              background: #f8fafc; border: 1px solid #e2e8f0;
            }
            .info-label { color: ${textMuted}; font-size: 0.76rem; font-weight: 600; }
            .info-value { font-weight: 800; font-size: 0.8rem; color: #1a202c; }
            .info-value.danger { color: ${danger}; }
            /* Footer */
            .card-footer {
              margin-top: 20px; padding-top: 16px;
              border-top: 1px dashed #e2e8f0;
              display: flex; align-items: center; justify-content: center; gap: 8px;
            }
            .footer-text {
              font-size: 0.65rem; color: ${textMuted};
              font-weight: 700; letter-spacing: 0.5px;
              text-transform: uppercase;
            }
            /* Shield SVG color */
            .shield-icon { color: ${primary}; }
          </style>
        </head>
        <body>
          <div class="card-wrap">
            <div class="shimmer-bar"></div>
            <div class="card-header">
              <div class="orb1"></div>
              <div class="orb2"></div>
              <div class="card-header-inner">
                <div class="school-name">⚡ EDUPRO ACADEMY</div>
                <div class="school-sub">Excellence in Education</div>
              </div>
            </div>

             <div class="photo-ring">
              ${(selectedStudent.avatar || selectedStudent.img) ? `
                <img src="${selectedStudent.avatar || selectedStudent.img}" style="width: 100%; height: 100%; object-fit: cover;" />
              ` : `
                <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24"
                  fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              `}
            </div>

            <div class="card-body">
              <div class="student-name">${selectedStudent.name}</div>
              <span class="role-badge">STUDENT</span>

              <div class="info-rows">
                <div class="info-row">
                  <span class="info-label">Student ID</span>
                  <span class="info-value">${selectedStudent.student_id}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Class</span>
                  <span class="info-value">${selectedStudent.class_id || 'Not Assigned'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Blood Group</span>
                  <span class="info-value danger">${selectedStudent.blood_group || 'O+'}</span>
                </div>
                ${selectedStudent.phone ? `
                <div class="info-row">
                  <span class="info-label">Contact</span>
                  <span class="info-value">${selectedStudent.phone}</span>
                </div>` : ''}
              </div>

              <div class="card-footer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="${primary}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
                <span class="footer-text">Authorized Signatory</span>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() { window.close(); }, 300);
              }, 600);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadJPG = () => {
    if (!selectedStudent) return;

    const executeDrawing = (avatarImg) => {
      // Create high-resolution canvas for crisp text rendering
      const scale = 3;
      const canvas = document.createElement('canvas');
      const width = 350;
      const height = 520;
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);

      // Font smoothing
      ctx.textBaseline = 'top';
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Retrieve active styles for consistent branding
      const rootStyle = window.getComputedStyle(document.documentElement);
      const primaryColor = rootStyle.getPropertyValue('--primary').trim() || '#45b3e0';
      const primaryLightColor = rootStyle.getPropertyValue('--primary-light').trim() || 'rgba(69, 179, 224, 0.08)';
      const dangerColor = rootStyle.getPropertyValue('--danger').trim() || '#dc3545';
      const textMutedColor = rootStyle.getPropertyValue('--text-muted').trim() || '#718096';
      const borderColor = rootStyle.getPropertyValue('--border-color').trim() || '#edf2f7';

      // 1. Draw rounded outer container base
      ctx.save();
      ctx.beginPath();
      const radius = 24;
      ctx.roundRect(0, 0, width, height, radius);
      ctx.clip();

      // Fill background with card background white
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Draw header solid background
      ctx.fillStyle = primaryColor;
      ctx.fillRect(0, 0, width, 140);

      // Draw Header text: Academy Title
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = '800 20px Outfit, Inter, sans-serif';
      ctx.fillText('EDUPRO ACADEMY', width / 2, 36);

      // Draw Header text: Academy Subtitle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '500 11px Inter, sans-serif';
      ctx.fillText('Excellence in Education', width / 2, 66);
      ctx.restore();

      // 2. Draw user photo circle frame (centered at boundary x=175, y=140)
      ctx.save();
      const photoX = width / 2;
      const photoY = 140;
      const photoRadius = 60; // radius of outer boundary

      // White outer border stroke circle
      ctx.beginPath();
      ctx.arc(photoX, photoY, photoRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Grey inner container circle background
      ctx.beginPath();
      ctx.arc(photoX, photoY, photoRadius - 6, 0, Math.PI * 2);
      ctx.fillStyle = '#f1f5f9';
      ctx.fill();
      ctx.clip();

      if (avatarImg) {
        // Draw loaded profile image centered and cropped inside the circle clip
        ctx.drawImage(avatarImg, photoX - (photoRadius - 6), photoY - (photoRadius - 6), (photoRadius - 6) * 2, (photoRadius - 6) * 2);
      } else {
        // Draw User Icon silhouette fallback
        // Head circle representation
        ctx.beginPath();
        ctx.arc(photoX, photoY - 10, 18, 0, Math.PI * 2);
        ctx.fillStyle = '#cbd5e1';
        ctx.fill();

        // Body shoulder representation
        ctx.beginPath();
        ctx.arc(photoX, photoY + 38, 34, Math.PI, 0, false);
        ctx.fillStyle = '#cbd5e1';
        ctx.fill();
      }
      ctx.restore();

      // 3. Name & Role
      ctx.textAlign = 'center';
      ctx.fillStyle = '#2d3748';
      ctx.font = '800 20px Outfit, Inter, sans-serif';
      ctx.fillText(selectedStudent.name, width / 2, 210);

      // "STUDENT" role badge
      const badgeText = 'STUDENT';
      ctx.font = '800 12px Inter, sans-serif';
      const badgeTextWidth = ctx.measureText(badgeText).width;
      const badgePaddingX = 12;
      const badgePaddingY = 4;
      const badgeW = badgeTextWidth + badgePaddingX * 2;
      const badgeH = 12 + badgePaddingY * 2;
      const badgeX = (width - badgeW) / 2;
      const badgeY = 236;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 12);
      ctx.fillStyle = primaryLightColor;
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = primaryColor;
      ctx.font = '800 12px Inter, sans-serif';
      ctx.fillText(badgeText, width / 2, badgeY + badgePaddingY);

      // 4. Details Fields List (Student ID, Class, Blood Group)
      const startY = 296;
      const lineGap = 20;
      const details = [
        { label: 'Student ID:', value: selectedStudent.student_id, valueColor: '#2d3748' },
        { label: 'Class:', value: selectedStudent.class_id || 'Not Assigned', valueColor: '#2d3748' },
        { label: 'Blood Group:', value: selectedStudent.blood_group || 'O+', valueColor: dangerColor },
      ];

      details.forEach((item, idx) => {
        const currentY = startY + idx * lineGap;

        // Label (Left alignment)
        ctx.textAlign = 'left';
        ctx.fillStyle = textMutedColor;
        ctx.font = '500 13px Inter, sans-serif';
        ctx.fillText(item.label, 24, currentY);

        // Value (Right alignment)
        ctx.textAlign = 'right';
        ctx.fillStyle = item.valueColor;
        ctx.font = '700 13px Inter, sans-serif';
        ctx.fillText(item.value, width - 24, currentY);
      });

      // 5. Dashed Separator Line
      ctx.save();
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(24, 380);
      ctx.lineTo(width - 24, 380);
      ctx.stroke();
      ctx.restore();

      // 6. Security Shield Check Badge
      const shieldX = width / 2;
      const shieldY = 398;
      const shieldW = 20;
      const shieldH = 24;

      ctx.save();
      ctx.fillStyle = primaryColor;
      ctx.beginPath();
      ctx.moveTo(shieldX, shieldY);
      ctx.quadraticCurveTo(shieldX + shieldW / 2, shieldY - 2, shieldX + shieldW / 2, shieldY + 3);
      ctx.lineTo(shieldX + shieldW / 2, shieldY + 12);
      ctx.quadraticCurveTo(shieldX + shieldW / 2, shieldY + 20, shieldX, shieldY + shieldH);
      ctx.quadraticCurveTo(shieldX - shieldW / 2, shieldY + 20, shieldX - shieldW / 2, shieldY + 12);
      ctx.lineTo(shieldX - shieldW / 2, shieldY + 3);
      ctx.quadraticCurveTo(shieldX - shieldW / 2, shieldY - 2, shieldX, shieldY);
      ctx.closePath();
      ctx.fill();

      // Checkmark inside shield
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(shieldX - 4, shieldY + 11);
      ctx.lineTo(shieldX - 1, shieldY + 14);
      ctx.lineTo(shieldX + 4, shieldY + 8);
      ctx.stroke();
      ctx.restore();

      // "Authorized Signatory" footer text
      ctx.textAlign = 'center';
      ctx.fillStyle = textMutedColor;
      ctx.font = '600 10px Inter, sans-serif';
      ctx.fillText('Authorized Signatory', width / 2, 442);

      // 7. Outer border outline around the base card container
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(0.5, 0.5, width - 1, height - 1, radius);
      ctx.stroke();

      // 8. Generate JPG and trigger dynamic browser download
      try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const link = document.createElement('a');
        const filename = `${selectedStudent.name.replace(/\s+/g, '_')}_ID_Card.jpg`;
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('Failed to export canvas to JPEG:', err);
      }
    };

    const targetAvatar = selectedStudent.avatar || selectedStudent.img;
    if (targetAvatar) {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // critical for Unsplash CORS
      img.onload = () => {
        executeDrawing(img);
      };
      img.onerror = () => {
        executeDrawing(null);
      };
      img.src = targetAvatar;
    } else {
      executeDrawing(null);
    }
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!orderForm.address.trim()) return;

    setOrderStep('processing');
    
    const messages = [
      'Verifying student registry credentials in database...',
      'Encoding student card security chip hashes...',
      'Sending print job block to institutional fulfillment warehouse...',
      'Securing express shipping dispatcher route...'
    ];

    let currentMsgIdx = 0;
    setOrderMsg(messages[0]);

    const interval = setInterval(() => {
      currentMsgIdx++;
      if (currentMsgIdx < messages.length) {
        setOrderMsg(messages[currentMsgIdx]);
      } else {
        clearInterval(interval);
        const ref = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        setOrderRef(ref);
        setOrderStep('success');
      }
    }, 500);
  };

  const handleDownloadInvoice = () => {
    if (!selectedStudent) return;

    const basePrice = 4.99;
    const finishPrice = orderForm.finish === 'glossy' ? 1.50 : 0.00;
    const shippingPrice = orderForm.shipping === 'express' ? 8.99 : 3.99;
    const itemsTotal = (basePrice + finishPrice) * orderForm.quantity;
    const totalAmount = itemsTotal + shippingPrice;

    const invoiceContent = `==================================================
           EDUPRO ACADEMY - OFFICIAL INVOICE
==================================================
Order Reference: ${orderRef}
Date Placed:     ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
Student Name:    ${selectedStudent.name}
Student ID:      ${selectedStudent.student_id}
Class/Grade:     Class ${selectedStudent.class_id || 'N/A'}
--------------------------------------------------
ITEM DETAILS:
--------------------------------------------------
Physical ID Card Base Price:     $${basePrice.toFixed(2)} x ${orderForm.quantity}
Finish Type:                     ${orderForm.finish.toUpperCase()} ($${finishPrice.toFixed(2)} extra/card)
Shipping Method:                 ${orderForm.shipping.toUpperCase()} ($${shippingPrice.toFixed(2)})
Delivery Address:                ${orderForm.address}

--------------------------------------------------
PRICING BREAKDOWN:
--------------------------------------------------
Subtotal (Cards):                $${itemsTotal.toFixed(2)}
Shipping & Handling:             $${shippingPrice.toFixed(2)}
--------------------------------------------------
TOTAL AMOUNT CHARGED:            $${totalAmount.toFixed(2)}
==================================================
Payment Status:  PAID (Institutional Pre-Approved)
Fulfillment Status: IN QUEUE FOR PRINTING
Estimated Arrival:  ${orderForm.shipping === 'express' ? '1-2 Business Days' : '5-7 Business Days'}
==================================================
Thank you for your order. Keep this copy for your records.`;

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedStudent.name.replace(/\s+/g, '_')}_ID_Order_${orderRef}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ display: 'inline-flex', padding: '10px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--primary), #8B5CF6)', color: 'white' }}>
              <CreditCard size={24} />
            </span>
            Smart ID Card Generator
          </h1>
          <p className="text-muted">Generate and print professional student identification cards instantly.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04, translateY: -2, boxShadow: '0 12px 24px -6px rgba(69,179,224,0.45)' }}
          whileTap={{ scale: 0.96 }}
          className="btn btn-primary"
          onClick={handlePrint}
          style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #8B5CF6 100%)', border: 'none', color: 'white', fontWeight: 800, gap: '8px', boxShadow: '0 6px 16px -4px rgba(69,179,224,0.35)' }}
        >
          <Printer size={18} /> Print All Cards
        </motion.button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        {/* Selection List */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Student Directory</h3>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '4px 8px', borderRadius: '6px' }}>{students.length} Students</span>
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search directory..." 
              style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontSize: '0.9rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.student_id.toLowerCase().includes(searchTerm.toLowerCase())).map((student) => (
              <div 
                key={student.student_id}
                onClick={() => setSelectedStudent(student)}
                style={{ 
                  padding: '16px', borderRadius: '16px', cursor: 'pointer',
                  backgroundColor: selectedStudent?.student_id === student.student_id ? 'var(--primary-light)' : 'transparent',
                  border: '1px solid', borderColor: selectedStudent?.student_id === student.student_id ? 'var(--primary)' : 'var(--border-color)',
                  display: 'flex', alignItems: 'center', gap: '16px', transition: '0.2s', position: 'relative', overflow: 'hidden'
                }}
              >
                {selectedStudent?.student_id === student.student_id && (
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: 'var(--primary)' }}></div>
                )}
                <div style={{ 
                  width: '44px', height: '44px', borderRadius: '14px', 
                  backgroundColor: selectedStudent?.student_id === student.student_id ? 'white' : 'var(--bg-body)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, color: 'var(--primary)', boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden'
                }}>
                  {student.avatar || student.img ? (
                    <img src={student.avatar || student.img} alt={student.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    student.name.charAt(0)
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>{student.name}</p>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>Class {student.class_id}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <small className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600 }}>ID: #{student.student_id}</small>
                    <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'var(--border-color)' }}></div>
                    <small style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>Active</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Area */}
        <div
          className="card"
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-body)',
            position: 'relative', overflow: 'hidden', padding: '48px 32px'
          }}
        >
          {/* Mesh gradient backdrop */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 20% 30%, rgba(69,179,224,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(139,92,246,0.07) 0%, transparent 60%)',
          }} />

          {/* Holographic label badge */}
          <div style={{
            position: 'absolute', top: '20px', right: '20px',
            background: 'linear-gradient(135deg, rgba(69,179,224,0.15), rgba(139,92,246,0.15))',
            border: '1px solid rgba(139,92,246,0.25)',
            borderRadius: '30px', padding: '6px 14px',
            display: 'flex', alignItems: 'center', gap: '6px',
            backdropFilter: 'blur(8px)'
          }}>
            <Sparkles size={12} color="var(--primary)" />
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.5px' }}>LIVE PREVIEW</span>
          </div>

          {selectedStudent ? (
            <motion.div
              key={selectedStudent.student_id}
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              id="id-card-preview"
              style={{ 
                width: '350px', height: '520px',
                background: 'linear-gradient(160deg, var(--bg-card) 0%, var(--bg-body) 100%)',
                borderRadius: '28px', 
                boxShadow: '0 30px 60px -15px rgba(0,0,0,0.35), 0 0 0 1px rgba(139,92,246,0.18)',
                overflow: 'hidden', position: 'relative',
                border: '1px solid var(--border-color)'
              }}
            >
              {/* Holographic shimmer top strip */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: 'linear-gradient(90deg, #45b3e0, #8B5CF6, #10B981, #45b3e0)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s linear infinite',
                zIndex: 10
              }} />

              {/* Card Header */}
              <div style={{
                height: '150px',
                background: 'linear-gradient(135deg, var(--primary) 0%, #8B5CF6 100%)',
                padding: '28px 24px 20px',
                color: 'white', textAlign: 'center',
                position: 'relative', overflow: 'hidden'
              }}>
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Zap size={14} color="rgba(255,255,255,0.8)" />
                    <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, letterSpacing: '1px' }}>EDUPRO ACADEMY</h2>
                  </div>
                  <p style={{ margin: 0, opacity: 0.75, fontSize: '0.72rem', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>Excellence in Education</p>
                </div>
              </div>

              {/* Card Photo */}
              <div style={{ 
                width: '120px', height: '120px', borderRadius: '50%',
                border: '5px solid var(--bg-card)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                backgroundColor: 'var(--bg-body)',
                position: 'absolute', top: '88px', left: '50%', transform: 'translateX(-50%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {selectedStudent.avatar || selectedStudent.img ? (
                  <img src={selectedStudent.avatar || selectedStudent.img} alt={selectedStudent.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={56} color="var(--text-muted)" />
                )}
              </div>

              {/* Card Content */}
              <div style={{ marginTop: '74px', textAlign: 'center', padding: '0 28px 24px' }}>
                <h3 style={{ fontSize: '1.25rem', margin: '0 0 8px 0', fontWeight: 900, color: 'var(--text-main)' }}>{selectedStudent.name}</h3>
                <span style={{ 
                  background: 'linear-gradient(135deg, rgba(69,179,224,0.18), rgba(139,92,246,0.18))',
                  color: 'var(--primary)', padding: '5px 14px', 
                  borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800,
                  border: '1px solid rgba(69,179,224,0.25)', letterSpacing: '1px'
                }}>STUDENT</span>

                <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                  {[
                    { label: 'Student ID', value: selectedStudent.student_id, special: false },
                    { label: 'Class', value: selectedStudent.class_id || 'Not Assigned', special: false },
                    { label: 'Blood Group', value: selectedStudent.blood_group || 'O+', special: true },
                  ].map((row, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 14px', borderRadius: '12px',
                      backgroundColor: 'var(--bg-body)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600 }}>{row.label}</span>
                      <span style={{ fontWeight: 800, fontSize: '0.82rem', color: row.special ? 'var(--danger)' : 'var(--text-main)' }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="var(--primary)" />
                  <p style={{ margin: 0, fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.5px' }}>AUTHORIZED SIGNATORY</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}>
              <CreditCard size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <p style={{ fontWeight: 600 }}>Select a student to preview card</p>
            </div>
          )}
          
          <div style={{ marginTop: '36px', display: 'flex', gap: '12px', position: 'relative', zIndex: 2 }}>
            <motion.button
              whileHover={{ scale: 1.04, translateY: -2 }}
              whileTap={{ scale: 0.96 }}
              className="btn"
              onClick={handlePrintSingle}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, padding: '12px 20px', borderRadius: '14px' }}
            >
              <Printer size={16} /> Print Card
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, translateY: -2 }}
              whileTap={{ scale: 0.96 }}
              className="btn"
              onClick={handleDownloadJPG}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, padding: '12px 20px', borderRadius: '14px' }}
            >
              <Download size={16} /> Download JPG
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, translateY: -2, boxShadow: '0 12px 24px -6px rgba(139,92,246,0.5)' }}
              whileTap={{ scale: 0.96 }}
              className="btn"
              onClick={() => {
                setOrderForm({ finish: 'matte', shipping: 'standard', quantity: 1, address: '' });
                setOrderStep('form');
                setShowOrderModal(true);
              }}
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, #8B5CF6 100%)',
                border: 'none', color: 'white', fontWeight: 800, padding: '12px 20px', borderRadius: '14px',
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 6px 16px -4px rgba(139,92,246,0.35)'
              }}
            >
              <CreditCard size={16} /> Order Physical Card
            </motion.button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {showOrderModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
            padding: '20px'
          }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{
                width: '100%', maxWidth: '520px', backgroundColor: 'var(--bg-card)',
                borderRadius: '24px', border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-xl)', overflow: 'hidden', display: 'flex', flexDirection: 'column'
              }}
            >
              {orderStep === 'form' && (
                <form onSubmit={handleOrderSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '90vh' }}>
                  {/* Modal Header */}
                  <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Order Physical ID Card</h3>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Institutional card printing for <strong style={{ color: 'var(--text-main)' }}>{selectedStudent.name}</strong>
                      </p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowOrderModal(false)}
                      style={{ 
                        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', 
                        padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)'
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Modal Scrollable Form Container */}
                  <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                    {/* 1. Finish Selectors */}
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', display: 'block', marginBottom: '12px' }}>
                        Select Card Finish
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {/* Matte */}
                        <div 
                          onClick={() => setOrderForm(prev => ({ ...prev, finish: 'matte' }))}
                          style={{
                            padding: '16px', borderRadius: '16px', border: '2px solid', cursor: 'pointer', transition: '0.2s',
                            borderColor: orderForm.finish === 'matte' ? 'var(--primary)' : 'var(--border-color)',
                            backgroundColor: orderForm.finish === 'matte' ? 'var(--primary-light)' : 'transparent',
                            display: 'flex', flexDirection: 'column', gap: '8px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Standard Matte</span>
                            <div style={{ 
                              width: '18px', height: '18px', borderRadius: '50%', border: '2px solid',
                              borderColor: orderForm.finish === 'matte' ? 'var(--primary)' : '#cbd5e1',
                              backgroundColor: orderForm.finish === 'matte' ? 'var(--primary)' : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                              {orderForm.finish === 'matte' && <Check size={12} color="white" />}
                            </div>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Anti-reflective smooth texture. Included in base price.</span>
                        </div>

                        {/* Glossy */}
                        <div 
                          onClick={() => setOrderForm(prev => ({ ...prev, finish: 'glossy' }))}
                          style={{
                            padding: '16px', borderRadius: '16px', border: '2px solid', cursor: 'pointer', transition: '0.2s',
                            borderColor: orderForm.finish === 'glossy' ? 'var(--primary)' : 'var(--border-color)',
                            backgroundColor: orderForm.finish === 'glossy' ? 'var(--primary-light)' : 'transparent',
                            display: 'flex', flexDirection: 'column', gap: '8px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Premium Glossy</span>
                            </div>
                            <div style={{ 
                              width: '18px', height: '18px', borderRadius: '50%', border: '2px solid',
                              borderColor: orderForm.finish === 'glossy' ? 'var(--primary)' : '#cbd5e1',
                              backgroundColor: orderForm.finish === 'glossy' ? 'var(--primary)' : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                              {orderForm.finish === 'glossy' && <Check size={12} color="white" />}
                            </div>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vibrant high-shine surface finish. +$1.50 / card.</span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Shipping Speed */}
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', display: 'block', marginBottom: '12px' }}>
                        Shipping Priority
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {/* Standard */}
                        <div 
                          onClick={() => setOrderForm(prev => ({ ...prev, shipping: 'standard' }))}
                          style={{
                            padding: '14px 16px', borderRadius: '16px', border: '1px solid', cursor: 'pointer', transition: '0.2s',
                            borderColor: orderForm.shipping === 'standard' ? 'var(--primary)' : 'var(--border-color)',
                            backgroundColor: orderForm.shipping === 'standard' ? 'var(--primary-light)' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyStyle: 'space-between', width: '100%'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                            <Truck size={18} color={orderForm.shipping === 'standard' ? 'var(--primary)' : 'var(--text-muted)'} />
                            <div>
                              <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>Standard Delivery</span>
                              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Takes 5-7 business days ($3.99)</small>
                            </div>
                          </div>
                          <div style={{ 
                            width: '18px', height: '18px', borderRadius: '50%', border: '2px solid',
                            borderColor: orderForm.shipping === 'standard' ? 'var(--primary)' : '#cbd5e1',
                            backgroundColor: orderForm.shipping === 'standard' ? 'var(--primary)' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            {orderForm.shipping === 'standard' && <Check size={12} color="white" />}
                          </div>
                        </div>

                        {/* Express */}
                        <div 
                          onClick={() => setOrderForm(prev => ({ ...prev, shipping: 'express' }))}
                          style={{
                            padding: '14px 16px', borderRadius: '16px', border: '1px solid', cursor: 'pointer', transition: '0.2s',
                            borderColor: orderForm.shipping === 'express' ? 'var(--primary)' : 'var(--border-color)',
                            backgroundColor: orderForm.shipping === 'express' ? 'var(--primary-light)' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyStyle: 'space-between', width: '100%'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                            <Truck size={18} color={orderForm.shipping === 'express' ? 'var(--primary)' : 'var(--text-muted)'} />
                            <div>
                              <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>Express Dispatch</span>
                              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Takes 1-2 business days, priority batch ($8.99)</small>
                            </div>
                          </div>
                          <div style={{ 
                            width: '18px', height: '18px', borderRadius: '50%', border: '2px solid',
                            borderColor: orderForm.shipping === 'express' ? 'var(--primary)' : '#cbd5e1',
                            backgroundColor: orderForm.shipping === 'express' ? 'var(--primary)' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            {orderForm.shipping === 'express' && <Check size={12} color="white" />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. Quantity & Address */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '20px' }}>
                      {/* Quantity */}
                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                          Quantity
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '6px', backgroundColor: 'var(--bg-body)', justifyContent: 'space-between', height: '48px' }}>
                          <button 
                            type="button"
                            disabled={orderForm.quantity <= 1}
                            onClick={() => setOrderForm(p => ({ ...p, quantity: Math.max(1, p.quantity - 1) }))}
                            style={{ 
                              width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              border: 'none', backgroundColor: orderForm.quantity <= 1 ? 'transparent' : 'white', cursor: orderForm.quantity <= 1 ? 'not-allowed' : 'pointer',
                              boxShadow: orderForm.quantity <= 1 ? 'none' : 'var(--shadow-sm)', color: orderForm.quantity <= 1 ? '#cbd5e1' : 'var(--text-main)',
                              transition: '0.2s'
                            }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{orderForm.quantity}</span>
                          <button 
                            type="button"
                            disabled={orderForm.quantity >= 10}
                            onClick={() => setOrderForm(p => ({ ...p, quantity: Math.min(10, p.quantity + 1) }))}
                            style={{ 
                              width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              border: 'none', backgroundColor: orderForm.quantity >= 10 ? 'transparent' : 'white', cursor: orderForm.quantity >= 10 ? 'not-allowed' : 'pointer',
                              boxShadow: orderForm.quantity >= 10 ? 'none' : 'var(--shadow-sm)', color: orderForm.quantity >= 10 ? '#cbd5e1' : 'var(--text-main)',
                              transition: '0.2s'
                            }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                          Shipping Address
                        </label>
                        <input 
                          type="text"
                          required
                          placeholder="Fulfillment address..."
                          value={orderForm.address}
                          onChange={(e) => setOrderForm(p => ({ ...p, address: e.target.value }))}
                          style={{
                            width: '100%', height: '48px', padding: '10px 14px', borderRadius: '14px',
                            border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontSize: '0.9rem',
                            outline: 'none', color: 'var(--text-main)', transition: '0.2s'
                          }}
                        />
                      </div>
                    </div>

                    {/* 4. Pricing Box */}
                    <div style={{ padding: '20px', borderRadius: '20px', backgroundColor: 'var(--bg-body)', border: '1px dashed var(--border-color)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Card Base Fee ($4.99 x {orderForm.quantity}):</span>
                          <span style={{ fontWeight: 700 }}>${(4.99 * orderForm.quantity).toFixed(2)}</span>
                        </div>
                        {orderForm.finish === 'glossy' && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Glossy finish surcharge ($1.50 x {orderForm.quantity}):</span>
                            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>+${(1.50 * orderForm.quantity).toFixed(2)}</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Shipping priority fee:</span>
                          <span style={{ fontWeight: 700 }}>${(orderForm.shipping === 'express' ? 8.99 : 3.99).toFixed(2)}</span>
                        </div>
                        <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800 }}>
                          <span>Total order price:</span>
                          <span style={{ color: 'var(--primary)' }}>
                            ${(((4.99 + (orderForm.finish === 'glossy' ? 1.50 : 0.00)) * orderForm.quantity) + (orderForm.shipping === 'express' ? 8.99 : 3.99)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '16px', justifyContent: 'flex-end', backgroundColor: 'var(--bg-body)' }}>
                    <button 
                      type="button" 
                      onClick={() => setShowOrderModal(false)}
                      className="btn" 
                      style={{ border: '1px solid var(--border-color)', padding: '10px 20px', borderRadius: '12px', fontWeight: 700 }}
                    >
                      Cancel
                    </button>
                    <motion.button 
                      type="submit" 
                      disabled={!orderForm.address.trim()}
                      whileHover={orderForm.address.trim() ? { scale: 1.04, translateY: -1, boxShadow: '0 10px 20px -6px rgba(139,92,246,0.5)' } : {}}
                      whileTap={orderForm.address.trim() ? { scale: 0.96 } : {}}
                      style={{
                        padding: '12px 28px', borderRadius: '14px', border: 'none', fontWeight: 800, cursor: !orderForm.address.trim() ? 'not-allowed' : 'pointer',
                        background: 'linear-gradient(135deg, var(--primary) 0%, #8B5CF6 100%)',
                        color: 'white', opacity: !orderForm.address.trim() ? 0.55 : 1,
                        display: 'flex', alignItems: 'center', gap: '8px',
                        boxShadow: '0 6px 16px -4px rgba(139,92,246,0.3)'
                      }}
                    >
                      <Check size={16} /> Confirm Order
                    </motion.button>
                  </div>
                </form>
              )}

              {orderStep === 'processing' && (
                <div style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', textAlign: 'center' }}>
                  <div style={{ 
                    width: '64px', height: '64px', borderRadius: '50%', border: '4px solid var(--primary-light)',
                    borderTopColor: 'var(--primary)', animation: 'spin 1s linear infinite'
                  }}></div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Fulfillment System Link</h4>
                    <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', height: '24px' }}>
                      {orderMsg}
                    </p>
                  </div>
                  <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
                    <motion.div 
                      initial={{ left: '-100%' }}
                      animate={{ left: '100%' }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                      style={{ position: 'absolute', top: 0, bottom: 0, width: '50%', backgroundColor: 'var(--primary)', borderRadius: '2px' }}
                    />
                  </div>
                  <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Do not close this connection window.</small>
                </div>
              )}

              {orderStep === 'success' && (
                <div style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  {/* Success checkmark */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    style={{
                      width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'rgba(40, 167, 69, 0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', marginBottom: '24px'
                    }}
                  >
                    <Check size={36} strokeWidth={3} />
                  </motion.div>

                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-main)' }}>ID Order Confirmed!</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Your printing request has been successfully queued and registry blocks synced.
                  </p>

                  {/* Summary Slip */}
                  <div style={{ width: '100%', margin: '24px 0', padding: '20px', borderRadius: '20px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
                      <strong style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{orderRef}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Recipient Name:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{selectedStudent.name}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Selected Finish:</span>
                      <strong style={{ textTransform: 'capitalize' }}>{orderForm.finish}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Fulfillment Method:</span>
                      <strong>{orderForm.shipping === 'express' ? 'Express Dispatch' : 'Standard Delivery'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Shipping to:</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)', maxWidth: '200px', textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{orderForm.address}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                    <motion.button 
                      onClick={handleDownloadInvoice}
                      type="button"
                      whileHover={{ scale: 1.02, translateY: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn" 
                      style={{ 
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        border: '1px solid var(--border-color)', fontWeight: 700, borderRadius: '14px'
                      }}
                    >
                      <FileText size={18} /> Download Order Invoice
                    </motion.button>
                    <motion.button 
                      onClick={() => setShowOrderModal(false)}
                      type="button"
                      whileHover={{ scale: 1.03, translateY: -2, boxShadow: '0 12px 24px -6px rgba(139,92,246,0.45)' }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        padding: '14px 28px', borderRadius: '14px', border: 'none', fontWeight: 800,
                        background: 'linear-gradient(135deg, var(--primary) 0%, #8B5CF6 100%)',
                        color: 'white', cursor: 'pointer',
                        boxShadow: '0 6px 16px -4px rgba(139,92,246,0.35)'
                      }}
                    >
                      <CreditCard size={16} /> Return to ID Generator
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IDCards;
