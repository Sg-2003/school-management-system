import React, { useState, useEffect, useRef } from 'react'; // Verified Sidebar V2
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarDays, FileText, 
  CreditCard, Settings, Library, Bus, Megaphone, Clock, User, Brain, X,
  Home, Send, Calendar, Shield, ShieldCheck, LogOut, Activity, ChevronRight, ChevronDown,
  Building, Briefcase, MonitorPlay, Fingerprint, Key,
  List, UserPlus, UserX, Tags, ClipboardCheck, Wallet, TrendingDown, History, Grid, Edit, Plus,
  Layout, Trophy, HelpCircle, Archive, Layers, UserCheck, Book, Award, MapPin, Map, MessageSquare, Mail, Smartphone, MessageCircle, TrendingUp, CircleDollarSign, UserCircle, Coins, Settings2, Folder, Bed, Utensils, Coffee, ChefHat, Zap, Gem, Sparkles, LockKeyhole, ShieldAlert, LogIn, Globe, LayoutGrid, Target, Landmark, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../services/service';

import indianMan1 from '../assets/indian_man_portrait_1.png';
import indianMan2 from '../assets/indian_man_portrait_2.png';
import indianWoman1 from '../assets/indian_woman_portrait_1.png';
import indianWoman2 from '../assets/indian_woman_portrait_2.png';

const eleanorAvatar = indianMan1;
const janeAvatar = indianWoman1;
const robertAvatar = indianMan2;
const studentAvatar = indianWoman2;

