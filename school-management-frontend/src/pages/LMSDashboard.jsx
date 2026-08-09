import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Users, GraduationCap, DollarSign, ArrowUpRight, ArrowDownRight, 
  MoreVertical, Filter, Download, Star, ChevronRight, Calendar, Clock, 
  Video, CircleCheck, Play, FileText, UserPlus, Globe, Link, Share2, MessageCircle, AtSign,
  Mail, Phone, MapPin, ExternalLink, Activity, Zap, TrendingUp, X, CheckCircle2, AlertCircle, Sparkles, Printer, ShieldAlert
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, Legend
} from 'recharts';
import MiniCalendar from '../components/MiniCalendar';

// Mock Data
const sparklineData = [
  { name: '1', value: 400 }, { name: '2', value: 300 }, { name: '3', value: 600 },
  { name: '4', value: 400 }, { name: '5', value: 500 }, { name: '6', value: 450 },
  { name: '7', value: 800 },
];

const earningsData = [
  { name: 'Jan', earnings: 45000 }, { name: 'Feb', earnings: 52000 },
  { name: 'Mar', earnings: 48000 }, { name: 'Apr', earnings: 61000 },
  { name: 'May', earnings: 55000 }, { name: 'Jun', earnings: 67000 },
  { name: 'Jul', earnings: 72000 }, { name: 'Aug', earnings: 68000 },
  { name: 'Sep', earnings: 75000 }, { name: 'Oct', earnings: 82000 },
  { name: 'Nov', earnings: 88000 }, { name: 'Dec', earnings: 95000 },
];

const instructors = [
  { id: 1, name: 'Dr. Priya Malhotra', courses: 12, rating: 4.9, students: 1250, avatar: 'PM' },
  { id: 2, name: 'Prof. Rajesh Kumar', courses: 8, rating: 4.8, students: 850, avatar: 'RK' },
  { id: 3, name: 'Meena Iyer', courses: 15, rating: 4.7, students: 2100, avatar: 'MI' },
  { id: 4, name: 'Amit Bose', courses: 6, rating: 4.9, students: 600, avatar: 'AB' },
];

const topStudents = [
  { id: 1, name: 'Aman Verma', progress: 95, score: 'A+', avatar: 'AV', color: '#10b981' },
  { id: 2, name: 'Divya Joshi', progress: 88, score: 'A', avatar: 'DJ', color: '#3b82f6' },
  { id: 3, name: 'Karan Mehta', progress: 82, score: 'B+', avatar: 'KM', color: '#f59e0b' },
  { id: 4, name: 'Neha Sharma', progress: 78, score: 'B', avatar: 'NS', color: '#8b5cf6' },
];

const upcomingSessions = [
  { id: 1, title: 'React Performance Optimization', date: 'Today, 02:00 PM', instructor: 'Dr. Priya Malhotra', type: 'Live' },
  { id: 2, title: 'Advanced UI Design Patterns', date: 'Tomorrow, 10:00 AM', instructor: 'Meena Iyer', type: 'Webinar' },
  { id: 3, title: 'Data Analysis with Python', date: 'May 12, 03:30 PM', instructor: 'Amit Bose', type: 'Live' },
];

const userActivities = [
  { id: 1, user: 'Aman V.', action: 'completed "Module 4"', time: '2 mins ago', icon: <CircleCheck size={14} />, color: 'var(--success)' },
  { id: 2, user: 'Divya J.', action: 'started "UX Case Study"', time: '15 mins ago', icon: <Play size={14} />, color: 'var(--primary)' },
  { id: 3, user: 'Karan M.', action: 'uploaded "Assignment 2"', time: '1 hour ago', icon: <FileText size={14} />, color: '#8b5cf6' },
  { id: 4, user: 'Neha S.', action: 'joined "Digital Marketing"', time: '3 hours ago', icon: <UserPlus size={14} />, color: '#f59e0b' },
];

const subjectDistribution = [
  { subject: 'Development', A: 120, B: 110, fullMark: 150 },
  { subject: 'Design', A: 98, B: 130, fullMark: 150 },
  { subject: 'Marketing', A: 86, B: 130, fullMark: 150 },
  { subject: 'Business', A: 99, B: 100, fullMark: 150 },
  { subject: 'Art', A: 85, B: 90, fullMark: 150 },
  { subject: 'Science', A: 65, B: 85, fullMark: 150 },
];

const courseActivityStats = [
  { day: 'Mon', engagement: 4000, completion: 2400, active: 2400 },
  { day: 'Tue', engagement: 3000, completion: 1398, active: 2210 },
  { day: 'Wed', engagement: 2000, completion: 9800, active: 2290 },
  { day: 'Thu', engagement: 2780, completion: 3908, active: 2000 },
  { day: 'Fri', engagement: 1890, completion: 4800, active: 2181 },
  { day: 'Sat', engagement: 2390, completion: 3800, active: 2500 },
  { day: 'Sun', engagement: 3490, completion: 4300, active: 2100 },
];

const recentEnrolled = [
  { id: 1, name: 'Cloud Architecture', student: 'Daniel Ray', date: 'May 08, 2026', price: '$120' },
  { id: 2, name: 'Ethical Hacking', student: 'Lisa Wong', date: 'May 07, 2026', price: '$150' },
  { id: 3, name: 'Mobile App Dev', student: 'John Smith', date: 'May 07, 2026', price: '$99' },
];

