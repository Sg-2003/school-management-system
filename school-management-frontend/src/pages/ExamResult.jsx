import React, { useState, useEffect } from 'react';
import { 
  Trophy, Search, Filter, Download, Plus, Layout, 
  ChevronRight, Star, TrendingUp, Award, CheckCircle2,
  MoreVertical, FileText, GraduationCap, AlertCircle, X, Mail, Printer, FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';

import indianMan1 from '../assets/indian_man_portrait_1.png';
import indianMan2 from '../assets/indian_man_portrait_2.png';
import indianWoman1 from '../assets/indian_woman_portrait_1.png';
import indianWoman2 from '../assets/indian_woman_portrait_2.png';

const devonAvatar = indianMan2;
const janeAvatar = indianWoman1;

const defaultResults = {
  '10A': [
    { id: 'STU-001', name: 'Aanya Sharma', rank: '1st', gpa: '3.95', percentage: '94.2%', status: 'Passed', color: '#10B981', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Aanya%20Sharma', subjects: { Math: 96, Physics: 92, Chem: 94, Bio: 98, Eng: 95, Hist: 90 } },
    { id: 'STU-002', name: 'Neha Sharma', rank: '2nd', gpa: '3.88', percentage: '91.5%', status: 'Passed', color: '#10B981', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Neha%20Sharma', subjects: { Math: 91, Physics: 88, Chem: 92, Bio: 94, Eng: 93, Hist: 90 } },
    { id: 'STU-2026-0492', name: 'Aman Verma', rank: '3rd', gpa: '3.85', percentage: '91.0%', status: 'Passed', color: '#10B981', avatar: devonAvatar, subjects: { Math: 98, Physics: 92, Chem: 95, Bio: 89, Eng: 88, Hist: 82 } },
    { id: 'STU-003', name: 'Abhishek Singh', rank: '4th', gpa: '3.82', percentage: '89.8%', status: 'Passed', color: '#10B981', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Abhishek%20Singh', subjects: { Math: 88, Physics: 85, Chem: 89, Bio: 92, Eng: 91, Hist: 84 } },
    { id: 'STU-004', name: 'Priya Patel', rank: '5th', gpa: '3.45', percentage: '78.5%', status: 'Passed', color: '#F59E0B', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Priya%20Patel', subjects: { Math: 76, Physics: 75, Chem: 80, Bio: 82, Eng: 84, Hist: 74 } },
    { id: 'STU-005', name: 'Amit Sharma', rank: '6th', gpa: '2.80', percentage: '65.2%', status: 'Passed', color: '#F59E0B', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Amit%20Sharma', subjects: { Math: 60, Physics: 64, Chem: 62, Bio: 70, Eng: 68, Hist: 67 } }
  ],
  '10B': [
    { id: 'STU-006', name: 'Isha Sen', rank: '1st', gpa: '3.91', percentage: '93.1%', status: 'Passed', color: '#10B981', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Isha%20Sen', subjects: { Math: 94, Physics: 90, Chem: 91, Bio: 95, Eng: 96, Hist: 92 } },
    { id: 'STU-007', name: 'Rohan Das', rank: '2nd', gpa: '3.80', percentage: '90.4%', status: 'Passed', color: '#10B981', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Rohan%20Das', subjects: { Math: 89, Physics: 92, Chem: 88, Bio: 91, Eng: 90, Hist: 92 } },
    { id: 'STU-008', name: 'Kavita Krishnan', rank: '3rd', gpa: '3.75', percentage: '87.9%', status: 'Passed', color: '#10B981', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Kavita%20Krishnan', subjects: { Math: 86, Physics: 84, Chem: 89, Bio: 90, Eng: 92, Hist: 86 } },
    { id: 'STU-009', name: 'Karan Mehta', rank: '4th', gpa: '3.20', percentage: '72.3%', status: 'Passed', color: '#F59E0B', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Karan%20Mehta', subjects: { Math: 70, Physics: 72, Chem: 68, Bio: 75, Eng: 78, Hist: 71 } },
    { id: 'STU-010', name: 'Sameer Khan', rank: '5th', gpa: '2.10', percentage: '58.4%', status: 'Failed', color: '#EF4444', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sameer%20Khan', subjects: { Math: 52, Physics: 55, Chem: 50, Bio: 60, Eng: 65, Hist: 68 } }
  ],
  '11A': [
    { id: 'STU-011', name: 'Aditi Nair', rank: '1st', gpa: '3.98', percentage: '95.5%', status: 'Passed', color: '#10B981', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Aditi%20Nair', subjects: { Math: 98, Physics: 96, Chem: 97, Bio: 99, Eng: 98, Hist: 95 } },
    { id: 'STU-012', name: 'Rahul Kapoor', rank: '2nd', gpa: '3.85', percentage: '92.1%', status: 'Passed', color: '#10B981', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Rahul%20Kapoor', subjects: { Math: 92, Physics: 91, Chem: 90, Bio: 94, Eng: 93, Hist: 93 } },
    { id: 'STU-013', name: 'Riya Banerjee', rank: '3rd', gpa: '3.78', percentage: '88.4%', status: 'Passed', color: '#10B981', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Riya%20Banerjee', subjects: { Math: 87, Physics: 85, Chem: 89, Bio: 91, Eng: 92, Hist: 86 } },
    { id: 'STU-014', name: 'Arjun Reddy', rank: '4th', gpa: '3.55', percentage: '84.2%', status: 'Passed', color: '#10B981', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Arjun%20Reddy', subjects: { Math: 82, Physics: 84, Chem: 81, Bio: 86, Eng: 87, Hist: 85 } }
  ],
  '8B': [
    { id: 'STU-2026-0814', name: 'Divya Joshi', rank: '1st', gpa: '3.92', percentage: '93.5%', status: 'Passed', color: '#10B981', avatar: janeAvatar, subjects: { Math: 94, Physics: 92, Chem: 90, Bio: 96, Eng: 95, Hist: 94 } },
    { id: 'STU-021', name: 'Kabir Nair', rank: '2nd', gpa: '3.70', percentage: '88.2%', status: 'Passed', color: '#10B981', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Kabir%20Nair', subjects: { Math: 88, Physics: 85, Chem: 89, Bio: 90, Eng: 87, Hist: 90 } },
    { id: 'STU-022', name: 'Ananya Rao', rank: '3rd', gpa: '3.50', percentage: '81.4%', status: 'Passed', color: '#10B981', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Ananya%20Rao', subjects: { Math: 80, Physics: 78, Chem: 85, Bio: 84, Eng: 82, Hist: 79 } },
    { id: 'STU-023', name: 'Vihaan Joshi', rank: '4th', gpa: '2.95', percentage: '68.7%', status: 'Passed', color: '#F59E0B', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Vihaan%20Joshi', subjects: { Math: 65, Physics: 68, Chem: 70, Bio: 72, Eng: 66, Hist: 71 } }
  ]
};

const defaultPerformance = {
  '10A': [
    { month: 'Math', score: 85 },
    { month: 'Physics', score: 78 },
    { month: 'Chem', score: 82 },
    { month: 'Bio', score: 90 },
    { month: 'Eng', score: 88 },
    { month: 'Hist', score: 75 }
  ],
  '10B': [
    { month: 'Math', score: 82 },
    { month: 'Physics', score: 84 },
    { month: 'Chem', score: 80 },
    { month: 'Bio', score: 85 },
    { month: 'Eng', score: 89 },
    { month: 'Hist', score: 81 }
  ],
  '11A': [
    { month: 'Math', score: 91 },
    { month: 'Physics', score: 88 },
    { month: 'Chem', score: 90 },
    { month: 'Bio', score: 92 },
    { month: 'Eng', score: 93 },
    { month: 'Hist', score: 86 }
  ],
  '8B': [
    { month: 'Math', score: 84 },
    { month: 'Physics', score: 79 },
    { month: 'Chem', score: 81 },
    { month: 'Bio', score: 88 },
    { month: 'Eng', score: 90 },
    { month: 'Hist', score: 83 }
  ]
};

const ExamResult = () => {
  // 1. Dropdown & Search States
  const [selectedClass, setSelectedClass] = useState('10A');
  const [searchQuery, setSearchQuery] = useState('');

  // 2. Interactive Overlay States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAnalyticsDrawer, setShowAnalyticsDrawer] = useState(false);
  const [selectedStudentReport, setSelectedStudentReport] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // 3. Class Results State - Detailed rankings with core subject marks, backed by localStorage
  const [resultsByClass, setResultsByClass] = useState(() => {
    const saved = localStorage.getItem('exam_results_by_class');
    return saved ? JSON.parse(saved) : defaultResults;
  });

  // 4. Subject-wise class average scores, backed by localStorage
  const [performanceDataByClass, setPerformanceDataByClass] = useState(() => {
    const saved = localStorage.getItem('exam_perf_data_by_class');
    return saved ? JSON.parse(saved) : defaultPerformance;
  });

  useEffect(() => {
    localStorage.setItem('exam_results_by_class', JSON.stringify(resultsByClass));
  }, [resultsByClass]);

  useEffect(() => {
    localStorage.setItem('exam_perf_data_by_class', JSON.stringify(performanceDataByClass));
  }, [performanceDataByClass]);

  // 5. Upload Results Form State
  const [uploadForm, setUploadForm] = useState({
    id: '',
    name: '',
    class: '10A',
    percentage: '',
    gpa: '',
    math: '',
    physics: '',
    chem: '',
    bio: '',
    eng: '',
    hist: ''
  });

  // Unique Classes list derived dynamically
  const classesList = Object.keys(resultsByClass).sort();

  // Glassmorphic Toast Notification Trigger helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Recalculates statistics overview dynamically based on the active results list
  const getStats = () => {
    const roster = resultsByClass[selectedClass] || [];
    const total = roster.length;
    if (total === 0) return { passed: '0%', distinctions: 0, needImprovement: 0 };

    const passedCount = roster.filter(r => r.status === 'Passed').length;
    const passedPct = Math.round((passedCount / total) * 100) + '%';
    const distinctions = roster.filter(r => parseFloat(r.percentage) >= 85).length;
    const needImprovement = roster.filter(r => parseFloat(r.percentage) < 65 || r.status === 'Failed').length;

    return {
      passed: passedPct,
      distinctions,
      needImprovement
    };
  };

  const activeStats = getStats();

  // Determine Class Topper dynamically
  const getTopper = () => {
    const roster = resultsByClass[selectedClass] || [];
    if (roster.length === 0) return { name: 'N/A', percentage: '0%' };
    const sorted = [...roster].sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
    return sorted[0];
  };

  const activeTopper = getTopper();

  // Real-time student Search Query filtering
  const filteredResults = (resultsByClass[selectedClass] || []).filter(item => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query);
  });

  // High-fidelity Academic Report Transcript printer
  const handlePrintSingle = (student) => {
    if (!student) return;

    const root = window.getComputedStyle(document.documentElement);
    const primary = root.getPropertyValue('--primary').trim() || '#4F46E5';
    const textMuted = root.getPropertyValue('--text-muted').trim() || '#64748B';

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      triggerToast("Popup blocker prevented opening the print view!");
      return;
    }

    let subjectRowsHtml = '';
    if (student.subjects) {
      Object.entries(student.subjects).forEach(([subj, marks]) => {
        let tag = 'Pass';
        let letter = 'D';
        let gpa = '2.00';
        let color = '#6366F1';
        
        if (marks >= 95) { tag = 'Distinction'; letter = 'A+'; gpa = '4.00'; color = '#10B981'; }
        else if (marks >= 90) { tag = 'Distinction'; letter = 'A'; gpa = '3.90'; color = '#10B981'; }
        else if (marks >= 85) { tag = 'Merit'; letter = 'B+'; gpa = '3.70'; color = '#4F46E5'; }
        else if (marks >= 80) { tag = 'Merit'; letter = 'B'; gpa = '3.50'; color = '#4F46E5'; }
        else if (marks >= 70) { tag = 'Credit'; letter = 'C'; gpa = '3.00'; color = '#F59E0B'; }
        else if (marks < 60) { tag = 'Fail'; letter = 'F'; gpa = '0.00'; color = '#EF4444'; }

        const classAvgObj = (performanceDataByClass[selectedClass] || []).find(
           p => p.month.toLowerCase() === subj.toLowerCase()
        );
        const classAvg = classAvgObj ? classAvgObj.score : 80;
        const deviation = marks - classAvg;
        const devText = deviation >= 0 ? `+${deviation}%` : `-${Math.abs(deviation)}%`;
        const devColor = deviation >= 0 ? '#10B981' : '#EF4444';

        subjectRowsHtml += `
          <tr>
            <td style="font-weight: 800; padding: 14px 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${subj}</td>
            <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; color: #334155; text-align: center;">${marks} / 100</td>
            <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; text-align: center;">
              <span style="font-weight: 900; background: ${color}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem;">${letter}</span>
            </td>
            <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; color: #334155; text-align: center; font-weight: 700;">${gpa}</td>
            <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; color: #334155; text-align: center;">${classAvg}%</td>
            <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; color: ${devColor}; text-align: center; font-weight: 700;">${devText}</td>
            <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; text-align: right;">
              <span style="font-weight: 800; font-size: 0.7rem; color: ${color}; background: ${color}15; padding: 4px 8px; border-radius: 6px; text-transform: uppercase;">${tag}</span>
            </td>
          </tr>
        `;
      });
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Academic Report Card - ${student.name}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@600;700;800;900&display=swap" rel="stylesheet">
          <style>
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Inter', sans-serif;
              color: #1e293b;
              background: #f8fafc;
              padding: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .report-card-container {
              width: 100%;
              max-width: 800px;
              background: #ffffff;
              border-radius: 24px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
              border: 1px solid #e2e8f0;
              padding: 48px;
              position: relative;
              overflow: hidden;
            }
            .top-bar {
              position: absolute;
              top: 0; left: 0; right: 0;
              height: 6px;
              background: linear-gradient(90deg, ${primary}, #8b5cf6, #10b981);
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #f1f5f9;
              padding-bottom: 24px;
              margin-bottom: 28px;
            }
            .school-logo-area {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .school-logo {
              width: 44px;
              height: 44px;
              border-radius: 12px;
              background: linear-gradient(135deg, ${primary} 0%, #8b5cf6 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-family: 'Outfit', sans-serif;
              font-weight: 900;
              font-size: 1.5rem;
            }
            .school-name {
              font-family: 'Outfit', sans-serif;
              font-size: 1.6rem;
              font-weight: 900;
              color: #0f172a;
              line-height: 1.1;
            }
            .school-sub {
              font-size: 0.75rem;
              color: ${textMuted};
              font-weight: 700;
              letter-spacing: 1.5px;
              text-transform: uppercase;
              margin-top: 4px;
            }
            .badge-title {
              background: rgba(79, 70, 229, 0.08);
              color: ${primary};
              padding: 8px 16px;
              border-radius: 12px;
              font-size: 0.75rem;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: 1px;
              border: 1px solid rgba(79, 70, 229, 0.15);
            }
            .profile-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
              margin-bottom: 28px;
              background: #f8fafc;
              padding: 20px 24px;
              border-radius: 18px;
              border: 1px solid #f1f5f9;
            }
            .profile-item {
              display: flex;
              flex-direction: column;
              gap: 4px;
            }
            .profile-label {
              font-size: 0.7rem;
              font-weight: 800;
              color: ${textMuted};
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .profile-value {
              font-size: 0.95rem;
              font-weight: 800;
              color: #0f172a;
            }
            .summary-stats {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 16px;
              margin-bottom: 32px;
            }
            .stat-card {
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              padding: 16px;
              text-align: center;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01);
            }
            .stat-card.highlight {
              background: rgba(79, 70, 229, 0.03);
              border-color: rgba(79, 70, 229, 0.12);
            }
            .stat-label {
              font-size: 0.75rem;
              font-weight: 800;
              color: ${textMuted};
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .stat-val {
              font-size: 1.5rem;
              font-weight: 900;
              color: #0f172a;
              margin-top: 6px;
            }
            .stat-val.success { color: #10B981; }
            .stat-val.primary { color: ${primary}; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 32px;
            }
            th {
              background: #f8fafc;
              color: #475569;
              font-size: 0.7rem;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              padding: 14px 16px;
              border-bottom: 2px solid #e2e8f0;
            }
            th:first-child { text-align: left; }
            th:last-child { text-align: right; }
            .remarks-box {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 18px;
              padding: 20px 24px;
              margin-bottom: 40px;
            }
            .remarks-title {
              font-size: 0.75rem;
              font-weight: 800;
              color: #475569;
              text-transform: uppercase;
              margin-bottom: 8px;
              letter-spacing: 0.5px;
            }
            .remarks-text {
              font-size: 0.85rem;
              line-height: 1.55;
              color: #334155;
              font-weight: 500;
            }
            .signature-row {
              display: flex;
              justify-content: space-between;
              margin-top: 48px;
              padding: 0 16px;
            }
            .sig-line {
              width: 220px;
              border-top: 1.5px solid #cbd5e1;
              text-align: center;
              padding-top: 10px;
              font-size: 0.75rem;
              font-weight: 800;
              color: ${textMuted};
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            @media print {
              body {
                background: #ffffff;
                padding: 0;
                margin: 0;
                display: block;
                min-height: auto;
              }
              .report-card-container {
                border: none;
                box-shadow: none;
                padding: 20px;
                max-width: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div class="report-card-container">
            <div class="top-bar"></div>
            <div class="header">
              <div class="school-logo-area">
                <div class="school-logo">⚡</div>
                <div>
                  <div class="school-name">EDUPRO ACADEMY</div>
                  <div class="school-sub">Excellence in Education</div>
                </div>
              </div>
              <div class="badge-title">Official Transcript</div>
            </div>

            <div class="profile-grid">
              <div class="profile-item">
                <span class="profile-label">Student Name</span>
                <span class="profile-value">\${student.name}</span>
              </div>
              <div class="profile-item">
                <span class="profile-label">Student ID</span>
                <span class="profile-value">\${student.id}</span>
              </div>
              <div class="profile-item" style="margin-top: 12px;">
                <span class="profile-label">Class / Section</span>
                <span class="profile-value">Class \${selectedClass}</span>
              </div>
              <div class="profile-item" style="margin-top: 12px;">
                <span class="profile-label">Academic Term</span>
                <span class="profile-value">Final Semester 2026</span>
              </div>
            </div>

            <div class="summary-stats">
              <div class="stat-card">
                <div class="stat-label">Class Rank</div>
                <div class="stat-val primary">\${student.rank}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Cumulative Score</div>
                <div class="stat-val success">\${student.percentage}</div>
              </div>
              <div class="stat-card highlight">
                <div class="stat-label">GPA Points</div>
                <div class="stat-val">\${student.gpa} / 4.00</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="text-align: left;">Subject</th>
                  <th style="text-align: center;">Marks</th>
                  <th style="text-align: center;">Grade</th>
                  <th style="text-align: center;">GPA</th>
                  <th style="text-align: center;">Class Avg</th>
                  <th style="text-align: center;">Deviation</th>
                  <th style="text-align: right;">Status</th>
                </tr>
              </thead>
              <tbody>
                \${subjectRowsHtml}
              </tbody>
            </table>

            <div class="remarks-box">
              <div class="remarks-title">Counsellor Remarks</div>
              <div class="remarks-text">
                \${getReportRemarks(student.gpa)}
              </div>
            </div>

            <div class="signature-row">
              <div class="sig-line">Class Teacher</div>
              <div class="sig-line">Principal & Dean</div>
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

  // Generate All Reports - CSV Spreadsheet Summary Downloader
  const handleGenerateAllReports = () => {
    const roster = resultsByClass[selectedClass] || [];
    if (roster.length === 0) {
      triggerToast("No report metrics found to generate.");
      return;
    }

    const csvHeaders = "Rank,Student ID,Student Name,GPA,Percentage Score,Status,Math,Physics,Chem,Bio,Eng,Hist\n";
    const csvRows = roster.map(r => 
      `"${r.rank}","${r.id}","${r.name}","${r.gpa}","${r.percentage}","${r.status}",${r.subjects?.Math || 0},${r.subjects?.Physics || 0},${r.subjects?.Chem || 0},${r.subjects?.Bio || 0},${r.subjects?.Eng || 0},${r.subjects?.Hist || 0}`
    ).join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + csvHeaders + csvRows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `academic_report_class_${selectedClass}_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast(`Compiled and downloaded reports for Class ${selectedClass}!`);
  };

  // Upload Result Submission Handler
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadForm.id || !uploadForm.name || !uploadForm.percentage || !uploadForm.gpa) {
      triggerToast("Please enter ID, Name, Percentage, and GPA.");
      return;
    }

    const pctVal = parseFloat(uploadForm.percentage);
    const status = pctVal >= 60 ? 'Passed' : 'Failed';
    const statusColor = status === 'Passed' ? '#10B981' : '#EF4444';

    const newStudent = {
      id: uploadForm.id.toUpperCase(),
      name: uploadForm.name,
      rank: 'Pending',
      gpa: parseFloat(uploadForm.gpa).toFixed(2),
      percentage: pctVal + '%',
      status,
      color: statusColor,
      avatar: `https://images.unsplash.com/photo-${pctVal >= 80 ? '1539571696357-5a69c17a67c6' : '1500648767791-00dcc994a43e'}?w=100&h=100&fit=crop`,
      subjects: {
        Math: parseInt(uploadForm.math) || 0,
        Physics: parseInt(uploadForm.physics) || 0,
        Chem: parseInt(uploadForm.chem) || 0,
        Bio: parseInt(uploadForm.bio) || 0,
        Eng: parseInt(uploadForm.eng) || 0,
        Hist: parseInt(uploadForm.hist) || 0
      }
    };

    const targetClass = uploadForm.class;

    // 1. Insert and sort/re-rank in roster state
    setResultsByClass(prev => {
      const currentList = prev[targetClass] || [];
      const updatedList = [...currentList, newStudent];
      
      // Sort in-place by percentage descending
      const sorted = [...updatedList].sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
      const ranked = sorted.map((r, idx) => {
        let suffix = 'th';
        const rVal = idx + 1;
        if (rVal === 1) suffix = '1st';
        else if (rVal === 2) suffix = '2nd';
        else if (rVal === 3) suffix = '3rd';
        return { ...r, rank: `${rVal}${suffix}` };
      });

      return { ...prev, [targetClass]: ranked };
    });

    // 2. Recalculate subject averages for performance chart state
    setPerformanceDataByClass(prev => {
      const rosterList = [...(resultsByClass[targetClass] || []), newStudent];
      const subjects = ['Math', 'Physics', 'Chem', 'Bio', 'Eng', 'Hist'];
      
      const newAverages = subjects.map(sub => {
        const key = sub === 'Chem' ? 'Chem' : sub === 'Bio' ? 'Bio' : sub === 'Eng' ? 'Eng' : sub === 'Hist' ? 'Hist' : sub;
        const totalMarks = rosterList.reduce((sum, r) => sum + (r.subjects?.[key] || 0), 0);
        return { month: sub, score: Math.round(totalMarks / rosterList.length) };
      });

      return { ...prev, [targetClass]: newAverages };
    });

    setShowUploadModal(false);
    triggerToast(`Uploaded and ranked results for ${uploadForm.name}!`);

    // Reset Form Form State
    setUploadForm({
      id: '',
      name: '',
      class: selectedClass,
      percentage: '',
      gpa: '',
      math: '',
      physics: '',
      chem: '',
      bio: '',
      eng: '',
      hist: ''
    });
  };

  // Grade Distribution metrics for view analytics Horizontal Chart
  const getGradeDistribution = () => {
    const roster = resultsByClass[selectedClass] || [];
    let ap = 0, a = 0, b = 0, c = 0, f = 0;
    roster.forEach(r => {
      const pct = parseFloat(r.percentage);
      if (pct >= 90) ap++;
      else if (pct >= 80) a++;
      else if (pct >= 70) b++;
      else if (pct >= 60) c++;
      else f++;
    });
    return [
      { grade: 'A+ (>=90%)', count: ap, color: '#10B981' },
      { grade: 'A (80-89%)', count: a, color: 'var(--primary)' },
      { grade: 'B (70-79%)', count: b, color: '#F59E0B' },
      { grade: 'C (60-69%)', count: c, color: '#6366F1' },
      { grade: 'F (<60%)', count: f, color: '#EF4444' }
    ];
  };

  const gradeDistribution = getGradeDistribution();

  // Helper: dynamic report card remarks based on GPA
  const getReportRemarks = (gpa) => {
    const val = parseFloat(gpa);
    if (val >= 3.8) return "Outstanding academic performance! Demonstrates exceptional critical thinking, subject matter expertise, and diligence across all coursework.";
    if (val >= 3.0) return "Very good progress this semester. Shows consistent academic dedication and strong analytical capability. Focus on minor subject weaknesses for higher distinction.";
    return "Satisfactory performance. Shows growth, but requires additional hours of self-study and targeted study sessions to build firm foundations in key areas.";
  };

  const handlePrintCard = (student) => {
    if (!student) return;
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      triggerToast("Failed to open print window. Please allow popups.");
      return;
    }

    const subjectsHtml = student.subjects ? Object.entries(student.subjects).map(([subj, marks]) => {
      let tag = 'Pass';
      let letter = 'D';
      let gpaVal = '2.00';
      let color = '#6366F1';
      
      if (marks >= 95) { tag = 'Distinction'; letter = 'A+'; gpaVal = '4.00'; color = '#10B981'; }
      else if (marks >= 90) { tag = 'Distinction'; letter = 'A'; gpaVal = '3.90'; color = '#10B981'; }
      else if (marks >= 85) { tag = 'Merit'; letter = 'B+'; gpaVal = '3.70'; color = '#4880FF'; }
      else if (marks >= 80) { tag = 'Merit'; letter = 'B'; gpaVal = '3.50'; color = '#4880FF'; }
      else if (marks >= 70) { tag = 'Credit'; letter = 'C'; gpaVal = '3.00'; color = '#F59E0B'; }
      else if (marks < 60) { tag = 'Fail'; letter = 'F'; gpaVal = '0.00'; color = '#EF4444'; }

      return `
        <tr>
          <td style="padding: 12px 15px; border-bottom: 1px solid #E2E8F0; font-weight: 700; color: #1E293B;">${subj}</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #E2E8F0; font-weight: 600; color: #475569; text-align: center;">${marks} / 100</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #E2E8F0; text-align: center;">
            <span style="font-weight: 800; color: white; background-color: ${color}; padding: 3px 8px; border-radius: 4px; display: inline-block; min-width: 24px;">${letter}</span>
          </td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #E2E8F0; font-weight: 600; color: #475569; text-align: center;">${gpaVal}</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #E2E8F0; text-align: right;">
            <span style="font-weight: 700; color: ${color}; font-size: 11px; text-transform: uppercase;">${tag}</span>
          </td>
        </tr>
      `;
    }).join('') : `<tr><td colspan="5" style="text-align: center; padding: 20px; color: #64748B;">No subjects recorded</td></tr>`;

    const remarks = getReportRemarks(student.gpa);

    printWindow.document.write(`
      <html>
        <head>
          <title>Report Card - ${student.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
            body {
              font-family: 'Outfit', sans-serif;
              color: #1E293B;
              margin: 0;
              padding: 40px;
              background-color: #ffffff;
            }
            .report-card {
              max-width: 700px;
              margin: 0 auto;
              border: 2px solid #E2E8F0;
              border-radius: 20px;
              padding: 30px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #E2E8F0;
              padding-bottom: 20px;
              margin-bottom: 25px;
            }
            .school-name {
              font-size: 24px;
              font-weight: 900;
              letter-spacing: -0.5px;
              color: #4880FF;
              margin: 0;
            }
            .doc-title {
              font-size: 14px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              color: #64748B;
              margin: 5px 0 0 0;
            }
            .student-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 25px;
              background-color: #F8FAFC;
              padding: 18px;
              border-radius: 12px;
              border: 1px solid #E2E8F0;
            }
            .info-item {
              font-size: 14px;
              font-weight: 600;
              color: #475569;
            }
            .info-item span {
              font-weight: 800;
              color: #0F172A;
            }
            .grade-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 25px;
            }
            .grade-table th {
              background-color: #F1F5F9;
              color: #475569;
              font-weight: 800;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              padding: 12px 15px;
              text-align: left;
              border-bottom: 2px solid #E2E8F0;
            }
            .remarks-section {
              background-color: #F8FAFC;
              border-left: 4px solid #4880FF;
              padding: 15px;
              border-radius: 0 12px 12px 0;
              margin-bottom: 35px;
              font-size: 14px;
              line-height: 1.5;
            }
            .remarks-title {
              font-weight: 800;
              color: #0F172A;
              margin-bottom: 5px;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .signatures {
              display: flex;
              justify-content: space-between;
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px dashed #E2E8F0;
            }
            .sig-block {
              text-align: center;
              width: 200px;
            }
            .sig-line {
              border-bottom: 1px solid #94A3B8;
              height: 40px;
              margin-bottom: 8px;
            }
            .sig-title {
              font-size: 12px;
              font-weight: 800;
              color: #64748B;
              text-transform: uppercase;
            }
            @media print {
              body {
                padding: 0;
              }
              .report-card {
                border: none;
                box-shadow: none;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="report-card">
            <div class="header">
              <h1 class="school-name">EDUPRO ACADEMY</h1>
              <p class="doc-title">Official Student Report Card</p>
            </div>
            
            <div class="student-info">
              <div class="info-item">Student Name: <span>${student.name}</span></div>
              <div class="info-item">Student ID: <span>${student.id}</span></div>
              <div class="info-item">Academic Class: <span>Class ${selectedClass}</span></div>
              <div class="info-item">Class Rank: <span>${student.rank}</span></div>
              <div class="info-item">Cumulative GPA: <span>${student.gpa} / 4.00</span></div>
              <div class="info-item">Aggregate Percentage: <span>${student.percentage}</span></div>
            </div>

            <table class="grade-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th style="text-align: center;">Acquired Marks</th>
                  <th style="text-align: center;">Grade</th>
                  <th style="text-align: center;">GPA Points</th>
                  <th style="text-align: right;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${subjectsHtml}
              </tbody>
            </table>

            <div class="remarks-section">
              <div class="remarks-title">Counsellor Remarks</div>
              <div style="color: #475569; font-weight: 500;">${remarks}</div>
            </div>

            <div class="signatures">
              <div class="sig-block">
                <div class="sig-line"></div>
                <div class="sig-title">Class Counsellor</div>
              </div>
              <div class="sig-block">
                <div class="sig-line"></div>
                <div class="sig-title">School Principal</div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.focus();
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    triggerToast(`Generated printable report card for ${student.name}!`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px' }}
    >
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            style={{
              position: 'fixed',
              top: '24px',
              right: '24px',
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '16px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontWeight: 700,
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#F59E0B', marginBottom: '8px' }}>
            <div style={{ padding: '8px', backgroundColor: '#F59E0B15', borderRadius: '10px' }}>
               <Trophy size={20} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Academic Performance Portal</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 950, margin: 0, letterSpacing: '-1px' }}>Examination Results</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px', fontWeight: 600 }}>Analyze institutional academic performance and publish student report cards.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
           <button 
              className="btn" 
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontWeight: 800, gap: '8px' }}
              onClick={handleGenerateAllReports}
           >
              <Download size={18} /> GENERATE ALL REPORTS
           </button>
           <button 
              className="btn btn-primary" 
              style={{ padding: '12px 28px', fontWeight: 900, boxShadow: '0 4px 12px rgba(72, 128, 255, 0.2)', gap: '8px' }}
              onClick={() => {
                setUploadForm(prev => ({ ...prev, class: selectedClass }));
                setShowUploadModal(true);
              }}
           >
              <Plus size={18} /> UPLOAD RESULTS
           </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
         {/* Average Performance Chart */}
         <div className="card" style={{ padding: '24px', borderRadius: '32px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 950, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
               <TrendingUp size={18} color="var(--primary)" /> Average Performance ({selectedClass})
            </h3>
            <div style={{ height: '180px', width: '100%' }}>
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceDataByClass[selectedClass] || performanceDataByClass['10A']}>
                     <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--text-muted)' }} />
                     <YAxis hide domain={[0, 100]} />
                     <Tooltip contentStyle={{ borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontWeight: 600 }} />
                     <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Class Topper Card */}
         <div className="card" style={{ padding: '28px', borderRadius: '32px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Background decoration */}
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', fontSize: '10rem', fontWeight: 900, color: 'rgba(255,255,255,0.04)', selectStyle: 'none', pointerEvents: 'none' }}>#1</div>
            <Award size={48} style={{ marginBottom: '16px' }} />
            <div style={{ fontSize: '0.85rem', fontWeight: 800, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Class Topper ({selectedClass})</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 950, margin: '4px 0', letterSpacing: '-0.5px' }}>{activeTopper.name}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, opacity: 0.9 }}>{activeTopper.percentage} Aggregate ({activeTopper.gpa} GPA)</div>
         </div>

         {/* Statistical Overview Checklist */}
         <div className="card" style={{ padding: '24px', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ fontSize: '0.95rem', fontWeight: 950 }}>Class Stats Checklist</div>
               <AlertCircle size={18} color="var(--text-muted)" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '6px 0' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Passed Students Rate</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#10B981' }}>{activeStats.passed}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Distinctions (Score &gt;= 85%)</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#F59E0B' }}>{activeStats.distinctions}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Needs Review (&lt; 65%)</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#EF4444' }}>{activeStats.needImprovement}</span>
               </div>
            </div>
            <button 
               className="btn" 
               style={{ marginTop: 'auto', backgroundColor: 'var(--bg-body)', fontSize: '0.8rem', fontWeight: 800 }}
               onClick={() => setShowAnalyticsDrawer(true)}
            >
               VIEW ANALYTICS
            </button>
         </div>
      </div>

      {/* Roster & Search Table */}
      <div className="card" style={{ padding: '0', borderRadius: '32px', overflow: 'hidden' }}>
         <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', backgroundColor: 'var(--bg-body)' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between' }}>
               <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
                  <Search size={18} style={{ position: 'absolute', left: '16px', top: '13px', color: 'var(--text-muted)' }} />
                  <input 
                     type="text" 
                     placeholder="Search student by name or ID..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', outline: 'none', fontWeight: 600 }}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: '16px', top: '12px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      <X size={16} />
                    </button>
                  )}
               </div>

               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ fontWeight: 850, fontSize: '0.85rem', color: 'var(--text-muted)' }}>CLASS ROSTER:</div>
                  <select 
                     className="form-input" 
                     style={{ width: '150px', borderRadius: '14px', padding: '8px 12px' }}
                     value={selectedClass}
                     onChange={(e) => {
                       setSelectedClass(e.target.value);
                       setSearchQuery(''); // clear search
                     }}
                  >
                     {classesList.map(cls => (
                        <option key={cls} value={cls}>Class {cls}</option>
                     ))}
                  </select>
               </div>
            </div>
         </div>

         {/* Roster Listing */}
         <div style={{ overflowX: 'auto' }}>
            {filteredResults.length > 0 ? (
               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                     <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-card)' }}>
                        <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rank</th>
                        <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Student</th>
                        <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>GPA</th>
                        <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Percentage</th>
                        <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                        <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {filteredResults.map((res, i) => (
                        <tr key={res.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                           <td style={{ padding: '20px 24px' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: i < 3 ? '#F59E0B15' : 'var(--bg-body)', color: i < 3 ? '#F59E0B' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, fontSize: '0.85rem' }}>
                                 {res.rank}
                              </div>
                           </td>
                           <td style={{ padding: '20px 24px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                 <div style={{ width: '38px', height: '38px', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                                    {res.avatar ? (
                                       <img src={res.avatar} alt={res.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                       res.name.charAt(0)
                                    )}
                                 </div>
                                 <div>
                                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{res.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{res.id}</div>
                                 </div>
                              </div>
                           </td>
                           <td style={{ padding: '20px 24px', fontWeight: 800 }}>{res.gpa}</td>
                           <td style={{ padding: '20px 24px', fontWeight: 800 }}>{res.percentage}</td>
                           <td style={{ padding: '20px 24px' }}>
                              <span style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 900, backgroundColor: `${res.color}15`, color: res.color, textTransform: 'uppercase' }}>
                                 {res.status}
                              </span>
                           </td>
                           <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                 <button 
                                    className="btn" 
                                    style={{ fontSize: '0.75rem', fontWeight: 850, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    onClick={() => handlePrintCard(res)}
                                    title="Print Report Card"
                                 >
                                    <Printer size={14} />
                                 </button>
                                 <button 
                                    className="btn btn-primary" 
                                    style={{ fontSize: '0.75rem', fontWeight: 850, padding: '8px 16px', borderRadius: '8px' }}
                                    onClick={() => setSelectedStudentReport(res)}
                                 >
                                    REPORT
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            ) : (
               <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <AlertCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.5, color: 'var(--primary)' }} />
                  <h3 style={{ margin: 0, fontWeight: 900 }}>No Student Result Found</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', fontWeight: 600 }}>No results match the current query or search.</p>
               </div>
            )}
         </div>
      </div>

      {/* UPLOAD RESULTS MODAL OVERLAY */}
      <AnimatePresence>
         {showUploadModal && (
            <div 
               style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  backgroundColor: 'rgba(15, 23, 42, 0.4)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
               }}
               onClick={() => setShowUploadModal(false)}
            >
               <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  style={{
                     width: '90%',
                     maxWidth: '600px',
                     backgroundColor: 'var(--bg-card)',
                     border: '1px solid var(--border-color)',
                     borderRadius: '32px',
                     padding: '36px',
                     boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                     position: 'relative',
                     overflowY: 'auto',
                     maxHeight: '90vh'
                  }}
                  onClick={(e) => e.stopPropagation()}
               >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                     <div>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 950, margin: 0, letterSpacing: '-0.5px' }}>Upload Term Results</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px', fontWeight: 600 }}>Record new terminal scores and calculate cumulative ranks.</p>
                     </div>
                     <button 
                        className="btn-icon" 
                        style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '6px' }}
                        onClick={() => setShowUploadModal(false)}
                     >
                        <X size={18} />
                     </button>
                  </div>

                  <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Student ID *</label>
                           <input 
                              type="text" 
                              required
                              placeholder="e.g. STU-005"
                              className="form-input"
                              style={{ width: '100%', borderRadius: '10px', padding: '10px' }}
                              value={uploadForm.id}
                              onChange={(e) => setUploadForm({ ...uploadForm, id: e.target.value })}
                           />
                        </div>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Target Class *</label>
                           <select 
                              className="form-input"
                              style={{ width: '100%', borderRadius: '10px', padding: '10px' }}
                              value={uploadForm.class}
                              onChange={(e) => setUploadForm({ ...uploadForm, class: e.target.value })}
                           >
                              <option value="10A">Class 10A</option>
                              <option value="10B">Class 10B</option>
                              <option value="11A">Class 11A</option>
                              <option value="8B">Class 8B</option>
                           </select>
                        </div>
                     </div>

                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Full Student Name *</label>
                        <input 
                           type="text" 
                           required
                           placeholder="e.g. Liam Neeson"
                           className="form-input"
                           style={{ width: '100%', borderRadius: '10px', padding: '10px' }}
                           value={uploadForm.name}
                           onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                        />
                     </div>

                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Aggregate % *</label>
                           <input 
                              type="number" 
                              required
                              min="0"
                              max="100"
                              placeholder="e.g. 88.5"
                              className="form-input"
                              style={{ width: '100%', borderRadius: '10px', padding: '10px' }}
                              value={uploadForm.percentage}
                              onChange={(e) => setUploadForm({ ...uploadForm, percentage: e.target.value })}
                           />
                        </div>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>GPA (0.00 - 4.00) *</label>
                           <input 
                              type="number" 
                              required
                              step="0.01"
                              min="0"
                              max="4.0"
                              placeholder="e.g. 3.75"
                              className="form-input"
                              style={{ width: '100%', borderRadius: '10px', padding: '10px' }}
                              value={uploadForm.gpa}
                              onChange={(e) => setUploadForm({ ...uploadForm, gpa: e.target.value })}
                           />
                        </div>
                     </div>

                     {/* Subject Marks Breakdowns */}
                     <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subject-Wise Marks Allocation (0-100)</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                           {['Math', 'Physics', 'Chem', 'Bio', 'Eng', 'Hist'].map((subj) => (
                              <div key={subj}>
                                 <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '4px' }}>{subj}</label>
                                 <input 
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="85"
                                    className="form-input"
                                    style={{ width: '100%', borderRadius: '8px', padding: '8px' }}
                                    value={uploadForm[subj === 'Chem' ? 'chem' : subj === 'Bio' ? 'bio' : subj === 'Eng' ? 'eng' : subj === 'Hist' ? 'hist' : subj.toLowerCase()]}
                                    onChange={(e) => setUploadForm({ 
                                       ...uploadForm, 
                                       [subj === 'Chem' ? 'chem' : subj === 'Bio' ? 'bio' : subj === 'Eng' ? 'eng' : subj === 'Hist' ? 'hist' : subj.toLowerCase()]: e.target.value 
                                    })}
                                 />
                              </div>
                           ))}
                        </div>
                     </div>

                     <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                        <button 
                           type="button" 
                           className="btn" 
                           style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid var(--border-color)', fontWeight: 800 }}
                           onClick={() => setShowUploadModal(false)}
                        >
                           Cancel
                        </button>
                        <button 
                           type="submit" 
                           className="btn btn-primary" 
                           style={{ flex: 1, fontWeight: 900 }}
                        >
                           Upload Scores
                        </button>
                     </div>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* VIEW ANALYTICS SIDE DRAWER OVERLAY */}
      <AnimatePresence>
         {showAnalyticsDrawer && (
            <div 
               style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  backgroundColor: 'rgba(15, 23, 42, 0.4)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  zIndex: 1000
               }}
               onClick={() => setShowAnalyticsDrawer(false)}
            >
               <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  style={{
                     width: '100%',
                     maxWidth: '550px',
                     height: '100%',
                     backgroundColor: 'var(--bg-card)',
                     borderLeft: '1px solid var(--border-color)',
                     padding: '36px',
                     boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
                     display: 'flex',
                     flexDirection: 'column',
                     gap: '24px',
                     overflowY: 'auto'
                  }}
                  onClick={(e) => e.stopPropagation()}
               >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <TrendingUp size={22} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 950, margin: 0, letterSpacing: '-0.5px' }}>Academic Analytics</h2>
                     </div>
                     <button 
                        className="btn-icon" 
                        style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '8px' }}
                        onClick={() => setShowAnalyticsDrawer(false)}
                     >
                        <X size={20} />
                     </button>
                  </div>

                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                     Deeper statistical breakdown of subject averages, boundaries, and grading distributions inside **Class {selectedClass}**.
                  </div>

                  {/* Subject Average Scores bar chart */}
                  <div className="card" style={{ padding: '20px', borderRadius: '24px' }}>
                     <div style={{ fontWeight: 850, fontSize: '0.85rem', marginBottom: '16px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subject-wise Class Averages (%)</div>
                     <div style={{ height: '200px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={performanceDataByClass[selectedClass] || performanceDataByClass['10A']}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                              <YAxis domain={[0, 100]} hide />
                              <Tooltip contentStyle={{ borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontWeight: 600 }} />
                              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                                 {(performanceDataByClass[selectedClass] || []).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--primary)' : '#6366F1'} />
                                 ))}
                              </Bar>
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  {/* Grade Distribution horizontal Chart */}
                  <div className="card" style={{ padding: '20px', borderRadius: '24px' }}>
                     <div style={{ fontWeight: 850, fontSize: '0.85rem', marginBottom: '16px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Grade Frequency Allocation</div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {gradeDistribution.map((item, idx) => {
                           const totalRoster = (resultsByClass[selectedClass] || []).length;
                           const pct = totalRoster > 0 ? Math.round((item.count / totalRoster) * 100) : 0;
                           return (
                              <div key={idx}>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 800, marginBottom: '6px' }}>
                                    <span>{item.grade}</span>
                                    <span style={{ color: item.color }}>{item.count} Students ({pct}%)</span>
                                 </div>
                                 <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-body)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: item.color, borderRadius: '4px' }} />
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  </div>

                  {/* Boundaries summaries card */}
                  <div className="card" style={{ padding: '20px', borderRadius: '24px', backgroundColor: 'var(--bg-body)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                     <div style={{ fontSize: '0.85rem', fontWeight: 850 }}>Academic Thresholds Summary</div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        <span>Pass Limit Boundary</span>
                        <span style={{ fontWeight: 800, color: '#10B981' }}>&gt;= 60.0% Aggregate</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        <span>Distinction Standard Threshold</span>
                        <span style={{ fontWeight: 800, color: '#F59E0B' }}>&gt;= 85.0% Aggregate</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        <span>Class Lowest Score</span>
                        <span style={{ fontWeight: 800, color: '#EF4444' }}>
                           {Math.min(...(resultsByClass[selectedClass] || []).map(r => parseFloat(r.percentage)))}%
                        </span>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* INDIVIDUAL STUDENT REPORT CARD DRAWER */}
      <AnimatePresence>
         {selectedStudentReport && (
            <div 
               style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  backgroundColor: 'rgba(15, 23, 42, 0.4)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  zIndex: 1000
               }}
               onClick={() => setSelectedStudentReport(null)}
            >
               <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  style={{
                     width: '100%',
                     maxWidth: '680px',
                     height: '100%',
                     backgroundColor: 'var(--bg-card)',
                     borderLeft: '1px solid var(--border-color)',
                     padding: '36px',
                     boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
                     display: 'flex',
                     flexDirection: 'column',
                     gap: '24px',
                     overflowY: 'auto'
                  }}
                  onClick={(e) => e.stopPropagation()}
               >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
                        <GraduationCap size={24} />
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 950, margin: 0, letterSpacing: '-0.5px' }}>Student Report Card</h2>
                     </div>
                     <button 
                        className="btn-icon" 
                        style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '8px' }}
                        onClick={() => setSelectedStudentReport(null)}
                     >
                        <X size={20} />
                     </button>
                  </div>

                  {/* Brief Profiler card */}
                  <div className="card" style={{ padding: '24px', borderRadius: '28px', backgroundColor: 'var(--primary-light)', border: '1px solid rgba(72, 128, 255, 0.15)', display: 'flex', gap: '18px', alignItems: 'center' }}>
                     <div style={{ width: '60px', height: '60px', borderRadius: '18px', overflow: 'hidden', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 900 }}>
                        {selectedStudentReport.avatar ? (
                           <img src={selectedStudentReport.avatar} alt={selectedStudentReport.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                           selectedStudentReport.name.charAt(0)
                        )}
                     </div>
                     <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--text)' }}>{selectedStudentReport.name}</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginTop: '2px' }}>ID: {selectedStudentReport.id} | Class {selectedClass}</div>
                     </div>
                     <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>CLASS RANK</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--primary)' }}>{selectedStudentReport.rank}</div>
                     </div>
                  </div>

                  {/* Overall KPI summaries */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                     <div className="card" style={{ padding: '16px', borderRadius: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>CUMULATIVE PERCENTAGE</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 950, color: selectedStudentReport.color, marginTop: '4px' }}>{selectedStudentReport.percentage}</div>
                     </div>
                     <div className="card" style={{ padding: '16px', borderRadius: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>SEMESTER GPA</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 950, color: 'var(--text)', marginTop: '4px' }}>{selectedStudentReport.gpa} / 4.00</div>
                     </div>
                  </div>

                  {/* Subject-Wise Grades Allocation - Premium Analytical Cards List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                     <div style={{ fontWeight: 950, fontSize: '0.9rem', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        Subject-Wise Grades Allocation
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {selectedStudentReport.subjects ? Object.entries(selectedStudentReport.subjects).map(([subj, marks]) => {
                           let tag = 'Pass';
                           let letter = 'D';
                           let gpa = '2.00';
                           let color = '#6366F1';
                           let bgLight = 'rgba(99, 102, 241, 0.08)';
                           
                           if (marks >= 95) { tag = 'Distinction'; letter = 'A+'; gpa = '4.00'; color = '#10B981'; bgLight = 'rgba(16, 185, 129, 0.08)'; }
                           else if (marks >= 90) { tag = 'Distinction'; letter = 'A'; gpa = '3.90'; color = '#10B981'; bgLight = 'rgba(16, 185, 129, 0.08)'; }
                           else if (marks >= 85) { tag = 'Merit'; letter = 'B+'; gpa = '3.70'; color = 'var(--primary)'; bgLight = 'rgba(72, 128, 255, 0.08)'; }
                           else if (marks >= 80) { tag = 'Merit'; letter = 'B'; gpa = '3.50'; color = 'var(--primary)'; bgLight = 'rgba(72, 128, 255, 0.08)'; }
                           else if (marks >= 70) { tag = 'Credit'; letter = 'C'; gpa = '3.00'; color = '#F59E0B'; bgLight = 'rgba(245, 158, 11, 0.08)'; }
                           else if (marks < 60) { tag = 'Fail'; letter = 'F'; gpa = '0.00'; color = '#EF4444'; bgLight = 'rgba(239, 68, 68, 0.08)'; }

                           // Class Average score comparison
                           const classAvgObj = (performanceDataByClass[selectedClass] || []).find(
                              p => p.month.toLowerCase() === subj.toLowerCase()
                           );
                           const classAvg = classAvgObj ? classAvgObj.score : 80;
                           const deviation = marks - classAvg;
                           
                           let devColor = 'var(--text-muted)';
                           let devText = '• 0%';
                           if (deviation > 0) {
                              devColor = '#10B981';
                              devText = `↑ +${deviation}%`;
                           } else if (deviation < 0) {
                              devColor = '#EF4444';
                              devText = `↓ -${Math.abs(deviation)}%`;
                           }

                           return (
                              <div 
                                 key={subj} 
                                 className="card"
                                 style={{ 
                                    padding: '20px', 
                                    borderRadius: '24px', 
                                    border: `1px solid var(--border-color)`,
                                    backgroundColor: 'var(--bg-card)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '14px',
                                    boxShadow: 'var(--shadow-sm)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                 }}
                              >
                                 {/* Top Header: Subject name, Grade letter & Tag */}
                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                       <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }} />
                                       <span style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-main)' }}>{subj}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                       <span style={{ 
                                          fontSize: '0.8rem', 
                                          fontWeight: 950, 
                                          color: 'white', 
                                          backgroundColor: color, 
                                          width: '26px', 
                                          height: '26px', 
                                          borderRadius: '6px', 
                                          display: 'flex', 
                                          alignItems: 'center', 
                                          justifyContent: 'center',
                                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                                       }}>
                                          {letter}
                                       </span>
                                       <span style={{ 
                                          fontSize: '0.65rem', 
                                          fontWeight: 900, 
                                          padding: '4px 8px', 
                                          borderRadius: '6px', 
                                          color, 
                                          backgroundColor: bgLight, 
                                          textTransform: 'uppercase',
                                          letterSpacing: '0.5px'
                                       }}>
                                          {tag}
                                       </span>
                                    </div>
                                 </div>

                                 {/* Middle Score Progress Bar Track */}
                                 <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                                       <span>ACQUIRED SCORE</span>
                                       <span style={{ fontWeight: 900, color }}>{marks}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-body)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                                       <div style={{ width: `${marks}%`, height: '100%', backgroundColor: color, borderRadius: '4px' }} />
                                    </div>
                                 </div>

                                 {/* Bottom Analytical Grid */}
                                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                                    <div>
                                       <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Your Marks</div>
                                       <div style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-main)' }}>{marks} / 100</div>
                                    </div>
                                    <div>
                                       <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Class Average</div>
                                       <div style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                          {classAvg}%
                                          <span style={{ fontSize: '0.7rem', fontWeight: 900, color: devColor, backgroundColor: `${devColor}10`, padding: '2px 6px', borderRadius: '4px' }}>
                                             {devText}
                                          </span>
                                       </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                       <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>GPA Points</div>
                                       <div style={{ fontSize: '0.85rem', fontWeight: 950, color: 'var(--text-main)' }}>{gpa}</div>
                                    </div>
                                 </div>
                              </div>
                           );
                        }) : (
                           <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
                              No subject marks registered.
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Dean's / Counsellor's Remarks */}
                  <div className="card" style={{ padding: '20px', borderRadius: '24px', display: 'flex', gap: '14px' }}>
                     <AlertCircle size={22} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                     <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 850, marginBottom: '6px' }}>Counsellor Remarks</div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, fontWeight: 600 }}>
                           {getReportRemarks(selectedStudentReport.gpa)}
                        </p>
                     </div>
                  </div>

                  {/* Actions buttons */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', padding: '10px 0' }}>
                     <button 
                        className="btn"
                        style={{ flex: 1, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 800 }}
                        onClick={() => handlePrintSingle(selectedStudentReport)}
                     >
                        <Printer size={16} /> PRINT CARD
                     </button>
                     <button 
                        className="btn btn-primary"
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 850 }}
                        onClick={() => {
                           triggerToast(`Report card emailed to guardian of ${selectedStudentReport.name}!`);
                           setSelectedStudentReport(null);
                        }}
                     >
                        <Mail size={16} /> EMAIL GUARDIAN
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExamResult;
