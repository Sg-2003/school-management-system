import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, CalendarDays, CircleCheck, CircleX, Clock, Search, 
  Filter, Download, ChevronLeft, ChevronRight, UserCheck, 
  UserX, Users, AlertCircle, Save, GraduationCap, ShieldCheck,
  Calendar, CheckCircle2, XCircle, Info, Eye, MessageSquare,
  Flag, Loader2, RotateCcw, Bell, FileBarChart2, ClipboardList,
  SlidersHorizontal, X, CheckCircle, Send
} from 'lucide-react';
import { getStudents } from '../services/service';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import ActionDropdown from '../components/ActionDropdown';

// ─── Constants ──────────────────────────────────────────────────────────────
const MOCK_STUDENTS = [
  // Class 10A
  { student_id: 'STU-2026-001', name: 'Aarav Sharma',      grade: '10A', initialStatus: 'Present' },
  { student_id: 'STU-2026-002', name: 'Aditi Nair',         grade: '10A', initialStatus: 'Present' },
  { student_id: 'STU-2026-003', name: 'Amit Patel',         grade: '10A', initialStatus: 'Absent'  },
  { student_id: 'STU-2026-004', name: 'Divya Joshi',        grade: '10A', initialStatus: 'Present' },
  { student_id: 'STU-2026-005', name: 'Rohan Verma',        grade: '10A', initialStatus: 'Leave'   },
  { student_id: 'STU-2026-006', name: 'Neha Sharma',        grade: '10A', initialStatus: 'Present' },
  { student_id: 'STU-2026-007', name: 'Abhishek Singh',     grade: '10A', initialStatus: 'Present' },
  { student_id: 'STU-2026-008', name: 'Isha Sen',           grade: '10A', initialStatus: 'Absent'  },
  { student_id: 'STU-2026-009', name: 'Karan Mehta',        grade: '10A', initialStatus: 'Present' },
  { student_id: 'STU-2026-010', name: 'Priya Patel',        grade: '10A', initialStatus: 'Leave'   },
  { student_id: 'STU-2026-011', name: 'Arjun Reddy',        grade: '10A', initialStatus: 'Present' },
  { student_id: 'STU-2026-012', name: 'Kavita Krishnan',    grade: '10A', initialStatus: 'Present' },

  // Class 10B
  { student_id: 'STU-2026-101', name: 'Ishaan Choudhury',   grade: '10B', initialStatus: 'Present' },
  { student_id: 'STU-2026-102', name: 'Anjali Desai',       grade: '10B', initialStatus: 'Present' },
  { student_id: 'STU-2026-103', name: 'Varun Dhawan',       grade: '10B', initialStatus: 'Absent'  },
  { student_id: 'STU-2026-104', name: 'Riya Sen',           grade: '10B', initialStatus: 'Present' },
  { student_id: 'STU-2026-105', name: 'Aditya Roy',         grade: '10B', initialStatus: 'Leave'   },
  { student_id: 'STU-2026-106', name: 'Sneha Reddy',        grade: '10B', initialStatus: 'Present' },
  { student_id: 'STU-2026-107', name: 'Vivek Oberoi',       grade: '10B', initialStatus: 'Present' },
  { student_id: 'STU-2026-108', name: 'Pooja Hegde',        grade: '10B', initialStatus: 'Absent'  },
  { student_id: 'STU-2026-109', name: 'Rahul Dravid',       grade: '10B', initialStatus: 'Present' },
  { student_id: 'STU-2026-110', name: 'Kirti Kulhari',      grade: '10B', initialStatus: 'Leave'   },
  { student_id: 'STU-2026-111', name: 'Kabir Bedi',         grade: '10B', initialStatus: 'Present' },
  { student_id: 'STU-2026-112', name: 'Meera Jasmine',      grade: '10B', initialStatus: 'Present' },

  // Class 09A
  { student_id: 'STU-2026-201', name: 'Madhav Yadav',       grade: '09A', initialStatus: 'Present' },
  { student_id: 'STU-2026-202', name: 'Ekta Kinger',        grade: '09A', initialStatus: 'Present' },
  { student_id: 'STU-2026-203', name: 'Alok Verma',          grade: '09A', initialStatus: 'Absent'  },
  { student_id: 'STU-2026-204', name: 'Shalini Sharma',      grade: '09A', initialStatus: 'Present' },
  { student_id: 'STU-2026-205', name: 'Lokesh Hila',        grade: '09A', initialStatus: 'Leave'   },
  { student_id: 'STU-2026-206', name: 'Aria Swamy',          grade: '09A', initialStatus: 'Present' },
  { student_id: 'STU-2026-207', name: 'Jatin Saxena',        grade: '09A', initialStatus: 'Present' },
  { student_id: 'STU-2026-208', name: 'Lata Adhikari',      grade: '09A', initialStatus: 'Absent'  },
  { student_id: 'STU-2026-209', name: 'Jagdish Bakshi',      grade: '09A', initialStatus: 'Present' },
  { student_id: 'STU-2026-210', name: 'Charu Gokhale',      grade: '09A', initialStatus: 'Leave'   },
  { student_id: 'STU-2026-211', name: 'Mukul Das',           grade: '09A', initialStatus: 'Present' },
  { student_id: 'STU-2026-212', name: 'Lila Nair',           grade: '09A', initialStatus: 'Present' },

  // Class 11A
  { student_id: 'STU-2026-301', name: 'Ojas Misra',         grade: '11A', initialStatus: 'Present' },
  { student_id: 'STU-2026-302', name: 'Geeta Patel',        grade: '11A', initialStatus: 'Present' },
  { student_id: 'STU-2026-303', name: 'Lokesh Roy',         grade: '11A', initialStatus: 'Absent'  },
  { student_id: 'STU-2026-304', name: 'Zoya Tandon',        grade: '11A', initialStatus: 'Present' },
  { student_id: 'STU-2026-305', name: 'Chetan Prasad',      grade: '11A', initialStatus: 'Leave'   },
  { student_id: 'STU-2026-306', name: 'Leela Iyer',          grade: '11A', initialStatus: 'Present' },
  { student_id: 'STU-2026-307', name: 'Gaurav Pathak',      grade: '11A', initialStatus: 'Present' },
  { student_id: 'STU-2026-308', name: 'Himani Joshi',        grade: '11A', initialStatus: 'Absent'  },
  { student_id: 'STU-2026-309', name: 'Lokesh Ekka',        grade: '11A', initialStatus: 'Present' },
  { student_id: 'STU-2026-310', name: 'Esha Choudhury',     grade: '11A', initialStatus: 'Leave'   },
  { student_id: 'STU-2026-311', name: 'Dilip Swaminathan',  grade: '11A', initialStatus: 'Present' },
  { student_id: 'STU-2026-312', name: 'Vasundhara Sen',      grade: '11A', initialStatus: 'Present' },
];

