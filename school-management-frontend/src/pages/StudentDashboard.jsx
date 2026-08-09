import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, FileText, CircleCheck, Clock, Award, Bell, Calendar as CalendarIcon, 
  MoreVertical, Edit, User, Activity, Megaphone, AlertCircle, Info,
  CheckCircle2, X, Sparkles
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import MiniCalendar from '../components/MiniCalendar';
import studentAvatar from '../assets/student_avatar.png';

const attendanceData = [
  { name: 'Present', value: 200, color: 'var(--success)' },
  { name: 'Half Day', value: 30, color: '#f59e0b' },
  { name: 'Late', value: 17, color: 'var(--warning)' },
  { name: 'Absent', value: 5, color: 'var(--danger)' },
];

const examResultsData = {
  'Mid Term': [
    { subject: 'Math', score: 95 },
    { subject: 'Physics', score: 88 },
    { subject: 'Chemistry', score: 92 },
    { subject: 'English', score: 85 },
    { subject: 'History', score: 78 },
  ],
  'Final Term': [
    { subject: 'Math', score: 98 },
    { subject: 'Physics', score: 92 },
    { subject: 'Chemistry', score: 95 },
    { subject: 'English', score: 88 },
    { subject: 'History', score: 82 },
  ]
};

const notices = [
  { title: 'Annual Science Fair 2026', content: 'The Annual Science Fair is scheduled for next week. All participating students must submit their project abstracts by Friday at 5 PM.', type: 'event', created_at: new Date().toISOString() },
  { title: 'Severe Weather Warning', content: 'Due to expected heavy monsoon rainfall, all after-school activities for tomorrow have been cancelled. Please monitor this board for school closure updates.', type: 'alert', created_at: new Date(Date.now() - 86400000).toISOString() },
  { title: 'System Maintenance Window', content: 'The school learning management system (LMS) will undergo scheduled maintenance this Sunday from 2 AM to 4 AM. Please save your work.', type: 'info', created_at: new Date(Date.now() - 172800000).toISOString() },
  { title: 'Guest Lecture: AI in Healthcare', content: 'Dr. K. Sivan will be giving a guest lecture in the main auditorium this Thursday. Attendance is mandatory for computer science students.', type: 'general', created_at: new Date(Date.now() - 259200000).toISOString() },
  { title: 'Library Book Returns', content: 'A reminder that all books checked out before the spring break must be returned by the end of this week to avoid late fees.', type: 'info', created_at: new Date(Date.now() - 345600000).toISOString() },
];

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [examTerm, setExamTerm] = useState('Mid Term');
  const [toast, setToast] = useState(null);
  const userName = localStorage.getItem('userName') || 'Student';

  useEffect(() => {
    if (location.state?.showLoginToast) {
      showToast(`Welcome back, ${userName}! Student portal loaded successfully.`, 'success', 'Session Authenticated');
      window.history.replaceState({}, document.title);
    }
  }, [location.state, userName]);

  const showToast = (message, type = 'success', title = null) => {
    setToast({ message, type, title });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ paddingBottom: '40px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.75rem' }}>Student Dashboard</h2>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)' }}>Welcome back, Devon Lane! Here's your academic overview.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn" 
            onClick={() => {
              showToast("Opening EduPro AI Study Assistant...", "success", "EduPro AI");
              setTimeout(() => navigate('/dashboard/ai'), 600);
            }}
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Sparkles size={16} style={{ color: 'var(--primary)' }} /> AI Tutor
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => {
              showToast("Generating official academic report card ledger...", "info", "Report Card YTD");
              const csvContent = [
                ['Subject', 'Score', 'Term', 'Grade'],
                ['Mathematics', '98%', 'Final Term', 'A+'],
                ['Physics', '92%', 'Final Term', 'A'],
                ['Chemistry', '95%', 'Final Term', 'A+'],
                ['English', '88%', 'Final Term', 'B+'],
                ['History', '82%', 'Final Term', 'B'],
                ['Student Name', 'Devon Lane'],
                ['Cumulative GPA', '3.82 YTD'],
                ['Class Rank', '3rd of 42'],
                ['Export Date', new Date().toLocaleDateString()]
              ].map(e => e.join(",")).join("\n");
              
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement("a");
              const url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", `Report_Card_Devon_Lane.csv`);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              setTimeout(() => {
                showToast("Report Card downloaded successfully.", "success", "Download Complete");
              }, 1200);
            }}
          >
            <FileText size={16} /> Download Report
          </button>
        </div>
      </div>

      {/* Master Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        
        {/* ROW 1: Profile & Stats */}
        <motion.div 
          className="card" 
          whileHover={{ y: -4 }}
          style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 24px', cursor: 'pointer' }}
          onClick={() => showToast("Devon Lane - Student ID: #STU-2026-0492. Enrolled in Grade 10-A.", "info", "Student Profile Info")}
        >
          <img src={studentAvatar} alt="Devon Lane" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '16px', objectFit: 'cover' }} />
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Devon Lane</h3>
          <p style={{ margin: '4px 0 16px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Class 10 - Section A</p>
          <button 
            className="btn" 
            onClick={(e) => {
              e.stopPropagation();
              showToast("Opening Student Profile Editor...", "info", "Profile Access");
              setTimeout(() => navigate('/dashboard/student-details/1'), 600);
            }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Edit size={16} /> Edit Profile
          </button>
        </motion.div>

        <div style={{ gridColumn: 'span 3', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { 
              title: 'Enrolled Courses', 
              value: '10', 
              icon: <BookOpen size={24} />, 
              color: 'var(--primary)',
              onClick: () => showToast("Devon is enrolled in English, Physics, Chemistry, Accounting, Mathematics, History, Biology, Computer Science, Literature, and Physical Education.", "info", "Enrolled Courses")
            },
            { 
              title: 'Pending Assignments', 
              value: '15', 
              icon: <FileText size={24} />, 
              color: '#f59e0b',
              onClick: () => showToast("15 pending assignments found. 2 due this week: 'Physics Electromagnetism Lab' & 'English Modern Literature Essay'.", "warning", "Pending Assignments")
            },
            { 
              title: 'Overall Attendance', 
              value: '90%', 
              icon: <CircleCheck size={24} />, 
              color: 'var(--success)',
              onClick: () => showToast("Superb attendance record! 90% attendance maintained across all subjects in the current semester.", "success", "Overall Attendance")
            },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              className="card" 
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={stat.onClick}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stat.icon}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>{stat.value}</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>{stat.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ROW 2: Attendance, Exam Results, Today's Classes */}
        <div className="card" style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Attendance Overview</h3>
            <MoreVertical 
              size={18} 
              style={{ color: 'var(--text-muted)', cursor: 'pointer' }} 
              onClick={() => showToast("Biometric and class attendance records synchronized with parent portals.", "success", "Attendance Logs")}
            />
          </div>
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={attendanceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {attendanceData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      style={{ cursor: 'pointer' }}
                      onClick={() => showToast(`Devon has ${entry.value} logged units marked as ${entry.name}.`, "info", entry.name)}
                    />
                  ))}
                </Pie>
                <Tooltip cursor={{ fill: 'var(--bg-body)' }} contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
            {attendanceData.map((entry, i) => (
               <div 
                 key={i} 
                 onClick={() => showToast(`Devon has ${entry.value} logged units marked as ${entry.name}.`, "info", entry.name)}
                 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
               >
                 <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: entry.color }}></span>
                 {entry.name}
               </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Recent Exam Results</h3>
            <select 
              value={examTerm}
              onChange={(e) => {
                const val = e.target.value;
                setExamTerm(val);
                const avg = val === 'Mid Term' ? '88.2%' : '91.0%';
                showToast(`Switched to ${val} results. Cumulative term GPA average is ${avg}.`, "info", "Exam Performance");
              }}
              style={{ border: 'none', backgroundColor: 'var(--bg-body)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <option value="Mid Term">Mid Term</option>
              <option value="Final Term">Final Term</option>
            </select>
          </div>
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={examResultsData[examTerm]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }} />
                <Tooltip cursor={{ fill: 'var(--bg-body)' }} contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 600 }} />
                <Bar 
                  dataKey="score" 
                  fill="var(--primary)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={32} 
                  onClick={(data) => showToast(`Devon scored ${data.score}% in ${data.subject} during ${examTerm}.`, "success", data.subject)}
                  style={{ cursor: 'pointer' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Today's Classes</h3>
            <span 
              onClick={() => {
                showToast("Opening the full calendar timetable...", "info", "Timetable Access");
                navigate('/dashboard/timetable');
              }}
              style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer' }}
            >
              View All
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { subject: 'English', time: '09:00 - 09:45', teacher: 'Theresa Webb', color: 'var(--primary)', topic: 'Shakespearean Sonnets & Dramatic Monologues in English Literature' },
              { subject: 'Physics', time: '10:00 - 10:45', teacher: 'Darrell Steward', color: '#f59e0b', topic: 'Thermodynamics: Heat engines, work-energy theorems, and ideal gas cycles' },
              { subject: 'Chemistry', time: '11:15 - 12:00', teacher: 'Jane Cooper', color: 'var(--success)', topic: 'Organic Chemistry nomenclature, synthesis pathways, and laboratory exercises' },
              { subject: 'Accounting', time: '01:00 - 01:45', teacher: 'Eleanor Pena', color: '#6366f1', topic: 'Double-entry ledger balances, journal reconciliations, and cash flow structures' }
            ].map((cls, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02, x: 4 }}
                onClick={() => showToast(`${cls.topic}. Room: 104-B. Instructor: ${cls.teacher}`, "info", cls.subject)}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', cursor: 'pointer' }}
              >
                <div style={{ width: '4px', height: '40px', backgroundColor: cls.color, borderRadius: '4px' }}></div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>{cls.subject}</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cls.teacher}</p>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>{cls.time}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ROW 3: Notice Board, Calendar & Events, Leave Status */}
        <div className="card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', backgroundColor: 'var(--primary-light)', borderRadius: '10px', color: 'var(--primary)' }}>
                <Bell size={20} />
              </div>
              <h3 style={{ margin: 0 }}>Global Notice Board</h3>
            </div>
            <button 
              className="btn" 
              onClick={() => {
                showToast("Redirecting to the global notifications directory...", "info", "Notice Center");
                navigate('/dashboard/notices');
              }}
              style={{ padding: '6px 12px', fontSize: '0.85rem', backgroundColor: 'transparent', color: 'var(--primary)', fontWeight: 800 }}
            >
              View All
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', paddingRight: '4px' }}>
            {notices.map((notice, i) => {
              let Icon = Megaphone;
              let color = 'var(--primary)';
              if (notice.type === 'alert') { Icon = AlertCircle; color = 'var(--danger)'; }
              else if (notice.type === 'event') { Icon = CalendarIcon; color = '#f59e0b'; }
              else if (notice.type === 'info') { Icon = Info; color = 'var(--secondary)'; }

              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.01, translateX: 5 }}
                  onClick={() => showToast(notice.content, notice.type === 'alert' ? 'error' : notice.type === 'event' ? 'warning' : 'info', notice.title)}
                  style={{ 
                    display: 'flex', gap: '16px', padding: '20px', backgroundColor: 'var(--bg-body)', 
                    borderRadius: '16px', borderLeft: `4px solid ${color}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)', cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, flexShrink: 0 }}>
                    <Icon size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>{notice.title}</h4>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)', padding: '4px 8px', borderRadius: '8px' }}>
                        {new Date(notice.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {notice.content}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <MiniCalendar />
          </div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Upcoming Events</h3>
              <MoreVertical 
                size={18} 
                style={{ color: 'var(--text-muted)', cursor: 'pointer' }} 
                onClick={() => showToast("Daily event timeline and club sessions have been synchronized.", "success", "Timeline Active")}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {[
                 { time: '09:00', title: 'Morning Assembly', color: 'var(--primary)', details: 'School prayer, administrative address, and national anthem performance.' },
                 { time: '10:30', title: 'Math Olympiad Prep', color: '#f59e0b', details: 'Advanced coaching session on number theory and mathematical induction in Room 201.' },
                 { time: '12:00', title: 'Lunch Break', color: 'var(--success)', details: 'Cafeteria service. Lunch menu: Grilled chicken salad, cream of tomato, or vegan wraps.' },
                 { time: '13:15', title: 'Science Lab: Physics', color: '#6366f1', details: 'Hands-on practical session testing thermodynamic cycles and heat engine efficiency.' },
                 { time: '15:00', title: 'Football Practice', color: 'var(--danger)', details: 'Team tactical drills and friendly match on the main athletic field.' },
                 { time: '16:30', title: 'Debate Club Meeting', color: 'var(--secondary)', details: 'Weekly debate discussion in Auditorium B. Topic: "Ethics of General Artificial Intelligence".' },
               ].map((h, i) => (
                 <motion.div 
                   key={i} 
                   whileHover={{ x: 4 }}
                   onClick={() => showToast(h.details, 'info', h.title)}
                   style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                 >
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, width: '40px' }}>{h.time}</div>
                   <div style={{ width: '4px', height: '24px', backgroundColor: h.color, borderRadius: '4px' }}></div>
                   <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: 700 }}>{h.title}</div>
                 </motion.div>
               ))}
             </div>
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0 }}>Leave Status</h3>
            <MoreVertical 
              size={18} 
              style={{ color: 'var(--text-muted)', cursor: 'pointer' }} 
              onClick={() => showToast("Historical leave balances and emergency logs up to date.", "success", "Leave Records")}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { type: 'Emergency', date: '12 May 2026', status: 'Approved', color: 'var(--success)', remarks: 'Urgent family emergency travel approved by Class Teacher Eleanor.' },
                { type: 'Medical', date: '04 Apr 2026', status: 'Pending', color: '#f59e0b', remarks: 'Awaiting doctor\'s prescription or school clinic certificate verification.' },
                { type: 'Special', date: '15 Mar 2026', status: 'Approved', color: 'var(--success)', remarks: 'Approved: Devon representing school at state-level science exhibition.' },
                { type: 'Sick', date: '28 Feb 2026', status: 'Rejected', color: 'var(--danger)', remarks: 'Rejected due to absence of valid medical notice or notification delay.' },
                { type: 'Personal', date: '10 Jan 2026', status: 'Approved', color: 'var(--success)', remarks: 'Pre-approved study leave for entrance preparation.' },
                { type: 'Study Leave', date: '05 Dec 2025', status: 'Approved', color: 'var(--success)', remarks: 'Approved: Preparation for mathematical excellence entrance exam.' },
                { type: 'Medical', date: '18 Nov 2025', status: 'Approved', color: 'var(--success)', remarks: 'Approved: Dental surgery recovery leave.' },
                { type: 'Family Event', date: '22 Oct 2025', status: 'Rejected', color: 'var(--danger)', remarks: 'Rejected: Maximum casual leaves allowed for the quarter exceeded.' }
              ].map((leave, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02 }}
                onClick={() => showToast(`${leave.remarks}`, leave.status === 'Approved' ? 'success' : leave.status === 'Pending' ? 'warning' : 'error', `${leave.type} Leave`)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', cursor: 'pointer' }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>{leave.type}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{leave.date}</p>
                </div>
                <div style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, backgroundColor: `${leave.color}15`, color: leave.color }}>
                  {leave.status}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed',
              bottom: '40px',
              right: '40px',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px 24px',
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              color: '#ffffff',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              maxWidth: '400px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: toast.type === 'success' 
                  ? 'rgba(16, 185, 129, 0.15)' 
                  : toast.type === 'error' 
                  ? 'rgba(239, 68, 68, 0.15)'
                  : toast.type === 'warning'
                  ? 'rgba(245, 158, 11, 0.15)'
                  : 'rgba(99, 102, 241, 0.15)',
                color: toast.type === 'success' 
                  ? '#34d399' 
                  : toast.type === 'error' 
                  ? '#f87171'
                  : toast.type === 'warning'
                  ? '#fbbf24'
                  : '#818cf8',
                flexShrink: 0,
              }}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 size={20} />
              ) : toast.type === 'error' ? (
                <AlertCircle size={20} />
              ) : toast.type === 'warning' ? (
                <Clock size={20} />
              ) : (
                <Sparkles size={20} />
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              {toast.title && (
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                  {toast.title}
                </h4>
              )}
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500, color: '#cbd5e1', lineHeight: 1.4 }}>
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => setToast(null)}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                color: '#94a3b8',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StudentDashboard;
