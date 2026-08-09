import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, CreditCard, MessageSquare, BookOpen, CircleCheck, Clock, Calendar as CalendarIcon, 
  MoreVertical, Edit, FileText, Bell, Megaphone, AlertCircle, Info, DollarSign,
  CheckCircle2, X, Sparkles
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import MiniCalendar from '../components/MiniCalendar';
import studentAvatar from '../assets/student_avatar.png';
import janeAvatar from '../assets/jane_avatar.png';
import robertAvatar from '../assets/robert_avatar.png';

const academicProgress = [
  { subject: 'Math', Aman: 95, Divya: 88 },
  { subject: 'Physics', Aman: 88, Divya: 92 },
  { subject: 'English', Aman: 85, Divya: 90 },
  { subject: 'History', Aman: 78, Divya: 85 },
];

const childrenAttendanceData = {
  'Aman': [
    { name: 'Present', value: 92, color: 'var(--success)' },
    { name: 'Absent', value: 8, color: 'var(--danger)' },
  ],
  'Divya': [
    { name: 'Present', value: 85, color: 'var(--success)' },
    { name: 'Absent', value: 15, color: 'var(--danger)' },
  ]
};

const linkedChildren = [
  { name: 'Aman Verma', grade: 'Grade 10A', avatar: studentAvatar, status: 'In Class', id: 1 },
  { name: 'Divya Joshi', grade: 'Grade 8B', avatar: janeAvatar, status: 'In Library', id: 2 }
];

const notices = [
  { title: 'Parent-Teacher Conference', content: 'The annual parent-teacher conference is scheduled for the last week of this month. Please book your slots via the portal.', type: 'event', created_at: new Date().toISOString() },
  { title: 'Fee Payment Reminder', content: 'Please be advised that the second term tuition fees are due by the 15th of next month to avoid late penalties.', type: 'alert', created_at: new Date(Date.now() - 86400000).toISOString() },
  { title: 'School Bus Route Changes', content: 'Due to ongoing road constructions downtown, Route A and Route C will experience minor detours starting Monday.', type: 'info', created_at: new Date(Date.now() - 172800000).toISOString() },
  { title: 'Annual Sports Day', content: 'Join us for the Annual Sports Day next Saturday. All parents are welcome to attend and cheer for the students!', type: 'general', created_at: new Date(Date.now() - 259200000).toISOString() },
  { title: 'Science Fair Exposition', content: 'The annual Science & Robotics exposition will take place in the school auditorium next Wednesday. All student designs will be showcased.', type: 'event', created_at: new Date(Date.now() - 345600000).toISOString() }
];

const feeHistory = [
  { type: 'Term 1 Tuition', date: '01 Sep 2025', amount: '₹25,000', status: 'Paid', color: 'var(--success)', remarks: 'Paid on 01 Sep 2025. Receipt Audit: #TXN-9029-A. Status: Certified Secure.' },
  { type: 'Bus Fee', date: '01 Sep 2025', amount: '₹3,000', status: 'Paid', color: 'var(--success)', remarks: 'Paid on 01 Sep 2025. Receipt Audit: #TXN-9029-B. Status: Certified Secure.' },
  { type: 'Term 2 Tuition', date: '15 Jan 2026', amount: '₹25,000', status: 'Pending', color: '#f59e0b', remarks: 'Awaiting parent checkout. Payment deadline: 15 June 2026. Account status: Active.' },
  { type: 'Library Fine', date: '05 Feb 2026', amount: '₹300', status: 'Unpaid', color: 'var(--danger)', remarks: 'Unpaid fine. Reason: Overdue physics textbooks in Grade 10 division.' },
  { type: 'Extracurricular: Robotics', date: '10 Feb 2026', amount: '₹2,000', status: 'Pending', color: '#f59e0b', remarks: 'Awaiting parent checkout confirmation for the summer league registration.' },
  { type: 'Cafeteria Plan', date: '01 Sep 2025', amount: '₹6,000', status: 'Paid', color: 'var(--success)', remarks: 'Paid on 01 Sep 2025. Receipt Audit: #TXN-9030-A.' },
  { type: 'Annual Uniform Fee', date: '15 Aug 2025', amount: '₹5,000', status: 'Paid', color: 'var(--success)', remarks: 'Paid on 15 Aug 2025. Receipt Audit: #TXN-8942-A.' },
  { type: 'Field Trip: Science Museum', date: '12 Oct 2025', amount: '₹1,000', status: 'Paid', color: 'var(--success)', remarks: 'Paid on 12 Oct 2025. Receipt Audit: #TXN-8998-A.' }
];

const ParentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [noticeFilter, setNoticeFilter] = useState('All');
  const [eventFilter, setEventFilter] = useState('All');
  const [selectedChildAttendance, setSelectedChildAttendance] = useState('Aman');
  const [toast, setToast] = useState(null);
  const userName = localStorage.getItem('userName') || 'Parent';

  useEffect(() => {
    if (location.state?.showLoginToast) {
      showToast(`Welcome back, ${userName}! Guardian portal loaded successfully.`, 'success', 'Session Authenticated');
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
          <h2 style={{ margin: 0, fontSize: '1.75rem' }}>Parent Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.95rem' }}>Monitor your children's progress, attendance, and fee status.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn" 
            onClick={() => {
              showToast("Opening predictive academic AI analytics...", "success", "AI Insights");
              setTimeout(() => navigate('/dashboard/ai-hub'), 600);
            }}
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Sparkles size={16} style={{ color: 'var(--primary)' }} /> AI Insights
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => {
              showToast("Generating comprehensive payment ledger receipts...", "info", "Payment Ledger YTD");
              const csvContent = [
                ['Date', 'Item Description', 'Amount', 'Status', 'Payment Method'],
                ['01 Sep 2025', 'Term 1 Tuition', '₹25,000', 'Paid', 'Credit Card'],
                ['01 Sep 2025', 'Bus Fee', '₹3,000', 'Paid', 'Credit Card'],
                ['15 Jan 2026', 'Term 2 Tuition', '₹25,000', 'Pending', 'Awaiting Checkout'],
                ['05 Feb 2026', 'Library Fine', '₹300', 'Unpaid', 'Overdue Fine'],
                ['10 Feb 2026', 'Extracurricular: Robotics', '₹2,000', 'Pending', 'Awaiting Checkout'],
                ['01 Sep 2025', 'Cafeteria Plan', '₹6,000', 'Paid', 'Credit Card'],
                ['15 Aug 2025', 'Annual Uniform Fee', '₹5,000', 'Paid', 'Debit Card'],
                ['12 Oct 2025', 'Field Trip: Science Museum', '₹1,000', 'Paid', 'Credit Card'],
                ['Parent Name', 'Rajesh Verma'],
                ['Date Exported', new Date().toLocaleDateString()]
              ].map(e => e.join(",")).join("\n");
              
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement("a");
              const url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", `Payment_History_Robert_Lane.csv`);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              setTimeout(() => {
                showToast("Receipt history ledger exported successfully.", "success", "Download Complete");
              }, 1200);
            }}
          >
            <FileText size={16} /> Export Receipts
          </button>
        </div>
      </div>

      {/* Master Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        
        {/* ROW 1: Profile & Stats */}
        <motion.div 
          className="card" 
          whileHover={{ y: -4 }}
          onClick={() => showToast("Guardian Name: Rajesh Verma. Linked student profiles: 2 active accounts.", "info", "Guardian Profile")}
          style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 24px', cursor: 'pointer' }}
        >
          <img src={robertAvatar} alt="Rajesh Verma" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '16px', objectFit: 'cover' }} />
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Rajesh Verma</h3>
          <p style={{ margin: '4px 0 16px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Guardian / Father</p>
          <button 
            className="btn" 
            onClick={(e) => {
              e.stopPropagation();
              showToast("Opening Guardian details editor...", "info", "Profile Access");
              setTimeout(() => navigate('/dashboard/guardian-details/1'), 600);
            }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Edit size={16} /> Edit Profile
          </button>
        </motion.div>

        <div style={{ gridColumn: 'span 3', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { 
              title: 'Children Enrolled', 
              value: '2', 
              icon: <Users size={24} />, 
              color: 'var(--primary)',
              onClick: () => showToast("Rajesh's linked child profiles: Aman Verma (Grade 10A) and Divya Joshi (Grade 8B). Both active.", "info", "Linked Students")
            },
            { 
              title: 'Pending Fees', 
              value: '₹27,300', 
              icon: <DollarSign size={24} />, 
              color: '#f59e0b',
              onClick: () => showToast("Outstanding Balance YTD: ₹27,300 (₹25,000 Term 2 Tuition and ₹300 Overdue Library Fine and ₹2,000 Extracurricular). Due by 15th.", "warning", "Dues Outstanding")
            },
            { 
              title: 'Unread Messages', 
              value: '4', 
              icon: <MessageSquare size={24} />, 
              color: 'var(--danger)',
              onClick: () => {
                showToast("Opening the secure institutional messages thread...", "success", "Messenger");
                setTimeout(() => navigate('/dashboard/messaging'), 600);
              }
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

        {/* ROW 2: Attendance, Performance, Linked Children */}
        <div className="card" style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Overall Attendance</h3>
            <select 
              value={selectedChildAttendance}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedChildAttendance(val);
                const pct = val === 'Aman' ? '92%' : '85%';
                showToast(`Loaded ${val}'s attendance report. Semester average: ${pct}.`, "info", "Attendance Logs");
              }}
              style={{ border: 'none', backgroundColor: 'var(--bg-body)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <option value="Aman">Aman</option>
              <option value="Divya">Divya</option>
            </select>
          </div>
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={childrenAttendanceData[selectedChildAttendance]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {childrenAttendanceData[selectedChildAttendance].map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      style={{ cursor: 'pointer' }}
                      onClick={() => showToast(`${selectedChildAttendance} attendance is ${entry.value}% marked as ${entry.name}.`, "info", entry.name)}
                    />
                  ))}
                </Pie>
                <Tooltip cursor={{ fill: 'var(--bg-body)' }} contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
            {childrenAttendanceData[selectedChildAttendance].map((entry, i) => (
               <div 
                 key={i} 
                 onClick={() => showToast(`Detailed attendance segment: ${entry.value}% marked ${entry.name}.`, "info", entry.name)}
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
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Academic Progress Overview</h3>
            <MoreVertical 
              size={18} 
              style={{ color: 'var(--text-muted)', cursor: 'pointer' }} 
              onClick={() => showToast("Subject assessment scores normalized with class records.", "success", "Grades Sync")}
            />
          </div>
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={academicProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }} />
                <Tooltip cursor={{ fill: 'var(--bg-body)' }} contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 600 }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '0.8rem', fontWeight: 600 }} />
                <Bar 
                  dataKey="Aman" 
                  fill="var(--primary)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={16} 
                  style={{ cursor: 'pointer' }}
                  onClick={(data) => showToast(`Aman scored ${data.Aman}% in ${data.subject}.`, "success", `Aman - ${data.subject}`)}
                />
                <Bar 
                  dataKey="Divya" 
                  fill="#f59e0b" 
                  radius={[4, 4, 0, 0]} 
                  barSize={16} 
                  style={{ cursor: 'pointer' }}
                  onClick={(data) => showToast(`Divya scored ${data.Divya}% in ${data.subject}.`, "warning", `Divya - ${data.subject}`)}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Linked Children</h3>
            <span 
              onClick={() => {
                showToast("Opening student enrollment wizard...", "info", "Onboard Student");
                navigate('/dashboard/add-student');
              }}
              style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer' }}
            >
              Add Child
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {linkedChildren.map((child, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02, x: 4 }}
                onClick={() => {
                  showToast(`Accessing student card details for ${child.name}...`, "info", child.name);
                  setTimeout(() => navigate(`/dashboard/student-details/${child.id}`), 600);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', cursor: 'pointer', transition: '0.2s' }}
              >
                <img src={child.avatar} alt={child.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>{child.name}</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{child.grade}</p>
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, padding: '4px 8px', borderRadius: '8px', backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
                  {child.status}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ROW 3: Notice Board, Calendar & Events, Fee Status */}
        <div className="card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', backgroundColor: 'var(--primary-light)', borderRadius: '10px', color: 'var(--primary)' }}>
                <Bell size={20} />
              </div>
              <h3 style={{ margin: 0 }}>School Notice Board</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select 
                value={noticeFilter} 
                onChange={(e) => {
                  setNoticeFilter(e.target.value);
                  showToast(`Notice board filter loaded: ${e.target.value}`, "info");
                }} 
                style={{ border: 'none', backgroundColor: 'var(--bg-body)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <option value="All">All Notices</option>
                <option value="alert">Alert</option>
                <option value="event">Event</option>
                <option value="info">Info</option>
              </select>
              <button 
                className="btn" 
                onClick={() => {
                  showToast("Redirecting to the global notifications directory...", "info", "Notice Board");
                  navigate('/dashboard/notices');
                }}
                style={{ padding: '6px 12px', fontSize: '0.85rem', backgroundColor: 'transparent', color: 'var(--primary)', fontWeight: 800 }}
              >
                View All
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', paddingRight: '4px' }}>
            {notices.filter(notice => noticeFilter === 'All' || notice.type === noticeFilter).map((notice, i) => {
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
          <div className="card" style={{ cursor: 'pointer' }}>
            <MiniCalendar />
          </div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h3 style={{ margin: 0 }}>Upcoming Events</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select 
                    value={eventFilter} 
                    onChange={(e) => {
                      setEventFilter(e.target.value);
                      showToast(`Showing ${e.target.value} event schedules`, "info");
                    }} 
                    style={{ border: 'none', backgroundColor: 'var(--bg-body)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    <option value="All">All Events</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Fair">Fair</option>
                    <option value="Address">Address</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                  <MoreVertical 
                    size={18} 
                    style={{ color: 'var(--text-muted)', cursor: 'pointer' }} 
                    onClick={() => showToast("School calendar events and consultation hours synced.", "success", "Timeline Active")}
                  />
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {[
                  { time: '09:00 - 09:45', title: 'Marketing Strategy Kickoff', lead: 'Robert Fox', color: 'var(--primary)', category: 'Meeting', details: 'Special briefing. Robert Lane invited to school corporate board.' },
                  { time: '11:15 - 12:00', title: 'Product Design Brainstorm', lead: 'Leslie Alexander', color: '#f59e0b', category: 'Workshop', details: 'Design thinking workshop. Interactive pedagogy methods display.' },
                  { time: '14:30', title: 'Annual Science Fair YTD', color: '#f59e0b', category: 'Fair', details: 'Student projects exhibit. Highly recommended for parent attendees.' },
                  { time: '15:00 - 16:00', title: 'Team Building Workshop', lead: 'HR Dept', color: '#6366f1', category: 'Workshop', details: 'Interactive parent-faculty integration exercises.' },
                  { time: '16:00', title: 'Principal Address', color: 'var(--success)', category: 'Address', details: 'Principal keynote speech detailing term 2 expansions and achievements.' },
                  { time: '17:30 - 18:00', title: 'Year-End Celebration', lead: 'School Committee', color: 'var(--primary)', category: 'Celebration', details: 'School courtyard social celebration.' },
                ].filter(h => eventFilter === 'All' || h.category === eventFilter).map((h, i) => (
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
            <h3 style={{ margin: 0 }}>Fee & Payment History</h3>
            <MoreVertical 
              size={18} 
              style={{ color: 'var(--text-muted)', cursor: 'pointer' }} 
              onClick={() => showToast("Historical payment receipts and ledger audit certified secure.", "success", "Ledger Audit")}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {feeHistory.map((fee, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02 }}
                onClick={() => showToast(fee.remarks, fee.status === 'Paid' ? 'success' : fee.status === 'Pending' ? 'warning' : 'error', fee.type)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', cursor: 'pointer' }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>{fee.type}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fee.date}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)' }}>{fee.amount}</span>
                  <div style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800, backgroundColor: `${fee.color}15`, color: fee.color }}>
                    {fee.status}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              showToast("Redirecting to secure online payment gateways...", "info", "Secure Checkouts");
              setTimeout(() => navigate('/dashboard/fees-collection'), 600);
            }}
            style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}
          >
            <CreditCard size={16} /> Pay Pending Fees
          </button>
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

export default ParentDashboard;