const StatCard = ({ title, value, change, isPositive, icon: Icon, color, sparkData, onClick }) => (
  <motion.div 
    whileHover={{ y: -8, boxShadow: 'var(--shadow-2xl)' }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    onClick={onClick}
    className="card"
    style={{ 
      padding: '28px', display: 'flex', flexDirection: 'column', gap: '12px', 
      position: 'relative', overflow: 'hidden', border: 'none', cursor: 'pointer',
      background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-body) 100%)',
      boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ 
        width: '48px', height: '48px', borderRadius: '14px', backgroundColor: `${color}20`, color: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 8px 16px -4px ${color}30`
      }}>
        <Icon size={24} />
      </div>
      <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
        <MoreVertical size={18} />
      </button>
    </div>
    <div style={{ marginTop: '8px' }}>
      <h3 style={{ fontSize: '2rem', fontWeight: 900, margin: '4px 0', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{value}</h3>
      <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 700, margin: 0 }}>{title}</p>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.8rem', fontWeight: 800,
        color: isPositive ? 'var(--success)' : 'var(--danger)',
        padding: '3px 8px', borderRadius: '6px', backgroundColor: isPositive ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)'
      }}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}%
      </div>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>vs last month</span>
    </div>
    <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', width: '50%', height: '60px', opacity: 0.6 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sparkData}>
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={3} fillOpacity={0.15} fill={color} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

const LMSDashboard = () => {
  const navigate = useNavigate();

  // Core Visibility Modals States
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState(null);
  
  // High-fidelity Breakdown Modals States
  const [showEnrolledModal, setShowEnrolledModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [showEarningsModal, setShowEarningsModal] = useState(false);

  // Custom simulator / detail modals
  const [showClassroomSim, setShowClassroomSim] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [showStudentGradebook, setShowStudentGradebook] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);
  const [showInvoiceReceipt, setShowInvoiceReceipt] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [showInstructorProfile, setShowInstructorProfile] = useState(false);
  const [activeInstructorCard, setActiveInstructorCard] = useState(null);

  // High-fidelity loader overlay
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [loadingOverlayText, setLoadingOverlayText] = useState('');

  // Classroom Live Chat States
  const [classroomChat, setClassroomChat] = useState([]);
  const [isMicActive, setIsMicActive] = useState(true);
  const [isCamActive, setIsCamActive] = useState(true);

  // Stateful Data Pools
  const [enrolledCount, setEnrolledCount] = useState(500);
  const [studentsCount, setStudentsCount] = useState(3570);
  const [coursesList, setCoursesList] = useState([
    { id: 1, name: 'React Performance Optimization', category: 'Development', students: 1250, instructor: 'Dr. Priya Malhotra' },
    { id: 2, name: 'Advanced UI Design Patterns', category: 'Design', students: 2100, instructor: 'Meena Iyer' },
    { id: 3, name: 'Data Analysis with Python', category: 'Science', students: 600, instructor: 'Amit Bose' },
    { id: 4, name: 'Ethical Hacking Vectors', category: 'Development', students: 850, instructor: 'Prof. Rajesh Kumar' }
  ]);
  const [earningsAmount, setEarningsAmount] = useState(67000);

  // Creation forms states
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Development');
  const [newCourseInstructor, setNewCourseInstructor] = useState('Dr. Priya Malhotra');
  
  const [quickEnrollName, setQuickEnrollName] = useState('');
  const [quickEnrollCourse, setQuickEnrollCourse] = useState('React Performance Optimization');

  // Instructor Memo States
  const [instructorMemo, setInstructorMemo] = useState('');
  const [showMemoComposer, setShowMemoComposer] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    subject: 'All',
    instructor: 'All',
    timeframe: 'Last 30 Days',
  });

  const showToast = (message, type = 'success', title = null) => {
    setToast({ message, type, title });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Plain Text Exporter Utility
  const handleExportText = (content, filename) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Virtual classroom chat simulation ticks
  useEffect(() => {
    let chatInterval;
    if (showClassroomSim) {
      setClassroomChat([
        { sender: 'System Node', text: `Virtual broadcast corridor established. Secured.`, time: '02:00 PM', type: 'system' }
      ]);
      
      const mockMessages = [
        { sender: 'Aman Verma', text: 'Dr. Priya, will the rendering profiling checklist be exported to LMS?' },
        { sender: 'Divya Joshi', text: 'The React 19 compiler optimization speeds are absolutely stunning!' },
        { sender: 'Karan Mehta', text: 'Is it best practice to wrap all expensive vectors inside useMemo?' },
        { sender: 'Neha Sharma', text: 'I completed homework module 3, the live diagnostics makes so much sense now.' },
        { sender: 'Aman Verma', text: 'Can we review code splitting configurations for massive dashboard applications?' },
        { sender: 'Isha Sen', text: 'Excellent citation block on useTransition latency metrics!' }
      ];
      
      let index = 0;
      chatInterval = setInterval(() => {
        if (index < mockMessages.length) {
          setClassroomChat(prev => [
            ...prev,
            { ...mockMessages[index], time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          ]);
          index++;
        } else {
          clearInterval(chatInterval);
        }
      }, 2500);
    } else {
      setClassroomChat([]);
    }
    return () => clearInterval(chatInterval);
  }, [showClassroomSim]);

  // Dynamic Metrics Calculation based on Filters & State variables
  const getMetrics = () => {
    let enrolledCourses = enrolledCount;
    let totalStudents = studentsCount;
    let totalCourses = coursesList.length;
    let totalEarnings = earningsAmount;
    let isEarningsPositive = false;
    let earningsChange = "20.3";
    let enrolledChange = "43.9";
    let studentsChange = "43.9";
    let coursesChange = "43.9";

    // Base subject configurations
    const subjectStats = {
      All: { courses: coursesList.length, enrolled: enrolledCount, students: studentsCount, earnings: earningsAmount },
      Development: { courses: coursesList.filter(c=>c.category==='Development').length, enrolled: Math.round(enrolledCount*0.45), students: Math.round(studentsCount*0.45), earnings: Math.round(earningsAmount*0.45) },
      Design: { courses: coursesList.filter(c=>c.category==='Design').length, enrolled: Math.round(enrolledCount*0.3), students: Math.round(studentsCount*0.3), earnings: Math.round(earningsAmount*0.3) },
      Marketing: { courses: coursesList.filter(c=>c.category==='Marketing').length, enrolled: Math.round(enrolledCount*0.12), students: Math.round(studentsCount*0.12), earnings: Math.round(earningsAmount*0.12) },
      Business: { courses: coursesList.filter(c=>c.category==='Business').length, enrolled: Math.round(enrolledCount*0.08), students: Math.round(studentsCount*0.08), earnings: Math.round(earningsAmount*0.08) },
      Science: { courses: coursesList.filter(c=>c.category==='Science').length, enrolled: Math.round(enrolledCount*0.05), students: Math.round(studentsCount*0.05), earnings: Math.round(earningsAmount*0.05) },
      Art: { courses: coursesList.filter(c=>c.category==='Art').length, enrolled: Math.round(enrolledCount*0.02), students: Math.round(studentsCount*0.02), earnings: Math.round(earningsAmount*0.02) }
    };

    // Base instructor configurations
    const instructorStats = {
      'Dr. Priya Malhotra': { courses: coursesList.filter(c=>c.instructor==='Dr. Priya Malhotra').length, enrolled: Math.round(enrolledCount*0.38), students: 1250, earnings: Math.round(earningsAmount*0.38), subject: 'Development' },
      'Prof. Rajesh Kumar': { courses: coursesList.filter(c=>c.instructor==='Prof. Rajesh Kumar').length, enrolled: Math.round(enrolledCount*0.22), students: 850, earnings: Math.round(earningsAmount*0.22), subject: 'Development' },
      'Meena Iyer': { courses: coursesList.filter(c=>c.instructor==='Meena Iyer').length, enrolled: Math.round(enrolledCount*0.35), students: 2100, earnings: Math.round(earningsAmount*0.35), subject: 'Design' },
      'Amit Bose': { courses: coursesList.filter(c=>c.instructor==='Amit Bose').length, enrolled: Math.round(enrolledCount*0.15), students: 600, earnings: Math.round(earningsAmount*0.15), subject: 'Science' }
    };

    let activeSubject = filters.subject;
    let activeInstructor = filters.instructor;

    if (activeInstructor !== 'All') {
      const instData = instructorStats[activeInstructor];
      if (activeSubject !== 'All' && instData.subject !== activeSubject) {
        return {
          enrolledCourses: "0",
          totalStudents: "0",
          totalCourses: 0,
          totalEarnings: "$0",
          enrolledChange: "0.0",
          studentsChange: "0.0",
          coursesChange: "0.0",
          earningsChange: "0.0",
          isEarningsPositive: true,
          sparklines: {
            enrolled: sparklineData.map(d => ({ ...d, value: 0 })),
            students: sparklineData.map(d => ({ ...d, value: 0 })),
            courses: sparklineData.map(d => ({ ...d, value: 0 })),
            earnings: sparklineData.map(d => ({ ...d, value: 0 })),
          }
        };
      }
      enrolledCourses = instData.enrolled;
      totalStudents = instData.students;
      totalCourses = instData.courses;
      totalEarnings = instData.earnings;
    } else if (activeSubject !== 'All') {
      const subjData = subjectStats[activeSubject];
      enrolledCourses = subjData.enrolled;
      totalStudents = subjData.students;
      totalCourses = subjData.courses;
      totalEarnings = subjData.earnings;
    }

    // Timeframe adjustments
    let timeframeScale = 1.0;
    if (filters.timeframe === 'Today') {
      timeframeScale = 0.03;
      enrolledChange = "1.2";
      studentsChange = "0.8";
      coursesChange = "0.0";
      earningsChange = "4.1";
      isEarningsPositive = true;
    } else if (filters.timeframe === 'Last 7 Days') {
      timeframeScale = 0.22;
      enrolledChange = "8.5";
      studentsChange = "7.2";
      coursesChange = "3.3";
      earningsChange = "6.8";
      isEarningsPositive = true;
    } else if (filters.timeframe === 'Last 30 Days') {
      timeframeScale = 1.0;
      enrolledChange = "43.9";
      studentsChange = "43.9";
      coursesChange = "43.9";
      earningsChange = "20.3";
      isEarningsPositive = false;
    } else if (filters.timeframe === 'This Year') {
      timeframeScale = 8.5;
      enrolledChange = "182.4";
      studentsChange = "145.2";
      coursesChange = "24.8";
      earningsChange = "54.2";
      isEarningsPositive = true;
    } else if (filters.timeframe === 'All Time') {
      timeframeScale = 15.0;
      enrolledChange = "423.8";
      studentsChange = "388.9";
      coursesChange = "120.0";
      earningsChange = "184.5";
      isEarningsPositive = true;
    }

    const displayEarnings = Math.round(totalEarnings * timeframeScale);
    const displayStudents = Math.round(totalStudents * (0.85 + 0.15 * timeframeScale));
    const displayEnrolled = Math.round(enrolledCourses * (0.9 + 0.1 * timeframeScale));

    const getScaledSparkline = (colorBase, scale) => {
      return sparklineData.map((d, idx) => {
        const variation = 1 + 0.15 * Math.sin(idx + (filters.subject !== 'All' ? 2 : 0) + (filters.instructor !== 'All' ? 4 : 0));
        return {
          ...d,
          value: Math.round(d.value * scale * variation * colorBase)
        };
      });
    };

    return {
      enrolledCourses: displayEnrolled.toLocaleString(),
      totalStudents: displayStudents.toLocaleString(),
      totalCourses,
      totalEarnings: `$${displayEarnings.toLocaleString()}`,
      enrolledChange,
      studentsChange,
      coursesChange,
      earningsChange,
      isEarningsPositive,
      sparklines: {
        enrolled: getScaledSparkline(1.0, timeframeScale * 0.8),
        students: getScaledSparkline(0.8, timeframeScale * 0.7),
        courses: getScaledSparkline(1.2, timeframeScale * 0.9),
        earnings: getScaledSparkline(0.5, timeframeScale * 0.6)
      }
    };
  };

  const metrics = getMetrics();

  // Filter Chart: Course Activity Preview
  const getFilteredActivityStats = () => {
    let scale = 1.0;
    if (filters.subject !== 'All') scale *= 0.6;
    if (filters.instructor !== 'All') scale *= 0.45;
    if (filters.timeframe === 'Today') scale *= 0.05;
    else if (filters.timeframe === 'Last 7 Days') scale *= 0.25;
    else if (filters.timeframe === 'This Year') scale *= 6.5;
    else if (filters.timeframe === 'All Time') scale *= 12.0;

    return courseActivityStats.map(stat => ({
      ...stat,
      engagement: Math.round(stat.engagement * scale),
      completion: Math.round(stat.completion * scale),
      active: Math.round(stat.active * scale),
    }));
  };

  // Filter Chart: Subject Matrix
  const getFilteredSubjectDistribution = () => {
    if (filters.subject === 'All') return subjectDistribution;
    return subjectDistribution.map(item => {
      if (item.subject === filters.subject) {
        return { ...item, A: 140, B: 135 }; 
      } else {
        return { ...item, A: Math.round(item.A * 0.25), B: Math.round(item.B * 0.2) }; 
      }
    });
  };

  // Filter Chart: Earnings Area Chart
  const getFilteredEarningsData = () => {
    let scale = 1.0;
    if (filters.subject !== 'All') {
      const subjectScale = { Development: 0.45, Design: 0.3, Marketing: 0.15, Business: 0.08, Science: 0.05, Art: 0.02 };
      scale *= (subjectScale[filters.subject] || 1.0);
    }
    if (filters.instructor !== 'All') {
      const instructorScale = { 'Dr. Priya Malhotra': 0.35, 'Prof. Rajesh Kumar': 0.22, 'Meena Iyer': 0.38, 'Amit Bose': 0.15 };
      scale *= (instructorScale[filters.instructor] || 1.0);
    }
    if (filters.timeframe === 'Today') {
      return [
        { name: '08:00', earnings: Math.round(1200 * scale) },
        { name: '10:00', earnings: Math.round(2800 * scale) },
        { name: '12:00', earnings: Math.round(4100 * scale) },
        { name: '14:00', earnings: Math.round(3500 * scale) },
        { name: '16:00', earnings: Math.round(5200 * scale) },
        { name: '18:00', earnings: Math.round(6100 * scale) },
      ];
    }
    if (filters.timeframe === 'Last 7 Days') {
      return [
        { name: 'Mon', earnings: Math.round(4500 * scale) },
        { name: 'Tue', earnings: Math.round(5200 * scale) },
        { name: 'Wed', earnings: Math.round(4800 * scale) },
        { name: 'Thu', earnings: Math.round(6100 * scale) },
        { name: 'Fri', earnings: Math.round(5500 * scale) },
        { name: 'Sat', earnings: Math.round(6700 * scale) },
        { name: 'Sun', earnings: Math.round(7200 * scale) },
      ];
    }
    return earningsData.map(d => ({
      ...d,
      earnings: Math.round(d.earnings * scale * (filters.timeframe === 'All Time' ? 2.5 : filters.timeframe === 'This Year' ? 1.0 : 0.08))
    }));
  };

  // Filter Upcoming Sessions
  const getFilteredSessions = () => {
    return upcomingSessions.filter(session => {
      if (filters.instructor !== 'All' && session.instructor !== filters.instructor) {
        return false;
      }
      const sessionSubjectMap = {
        'React Performance Optimization': 'Development',
        'Advanced UI Design Patterns': 'Design',
        'Data Analysis with Python': 'Science'
      };
      const sessionSubject = sessionSubjectMap[session.title];
      if (filters.subject !== 'All' && sessionSubject !== filters.subject) {
        return false;
      }
      return true;
    });
  };

  // Filter Recent Enrollments
  const getFilteredEnrollments = () => {
    return recentEnrolled.filter(enrollment => {
      const enrollmentMap = {
        'Cloud Architecture': { subject: 'Development', instructor: 'Dr. Priya Malhotra' },
        'Ethical Hacking': { subject: 'Development', instructor: 'Prof. Rajesh Kumar' },
        'Mobile App Dev': { subject: 'Design', instructor: 'Meena Iyer' }
      };
      const details = enrollmentMap[enrollment.name];
      if (!details) return true;
      if (filters.subject !== 'All' && details.subject !== filters.subject) return false;
      if (filters.instructor !== 'All' && details.instructor !== filters.instructor) return false;
      return true;
    });
  };

  // Filter Top Students
  const getFilteredStudents = () => {
    const studentSubjectMap = {
      'Aman Verma': 'Development',
      'Divya Joshi': 'Design',
      'Karan Mehta': 'Development',
      'Neha Sharma': 'Marketing'
    };
    return topStudents.filter(student => {
      if (filters.subject !== 'All') {
        return studentSubjectMap[student.name] === filters.subject;
      }
      return true;
    });
  };

  // Filter Top Instructors
  const getFilteredInstructors = () => {
    const instructorSubjectMap = {
      'Dr. Priya Malhotra': 'Development',
      'Prof. Rajesh Kumar': 'Development',
      'Meena Iyer': 'Design',
      'Amit Bose': 'Science'
    };
    return instructors.filter(inst => {
      if (filters.instructor !== 'All' && inst.name !== filters.instructor) return false;
      if (filters.subject !== 'All' && instructorSubjectMap[inst.name] !== filters.subject) return false;
      return true;
    });
  };

  // High-fidelity smooth loading page navigation
  const triggerSecureNavigation = (path, label) => {
    setLoadingOverlayText(label);
    setShowLoadingOverlay(true);
    setTimeout(() => {
      setShowLoadingOverlay(false);
      navigate(path);
    }, 850);
  };

  // Quick enroll student form handler
  const handleQuickEnroll = (e) => {
    e.preventDefault();
    if (!quickEnrollName.trim()) {
      showToast('Student name cannot be blank!', 'info');
      return;
    }
    setEnrolledCount(prev => prev + 1);
    setStudentsCount(prev => prev + 1);
    showToast(`Quick Enrolled ${quickEnrollName} into ${quickEnrollCourse} successfully!`, 'success');
    setQuickEnrollName('');
    setShowEnrolledModal(false);
  };

  // Bulk nudging system logs
  const handleBulkNudgeStudents = () => {
    showToast('Compiling list of active students below 85% progress...', 'info');
    setTimeout(() => {
      showToast('Dispatched automated SMS nudge alerts to Kevin Lee and Sophia Chen.', 'success');
      setShowStudentsModal(false);
    }, 1200);
  };

  // Course builder form handler
  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCourseName.trim()) {
      showToast('Course title cannot be blank!', 'info');
      return;
    }
    const newCourseObj = {
      id: Date.now(),
      name: newCourseName,
      category: newCourseCategory,
      students: 0,
      instructor: newCourseInstructor
    };
    setCoursesList(prev => [...prev, newCourseObj]);
    showToast(`Statefully created new course: "${newCourseName}" under ${newCourseCategory}!`, 'success');
    setNewCourseName('');
    setShowCoursesModal(false);
  };

  // Financial Ledger exporter csv download
  const handleExportEarningsCSV = () => {
    let content = `Invoice Reference,Student Registrant,Course Name,Base Price,Tax VAT,Total Value\n`;
    content += `#LMS-ENR-193939-TXN,Daniel Ray,Cloud Architecture,$101.69,$18.31,$120.00\n`;
    content += `#LMS-ENR-293939-TXN,Lisa Wong,Ethical Hacking,$127.12,$22.88,$150.00\n`;
    content += `#LMS-ENR-393939-TXN,John Smith,Mobile App Dev,$83.90,$15.10,$99.00\n`;
    
    handleExportText(content, 'LMS_Earnings_Ledger_Invoice.csv');
    showToast('Earnings financial statement exported successfully!', 'success');
  };

  // Student excellence certificate text file download
  const handleDownloadExcellenceCertificate = (student) => {
    let content = `========================================================================\n`;
    content += `                    EDUPRO ELITE HIGH ACCREDITATION\n`;
    content += `                      CERTIFICATE OF EXCELLENCE\n`;
    content += `========================================================================\n\n`;
    content += `This citation is formally conferred upon:\n\n`;
    content += `                         ${student.name.toUpperCase()}\n\n`;
    content += `For outstanding mathematical logic, deep conceptual analysis, and\n`;
    content += `scholarly completion of courses inside the EduPro LMS Dashboard matrix.\n\n`;
    content += `Key Credentials Metrics:\n`;
    content += `   - Completion Ratio: ${student.progress}%\n`;
    content += `   - Average Performance Grade: ${student.score}\n`;
    content += `   - Auth Node: SECURE-LMS-GRID-2026\n\n`;
    content += `------------------------------------------------------------------------\n`;
    content += `Verification Hash: SHA-256:${Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('')}\n`;
    content += `Signed: Principal Administrator of LMS Registers\n`;
    
    handleExportText(content, `certificate-excellence-${student.name.toLowerCase().replace(" ", "-")}.txt`);
    showToast(`Completion certificate downloaded for ${student.name}!`, 'success');
    setShowStudentGradebook(false);
  };

  // Instructor Memo evaluation log dispatch
  const handleSendInstructorMemo = (instName) => {
    if (!instructorMemo.trim()) {
      showToast('Memo memo draft cannot be empty!', 'info');
      return;
    }
    showToast(`Transmitting memo dispatch to ${instName}'s faculty file...`, 'info');
    setTimeout(() => {
      showToast(`Memo successfully sent to ${instName}. Evaluation memo logged.`, 'success');
      setShowInstructorProfile(false);
      setShowMemoComposer(false);
      setInstructorMemo('');
    }, 1000);
  };

  const handleExport = () => {
    showToast("Generating comprehensive LMS data reports...", "info", "Export CSV");
    const csvContent = [
      ['Metric', 'Value', 'Growth Rate'],
      ['Enrolled Courses', metrics.enrolledCourses, `${metrics.enrolledChange}%`],
      ['Total Students', metrics.totalStudents, `${metrics.studentsChange}%`],
      ['Total Courses', metrics.totalCourses, `${metrics.coursesChange}%`],
      ['Total Earnings', metrics.totalEarnings, `${metrics.earningsChange}%`],
      ['Active Filter Subject', filters.subject],
      ['Active Filter Instructor', filters.instructor],
      ['Timeframe Scope', filters.timeframe],
      ['Export Date', new Date().toLocaleDateString()]
    ].map(e => e.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `LMS_Metrics_Report_${filters.timeframe.replace(" ", "_")}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      showToast("LMS Data ledger exported successfully.", "success", "Download Complete");
    }, 1200);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
      
      {/* Title Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, margin: 0, color: 'var(--text-main)', letterSpacing: '-1px' }}>LMS Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px', fontWeight: 500 }}>
            Statistical analysis of course performance and student engagement.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            className="btn" 
            onClick={() => {
              showToast("Opening Curriculum AI assistant...", "success", "Curriculum AI");
              setTimeout(() => navigate('/dashboard/curriculum-ai'), 600);
            }}
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              border: '1px solid var(--border-color)', 
              color: 'var(--text-main)',
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '10px 20px', 
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={18} style={{ color: 'var(--primary)' }} /> <span style={{ fontWeight: 700 }}>Curriculum AI</span>
          </button>
          <button 
            className="btn" 
            onClick={() => {
              showToast("Toggling LMS filter panel...", "info", "Filters Drawer");
              setShowFilters(!showFilters);
            }}
            style={{ 
              backgroundColor: showFilters || filters.subject !== 'All' || filters.instructor !== 'All' || filters.timeframe !== 'Last 30 Days' ? 'var(--primary-light)' : 'var(--bg-card)', 
              border: `1px solid ${showFilters || filters.subject !== 'All' || filters.instructor !== 'All' || filters.timeframe !== 'Last 30 Days' ? 'var(--primary)' : 'var(--border-color)'}`, 
              color: showFilters || filters.subject !== 'All' || filters.instructor !== 'All' || filters.timeframe !== 'Last 30 Days' ? 'var(--primary)' : 'var(--text-main)',
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '10px 20px', 
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Filter size={18} /> <span style={{ fontWeight: 700 }}>Filter</span>
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleExport}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 24px', borderRadius: '12px', boxShadow: '0 8px 16px -4px rgba(69, 179, 224, 0.4)' }}
          >
            <Download size={18} /> <span style={{ fontWeight: 700 }}>Export Data</span>
          </button>
        </div>
      </div>

      {/* Animated Collapsible Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '24px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              boxShadow: 'var(--shadow-xl)',
              background: 'linear-gradient(145deg, var(--bg-card) 0%, rgba(255,255,255,0.02) 100%)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {/* Subject Selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subject Category</label>
                  <select
                    value={filters.subject}
                    onChange={(e) => {
                      setFilters(prev => ({ ...prev, subject: e.target.value }));
                      showToast(`Subject filter updated: ${e.target.value}`, "info", "Filter Sync");
                    }}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-body)',
                      color: 'var(--text-main)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    {['All', 'Development', 'Design', 'Marketing', 'Business', 'Science', 'Art'].map(subj => (
                      <option key={subj} value={subj}>{subj}</option>
                    ))}
                  </select>
                </div>

                {/* Instructor Selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Instructor</label>
                  <select
                    value={filters.instructor}
                    onChange={(e) => {
                      setFilters(prev => ({ ...prev, instructor: e.target.value }));
                      showToast(`Instructor filter updated: ${e.target.value}`, "info", "Filter Sync");
                    }}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-body)',
                      color: 'var(--text-main)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    {['All', 'Dr. Priya Malhotra', 'Prof. Rajesh Kumar', 'Meena Iyer', 'Amit Bose'].map(inst => (
                      <option key={inst} value={inst}>{inst}</option>
                    ))}
                  </select>
                </div>

                {/* Timeframe Selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Timeframe</label>
                  <select
                    value={filters.timeframe}
                    onChange={(e) => {
                      setFilters(prev => ({ ...prev, timeframe: e.target.value }));
                      showToast(`LMS timeframe updated: ${e.target.value}`, "info", "Filter Sync");
                    }}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-body)',
                      color: 'var(--text-main)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    {['Today', 'Last 7 Days', 'Last 30 Days', 'This Year', 'All Time'].map(tf => (
                      <option key={tf} value={tf}>{tf}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '4px' }}>
                <button
                  onClick={() => {
                    setFilters({ subject: 'All', instructor: 'All', timeframe: 'Last 30 Days' });
                    showToast("Filters reset to default states.", "success", "Filter Reset");
                  }}
                  disabled={filters.subject === 'All' && filters.instructor === 'All' && filters.timeframe === 'Last 30 Days'}
                  style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer', opacity: (filters.subject === 'All' && filters.instructor === 'All' && filters.timeframe === 'Last 30 Days') ? 0.5 : 1 }}
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => {
                    setShowFilters(false);
                    showToast("Active parameters applied successfully.", "success", "Filters Active");
                  }}
                  style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(69, 179, 224, 0.3)' }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Chips */}
      {(filters.subject !== 'All' || filters.instructor !== 'All' || filters.timeframe !== 'Last 30 Days') && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginTop: '-12px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)' }}>Active Filters:</span>
          {filters.subject !== 'All' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
              <span>Subject: {filters.subject}</span>
              <button onClick={() => setFilters(prev => ({ ...prev, subject: 'All' }))} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', padding: 0 }}><X size={14} /></button>
            </div>
          )}
          {filters.instructor !== 'All' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: '1px solid #8b5cf6', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
              <span>Instructor: {filters.instructor}</span>
              <button onClick={() => setFilters(prev => ({ ...prev, instructor: 'All' }))} style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', display: 'flex', padding: 0 }}><X size={14} /></button>
            </div>
          )}
          {filters.timeframe !== 'Last 30 Days' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid #f59e0b', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
              <span>Timeframe: {filters.timeframe}</span>
              <button onClick={() => setFilters(prev => ({ ...prev, timeframe: 'Last 30 Days' }))} style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer', display: 'flex', padding: 0 }}><X size={14} /></button>
            </div>
          )}
          <button onClick={() => setFilters({ subject: 'All', instructor: 'All', timeframe: 'Last 30 Days' })} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', padding: '4px 8px' }}>Clear All</button>
        </div>
      )}

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <StatCard 
          title="Enrolled Courses" 
          value={metrics.enrolledCourses} 
          change={metrics.enrolledChange} 
          isPositive={true} 
          icon={BookOpen} 
          color="var(--primary)" 
          sparkData={metrics.sparklines.enrolled} 
          onClick={() => setShowEnrolledModal(true)}
        />
        <StatCard 
          title="Total Students" 
          value={metrics.totalStudents} 
          change={metrics.studentsChange} 
          isPositive={true} 
          icon={Users} 
          color="#8b5cf6" 
          sparkData={metrics.sparklines.students} 
          onClick={() => setShowStudentsModal(true)}
        />
        <StatCard 
          title="Total Courses" 
          value={metrics.totalCourses.toString()} 
          change={metrics.coursesChange} 
          isPositive={true} 
          icon={GraduationCap} 
          color="#f59e0b" 
          sparkData={metrics.sparklines.courses} 
          onClick={() => setShowCoursesModal(true)}
        />
        <StatCard 
          title="Total Earnings" 
          value={metrics.totalEarnings} 
          change={metrics.earningsChange} 
          isPositive={metrics.isEarningsPositive} 
          icon={DollarSign} 
          color="var(--success)" 
          sparkData={metrics.sparklines.earnings} 
          onClick={() => setShowEarningsModal(true)}
        />
      </div>

      {/* Row 2: Course Activity Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
        <motion.div whileHover={{ y: -5 }} className="card" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>Course Activity Preview</h3>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
               <button 
                 onClick={() => triggerSecureNavigation('/dashboard/reports', 'Establishing secure reports database gateway...')}
                 style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer', marginRight: '8px' }}
               >
                 Full Reports
               </button>
               <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div> Engagement
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></div> Completion
               </div>
            </div>
          </div>
          <div style={{ width: '100%', height: '350px', minWidth: 0, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={getFilteredActivityStats()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--text-muted)', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--text-muted)', fontWeight: 600 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', boxShadow: 'var(--shadow-xl)' }} />
                <Bar 
                  dataKey="engagement" 
                  fill="var(--primary)" 
                  radius={[6, 6, 0, 0]} 
                  barSize={25}
                  cursor="pointer"
                  onClick={(data) => showToast(`Engagement on ${data.day}: ${data.engagement.toLocaleString()} active interactions.`, "info", "Engagement Details")}
                />
                <Line 
                  type="monotone" 
                  dataKey="completion" 
                  stroke="var(--success)" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: 'white', stroke: 'var(--success)', strokeWidth: 2, cursor: 'pointer' }} 
                  activeDot={{ r: 8 }} 
                  cursor="pointer"
                  onClick={(data) => showToast(`Completion rate on ${data.day}: ${data.completion.toLocaleString()} lessons completed successfully.`, "success", "Completion Details")}
                />
                <Area type="monotone" dataKey="active" fill="var(--primary-light)" stroke="none" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="card" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>Subject Matrix</h3>
            </div>
            <button 
              onClick={() => triggerSecureNavigation('/dashboard/performance', 'Initializing predictive AI analytics module...')}
              style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Predictive AI
            </button>
          </div>
          <div style={{ width: '100%', height: '320px', minWidth: 0, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
               <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getFilteredSubjectDistribution()}>
                 <PolarGrid stroke="var(--border-color)" />
                 <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 700 }} />
                 <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                 <Radar 
                   name="Student A" 
                   dataKey="A" 
                   stroke="var(--primary)" 
                   fill="var(--primary)" 
                   fillOpacity={0.4}
                   cursor="pointer"
                   onClick={(data) => showToast(`Development Group A registered score of ${data.payload.A} in ${data.payload.subject}.`, "info", "Radar Group A")}
                 />
                 <Radar 
                   name="Student B" 
                   dataKey="B" 
                   stroke="#f59e0b" 
                   fill="#f59e0b" 
                   fillOpacity={0.4}
                   cursor="pointer"
                   onClick={(data) => showToast(`Development Group B registered score of ${data.payload.B} in ${data.payload.subject}.`, "warning", "Radar Group B")}
                 />
                 <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
               </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Row 3: Upcoming Sessions | Calendar | User Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        <motion.div whileHover={{ y: -5 }} className="card" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>Upcoming Sessions</h3>
            <button 
              onClick={() => triggerSecureNavigation('/dashboard/timetable', 'Syncing institutional timetables rosters...')}
              style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              View Timetable
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {getFilteredSessions().length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, border: '1px dashed var(--border-color)', borderRadius: '20px' }}>
                No sessions match active filter criteria.
              </div>
            ) : (
              getFilteredSessions().map(session => (
                <motion.div 
                  key={session.id} 
                  whileHover={{ scale: 1.02, x: 4 }}
                  style={{ padding: '16px', borderRadius: '20px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', transition: '0.3s' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '4px 12px', borderRadius: '8px' }}>{session.type}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}><Clock size={14} /> {session.date}</div>
                  </div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{session.title}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>with {session.instructor}</p>
                    <button 
                      onClick={() => {
                        setActiveSession(session);
                        setShowClassroomSim(true);
                        showToast(`Launching Virtual Classroom Sim for: "${session.title}"...`, "info");
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: 'none',
                        backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      <Video size={12} /> Join Class
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
        
        <motion.div whileHover={{ y: -5 }} className="card" style={{ padding: '32px', borderRadius: '24px' }}>
          <MiniCalendar />
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="card" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>User Activities</h3>
            <button 
              onClick={() => triggerSecureNavigation('/dashboard/notices', 'Connecting to general announcement bulletin board...')}
              style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Board Notices
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
            {userActivities.map((act, idx) => (
              <motion.div 
                key={act.id} 
                whileHover={{ scale: 1.02, x: 4 }}
                onClick={() => showToast(`Security audit check verified. Activity signed securely: ${act.user} ${act.action} (${act.time})`, 'success', 'Audit Shield')}
                style={{ display: 'flex', gap: '16px', position: 'relative', cursor: 'pointer', padding: '6px', borderRadius: '12px' }}
              >
                {idx !== userActivities.length - 1 && <div style={{ position: 'absolute', left: '23px', top: '36px', bottom: '-18px', width: '2px', backgroundColor: 'var(--border-color)', borderStyle: 'dashed' }}></div>}
                <div style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: `${act.color}20`, color: act.color, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, flexShrink: 0 }}>{act.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>
                    <span style={{ fontWeight: 900, color: 'var(--text-main)' }}>{act.user}</span> {act.action}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{act.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 4: Top Students & Recent Enrollments */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <motion.div whileHover={{ y: -5 }} className="card" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>Top Students</h3>
            <button 
              onClick={() => triggerSecureNavigation('/dashboard/performance', 'Opening academic student grading analysis rosters...')}
              style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Ranking
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
              <thead>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ padding: '0 12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Student</th>
                  <th style={{ padding: '0 12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Performance</th>
                  <th style={{ padding: '0 12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center' }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredStudents().length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                      No students found for this subject filter.
                    </td>
                  </tr>
                ) : (
                  getFilteredStudents().map(student => (
                    <tr 
                      key={student.id} 
                      style={{ cursor: 'pointer' }} 
                      onClick={() => {
                        setActiveStudent(student);
                        setShowStudentGradebook(true);
                      }}
                    >
                      <td style={{ padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '16px 0 0 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                            <img 
                              src={`https://images.unsplash.com/photo-${[
                                '1534528741775-53994a69daeb',
                                '1539571696357-5a69c17a67c6',
                                '1494790108377-be9c29b29330',
                                '1507003211169-0a1dd7228f2d',
                                '1500648767791-00dcc994a43e',
                                '1438761681033-6461ffad8d80',
                                '1544005313-94ddf0286df2',
                                '1517841905240-472988babdf9',
                                '1506794778202-cad84cf45f1d',
                                '1522075469751-3a6694fb2f61',
                                '1524504388940-b1c1722653e1',
                                '1531746020798-e6953c6e8e04'
                              ][(student.id % 12)]}?w=150&h=150&fit=crop`} 
                              alt={student.name} 
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}`;
                              }}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          </div>
                          <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>{student.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px', backgroundColor: 'var(--bg-body)' }}>
                        <div style={{ width: '140px', height: '8px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${student.progress}%` }} style={{ height: '100%', backgroundColor: student.color, borderRadius: '10px' }}></motion.div>
                        </div>
                      </td>
                      <td style={{ padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '0 16px 16px 0', textAlign: 'center' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 900, color: student.color }}>{student.score}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="card" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>Recent Enrollments</h3>
            <button 
              onClick={() => triggerSecureNavigation('/dashboard/courses', 'Initializing active catalog of curriculum courses...')}
              style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              View Courses
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {getFilteredEnrollments().length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, border: '1px dashed var(--border-color)', borderRadius: '20px' }}>
                No recent enrollments match filter requirements.
              </div>
            ) : (
              getFilteredEnrollments().map(course => (
                <motion.div 
                  key={course.id} 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setActiveInvoice(course);
                    setShowInvoiceReceipt(true);
                  }}
                  style={{ padding: '18px', borderRadius: '20px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                     <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><BookOpen size={20} /></div>
                     <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{course.name}</h4>
                      <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Student: <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{course.student}</span></p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary)' }}>{course.price}</span>
                    <p style={{ margin: '4px 0 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{course.date}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Row 5: Top Instructors & Financial Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        <motion.div whileHover={{ y: -5 }} className="card" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>Top Instructors</h3>
            <button 
              onClick={() => triggerSecureNavigation('/dashboard/teachers', 'Syncing credential archives of active faculty...')}
              style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              View All
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {getFilteredInstructors().length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, border: '1px dashed var(--border-color)', borderRadius: '20px' }}>
                No instructors match filter criteria.
              </div>
            ) : (
              getFilteredInstructors().map((inst) => (
                <div 
                  key={inst.id} 
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px', borderRadius: '16px', transition: '0.2s', cursor: 'pointer' }} 
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'} 
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => {
                    setActiveInstructorCard(inst);
                    setShowInstructorProfile(true);
                  }}
                >
                  <div style={{ 
                    width: '50px', height: '50px', borderRadius: '14px', overflow: 'hidden', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)',
                    boxShadow: '0 4px 12px rgba(69, 179, 224, 0.1)'
                  }}>
                    <img 
                      src={`https://images.unsplash.com/photo-${[
                        '1494790108377-be9c29b29330',
                        '1507003211169-0a1dd7228f2d',
                        '1438761681033-6461ffad8d80',
                        '1517841905240-472988babdf9',
                        '1544005313-94ddf0286df2',
                        '1534528741775-53994a69daeb',
                        '1539571696357-5a69c17a67c6',
                        '1500648767791-00dcc994a43e',
                        '1506794778202-cad84cf45f1d',
                        '1522075469751-3a6694fb2f61',
                        '1524504388940-b1c1722653e1',
                        '1531746020798-e6953c6e8e04'
                      ][(inst.id % 12)]}?w=150&h=150&fit=crop`} 
                      alt={inst.name} 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(inst.name)}`;
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{inst.name}</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{inst.courses} Courses • {inst.students} Students</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 800, color: '#f59e0b' }}>
                      <Star size={16} fill="#f59e0b" /> {inst.rating}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="card" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(40, 167, 69, 0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>Financial Performance</h3>
            </div>
            <select 
              value={filters.timeframe}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, timeframe: e.target.value }));
                showToast(`Financial timeframe scope: ${e.target.value}`, "info", "Timeframe Sync");
              }}
              style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 700, cursor: 'pointer', outline: 'none' }}
            >
              <option value="Today">Today</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days (Yearly 2026)</option>
              <option value="This Year">This Year</option>
              <option value="All Time">All Time</option>
            </select>
          </div>
          <div style={{ width: '100%', height: '350px', minWidth: 0, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getFilteredEarningsData()}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--text-muted)', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--text-muted)', fontWeight: 600 }} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-xl)', backgroundColor: 'var(--bg-card)' }} formatter={(v) => [`$${v.toLocaleString()}`, 'Earnings']} />
                <Area type="monotone" dataKey="earnings" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorEarnings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* STAT 1 MODAL: Enrolled Courses Breakdown */}
      <AnimatePresence>
        {showEnrolledModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--bg-card, white)', border: '1px solid var(--border-color)', borderRadius: '32px', padding: '40px', color: 'var(--text-main)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 950, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><BookOpen color="var(--primary)" /> Course Enrollments</h3>
                <button onClick={() => setShowEnrolledModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                {coursesList.map((c) => (
                  <div key={c.id} style={{ padding: '14px 18px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{c.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Category: {c.category}</div>
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--primary)' }}>{c.students} Active</div>
                  </div>
                ))}
              </div>

              {/* Quick Enroll Student Form */}
              <form onSubmit={handleQuickEnroll} style={{ backgroundColor: 'var(--bg-body)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)' }}>QUICK ENROLL NEW STUDENT</div>
                <input 
                  type="text" 
                  placeholder="Enter Student Full Name"
                  value={quickEnrollName}
                  onChange={(e) => setQuickEnrollName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.85rem' }} 
                />
                <select 
                  value={quickEnrollCourse}
                  onChange={(e) => setQuickEnrollCourse(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.85rem' }}
                >
                  {coursesList.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <button type="submit" style={{ padding: '12px', border: 'none', borderRadius: '10px', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer' }}>Register Enrollment</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STAT 2 MODAL: Total Students registry & nudger */}
      <AnimatePresence>
        {showStudentsModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--bg-card, white)', border: '1px solid var(--border-color)', borderRadius: '32px', padding: '40px', color: 'var(--text-main)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 950, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Users color="#8b5cf6" /> Student Roster</h3>
                <button onClick={() => setShowStudentsModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                {topStudents.map((st) => (
                  <div key={st.id} style={{ padding: '14px 18px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: st.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem' }}>{st.avatar}</div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{st.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Global Rating Grade: {st.score}</div>
                      </div>
                    </div>
                    <div style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 800, color: st.progress < 85 ? '#f59e0b' : '#10b981' }}>{st.progress}% Complete</div>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleBulkNudgeStudents}
                style={{ width: '100%', padding: '16px', border: 'none', borderRadius: '14px', backgroundColor: '#8b5cf6', color: 'white', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <ShieldAlert size={16} /> Bulk Nudge Students (&lt;85% Progress)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STAT 3 MODAL: Total Courses creator */}
      <AnimatePresence>
        {showCoursesModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--bg-card, white)', border: '1px solid var(--border-color)', borderRadius: '32px', padding: '40px', color: 'var(--text-main)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 950, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><GraduationCap color="#f59e0b" /> Curriculum Catalog</h3>
                <button onClick={() => setShowCoursesModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                {coursesList.map(c => (
                  <div key={c.id} style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{c.name}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.08)', padding: '4px 10px', borderRadius: '6px' }}>{c.category}</span>
                  </div>
                ))}
              </div>

              {/* Course Builder form */}
              <form onSubmit={handleCreateCourse} style={{ backgroundColor: 'var(--bg-body)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)' }}>ADD NEW COURSE TO CATALOG</div>
                <input 
                  type="text" 
                  placeholder="Enter Course Title"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.85rem' }} 
                />
                <select 
                  value={newCourseCategory}
                  onChange={(e) => setNewCourseCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.85rem' }}
                >
                  {['Development', 'Design', 'Science', 'Marketing', 'Business', 'Art'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select 
                  value={newCourseInstructor}
                  onChange={(e) => setNewCourseInstructor(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.85rem' }}
                >
                  {instructors.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                </select>
                <button type="submit" style={{ padding: '12px', border: 'none', borderRadius: '10px', backgroundColor: '#f59e0b', color: 'black', fontWeight: 950, fontSize: '0.85rem', cursor: 'pointer' }}>Create Course</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STAT 4 MODAL: Total Earnings invoice list */}
      <AnimatePresence>
        {showEarningsModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-card, white)', border: '1px solid var(--border-color)', borderRadius: '32px', padding: '40px', color: 'var(--text-main)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 950, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><DollarSign color="var(--success)" /> LMS Ledger Invoices</h3>
                <button onClick={() => setShowEarningsModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {[
                  { ref: '#LMS-ENR-193939', item: 'Cloud Architecture', student: 'Daniel Ray', val: '$120' },
                  { ref: '#LMS-ENR-293939', item: 'Ethical Hacking', student: 'Lisa Wong', val: '$150' },
                  { ref: '#LMS-ENR-393939', item: 'Mobile App Dev', student: 'John Smith', val: '$99' },
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: '14px 18px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{item.ref}</span>
                      <div style={{ fontWeight: 800, marginTop: '4px' }}>{item.item}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Student: {item.student}</div>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 950, color: 'var(--success)' }}>{item.val}</div>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleExportEarningsCSV}
                style={{ width: '100%', padding: '16px', border: 'none', borderRadius: '14px', backgroundColor: 'var(--success)', color: 'white', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Download size={16} /> Download Earnings Statement (.CSV)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIRTUAL CLASSROOM OVERLAY SIMULATOR */}
      <AnimatePresence>
        {showClassroomSim && activeSession && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', zIndex: 9000, display: 'flex', padding: '40px', gap: '32px' }}>
            
            {/* Left: Video broadcast simulation */}
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Webcam view mockup with spectrum */}
              <div style={{ flex: 1, backgroundColor: '#0f172a', border: '2px solid #334155', borderRadius: '32px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', top: '24px', left: '24px', backgroundColor: 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '6px 16px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white', animation: 'pulse 1s infinite' }} /> LIVE INTERACTIVE BROADCAST
                </div>
                
                <div style={{ position: 'absolute', top: '24px', right: '24px', backgroundColor: 'rgba(0,0,0,0.4)', color: '#94a3b8', padding: '6px 12px', borderRadius: '10px', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  Latency: 14ms | Resolution: 1080p
                </div>

                <div style={{ textAlign: 'center', color: 'white' }}>
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '2px solid #6366f1', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900, margin: '0 auto 24px' }}>
                    {activeSession.instructor.split(" ").slice(-1)[0][0]}
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.8rem', fontWeight: 950 }}>{activeSession.instructor}</h3>
                  <p style={{ margin: 0, color: '#94a3b8', fontWeight: 700 }}>Host & Senior Instructor presenting: "{activeSession.title}"</p>
                  
                  {/* Wave audio active simulation */}
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '32px', height: '40px', alignItems: 'center' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ height: isMicActive ? [10, 40, 10] : 10 }}
                        transition={{ repeat: Infinity, duration: 0.6 + i*0.1, ease: 'easeInOut' }}
                        style={{ width: '6px', backgroundColor: '#6366f1', borderRadius: '3px' }} 
                      />
                    ))}
                  </div>
                </div>

                {/* Webcam overlay controls */}
                <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '16px', zIndex: 9100 }}>
                  <button onClick={() => setIsMicActive(!isMicActive)} style={{ width: '56px', height: '56px', borderRadius: '50%', border: 'none', backgroundColor: isMicActive ? '#334155' : '#ef4444', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AtSign size={20} />
                  </button>
                  <button onClick={() => setIsCamActive(!isCamActive)} style={{ width: '56px', height: '56px', borderRadius: '50%', border: 'none', backgroundColor: isCamActive ? '#334155' : '#ef4444', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Video size={20} />
                  </button>
                  <button onClick={() => { setShowClassroomSim(false); showToast(`Successfully exited virtual classroom session: "${activeSession.title}"`, 'info'); }} style={{ padding: '0 32px', height: '56px', borderRadius: '28px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: 950, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Disconnect & Exit Classroom
                  </button>
                </div>
              </div>

            </div>

            {/* Right: Live Chat & Participants sidebars */}
            <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Online Attendees list */}
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '24px', padding: '24px', color: 'white' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 900, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={16} /> Attending Students (4 Online)</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {topStudents.map(st => (
                    <span key={st.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.05)', fontSize: '0.75rem', fontWeight: 800 }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} /> {st.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Live Chat scrolling logs ticker */}
              <div style={{ flex: 1, backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '32px', padding: '28px', display: 'flex', flexDirection: 'column', color: 'white', overflow: 'hidden' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 900, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}><MessageCircle size={18} color="#6366f1" /> Live Seminar Chat</h4>
                
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '4px' }}>
                  {classroomChat.map((msg, idx) => (
                    <div key={idx} style={{ backgroundColor: msg.type === 'system' ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '16px', border: msg.type === 'system' ? '1px dashed rgba(99, 102, 241, 0.3)' : '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.75rem', fontWeight: 800, color: msg.type === 'system' ? '#818cf8' : '#94a3b8' }}>
                        <span>{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: msg.type === 'system' ? '#cbd5e1' : '#f8fafc', lineHeight: 1.4, fontFamily: msg.type === 'system' ? 'monospace' : 'inherit' }}>{msg.text}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>

      {/* STUDENT GRADEBOOK & ANALYTICS PROFILE MODAL */}
      <AnimatePresence>
        {showStudentGradebook && activeStudent && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--bg-card, white)', border: '1px solid var(--border-color)', borderRadius: '32px', padding: '40px', color: 'var(--text-main)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 900, padding: '4px 12px', borderRadius: '20px', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} /> TOP STUDENT PORTAL</span>
                <button onClick={() => setShowStudentGradebook(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                  <img 
                    src={`https://images.unsplash.com/photo-${[
                      '1534528741775-53994a69daeb',
                      '1539571696357-5a69c17a67c6',
                      '1494790108377-be9c29b29330',
                      '1507003211169-0a1dd7228f2d',
                      '1500648767791-00dcc994a43e',
                      '1438761681033-6461ffad8d80',
                      '1544005313-94ddf0286df2',
                      '1517841905240-472988babdf9',
                      '1506794778202-cad84cf45f1d',
                      '1522075469751-3a6694fb2f61',
                      '1524504388940-b1c1722653e1',
                      '1531746020798-e6953c6e8e04'
                    ][(activeStudent.id % 12)]}?w=150&h=150&fit=crop`} 
                    alt={activeStudent.name} 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(activeStudent.name)}`;
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 950 }}>{activeStudent.name}</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACC-ID: #LMS-STD-2026-00{activeStudent.id}</p>
                </div>
              </div>

              {/* Skills breakdown bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '24px 0', marginBottom: '32px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Academic Aptitude Scores</div>
                {[
                  { skill: 'Conceptual Comprehension', val: 94, color: '#10b981' },
                  { skill: 'Practical Coding Implementation', val: 97, color: 'var(--primary)' },
                  { skill: 'Interface UI/UX Auditing', val: 91, color: '#8b5cf6' },
                  { skill: 'Theoretical Testing Certitude', val: 88, color: '#f59e0b' }
                ].map((sk, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{sk.skill}</span>
                      <span style={{ color: 'var(--text-main)' }}>{sk.val}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-main, #f1f5f9)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${sk.val}%`, height: '100%', backgroundColor: sk.color, borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleDownloadExcellenceCertificate(activeStudent)}
                style={{ width: '100%', padding: '16px', border: 'none', borderRadius: '14px', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 950, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <GraduationCap size={16} /> Issue Certificate of Excellence
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ENROLLMENT INVOICE RECEIPT MODAL */}
      <AnimatePresence>
        {showInvoiceReceipt && activeInvoice && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ width: '100%', maxWidth: '440px', backgroundColor: '#ffffff', borderRadius: '32px', padding: '40px', color: '#0f172a', fontFamily: 'monospace', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}>
              
              {/* Receipt headers */}
              <div style={{ textAlign: 'center', borderBottom: '2px dashed #e2e8f0', paddingBottom: '20px', marginBottom: '24px' }}>
                <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>EDUPRO HIGH CASHIER</h4>
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#64748b' }}>TRANSACTION INVOICE RECEIPT</p>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>{activeInvoice.date} | Ledger Node: v2.0</div>
              </div>

              {/* Receipt parameters body */}
              <div id="printable-lms-invoice" style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Registrant Student:</span>
                  <span style={{ fontWeight: 800 }}>{activeInvoice.student}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Selected Course:</span>
                  <span style={{ fontWeight: 800 }}>{activeInvoice.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Reference Token:</span>
                  <span style={{ fontWeight: 800 }}>#LMS-ENR-{activeInvoice.id}939-TX</span>
                </div>

                <div style={{ borderTop: '1px dashed #e2e8f0', borderBottom: '1px dashed #e2e8f0', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Curriculum Base Price:</span>
                    <span>${(parseFloat(activeInvoice.price.replace('$','')) * 0.85).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Calculated VAT Tax (18%):</span>
                    <span>${(parseFloat(activeInvoice.price.replace('$','')) * 0.15).toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 900, marginTop: '8px' }}>
                  <span>NET TOTAL PRICE:</span>
                  <span>{activeInvoice.price}</span>
                </div>
                
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', marginTop: '24px', lineHeight: 1.4 }}>
                  CRYPTOGRAPHIC BLOCKCHAIN TRANSACTION HASH SECURED:<br/>
                  SHA-256:{Array.from({length: 20}, () => Math.floor(Math.random()*16).toString(16)).join('')}
                </div>
              </div>

              {/* Receipt actions footer */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button 
                  onClick={() => window.print()}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#0f172a', color: '#ffffff', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Printer size={14} /> Print Receipt
                </button>
                <button 
                  onClick={() => { setShowInvoiceReceipt(false); setActiveInvoice(null); }}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: 'transparent', color: '#64748b', fontWeight: 800, cursor: 'pointer' }}
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INSTRUCTOR ROSTER PROFILE DETAILS CARD */}
      <AnimatePresence>
        {showInstructorProfile && activeInstructorCard && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ width: '100%', maxWidth: '460px', backgroundColor: 'var(--bg-card, white)', border: '1px solid var(--border-color)', borderRadius: '32px', padding: '40px', color: 'var(--text-main)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 900, padding: '4px 12px', borderRadius: '20px', backgroundColor: 'rgba(99,102,241,0.1)', color: '#6366f1', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Star size={12} fill="#6366f1" /> FACULTY ACADEMICS</span>
                <button onClick={() => { setShowInstructorProfile(false); setShowMemoComposer(false); setInstructorMemo(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
                <div style={{ 
                  width: '64px', height: '64px', borderRadius: '20px', overflow: 'hidden', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)',
                  boxShadow: '0 4px 12px rgba(69, 179, 224, 0.1)'
                }}>
                  <img 
                    src={`https://images.unsplash.com/photo-${[
                      '1494790108377-be9c29b29330',
                      '1507003211169-0a1dd7228f2d',
                      '1438761681033-6461ffad8d80',
                      '1517841905240-472988babdf9',
                      '1544005313-94ddf0286df2',
                      '1534528741775-53994a69daeb',
                      '1539571696357-5a69c17a67c6',
                      '1500648767791-00dcc994a43e',
                      '1506794778202-cad84cf45f1d',
                      '1522075469751-3a6694fb2f61',
                      '1524504388940-b1c1722653e1',
                      '1531746020798-e6953c6e8e04'
                    ][(activeInstructorCard.id % 12)]}?w=150&h=150&fit=crop`} 
                    alt={activeInstructorCard.name} 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(activeInstructorCard.name)}`;
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 950 }}>{activeInstructorCard.name}</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active unique course titles: {activeInstructorCard.courses}</p>
                </div>
              </div>

              {/* Roster stats parameters */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '20px 0', marginBottom: '32px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Courses</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '4px' }}>{activeInstructorCard.courses}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Students</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>{activeInstructorCard.students}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rating Score</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f59e0b', marginTop: '4px' }}>{activeInstructorCard.rating}</div>
                </div>
              </div>

              {showMemoComposer && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ backgroundColor: 'var(--bg-main, #f8fafc)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '20px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> Schedule Evaluation Check-in</div>
                  <textarea 
                    value={instructorMemo} 
                    onChange={(e) => setInstructorMemo(e.target.value)}
                    style={{ width: '100%', minHeight: '80px', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '12px', fontSize: '0.85rem', outline: 'none', resize: 'vertical', marginBottom: '12px' }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleSendInstructorMemo(activeInstructorCard.name)} style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: '#6366f1', color: 'white', border: 'none', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>Submit Check-in Log</button>
                    <button onClick={() => setShowMemoComposer(false)} style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </motion.div>
              )}

              <button 
                onClick={() => {
                  setInstructorMemo(`Faculty Checklist: Performance evaluation checks scheduled for ${activeInstructorCard.name}. Review curriculum and student scores vector.`);
                  setShowMemoComposer(true);
                }}
                style={{ width: '100%', padding: '16px', border: 'none', borderRadius: '14px', backgroundColor: '#6366f1', color: 'white', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Mail size={16} /> Schedule Evaluation Memo
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Central fullscreen scanning navigation loading gate overlay */}
      <AnimatePresence>
        {showLoadingOverlay && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid rgba(255,255,255,0.05)', borderTopColor: '#6366f1', animation: 'spin 1s linear infinite' }} />
                <Sparkles size={32} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', color: '#6366f1' }} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>Accredited Secure Gateway</h4>
                <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, fontFamily: 'monospace' }}>{loadingOverlayText}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        
        /* Print media cash register receipt isolated style sheet rules */
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-lms-invoice, #printable-lms-invoice * {
            visibility: visible !important;
          }
          #printable-lms-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            color: black !important;
            padding: 20px !important;
            background: white !important;
          }
        }
      ` }} />

    </motion.div>
  );
};

export default LMSDashboard;