const NavItem = ({ item, collapsed, role, isMobile, setMobileOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const hasSubItems = item.subItems && item.subItems.length > 0;
  
  const isSubItemActive = hasSubItems && item.subItems.some(sub => location.pathname === sub.path);
  const isActive = location.pathname === item.path || isSubItemActive;

  if (item.roles && !item.roles.includes(role)) return null;

  return (
    <li>
      {hasSubItems ? (
        <>
          <div 
            onClick={() => !collapsed && setIsOpen(!isOpen)}
            className={`nav-item ${isActive ? 'active-parent' : ''}`}
            style={{ cursor: 'pointer', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </div>
            {!collapsed && (
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={14} />
              </motion.span>
            )}
          </div>
          
          <AnimatePresence>
            {isOpen && !collapsed && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ listStyle: 'none', paddingLeft: '40px', overflow: 'hidden' }}
              >
                {item.subItems.map((sub, index) => (
                  <li key={`sub-${sub.path}-${sub.name}-${index}`}>
                    {sub.onClick ? (
                      <div 
                        onClick={sub.onClick}
                        className="nav-item sub-item"
                        style={{ cursor: 'pointer' }}
                      >
                        {sub.icon && <span style={{ opacity: 0.8, display: 'flex', alignItems: 'center' }}>{sub.icon}</span>}
                        <span style={{ fontSize: '0.9rem' }}>{sub.name}</span>
                      </div>
                    ) : (
                      <NavLink 
                        to={sub.path} 
                        className={({ isActive }) => `nav-item sub-item ${isActive ? 'active' : ''}`}
                        onClick={() => { if (isMobile && setMobileOpen) setMobileOpen(false); }}
                      >
                        {sub.icon && <span style={{ opacity: 0.8, display: 'flex', alignItems: 'center' }}>{sub.icon}</span>}
                        <span style={{ fontSize: '0.9rem' }}>{sub.name}</span>
                      </NavLink>
                    )}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </>
      ) : (
        item.onClick ? (
          <div 
            onClick={item.onClick}
            className="nav-item"
            style={{ cursor: 'pointer' }}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span style={{ flex: 1 }}>{item.name}</span>}
            {!collapsed && <ChevronRight size={14} style={{ opacity: 0.3 }} />}
          </div>
        ) : (
          <NavLink 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={item.path === '/dashboard'}
            onClick={() => { if (isMobile && setMobileOpen) setMobileOpen(false); }}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span style={{ flex: 1 }}>{item.name}</span>}
            {!collapsed && <ChevronRight size={14} style={{ opacity: 0.3 }} />}
          </NavLink>
        )
      )}
    </li>
  );
};

const Sidebar = ({ collapsed, mobileOpen, setMobileOpen, isMobile }) => {
  const getTeacherProfilePic = () => {
    try {
      const stored = localStorage.getItem('teachers');
      if (stored) {
        const list = JSON.parse(stored);
        const record = list.find(t => t.id === 'TCH-001' || t.teacherId === 'TCH-001');
        if (record && record.avatar) return record.avatar;
      }
    } catch (e) {}
    return janeAvatar;
  };

  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const role = localStorage.getItem('userRole') || 'admin';
  const userName = localStorage.getItem('userName') || 'Institutional User';

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuGroups = [
    {
      title: 'Main Menu',
      items: [
        { 
          name: 'Dashboard', 
          icon: <LayoutDashboard size={20} />, 
          roles: ['admin', 'teacher', 'student', 'parent'],
          subItems: [
            { path: '/dashboard', name: 'School', icon: <Building size={16} /> },
            { path: '/dashboard/student', name: 'Student', icon: <User size={16} /> },
            { path: '/dashboard/teacher', name: 'Teacher', icon: <Briefcase size={16} /> },
            { path: '/dashboard/parent', name: 'Parent', icon: <Users size={16} /> },
            { path: '/dashboard/lms', name: 'LMS', icon: <MonitorPlay size={16} /> }
          ]
        },
        { 
          name: 'Administration', 
          icon: <Shield size={20} />, 
          roles: ['admin'],
          subItems: [
            { path: '/dashboard/settings', name: 'System Settings', icon: <Settings size={16} /> },
            { path: '/dashboard/notices', name: 'Global Notices', icon: <Megaphone size={16} /> }
          ]
        },
        { 
          name: 'Reports', 
          icon: <FileText size={20} />, 
          roles: ['admin'],
          subItems: [
            { path: '/dashboard/reports', name: 'Reports Hub', icon: <LayoutGrid size={16} /> },
            { path: '/dashboard/reports/academic', name: 'Academic Reports', icon: <GraduationCap size={16} /> },
            { path: '/dashboard/reports/financial', name: 'Financial Reports', icon: <Landmark size={16} /> },
            { path: '/dashboard/reports/attendance', name: 'Attendance Reports', icon: <Clock size={16} /> },
            { path: '/dashboard/reports/inventory', name: 'Asset Reports', icon: <Package size={16} /> },
            { path: '/dashboard/reports/transport', name: 'Transport Reports', icon: <Bus size={16} /> },
            { path: '/dashboard/reports/hostel', name: 'Hostel Reports', icon: <Bed size={16} /> }
          ]
        },
        { 
          name: 'Assign Roles', 
          icon: <ShieldCheck size={20} />, 
          roles: ['admin'],
          subItems: [
            { path: '/dashboard/admin-tiers', name: 'Admin Tiers', icon: <Shield size={14} /> },
            { path: '/dashboard/assign-role-teacher', name: 'Faculty Access', icon: <GraduationCap size={14} /> },
            { path: '/dashboard/assign-role-staff', name: 'Staff Permissions', icon: <Briefcase size={14} /> },
            { path: '/dashboard/assign-role-student', name: 'Student Roles', icon: <Users size={14} /> }
          ]
        },
        { 
          name: 'Security & Audit', 
          icon: <LockKeyhole size={20} />, 
          roles: ['admin'],
          subItems: [
            { path: '/dashboard/users', name: 'User Directory', icon: <Users size={16} /> },
            { path: '/dashboard/permissions', name: 'Permissions Logic', icon: <Key size={16} /> },
            { path: '/dashboard/security-logs', name: 'Access Audit', icon: <History size={16} /> }
          ]
        },
      ]
    },
    {
      title: 'Academic',
      items: [
        { 
          name: 'Students', 
          icon: <Users size={20} />, 
          roles: ['admin', 'teacher'],
          subItems: [
            { path: '/dashboard/students', name: 'Student List', icon: <List size={14} /> },
            { path: '/dashboard/student-details/ADM-2026-004', name: 'Student Profile', icon: <GraduationCap size={14} /> },
            { path: '/dashboard/add-student', name: 'Add Student', icon: <UserPlus size={14} /> },
            { path: '/dashboard/suspended-students', name: 'Suspended Students', icon: <UserX size={14} /> },
            { path: '/dashboard/student-categories', name: 'Student Categories', icon: <Tags size={14} /> },
            { path: '/dashboard/id-cards', name: 'ID Cards Generation', icon: <CreditCard size={14} /> }
          ]
        },
        {
          name: 'Guardians',
          icon: <Users size={20} />,
          roles: ['admin'],
          subItems: [
            { path: '/dashboard/guardians', name: 'Guardian List', icon: <List size={14} /> },
            { path: '/dashboard/guardian-details/GDN-2026-001', name: 'Guardian Profile', icon: <Users size={14} /> },
            { path: '/dashboard/edit-guardian/GDN-2026-001', name: 'Edit Guardian', icon: <Edit size={14} /> },
            { path: '/dashboard/add-guardian', name: 'Add Guardian', icon: <UserPlus size={14} /> }
          ]
        },
        { 
          name: 'Teachers', 
          icon: <GraduationCap size={20} />, 
          roles: ['admin'],
          subItems: [
            { path: '/dashboard/teachers', name: 'Faculty List', icon: <List size={14} /> },
            { path: '/dashboard/teacher-info', name: 'Teacher Hub', icon: <Grid size={14} /> },
            { path: '/dashboard/teacher-details/TCH-2026-001', name: 'Teacher Profile', icon: <User size={14} /> },
            { path: '/dashboard/teacher-timetable/TCH-2026-001', name: 'Teacher Timetable', icon: <Clock size={14} /> },
            { path: '/dashboard/edit-teacher/TCH-2026-001', name: 'Edit Teacher', icon: <Edit size={14} /> },
            { path: '/dashboard/add-teacher', name: 'Add Teacher', icon: <UserPlus size={14} /> },
            { path: '/dashboard/teacher-attendance', name: 'Teacher Attendance', icon: <ClipboardCheck size={14} /> }
          ]
        },
        { 
          name: 'Attendance', 
          icon: <CalendarDays size={20} />, 
          roles: ['admin', 'teacher', 'student'],
          subItems: [
            { path: '/dashboard/student-attendance', name: 'Student Attendance', icon: <Users size={14} /> },
            { path: '/dashboard/teacher-attendance', name: 'Teacher Attendance', icon: <GraduationCap size={14} /> },
            { path: '/dashboard/employee-attendance', name: 'Employee Attendance', icon: <Briefcase size={14} /> }
          ]
        },
        { 
          name: 'LMS Portal', 
          icon: <BookOpen size={20} />, 
          roles: ['admin', 'teacher', 'student'],
          subItems: [
            { path: '/dashboard/learning', name: 'Learning Analytics', icon: <Activity size={14} /> },
            { path: '/dashboard/courses', name: 'Course Management', icon: <Layout size={14} /> },
            { path: '/dashboard/assignments', name: 'Assignments', icon: <FileText size={14} /> },
            { path: '/dashboard/quiz-center', name: 'Quiz Center', icon: <HelpCircle size={14} /> },
            { path: '/dashboard/e-library', name: 'Digital Library', icon: <Archive size={14} /> }
          ]
        },
        { 
          name: 'Examination', 
          icon: <FileText size={20} />, 
          roles: ['admin', 'teacher', 'student'],
          subItems: [
            { path: '/dashboard/exams', name: 'Exam Overview', icon: <Layout size={14} /> },
            { path: '/dashboard/exam-schedule', name: 'Exam Schedule', icon: <Calendar size={14} /> },
            { path: '/dashboard/exam-result', name: 'Exam Results', icon: <Trophy size={14} /> }
          ]
        },
        { 
          name: 'Classes', 
          icon: <Grid size={20} />, 
          roles: ['admin', 'teacher'],
          subItems: [
            { path: '/dashboard/classes', name: 'Class List', icon: <List size={14} /> },
            { path: '/dashboard/sections', name: 'Sections', icon: <Layers size={14} /> },
            { path: '/dashboard/subjects', name: 'Subjects', icon: <BookOpen size={14} /> },
            { path: '/dashboard/classrooms', name: 'Classrooms', icon: <Building size={14} /> }
          ]
        },
        { 
          name: 'Certification', 
          icon: <Award size={20} />, 
          roles: ['admin', 'teacher'],
          subItems: [
            { path: '/dashboard/certificates', name: 'Generate Certificate', icon: <FileText size={14} /> },
            { path: '/dashboard/id-cards', name: 'Student ID Cards', icon: <CreditCard size={14} /> }
          ]
        },
      ]
    },
    {
      title: 'Human Resource (HRM)',
      items: [
        { 
          name: 'Employee Management', 
          icon: <UserCircle size={20} />, 
          roles: ['admin'],
          subItems: [
            { path: '/dashboard/employees', name: 'Employee List', icon: <List size={14} /> },
            { path: '/dashboard/employee-details/EMP-001', name: 'Employee Details', icon: <User size={14} /> },
            { path: '/dashboard/add-employee', name: 'Add New Employee', icon: <UserPlus size={14} /> },
            { path: '/dashboard/staff-documents', name: 'Document Repository', icon: <Folder size={14} /> }
          ]
        },
        { 
          name: 'Staff Payroll', 
          icon: <Coins size={20} />, 
          roles: ['admin'],
          subItems: [
            { path: '/dashboard/payroll', name: 'Payroll Ledger', icon: <Wallet size={14} /> },
            { path: '/dashboard/payroll-generate', name: 'Generate Payroll', icon: <Settings2 size={14} /> }
          ]
        },
        { 
          name: 'Organizational', 
          icon: <Briefcase size={20} />, 
          roles: ['admin'],
          subItems: [
            { path: '/dashboard/designations', name: 'Designations', icon: <Award size={14} /> },
            { path: '/dashboard/departments', name: 'Departments', icon: <Building size={14} /> }
          ]
        },
      ]
    },
    {
      title: 'Logistics & Finance',
      items: [
        { 
          name: 'Finance Hub', 
          icon: <CreditCard size={20} />, 
          roles: ['admin', 'student', 'parent'],
          subItems: [
            { path: '/dashboard/fees', name: 'Fees Dashboard', icon: <Grid size={14} /> },
            { path: '/dashboard/fees-collection', name: 'Fees Collection', icon: <Wallet size={14} /> },
            { path: '/dashboard/fees-record', name: 'Fees Record', icon: <History size={14} /> },
            { path: '/dashboard/expenses', name: 'School Expenses', icon: <TrendingDown size={14} /> }
          ]
        },
        { 
          name: 'Accounts', 
          icon: <CircleDollarSign size={20} />, 
          roles: ['admin'],
          subItems: [
            { path: '/dashboard/income-head', name: 'Income Head', icon: <Grid size={14} /> },
            { path: '/dashboard/income-list', name: 'Income List', icon: <TrendingUp size={14} /> },
            { path: '/dashboard/expense-head', name: 'Expense Head', icon: <Grid size={14} /> },
            { path: '/dashboard/expense-list', name: 'Expense List', icon: <TrendingDown size={14} /> },
            { path: '/dashboard/transactions', name: 'Transactions', icon: <History size={14} /> }
          ]
        },
        { 
          name: 'Library', 
          icon: <Library size={20} />, 
          roles: ['admin', 'teacher'],
          subItems: [
            { path: '/dashboard/library', name: 'Book List', icon: <Book size={14} /> },
            { path: '/dashboard/library-members', name: 'Member List', icon: <Users size={14} /> },
            { path: '/dashboard/library-member-details/LIB-001', name: 'Member Details', icon: <User size={14} /> },
            { path: '/dashboard/issue-return', name: 'Issue / Return', icon: <History size={14} /> }
          ]
        },
        { 
          name: 'Transport', 
          icon: <Bus size={20} />, 
          roles: ['admin', 'teacher', 'student'],
          subItems: [
            { path: '/dashboard/transport', name: 'Fleet Overview', icon: <Grid size={14} /> },
            { path: '/dashboard/route-list', name: 'Route List', icon: <MapPin size={14} /> },
            { path: '/dashboard/transport-vehicles', name: 'Vehicle List', icon: <Bus size={14} /> },
            { path: '/dashboard/transport-drivers', name: 'Driver List', icon: <User size={14} /> },
            { path: '/dashboard/transportation', name: 'Transportation', icon: <Map size={14} /> }
          ]
        },
        { 
          name: 'Leave Management', 
          icon: <Clock size={20} />, 
          roles: ['admin', 'teacher', 'student'],
          subItems: [
            { path: '/dashboard/leave-types', name: 'Leave Types', icon: <Tags size={14} /> },
            { path: '/dashboard/leave-request', name: 'Leave Request', icon: <Send size={14} /> },
            { path: '/dashboard/leave-approved', name: 'Leave Approved', icon: <UserCheck size={14} /> }
          ]
        },
        { 
          name: 'Hostel Management', 
          icon: <Bed size={20} />, 
          roles: ['admin', 'student'],
          subItems: [
            { path: '/dashboard/hostel', name: 'Hostel List', icon: <Building size={14} /> },
            { path: '/dashboard/hostel-rooms', name: 'Manage Rooms', icon: <Grid size={14} /> },
            { path: '/dashboard/hostel-room-types', name: 'Room Categories', icon: <Tags size={14} /> },
            { path: '/dashboard/hostel-allotment', name: 'Student Allotment', icon: <UserPlus size={14} /> }
          ]
        },
        { 
          name: 'Mess Management', 
          icon: <Utensils size={20} />, 
          roles: ['admin', 'student'],
          subItems: [
            { path: '/dashboard/mess-overview', name: 'Dining Overview', icon: <Coffee size={14} /> },
            { path: '/dashboard/mess-menu', name: 'Menu Planning', icon: <ChefHat size={14} /> },
            { path: '/dashboard/mess-attendance', name: 'Meal Attendance', icon: <ClipboardCheck size={14} /> },
            { path: '/dashboard/mess-subscriptions', name: 'Subscriptions', icon: <CreditCard size={14} /> }
          ]
        },
      ]
    },
    {
      title: 'Communication',
      items: [
        { 
          name: 'Notice Board', 
          icon: <Megaphone size={20} />, 
          roles: ['admin', 'teacher', 'student'],
          subItems: [
            { path: '/dashboard/notices', name: 'All Notices', icon: <List size={14} /> },
            { path: '/dashboard/add-notice', name: 'Post Notice', icon: <Send size={14} /> }
          ]
        },
        { 
          name: 'Messaging Hub', 
          icon: <MessageSquare size={20} />, 
          roles: ['admin', 'teacher'],
          subItems: [
            { path: '/dashboard/messaging', name: 'Inbox', icon: <Mail size={14} /> },
            { path: '/dashboard/bulk-sms', name: 'Bulk SMS', icon: <Smartphone size={14} /> },
            { path: '/dashboard/chat', name: 'Instant Chat', icon: <MessageCircle size={14} /> }
          ]
        },
        { 
          name: 'Event Management', 
          icon: <Calendar size={20} />, 
          roles: ['admin', 'teacher', 'student'],
          subItems: [
            { path: '/dashboard/events', name: 'Event List', icon: <List size={14} /> },
            { path: '/dashboard/event-calendar', name: 'Calendar View', icon: <Calendar size={14} /> },
            { path: '/dashboard/add-event', name: 'Create Event', icon: <Plus size={14} /> }
          ]
        },
      ]
    },
    {
      title: 'Platform Management',
      items: [
        { 
          name: 'Plan & Subscription', 
          icon: <Zap size={20} />, 
          roles: ['admin'],
          subItems: [
            { path: '/dashboard/pricing', name: 'Subscription Plan', icon: <Gem size={14} /> },
            { path: '/dashboard/billing', name: 'Billing History', icon: <CreditCard size={14} /> },
            { path: '/dashboard/upgrade', name: 'Premium Upgrades', icon: <Sparkles size={14} /> }
          ]
        },
      ]
    },
    {
      title: 'Configuration',
      items: [
        { 
          name: 'Institutional Settings', 
          icon: <Settings2 size={20} />, 
          roles: ['admin'],
          subItems: [
            { path: '/dashboard/settings', name: 'General Settings', icon: <Building size={14} /> },
            { path: '/dashboard/academic-settings', name: 'Academic Setup', icon: <GraduationCap size={14} /> },
            { path: '/dashboard/payment-settings', name: 'Payment Gateways', icon: <CreditCard size={14} /> },
            { path: '/dashboard/sms-settings', name: 'SMS & Email API', icon: <Mail size={14} /> },
            { path: '/dashboard/localization', name: 'Regional Settings', icon: <Globe size={14} /> }
          ]
        },
      ]
    },
    {
      title: 'Neural Intelligence',
      items: [
        { 
          name: 'Performance AI', 
          icon: <Brain size={20} />, 
          roles: ['admin', 'teacher', 'student'],
          subItems: [
            { path: '/dashboard/ai-hub', name: 'Neural Hub', icon: <Grid size={14} /> },
            { path: '/dashboard/performance', name: 'Performance Intelligence', icon: <Target size={14} /> },
            { path: '/dashboard/student-analytics', name: 'Student Analytics', icon: <Activity size={14} /> },
            { path: '/dashboard/faculty-ai', name: 'Faculty Excellence', icon: <GraduationCap size={14} /> },
            { path: '/dashboard/efficiency-ai', name: 'Neural Efficiency', icon: <Zap size={14} /> },
            { path: '/dashboard/financial-ai', name: 'Fiscal Intelligence', icon: <Landmark size={14} /> },
            { path: '/dashboard/admissions-ai', name: 'Enrollment AI', icon: <UserPlus size={14} /> },
            { path: '/dashboard/curriculum-ai', name: 'Curriculum Efficacy', icon: <BookOpen size={14} /> },
            { path: '/dashboard/asset-ai', name: 'Infrastructure AI', icon: <Settings size={14} /> },
            { path: '/dashboard/security-ai', name: 'Security Overwatch', icon: <ShieldCheck size={14} /> }
          ]
        },
        { path: '/dashboard/reports', name: 'Advanced Reports', icon: <Activity size={20} />, roles: ['admin'] },
      ]
    },
    {
      title: 'Access Portals',
      items: [
        { 
          name: 'Login Portal', 
          icon: <Key size={20} />, 
          roles: ['admin', 'teacher', 'student'],
          path: '/login-portal'
        },
        { 
          name: 'Staff Registration', 
          icon: <UserPlus size={20} />, 
          roles: ['admin'],
          path: '/dashboard/staff-registration'
        }
      ]
    }
  ];

  return (
    <aside className={`sidebar ${collapsed && !isMobile ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header" style={{ padding: collapsed && !isMobile ? '0' : '0 24px', justifyContent: collapsed && !isMobile ? 'center' : 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: collapsed && !isMobile ? '0' : '12px', justifyContent: collapsed && !isMobile ? 'center' : 'flex-start' }}>
          <div style={{ padding: '8px', backgroundColor: 'var(--primary)', borderRadius: '10px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <GraduationCap size={24} />
          </div>
          {(!collapsed || isMobile) && <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>EduPro <small style={{ color: 'var(--primary)', fontSize: '0.6rem' }}>ELITE</small></span>}
        </div>
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        )}
      </div>
      
      <div className="sidebar-nav">
        {(!collapsed || isMobile) && (
          <div 
            ref={profileRef}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{ 
              padding: '20px', backgroundColor: 'var(--primary-light)', 
              borderRadius: '16px', marginBottom: '24px', border: '1px solid var(--primary-light)',
              position: 'relative', cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, overflow: 'hidden' }}>
                {role === 'admin' ? (
                  <img 
                    src={eleanorAvatar} 
                    alt={userName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : role === 'teacher' ? (
                  <img 
                    src={getTeacherProfilePic()} 
                    alt={userName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : role === 'parent' ? (
                  <img 
                    src={robertAvatar} 
                    alt={userName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : role === 'student' ? (
                  <img 
                    src={studentAvatar} 
                    alt={userName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  userName.charAt(0)
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.9rem', margin: 0, fontWeight: 800 }}>{userName}</h4>
                <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>{role}</p>
              </div>
              <ChevronDown size={14} className="text-muted" style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
            </div>

            {/* Sidebar Profile Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{ 
                    position: 'absolute', top: '105%', left: 0, right: 0, 
                    backgroundColor: 'var(--bg-card)', borderRadius: '12px', 
                    boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)',
                    padding: '8px', zIndex: 1100
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div 
                    onClick={() => { 
                      const path = role === 'admin' ? '/dashboard/admin-profile' : 
                                   (role === 'teacher' ? '/dashboard/teacher-details/TCH-001' : 
                                   (role === 'parent' ? '/dashboard/guardian-details/GDN-2026-001' : '/dashboard/student-details/1'));
                      navigate(path); 
                      setIsProfileOpen(false); 
                    }}
                    className="dropdown-item" 
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}
                  >
                    <User size={16} color="var(--primary)" /> Profile
                  </div>
                  <div 
                    onClick={() => { navigate('/dashboard/settings'); setIsProfileOpen(false); }}
                    className="dropdown-item" 
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}
                  >
                    <Settings size={16} color="#f59e0b" /> Settings
                  </div>
                  <div 
                    onClick={() => { logout(); navigate('/login', { state: { showLogoutToast: true } }); }}
                    className="dropdown-item" 
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--danger)', cursor: 'pointer' }}
                  >
                    <LogOut size={16} /> Logout
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {menuGroups.map((group, idx) => (
          <div key={`group-${idx}-${group.title}`}>
            {(!collapsed || isMobile) && <div className="nav-group-title">{group.title}</div>}
            <ul style={{ listStyle: 'none' }}>
              {group.items.map((item, i) => (
                <NavItem key={`item-${i}-${item.name}`} item={item} collapsed={collapsed && !isMobile} role={role} isMobile={isMobile} setMobileOpen={setMobileOpen} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          onClick={() => { logout(); navigate('/login', { state: { showLogoutToast: true } }); }}
          className="nav-item" 
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--danger)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <span className="nav-icon"><LogOut size={20} /></span>
          {(!collapsed || isMobile) && <span style={{ fontWeight: 800 }}>Logout Session</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
