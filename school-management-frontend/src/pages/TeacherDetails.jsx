import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, GraduationCap, MapPin, Phone, Mail, Calendar, 
  Award, BookOpen, Clock, Shield, ArrowLeft, 
  Download, Printer, Edit, MoreVertical, 
  Building2, Heart, Landmark, ChevronRight, 
  Library as LibraryIcon, Home, Activity, Star, Users, 
  FileText, Briefcase, BadgeCheck, Zap,
  Globe, MessageCircle, Share2, Link,
  CircleCheck, CircleX, CalendarDays,
  CheckCircle2, XCircle, AlertCircle,
  Wallet, TrendingUp, CreditCard, Receipt,
  Book, BookMarked, History, Search, Filter,
  Settings, Save, PieChart, Camera
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import indianMan1 from '../assets/indian_man_portrait_1.png';
import indianMan2 from '../assets/indian_man_portrait_2.png';
import indianWoman1 from '../assets/indian_woman_portrait_1.png';
import indianWoman2 from '../assets/indian_woman_portrait_2.png';

const TeacherDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('biography');
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interactive elements states
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showPaySlipModal, setShowPaySlipModal] = useState(false);
  const [showLibraryHistoryModal, setShowLibraryHistoryModal] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [librarySearch, setLibrarySearch] = useState('');
  
  // Leave Form states
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveError, setLeaveError] = useState('');

  // Toast feedback state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const updateTeacherInStorage = (updatedTeacher) => {
    const stored = localStorage.getItem('teachers');
    let list = [];
    if (stored) {
      list = JSON.parse(stored);
    }
    
    const index = list.findIndex(t => t.id === updatedTeacher.id);
    if (index !== -1) {
      list[index] = updatedTeacher;
    } else {
      list.push(updatedTeacher);
    }
    
    localStorage.setItem('teachers', JSON.stringify(list));
    setTeacher(updatedTeacher);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedTeacher = {
          ...teacher,
          avatar: reader.result,
          img: reader.result
        };
        updateTeacherInStorage(updatedTeacher);
        showToast("Profile picture successfully updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRenewBook = (bookId) => {
    if (!teacher || !teacher.borrowedBooks) return;
    const updatedBooks = teacher.borrowedBooks.map(b => {
      if (b.id === bookId) {
        const currentDue = new Date(b.due);
        const newDue = new Date(currentDue.setDate(currentDue.getDate() + 14));
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const day = newDue.getDate();
        const month = monthNames[newDue.getMonth()];
        const year = newDue.getFullYear();
        return {
          ...b,
          due: `${day} ${month} ${year}`
        };
      }
      return b;
    });

    const updatedTeacher = {
      ...teacher,
      borrowedBooks: updatedBooks
    };
    
    updateTeacherInStorage(updatedTeacher);
    showToast(`Book successfully renewed! The new due date is advanced by 14 days.`);
  };

  const handleApplyLeaveSubmit = (e) => {
    e.preventDefault();
    setLeaveError('');

    if (!startDate || !endDate) {
      setLeaveError('Please select both start and end dates.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      setLeaveError('End date cannot be earlier than start date.');
      return;
    }

    const diffTime = Math.abs(end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const category = teacher.leaveBalance.find(item => item.type === leaveType);
    if (!category) {
      setLeaveError('Invalid leave type selected.');
      return;
    }

    if (category.remaining < days) {
      setLeaveError(`Insufficient balance! You requested ${days} days, but you only have ${category.remaining} days remaining for ${leaveType}.`);
      return;
    }

    const updatedLeaveBalance = teacher.leaveBalance.map(item => {
      if (item.type === leaveType) {
        return {
          ...item,
          used: item.used + days,
          remaining: item.remaining - days
        };
      }
      return item;
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formatDateText = (d) => {
      const dateObj = new Date(d);
      return `${dateObj.getDate()} ${monthNames[dateObj.getMonth()]}`;
    };

    const newLeave = {
      type: leaveType,
      duration: `${formatDateText(startDate)} - ${formatDateText(endDate)}`,
      reason: leaveReason,
      status: 'Approved',
      color: category.color || '#10B981'
    };

    const updatedTeacher = {
      ...teacher,
      leaveBalance: updatedLeaveBalance,
      leavesList: [newLeave, ...teacher.leavesList]
    };

    updateTeacherInStorage(updatedTeacher);
    setShowLeaveModal(false);
    showToast(`Leave application for ${days} days was successfully processed and approved.`);
  };

  // Fallback High-Fidelity Mock List
  const defaultTeachers = [
    { 
      id: 'AD52365', 
      teacherId: 'AD52365',
      name: 'Aarav Sharma', 
      fullName: 'Aarav Sharma', 
      subject: 'Mathematics', 
      class: '1(A), 2(A), 3(A)', 
      email: 'aarav.sharma@edupro.com', 
      phone: '+91 98765 43232', 
      joinDate: '2024-01-12', 
      status: 'Active', 
      avatar: indianMan1, 
      color: '#4880FF',
      designation: 'Senior Mathematics Instructor',
      dept: 'Science & Research',
      rating: 4.9,
      contractType: 'Permanent',
      shift: 'Day Shift',
      gender: 'Male',
      dob: '1985-05-12',
      maritalStatus: 'Married',
      fatherName: 'Om Prakash Sharma',
      motherName: 'Kalyani Sharma',
      experience: '12 Years',
      qualification: 'Ph.D. in Mathematics',
      currentAddress: 'Block C, Sector 62, Noida, UP',
      permanentAddress: 'Block C, Sector 62, Noida, UP',
      details: 'Dedicated mathematics educator with over a decade of experience in teaching theoretical and applied mathematical concepts.',
      bloodGroup: 'A+', height: '175', weight: '72', bankAccount: '98765432101', bankName: 'State Bank of India', ifscCode: 'SBIN0001234', nationalId: 'AADH-52365', prevSchoolName: 'Delhi Public School', prevSchoolAddress: 'New Delhi, India', facebook: 'https://facebook.com/aarav', linkedin: 'https://linkedin.com/in/aarav'
    },
    { 
      id: 'AD52366', 
      teacherId: 'AD52366',
      name: 'Rajesh Kumar', 
      fullName: 'Rajesh Kumar', 
      subject: 'Physics', 
      class: '4(B), 5(A)', 
      email: 'rajesh.k@edupro.com', 
      phone: '+91 98765 43233', 
      joinDate: '2024-02-15', 
      status: 'Active', 
      avatar: indianMan2, 
      color: '#10B981',
      designation: 'Physics Lecturer',
      dept: 'Science & Research',
      rating: 4.8,
      contractType: 'Permanent',
      shift: 'Day Shift',
      gender: 'Male',
      dob: '1988-08-20',
      maritalStatus: 'Married',
      fatherName: 'Vijay Kumar',
      motherName: 'Saraswati Kumar',
      experience: '8 Years',
      qualification: 'M.Sc. in Physics',
      currentAddress: 'Preet Vihar, New Delhi',
      permanentAddress: 'Preet Vihar, New Delhi',
      details: 'Enthusiastic physics teacher specializing in thermodynamics and electromagnetism experiments.',
      bloodGroup: 'B+', height: '178', weight: '75', bankAccount: '98765432102', bankName: 'HDFC Bank', ifscCode: 'HDFC0000123', nationalId: 'AADH-52366', prevSchoolName: 'Kendriya Vidyalaya', prevSchoolAddress: 'New Delhi, India', facebook: 'https://facebook.com/rajesh', linkedin: 'https://linkedin.com/in/rajesh'
    },
    { 
      id: 'AD52367', 
      teacherId: 'AD52367',
      name: 'Priya Patel', 
      fullName: 'Priya Patel', 
      subject: 'English', 
      class: '10(A), 11(A)', 
      email: 'priya.p@edupro.com', 
      phone: '+91 98765 43234', 
      joinDate: '2024-03-20', 
      status: 'Inactive', 
      avatar: indianWoman1, 
      color: '#F59E0B',
      designation: 'Head of English Dept.',
      dept: 'Humanities & Languages',
      rating: 4.7,
      contractType: 'Permanent',
      shift: 'Day Shift',
      gender: 'Female',
      dob: '1982-11-04',
      maritalStatus: 'Married',
      fatherName: 'Dinesh Patel',
      motherName: 'Leela Patel',
      experience: '15 Years',
      qualification: 'Ph.D. in English Literature',
      currentAddress: 'Satellite, Ahmedabad, GJ',
      permanentAddress: 'Satellite, Ahmedabad, GJ',
      details: 'Expert in classical literature and academic writing instruction.',
      bloodGroup: 'O+', height: '160', weight: '54', bankAccount: '98765432103', bankName: 'ICICI Bank', ifscCode: 'ICIC0000123', nationalId: 'AADH-52367', prevSchoolName: 'Ahmedabad International School', prevSchoolAddress: 'Ahmedabad, India', facebook: 'https://facebook.com/priya', linkedin: 'https://linkedin.com/in/priya'
    },
    { 
      id: 'AD52368', 
      teacherId: 'AD52368',
      name: 'Ananya Iyer', 
      fullName: 'Ananya Iyer', 
      subject: 'Chemistry', 
      class: '9(C), 12(A)', 
      email: 'ananya.i@edupro.com', 
      phone: '+91 98765 43235', 
      joinDate: '2024-04-05', 
      status: 'Active', 
      avatar: indianWoman2, 
      color: '#8B5CF6',
      designation: 'Chemistry Instructor',
      dept: 'Science & Research',
      rating: 4.6,
      contractType: 'Permanent',
      shift: 'Day Shift',
      gender: 'Female',
      dob: '1990-03-15',
      maritalStatus: 'Unmarried',
      fatherName: 'Raman Iyer',
      motherName: 'Lakshmi Iyer',
      experience: '6 Years',
      qualification: 'M.Sc. in Organic Chemistry',
      currentAddress: 'Adyar, Chennai, TN',
      permanentAddress: 'Adyar, Chennai, TN',
      details: 'Passionate about chemical reactions, safety in labs, and organic science modules.',
      bloodGroup: 'AB+', height: '162', weight: '55', bankAccount: '98765432104', bankName: 'Axis Bank', ifscCode: 'UTIB0000123', nationalId: 'AADH-52368', prevSchoolName: 'Chennai Public School', prevSchoolAddress: 'Chennai, India', facebook: 'https://facebook.com/ananya', linkedin: 'https://linkedin.com/in/ananya'
    },
    { 
      id: 'AD52369', 
      teacherId: 'AD52369',
      name: 'Sanjay Gupta', 
      fullName: 'Sanjay Gupta', 
      subject: 'History', 
      class: '6(A), 7(B)', 
      email: 'sanjay.g@edupro.com', 
      phone: '+91 98765 43236', 
      joinDate: '2024-05-10', 
      status: 'Active', 
      avatar: indianMan1, 
      color: '#EF4444',
      designation: 'Associate Professor',
      dept: 'Humanities & Languages',
      rating: 4.9,
      contractType: 'Permanent',
      shift: 'Day Shift',
      gender: 'Male',
      dob: '1979-09-25',
      maritalStatus: 'Married',
      fatherName: 'Kishore Gupta',
      motherName: 'Manju Gupta',
      experience: '20 Years',
      qualification: 'Ph.D. in World History',
      currentAddress: 'Salt Lake, Kolkata, WB',
      permanentAddress: 'Salt Lake, Kolkata, WB',
      details: 'Specializes in World War histories, ancient civilizations, and modern political history.',
      bloodGroup: 'A-', height: '175', weight: '70', bankAccount: '98765432105', bankName: 'PNB', ifscCode: 'PUNB0000123', nationalId: 'AADH-52369', prevSchoolName: 'Don Bosco School', prevSchoolAddress: 'Kolkata, India', facebook: 'https://facebook.com/sanjay', linkedin: 'https://linkedin.com/in/sanjay'
    },
    { 
      id: 'AD52370', 
      teacherId: 'AD52370',
      name: 'Sunita Rao', 
      fullName: 'Sunita Rao', 
      subject: 'Biology', 
      class: '8(A), 9(B)', 
      email: 'sunita.r@edupro.com', 
      phone: '+91 98765 43237', 
      joinDate: '2024-06-22', 
      status: 'Inactive', 
      avatar: indianWoman1, 
      color: '#4880FF',
      designation: 'Biology Instructor',
      dept: 'Science & Research',
      rating: 4.5,
      contractType: 'Contractual',
      shift: 'Day Shift',
      gender: 'Female',
      dob: '1992-12-12',
      maritalStatus: 'Unmarried',
      fatherName: 'Madhava Rao',
      motherName: 'Radha Rao',
      experience: '4 Years',
      qualification: 'M.Sc. in Botany',
      currentAddress: 'Jayanagar, Bangalore, KA',
      permanentAddress: 'Jayanagar, Bangalore, KA',
      details: 'Enjoys teaching plant biology, environmental science, and ecological conservations.',
      bloodGroup: 'O-', height: '162', weight: '58', bankAccount: '98765432106', bankName: 'Canara Bank', ifscCode: 'CNRB0000123', nationalId: 'AADH-52370', prevSchoolName: 'National Public School', prevSchoolAddress: 'Bangalore, India', facebook: 'https://facebook.com/sunita', linkedin: 'https://linkedin.com/in/sunita'
    },
    { 
      id: 'AD52371', 
      teacherId: 'AD52371',
      name: 'Vikram Malhotra', 
      fullName: 'Vikram Malhotra', 
      subject: 'Computer Science', 
      class: '11(B), 12(B)', 
      email: 'vikram.m@edupro.com', 
      phone: '+91 98765 43238', 
      joinDate: '2024-07-15', 
      status: 'Active', 
      avatar: indianMan2, 
      color: '#10B981',
      designation: 'IT & CS Lead Instructor',
      dept: 'Technology & Computing',
      rating: 4.9,
      contractType: 'Permanent',
      shift: 'Day Shift',
      gender: 'Male',
      dob: '1986-06-30',
      maritalStatus: 'Married',
      fatherName: 'Ramesh Malhotra',
      motherName: 'Kiran Malhotra',
      experience: '10 Years',
      qualification: 'Ph.D. in Computer Science',
      currentAddress: 'Andheri West, Mumbai, MH',
      permanentAddress: 'Andheri West, Mumbai, MH',
      details: 'Passionate about coding, algorithms, full-stack web development, and artificial intelligence.',
      bloodGroup: 'B-', height: '180', weight: '77', bankAccount: '98765432107', bankName: 'ICICI Bank', ifscCode: 'ICIC0000123', nationalId: 'AADH-52371', prevSchoolName: 'Dhirubhai Ambani International School', prevSchoolAddress: 'Mumbai, India', facebook: 'https://facebook.com/vikram', linkedin: 'https://linkedin.com/in/vikram'
    },
    { 
      id: 'AD52372', 
      teacherId: 'AD52372',
      name: 'Deepa Nair', 
      fullName: 'Deepa Nair', 
      subject: 'Geography', 
      class: '5(B), 6(C)', 
      email: 'deepa.n@edupro.com', 
      phone: '+91 98765 43239', 
      joinDate: '2024-08-30', 
      status: 'Active', 
      avatar: indianWoman2, 
      color: '#F59E0B',
      designation: 'Geography Instructor',
      dept: 'Humanities & Languages',
      rating: 4.7,
      contractType: 'Permanent',
      shift: 'Day Shift',
      gender: 'Female',
      dob: '1984-04-18',
      maritalStatus: 'Married',
      fatherName: 'Gopal Nair',
      motherName: 'Saraswathi Nair',
      experience: '11 Years',
      qualification: 'M.A. in Geography',
      currentAddress: 'Kochi, Kerala',
      permanentAddress: 'Kochi, Kerala',
      details: 'Engages students with geographic information systems (GIS) and map reading modules.',
      bloodGroup: 'O+', height: '168', weight: '62', bankAccount: '98765432108', bankName: 'Federal Bank', ifscCode: 'FDRL0000123', nationalId: 'AADH-52372', prevSchoolName: 'Chinmaya Vidyalaya', prevSchoolAddress: 'Kochi, India', facebook: 'https://facebook.com/deepa', linkedin: 'https://linkedin.com/in/deepa'
    }
  ];

  useEffect(() => {
    // Clear old storage if version is outdated to ensure distinct educator headshots load properly
    const storedVersion = localStorage.getItem('teachers_version');
    if (storedVersion !== '2026-v5') {
      localStorage.removeItem('teachers');
      localStorage.setItem('teachers_version', '2026-v5');
    }

    const stored = localStorage.getItem('teachers');
    let record = null;
    
    if (stored) {
      const list = JSON.parse(stored);
      record = list.find(t => t.id === id);
    }
    
    if (!record) {
      // Find matching default mock teacher or create generic details
      const defaultMatch = defaultTeachers.find(t => t.id === id);
      if (defaultMatch) {
        record = defaultMatch;
      } else {
        const idNum = id ? id.replace(/\D/g, '') : '999';
        record = {
          id: id || 'AD52365',
          name: `Teacher ${id || ''}`,
          fullName: `Teacher ${id || ''}`,
          designation: 'Instructor',
          dept: 'Science & Research',
          status: 'Active',
          rating: 4.8,
          avatar: janeAvatar,
          color: '#4880FF', 
          contractType: 'Permanent',
          shift: 'Day Shift',
          joinDate: '2024-01-12',
          experience: '5 Years',
          qualification: 'M.Sc. in Education',
          email: `teacher.${idNum}@edupro.com`,
          phone: `+1 234 567 ${idNum.padStart(3, '0')}`,
          currentAddress: 'Main Campus, Institutional Area',
          permanentAddress: 'Main Campus, Institutional Area',
          gender: 'Male',
          dob: '1990-01-01',
          maritalStatus: 'Unmarried',
          fatherName: 'Parent Pena',
          motherName: 'Parent Pena',
          details: 'Dedicated educator working at the school.',
          bankAccount: '123456789012',
          bankName: 'Global Institutional Bank',
          ifscCode: 'GIB000123',
        };
      }
    }

    // Build complete high-fidelity profile with statistics & finance
    const completeProfile = {
      ...record,
      name: record.name || record.fullName || 'Faculty Member',
      designation: record.designation || `${record.subject || 'Specialist'} Lead Instructor`,
      dept: record.dept || (record.subject === 'Mathematics' || record.subject === 'Physics' || record.subject === 'Chemistry' || record.subject === 'Biology' ? 'Science & Research' : 'Humanities & Languages'),
      rating: record.rating || 4.8,
      contractType: record.contractType || 'Permanent',
      shift: record.shift || 'Day Shift',
      joiningDate: record.joinDate ? new Date(record.joinDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '12 Jan 2024',
      experience: record.experience || '8+ Years',
      qualification: record.qualification || 'Masters Degree',
      address: record.currentAddress || record.permanentAddress || '724 Oakmound Road, Chicago, IL',
      bio: record.details || 'Dedicated faculty member committed to scholastic achievement and academic excellence.',
      skills: record.skills || ['Curriculum Design', 'E-Learning Support', 'Classroom Leadership', 'Student Development'],
      education: record.education || [
        { year: '2012-2015', title: record.qualification || 'Advanced Master Studies', institute: 'Global State University' }
      ],
      experienceTimeline: record.experienceTimeline || [
        { year: '2020-Present', role: record.designation || 'Lecturer', company: 'EduPro Global Academy' }
      ],
      finance: record.finance || {
        basicSalary: 4500,
        allowance: 800,
        hra: 1200,
        tax: 450,
        netSalary: 6050,
        bankName: record.bankName || 'Global Institutional Bank',
        accountNumber: record.bankAccount ? `**** **** ${record.bankAccount.slice(-4)}` : '**** **** 5236',
        ifsc: record.ifscCode || 'GIB000123'
      },
      payoutHistory: record.payoutHistory || [
        { id: 'PS-523', month: 'April 2026', amount: 6050, date: '30 Apr 2026', basicSalary: 4500, allowance: 800, HRA: 1200, tax: 450 },
        { id: 'PS-522', month: 'March 2026', amount: 6050, date: '31 Mar 2026', basicSalary: 4500, allowance: 800, HRA: 1200, tax: 450 }
      ],
      library: record.library || {
        membershipId: `LIB-${record.id || 'TCH-001'}`,
        status: 'Active',
        borrowedCount: 2,
        totalBorrowed: 45,
        fine: 0
      },
      borrowedBooks: record.borrowedBooks || [
        { id: 'BK-101', title: `${record.subject || 'Quantum'} Foundations`, author: 'Academic Publisher', due: '12 June 2026', issueDate: '29 May 2026' },
        { id: 'BK-102', title: 'Modern Pedagogical Studies', author: 'EduPro Press', due: '25 June 2026', issueDate: '11 May 2026' }
      ],
      libraryHistory: record.libraryHistory || [
        { id: 'BK-091', title: 'Introduction to Calculus', author: 'Oxford Press', borrowDate: '10 Jan 2026', returnDate: '24 Jan 2026', status: 'Returned' },
        { id: 'BK-082', title: 'Advanced Quantum Mechanics', author: 'MIT Press', borrowDate: '02 Feb 2026', returnDate: '16 Feb 2026', status: 'Returned' },
        { id: 'BK-075', title: 'The Art of Classroom Engagement', author: 'Stanford Pub', borrowDate: '05 Mar 2026', returnDate: '19 Mar 2026', status: 'Returned' },
        { id: 'BK-063', title: 'Educational Psychology', author: 'Cambridge Press', borrowDate: '12 Apr 2026', returnDate: '26 Apr 2026', status: 'Returned' }
      ],
      leaveBalance: record.leaveBalance || [
        { type: 'Casual Leave', total: 12, used: 4, remaining: 8, color: 'var(--primary)' },
        { type: 'Sick Leave', total: 10, used: 2, remaining: 8, color: '#EF4444' },
        { type: 'Earned Leave', total: 15, used: 5, remaining: 10, color: '#10B981' }
      ],
      leavesList: record.leavesList || [
        { type: 'Casual Leave', duration: '05 May 2026 - 06 May 2026', reason: 'Family Function', status: 'Approved', color: '#10B981' },
        { type: 'Sick Leave', duration: '12 Apr 2026 - 15 Apr 2026', reason: 'High Fever & Flu', status: 'Approved', color: '#10B981' }
      ]
    };

    setTeacher(completeProfile);
    setLoading(false);

    // Save back if they weren't in storage to persist default leaves/books structure
    if (stored) {
      const list = JSON.parse(stored);
      const index = list.findIndex(t => t.id === record.id);
      if (index !== -1 && (!list[index].leavesList || !list[index].borrowedBooks)) {
        list[index] = { ...list[index], ...completeProfile };
        localStorage.setItem('teachers', JSON.stringify(list));
      }
    }
  }, [id]);

  const toggleStatus = () => {
    if (!teacher) return;
    const newStatus = teacher.status === 'Active' ? 'Inactive' : 'Active';
    
    // Save to local storage
    const stored = localStorage.getItem('teachers');
    if (stored) {
      let list = JSON.parse(stored);
      list = list.map(t => t.id === teacher.id ? { ...t, status: newStatus } : t);
      localStorage.setItem('teachers', JSON.stringify(list));
    }
    
    setTeacher(prev => ({ ...prev, status: newStatus }));
  };

  const tabs = [
    { id: 'biography', label: 'Biography', icon: <User size={16} /> },
    { id: 'routine', label: 'Routine', icon: <Calendar size={16} /> },
    { id: 'attendance', label: 'Attendance', icon: <Clock size={16} /> },
    { id: 'leaves', label: 'Leaves', icon: <Activity size={16} /> },
    { id: 'payroll', label: 'Finance', icon: <Landmark size={16} /> },
    { id: 'library', label: 'Library', icon: <LibraryIcon size={16} /> }
  ];

  if (loading || !teacher) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-muted)' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '16px', fontWeight: 700 }}>Resolving faculty profile...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      style={{ paddingBottom: '60px' }}
      className={showPaySlipModal ? "printing-payslip" : "printing-profile"}
    >
      {/* Top Breadcrumb & Actions Bar */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => navigate('/dashboard/teachers')} className="btn-icon" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
               <ArrowLeft size={18} />
            </button>
            <div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  <Home size={12} /> Dashboard / Teachers / <span style={{ color: 'var(--primary)' }}>Profile</span>
               </div>
               <h2 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0 }}>Faculty Profile</h2>
            </div>
         </div>
         <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => window.print()} 
              className="btn" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                backgroundColor: 'var(--bg-card)', 
                color: 'var(--text-main)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '12px',
                fontWeight: 800,
                padding: '10px 20px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
               <Printer size={18} /> Print Profile
            </button>
            <button onClick={() => navigate(`/dashboard/edit-teacher/${teacher.id}`)} className="btn btn-primary" style={{ padding: '10px 24px', fontWeight: 800 }}>
               <Edit size={18} /> Edit Profile Record
            </button>
         </div>
      </div>

      <div id="printable-profile-area">
         {/* Hero Profile Section */}
         <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '32px', position: 'relative', border: 'none' }}>
            {/* Cover Gradient */}
            <div style={{ height: '160px', background: `linear-gradient(135deg, ${teacher.color || '#4880FF'} 0%, #6366F1 100%)`, position: 'relative' }}>
               <div className="no-print" style={{ position: 'absolute', right: '24px', bottom: '16px', display: 'flex', gap: '12px' }}>
               <button 
                 onClick={toggleStatus} 
                 className="btn" 
                 style={{ 
                   backgroundColor: 'rgba(255,255,255,0.2)', 
                   color: 'white', 
                   border: '1px solid rgba(255,255,255,0.3)', 
                   backdropFilter: 'blur(10px)', 
                   fontSize: '0.85rem',
                   fontWeight: 800
                 }}
               >
                  Status: {teacher.status} (Toggle)
               </button>
               <button 
                 onClick={() => navigate(`/dashboard/edit-teacher/${teacher.id}`)} 
                 className="btn" 
                 style={{ 
                   display: 'flex',
                   alignItems: 'center',
                   gap: '6px',
                   backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                   color: 'var(--primary)', 
                   border: '1px solid rgba(255,255,255,0.4)', 
                   borderRadius: '12px',
                   fontWeight: 900, 
                   fontSize: '0.85rem',
                   padding: '10px 20px',
                   boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                 }}
               >
                  <Edit size={16} /> Edit Profile
               </button>
            </div>
         </div>
         
         {/* Profile Content Overlay */}
         <div style={{ padding: '0 40px 32px', display: 'flex', alignItems: 'flex-end', gap: '32px', marginTop: '-60px', position: 'relative' }}>
            <style>{`
              .details-avatar-container {
                position: relative;
                cursor: pointer;
              }
              .details-avatar-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 150px;
                height: 150px;
                border-radius: 32px;
                border: 6px solid white;
                box-sizing: border-box;
                background-color: rgba(0, 0, 0, 0.45);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
                color: white;
                z-index: 10;
              }
              .details-avatar-container:hover .details-avatar-overlay {
                opacity: 1;
              }
            `}</style>
            <div style={{ position: 'relative' }}>
               <div className="details-avatar-container">
                  <input 
                    type="file" 
                    id="details-photo-input" 
                    accept="image/*" 
                    style={{ display: 'none' }}
                    onChange={handlePhotoUpload}
                  />
                  <div style={{ 
                    width: '150px', height: '150px', borderRadius: '32px', border: '6px solid white', 
                    boxShadow: 'var(--shadow-lg)', overflow: 'hidden', backgroundColor: 'var(--bg-body)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 950, color: teacher.color 
                  }}>
                    <img 
                      src={teacher.avatar && (teacher.avatar.startsWith('data:') || teacher.avatar.startsWith('http') || teacher.avatar.startsWith('/') || teacher.avatar.startsWith('.')) ? teacher.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`} 
                      alt={teacher.name} 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`;
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <div 
                    className="details-avatar-overlay" 
                    onClick={() => document.getElementById('details-photo-input').click()}
                    title="Change Profile Picture"
                  >
                     <Camera size={28} color="white" />
                  </div>
               </div>
               <div style={{ position: 'absolute', bottom: '10px', right: '-10px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--success)', border: '4px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 11 }}>
                  <BadgeCheck size={20} color="white" />
               </div>
            </div>
            
            <div style={{ flex: 1, paddingBottom: '10px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                  <h1 style={{ fontSize: '2.2rem', fontWeight: 950, color: 'var(--text-main)', margin: 0 }}>{teacher.name}</h1>
                  <span style={{ padding: '6px 14px', borderRadius: '10px', backgroundColor: '#10B98115', color: '#10B981', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.5px' }}>
                     VERIFIED FACULTY
                  </span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.95rem' }}>
                     <GraduationCap size={18} color="var(--primary)" /> {teacher.designation}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.95rem' }}>
                     <Building2 size={18} color="var(--primary)" /> {teacher.dept}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.95rem' }}>
                     <MapPin size={18} color="var(--primary)" /> {teacher.address}
                  </div>
               </div>
            </div>

            {/* Quick Rating Card */}
            <div style={{ padding: '16px 24px', backgroundColor: 'var(--bg-body)', borderRadius: '20px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
               <div style={{ fontSize: '1.8rem', fontWeight: 950, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={24} fill="#F59E0B" color="#F59E0B" /> {teacher.rating}
               </div>
               <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginTop: '4px' }}>Institutional Rating</div>
            </div>
         </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '32px' }}>
         
         {/* Left Column - Meta Info */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Essential Contact */}
            <div className="card" style={{ padding: '24px' }}>
               <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={18} color="var(--primary)" /> Contact Details
               </h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                     <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <Mail size={18} />
                     </div>
                     <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>EMAIL ADDRESS</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, wordBreak: 'break-all' }}>{teacher.email}</div>
                     </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                     <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--secondary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                        <Phone size={18} />
                     </div>
                     <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>MOBILE PHONE</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{teacher.phone}</div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Performance Widgets */}
            <div className="card" style={{ padding: '24px' }}>
               <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '20px' }}>Professional Insights</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Work Experience', value: teacher.experience, color: '#8B5CF6' },
                    { label: 'Joining Date', value: teacher.joiningDate, color: '#10B981' },
                    { label: 'Shift Type', value: teacher.shift, color: '#F59E0B' },
                    { label: 'Employment', value: teacher.contractType, color: 'var(--primary)' }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '14px' }}>
                       <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>{item.label}</span>
                       <span style={{ fontSize: '0.85rem', fontWeight: 900, color: item.color }}>{item.value}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* Social Connect */}
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
               <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '20px' }}>Institutional Social Hub</p>
               <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                  {[
                    { icon: Globe, url: teacher.facebook || 'https://facebook.com' },
                    { icon: MessageCircle, url: 'https://slack.com' },
                    { icon: Share2, url: 'https://twitter.com' },
                    { icon: Link, url: teacher.linkedin || 'https://linkedin.com' }
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} onClick={() => window.open(item.url, '_blank')} style={{ width: '45px', height: '45px', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer', transition: '0.3s' }} className="hover-primary">
                         <Icon size={20} />
                      </div>
                    );
                  })}
               </div>
            </div>
         </div>

         {/* Right Column - Tabs & Content */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Modern Tab Bar */}
            <div className="card no-print" style={{ padding: '6px', borderRadius: '20px', display: 'flex', gap: '4px', border: '1px solid var(--border-color)' }}>
               {tabs.map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   style={{ 
                     flex: 1, padding: '14px 0', borderRadius: '16px', border: 'none',
                     backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                     color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                     display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                     cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', fontWeight: 800, fontSize: '0.9rem',
                     boxShadow: activeTab === tab.id ? '0 10px 25px rgba(72, 128, 255, 0.3)' : 'none'
                   }}
                 >
                   {tab.icon} {tab.label}
                 </button>
               ))}
            </div>

            {/* Content Container */}
            <div className="card" style={{ padding: '40px', minHeight: '500px' }}>
               <AnimatePresence mode="wait">
                  {activeTab === 'biography' && (
                    <motion.div key="bio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                       <div style={{ marginBottom: '40px' }}>
                          <h3 style={{ fontSize: '1.4rem', fontWeight: 950, marginBottom: '16px' }}>Professional Biography</h3>
                          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1.05rem', margin: 0 }}>{teacher.bio}</p>
                       </div>

                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                          <div>
                             <h4 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '24px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <User size={18} /> Personal Information
                             </h4>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                {[
                                  { label: 'Father Name', val: teacher.fatherName || 'N/A' },
                                  { label: 'Mother Name', val: teacher.motherName || 'N/A' },
                                  { label: 'Date of Birth', val: teacher.dob || 'N/A' },
                                  { label: 'Marital Status', val: teacher.maritalStatus || 'Married' },
                                  { label: 'Qualifications', val: teacher.qualification || 'N/A' }
                                ].map((item, i) => (
                                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '12px' }}>
                                     <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.label}</span>
                                     <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>{item.val}</span>
                                  </div>
                                ))}
                             </div>
                          </div>
                          <div>
                             <h4 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '24px', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Award size={18} /> Core Skills & Expertise
                             </h4>
                             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {teacher.skills.map((skill, i) => (
                                  <span key={i} style={{ padding: '10px 20px', borderRadius: '12px', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 800, border: '1px solid var(--border-color)' }}>
                                     {skill}
                                  </span>
                                ))}
                             </div>
                          </div>
                       </div>

                        {/* Uploaded Documents List in Details Page */}
                        {teacher.documents && teacher.documents.length > 0 && (
                          <div style={{ marginTop: '40px', borderTop: '1px dashed var(--border-color)', paddingTop: '32px' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 950, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                              <FileText size={20} color="var(--primary)" /> Academic & Professional Documents
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                              {teacher.documents.map((doc) => (
                                <div 
                                  key={doc.id} 
                                  onClick={() => {
                                    if (doc.data) {
                                      const win = window.open();
                                      win.document.write(`<iframe src="${doc.data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                                    }
                                  }}
                                  style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between', 
                                    padding: '16px 20px', 
                                    backgroundColor: 'var(--bg-body)', 
                                    borderRadius: '16px', 
                                    border: '1px solid var(--border-color)',
                                    cursor: doc.data ? 'pointer' : 'default',
                                    transition: '0.3s'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ 
                                      width: '42px', 
                                      height: '42px', 
                                      borderRadius: '12px', 
                                      backgroundColor: 'var(--primary-light)', 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'center', 
                                      color: 'var(--primary)' 
                                    }}>
                                      <FileText size={20} />
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                      <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{doc.name}</div>
                                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{doc.fileName} • {doc.fileSize}</div>
                                    </div>
                                  </div>
                                  <button 
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const link = document.createElement('a');
                                      link.href = doc.data;
                                      link.download = doc.fileName;
                                      link.click();
                                    }} 
                                    className="btn-icon no-print" 
                                    style={{ backgroundColor: 'white', border: '1px solid var(--border-color)' }}
                                    title="Download File"
                                  >
                                    <Download size={16} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </motion.div>
                  )}

                  {activeTab === 'routine' && (
                    <motion.div key="routine" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                          <h3 style={{ fontSize: '1.4rem', fontWeight: 950, margin: 0 }}>Academic Schedule</h3>
                          <button onClick={() => navigate(`/dashboard/teacher-timetable/${teacher.id}`)} className="btn no-print" style={{ backgroundColor: 'var(--bg-body)', fontWeight: 800, color: 'var(--primary)' }}>VIEW FULL TIMETABLE</button>
                       </div>
                       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                           {[
                             { day: 'Monday', class: teacher.class || '10A', sub: teacher.subject || 'Faculty Subject', room: 'Room 101', time: '09:00 - 10:00', bg: '#EEF2FF', color: '#4F46E5' },
                             { day: 'Monday', class: '11B', sub: 'Practical / Lab', room: 'Lab 2', time: '11:00 - 12:30', bg: '#ECFDF5', color: '#10B981' },
                             { day: 'Tuesday', class: '12A', sub: `Advanced ${teacher.subject || 'Studies'}`, room: 'Lab 1', time: '08:30 - 10:00', bg: '#FFF7ED', color: '#F59E0B' },
                             { day: 'Wednesday', class: '10B', sub: teacher.subject || 'Faculty Subject', room: 'Room 102', time: '09:00 - 10:00', bg: '#FDF2F8', color: '#DB2777' },
                           ].map((cls, i) => (
                             <div 
                               key={i} 
                               style={{ 
                                 padding: '24px', 
                                 borderRadius: '20px', 
                                 backgroundColor: 'var(--bg-card)', 
                                 border: '1px solid var(--border-color)',
                                 borderLeft: `6px solid ${cls.color}`,
                                 boxShadow: 'var(--shadow-sm)',
                                 transition: 'transform 0.2s, box-shadow 0.2s',
                                 cursor: 'default'
                               }}
                               className="hover-card-elevate"
                             >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                   <span style={{ 
                                     fontSize: '0.75rem', 
                                     fontWeight: 900, 
                                     color: cls.color, 
                                     padding: '6px 14px', 
                                     backgroundColor: `${cls.color}12`, 
                                     borderRadius: '10px',
                                     letterSpacing: '0.5px',
                                     textTransform: 'uppercase'
                                   }}>
                                     {cls.day}
                                   </span>
                                   <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <Users size={14} color="var(--primary)" /> Class <span style={{ color: 'var(--text-main)', fontWeight: 900 }}>{cls.class}</span>
                                   </div>
                                </div>
                                <h4 style={{ fontSize: '1.25rem', fontWeight: 950, margin: '0 0 16px 0', color: 'var(--text-main)' }}>{cls.sub}</h4>
                                <div style={{ display: 'flex', gap: '24px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700 }}>
                                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <Clock size={16} color={cls.color} /> {cls.time}
                                   </div>
                                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <MapPin size={16} color={cls.color} /> {cls.room}
                                   </div>
                                </div>
                             </div>
                           ))}
                        </div>
                    </motion.div>
                  )}

                  {activeTab === 'attendance' && (
                    <motion.div key="attendance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                       <h3 style={{ fontSize: '1.4rem', fontWeight: 950, marginBottom: '32px' }}>Punctuality Overview</h3>
                       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                          {[
                            { label: 'Working Days', val: 22, color: 'var(--primary)' },
                            { label: 'Days Present', val: 20, color: '#10B981' },
                            { label: 'Late Arrivals', val: 1, color: '#F59E0B' },
                            { label: 'Days Absent', val: 1, color: '#EF4444' }
                          ].map((stat, i) => (
                            <div key={i} style={{ padding: '20px', borderRadius: '20px', backgroundColor: 'var(--bg-body)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                               <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>{stat.label}</div>
                               <div style={{ fontSize: '1.8rem', fontWeight: 950, color: stat.color }}>{stat.val}</div>
                            </div>
                          ))}
                       </div>
                       <div style={{ overflow: 'hidden', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                             <thead style={{ backgroundColor: 'var(--bg-body)' }}>
                                <tr>
                                   <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)' }}>DATE</th>
                                   <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)' }}>CHECK IN</th>
                                   <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)' }}>STATUS</th>
                                   <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>HOURS</th>
                                </tr>
                             </thead>
                             <tbody>
                                {[
                                  { date: '08 May 2024', in: '08:45 AM', status: 'Present', color: '#10B981', hours: '6.5h' },
                                  { date: '07 May 2024', in: '08:50 AM', status: 'Present', color: '#10B981', hours: '6.5h' },
                                  { date: '06 May 2024', in: '09:15 AM', status: 'Late', color: '#F59E0B', hours: '5.7h' }
                                ].map((log, i) => (
                                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                     <td style={{ padding: '18px 24px', fontWeight: 800 }}>{log.date}</td>
                                     <td style={{ padding: '18px 24px', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>{log.in}</td>
                                     <td style={{ padding: '18px 24px' }}>
                                        <span style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: `${log.color}15`, color: log.color, fontSize: '0.75rem', fontWeight: 900 }}>{log.status.toUpperCase()}</span>
                                     </td>
                                     <td style={{ padding: '18px 24px', textAlign: 'right', fontWeight: 800 }}>{log.hours}</td>
                                  </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </motion.div>
                  )}

                  {activeTab === 'payroll' && (
                    <motion.div key="finance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                       <h3 style={{ fontSize: '1.4rem', fontWeight: 950, marginBottom: '32px' }}>Payroll & Financial Summary</h3>
                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
                          <div style={{ padding: '32px', borderRadius: '24px', background: `linear-gradient(135deg, ${teacher.color || '#4880FF'} 0%, #6366F1 100%)`, color: 'white' }}>
                             <div style={{ fontSize: '0.9rem', fontWeight: 800, opacity: 0.8, marginBottom: '8px' }}>MONTHLY NET PAYOUT</div>
                             <div style={{ fontSize: '2.8rem', fontWeight: 950 }}>${teacher.finance.netSalary.toLocaleString()}</div>
                             <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900 }}>PAID</div>
                                <span style={{ fontSize: '0.85rem', opacity: 0.8, fontWeight: 600 }}>Processed dynamically this month</span>
                             </div>
                          </div>
                          <div style={{ padding: '24px', borderRadius: '24px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                             <h4 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '20px' }}>Bank Credentials</h4>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                   <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Bank Name</span>
                                   <span style={{ fontSize: '0.85rem', fontWeight: 900 }}>{teacher.finance.bankName}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                   <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Account No.</span>
                                   <span style={{ fontSize: '0.85rem', fontWeight: 900, fontFamily: 'monospace' }}>{teacher.finance.accountNumber}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                   <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>IFSC Code</span>
                                   <span style={{ fontSize: '0.85rem', fontWeight: 900 }}>{teacher.finance.ifsc}</span>
                                </div>
                             </div>
                          </div>
                       </div>
                       
                       <h4 style={{ fontSize: '1.1rem', fontWeight: 950, marginBottom: '20px' }}>Recent Payout History</h4>
                       <div style={{ borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                             <thead style={{ backgroundColor: 'var(--bg-body)' }}>
                                <tr>
                                   <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)' }}>PAY ID</th>
                                   <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)' }}>MONTH</th>
                                   <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)' }}>AMOUNT</th>
                                   <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>ACTIONS</th>
                                </tr>
                             </thead>
                             <tbody>
                                {teacher.payoutHistory.map((slip, i) => (
                                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                     <td style={{ padding: '18px 24px', fontWeight: 800, color: 'var(--primary)' }}>{slip.id}</td>
                                     <td style={{ padding: '18px 24px', fontWeight: 700 }}>{slip.month}</td>
                                     <td style={{ padding: '18px 24px', fontWeight: 950 }}>${slip.amount.toLocaleString()}</td>
                                     <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                                         <button 
                                           onClick={() => { setSelectedSlip(slip); setShowPaySlipModal(true); }}
                                           className="btn-icon no-print" 
                                           style={{ backgroundColor: 'var(--bg-body)' }}
                                           title="View Invoice"
                                         >
                                           <Receipt size={16} />
                                         </button>
                                     </td>
                                  </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </motion.div>
                  )}

                  {activeTab === 'library' && (
                    <motion.div key="library" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                       <h3 style={{ fontSize: '1.4rem', fontWeight: 950, marginBottom: '32px' }}>Library Access & Records</h3>
                       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
                          <div className="card" style={{ padding: '32px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', position: 'relative' }}>
                             <BookMarked size={40} color="var(--primary)" style={{ opacity: 0.2, position: 'absolute', right: '24px', top: '24px' }} />
                             <h4 style={{ fontSize: '1.1rem', fontWeight: 950, marginBottom: '24px' }}>Active Borrowings</h4>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {teacher.borrowedBooks.map((book, i) => (
                                   <div key={book.id || i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                      <div style={{ width: '45px', height: '60px', backgroundColor: 'var(--primary-light)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                         <Book size={20} color="var(--primary)" />
                                      </div>
                                      <div style={{ flex: 1 }}>
                                         <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{book.title}</div>
                                         <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>by {book.author}</div>
                                      </div>
                                      <div style={{ textAlign: 'right' }}>
                                         <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--danger)' }}>DUE: {book.due}</div>
                                         <button 
                                           onClick={() => handleRenewBook(book.id)}
                                           className="btn no-print" 
                                           style={{ 
                                             padding: '6px 14px', 
                                             fontSize: '0.75rem', 
                                             fontWeight: 900,
                                             backgroundColor: 'var(--bg-card)', 
                                             marginTop: '6px', 
                                             border: '1px solid var(--border-color)',
                                             borderRadius: '10px',
                                             boxShadow: 'var(--shadow-sm)',
                                             color: 'var(--text-main)',
                                             transition: 'all 0.2s ease'
                                           }}
                                         >
                                           RENEW
                                         </button>
                                      </div>
                                   </div>
                                 ))}
                              </div>
                           </div>
                          
                          <div className="card" style={{ padding: '32px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                             <h4 style={{ fontSize: '1.1rem', fontWeight: 950, marginBottom: '24px' }}>Library Insights</h4>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[
                                  { label: 'Membership ID', val: teacher.library.membershipId },
                                  { label: 'Total Books Read', val: teacher.library.totalBorrowed },
                                  { label: 'Pending Fines', val: `$${teacher.library.fine}` },
                                  { label: 'Account Status', val: teacher.library.status }
                                ].map((stat, i) => (
                                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                                     <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>{stat.label}</span>
                                     <span style={{ fontSize: '0.9rem', fontWeight: 800, color: stat.val === 'Active' ? '#10B981' : 'var(--text-main)' }}>{stat.val}</span>
                                  </div>
                                ))}
                             </div>
                             <button 
                               onClick={() => { setLibrarySearch(''); setShowLibraryHistoryModal(true); }}
                               className="btn no-print" 
                               style={{ 
                                 width: '100%', 
                                 marginTop: '24px', 
                                 backgroundColor: 'var(--bg-card)', 
                                 fontWeight: 900, 
                                 color: 'var(--primary)', 
                                 border: '1px solid var(--primary-light)',
                                 borderRadius: '12px',
                                 padding: '12px 20px',
                                 boxShadow: 'var(--shadow-sm)',
                                 transition: 'all 0.2s ease',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 gap: '8px'
                               }}
                             >
                               VIEW FULL HISTORY
                             </button>
                          </div>
                       </div>
                    </motion.div>
                  )}

                  {activeTab === 'leaves' && (
                    <motion.div key="leaves" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                       <h3 style={{ fontSize: '1.4rem', fontWeight: 950, marginBottom: '32px' }}>Leave Records & Balances</h3>
                       
                       {/* Leave Balances Grid */}
                       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                          {teacher.leaveBalance.map((item, i) => (
                            <div key={i} style={{ padding: '24px', borderRadius: '24px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
                               <div style={{ position: 'absolute', right: '-10px', top: '-10px', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: `${item.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <PieChart size={24} color={item.color} style={{ opacity: 0.3 }} />
                                </div>
                               <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '16px' }}>{item.type}</div>
                               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                  <div>
                                     <div style={{ fontSize: '1.8rem', fontWeight: 950, color: 'var(--text-main)' }}>{item.remaining}</div>
                                     <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>DAYS REMAINING</div>
                                  </div>
                                  <div style={{ textAlign: 'right' }}>
                                     <div style={{ fontSize: '0.85rem', fontWeight: 800, color: item.color }}>{item.used} / {item.total}</div>
                                     <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>USED DAYS</div>
                                  </div>
                                </div>
                               <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', marginTop: '16px' }}>
                                  <div style={{ width: `${(item.used / item.total) * 100}%`, height: '100%', backgroundColor: item.color, borderRadius: '10px' }}></div>
                                </div>
                            </div>
                          ))}
                       </div>

                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 950, margin: 0 }}>Recent Leave Applications</h4>
                          <button 
                             onClick={() => {
                               setLeaveType(teacher.leaveBalance[0]?.type || 'Casual Leave');
                               setStartDate('');
                               setEndDate('');
                               setLeaveReason('');
                               setLeaveError('');
                               setShowLeaveModal(true);
                             }}
                             className="btn btn-primary no-print" 
                             style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                           >
                             APPLY NEW LEAVE
                           </button>
                       </div>

                       <div className="card" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                             <thead style={{ backgroundColor: 'var(--bg-body)' }}>
                                <tr>
                                   <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)' }}>LEAVE TYPE</th>
                                   <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)' }}>DURATION</th>
                                   <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)' }}>REASON</th>
                                   <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>STATUS</th>
                                </tr>
                             </thead>
                             <tbody>
                                {teacher.leavesList.map((leave, i) => (
                                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                     <td style={{ padding: '18px 24px', fontWeight: 800 }}>{leave.type}</td>
                                     <td style={{ padding: '18px 24px', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>{leave.duration}</td>
                                     <td style={{ padding: '18px 24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{leave.reason}</td>
                                     <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                                        <span style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: `${leave.color}15`, color: leave.color, fontSize: '0.75rem', fontWeight: 900 }}>{leave.status.toUpperCase()}</span>
                                     </td>
                                  </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
          </div>
       </div>
       </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{
              position: 'fixed', top: '24px', right: '24px', zIndex: 1100,
              backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)', borderRadius: '16px', padding: '16px 24px',
              display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '5px solid var(--success)'
            }}
          >
            <CheckCircle2 size={20} color="var(--success)" />
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apply Leave Modal */}
      <AnimatePresence>
        {showLeaveModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                width: '500px', backgroundColor: 'var(--bg-card)', borderRadius: '24px',
                border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)',
                padding: '32px', position: 'relative'
              }}
            >
              <h3 style={{ fontSize: '1.3rem', fontWeight: 950, marginBottom: '24px', color: 'var(--text-main)' }}>
                Apply for New Leave
              </h3>

              {leaveError && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  backgroundColor: '#EF444415', color: '#EF4444',
                  padding: '12px 16px', borderRadius: '12px', fontSize: '0.85rem',
                  fontWeight: 700, marginBottom: '20px', border: '1px solid #EF444430'
                }}>
                  <AlertCircle size={16} /> {leaveError}
                </div>
              )}

              <form onSubmit={handleApplyLeaveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                    LEAVE TYPE
                  </label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    style={{
                      width: '100%', padding: '14px', borderRadius: '14px',
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)',
                      color: 'var(--text-main)', fontWeight: 700, outline: 'none'
                    }}
                  >
                    {teacher.leaveBalance.map((item, idx) => (
                      <option key={idx} value={item.type}>{item.type} ({item.remaining} days left)</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                      START DATE
                    </label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 14px', borderRadius: '14px',
                        border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)',
                        color: 'var(--text-main)', fontWeight: 700, outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                      END DATE
                    </label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 14px', borderRadius: '14px',
                        border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)',
                        color: 'var(--text-main)', fontWeight: 700, outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                    REASON FOR LEAVE
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    placeholder="e.g. Attending sister's wedding / Medical appointment"
                    style={{
                      width: '100%', padding: '14px', borderRadius: '14px',
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)',
                      color: 'var(--text-main)', fontWeight: 700, outline: 'none', resize: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowLeaveModal(false)}
                    className="btn"
                    style={{
                      flex: 1, backgroundColor: 'white', color: 'var(--text-main)',
                      border: '1px solid var(--border-color)', fontWeight: 800
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1, fontWeight: 800 }}
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payout Slip / Invoice Breakdown Modal */}
      <AnimatePresence>
        {showPaySlipModal && selectedSlip && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                width: '650px', backgroundColor: 'white', borderRadius: '24px',
                boxShadow: 'var(--shadow-xl)', padding: '40px', position: 'relative',
                color: '#1E293B', fontFamily: '"Outfit", sans-serif'
              }}
              id="printable-pay-slip"
            >
              {/* Close button */}
              <button 
                onClick={() => setShowPaySlipModal(false)}
                className="no-print"
                style={{
                  position: 'absolute', top: '24px', right: '24px', border: 'none',
                  background: '#F1F5F9', borderRadius: '50%', width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  color: '#64748B', transition: '0.3s'
                }}
              >
                <XCircle size={20} />
              </button>

              {/* Invoice Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #E2E8F0', paddingBottom: '24px', marginBottom: '24px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ width: '28px', height: '28px', backgroundColor: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 950, fontSize: '0.9rem' }}>
                      E
                    </div>
                    <span style={{ fontWeight: 950, fontSize: '1.2rem', letterSpacing: '-0.5px', color: '#1E293B' }}>EduPro Academy</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>724 Oakmound Road, Chicago, IL 60611</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>finance@eduproglobal.com • +1 234 567 890</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <h2 style={{ fontSize: '1.6rem', fontWeight: 950, color: 'var(--primary)', margin: '0 0 4px 0' }}>PAY SLIP</h2>
                   <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>SLIP NO: {selectedSlip.id}</div>
                   <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B', marginTop: '2px' }}>Pay Period: {selectedSlip.month}</div>
                </div>
              </div>

              {/* Employee & Bank Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '20px', marginBottom: '24px', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ display: 'flex', marginBottom: '8px' }}>
                    <span style={{ width: '120px', fontWeight: 700, color: '#64748B' }}>Employee Name:</span>
                    <span style={{ fontWeight: 800, color: '#1E293B' }}>{teacher.name}</span>
                  </div>
                  <div style={{ display: 'flex', marginBottom: '8px' }}>
                    <span style={{ width: '120px', fontWeight: 700, color: '#64748B' }}>Faculty ID:</span>
                    <span style={{ fontWeight: 800, color: '#1E293B' }}>{teacher.id}</span>
                  </div>
                  <div style={{ display: 'flex', marginBottom: '8px' }}>
                    <span style={{ width: '120px', fontWeight: 700, color: '#64748B' }}>Designation:</span>
                    <span style={{ fontWeight: 700, color: '#334155' }}>{teacher.designation}</span>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <span style={{ width: '120px', fontWeight: 700, color: '#64748B' }}>Department:</span>
                    <span style={{ fontWeight: 700, color: '#334155' }}>{teacher.dept}</span>
                  </div>
                </div>
                <div style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: '24px' }}>
                  <div style={{ display: 'flex', marginBottom: '8px' }}>
                    <span style={{ width: '110px', fontWeight: 700, color: '#64748B' }}>Bank Name:</span>
                    <span style={{ fontWeight: 700, color: '#334155' }}>{teacher.finance.bankName}</span>
                  </div>
                  <div style={{ display: 'flex', marginBottom: '8px' }}>
                    <span style={{ width: '110px', fontWeight: 700, color: '#64748B' }}>Account No:</span>
                    <span style={{ fontWeight: 700, color: '#334155', fontFamily: 'monospace' }}>{teacher.finance.accountNumber}</span>
                  </div>
                  <div style={{ display: 'flex', marginBottom: '8px' }}>
                    <span style={{ width: '110px', fontWeight: 700, color: '#64748B' }}>IFSC Code:</span>
                    <span style={{ fontWeight: 700, color: '#334155' }}>{teacher.finance.ifsc}</span>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <span style={{ width: '110px', fontWeight: 700, color: '#64748B' }}>Payout Date:</span>
                    <span style={{ fontWeight: 800, color: '#10B981' }}>{selectedSlip.date || '30 April 2026'}</span>
                  </div>
                </div>
              </div>

              {/* Salary Breakdown Table */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#F1F5F9', borderBottom: '1px solid #E2E8F0', fontWeight: 800, fontSize: '0.85rem', padding: '12px 20px' }}>
                  <div>EARNINGS DETAILS</div>
                  <div style={{ textAlign: 'right' }}>AMOUNT</div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', padding: '16px 20px', gap: '12px', fontSize: '0.85rem', borderBottom: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: '#475569' }}>Basic Salary</span>
                    <span style={{ fontWeight: 800, color: '#1E293B' }}>${selectedSlip.basicSalary ? selectedSlip.basicSalary.toLocaleString() : '4,500'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: '#475569' }}>House Rent Allowance (HRA)</span>
                    <span style={{ fontWeight: 800, color: '#1E293B' }}>${selectedSlip.HRA ? selectedSlip.HRA.toLocaleString() : '1,200'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: '#475569' }}>Special Institutional Allowance</span>
                    <span style={{ fontWeight: 800, color: '#1E293B' }}>${selectedSlip.allowance ? selectedSlip.allowance.toLocaleString() : '800'}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontWeight: 800, fontSize: '0.85rem', padding: '12px 20px' }}>
                  <div>DEDUCTIONS DETAILS</div>
                  <div style={{ textAlign: 'right' }}>AMOUNT</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', padding: '16px 20px', gap: '12px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: '#475569' }}>Professional Income Tax</span>
                    <span style={{ fontWeight: 800, color: '#EF4444' }}>-${selectedSlip.tax ? selectedSlip.tax.toLocaleString() : '450'}</span>
                  </div>
                </div>
              </div>

              {/* Net Salary Summary */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#EEF2FF', borderRadius: '16px', padding: '20px 24px', marginBottom: '32px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '2px' }}>Net Salary Disbursed</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Amount in Words: Six Thousand Fifty Dollars Only</div>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 950, color: 'var(--primary)' }}>
                   ${selectedSlip.amount ? selectedSlip.amount.toLocaleString() : '6,050'}
                </div>
              </div>

              {/* Footer Notes & Signatures */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Important Notice:</div>
                  <div style={{ color: '#64748B', maxWidth: '300px', lineHeight: 1.5 }}>This is a computer-generated institutional payroll statement and does not require a physical signature for validity. For queries, contact Accounts Department.</div>
                </div>
                <div style={{ textAlign: 'center', width: '150px' }}>
                  <div style={{ borderBottom: '1px solid #CBD5E1', height: '40px', marginBottom: '8px' }}></div>
                  <div style={{ fontWeight: 700, color: '#475569' }}>Finance Manager</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.7rem', marginTop: '2px' }}>EduPro Global Accounts</div>
                </div>
              </div>

              {/* Action Buttons inside modal */}
              <div className="no-print" style={{ display: 'flex', gap: '12px', marginTop: '40px', borderTop: '1px solid #F1F5F9', paddingTop: '24px' }}>
                <button 
                  onClick={() => setShowPaySlipModal(false)}
                  className="btn" 
                  style={{ flex: 1, backgroundColor: 'white', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontWeight: 800 }}
                >
                  Close
                </button>
                <button 
                  onClick={() => window.print()}
                  className="btn btn-primary" 
                  style={{ flex: 1, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Printer size={18} /> Print Payout Invoice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Library History Modal */}
      <AnimatePresence>
        {showLibraryHistoryModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                width: '750px', backgroundColor: 'var(--bg-card)', borderRadius: '24px',
                border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)',
                padding: '32px', position: 'relative'
              }}
            >
              <button 
                onClick={() => setShowLibraryHistoryModal(false)}
                style={{
                  position: 'absolute', top: '24px', right: '24px', border: 'none',
                  background: 'var(--bg-body)', borderRadius: '50%', width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  color: 'var(--text-muted)', transition: '0.3s', border: '1px solid var(--border-color)'
                }}
              >
                <XCircle size={20} />
              </button>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 950, marginBottom: '8px', color: 'var(--text-main)' }}>
                Full Borrowing History Ledger
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '24px' }}>
                Library Card ID: <span style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{teacher.library.membershipId}</span> • Total books read: {teacher.library.totalBorrowed}
              </p>

              {/* Live Filter Bar */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
                  <input
                    type="text"
                    placeholder="Search historical borrowings by title, author, or status..."
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    style={{
                      width: '100%', padding: '12px 16px 12px 48px', borderRadius: '14px',
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)',
                      color: 'var(--text-main)', fontWeight: 700, outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* History Table */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '20px', overflow: 'hidden', maxHeight: '350px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: 'var(--bg-body)', position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr>
                      <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)' }}>BOOK DETAILS</th>
                      <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)' }}>BORROW DATE</th>
                      <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)' }}>RETURN DATE</th>
                      <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacher.libraryHistory
                      .filter(b => 
                        b.title.toLowerCase().includes(librarySearch.toLowerCase()) ||
                        b.author.toLowerCase().includes(librarySearch.toLowerCase()) ||
                        b.status.toLowerCase().includes(librarySearch.toLowerCase())
                      )
                      .map((log, i) => (
                        <tr key={log.id || i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '14px 20px' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{log.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>by {log.author}</div>
                          </td>
                          <td style={{ padding: '14px 20px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{log.borrowDate}</td>
                          <td style={{ padding: '14px 20px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{log.returnDate}</td>
                          <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                            <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: '#10B98115', color: '#10B981', fontSize: '0.7rem', fontWeight: 900 }}>
                              {log.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <button 
                onClick={() => setShowLibraryHistoryModal(false)}
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '24px', fontWeight: 800 }}
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Print Styles Injection */}
      <style>{`
        @media print {
          /* General reset to hide everything */
          body * {
            visibility: hidden !important;
          }
          
          /* Hide non-printable components */
          .sidebar, .navbar, .no-print, button, .btn, .btn-icon, .breadcrumb {
            display: none !important;
            visibility: hidden !important;
          }

          /* If pay slip modal is open, print ONLY the payslip */
          .printing-payslip #printable-pay-slip, 
          .printing-payslip #printable-pay-slip * {
            visibility: visible !important;
          }
          .printing-payslip #printable-pay-slip {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
          }
          .printing-payslip #printable-profile-area,
          .printing-payslip #printable-profile-area * {
            display: none !important;
            visibility: hidden !important;
          }

          /* If printing the profile, make the profile area visible */
          .printing-profile #printable-profile-area,
          .printing-profile #printable-profile-area * {
            visibility: visible !important;
          }
          .printing-profile #printable-profile-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
            background-color: white !important;
            color: black !important;
          }

          /* Make sure printed grid looks nice and cards look premium */
          .printing-profile .card {
            border: 1px solid #CBD5E1 !important;
            box-shadow: none !important;
            background: white !important;
            page-break-inside: avoid !important;
            margin-bottom: 24px !important;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default TeacherDetails;
