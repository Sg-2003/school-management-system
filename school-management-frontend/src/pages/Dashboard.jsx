import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, GraduationCap, Calendar, CreditCard, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Clock, Bell, Brain, Zap, 
  ShieldCheck, Activity, ChevronRight, Filter, Download, Megaphone,
  MoreVertical, Star, CircleCheck, BookOpen, AlertCircle, Info, FileText,
  Shield, Baby, CheckCircle2, X, Sparkles
} from 'lucide-react';
import { getStats, getNotices } from '../services/service';
import AttendanceChart from '../components/AttendanceChart';
import RevenueChart from '../components/RevenueChart';
import IncomeVsExpenseChart from '../components/IncomeVsExpenseChart';
import MiniCalendar from '../components/MiniCalendar';
import UserOverviewChart from '../components/UserOverviewChart';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, activeNotices: 0, revenue: 0 });
  const [notices, setNotices] = useState([]);
  const [timeRange, setTimeRange] = useState('This Month');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [noticeFilter, setNoticeFilter] = useState('All');
  const [eventFilter, setEventFilter] = useState('All');
  const [attendanceRange, setAttendanceRange] = useState('This Week');
  const [revenueRange, setRevenueRange] = useState('This Year');
  const [incomeExpenseRange, setIncomeExpenseRange] = useState('Last 6 Months');
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem('userName') || 'Administrator';

  useEffect(() => {
    if (location.state?.showLoginToast) {
      showToast(`Welcome back, ${userName}! Institutional session authenticated successfully.`, 'success');
      // Clear the history state so refreshing the page doesn't show the toast again
      window.history.replaceState({}, document.title);
    }
  }, [location.state, userName]);
  
  const [userOverviewView, setUserOverviewView] = useState('Role Distribution');
  const userOverviewDatasets = {
    'Role Distribution': [
      { name: 'Students', value: stats.totalStudents > 0 ? stats.totalStudents : 850, color: 'var(--primary)' },
      { name: 'Teachers', value: stats.totalTeachers > 0 ? stats.totalTeachers : 45, color: '#f59e0b' },
      { name: 'Parents', value: 600, color: '#6366f1' },
      { name: 'Staff', value: 20, color: 'var(--secondary)' },
    ],
    'Status Breakdown': [
      { name: 'Active', value: 1450, color: 'var(--success)' },
      { name: 'Inactive/On Leave', value: 50, color: 'var(--warning)' },
      { name: 'Suspended', value: 15, color: 'var(--danger)' },
    ],
    'Activity Metric': [
      { name: 'Online', value: 720, color: 'var(--success)' },
      { name: 'Offline', value: 795, color: 'var(--text-muted)' },
    ]
  };

  const [toast, setToast] = useState(null);
  const [teacherFilter, setTeacherFilter] = useState('All Departments');
  const [admissionFilter, setAdmissionFilter] = useState('By Subject');
  const [studentFilter, setStudentFilter] = useState('Top Performers');

  const teacherDatasets = {
    'All Departments': [
      { name: 'Priya Malhotra', role: 'Mathematics', rating: 4.9, img: 'https://api.dicebear.com/7.x/initials/svg?seed=Priya%20Malhotra' },
      { name: 'Vikram Nair', role: 'Science', rating: 4.8, img: 'https://api.dicebear.com/7.x/initials/svg?seed=Vikram%20Nair' },
      { name: 'Sunita Sharma', role: 'English', rating: 4.8, img: 'https://api.dicebear.com/7.x/initials/svg?seed=Sunita%20Sharma' },
      { name: 'Meena Iyer', role: 'History', rating: 4.7, img: 'https://api.dicebear.com/7.x/initials/svg?seed=Meena%20Iyer' },
      { name: 'Kavya Reddy', role: 'Art', rating: 4.7, img: 'https://api.dicebear.com/7.x/initials/svg?seed=Kavya%20Reddy' }
    ],
    'Science & Math': [
      { name: 'Priya Malhotra', role: 'Mathematics', rating: 4.9, img: 'https://api.dicebear.com/7.x/initials/svg?seed=Priya%20Malhotra' },
      { name: 'Vikram Nair', role: 'Science', rating: 4.8, img: 'https://api.dicebear.com/7.x/initials/svg?seed=Vikram%20Nair' }
    ],
    'Humanities & Arts': [
      { name: 'Sunita Sharma', role: 'English', rating: 4.8, img: 'https://api.dicebear.com/7.x/initials/svg?seed=Sunita%20Sharma' },
      { name: 'Meena Iyer', role: 'History', rating: 4.7, img: 'https://api.dicebear.com/7.x/initials/svg?seed=Meena%20Iyer' },
      { name: 'Kavya Reddy', role: 'Art', rating: 4.7, img: 'https://api.dicebear.com/7.x/initials/svg?seed=Kavya%20Reddy' }
    ]
  };

  const admissionDatasets = {
    'By Subject': [
      { label: 'English', count: 15, color: 'var(--primary)' },
      { label: 'Math', count: 15, color: '#6366f1' },
      { label: 'Biology', count: 5, color: 'var(--success)' },
      { label: 'Physics', count: 10, color: 'var(--warning)' },
    ],
    'By Grade': [
      { label: 'Grade 10', count: 20, color: 'var(--primary)' },
      { label: 'Grade 9', count: 15, color: '#6366f1' },
      { label: 'Grade 8', count: 15, color: 'var(--success)' },
    ],
    'By Gender': [
      { label: 'Male', count: 27, color: 'var(--primary)' },
      { label: 'Female', count: 23, color: '#ec4899' },
    ]
  };

  const studentDatasets = {
    'Top Performers': [
      { name: 'Divya Joshi', grade: 'Grade 10', marks: '98%', img: 'https://api.dicebear.com/7.x/initials/svg?seed=Divya%20Joshi' },
      { name: 'Rahul Kapoor', grade: 'Grade 9', marks: '97%', img: 'https://api.dicebear.com/7.x/initials/svg?seed=Rahul%20Kapoor' },
      { name: 'Arjun Reddy', grade: 'Grade 11', marks: '96%', img: 'https://api.dicebear.com/7.x/initials/svg?seed=Arjun%20Reddy' },
      { name: 'Neha Sharma', grade: 'Grade 12', marks: '95%', img: 'https://api.dicebear.com/7.x/initials/svg?seed=Neha%20Sharma' },
      { name: 'Isha Sen', grade: 'Grade 8', marks: '94%', img: 'https://api.dicebear.com/7.x/initials/svg?seed=Isha%20Sen' }
    ],
    'Math Olympiad': [
      { name: 'Isha Sen', grade: 'Grade 8', marks: '1st Place', img: 'https://api.dicebear.com/7.x/initials/svg?seed=Isha%20Sen' },
      { name: 'Divya Joshi', grade: 'Grade 10', marks: '2nd Place', img: 'https://api.dicebear.com/7.x/initials/svg?seed=Divya%20Joshi' },
      { name: 'Arjun Reddy', grade: 'Grade 11', marks: 'Honorable Mention', img: 'https://api.dicebear.com/7.x/initials/svg?seed=Arjun%20Reddy' }
    ],
    'Sports Captains': [
      { name: 'Rahul Kapoor', grade: 'Grade 9', marks: 'Football Captain', img: 'https://api.dicebear.com/7.x/initials/svg?seed=Rahul%20Kapoor' },
      { name: 'Neha Sharma', grade: 'Grade 12', marks: 'Basketball Captain', img: 'https://api.dicebear.com/7.x/initials/svg?seed=Neha%20Sharma' },
      { name: 'Divya Joshi', grade: 'Grade 10', marks: 'Volleyball Captain', img: 'https://api.dicebear.com/7.x/initials/svg?seed=Divya%20Joshi' }
    ]
  };

  const [leaveRequests, setLeaveRequests] = useState(() => {
    const seed = [
      { name: 'Meera Patel', date: '10 April', reason: 'Medical Leave', img: 'https://api.dicebear.com/7.x/initials/svg?seed=Meera%20Patel' },
      { name: 'Kavita Krishnan', date: '10 April', reason: 'Family Emergency', img: 'https://api.dicebear.com/7.x/initials/svg?seed=Kavita%20Krishnan' },
      { name: 'Aditi Nair', date: '10 April', reason: 'Sick Leave', img: 'https://api.dicebear.com/7.x/initials/svg?seed=Aditi%20Nair' },
      { name: 'Aman Verma', date: '12 April', reason: 'Personal Leave', img: 'https://api.dicebear.com/7.x/initials/svg?seed=Aman%20Verma' },
    ];
    try {
      const saved = localStorage.getItem('leave_requests');
      if (saved) {
        const parsed = JSON.parse(saved);
        const dynamicPending = parsed
          .filter(r => r.status === 'Pending')
          .map(r => ({
            name: r.applicant,
            date: new Date(r.from).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
            reason: r.type,
            img: r.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
            id: r.id
          }));
        const filteredSeed = seed.filter(s => !dynamicPending.some(dp => dp.name === s.name));
        return [...dynamicPending, ...filteredSeed];
      }
    } catch (e) {}
    return seed;
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleApproveLeave = (name) => {
    setLeaveRequests(prev => prev.filter(r => r.name !== name));
    
    try {
      const savedRequests = localStorage.getItem('leave_requests');
      let targetReq = null;
      if (savedRequests) {
        const requests = JSON.parse(savedRequests);
        const updatedRequests = requests.map(r => {
          if (r.applicant === name || (name === 'You (Admin)' && r.applicant === 'You (Admin)')) {
            targetReq = r;
            return { ...r, status: 'Approved' };
          }
          return r;
        });
        localStorage.setItem('leave_requests', JSON.stringify(updatedRequests));
      }

      const savedApproved = localStorage.getItem('approved_leaves');
      const approvedList = savedApproved ? JSON.parse(savedApproved) : [];
      
      const applicantName = name;
      const leaveType = targetReq ? targetReq.type : 'Leave';
      const fromDate = targetReq ? targetReq.from : new Date().toISOString().split('T')[0];
      const toDate = targetReq ? targetReq.to : new Date().toISOString().split('T')[0];
      const avatarUrl = targetReq ? targetReq.avatar : (
        name === 'Aman Verma' ? 'https://api.dicebear.com/7.x/initials/svg?seed=Aman%20Verma' :
        name === 'Meera Patel' ? 'https://api.dicebear.com/7.x/initials/svg?seed=Meera%20Patel' :
        name === 'Kavita Krishnan' ? 'https://api.dicebear.com/7.x/initials/svg?seed=Kavita%20Krishnan' :
        name === 'Aditi Nair' ? 'https://api.dicebear.com/7.x/initials/svg?seed=Aditi%20Nair' :
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
      );

      const existingId = targetReq ? targetReq.id : Date.now();
      if (!approvedList.some(item => item.id === existingId)) {
        const approvedItem = {
          id: existingId,
          applicant: applicantName,
          type: leaveType,
          from: fromDate,
          to: toDate,
          approvedBy: 'You (Admin)',
          date: new Date().toISOString().split('T')[0],
          auditCode: `SECURE-AUTH-${applicantName.split(' ').pop().toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
          avatar: avatarUrl
        };
        localStorage.setItem('approved_leaves', JSON.stringify([approvedItem, ...approvedList]));
      }
    } catch (e) {}

    showToast(`Leave request for ${name} approved successfully.`, "success");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const s = await getStats();
      setStats(s);
      const n = await getNotices();
      setNotices(n);
    } catch (err) { console.error(err); }
  };

  const attendanceData = {
    'This Week': [
      { name: 'Mon', present: 850 },
      { name: 'Tue', present: 820 },
      { name: 'Wed', present: 910 },
      { name: 'Thu', present: 880 },
      { name: 'Fri', present: 840 },
      { name: 'Sat', present: 450 },
    ],
    'Last Week': [
      { name: 'Mon', present: 780 },
      { name: 'Tue', present: 750 },
      { name: 'Wed', present: 820 },
      { name: 'Thu', present: 800 },
      { name: 'Fri', present: 790 },
      { name: 'Sat', present: 400 },
    ]
  };

  const revenueData = {
    'This Year': [
      { month: 'Jan', totalFee: 5000, collectedFee: 4000 },
      { month: 'Feb', totalFee: 4500, collectedFee: 3000 },
      { month: 'Mar', totalFee: 6000, collectedFee: 5000 },
      { month: 'Apr', totalFee: 5500, collectedFee: 4500 },
      { month: 'May', totalFee: 7000, collectedFee: 6000 },
      { month: 'Jun', totalFee: 6500, collectedFee: 5500 },
    ],
    'Last Year': [
      { month: 'Jan', totalFee: 4200, collectedFee: 3800 },
      { month: 'Feb', totalFee: 4000, collectedFee: 2800 },
      { month: 'Mar', totalFee: 5500, collectedFee: 4800 },
      { month: 'Apr', totalFee: 5000, collectedFee: 4200 },
      { month: 'May', totalFee: 6500, collectedFee: 5800 },
      { month: 'Jun', totalFee: 6000, collectedFee: 5200 },
    ]
  };

  const incomeExpenseData = {
    'Last 6 Months': [
      { name: 'Jan', income: 4000, expense: 2400 },
      { name: 'Feb', income: 3000, expense: 1398 },
      { name: 'Mar', income: 2000, expense: 9800 },
      { name: 'Apr', income: 2780, expense: 3908 },
      { name: 'May', income: 1890, expense: 4800 },
      { name: 'Jun', income: 2390, expense: 3800 },
    ],
    'This Year': [
      { name: 'Jan', income: 4500, expense: 2200 },
      { name: 'Feb', income: 3200, expense: 1500 },
      { name: 'Mar', income: 2500, expense: 2100 },
      { name: 'Apr', income: 3000, expense: 2800 },
      { name: 'May', income: 2200, expense: 1900 },
      { name: 'Jun', income: 2800, expense: 2400 },
    ]
  };

  const eliteCards = [
    { title: 'Total Students', value: stats.totalStudents > 0 ? stats.totalStudents.toLocaleString() : '20,000', icon: <Users size={24} />, color: 'var(--primary)', trend: '+12.5%', isUp: true },
    { title: 'Total Teachers', value: stats.totalTeachers > 0 ? stats.totalTeachers.toLocaleString() : '1,500', icon: <GraduationCap size={24} />, color: '#6366f1', trend: '+3.2%', isUp: true },
    { title: 'Total Revenue', value: `$${(stats.revenue / 1000).toFixed(1)}k`, icon: <CreditCard size={24} />, color: 'var(--success)', trend: '+18.4%', isUp: true },
    { title: 'System Alerts', value: '4 Active', icon: <Bell size={24} />, color: 'var(--warning)', trend: 'NORMAL', isUp: true }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header section with Page Title and Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>Institutional Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>Welcome back, {userName}. Here is what's happening today.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
          <button 
            className="btn" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Filter size={18} /> {timeRange}
          </button>
          
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                style={{ 
                  position: 'absolute', top: '110%', right: 0, width: '180px', 
                  backgroundColor: 'var(--bg-card)', borderRadius: '12px', 
                  boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)',
                  zIndex: 100, padding: '8px'
                }}
              >
                {['Today', 'This Week', 'This Month', 'This Year'].map((range) => (
                  <div 
                    key={range}
                    onClick={() => {
                      setTimeRange(range);
                      setIsFilterOpen(false);
                      fetchData(); // Re-fetch or simulate data update
                      showToast(`Core parameters refreshed for ${range}.`, "success");
                    }}
                    style={{ 
                      padding: '10px 16px', borderRadius: '8px', cursor: 'pointer',
                      fontSize: '0.85rem', fontWeight: 700, transition: '0.2s',
                      backgroundColor: timeRange === range ? 'var(--primary-light)' : 'transparent',
                      color: timeRange === range ? 'var(--primary)' : 'var(--text-main)'
                    }}
                  >
                    {range}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            className="btn btn-primary"
            onClick={() => {
              showToast("Generating comprehensive CSV ledger...", "info");
              const csvData = [
                ['Metric', 'Value'],
                ['Total Students', stats.totalStudents],
                ['Total Teachers', stats.totalTeachers],
                ['Revenue', stats.revenue],
                ['Active Notices', stats.activeNotices],
                ['Export Date', new Date().toLocaleDateString()]
              ].map(e => e.join(",")).join("\n");
              
              const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement("a");
              const url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", `Institutional_Report_${timeRange.replace(" ", "_")}.csv`);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              setTimeout(() => {
                showToast("Institutional Report exported successfully.", "success");
              }, 1200);
            }}
          >
            <Download size={18} /> Export Report
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        {eliteCards.map((card, i) => (
          <motion.div 
            key={i} 
            className="card" 
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{ border: 'none', boxShadow: 'var(--shadow-md)', cursor: 'pointer' }}
            onClick={() => {
              if (card.title === 'Total Students') {
                showToast("Redirecting to Student Directory...", "info");
                setTimeout(() => navigate('/dashboard/students'), 800);
              } else if (card.title === 'Total Teachers') {
                showToast("Redirecting to Staff Registry...", "info");
                setTimeout(() => navigate('/dashboard/employees'), 800);
              } else if (card.title === 'Total Revenue') {
                showToast("Accessing Financial Ledger...", "info");
                setTimeout(() => navigate('/dashboard/reports/financial'), 800);
              } else if (card.title === 'System Alerts') {
                showToast("System Diagnostics: All core nodes reporting healthy. Latency 14ms.", "success");
              }
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', margin: '0 0 8px 0' }}>{card.title}</p>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 950, margin: 0 }}>{card.value}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 800, color: card.isUp ? 'var(--success)' : 'var(--danger)', marginTop: '8px' }}>
                  {card.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {card.trend} <span style={{ color: 'var(--text-muted)', fontWeight: 500, marginLeft: '4px' }}>since last month</span>
                </div>
              </div>
              <div style={{ width: '60px', height: '60px', borderRadius: '18px', backgroundColor: `${card.color}15`, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top Analytics Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Student Attendance</h3>
            <select 
              value={attendanceRange} 
              onChange={(e) => {
                setAttendanceRange(e.target.value);
                showToast(`Attendance statistics filtered to: ${e.target.value}`, "info");
              }}
              style={{ border: 'none', backgroundColor: 'var(--bg-body)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <option value="This Week">This Week</option>
              <option value="Last Week">Last Week</option>
            </select>
          </div>
          <AttendanceChart data={attendanceData[attendanceRange]} />
        </div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Revenue Statistic</h3>
            <select 
              value={revenueRange}
              onChange={(e) => {
                setRevenueRange(e.target.value);
                showToast(`Revenue reporting range set to: ${e.target.value}`, "info");
              }}
              style={{ border: 'none', backgroundColor: 'var(--bg-body)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <option value="This Year">This Year</option>
              <option value="Last Year">Last Year</option>
            </select>
          </div>
          <RevenueChart data={revenueData[revenueRange]} />
        </div>
      </div>

      {/* Secondary Analytics Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>User Overview</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select 
                value={userOverviewView}
                onChange={(e) => {
                  setUserOverviewView(e.target.value);
                  showToast(`User Overview loaded: ${e.target.value}`, "info");
                }}
                style={{ border: 'none', backgroundColor: 'var(--bg-body)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <option value="Role Distribution">Role Distribution</option>
                <option value="Status Breakdown">Status Breakdown</option>
                <option value="Activity Metric">Activity Metric</option>
              </select>
              <MoreVertical size={18} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => showToast("User Overview metrics synchronized successfully.", "success")} />
            </div>
          </div>
          <UserOverviewChart 
            data={userOverviewDatasets[userOverviewView]}
            onItemClick={(item) => {
              if (userOverviewView === 'Role Distribution') {
                if (item.name === 'Students') {
                  showToast("Opening Students Directory...", "info");
                  setTimeout(() => navigate('/dashboard/students'), 800);
                } else if (item.name === 'Teachers') {
                  showToast("Opening Teachers Directory...", "info");
                  setTimeout(() => navigate('/dashboard/teachers'), 800);
                } else if (item.name === 'Parents') {
                  showToast("Opening Guardians/Parents Directory...", "info");
                  setTimeout(() => navigate('/dashboard/guardians'), 800);
                } else if (item.name === 'Staff') {
                  showToast("Opening Staff Registry...", "info");
                  setTimeout(() => navigate('/dashboard/employees'), 800);
                }
              } else if (userOverviewView === 'Status Breakdown') {
                if (item.name === 'Active') {
                  showToast("Active Accounts: 1,450 accounts active and monitored in the last cycle.", "success");
                } else if (item.name === 'Inactive/On Leave') {
                  showToast("Opening Employee Leave Requests...", "info");
                  setTimeout(() => navigate('/dashboard/leave-approved'), 800);
                } else if (item.name === 'Suspended') {
                  showToast("Opening Suspended Students Directory...", "info");
                  setTimeout(() => navigate('/dashboard/suspended-students'), 800);
                }
              } else if (userOverviewView === 'Activity Metric') {
                if (item.name === 'Online') {
                  showToast("Opening Live Instant Chat Lobby...", "info");
                  setTimeout(() => navigate('/dashboard/chat'), 800);
                } else if (item.name === 'Offline') {
                  showToast("Offline Users: 795 accounts are currently dormant.", "info");
                }
              }
            }}
          />
        </div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Income Vs Expense</h3>
            <select 
              value={incomeExpenseRange}
              onChange={(e) => {
                setIncomeExpenseRange(e.target.value);
                showToast(`Income Vs Expense interval loaded: ${e.target.value}`, "info");
              }}
              style={{ border: 'none', backgroundColor: 'var(--bg-body)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
          <IncomeVsExpenseChart data={incomeExpenseData[incomeExpenseRange]} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column: Notice Board & Leave Requests */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Notice Board */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', backgroundColor: 'var(--primary-light)', borderRadius: '10px', color: 'var(--primary)' }}>
                <Bell size={20} />
              </div>
              <h3 style={{ margin: 0 }}>Global Notice Board</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select 
                value={noticeFilter} 
                onChange={(e) => {
                  setNoticeFilter(e.target.value);
                  showToast(`Notices filtered by type: ${e.target.value}`, "info");
                }} 
                style={{ border: 'none', backgroundColor: 'var(--bg-body)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}
              >
                <option value="All">All</option>
                <option value="alert">Alert</option>
                <option value="event">Event</option>
                <option value="info">Info</option>
              </select>
              <button 
                className="btn" 
                onClick={() => {
                  showToast("Loading Notice Board...", "info");
                  setTimeout(() => navigate('/dashboard/notices'), 600);
                }}
                style={{ padding: '6px 12px', fontSize: '0.85rem', backgroundColor: 'transparent', color: 'var(--primary)', fontWeight: 800 }}
              >
                View All
              </button>
            </div>
          </div>
          
          {notices.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
              <FileText size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <p style={{ margin: 0, fontWeight: 600 }}>No active notices at the moment.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', paddingRight: '4px' }}>
              {notices.filter(notice => noticeFilter === 'All' || notice.type === noticeFilter).slice(0, 5).map((notice, i) => {
                let Icon = Megaphone;
                let color = 'var(--primary)';
                if (notice.type === 'alert') { Icon = AlertCircle; color = 'var(--danger)'; }
                else if (notice.type === 'event') { Icon = Calendar; color = '#f59e0b'; }
                else if (notice.type === 'info') { Icon = Info; color = 'var(--secondary)'; }

                return (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.01, translateX: 5 }}
                    onClick={() => showToast(`Notice details: "${notice.title}" - ${notice.content.slice(0, 70)}...`, "info")}
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
          )}
        </div>

        {/* Leave Requests */}
        <div className="card" style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0 }}>Leave Requests</h3>
            <span 
              onClick={() => {
                showToast("Loading Staff Absence Logs...", "info");
                setTimeout(() => navigate('/dashboard/leave-request'), 600);
              }}
              style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer' }}
            >
              View All
            </span>
          </div>
          <div className="table-container">
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Employee</th>
                  <th style={{ textAlign: 'left' }}>Date</th>
                  <th style={{ textAlign: 'left' }}>Reason</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      All leave requests have been processed.
                    </td>
                  </tr>
                ) : (
                  leaveRequests.map((req, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={req.img} alt={req.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                          <span style={{ fontWeight: 600 }}>{req.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Apply on: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{req.date}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{req.reason}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button 
                            className="icon-btn" 
                            style={{ color: 'var(--success)', backgroundColor: 'var(--success-light)', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => handleApproveLeave(req.name)}
                            title="Approve Leave"
                          >
                            <CircleCheck size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* End of Left Column */}

        {/* Right Column: Calendar & Events */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Mini Calendar */}
          <div className="card">
            <MiniCalendar />
          </div>

          {/* Upcoming Events */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Upcoming Events</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select 
                  value={eventFilter}
                  onChange={(e) => {
                    setEventFilter(e.target.value);
                    showToast(`Showing ${e.target.value} events`, "info");
                  }}
                  style={{ border: 'none', backgroundColor: 'var(--bg-body)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  <option value="All">All Categories</option>
                  <option value="Academic">Academic</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Social">Social</option>
                </select>
                <MoreVertical size={18} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => showToast("Calendar sync: Active. Connecting with institutional nodes.", "info")} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {[
                 { time: '09:00 - 10:30', title: 'Board of Studies Review', lead: 'Principal Eleanor', category: 'Academic', color: 'var(--primary)', details: 'Reviewing Grade 10 & 12 Syllabus adjustments for next term.' },
                 { time: '11:15 - 12:00', title: 'Budget Allocation Plan', lead: 'Robert Fox', category: 'Administrative', color: '#f59e0b', details: 'Quarterly departmental budget approval and sports funding allocation.' },
                 { time: '12:00 - 01:00', title: 'Community Outreach Seminar', lead: 'Courtney Henry', category: 'Social', color: 'var(--success)', details: 'Planning the student charity food drive and community service day.' },
                 { time: '02:00 - 03:30', title: 'Faculty Research Panel', lead: 'Dr. Alan Turing', category: 'Academic', color: 'var(--primary)', details: 'AI and Machine Learning incorporation in K-12 classrooms.' },
                 { time: '03:00 - 04:00', title: 'Debate Club Mock Trials', lead: 'Eleanor Pena', category: 'Social', color: 'var(--success)', details: 'Inter-school preparation. Topic: "Ethics of Gene Editing".' },
                 { time: '04:15 - 05:00', title: 'Trustees Annual Meeting', lead: 'Leslie Alexander', category: 'Administrative', color: '#f59e0b', details: 'Evaluating campus expansion blueprints and infrastructure assets.' }
               ].filter(h => eventFilter === 'All' || h.category === eventFilter).map((h, i, arr) => (
                 <motion.div 
                   key={i} 
                   whileHover={{ scale: 1.02, x: 4 }}
                   style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '12px', borderBottom: i !== arr.length - 1 ? '1px solid var(--border-color)' : 'none', cursor: 'pointer' }}
                   onClick={() => showToast(`${h.details} Lead by: ${h.lead}`, "info", h.title)}
                 >
                   <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: h.color, marginTop: '4px' }}></div>
                   <div style={{ flex: 1 }}>
                     <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 800, marginBottom: '4px' }}>{h.time}</div>
                     <div style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '2px' }}>{h.title}</div>
                     <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lead by <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{h.lead}</span></div>
                   </div>
                 </motion.div>
               ))}
            </div>
            <button 
              className="btn" 
              onClick={() => {
                showToast("Accessing Academic Events Calendar...", "info");
                setTimeout(() => navigate('/dashboard/events'), 600);
              }}
              style={{ width: '100%', marginTop: '20px', backgroundColor: 'var(--bg-body)', color: 'var(--primary)', fontWeight: 800 }}
            >
              View All Events
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="card" style={{ marginTop: '24px', display: 'none' }}>
        {/* Hidden previous recent activity table to match requested layout */}
      </div>

      {/* Edudash specific widgets: Top Teachers, New Admissions, Top Student */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginTop: '24px' }}>
        
        {/* Top Teachers */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Top Teachers</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select 
                value={teacherFilter}
                onChange={(e) => {
                  setTeacherFilter(e.target.value);
                  showToast(`Showing ${e.target.value} faculty rankings.`, "info");
                }}
                style={{ border: 'none', backgroundColor: 'var(--bg-body)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <option value="All Departments">All Depts</option>
                <option value="Science & Math">Science/Math</option>
                <option value="Humanities & Arts">Humanities/Art</option>
              </select>
              <MoreVertical size={18} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => showToast("Calibrating teacher feedback metric scales... Complete.", "success")} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {teacherDatasets[teacherFilter].map((teacher, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02, x: 4 }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                onClick={() => {
                  showToast(`Opening academic profile spotlight for ${teacher.name} (${teacher.role})...`, "info");
                  setTimeout(() => navigate('/dashboard/teachers'), 800);
                }}
              >
                <img 
                  src={teacher.img} 
                  alt={teacher.name} 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(teacher.name)}`;
                  }}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>{teacher.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{teacher.role}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b' }}>
                  <Star size={14} fill="#f59e0b" /> {teacher.rating}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* New Admissions */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>New Admissions</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select 
                value={admissionFilter}
                onChange={(e) => {
                  setAdmissionFilter(e.target.value);
                  showToast(`Admissions parsed by ${e.target.value}.`, "info");
                }}
                style={{ border: 'none', backgroundColor: 'var(--bg-body)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <option value="By Subject">By Subject</option>
                <option value="By Grade">By Grade</option>
                <option value="By Gender">By Gender</option>
              </select>
              <MoreVertical size={18} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => showToast("Parsing live admissions telemetry... 85% enrollment quota certified.", "info")} />
            </div>
          </div>
          <motion.div 
            whileHover={{ scale: 1.03 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0', borderBottom: '1px solid var(--border-color)', marginBottom: '20px', cursor: 'pointer' }}
            onClick={() => {
              showToast("Redirecting to Admissions AI & enrollment pipeline...", "info");
              setTimeout(() => navigate('/dashboard/admissions-ai'), 800);
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '3rem', margin: 0, color: 'var(--primary)', lineHeight: 1 }}>50</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 600 }}>Total Enrolled</p>
            </div>
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {admissionDatasets[admissionFilter].map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => showToast(`Group detail: ${item.label} registered: ${item.count} new students.`, "info", item.label)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: item.color }}></div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.label}</span>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>{item.count}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Students */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Top Students</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select 
                value={studentFilter}
                onChange={(e) => {
                  setStudentFilter(e.target.value);
                  showToast(`Showing ${e.target.value} rankings.`, "info");
                }}
                style={{ border: 'none', backgroundColor: 'var(--bg-body)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <option value="Top Performers">Performers</option>
                <option value="Math Olympiad">Olympiad</option>
                <option value="Sports Captains">Captains</option>
              </select>
              <MoreVertical size={18} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => showToast("Honors roll certified & archived with register.", "success")} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {studentDatasets[studentFilter].map((student, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02, x: 4 }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                onClick={() => {
                  showToast(`Spotlight: ${student.name} (${student.marks}) leads ${student.grade}!`, "success", student.name);
                  setTimeout(() => navigate('/dashboard/students'), 800);
                }}
              >
                <img 
                  src={student.img} 
                  alt={student.name} 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}`;
                  }}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>{student.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.grade}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--success)' }}>
                  <CircleCheck size={14} /> {student.marks}
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
                  : 'rgba(99, 102, 241, 0.15)',
                color: toast.type === 'success' 
                  ? '#34d399' 
                  : toast.type === 'error' 
                  ? '#f87171'
                  : '#818cf8',
                flexShrink: 0,
              }}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 size={20} />
              ) : toast.type === 'error' ? (
                <AlertCircle size={20} />
              ) : (
                <Sparkles size={20} />
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', lineHeight: 1.4 }}>
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

export default Dashboard;