const PAGE_SIZE = 6;

const TREND_DATA = [
  { day: 'Mon', present: 85, absent: 5 },
  { day: 'Tue', present: 88, absent: 2 },
  { day: 'Wed', present: 92, absent: 3 },
  { day: 'Thu', present: 78, absent: 12 },
  { day: 'Fri', present: 90, absent: 0 },
];

const STATUS_OPTIONS = [
  { id: 'Present', color: '#10B981', icon: <CheckCircle2 size={14} /> },
  { id: 'Absent',  color: '#EF4444', icon: <XCircle     size={14} /> },
  { id: 'Leave',   color: '#F59E0B', icon: <Clock       size={14} /> },
];

// ─── Component ───────────────────────────────────────────────────────────────
const StudentAttendance = () => {
  const navigate = useNavigate();
  const [students,       setStudents]       = useState([]);
  const [attendance,     setAttendance]     = useState({});
  const [date,           setDate]           = useState(new Date().toISOString().split('T')[0]);
  const [loading,        setLoading]        = useState(true);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [selectedClass,  setSelectedClass]  = useState('10A');
  const [statusFilter,   setStatusFilter]   = useState('All');
  const [showFilter,     setShowFilter]     = useState(false);
  const [currentPage,    setCurrentPage]    = useState(1);

  // Notes & Flagged States
  const [notes,           setNotes]           = useState({});
  const [flaggedStudents, setFlaggedStudents] = useState({});

  // Save / Discard
  const [isSaving,       setIsSaving]       = useState(false);
  const [saveSuccess,    setSaveSuccess]    = useState(false);
  const originalRef = useRef({});

  // Export
  const [isExporting,    setIsExporting]    = useState(false);

  // Quick action modals
  const [showModal,      setShowModal]      = useState(null); // 'notify' | 'report' | 'leave' | 'fullreport'
  const [modalStep,      setModalStep]      = useState('idle'); // 'idle' | 'processing' | 'done'
  const [notifyMsg,      setNotifyMsg]      = useState('');

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleStudentFlag = (id) => {
    setFlaggedStudents(prev => {
      const next = { ...prev, [id]: !prev[id] };
      showToast(`Student ${next[id] ? 'flagged for review' : 'unflagged'} successfully`);
      return next;
    });
  };

  // ── Data Load ──────────────────────────────────────────────────────────────
  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const data = await getStudents();
      const list = data && data.length > 0 ? data : MOCK_STUDENTS;
      setStudents(list);
      
      const init = {};
      list.forEach(s => { init[s.student_id] = s.initialStatus || 'Present'; });
      setAttendance(init);
      originalRef.current = { ...init };
    } catch {
      setStudents(MOCK_STUDENTS);
      const init = {};
      MOCK_STUDENTS.forEach(s => { init[s.student_id] = s.initialStatus; });
      setAttendance(init);
      originalRef.current = { ...init };
    } finally {
      setLoading(false);
    }
  };

  // ── Sync state when date or class changes ──
  useEffect(() => {
    const key = `student_attendance_${date}_${selectedClass}`;
    const stored = localStorage.getItem(key);
    
    const classStudents = students.filter(s => s.grade === selectedClass);
    
    if (stored) {
      const parsed = JSON.parse(stored);
      setAttendance(parsed);
      originalRef.current = { ...parsed };
    } else {
      const init = {};
      classStudents.forEach(s => { init[s.student_id] = s.initialStatus || 'Present'; });
      setAttendance(init);
      originalRef.current = { ...init };
    }

    // Load stored notes
    const storedNotes = localStorage.getItem(`student_notes_${date}_${selectedClass}`);
    setNotes(storedNotes ? JSON.parse(storedNotes) : {});

    // Load stored flags
    const storedFlags = localStorage.getItem(`student_flags_${date}_${selectedClass}`);
    setFlaggedStudents(storedFlags ? JSON.parse(storedFlags) : {});
  }, [date, selectedClass, students]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleAttendanceChange = (id, status) =>
    setAttendance(prev => ({ ...prev, [id]: status }));

  const markAllPresent = () => {
    const classStudents = students.filter(s => s.grade === selectedClass);
    const all = { ...attendance };
    classStudents.forEach(s => { all[s.student_id] = 'Present'; });
    setAttendance(all);
    showToast(`All Class ${selectedClass} students marked as Present`);
  };

  const handleDiscard = () => {
    setAttendance({ ...originalRef.current });
    
    // Discard notes & flags
    const storedNotes = localStorage.getItem(`student_notes_${date}_${selectedClass}`);
    setNotes(storedNotes ? JSON.parse(storedNotes) : {});
    const storedFlags = localStorage.getItem(`student_flags_${date}_${selectedClass}`);
    setFlaggedStudents(storedFlags ? JSON.parse(storedFlags) : {});

    setSearchQuery('');
    setStatusFilter('All');
    setCurrentPage(1);
    showToast('All changes discarded', 'warn');
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      const key = `student_attendance_${date}_${selectedClass}`;
      localStorage.setItem(key, JSON.stringify(attendance));
      
      // Save notes & flags
      localStorage.setItem(`student_notes_${date}_${selectedClass}`, JSON.stringify(notes));
      localStorage.setItem(`student_flags_${date}_${selectedClass}`, JSON.stringify(flaggedStudents));

      originalRef.current = { ...attendance };
      setIsSaving(false);
      setSaveSuccess(true);
      showToast(`Attendance for Class ${selectedClass} saved!`);
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 1200);
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const classStudents = students.filter(s => s.grade === selectedClass);
      const headers = ['Student ID', 'Name', 'Class', 'Status', 'Date'];
      const rows = classStudents.map(s => [
        s.student_id, s.name, selectedClass, attendance[s.student_id] || 'Present', date
      ]);
      const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url  = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Student_Attendance_${selectedClass}_${date}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsExporting(false);
      showToast('Attendance exported as CSV!');
    }, 900);
  };

  const handleViewFullReport = () => {
    const classStudents = students.filter(s => s.grade === selectedClass);
    const present = classStudents.filter(s => attendance[s.student_id] === 'Present').length;
    const absent  = classStudents.filter(s => attendance[s.student_id] === 'Absent').length;
    const leave   = classStudents.filter(s => attendance[s.student_id] === 'Leave').length;
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Attendance Report – Class ${selectedClass}</title>
      <style>body{font-family:Arial,sans-serif;padding:40px;color:#1e293b}
      table{width:100%;border-collapse:collapse;margin-top:24px}
      th{background:#4880FF;color:white;padding:12px;text-align:left}
      td{padding:11px;border-bottom:1px solid #e2e8f0}
      .badge{padding:4px 10px;border-radius:20px;font-size:0.8rem;font-weight:700}
      .p{background:#d1fae5;color:#065f46}.a{background:#fee2e2;color:#991b1b}.l{background:#fef3c7;color:#92400e}
      @media print{button{display:none}}</style></head>
      <body>
        <h2 style="color:#4880FF;margin-bottom:4px">EduPro Academy — Attendance Report</h2>
        <p style="color:#64748b;margin-bottom:24px">Class ${selectedClass} · Date: ${new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
        <div style="display:flex;gap:24px;margin-bottom:28px">
          <div style="padding:16px 28px;background:#d1fae5;border-radius:12px;text-align:center"><div style="font-size:2rem;font-weight:900;color:#065f46">${present}</div><div style="font-weight:700;color:#065f46">Present</div></div>
          <div style="padding:16px 28px;background:#fee2e2;border-radius:12px;text-align:center"><div style="font-size:2rem;font-weight:900;color:#991b1b">${absent}</div><div style="font-weight:700;color:#991b1b">Absent</div></div>
          <div style="padding:16px 28px;background:#fef3c7;border-radius:12px;text-align:center"><div style="font-size:2rem;font-weight:900;color:#92400e">${leave}</div><div style="font-weight:700;color:#92400e">Leave</div></div>
          <div style="padding:16px 28px;background:#eff6ff;border-radius:12px;text-align:center"><div style="font-size:2rem;font-weight:900;color:#1d4ed8">${classStudents.length > 0 ? ((present/classStudents.length)*100).toFixed(1) : 0}%</div><div style="font-weight:700;color:#1d4ed8">Rate</div></div>
        </div>
        <table><thead><tr><th>#</th><th>Student ID</th><th>Name</th><th>Status</th></tr></thead>
        <tbody>${classStudents.map((s,i) => {
          const st = attendance[s.student_id] || 'Present';
          const cls = st === 'Present' ? 'p' : st === 'Absent' ? 'a' : 'l';
          return `<tr><td>${i+1}</td><td>${s.student_id}</td><td>${s.name}</td><td><span class="badge ${cls}">${st}</span></td></tr>`;
        }).join('')}</tbody></table>
        <button onclick="window.print()" style="margin-top:28px;padding:10px 28px;background:#4880FF;color:white;border:none;border-radius:8px;cursor:pointer;font-size:1rem">🖨 Print Report</button>
      </body></html>`);
    win.document.close();
    showToast('Full report opened in new tab');
  };

  // Quick action handler (Notify / Report / Leave)
  const runModalAction = () => {
    const classStudents = students.filter(s => s.grade === selectedClass);
    setModalStep('processing');
    setTimeout(() => {
      setModalStep('done');
      if (showModal === 'notify')  showToast(`${classStudents.filter(s=>attendance[s.student_id]==='Absent').length} guardian(s) notified!`);
      if (showModal === 'report')  showToast('Attendance report generated!');
      if (showModal === 'leave')   showToast('Leave approval request submitted!');
    }, 1400);
  };

  // ── Filtering & Pagination ─────────────────────────────────────────────────
  const classStudents = students.filter(s => s.grade === selectedClass);
  const filtered = classStudents.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.student_id.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || attendance[s.student_id] === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goPage = (p) => setCurrentPage(Math.min(totalPages, Math.max(1, p)));

  // Dynamic stats
  const stats = [
    { label: 'Enrolled Students', value: classStudents.length,                                              color: 'var(--primary)', icon: <Users size={20} />,      trend: `${selectedClass}`, sub: 'Active Roster' },
    { label: 'Present Today',     value: classStudents.filter(s => attendance[s.student_id] === 'Present').length,    color: '#10B981',        icon: <UserCheck size={20} />,   trend: `${classStudents.length > 0 ? ((classStudents.filter(s => attendance[s.student_id] === 'Present').length/classStudents.length)*100).toFixed(0) : 0}% Rate`, sub: 'On-time' },
    { label: 'Absent Today',      value: classStudents.filter(s => attendance[s.student_id] === 'Absent').length,     color: '#EF4444',        icon: <UserX size={20} />,       trend: 'Requires Follow-up', sub: 'Check guardians' },
    { label: 'On Leave',          value: classStudents.filter(s => attendance[s.student_id] === 'Leave').length,      color: '#F59E0B',        icon: <AlertCircle size={20} />, trend: 'Pending Review', sub: 'Leave requests' },
  ];

  // ─── MODALS config ─────────────────────────────────────────────────────────
  const MODALS = {
    notify: {
      icon: <Bell size={24} />, color: '#4880FF',
      title: 'Notify Guardians',
      desc: `Send absence notification to guardians of ${classStudents.filter(s => attendance[s.student_id] === 'Absent').length} absent student(s).`,
      actionLabel: 'Send Notifications',
      doneMsg: 'Notifications dispatched via SMS and email.',
    },
    report: {
      icon: <FileBarChart2 size={24} />, color: '#10B981',
      title: 'Generate Attendance Report',
      desc: `Compile a full PDF/CSV attendance report for Class ${selectedClass} on ${date}.`,
      actionLabel: 'Generate Report',
      doneMsg: 'Report generated and ready for download.',
    },
    leave: {
      icon: <ClipboardList size={24} />, color: '#F59E0B',
      title: 'Request Leave Approval',
      desc: `Submit leave approval request for ${classStudents.filter(s => attendance[s.student_id] === 'Leave').length} student(s) currently on leave.`,
      actionLabel: 'Submit Request',
      doneMsg: 'Leave approval request submitted to administration.',
    },
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '60px' }}>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -28 }}
            style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
              padding: '14px 22px', borderRadius: '14px', fontWeight: 800, fontSize: '0.88rem',
              background: toast.type === 'warn' ? 'var(--warning)' : toast.type === 'error' ? 'var(--danger)' : 'var(--primary)',
              color: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '8px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--primary-light)', borderRadius: '10px' }}>
              <CalendarDays size={20} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Daily Attendance Log</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 950, margin: 0, letterSpacing: '-1px' }}>Student Presence Monitoring</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, fontWeight: 600 }}>
              Managing attendance for <span style={{ color: 'var(--primary)' }}>Class {selectedClass}</span>
            </p>
            <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--border-color)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 800, color: '#10B981' }}>
              <ShieldCheck size={14} /> VERIFIED
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn" onClick={handleExportCSV} disabled={isExporting}
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              border: '1px solid var(--border-color)', 
              color: 'var(--text-main)',
              fontWeight: 800, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: 'var(--shadow-sm)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'var(--primary-light)';
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.color = 'var(--primary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'var(--bg-card)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-main)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {isExporting ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={18} />}
            {isExporting ? 'Exporting...' : 'EXPORT CSV'}
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}
            style={{ padding: '12px 28px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: saveSuccess ? 'var(--success)' : undefined,
              transition: 'background-color 0.3s',
              boxShadow: '0 4px 12px rgba(72,128,255,0.2)' }}>
            {isSaving
              ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> SAVING...</>
              : saveSuccess
              ? <><CheckCircle size={18} /> SAVED!</>
              : <><Save size={18} /> SAVE ALL RECORDS</>}
          </button>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ padding: '22px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '13px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</div>
                <div style={{ fontSize: '1.7rem', fontWeight: 950, lineHeight: 1.1 }}>{stat.value}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: stat.color }}>{stat.trend}</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 370px', gap: '28px' }}>

        {/* ── Attendance Table ── */}
        <div className="card" style={{ padding: '0', overflow: 'hidden', borderRadius: '28px' }}>

          {/* Table toolbar */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {/* Search */}
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" placeholder="Search student name or ID..."
                  style={{ width: '100%', padding: '11px 12px 11px 42px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', outline: 'none', fontWeight: 600 }}
                  value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
              </div>
              {/* Class selector */}
              <select className="form-input" style={{ width: '140px', borderRadius: '14px' }}
                value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                <option value="10A">Class 10A</option>
                <option value="10B">Class 10B</option>
                <option value="09A">Class 09A</option>
                <option value="11A">Class 11A</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button className="btn" onClick={markAllPresent}
                style={{ 
                  backgroundColor: 'rgba(16, 185, 129, 0.06)', 
                  border: '1px solid rgba(16, 185, 129, 0.3)', 
                  color: '#10B981', 
                  fontWeight: 900, 
                  fontSize: '0.78rem', 
                  letterSpacing: '0.5px',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.05)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#10B981';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.06)';
                  e.currentTarget.style.color = '#10B981';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <CheckCircle2 size={15} /> MARK ALL PRESENT
              </button>

              {/* Filter toggle */}
              <button className="btn" onClick={() => setShowFilter(f => !f)}
                style={{ 
                  backgroundColor: showFilter || statusFilter !== 'All' ? 'var(--primary-light)' : 'var(--bg-card)',
                  border: `1px solid ${showFilter || statusFilter !== 'All' ? 'var(--primary)' : 'var(--border-color)'}`,
                  color: showFilter || statusFilter !== 'All' ? 'var(--primary)' : 'var(--text-main)',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: 'var(--shadow-sm)'
                }}
                onMouseEnter={e => {
                  if (!(showFilter || statusFilter !== 'All')) {
                    e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.color = 'var(--primary)';
                  }
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  if (!(showFilter || statusFilter !== 'All')) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-main)';
                  }
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <SlidersHorizontal size={15} /> Filter
                {statusFilter !== 'All' && (
                  <span style={{ 
                    width: '16px', 
                    height: '16px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--primary)', 
                    color: 'white', 
                    fontSize: '0.6rem', 
                    fontWeight: 900, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(69,179,224,0.3)'
                  }}>1</span>
                )}
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilter && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden', backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-color)', padding: '0 24px' }}>
                <div style={{ paddingTop: '16px', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Filter by Status:</span>
                  {['All', 'Present', 'Absent', 'Leave'].map(s => {
                    const colMap = { All: 'var(--primary)', Present: '#10B981', Absent: '#EF4444', Leave: '#F59E0B' };
                    const c = colMap[s];
                    return (
                      <button key={s} onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                        style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 800, transition: 'all 0.15s',
                          borderColor: statusFilter === s ? c : 'var(--border-color)',
                          backgroundColor: statusFilter === s ? `${c}15` : 'transparent',
                          color: statusFilter === s ? c : 'var(--text-muted)' }}>
                        {s}
                      </button>
                    );
                  })}
                  {statusFilter !== 'All' && (
                    <button onClick={() => setStatusFilter('All')}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: 'rgba(239,68,68,0.08)', color: 'var(--danger)', fontWeight: 800, fontSize: '0.78rem' }}>
                      <X size={12} /> Clear
                    </button>
                  )}
                  <span style={{ marginLeft: 'auto', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {filtered.length} / {students.length} students
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-card)' }}>
                  <th style={{ padding: '18px 24px', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Student Information</th>
                  <th style={{ padding: '18px 24px', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Academic ID</th>
                  <th style={{ padding: '18px 24px', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center' }}>Attendance Status</th>
                  <th style={{ padding: '18px 24px', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                    <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px' }} /><div>Loading students...</div>
                  </td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>No students match the current filters.</td></tr>
                ) : (
                  <AnimatePresence>
                    {paginated.map((student, i) => (
                      <motion.tr key={student.student_id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                        style={{ borderBottom: '1px solid var(--border-color)', transition: '0.2s' }}>
                        <td style={{ padding: '18px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ 
                              width: '42px', 
                              height: '42px', 
                              borderRadius: '12px', 
                              backgroundColor: 'var(--primary-light)', 
                              color: 'var(--primary)', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              fontWeight: 900, 
                              fontSize: '0.9rem',
                              overflow: 'hidden',
                              border: '1.5px solid var(--border-color)',
                              boxShadow: 'var(--shadow-sm)',
                              flexShrink: 0
                            }}>
                              <img 
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}`}
                                alt={student.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {student.name}
                                {notes[student.student_id] && (
                                  <MessageSquare size={13} color="var(--primary)" fill="var(--primary-light)" title={notes[student.student_id]} style={{ cursor: 'pointer' }} onClick={() => {
                                    const note = prompt(`Edit note for ${student.name}:`, notes[student.student_id]);
                                    if (note !== null) {
                                      setNotes(prev => ({ ...prev, [student.student_id]: note }));
                                      showToast(`Note updated for ${student.name}`);
                                    }
                                  }} />
                                )}
                                {flaggedStudents[student.student_id] && <Flag size={12} fill="var(--danger)" color="var(--danger)" style={{ flexShrink: 0 }} />}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Roll: #0{((currentPage - 1) * PAGE_SIZE) + i + 1}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '18px 24px' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-muted)' }}>{student.student_id}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 900 }}>CLASS {selectedClass}</div>
                        </td>
                        <td style={{ padding: '18px 24px' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            {STATUS_OPTIONS.map(status => {
                              const isSelected = attendance[student.student_id] === status.id;
                              return (
                                <button key={status.id}
                                  onClick={() => handleAttendanceChange(student.student_id, status.id)}
                                  style={{ 
                                    padding: '9px 16px', 
                                    borderRadius: '11px', 
                                    fontSize: '0.75rem', 
                                    fontWeight: 900,
                                    border: '1px solid', 
                                    cursor: 'pointer', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '6px',
                                    transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                                    backgroundColor: isSelected ? status.color : 'var(--bg-card)',
                                    color: isSelected ? 'white' : 'var(--text-muted)',
                                    borderColor: isSelected ? status.color : 'var(--border-color)',
                                    boxShadow: isSelected ? `0 4px 10px ${status.color}30` : 'none',
                                    transform: isSelected ? 'scale(1.05)' : 'scale(1)' 
                                  }}
                                  onMouseEnter={e => {
                                    if (!isSelected) {
                                      e.currentTarget.style.backgroundColor = `${status.color}08`;
                                      e.currentTarget.style.borderColor = status.color;
                                      e.currentTarget.style.color = status.color;
                                      e.currentTarget.style.transform = 'scale(1.03)';
                                    }
                                  }}
                                  onMouseLeave={e => {
                                    if (!isSelected) {
                                      e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                                      e.currentTarget.style.borderColor = 'var(--border-color)';
                                      e.currentTarget.style.color = 'var(--text-muted)';
                                      e.currentTarget.style.transform = 'scale(1)';
                                    }
                                  }}
                                >
                                  {status.icon} {status.id.toUpperCase()}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                        <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                          <ActionDropdown
                            items={[
                              { label: 'View Student',    icon: <Eye size={15} />,         onClick: () => navigate(`/dashboard/student-details/${student.student_id}`) },
                              { label: 'Leave Note',      icon: <MessageSquare size={15} />, onClick: () => {
                                  const note = prompt(`Enter note for ${student.name}:`, notes[student.student_id] || '');
                                  if (note !== null) {
                                    setNotes(prev => ({ ...prev, [student.student_id]: note }));
                                    showToast(`Note updated for ${student.name}`);
                                  }
                                }
                              },
                              { label: flaggedStudents[student.student_id] ? 'Unflag Student' : 'Flag for Review', icon: <Flag size={15} />, onClick: () => toggleStudentFlag(student.student_id) },
                              { divider: true },
                              { label: 'Mark Absent',     icon: <UserX size={15} />, danger: true, onClick: () => handleAttendanceChange(student.student_id, 'Absent') },
                            ]}
                          />
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination + Discard ── */}
          <div style={{ padding: '18px 24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                Showing <strong style={{ color: 'var(--text-main)' }}>{paginated.length}</strong> of <strong style={{ color: 'var(--text-main)' }}>{filtered.length}</strong> students
              </span>
              <button onClick={handleDiscard}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '7px 14px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border-color)', 
                  backgroundColor: 'var(--bg-card)', 
                  cursor: 'pointer', 
                  fontSize: '0.78rem', 
                  fontWeight: 800, 
                  color: 'var(--text-muted)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
                  e.currentTarget.style.borderColor = 'var(--danger)';
                  e.currentTarget.style.color = 'var(--danger)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <RotateCcw size={13} /> Discard Changes
              </button>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button onClick={() => goPage(currentPage - 1)} disabled={currentPage === 1}
                className="btn-icon" style={{ backgroundColor: 'var(--bg-body)', opacity: currentPage === 1 ? 0.4 : 1 }}>
                <ChevronLeft size={17} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => goPage(p)}
                  className="btn-icon"
                  style={{ backgroundColor: p === currentPage ? 'var(--primary)' : 'var(--bg-body)', color: p === currentPage ? 'white' : 'inherit', fontWeight: 800 }}>
                  {p}
                </button>
              ))}
              <button onClick={() => goPage(currentPage + 1)} disabled={currentPage === totalPages}
                className="btn-icon" style={{ backgroundColor: 'var(--bg-body)', opacity: currentPage === totalPages ? 0.4 : 1 }}>
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

          {/* Trend Chart */}
          <div className="card" style={{ padding: '22px', borderRadius: '28px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 950, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={17} color="var(--primary)" /> Attendance Trend
            </h3>
            <div style={{ height: '190px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--text-muted)' }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }} cursor={{ fill: 'var(--bg-body)', opacity: 0.4 }} />
                  <Bar dataKey="present" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px', fontWeight: 600 }}>
              Presence rate up <span style={{ color: '#10B981' }}>4.2%</span> since last week
            </p>
          </div>

          {/* Smart Summary */}
          <div className="card" style={{ padding: '22px', borderRadius: '28px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1 }}>
              <GraduationCap size={110} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 950, marginBottom: '10px' }}>Smart Summary</h3>
            <p style={{ fontSize: '0.83rem', lineHeight: 1.6, opacity: 0.9, fontWeight: 600, marginBottom: '18px' }}>
              Class {selectedClass}: {Object.values(attendance).filter(v=>v==='Present').length} present, {Object.values(attendance).filter(v=>v==='Absent').length} absent, {Object.values(attendance).filter(v=>v==='Leave').length} on leave today.
            </p>
            <button onClick={handleViewFullReport}
              className="btn"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', fontWeight: 800, fontSize: '0.8rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <FileBarChart2 size={15} /> VIEW FULL REPORT
            </button>
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ padding: '22px', borderRadius: '28px' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 950, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={17} color="#F59E0B" /> Quick Actions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { key: 'notify', label: 'Notify Guardians',       icon: <Bell size={16} />,           color: '#4880FF' },
                { key: 'report', label: 'Attendance Report',      icon: <FileBarChart2 size={16} />,   color: '#10B981' },
                { key: 'leave',  label: 'Request Leave Approval', icon: <ClipboardList size={16} />,  color: '#F59E0B' },
              ].map(({ key, label, icon, color }) => (
                <button key={key} onClick={() => { setShowModal(key); setModalStep('idle'); }}
                  className="btn"
                  style={{ 
                    justifyContent: 'flex-start', 
                    backgroundColor: 'var(--bg-card)', 
                    border: '1px solid var(--border-color)', 
                    fontWeight: 700, 
                    fontSize: '0.85rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    color: 'var(--text-main)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = `${color}06`;
                    e.currentTarget.style.borderColor = color;
                    e.currentTarget.style.color = color;
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-main)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span>{icon}</span> {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Action Modal ── */}
      <AnimatePresence>
        {showModal && MODALS[showModal] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { if (modalStep !== 'processing') setShowModal(null); }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ scale: 0.92, y: 24, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.92, y: 24, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--bg-card)', borderRadius: '28px', padding: '36px', boxShadow: '0 24px 60px rgba(0,0,0,0.25)', border: '1px solid var(--border-color)' }}>
              {modalStep === 'idle' && (() => {
                const m = MODALS[showModal];
                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: `${m.color}15`, color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{m.icon}</div>
                      <div>
                        <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.2rem' }}>{m.title}</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>{m.desc}</p>
                      </div>
                      <button onClick={() => setShowModal(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
                    </div>
                    {showModal === 'notify' && (
                      <textarea value={notifyMsg} onChange={e => setNotifyMsg(e.target.value)}
                        placeholder="Optional custom message to guardians..."
                        rows={3}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', outline: 'none', fontWeight: 600, fontSize: '0.85rem', resize: 'none', marginBottom: '16px' }} />
                    )}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      <button onClick={() => setShowModal(null)} className="btn" style={{ flex: 1, border: '1px solid var(--border-color)', backgroundColor: 'transparent', fontWeight: 800 }}>Cancel</button>
                      <button onClick={runModalAction} className="btn btn-primary" style={{ flex: 1.5, backgroundColor: m.color, border: 'none', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Send size={16} /> {m.actionLabel}
                      </button>
                    </div>
                  </>
                );
              })()}
              {modalStep === 'processing' && (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)', marginBottom: '16px' }} />
                  <p style={{ fontWeight: 800, fontSize: '1rem' }}>Processing...</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Please wait while we complete the action.</p>
                </div>
              )}
              {modalStep === 'done' && (() => {
                const m = MODALS[showModal];
                return (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}
                      style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: `${m.color}15`, color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                      <CheckCircle2 size={40} />
                    </motion.div>
                    <h3 style={{ fontWeight: 900, margin: '0 0 8px', color: m.color }}>Done!</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '24px' }}>{m.doneMsg}</p>
                    <button onClick={() => setShowModal(null)} className="btn btn-primary"
                      style={{ width: '100%', backgroundColor: m.color, border: 'none', fontWeight: 900, padding: '13px' }}>
                      Close
                    </button>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StudentAttendance;
