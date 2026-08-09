import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, GraduationCap, MapPin, Phone, Mail, Calendar, 
  Award, BookOpen, Clock, CreditCard, Shield, 
  FileText, ArrowLeft, Download, Printer, Edit,
  ShieldAlert, MoreVertical, Building2, Heart, Landmark,
  ChevronRight, Library, Home, Activity, Wallet, 
  TrendingUp, CircleCheck, CalendarDays, Loader2, Lock,
  ChevronDown, Upload, Eye, Trash2, Share2, Copy, Flag
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid } from 'recharts';
import ActionDropdown from '../components/ActionDropdown';
import { useToast, ToastRenderer } from '../hooks/useToast';
import studentAvatar from '../assets/student_avatar.png';
import indianMan1 from '../assets/indian_man_portrait_1.png';
import indianMan2 from '../assets/indian_man_portrait_2.png';
import indianWoman1 from '../assets/indian_woman_portrait_1.png';
import indianWoman2 from '../assets/indian_woman_portrait_2.png';

const attendanceDataByMonth = {
  'May 2026': {
    stats: [
      { label: 'Total Working Days', value: '22', color: 'var(--primary)' },
      { label: 'Days Present', value: '20', color: 'var(--success)' },
      { label: 'Days Absent', value: '1', color: 'var(--danger)' },
      { label: 'Late Arrivals', value: '1', color: 'var(--warning)' }
    ],
    emptyCells: 5,
    daysCount: 31,
    specialDays: { 5: 'absent', 12: 'late' },
    logs: [
      { date: '10 May 2026', status: 'Present', in: '08:45 AM', out: '03:30 PM', remarks: 'On Time' },
      { date: '09 May 2026', status: 'Late', in: '09:15 AM', out: '03:30 PM', remarks: 'Bus Delayed' },
      { date: '08 May 2026', status: 'Present', in: '08:50 AM', out: '03:30 PM', remarks: 'On Time' },
      { date: '05 May 2026', status: 'Absent', in: '-', out: '-', remarks: 'Family Emergency' },
    ],
    trend: [
      { month: 'Jan', rate: 95 },
      { month: 'Feb', rate: 92 },
      { month: 'Mar', rate: 98 },
      { month: 'Apr', rate: 94 },
      { month: 'May', rate: 96 },
    ]
  },
  'April 2026': {
    stats: [
      { label: 'Total Working Days', value: '20', color: 'var(--primary)' },
      { label: 'Days Present', value: '18', color: 'var(--success)' },
      { label: 'Days Absent', value: '2', color: 'var(--danger)' },
      { label: 'Late Arrivals', value: '0', color: 'var(--warning)' }
    ],
    emptyCells: 3,
    daysCount: 30,
    specialDays: { 10: 'absent', 18: 'absent' },
    logs: [
      { date: '25 Apr 2026', status: 'Present', in: '08:42 AM', out: '03:30 PM', remarks: 'On Time' },
      { date: '18 Apr 2026', status: 'Absent', in: '-', out: '-', remarks: 'Sick Leave' },
      { date: '15 Apr 2026', status: 'Present', in: '08:55 AM', out: '03:30 PM', remarks: 'On Time' },
      { date: '10 Apr 2026', status: 'Absent', in: '-', out: '-', remarks: 'Severe Weather' },
    ],
    trend: [
      { month: 'Nov', rate: 90 },
      { month: 'Dec', rate: 91 },
      { month: 'Jan', rate: 95 },
      { month: 'Feb', rate: 92 },
      { month: 'Apr', rate: 90 },
    ]
  },
  'March 2026': {
    stats: [
      { label: 'Total Working Days', value: '23', color: 'var(--primary)' },
      { label: 'Days Present', value: '22', color: 'var(--success)' },
      { label: 'Days Absent', value: '0', color: 'var(--danger)' },
      { label: 'Late Arrivals', value: '1', color: 'var(--warning)' }
    ],
    emptyCells: 0,
    daysCount: 31,
    specialDays: { 8: 'late' },
    logs: [
      { date: '22 Mar 2026', status: 'Present', in: '08:48 AM', out: '03:30 PM', remarks: 'On Time' },
      { date: '18 Mar 2026', status: 'Present', in: '08:40 AM', out: '03:30 PM', remarks: 'On Time' },
      { date: '12 Mar 2026', status: 'Present', in: '08:50 AM', out: '03:30 PM', remarks: 'On Time' },
      { date: '08 Mar 2026', status: 'Late', in: '09:20 AM', out: '03:30 PM', remarks: 'Medical Appointment' },
    ],
    trend: [
      { month: 'Oct', rate: 96 },
      { month: 'Nov', rate: 90 },
      { month: 'Dec', rate: 91 },
      { month: 'Jan', rate: 95 },
      { month: 'Mar', rate: 95.6 },
    ]
  }
};


const StudentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast, showToast, hideToast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  const [downloadingDoc, setDownloadingDoc] = useState(null);
  const [selectedAttendanceMonth, setSelectedAttendanceMonth] = useState('May 2026');

  // Dropdown open states
  const [isExamDropdownOpen, setIsExamDropdownOpen] = useState(false);
  const [isAttendanceDropdownOpen, setIsAttendanceDropdownOpen] = useState(false);

  // Leave states
  const [leavesList, setLeavesList] = useState([
    { type: 'Sick Leave', from: '10 May 2026', to: '12 May 2026', reason: 'High Fever & Flu', status: 'Approved', color: 'var(--success)' },
    { type: 'Casual Leave', from: '05 Apr 2026', to: '05 Apr 2026', reason: 'Family Function', status: 'Approved', color: 'var(--success)' },
    { type: 'Medical', from: '15 Mar 2026', to: '16 Mar 2026', reason: 'Dental Checkup', status: 'Rejected', color: 'var(--danger)' },
    { type: 'Personal', from: '01 Mar 2026', to: '02 Mar 2026', reason: 'Sibling Wedding', status: 'Approved', color: 'var(--success)' },
    { type: 'Sick Leave', from: '12 Feb 2026', to: '14 Feb 2026', reason: 'Stomach Infection', status: 'Approved', color: 'var(--success)' },
    { type: 'Casual Leave', from: '20 Jan 2026', to: '20 Jan 2026', reason: 'Religious Festival', status: 'Approved', color: 'var(--success)' },
    { type: 'Emergency', from: '05 Jan 2026', to: '07 Jan 2026', reason: 'Urgent Travel', status: 'Approved', color: 'var(--success)' },
  ]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    type: 'Sick Leave',
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
    reason: ''
  });
  const [leaveSubmittingStep, setLeaveSubmittingStep] = useState('input'); // 'input', 'processing', 'success'
  const [leaveProcessingMsg, setLeaveProcessingMsg] = useState('Transmitting leave petition...');

  // Document Vault states
  const [documentsList, setDocumentsList] = useState([
    { name: 'Birth Certificate', size: '1.2 MB', date: '12 Jan 2026', type: 'PDF' },
    { name: 'Transfer Certificate', size: '850 KB', date: '15 Jan 2026', type: 'PDF' },
    { name: 'Medical Fitness Certificate', size: '2.1 MB', date: '01 Feb 2026', type: 'JPG' },
    { name: 'Previous Year Marksheet', size: '3.4 MB', date: '15 Jan 2026', type: 'PDF' },
    { name: 'Aadhar Card / ID Proof', size: '500 KB', date: '12 Jan 2026', type: 'JPG' },
    { name: 'Character Certificate', size: '420 KB', date: '18 Jan 2026', type: 'PDF' },
    { name: 'Scholarship Letter', size: '1.1 MB', date: '05 Feb 2026', type: 'PDF' },
    { name: 'Sports Achievement Cert.', size: '2.8 MB', date: '10 Mar 2026', type: 'JPG' },
    { name: 'Parent ID Proof', size: '920 KB', date: '12 Jan 2026', type: 'PDF' },
    { name: 'Address Proof (Utility Bill)', size: '1.5 MB', date: '12 Jan 2026', type: 'PDF' },
  ]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    type: 'PDF',
    file: null
  });
  const [uploadStep, setUploadStep] = useState('input'); // 'input', 'processing', 'success'
  const [uploadProcessingMsg, setUploadProcessingMsg] = useState('Scanning file structure...');

  // Preview & Delete States
  const [previewDoc, setPreviewDoc] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);
  const [deleteStep, setDeleteStep] = useState('confirm'); // 'confirm', 'processing', 'success'
  const [deleteProcessingMsg, setDeleteProcessingMsg] = useState('Initiating cryptographic decommissioning...');

  const handleConfirmDelete = () => {
    setDeleteStep('processing');
    setDeleteProcessingMsg('Declassifying and revoking digital credentials...');
    
    setTimeout(() => {
      setDeleteProcessingMsg('Purging backup indices across IPFS replication zones...');
    }, 600);

    setTimeout(() => {
      setDeleteProcessingMsg('Zero-filling cluster nodes and updating vault registry...');
    }, 1200);

    setTimeout(() => {
      setDocumentsList(prev => prev.filter(d => d.name !== docToDelete.name));
      setDeleteStep('success');
    }, 1800);
  };

  const handleConfirmUpload = () => {
    setUploadStep('processing');
    setUploadProcessingMsg('Scanning file blocks for security vectors...');
    
    setTimeout(() => {
      setUploadProcessingMsg('Parsing document format and header integrity...');
    }, 500);

    setTimeout(() => {
      setUploadProcessingMsg('Establishing secure socket link with vault storage node...');
    }, 1000);

    setTimeout(() => {
      setUploadProcessingMsg('Encrypting & transferring document blocks to directory...');
    }, 1500);

    setTimeout(() => {
      const today = new Date();
      const day = today.getDate();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthStr = months[today.getMonth()];
      const year = today.getFullYear();
      const formattedDate = `${day < 10 ? '0' + day : day} ${monthStr} ${year}`;
      
      const newDoc = {
        name: uploadForm.name || (uploadForm.file ? uploadForm.file.name.replace(/\.[^/.]+$/, "") : 'Unnamed Document'),
        size: uploadForm.file ? uploadForm.file.size : '1.4 MB',
        date: formattedDate,
        type: uploadForm.type
      };
      setDocumentsList(prev => [newDoc, ...prev]);
      setUploadStep('success');
    }, 2000);
  };

  const formatDateToTable = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day} ${month} ${year}`;
  };

  const handleConfirmLeaveSubmit = () => {
    setLeaveSubmittingStep('processing');
    setLeaveProcessingMsg('Establishing connection to admin node...');
    
    setTimeout(() => {
      setLeaveProcessingMsg('Validating selected date blocks...');
    }, 600);

    setTimeout(() => {
      setLeaveProcessingMsg('Registering leave petition in registry...');
    }, 1200);

    setTimeout(() => {
      const newLeave = {
        type: leaveForm.type,
        from: formatDateToTable(leaveForm.from),
        to: formatDateToTable(leaveForm.to),
        reason: leaveForm.reason,
        status: 'Pending',
        color: 'var(--warning)'
      };
      setLeavesList(prev => [newLeave, ...prev]);
      setLeaveSubmittingStep('success');
    }, 1800);
  };

  const currentAttendance = attendanceDataByMonth[selectedAttendanceMonth];

  // Resolve matching student from localStorage or fallback to high-fidelity default list
  const targetId = id || 'STU101';
  
  // Version reset to clear old local storage and load Liam Fox with distinct classmates
  // Version reset to clear old local storage and load Indian student list properly
  const storedVersion = localStorage.getItem('students_version');
  if (storedVersion !== '2026-v11') {
    localStorage.removeItem('students');
    localStorage.setItem('students_version', '2026-v11');
  }

  const storedStudents = localStorage.getItem('students');
  let parsedStudents = [];
  if (storedStudents) {
    parsedStudents = JSON.parse(storedStudents);
  } else {
    const defaultList = [
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
      { student_id: 'STU212', name: 'Kavita Krishnan', email: 'kavita.k@example.com', phone: '+91 98765 43220', class_id: '11', section: 'A', rollNo: '03', admission_date: '2026-11-14', gender: 'Female', status: 'Suspended', avatar: indianWoman2, dob: '2009-11-14', bloodGroup: 'A+', religion: 'Hinduism', parentName: 'Gopal Krishnan', parentOccupation: 'Doctor', parentPhone: '+91 98765 43220', parentEmail: 'gopal.k@example.com', presentAddress: 'Indiranagar, Bangalore, KA', permanentAddress: 'Indiranagar, Bangalore, KA' },
      { student_id: '1', name: 'Devendra Mishra', email: 'devendra.mishra@edupro.edu', phone: '+91 98765 43221', class_id: '10', section: 'A', rollNo: '15', admission_date: '2026-09-01', gender: 'Male', status: 'Active', avatar: indianMan2, dob: '2010-02-15', bloodGroup: 'B+', religion: 'Hinduism', parentName: 'Kailash Mishra', parentOccupation: 'Business', parentPhone: '+91 98765 43221', parentEmail: 'kailash.m@example.com', presentAddress: 'Gomti Nagar, Lucknow, UP', permanentAddress: 'Gomti Nagar, Lucknow, UP' },
      { student_id: 'STU213', name: 'Abhishek Singh', email: 'abhishek.singh@example.com', phone: '+91 98765 43222', class_id: '10', section: 'B', rollNo: '22', admission_date: '2026-09-01', gender: 'Male', status: 'Suspended', avatar: indianMan1, dob: '2010-02-15', bloodGroup: 'B+', religion: 'Hinduism', parentName: 'Vijay Singh', parentOccupation: 'Teacher', parentPhone: '+91 98765 43222', parentEmail: 'vijay.s@example.com', presentAddress: 'Civil Lines, Jaipur, RJ', permanentAddress: 'Civil Lines, Jaipur, RJ' },
      { student_id: 'STU214', name: 'Meera Patel', email: 'meera.patel@example.com', phone: '+91 98765 43223', class_id: '12', section: 'C', rollNo: '05', admission_date: '2026-10-12', gender: 'Female', status: 'Suspended', avatar: indianWoman1, dob: '2009-07-20', bloodGroup: 'AB+', religion: 'Hinduism', parentName: 'Dinesh Patel', parentOccupation: 'Engineer', parentPhone: '+91 98765 43223', parentEmail: 'dinesh.p@example.com', presentAddress: 'Satellite, Ahmedabad, GJ', permanentAddress: 'Satellite, Ahmedabad, GJ' },
      { student_id: 'STU215', name: 'Nisha Patel', email: 'nisha.patel@example.com', phone: '+91 98765 43224', class_id: '9', section: 'A', rollNo: '10', admission_date: '2026-08-20', gender: 'Female', status: 'Suspended', avatar: indianWoman2, dob: '2009-12-05', bloodGroup: 'O-', religion: 'Hinduism', parentName: 'Pravin Patel', parentOccupation: 'Nurse', parentPhone: '+91 98765 43224', parentEmail: 'pravin.p@example.com', presentAddress: 'Vastrapur, Ahmedabad, GJ', permanentAddress: 'Vastrapur, Ahmedabad, GJ' },
      { student_id: 'STU216', name: 'Sameer Khan', email: 'sameer.khan@example.com', phone: '+91 98765 43225', class_id: '10', section: 'C', rollNo: '07', admission_date: '2026-09-15', gender: 'Male', status: 'Suspended', avatar: indianMan2, dob: '2008-11-22', bloodGroup: 'B-', religion: 'Islam', parentName: 'Salim Khan', parentOccupation: 'Business Owner', parentPhone: '+91 98765 43225', parentEmail: 'salim.k@example.com', presentAddress: 'Bandra, Mumbai, MH', permanentAddress: 'Bandra, Mumbai, MH' }
    ];
    localStorage.setItem('students', JSON.stringify(defaultList));
    parsedStudents = defaultList;
  }

  // Hostel pool — maps ADM-2026-xxx IDs to full teenager student profiles
  const RAW_HOSTEL_STUDENT_POOL = [
    { student_id: 'ADM-2026-001', name: 'Aarav Gupta', gender: 'Male', class_id: '10', section: 'A', rollNo: '01', dob: '2010-03-14', bloodGroup: 'O+', avatar: '', email: 'aarav.gupta@edupro.edu', phone: '+91 98765 43226', parentName: 'Gupta Sr.', parentOccupation: 'Engineer', parentPhone: '+91 98765 43226', parentEmail: 'gupta.sr@example.com' },
    { student_id: 'ADM-2026-002', name: 'Aaradhya Sen', gender: 'Female', class_id: '10', section: 'B', rollNo: '02', dob: '2010-06-22', bloodGroup: 'A+', avatar: '', email: 'aaradhya.sen@edupro.edu', phone: '+91 98765 43227', parentName: 'Sen Sr.', parentOccupation: 'Lawyer', parentPhone: '+91 98765 43227', parentEmail: 'sen.sr@example.com' },
    { student_id: 'ADM-2026-003', name: 'Kabir Nair', gender: 'Male', class_id: '11', section: 'A', rollNo: '03', dob: '2009-04-08', bloodGroup: 'B+', avatar: '', email: 'kabir.nair@edupro.edu', phone: '+91 98765 43228', parentName: 'Nair Sr.', parentOccupation: 'Doctor', parentPhone: '+91 98765 43228', parentEmail: 'nair.sr@example.com' },
    { student_id: 'ADM-2026-004', name: 'Ananya Rao', gender: 'Female', class_id: '12', section: 'C', rollNo: '04', dob: '2008-09-12', bloodGroup: 'AB+', avatar: '', email: 'ananya.rao@edupro.edu', phone: '+91 98765 43229', parentName: 'Rao Sr.', parentOccupation: 'Architect', parentPhone: '+91 98765 43229', parentEmail: 'rao.sr@example.com' },
    { student_id: 'ADM-2026-005', name: 'Vihaan Joshi', gender: 'Male', class_id: '9', section: 'B', rollNo: '05', dob: '2011-04-03', bloodGroup: 'O-', avatar: '', email: 'vihaan.joshi@edupro.edu', phone: '+91 98765 43230', parentName: 'Joshi Sr.', parentOccupation: 'Business Owner', parentPhone: '+91 98765 43230', parentEmail: 'joshi.sr@example.com' },
    { student_id: 'ADM-2026-006', name: 'Diya Mehta', gender: 'Female', class_id: '10', section: 'C', rollNo: '06', dob: '2010-01-18', bloodGroup: 'A-', avatar: '', email: 'diya.mehta@edupro.edu', phone: '+91 98765 43231', parentName: 'Mehta Sr.', parentOccupation: 'Teacher', parentPhone: '+91 98765 43231', parentEmail: 'mehta.sr@example.com' },
    { student_id: 'ADM-2026-007', name: 'Advik Reddy', gender: 'Male', class_id: '11', section: 'B', rollNo: '07', dob: '2009-07-21', bloodGroup: 'B-', avatar: '', email: 'advik.reddy@edupro.edu', phone: '+91 98765 43232', parentName: 'Reddy Sr.', parentOccupation: 'Accountant', parentPhone: '+91 98765 43232', parentEmail: 'reddy.sr@example.com' },
    { student_id: 'ADM-2026-008', name: 'Ishaanvi Bose', gender: 'Female', class_id: '12', section: 'A', rollNo: '08', dob: '2008-05-30', bloodGroup: 'O+', avatar: '', email: 'ishaanvi.bose@edupro.edu', phone: '+91 98765 43233', parentName: 'Bose Sr.', parentOccupation: 'Nurse', parentPhone: '+91 98765 43233', parentEmail: 'bose.sr@example.com' },
    { student_id: 'ADM-2026-009', name: 'Reyansh Patel', gender: 'Male', class_id: '9', section: 'A', rollNo: '09', dob: '2011-09-04', bloodGroup: 'A+', avatar: '', email: 'reyansh.patel@edupro.edu', phone: '+91 98765 43234', parentName: 'Patel Sr.', parentOccupation: 'Manager', parentPhone: '+91 98765 43234', parentEmail: 'patel.sr@example.com' },
    { student_id: 'ADM-2026-010', name: 'Myra Iyer', gender: 'Female', class_id: '10', section: 'A', rollNo: '10', dob: '2010-11-01', bloodGroup: 'AB-', avatar: '', email: 'myra.iyer@edupro.edu', phone: '+91 98765 43235', parentName: 'Iyer Sr.', parentOccupation: 'Executive', parentPhone: '+91 98765 43235', parentEmail: 'iyer.sr@example.com' },
    { student_id: 'ADM-2026-011', name: 'Atharv Singh', gender: 'Male', class_id: '11', section: 'C', rollNo: '11', dob: '2009-02-15', bloodGroup: 'B+', avatar: '', email: 'atharv.singh@edupro.edu', phone: '+91 98765 43236', parentName: 'Singh Sr.', parentOccupation: 'Engineer', parentPhone: '+91 98765 43236', parentEmail: 'singh.sr@example.com' },
    { student_id: 'ADM-2026-012', name: 'Aadya Sharma', gender: 'Female', class_id: '12', section: 'B', rollNo: '12', dob: '2008-07-24', bloodGroup: 'O+', avatar: '', email: 'aadya.sharma@edupro.edu', phone: '+91 98765 43237', parentName: 'Sharma Sr.', parentOccupation: 'Pilot', parentPhone: '+91 98765 43237', parentEmail: 'sharma.sr@example.com' }
  ];

  const HOSTEL_STUDENT_POOL = RAW_HOSTEL_STUDENT_POOL.map(s => {
    const isMale = s.gender === 'Male';
    const nameCode = (s.name || '').charCodeAt(0) || 0;
    let avatarAsset = isMale ? indianMan1 : indianWoman1;
    if (isMale) {
      avatarAsset = nameCode % 2 === 0 ? indianMan1 : indianMan2;
    } else {
      avatarAsset = nameCode % 2 === 0 ? indianWoman1 : indianWoman2;
    }
    return { ...s, avatar: avatarAsset };
  });

  // Look up student by ID — first check localStorage, then hostel pool for ADM-2026-xxx IDs
  let resolvedStudent = parsedStudents.find(s => s.student_id === targetId);

  // Check hostel pool for ADM-2026-xxx IDs not found in main students list
  if (!resolvedStudent && targetId.startsWith('ADM-2026-')) {
    const hostelMatch = HOSTEL_STUDENT_POOL.find(s => s.student_id === targetId);
    if (hostelMatch) {
      const classSection = hostelMatch.section ? `${hostelMatch.class_id}-${hostelMatch.section}` : `${hostelMatch.class_id}-A`;
      resolvedStudent = {
        ...hostelMatch,
        admission_date: '2026-01-15',
        status: 'Active',
        religion: 'Christianity',
        presentAddress: '123 Hostel Lane, Education City, NY 10001',
        permanentAddress: '456 Home Avenue, Hometown, CA 90210'
      };
    }
  }
  
  if (!resolvedStudent) {
    const attendanceRoster = [
      { student_id: 'STU-2026-001', name: 'Aarav Gupta',        grade: '10', section: 'A', rollNo: '01', email: 'aarav.gupta@edupro.edu' },
      { student_id: 'STU-2026-002', name: 'Aaradhya Sen',       grade: '10', section: 'A', rollNo: '02', email: 'aaradhya.sen@edupro.edu' },
      { student_id: 'STU-2026-003', name: 'Kabir Nair',         grade: '10', section: 'A', rollNo: '03', email: 'kabir.nair@edupro.edu' },
      { student_id: 'STU-2026-004', name: 'Ananya Rao',         grade: '10', section: 'A', rollNo: '04', email: 'ananya.rao@edupro.edu' },
      { student_id: 'STU-2026-005', name: 'Vihaan Joshi',        grade: '10', section: 'A', rollNo: '05', email: 'vihaan.joshi@edupro.edu' },
      { student_id: 'STU-2026-006', name: 'Diya Mehta',         grade: '10', section: 'A', rollNo: '06', email: 'diya.mehta@edupro.edu' },
      { student_id: 'STU-2026-007', name: 'Advik Reddy',        grade: '10', section: 'A', rollNo: '07', email: 'advik.reddy@edupro.edu' },
      { student_id: 'STU-2026-008', name: 'Ishaanvi Bose',      grade: '10', section: 'A', rollNo: '08', email: 'ishaanvi.bose@edupro.edu' },
      { student_id: 'STU-2026-009', name: 'Reyansh Patel',      grade: '10', section: 'A', rollNo: '09', email: 'reyansh.patel@edupro.edu' },
      { student_id: 'STU-2026-010', name: 'Myra Iyer',          grade: '10', section: 'A', rollNo: '10', email: 'myra.iyer@edupro.edu' },
      { student_id: 'STU-2026-011', name: 'Atharv Singh',       grade: '10', section: 'A', rollNo: '11', email: 'atharv.singh@edupro.edu' },
      { student_id: 'STU-2026-012', name: 'Aadya Sharma',       grade: '10', section: 'A', rollNo: '12', email: 'aadya.sharma@edupro.edu' },
      { student_id: 'STU-2026-101', name: 'Ishaan Sharma',      grade: '10', section: 'B', rollNo: '01', email: 'ishaan.sharma@edupro.edu' },
      { student_id: 'STU-2026-102', name: 'Kriti Verma',        grade: '10', section: 'B', rollNo: '02', email: 'kriti.verma@edupro.edu' },
      { student_id: 'STU-2026-103', name: 'Arjun Malhotra',     grade: '10', section: 'B', rollNo: '03', email: 'arjun.malhotra@edupro.edu' },
      { student_id: 'STU-2026-104', name: 'Riya Kapoor',        grade: '10', section: 'B', rollNo: '04', email: 'riya.kapoor@edupro.edu' },
      { student_id: 'STU-2026-105', name: 'Devendra Mishra',    grade: '10', section: 'B', rollNo: '05', email: 'devendra.mishra@edupro.edu' },
      { student_id: 'STU-2026-106', name: 'Neha Sharma',        grade: '10', section: 'B', rollNo: '06', email: 'neha.sharma@edupro.edu' },
      { student_id: 'STU-2026-107', name: 'Abhishek Singh',      grade: '10', section: 'B', rollNo: '07', email: 'abhishek.singh@edupro.edu' },
      { student_id: 'STU-2026-108', name: 'Meera Patel',        grade: '10', section: 'B', rollNo: '08', email: 'meera.patel@edupro.edu' },
      { student_id: 'STU-2026-109', name: 'Rohan Das',          grade: '10', section: 'B', rollNo: '09', email: 'rohan.das@edupro.edu' },
      { student_id: 'STU-2026-110', name: 'Nisha Patel',        grade: '10', section: 'B', rollNo: '10', email: 'nisha.patel@edupro.edu' },
      { student_id: 'STU-2026-111', name: 'Sameer Khan',        grade: '10', section: 'B', rollNo: '11', email: 'sameer.khan@edupro.edu' },
      { student_id: 'STU-2026-112', name: 'Divya Joshi',        grade: '10', section: 'B', rollNo: '12', email: 'divya.joshi@edupro.edu' },
      { student_id: 'STU-2026-201', name: 'Madhav Yadav',        grade: '09', section: 'A', rollNo: '01', email: 'madhav.yadav@edupro.edu' },
      { student_id: 'STU-2026-202', name: 'Ekta Kinger',        grade: '09', section: 'A', rollNo: '02', email: 'ekta.kinger@edupro.edu' },
      { student_id: 'STU-2026-203', name: 'Alok Verma',          grade: '09', section: 'A', rollNo: '03', email: 'alok.verma@edupro.edu' },
      { student_id: 'STU-2026-204', name: 'Shalini Sharma',      grade: '09', section: 'A', rollNo: '04', email: 'shalini.sharma@edupro.edu' },
      { student_id: 'STU-2026-205', name: 'Lokesh Hila',        grade: '09', section: 'A', rollNo: '05', email: 'lokesh.hila@edupro.edu' },
      { student_id: 'STU-2026-206', name: 'Aria Swamy',          grade: '09', section: 'A', rollNo: '06', email: 'aria.swamy@edupro.edu' },
      { student_id: 'STU-2026-207', name: 'Jatin Saxena',        grade: '09', section: 'A', rollNo: '07', email: 'jatin.saxena@edupro.edu' },
      { student_id: 'STU-2026-208', name: 'Lata Adhikari',      grade: '09', section: 'A', rollNo: '08', email: 'lata.adhikari@edupro.edu' },
      { student_id: 'STU-2026-209', name: 'Jagdish Bakshi',      grade: '09', section: 'A', rollNo: '09', email: 'jagdish.bakshi@edupro.edu' },
      { student_id: 'STU-2026-210', name: 'Charu Gokhale',      grade: '09', section: 'A', rollNo: '10', email: 'charu.gokhale@edupro.edu' },
      { student_id: 'STU-2026-211', name: 'Mukul Das',           grade: '09', section: 'A', rollNo: '11', email: 'mukul.das@edupro.edu' },
      { student_id: 'STU-2026-212', name: 'Lila Nair',           grade: '09', section: 'A', rollNo: '12', email: 'lila.nair@edupro.edu' },
      { student_id: 'STU-2026-301', name: 'Ojas Misra',         grade: '11', section: 'A', rollNo: '01', email: 'ojas.misra@edupro.edu' },
      { student_id: 'STU-2026-302', name: 'Geeta Patel',        grade: '11', section: 'A', rollNo: '02', email: 'geeta.patel@edupro.edu' },
      { student_id: 'STU-2026-303', name: 'Lokesh Roy',         grade: '11', section: 'A', rollNo: '03', email: 'lokesh.roy@edupro.edu' },
      { student_id: 'STU-2026-304', name: 'Zoya Tandon',        grade: '11', section: 'A', rollNo: '04', email: 'zoya.tandon@edupro.edu' },
      { student_id: 'STU-2026-305', name: 'Chetan Prasad',      grade: '11', section: 'A', rollNo: '05', email: 'chetan.prasad@edupro.edu' },
      { student_id: 'STU-2026-306', name: 'Leela Iyer',          grade: '11', section: 'A', rollNo: '06', email: 'leela.iyer@edupro.edu' },
      { student_id: 'STU-2026-307', name: 'Gaurav Pathak',      grade: '11', section: 'A', rollNo: '07', email: 'gaurav.pathak@edupro.edu' },
      { student_id: 'STU-2026-308', name: 'Himani Joshi',        grade: '11', section: 'A', rollNo: '08', email: 'himani.joshi@edupro.edu' },
      { student_id: 'STU-2026-309', name: 'Lokesh Ekka',        grade: '11', section: 'A', rollNo: '09', email: 'lokesh.ekka@edupro.edu' },
      { student_id: 'STU-2026-310', name: 'Esha Choudhury',     grade: '11', section: 'A', rollNo: '10', email: 'esha.choudhury@edupro.edu' },
      { student_id: 'STU-2026-311', name: 'Dilip Swaminathan',  grade: '11', section: 'A', rollNo: '11', email: 'dilip.swaminathan@edupro.edu' },
      { student_id: 'STU-2026-312', name: 'Vasundhara Sen',      grade: '11', section: 'A', rollNo: '12', email: 'vasundhara.sen@edupro.edu' }
    ];

    const matchedRef = attendanceRoster.find(r => r.student_id === targetId);
    
    if (matchedRef) {
      const idNum = parseInt(targetId.replace(/\D/g, '')) || 1;
      const rollNoNum = parseInt(matchedRef.rollNo);
      const isFemale = rollNoNum % 2 === 0;
      
      resolvedStudent = {
        student_id: targetId,
        name: matchedRef.name,
        email: matchedRef.email,
        phone: `+91 98765 43${String(100 + rollNoNum).slice(1)}`,
        class_id: matchedRef.grade,
        section: matchedRef.section,
        rollNo: matchedRef.rollNo,
        admission_date: '2026-01-12',
        gender: isFemale ? 'Female' : 'Male',
        status: 'Active',
        avatar: '',
        dob: `2010-${String(100 + (rollNoNum % 12) + 1).slice(1)}-12`,
        bloodGroup: ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-'][rollNoNum % 6],
        religion: 'Hinduism',
        parentName: `${matchedRef.name.split(' ').slice(1).join(' ') || 'Verma'} Sr.`,
        parentOccupation: ['Engineer', 'Doctor', 'Teacher', 'Architect', 'Business Manager'][rollNoNum % 5],
        parentPhone: `+91 98765 43${String(300 + rollNoNum).slice(1)}`,
        parentEmail: `${matchedRef.name.split(' ').slice(1).join('.').toLowerCase() || 'parent'}@example.com`,
        presentAddress: 'Block C, Sector 62, Noida, UP',
        permanentAddress: 'Block C, Sector 62, Noida, UP'
      };
    } else {
      const idNum = parseInt(targetId.replace(/\D/g, '')) || 999;
      if (targetId === '1' || idNum === 1) {
        resolvedStudent = {
          student_id: '1',
          name: 'Devendra Mishra',
          email: 'devendra.mishra@edupro.edu',
          phone: '+91 98765 43221',
          class_id: '10',
          section: 'A',
          rollNo: '42',
          admission_date: '2026-01-12',
          gender: 'Male',
          status: 'Active',
          avatar: indianMan2,
          dob: '2010-05-12',
          bloodGroup: 'O+',
          religion: 'Hinduism',
          parentName: 'Kailash Mishra',
          parentOccupation: 'Senior Business Executive',
          parentPhone: '+91 98765 43221',
          parentEmail: 'kailash.m@example.com',
          presentAddress: 'Gomti Nagar, Lucknow, UP',
          permanentAddress: 'Gomti Nagar, Lucknow, UP'
        };
      } else {
        resolvedStudent = {
          student_id: targetId,
          name: `Student ${targetId}`,
          email: `student.${idNum}@edupro.edu`,
          phone: `+91 98765 43${String(100 + (idNum % 100)).slice(1)}`,
          class_id: '10',
          section: 'A',
          rollNo: String(idNum % 30),
          admission_date: '2026-01-12',
          gender: idNum % 2 === 0 ? 'Female' : 'Male',
          status: 'Active',
          avatar: '',
          dob: '2010-05-12',
          bloodGroup: 'O+',
          religion: 'Hinduism',
          parentName: 'Parent Contact',
          parentOccupation: 'Employee',
          parentPhone: `+91 98765 43${String(300 + (idNum % 100)).slice(1)}`,
          parentEmail: 'parent@example.com',
          presentAddress: 'Block C, Sector 62, Noida, UP',
          permanentAddress: 'Block C, Sector 62, Noida, UP'
        };
      }
    }
  }

  if (resolvedStudent) {
    const isFemale = resolvedStudent.gender && resolvedStudent.gender.toLowerCase() === 'female';
    const nameCode = (resolvedStudent.name || '').charCodeAt(0) || 0;
    let defaultAvatar = isFemale ? indianWoman1 : indianMan1;
    if (isFemale) {
      defaultAvatar = nameCode % 2 === 0 ? indianWoman1 : indianWoman2;
    } else {
      defaultAvatar = nameCode % 2 === 0 ? indianMan1 : indianMan2;
    }

    const explicitMap = {
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

    resolvedStudent.avatar = resolvedStudent.avatar && resolvedStudent.avatar !== studentAvatar ? resolvedStudent.avatar : (explicitMap[resolvedStudent.student_id] || defaultAvatar);
  }

  const [studentStatus, setStudentStatus] = useState(resolvedStudent.status);
  
  React.useEffect(() => {
    setStudentStatus(resolvedStudent.status);
  }, [id, resolvedStudent.status]);

  const [showReinstateModal, setShowReinstateModal] = useState(false);
  const [reinstateReason, setReinstateReason] = useState('Term Completed');
  const [reinstateStep, setReinstateStep] = useState('confirm'); // 'confirm', 'processing', 'success'
  const [reinstateMsg, setReinstateMsg] = useState('Re-establishing school registry access...');

  const [suspensionStep, setSuspensionStep] = useState('confirm'); // 'confirm', 'processing', 'success'
  const [suspensionMsg, setSuspensionMsg] = useState('Transmitting disciplinary report...');

  const getAge = (dobString) => {
    if (!dobString) return '15 Years';
    const birthDate = new Date(dobString);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference); 
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);
    return `${years} Years`;
  };

  const student = {
    student_id: resolvedStudent.student_id,
    admissionNo: resolvedStudent.admissionNo || `ADM-2026-${resolvedStudent.student_id.replace('STU', '')}`,
    name: resolvedStudent.name,
    class: resolvedStudent.class_id || resolvedStudent.class || '10',
    section: resolvedStudent.section || 'A',
    rollNo: resolvedStudent.rollNo || '15',
    gender: resolvedStudent.gender ? (resolvedStudent.gender.charAt(0).toUpperCase() + resolvedStudent.gender.slice(1).toLowerCase()) : 'Male',
    dob: resolvedStudent.dob ? formatDateToTable(resolvedStudent.dob) : '12 May 2010',
    age: getAge(resolvedStudent.dob),
    phone: resolvedStudent.phone || '+1 234 567 890',
    email: resolvedStudent.email || 'john.doe@edupro.edu',
    status: studentStatus,
    color: resolvedStudent.gender?.toLowerCase() === 'female' ? '#10B981' : '#4880FF',
    academicYear: '2025-2026',
    admissionDate: resolvedStudent.admissionDate || (resolvedStudent.admission_date ? formatDateToTable(resolvedStudent.admission_date) : '01 Jan 2026'),
    religion: resolvedStudent.religion || 'Christianity',
    bloodGroup: resolvedStudent.bloodGroup || 'O+',
    height: resolvedStudent.gender?.toLowerCase() === 'female' ? '5.4 Ft' : '5.8 Ft',
    weight: resolvedStudent.gender?.toLowerCase() === 'female' ? '50 Kg' : '62 Kg',
    address: {
      current: resolvedStudent.presentAddress || '123 School Lane, Education City, NY 10001',
      permanent: resolvedStudent.permanentAddress || '456 West Avenue, Hometown, CA 90210'
    },
    parents: {
      father: { 
        name: resolvedStudent.parentName || `${resolvedStudent.name.split(' ').slice(1).join(' ') || 'Doe'} Sr.`, 
        occupation: resolvedStudent.parentOccupation || 'Engineer', 
        phone: resolvedStudent.parentPhone || '+1 987 654 321' 
      },
      mother: { name: `Sarah ${resolvedStudent.name.split(' ').slice(1).join(' ') || 'Doe'}`, occupation: 'Doctor', phone: '+1 987 654 322' },
      guardian: { 
        name: resolvedStudent.parentName || 'Guardian Contact', 
        relation: 'Father', 
        phone: resolvedStudent.parentPhone || '+91 98765 43210' 
      }
    },
    bank: {
      name: 'Global Trust Bank',
      accountNo: '8877665544',
      ifsc: 'GTB0001234'
    },
    avatar: resolvedStudent.avatar || resolvedStudent.img || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(resolvedStudent.name)}`
  };

  const handleDownload = (docName, fileType = 'PDF') => {
    setDownloadingDoc(docName);
    setTimeout(() => {
      const content = `
==================================================
        EDUPRO ACADEMY - OFFICIAL VERIFIED RECORD
==================================================
Document:      ${docName.toUpperCase()}
Document Type: ${fileType}
Student Name:  ${student.name}
Admission No:  ${student.admissionNo}
Class/Sec:     Class ${student.class}-${student.section}
Status:        VERIFIED & ARCHIVED
Date Exported: ${new Date().toLocaleDateString()}
==================================================
This certificate proves registration and authenticity of the 
above student's documents in the EduPro Student Registry.
      `;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${docName.toLowerCase().replace(/\s+/g, '_')}_${student.admissionNo}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadingDoc(null);
    }, 1200);
  };

  const handleExportAttendanceLog = () => {
    setDownloadingDoc('Attendance Log');
    setTimeout(() => {
      const headers = ['Date', 'Status', 'Time In', 'Time Out', 'Remarks'];
      const data = [
        ['10 May 2026', 'Present', '08:45 AM', '03:30 PM', 'On Time'],
        ['09 May 2026', 'Late', '09:15 AM', '03:30 PM', 'Bus Delayed'],
        ['08 May 2026', 'Present', '08:50 AM', '03:30 PM', 'On Time'],
        ['05 May 2026', 'Absent', '-', '-', 'Family Emergency'],
      ];
      const csvContent = [
        headers.join(','),
        ...data.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `attendance_log_${student.admissionNo}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadingDoc(null);
    }, 1200);
  };

  const handleDownloadReceipt = (invoiceId, feeType, amount) => {
    setDownloadingDoc(invoiceId);
    setTimeout(() => {
      const content = `
==================================================
           EDUPRO ACADEMY - FEE RECEIPT
==================================================
Receipt ID:    REC-${invoiceId.replace('#', '')}
Student Name:  ${student.name}
Admission No:  ${student.admissionNo}
Class/Sec:     Class ${student.class}-${student.section}
Fee Category:  ${feeType}
Paid Amount:   ${amount}
Payment Status: SUCCESSFUL / CLEARED
Date Cleared:  ${new Date().toLocaleDateString()}
==================================================
Thank you for your payment. Keep this copy for your records.
      `;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `receipt_${invoiceId.replace('#', '').toLowerCase()}_${student.admissionNo}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadingDoc(null);
    }, 1200);
  };

  const handleDownloadReportCard = (term = 'Annual Exam 2025-26') => {
    setDownloadingDoc('Report Card');
    setTimeout(() => {
      const data = examsData[term] || examsData['Annual Exam 2025-26'];
      const subjectsText = data.subjects.map(s => `${s.subject.padEnd(16)}:  ${String(s.obtained).padStart(2)} / ${s.max}   (Grade: ${s.grade})`).join('\n');
      
      const totalObtained = data.subjects.reduce((sum, s) => sum + s.obtained, 0);
      const totalMax = data.subjects.reduce((sum, s) => sum + s.max, 0);
      const pct = ((totalObtained / totalMax) * 100).toFixed(1);
      
      const content = `
==================================================
           EDUPRO ACADEMY - REPORT CARD
==================================================
Academic Session: 2025-2026
Term:             ${term}
Student Name:     ${student.name}
Admission No:     ${student.admissionNo}
Class/Sec:        Class ${student.class}-${student.section}

Subject Marks:
--------------------------------------------------
${subjectsText}

Summary:
--------------------------------------------------
Total Marks    : ${totalObtained} / ${totalMax}
Percentage     : ${pct}%
GPA            : ${data.gpa}
Class Position : ${data.position}
Attendance     : ${data.attendance}
Status         : PROMOTED TO GRADE 11

Principal Signature: ____________________________
      `;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `report_card_${term.replace(/\s+/g, '_').toLowerCase()}_${student.admissionNo}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadingDoc(null);
    }, 1200);
  };


  const tabs = [
    { id: 'details', label: 'Student Details', icon: <User size={16} /> },
    { id: 'attendance', label: 'Attendance', icon: <Clock size={16} /> },
    { id: 'fees', label: 'Fees History', icon: <CreditCard size={16} /> },
    { id: 'exams', label: 'Exam Records', icon: <Award size={16} /> },
    { id: 'library', label: 'Library', icon: <Library size={16} /> },
    { id: 'leaves', label: 'Leaves', icon: <CalendarDays size={16} /> },
    { id: 'documents', label: 'Documents', icon: <FileText size={16} /> }
  ];

  const handlePrintID = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print ID Card - ${student.name}</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: 'Inter', sans-serif; }
            .id-card {
              width: 350px; height: 520px; background: white; border-radius: 24px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; position: relative;
              border: 1px solid #e2e8f0; font-family: sans-serif;
            }
            .header { height: 140px; background: ${student.color}; padding: 24px; color: white; text-align: center; }
            .photo {
              width: 120px; height: 120px; border-radius: 50%; border: 6px solid white;
              background: #f1f5f9; position: absolute; top: 80px; left: 50%; transform: translateX(-50%);
              overflow: hidden;
            }
            .photo img { width: 100%; height: 100%; object-fit: cover; }
            .content { marginTop: 70px; text-align: center; padding: 24px; }
            .info { margin-top: 32px; display: grid; gap: 12px; text-align: left; }
            .info-row { display: flex; justify-content: space-between; font-size: 14px; }
            .label { color: #64748b; }
            .value { font-weight: 700; }
            @page { size: auto; margin: 0; }
          </style>
        </head>
        <body>
          <div class="id-card">
            <div class="header">
              <h2 style="margin:0; font-size: 22px;">EDUPRO ACADEMY</h2>
              <p style="margin:0; opacity: 0.8; font-size: 12px;">Excellence in Education</p>
            </div>
            <div class="photo">
              <img src="${student.avatar}" />
            </div>
            <div class="content" style="margin-top: 70px;">
              <h3 style="font-size: 20px; margin: 0 0 4px 0;">${student.name}</h3>
              <span style="background: ${student.color}20; color: ${student.color}; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 800;">STUDENT</span>
              <div class="info">
                <div class="info-row"><span class="label">Student ID:</span><span class="value">${student.admissionNo}</span></div>
                <div class="info-row"><span class="label">Class:</span><span class="value">Class ${student.class}-${student.section}</span></div>
                <div class="info-row"><span class="label">Blood Group:</span><span class="value" style="color: #ef4444;">${student.bloodGroup}</span></div>
                <div class="info-row"><span class="label">Phone:</span><span class="value">${student.phone}</span></div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintReceipt = (item) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const formattedAmount = typeof item.amount === 'number' ? `$${item.amount.toFixed(2)}` : item.amount;
    const isPaid = item.status === 'Paid';
    const statusBg = isPaid ? 'rgba(40, 167, 69, 0.08)' : 'rgba(220, 53, 69, 0.08)';
    const statusColor = isPaid ? '#2e7d32' : '#c62828';
    const dateCleared = isPaid ? item.date : 'N/A';
    const paymentMethodText = isPaid ? item.method : 'N/A';
    const barcodeText = `ADM${student.admissionNo.replace(/-/g, '')}${item.id.replace('#', '').replace(/-/g, '')}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Fee Receipt - ${item.id} - ${student.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
            
            body {
              font-family: 'Outfit', sans-serif;
              color: #0f172a;
              background-color: #ffffff;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .receipt-container {
              max-width: 700px;
              margin: 40px auto;
              padding: 40px;
              border: 1px solid #e2e8f0;
              border-radius: 24px;
              background: #ffffff;
              box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
              position: relative;
              overflow: hidden;
            }
            
            .watermark {
              position: absolute;
              top: -30px;
              right: -30px;
              width: 180px;
              height: 180px;
              border-radius: 50%;
              border: 8px dashed rgba(72, 128, 255, 0.04);
              display: flex;
              align-items: center;
              justify-content: center;
              transform: rotate(25deg);
              pointer-events: none;
            }
            
            .watermark-inner {
              color: rgba(72, 128, 255, 0.04);
              font-size: 14px;
              font-weight: 800;
              letter-spacing: 3px;
              text-align: center;
              text-transform: uppercase;
            }

            .header-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              align-items: start;
              gap: 20px;
              border-bottom: 2px solid #f1f5f9;
              padding-bottom: 30px;
              margin-bottom: 30px;
            }
            
            .school-logo-area {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            
            .logo-icon {
              width: 48px;
              height: 48px;
              border-radius: 14px;
              background: linear-gradient(135deg, #4880FF 0%, #1e40af 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 900;
              font-size: 20px;
              box-shadow: 0 4px 10px rgba(72, 128, 255, 0.2);
            }
            
            .school-name {
              font-size: 22px;
              font-weight: 900;
              letter-spacing: -0.5px;
              margin: 0;
              color: #0f172a;
            }
            
            .school-tagline {
              font-size: 11px;
              color: #64748b;
              margin: 2px 0 0 0;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .school-contact {
              font-size: 12px;
              color: #64748b;
              margin-top: 10px;
              line-height: 1.6;
            }
            
            .invoice-meta {
              text-align: right;
            }
            
            .receipt-badge {
              display: inline-block;
              padding: 6px 14px;
              background-color: ${statusBg};
              color: ${statusColor};
              border-radius: 9999px;
              font-size: 12px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 12px;
            }
            
            .invoice-title {
              font-size: 24px;
              font-weight: 900;
              color: #0f172a;
              margin: 0 0 8px 0;
            }
            
            .meta-details {
              font-size: 13px;
              color: #64748b;
              line-height: 1.5;
            }
            
            .meta-details strong {
              color: #0f172a;
            }
            
            .section-title {
              font-size: 12px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              color: #64748b;
              margin: 0 0 12px 0;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 35px;
            }
            
            .info-card {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              padding: 20px;
            }
            
            .info-row {
              display: flex;
              justify-content: space-between;
              font-size: 13.5px;
              line-height: 2;
            }
            
            .info-label {
              color: #64748b;
              font-weight: 500;
            }
            
            .info-value {
              color: #0f172a;
              font-weight: 700;
            }
            
            .table-container {
              margin-bottom: 35px;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              text-align: left;
            }
            
            th {
              padding: 12px 16px;
              background-color: #f8fafc;
              border-bottom: 2px solid #e2e8f0;
              color: #64748b;
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            td {
              padding: 16px;
              border-bottom: 1px solid #f1f5f9;
              font-size: 14px;
              color: #0f172a;
            }
            
            .total-section {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              gap: 8px;
              padding: 20px 16px;
              background-color: #f8fafc;
              border-radius: 16px;
              border: 1px solid #e2e8f0;
              margin-bottom: 35px;
            }
            
            .total-row {
              display: flex;
              justify-content: space-between;
              width: 250px;
              font-size: 13.5px;
            }
            
            .total-row.grand-total {
              border-top: 2px dashed #cbd5e1;
              margin-top: 8px;
              padding-top: 12px;
              font-size: 16px;
              font-weight: 900;
            }
            
            .total-label {
              color: #64748b;
              font-weight: 500;
            }
            
            .total-val {
              color: #0f172a;
              font-weight: 700;
            }
            
            .grand-total .total-val {
              color: ${isPaid ? '#2e7d32' : '#c62828'};
            }
            
            .stamp-barcode-container {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-top: 1px dashed #cbd5e1;
              padding-top: 30px;
              margin-bottom: 10px;
            }
            
            .barcode-area {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 4px;
            }
            
            .barcode-svg {
              width: 180px;
              height: 50px;
            }
            
            .auth-sign-area {
              text-align: right;
            }
            
            .sign-line {
              width: 160px;
              border-bottom: 1.5px solid #0f172a;
              margin-bottom: 8px;
              margin-left: auto;
              height: 40px;
              position: relative;
            }
            
            .sign-stamp-img {
              position: absolute;
              bottom: -15px;
              right: 15px;
              opacity: 0.12;
              width: 70px;
              pointer-events: none;
            }
            
            .sign-label {
              font-size: 11px;
              font-weight: 700;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .footer-notice {
              text-align: center;
              font-size: 11px;
              color: #94a3b8;
              margin-top: 30px;
              line-height: 1.6;
            }
            
            @media print {
              body {
                background-color: white !important;
              }
              .receipt-container {
                border: none;
                box-shadow: none;
                margin: 0;
                padding: 20px;
                max-width: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="watermark">
              <div class="watermark-inner">EduPro<br>Verified</div>
            </div>
            
            <div class="header-grid">
              <div>
                <div class="school-logo-area">
                  <div class="logo-icon">EP</div>
                  <div>
                    <h1 class="school-name">EDUPRO ACADEMY</h1>
                    <p class="school-tagline">Excellence in Education</p>
                  </div>
                </div>
                <div class="school-contact">
                  123 School Lane, Education City, NY 10001<br>
                  Phone: +1 234 567 890 | Email: accounts@edupro.edu
                </div>
              </div>
              <div class="invoice-meta">
                <span class="receipt-badge">${item.status}</span>
                <h2 class="invoice-title">${item.id}</h2>
                <div class="meta-details">
                  <div><strong>Date Issued:</strong> ${item.date !== '-' ? item.date : new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                  <div><strong>Transaction Reference:</strong> TXN-${barcodeText}</div>
                </div>
              </div>
            </div>
            
            <div class="info-grid">
              <div>
                <div class="section-title">Student Information</div>
                <div class="info-card">
                  <div class="info-row">
                    <span class="info-label">Full Name:</span>
                    <span class="info-value">${student.name}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Admission No:</span>
                    <span class="info-value">${student.admissionNo}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Class & Section:</span>
                    <span class="info-value">Class ${student.class}-${student.section}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Academic Year:</span>
                    <span class="info-value">${student.academicYear}</span>
                  </div>
                </div>
              </div>
              <div>
                <div class="section-title">Payment Summary</div>
                <div class="info-card">
                  <div class="info-row">
                    <span class="info-label">Payment Date:</span>
                    <span class="info-value">${dateCleared}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Payment Method:</span>
                    <span class="info-value">${paymentMethodText}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Gateway Status:</span>
                    <span class="info-value" style="color: ${statusColor}; font-weight: 800;">${isPaid ? 'SUCCESS / CLEARED' : 'UNPAID / OUTSTANDING'}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Account Balance:</span>
                    <span class="info-value" style="color: ${isPaid ? '#2e7d32' : '#c62828'}">${isPaid ? '$0.00' : formattedAmount}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="section-title">Transaction Details</div>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Unit Price</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="font-weight: 600;">
                      ${item.type}<br>
                      <small style="color: #64748b; font-weight: 400; font-size: 11px;">Official institutional fee item billed for Class ${student.class}</small>
                    </td>
                    <td style="text-align: center; font-weight: 500;">1</td>
                    <td style="text-align: right; font-weight: 500;">${formattedAmount}</td>
                    <td style="text-align: right; font-weight: 700;">${formattedAmount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="total-section">
              <div class="total-row">
                <span class="total-label">Subtotal:</span>
                <span class="total-val">${formattedAmount}</span>
              </div>
              <div class="total-row">
                <span class="total-label">Tax / Processing Fee:</span>
                <span class="total-val">$0.00</span>
              </div>
              <div class="total-row">
                <span class="total-label">Discount:</span>
                <span class="total-val">$0.00</span>
              </div>
              <div class="total-row grand-total">
                <span class="total-label">${isPaid ? 'Amount Paid:' : 'Amount Due:'}</span>
                <span class="total-val">${formattedAmount}</span>
              </div>
            </div>
            
            <div class="stamp-barcode-container">
              <div class="barcode-area">
                <svg class="barcode-svg" viewBox="0 0 200 60">
                  <rect x="0" y="0" width="200" height="60" fill="none"/>
                  <g fill="#0f172a">
                    <rect x="15" y="5" width="2" height="35"/>
                    <rect x="19" y="5" width="4" height="35"/>
                    <rect x="25" y="5" width="1" height="35"/>
                    <rect x="28" y="5" width="3" height="35"/>
                    <rect x="33" y="5" width="2" height="35"/>
                    <rect x="37" y="5" width="1" height="35"/>
                    <rect x="40" y="5" width="4" height="35"/>
                    <rect x="46" y="5" width="2" height="35"/>
                    <rect x="50" y="5" width="1" height="35"/>
                    <rect x="53" y="5" width="3" height="35"/>
                    <rect x="58" y="5" width="2" height="35"/>
                    <rect x="62" y="5" width="4" height="35"/>
                    <rect x="68" y="5" width="1" height="35"/>
                    <rect x="71" y="5" width="2" height="35"/>
                    <rect x="75" y="5" width="3" height="35"/>
                    <rect x="80" y="5" width="1" height="35"/>
                    <rect x="83" y="5" width="4" height="35"/>
                    <rect x="89" y="5" width="2" height="35"/>
                    <rect x="93" y="5" width="1" height="35"/>
                    <rect x="96" y="5" width="3" height="35"/>
                    <rect x="101" y="5" width="2" height="35"/>
                    <rect x="105" y="5" width="4" height="35"/>
                    <rect x="111" y="5" width="1" height="35"/>
                    <rect x="114" y="5" width="3" height="35"/>
                    <rect x="119" y="5" width="2" height="35"/>
                    <rect x="123" y="5" width="1" height="35"/>
                    <rect x="126" y="5" width="4" height="35"/>
                    <rect x="132" y="5" width="2" height="35"/>
                    <rect x="136" y="5" width="1" height="35"/>
                    <rect x="139" y="5" width="3" height="35"/>
                    <rect x="144" y="5" width="2" height="35"/>
                    <rect x="148" y="5" width="4" height="35"/>
                    <rect x="154" y="5" width="1" height="35"/>
                    <rect x="157" y="5" width="3" height="35"/>
                    <rect x="162" y="5" width="2" height="35"/>
                    <rect x="166" y="5" width="1" height="35"/>
                    <rect x="170" y="5" width="4" height="35"/>
                    <rect x="176" y="5" width="2" height="35"/>
                    <rect x="180" y="5" width="3" height="35"/>
                  </g>
                  <text x="100" y="53" font-family="'Courier New', Courier, monospace" font-size="8" text-anchor="middle" letter-spacing="2">${barcodeText}</text>
                </svg>
              </div>
              <div class="auth-sign-area">
                <div class="sign-line">
                  <svg class="sign-stamp-img" viewBox="0 0 100 100" style="left: 20px; bottom: 0;">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#4880FF" stroke-width="2" stroke-dasharray="4 2"/>
                    <text x="50" y="45" font-size="8" fill="#4880FF" font-weight="bold" text-anchor="middle">EDUPRO</text>
                    <text x="50" y="58" font-size="6" fill="#4880FF" font-weight="bold" text-anchor="middle">ACADEMY</text>
                    <text x="50" y="70" font-size="5" fill="#28a745" font-weight="bold" text-anchor="middle">ACCOUNTS DEPT</text>
                  </svg>
                </div>
                <div class="sign-label">Authorized Signatory</div>
              </div>
            </div>
            
            <div class="footer-notice">
              This is a computer-generated fee receipt document verified securely via SSL portal.<br>
              Thank you for supporting excellence in education at EduPro Academy.
            </div>
          </div>
          
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 600);
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [suspensionDuration, setSuspensionDuration] = useState('1 Week');

  // Reactive Fee Ledger States
  const [feeLedger, setFeeLedger] = useState([
    { id: '#INV-9821', type: 'Tuition Fee (May)', amount: 450.00, date: '05 May 2026', status: 'Paid', method: 'Online' },
    { id: '#INV-9742', type: 'Transport Fee (May)', amount: 80.00, date: '05 May 2026', status: 'Paid', method: 'Online' },
    { id: '#INV-9610', type: 'Tuition Fee (April)', amount: 450.00, date: '02 Apr 2026', status: 'Paid', method: 'Cash' },
    { id: '#INV-9501', type: 'Examination Fee', amount: 120.00, date: '15 Mar 2026', status: 'Paid', method: 'Bank Transfer' },
    { id: '#INV-9411', type: 'Registration Fee', amount: 150.00, date: '01 Jan 2026', status: 'Paid', method: 'Cash' },
    { id: '#INV-PEND', type: 'Tuition Fee (June)', amount: 450.00, date: '-', status: 'Pending', method: '-' },
  ]);
  const [totalPaid, setTotalPaid] = useState(2850.00);
  const [totalDue, setTotalDue] = useState(450.00);

  const [selectedExam, setSelectedExam] = useState('Annual Exam 2025-26');

  const examsData = {
    'Annual Exam 2025-26': {
      gpa: '3.85 / 4.0',
      position: '4th / 42',
      totalMarks: '542 / 600',
      attendance: '96%',
      remarks: '"Robert has shown consistent improvement in quantitative subjects. His grasp of complex Physics concepts is commendable. Recommended for Advanced Mathematics track next session."',
      comparison: [
        { term: 'Term 1', score: 85, color: 'var(--primary)' },
        { term: 'Term 2', score: 92, color: 'var(--success)' },
        { term: 'Term 3 (Current)', score: 95, color: '#8b5cf6' }
      ],
      subjects: [
        { subject: 'Mathematics', max: 100, obtained: 95, grade: 'A+', result: 'Pass' },
        { subject: 'Physics', max: 100, obtained: 88, grade: 'A', result: 'Pass' },
        { subject: 'Chemistry', max: 100, obtained: 92, grade: 'A', result: 'Pass' },
        { subject: 'English', max: 100, obtained: 85, grade: 'B+', result: 'Pass' },
        { subject: 'Computer Science', max: 100, obtained: 98, grade: 'A+', result: 'Pass' },
        { subject: 'History', max: 100, obtained: 84, grade: 'B', result: 'Pass' },
      ]
    },
    'Mid-Term Exam 2025-26': {
      gpa: '3.78 / 4.0',
      position: '6th / 42',
      totalMarks: '525 / 600',
      attendance: '94%',
      remarks: '"Robert performed well across all sections, especially in Computer Science. He needs to pay slightly more attention to History and English reading comprehension."',
      comparison: [
        { term: 'Term 1', score: 85, color: 'var(--primary)' },
        { term: 'Term 2 (Current)', score: 92, color: 'var(--success)' },
        { term: 'Term 3', score: 0, color: '#8b5cf6' }
      ],
      subjects: [
        { subject: 'Mathematics', max: 100, obtained: 91, grade: 'A', result: 'Pass' },
        { subject: 'Physics', max: 100, obtained: 82, grade: 'B+', result: 'Pass' },
        { subject: 'Chemistry', max: 100, obtained: 89, grade: 'A', result: 'Pass' },
        { subject: 'English', max: 100, obtained: 88, grade: 'A', result: 'Pass' },
        { subject: 'Computer Science', max: 100, obtained: 95, grade: 'A+', result: 'Pass' },
        { subject: 'History', max: 100, obtained: 80, grade: 'B', result: 'Pass' },
      ]
    },
    'Quarterly Exam 2025-26': {
      gpa: '3.90 / 4.0',
      position: '2nd / 42',
      totalMarks: '556 / 600',
      attendance: '98%',
      remarks: '"An exceptional start to the academic session! Robert scored almost perfect marks in Computer Science and Chemistry. Keep up the brilliant momentum."',
      comparison: [
        { term: 'Term 1 (Current)', score: 85, color: 'var(--primary)' },
        { term: 'Term 2', score: 0, color: 'var(--success)' },
        { term: 'Term 3', score: 0, color: '#8b5cf6' }
      ],
      subjects: [
        { subject: 'Mathematics', max: 100, obtained: 98, grade: 'A+', result: 'Pass' },
        { subject: 'Physics', max: 100, obtained: 92, grade: 'A', result: 'Pass' },
        { subject: 'Chemistry', max: 100, obtained: 95, grade: 'A+', result: 'Pass' },
        { subject: 'English', max: 100, obtained: 84, grade: 'B', result: 'Pass' },
        { subject: 'Computer Science', max: 100, obtained: 99, grade: 'A+', result: 'Pass' },
        { subject: 'History', max: 100, obtained: 88, grade: 'A', result: 'Pass' },
      ]
    }
  };
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState('input'); // 'input', 'processing', 'success'
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'bank', 'paypal'
  const [processingMsg, setProcessingMsg] = useState('Establishing encrypted connection...');

  // CC Input States
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(formatted.slice(0, 19));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(value);
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCardCvv(value.slice(0, 3));
  };

  const getCardType = () => {
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5')) return 'Mastercard';
    return 'Credit Card';
  };

  const handleConfirmPayment = () => {
    setPaymentStep('processing');
    setProcessingMsg('Establishing secure payment socket...');
    
    setTimeout(() => {
      setProcessingMsg('Authenticating with bank gateway...');
    }, 600);

    setTimeout(() => {
      setProcessingMsg('Verifying secure payment token...');
    }, 1200);
    
    setTimeout(() => {
      setProcessingMsg('Finalizing ledger and balance transfer...');
    }, 1800);

    setTimeout(() => {
      setPaymentStep('success');
      setTotalPaid(prev => prev + 450.00);
      setTotalDue(0.00);
      setFeeLedger(prev => prev.map(item => {
        if (item.id === '#INV-PEND') {
          return {
            ...item,
            status: 'Paid',
            date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
            method: paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'bank' ? 'Bank Transfer' : 'PayPal'
          };
        }
        return item;
      }));
    }, 2400);
  };

  const handleConfirmSuspend = () => {
    setSuspensionStep('processing');
    setSuspensionMsg('Transmitting disciplinary report to administrative registry...');
    
    setTimeout(() => {
      setSuspensionMsg('Deactivating electronic student ID access tokens...');
    }, 600);

    setTimeout(() => {
      setSuspensionMsg('Applying institutional firewall block on classroom modules...');
    }, 1200);

    setTimeout(() => {
      setStudentStatus('Suspended');
      
      // Update in localStorage
      const stored = localStorage.getItem('students');
      if (stored) {
        const list = JSON.parse(stored);
        const updated = list.map(s => s.student_id === targetId ? { ...s, status: 'Suspended' } : s);
        localStorage.setItem('students', JSON.stringify(updated));
      }
      
      setSuspensionStep('success');
    }, 2000);
  };

  const handleConfirmReinstate = () => {
    setReinstateStep('processing');
    setReinstateMsg('Re-establishing school registry access and database hooks...');
    
    setTimeout(() => {
      setReinstateMsg('Revoking disciplinary blocks from institutional firewalls...');
    }, 600);

    setTimeout(() => {
      setReinstateMsg('Re-synchronizing student cards and attendance registry indices...');
    }, 1200);

    setTimeout(() => {
      setStudentStatus('Active');
      
      // Update in localStorage
      const stored = localStorage.getItem('students');
      if (stored) {
        const list = JSON.parse(stored);
        const updated = list.map(s => s.student_id === targetId ? { ...s, status: 'Active' } : s);
        localStorage.setItem('students', JSON.stringify(updated));
      }
      
      setReinstateStep('success');
    }, 1800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px' }}
    >
      {/* Breadcrumbs & Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 600 }}>
            <span>Dashboard</span> <ChevronRight size={14} /> <span>Students</span> <ChevronRight size={14} /> <span style={{ color: student.color }}>Student Details</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>Student Profile</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn" onClick={handlePrintID} style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={18} /> Print ID
          </button>
          <button className="btn btn-primary" style={{ backgroundColor: student.color }} onClick={() => navigate(`/dashboard/edit-student/${id || student.admissionNo}`)}>
            <Edit size={18} /> Edit Profile
          </button>
        </div>
      </div>

      {/* 2-Column Asymmetric Profile Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Left Column: Physical-Style Digital Student ID Badge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', backgroundColor: 'var(--bg-card)' }}>
            {/* ID Card Header Banner */}
            <div style={{ height: '90px', background: `linear-gradient(135deg, ${student.color} 0%, ${student.color}dd 100%)`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'white' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.8 }}>Institutional ID Card</div>
              <div style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '-0.5px', marginTop: '2px' }}>EDUPRO ACADEMY</div>
              
              {/* Decorative chip */}
              <div style={{ position: 'absolute', bottom: '-15px', left: '24px', width: '36px', height: '26px', borderRadius: '6px', backgroundColor: '#ffd700', opacity: 0.9, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '24px', height: '16px', border: '1px solid #b7950b', borderRadius: '4px', opacity: 0.4 }} />
              </div>
            </div>

            <div style={{ padding: '32px 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              {/* Photo Frame */}
              <div style={{ 
                width: '120px', height: '120px', borderRadius: '50%', border: `6px solid white`, 
                boxShadow: 'var(--shadow-lg)', overflow: 'hidden', marginBottom: '16px',
                backgroundColor: 'var(--bg-body)', position: 'relative'
              }}>
                {student.avatar && (student.avatar.startsWith('data:') || student.avatar.startsWith('http') || student.avatar.startsWith('/') || student.avatar.startsWith('.')) ? (
                  <img 
                    src={student.avatar} 
                    alt={student.name} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`;
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} 
                    alt={student.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                )}
              </div>

              {/* Name and Status */}
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 6px 0', color: 'var(--text-main)' }}>{student.name}</h2>
              <span style={{ 
                padding: '4px 12px', 
                backgroundColor: studentStatus === 'Suspended' ? 'var(--danger-light)' : 'var(--success-light)', 
                color: studentStatus === 'Suspended' ? 'var(--danger)' : 'var(--success)', 
                borderRadius: '100px', 
                fontSize: '0.7rem', 
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '20px'
              }}>
                {studentStatus}
              </span>

              {/* Barcode Graphic using CSS stripes */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', margin: '8px 0 20px 0', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                <div style={{ 
                  width: '180px', height: '35px', 
                  backgroundImage: 'linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 5px, transparent 5px, transparent 8px, #000 8px, #000 11px, transparent 11px, transparent 12px, #000 12px, #000 13px, transparent 13px, transparent 16px, #000 16px, #000 17px, transparent 17px, transparent 19px, #000 19px, #000 22px, transparent 22px, transparent 24px, #000 24px, #000 25px)',
                  backgroundSize: '28px 100%' 
                }} />
                <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px' }}>{student.admissionNo}</span>
              </div>

              {/* ID Metadata list */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', textAlign: 'left', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Grade/Section:</span>
                  <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>Class {student.class}-{student.section}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Roll Number:</span>
                  <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>#{student.rollNo}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Blood Group:</span>
                  <span style={{ fontWeight: 900, color: 'var(--danger)' }}>{student.bloodGroup}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Scholarship Tier:</span>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>10% Merit Tier</span>
                </div>
              </div>

              {/* Quick Actions inside Card */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {studentStatus === 'Suspended' ? (
                  <button 
                    className="btn" 
                    onClick={() => {
                      setReinstateStep('confirm');
                      setReinstateReason('Term Completed');
                      setShowReinstateModal(true);
                    }}
                    style={{ 
                      width: '100%',
                      color: 'var(--success)', 
                      backgroundColor: 'rgba(16, 185, 129, 0.08)', 
                      border: '1px solid rgba(16, 185, 129, 0.2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      borderRadius: '12px',
                      padding: '11px'
                    }}
                  >
                    <CircleCheck size={16} /> Lift Suspension
                  </button>
                ) : (
                  <button 
                    className="btn" 
                    onClick={() => {
                      setSuspensionStep('confirm');
                      setSuspensionReason('');
                      setShowSuspendModal(true);
                    }}
                    style={{ 
                      width: '100%',
                      color: 'var(--danger)', 
                      backgroundColor: 'rgba(220, 53, 69, 0.08)', 
                      border: '1px solid rgba(220, 53, 69, 0.2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      borderRadius: '12px',
                      padding: '11px'
                    }}
                  >
                    <ShieldAlert size={16} /> Suspend Student
                  </button>
                )}
                
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <button className="btn" onClick={handlePrintID} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 800, fontSize: '0.8rem' }}>
                    <Printer size={14} /> Print ID
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1, padding: '10px', borderRadius: '12px', backgroundColor: student.color, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.8rem' }} onClick={() => navigate(`/dashboard/edit-student/${id || student.admissionNo}`)}>
                    <Edit size={14} /> Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Emergency / Health Notice */}
          <div style={{ padding: '20px', backgroundColor: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '20px', color: '#dc2626' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <ShieldAlert size={16} /> Medical Notice
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', lineHeight: 1.5, fontWeight: 650, color: 'var(--text-muted)' }}>
              Patient exhibits high sensitivity/allergy to peanuts. Epinephrine auto-injector is registered and archived in school medical clinic division storage block B.
            </p>
          </div>
        </div>

        {/* Right Column: Tabbed Records & Achievements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Merit Badges & Achievements Bar */}
          <div className="card" style={{ padding: '20px 24px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `linear-gradient(135deg, var(--bg-card) 0%, var(--bg-body) 100%)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Award size={20} color="#f59e0b" />
              <span style={{ fontSize: '0.9rem', fontWeight: 850, color: 'var(--text-main)' }}>Student Merit Achievements</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { label: 'Honor Roll 🏅', color: '#f59e0b', bg: '#f59e0b10' },
                { label: 'Perfect Attendance 📅', color: '#10b981', bg: '#10b98110' },
                { label: 'STEM Star 🌟', color: '#3b82f6', bg: '#3b82f610' }
              ].map((badge, idx) => (
                <span key={idx} style={{ padding: '6px 14px', borderRadius: '10px', backgroundColor: badge.bg, color: badge.color, fontSize: '0.72rem', fontWeight: 900 }}>
                  {badge.label}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="card" style={{ padding: '6px', borderRadius: '18px', display: 'flex', gap: '4px', border: '1px solid var(--border-color)' }}>
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ 
                  flex: 1, padding: '12px 0', borderRadius: '12px', border: 'none',
                  backgroundColor: activeTab === tab.id ? student.color : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  cursor: 'pointer', transition: '0.3s', fontWeight: 850, fontSize: '0.85rem'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div style={{ minHeight: 'auto' }}>
            <AnimatePresence mode="wait">
              {activeTab === 'details' && (
                <motion.div key="details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                
                {/* Personal Information */}
                <div className="card" style={{ gridColumn: 'span 2', padding: '32px' }}>
                  <h3 style={{ margin: '0 0 24px 0', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <User size={20} color={student.color} /> Personal Information
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                    {[
                      { label: 'Class', value: student.class },
                      { label: 'Section', value: student.section },
                      { label: 'Roll No', value: student.rollNo },
                      { label: 'Gender', value: student.gender },
                      { label: 'Date of Birth', value: student.dob },
                      { label: 'Age', value: student.age },
                      { label: 'Academic Year', value: student.academicYear },
                      { label: 'Religion', value: student.religion },
                      { label: 'Blood Group', value: student.bloodGroup }
                    ].map((info, i) => (
                      <div key={i}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>{info.label}</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{info.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="card" style={{ padding: '32px' }}>
                  <h3 style={{ margin: '0 0 24px 0', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Phone size={20} color={student.color} /> Contact Details
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Phone Number</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700 }}><Phone size={14} color={student.color} /> {student.phone}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Email Address</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700 }}><Mail size={14} color={student.color} /> {student.email}</div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="card" style={{ gridColumn: 'span 3', padding: '32px' }}>
                  <h3 style={{ margin: '0 0 24px 0', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MapPin size={20} color={student.color} /> Address Information
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Current Address</div>
                      <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.6 }}>
                        {student.address.current}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Permanent Address</div>
                      <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.6 }}>
                        {student.address.permanent}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parent / Guardian Information */}
                <div className="card" style={{ gridColumn: 'span 3', padding: '32px' }}>
                  <h3 style={{ margin: '0 0 32px 0', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Shield size={20} color={student.color} /> Parent & Guardian Information
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                    {/* Father */}
                    <div style={{ padding: '24px', backgroundColor: 'var(--bg-body)', borderRadius: '20px' }}>
                      <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: student.color }}>Father's Details</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div><small style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Name:</small> <span style={{ fontWeight: 700 }}>{student.parents.father.name}</span></div>
                        <div><small style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Occupation:</small> <span style={{ fontWeight: 700 }}>{student.parents.father.occupation}</span></div>
                        <div><small style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Phone:</small> <span style={{ fontWeight: 700 }}>{student.parents.father.phone}</span></div>
                      </div>
                    </div>
                    {/* Mother */}
                    <div style={{ padding: '24px', backgroundColor: 'var(--bg-body)', borderRadius: '20px' }}>
                      <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: student.color }}>Mother's Details</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div><small style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Name:</small> <span style={{ fontWeight: 700 }}>{student.parents.mother.name}</span></div>
                        <div><small style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Occupation:</small> <span style={{ fontWeight: 700 }}>{student.parents.mother.occupation}</span></div>
                        <div><small style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Phone:</small> <span style={{ fontWeight: 700 }}>{student.parents.mother.phone}</span></div>
                      </div>
                    </div>
                    {/* Guardian */}
                    <div style={{ padding: '24px', backgroundColor: 'var(--bg-body)', borderRadius: '20px' }}>
                      <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: student.color }}>Guardian's Details</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div><small style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Name:</small> <span style={{ fontWeight: 700 }}>{student.parents.guardian.name}</span></div>
                        <div><small style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Relation:</small> <span style={{ fontWeight: 700 }}>{student.parents.guardian.relation}</span></div>
                        <div><small style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Phone:</small> <span style={{ fontWeight: 700 }}>{student.parents.guardian.phone}</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Previous School & Hostel Details */}
                <div className="card" style={{ gridColumn: 'span 2', padding: '32px' }}>
                  <h3 style={{ margin: '0 0 24px 0', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Building2 size={20} color={student.color} /> Previous School Details
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>School Name</div>
                      <div style={{ fontWeight: 700 }}>Lincoln High Academy</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Qualification</div>
                      <div style={{ fontWeight: 700 }}>Middle School Graduate</div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Remarks</div>
                      <div style={{ padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        "Excellent academic record with active participation in debating and science fairs. Transferred due to family relocation."
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: '32px' }}>
                  <h3 style={{ margin: '0 0 24px 0', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Home size={20} color={student.color} /> Hostel Details
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Hostel Name</div>
                      <div style={{ fontWeight: 700 }}>Elite Boys Wing</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Room Number</div>
                      <div style={{ fontWeight: 700 }}>B-302 (Floor 3)</div>
                    </div>
                    <span style={{ alignSelf: 'flex-start', padding: '4px 12px', backgroundColor: 'var(--success-light)', color: 'var(--success)', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800 }}>Resident</span>
                  </div>
                </div>

                {/* Description / Remarks */}
                <div className="card" style={{ gridColumn: 'span 3', padding: '32px' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText size={20} color={student.color} /> Additional Description & Remarks
                  </h3>
                  <div style={{ padding: '24px', backgroundColor: 'var(--bg-body)', borderRadius: '20px', border: '1px dashed var(--border-color)' }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                      Robert is an exceptionally bright student with a keen interest in robotics and mathematics. He has represented his previous school in national-level science competitions and holds a certificate of merit for academic excellence in Grade 9. 

                      Administrative Note: He has been granted a 10% merit scholarship based on his entrance test performance. Requires regular monitoring for his allergy to peanuts (noted in medical section).
                    </p>
                  </div>
                </div>

                 {/* Financial Overview Section (New) */}
                <div className="card" style={{ gridColumn: 'span 3', padding: '32px', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-body) 100%)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Wallet size={20} color={student.color} /> Recent Fee Ledger
                    </h3>
                    <button onClick={() => setActiveTab('fees')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}>View Full History</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                     <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                           <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Balance</div>
                           <div style={{ fontSize: '1.8rem', fontWeight: 900, color: totalDue === 0 ? 'var(--success)' : 'var(--danger)' }}>
                             ${totalDue.toFixed(2)}
                           </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                           <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>PAID</div>
                              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--success)' }}>
                                ${totalPaid.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                              </div>
                           </div>
                           <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>DISCOUNT</div>
                              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>$150</div>
                           </div>
                        </div>
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {feeLedger.filter(fee => ['#INV-9821', '#INV-9742', '#INV-PEND'].includes(fee.id)).map((fee, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{fee.type}</span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{fee.id}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                               <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>${fee.amount.toFixed(2)}</span>
                               <span style={{ fontSize: '0.65rem', fontWeight: 900, color: fee.status === 'Paid' ? 'var(--success)' : 'var(--danger)', padding: '4px 8px', backgroundColor: fee.status === 'Paid' ? 'var(--success-light)' : 'var(--danger-light)', borderRadius: '6px' }}>{fee.status}</span>
                            </div>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>

                {/* Bank & Medical Details */}
                <div className="card" style={{ padding: '32px' }}>
                  <h3 style={{ margin: '0 0 24px 0', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Landmark size={20} color={student.color} /> Bank Details
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div><div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>BANK NAME</div><div style={{ fontWeight: 700 }}>{student.bank.name}</div></div>
                    <div><div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>ACCOUNT NO</div><div style={{ fontWeight: 700 }}>{student.bank.accountNo}</div></div>
                    <div><div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>IFSC CODE</div><div style={{ fontWeight: 700 }}>{student.bank.ifsc}</div></div>
                  </div>
                </div>

                <div className="card" style={{ padding: '32px' }}>
                  <h3 style={{ margin: '0 0 24px 0', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Heart size={20} color={student.color} /> Medical Info
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div><div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>BLOOD GROUP</div><div style={{ fontWeight: 700, color: 'var(--danger)' }}>{student.bloodGroup}</div></div>
                    <div><div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>HEIGHT</div><div style={{ fontWeight: 700 }}>{student.height}</div></div>
                    <div><div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>WEIGHT</div><div style={{ fontWeight: 700 }}>{student.weight}</div></div>
                  </div>
                </div>

                <div className="card" style={{ padding: '32px' }}>
                  <h3 style={{ margin: '0 0 24px 0', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText size={20} color={student.color} /> Documents
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {['Birth Certificate', 'Transfer Certificate', 'Previous Transcript'].map(doc => {
                      const isDownloading = downloadingDoc === doc;
                      const docObject = documentsList.find(d => 
                        d.name === doc || 
                        (doc === 'Previous Transcript' && d.name === 'Previous Year Marksheet')
                      ) || { name: doc, type: 'PDF', size: '1.5 MB', date: '12 Jan 2026' };
                      return (
                        <div key={doc} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '12px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{doc}</span>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <button 
                              onClick={() => setPreviewDoc(docObject)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: student.color }}
                              title={`Preview ${doc}`}
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleDownload(docObject.name, docObject.type)}
                              disabled={downloadingDoc !== null}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title={`Download ${doc}`}
                            >
                              {isDownloading ? (
                                <Loader2 size={16} color={student.color} style={{ animation: 'spin 1s linear infinite' }} />
                              ) : (
                                <Download size={16} color={student.color} />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === 'attendance' && (
                <motion.div key="attendance" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Attendance Overview</h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {/* Custom Month Dropdown */}
                      <div style={{ position: 'relative', zIndex: 30 }}>
                        <button 
                          onClick={() => setIsAttendanceDropdownOpen(!isAttendanceDropdownOpen)}
                          style={{ 
                            padding: '10px 20px', 
                            borderRadius: '12px', 
                            border: '1px solid var(--border-color)', 
                            backgroundColor: 'var(--bg-card)', 
                            color: 'var(--text-main)',
                            fontWeight: 700, 
                            cursor: 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px',
                            fontSize: '0.9rem',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'all 0.2s ease',
                            outline: 'none'
                          }}
                          className="hover-glow"
                        >
                          <span>{selectedAttendanceMonth}</span>
                          <motion.div
                            animate={{ rotate: isAttendanceDropdownOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <ChevronDown size={16} />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isAttendanceDropdownOpen && (
                            <>
                              <div 
                                onClick={() => setIsAttendanceDropdownOpen(false)} 
                                style={{ 
                                  position: 'fixed', 
                                  inset: 0, 
                                  zIndex: 10,
                                  cursor: 'default'
                                }} 
                              />
                              <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                style={{
                                  position: 'absolute',
                                  top: '100%',
                                  right: 0,
                                  marginTop: '8px',
                                  minWidth: '240px',
                                  backgroundColor: 'var(--bg-card)',
                                  border: '1px solid var(--border-color)',
                                  borderRadius: '16px',
                                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                                  zIndex: 11,
                                  padding: '8px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '4px'
                                }}
                              >
                                {Object.keys(attendanceDataByMonth).map((month) => {
                                  const isSelected = selectedAttendanceMonth === month;
                                  const monthData = attendanceDataByMonth[month];
                                  const trendVal = monthData.trend[monthData.trend.length - 1]?.rate || 95;
                                  return (
                                    <button
                                      key={month}
                                      onClick={() => {
                                        setSelectedAttendanceMonth(month);
                                        setIsAttendanceDropdownOpen(false);
                                      }}
                                      style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        backgroundColor: isSelected ? 'rgba(72, 128, 255, 0.08)' : 'transparent',
                                        color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        fontWeight: isSelected ? 700 : 500,
                                        fontSize: '0.85rem'
                                      }}
                                      onMouseEnter={(e) => {
                                        if (!isSelected) {
                                          e.currentTarget.style.backgroundColor = 'var(--bg-body)';
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        if (!isSelected) {
                                          e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                      }}
                                    >
                                      <span>{month}</span>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 800 }}>{trendVal}% Rate</span>
                                    </button>
                                  );
                                })}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                      <button 
                        className="btn" 
                        onClick={handleExportAttendanceLog}
                        disabled={downloadingDoc !== null}
                        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        {downloadingDoc === 'Attendance Log' ? (
                          <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <Download size={18} />
                        )} 
                        {downloadingDoc === 'Attendance Log' ? 'Exporting...' : 'Export Log'}
                      </button>
                    </div>
                  </div>

                  {/* Attendance Stats Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                    {currentAttendance.stats.map((stat, i) => (
                      <div key={i} style={{ padding: '20px', backgroundColor: 'var(--bg-body)', borderRadius: '20px', border: `1px solid ${stat.color}20` }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{stat.label}</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Attendance Trend Chart */}
                  <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-body)', border: 'none', marginBottom: '32px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Activity size={18} color="var(--primary)" /> Monthly Consistency Trend
                    </h4>
                    <div style={{ width: '100%', height: '150px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={currentAttendance.trend}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                          <XAxis dataKey="month" hide />
                          <YAxis hide domain={[80, 100]} />
                          <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                          <Line type="monotone" dataKey="rate" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'white', stroke: 'var(--primary)', strokeWidth: 2 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Calendar View */}
                  <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center', marginBottom: '10px' }}>
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>{day}</div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
                      {/* Empty cells for previous month */}
                      {Array.from({ length: currentAttendance.emptyCells }).map((_, i) => <div key={`empty-${i}`} />)}
                      {/* Attendance Days */}
                      {Array.from({ length: currentAttendance.daysCount }).map((_, i) => {
                        const day = i + 1;
                        let status = 'present';
                        if (currentAttendance.specialDays[day]) {
                          status = currentAttendance.specialDays[day];
                        } else {
                          const dayOfWeekIndex = (currentAttendance.emptyCells + day - 1) % 7;
                          if (dayOfWeekIndex === 0 || dayOfWeekIndex === 6) {
                            status = 'holiday';
                          }
                        }

                        const getStyles = () => {
                          if (status === 'absent') return { bg: 'var(--danger-light)', color: 'var(--danger)', border: 'var(--danger)20' };
                          if (status === 'late') return { bg: 'var(--warning-light)', color: 'var(--warning)', border: 'var(--warning)20' };
                          if (status === 'holiday') return { bg: 'var(--bg-body)', color: 'var(--text-muted)', border: 'var(--border-color)' };
                          return { bg: 'var(--success-light)', color: 'var(--success)', border: 'var(--success)20' };
                        };

                        const styles = getStyles();

                        return (
                          <div key={i} style={{ 
                            height: '60px', borderRadius: '12px', border: `1px solid ${styles.border}`,
                            backgroundColor: styles.bg, color: styles.color,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px'
                          }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>{day}</span>
                            <span style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase' }}>{status}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Attendance Log Table */}
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>Recent Attendance Logs</h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                          <th style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800 }}>DATE</th>
                          <th style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800 }}>STATUS</th>
                          <th style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800 }}>TIME IN</th>
                          <th style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800 }}>TIME OUT</th>
                          <th style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800 }}>REMARKS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentAttendance.logs.map((log, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '16px 12px', fontWeight: 700 }}>{log.date}</td>
                            <td style={{ padding: '16px 12px' }}>
                               <span style={{ 
                                 padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800,
                                 backgroundColor: log.status === 'Present' ? 'var(--success-light)' : log.status === 'Late' ? 'var(--warning-light)' : 'var(--danger-light)',
                                 color: log.status === 'Present' ? 'var(--success)' : log.status === 'Late' ? 'var(--warning)' : 'var(--danger)'
                               }}>{log.status}</span>
                            </td>
                            <td style={{ padding: '16px 12px', fontWeight: 600 }}>{log.in}</td>
                            <td style={{ padding: '16px 12px', fontWeight: 600 }}>{log.out}</td>
                            <td style={{ padding: '16px 12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{log.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'fees' && (
                <motion.div key="fees" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Fee Ledger & History</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                       <button 
                         className="btn btn-primary" 
                         disabled={totalDue === 0}
                         onClick={() => {
                           setPaymentStep('input');
                           setCardName('');
                           setCardNumber('');
                           setCardExpiry('');
                           setCardCvv('');
                           setPaymentMethod('card');
                           setShowPaymentModal(true);
                         }}
                         style={{ 
                           backgroundColor: totalDue === 0 ? 'var(--bg-body)' : 'var(--success)', 
                           color: totalDue === 0 ? 'var(--text-muted)' : 'white',
                           border: totalDue === 0 ? '1px solid var(--border-color)' : 'none',
                           cursor: totalDue === 0 ? 'not-allowed' : 'pointer',
                           display: 'flex',
                           alignItems: 'center',
                           gap: '8px',
                           padding: '10px 20px',
                           borderRadius: '10px',
                           fontWeight: 800,
                           transition: 'all 0.2s ease-in-out'
                         }}
                       >
                         {totalDue === 0 ? (
                           <>
                             <CircleCheck size={18} color="var(--success)" /> All Fees Paid
                           </>
                         ) : (
                           <>
                             <CreditCard size={18} /> Pay Online
                           </>
                         )}
                       </button>
                    </div>
                  </div>

                  {/* Fee Summary Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
                    {[
                      { label: 'Total Paid', value: `$${totalPaid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, color: 'var(--success)' },
                      { label: 'Total Due', value: `$${totalDue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, color: 'var(--danger)' },
                      { label: 'Total Discount', value: '$150.00', color: 'var(--primary)' }
                    ].map((stat, i) => (
                      <div key={i} className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-body)', border: 'none', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>{stat.label}</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Fee History Table */}
                  <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <div style={{ padding: '20px', backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Transaction History</h4>
                       <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Academic Year: 2025-2026</span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ textAlign: 'left' }}>
                            <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>INVOICE ID</th>
                            <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>FEE TYPE</th>
                            <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>AMOUNT</th>
                            <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>DATE PAID</th>
                            <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>STATUS</th>
                            <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'right' }}>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feeLedger.map((item, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', transition: '0.2s' }}>
                              <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--primary)' }}>{item.id}</td>
                              <td style={{ padding: '16px 20px', fontWeight: 700 }}>{item.type}</td>
                              <td style={{ padding: '16px 20px', fontWeight: 800 }}>${item.amount.toFixed(2)}</td>
                              <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-muted)' }}>{item.date}</td>
                              <td style={{ padding: '16px 20px' }}>
                                <span style={{ 
                                  padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800,
                                  backgroundColor: item.status === 'Paid' ? 'var(--success-light)' : 'var(--danger-light)',
                                  color: item.status === 'Paid' ? 'var(--success)' : 'var(--danger)'
                                }}>{item.status}</span>
                              </td>
                              <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                 <button 
                                   onClick={() => handlePrintReceipt(item)}
                                   disabled={downloadingDoc !== null}
                                   style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                                   title="Print Receipt"
                                 >
                                   <Printer size={16} />
                                 </button>
                                 <button 
                                   onClick={() => handleDownloadReceipt(item.id, item.type, `$${item.amount.toFixed(2)}`)}
                                   disabled={downloadingDoc !== null}
                                   style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                                   title="Download Receipt"
                                 >
                                   {downloadingDoc === item.id ? (
                                     <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                   ) : (
                                     <Download size={16} />
                                   )}
                                 </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'exams' && (
                <motion.div key="exams" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Academic Performance & Exams</h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {/* Custom Exam Dropdown */}
                      <div style={{ position: 'relative', zIndex: 30 }}>
                        <button 
                          onClick={() => setIsExamDropdownOpen(!isExamDropdownOpen)}
                          style={{ 
                            padding: '10px 20px', 
                            borderRadius: '12px', 
                            border: '1px solid var(--border-color)', 
                            backgroundColor: 'var(--bg-card)', 
                            color: 'var(--text-main)',
                            fontWeight: 700, 
                            cursor: 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px',
                            fontSize: '0.9rem',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'all 0.2s ease',
                            outline: 'none'
                          }}
                          className="hover-glow"
                        >
                          <span>{selectedExam}</span>
                          <motion.div
                            animate={{ rotate: isExamDropdownOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <ChevronDown size={16} />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isExamDropdownOpen && (
                            <>
                              <div 
                                onClick={() => setIsExamDropdownOpen(false)} 
                                style={{ 
                                  position: 'fixed', 
                                  inset: 0, 
                                  zIndex: 10,
                                  cursor: 'default'
                                }} 
                              />
                              <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                style={{
                                  position: 'absolute',
                                  top: '100%',
                                  right: 0,
                                  marginTop: '8px',
                                  minWidth: '260px',
                                  backgroundColor: 'var(--bg-card)',
                                  border: '1px solid var(--border-color)',
                                  borderRadius: '16px',
                                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                                  zIndex: 11,
                                  padding: '8px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '4px'
                                }}
                              >
                                {Object.keys(examsData).map((examName) => {
                                  const isSelected = selectedExam === examName;
                                  const examInfo = examsData[examName];
                                  return (
                                    <button
                                      key={examName}
                                      onClick={() => {
                                        setSelectedExam(examName);
                                        setIsExamDropdownOpen(false);
                                      }}
                                      style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        backgroundColor: isSelected ? 'rgba(72, 128, 255, 0.08)' : 'transparent',
                                        color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '2px',
                                        fontWeight: isSelected ? 700 : 500
                                      }}
                                      onMouseEnter={(e) => {
                                        if (!isSelected) {
                                          e.currentTarget.style.backgroundColor = 'var(--bg-body)';
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        if (!isSelected) {
                                          e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                      }}
                                    >
                                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{examName}</div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                        <span>GPA: {examInfo.gpa.split(' / ')[0]}</span>
                                        <span>Marks: {examInfo.totalMarks.split(' / ')[0]}</span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleDownloadReportCard(selectedExam)}
                        disabled={downloadingDoc !== null}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        {downloadingDoc === 'Report Card' ? (
                          <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <Download size={18} />
                        )}
                        {downloadingDoc === 'Report Card' ? 'Downloading...' : 'Download Report Card'}
                      </button>
                    </div>
                  </div>

                  {/* Exam Stats Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                    {[
                      { label: 'Cumulative GPA', value: examsData[selectedExam].gpa, color: 'var(--primary)', icon: <Award size={20} /> },
                      { label: 'Class Position', value: examsData[selectedExam].position, color: 'var(--success)', icon: <TrendingUp size={20} /> },
                      { label: 'Total Marks', value: examsData[selectedExam].totalMarks, color: '#8b5cf6', icon: <FileText size={20} /> },
                      { label: 'Attendance Qualify', value: examsData[selectedExam].attendance, color: 'var(--warning)', icon: <CircleCheck size={20} /> }
                    ].map((stat, i) => (
                      <div key={i} className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-body)', border: 'none', textAlign: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>{stat.icon}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{stat.label}</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                    {/* Subject Wise Results */}
                    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', fontWeight: 800 }}>Subject Wise Breakdown</div>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-body)' }}>
                            <th style={{ padding: '12px 20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>SUBJECT</th>
                            <th style={{ padding: '12px 20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>MAX</th>
                            <th style={{ padding: '12px 20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>OBTAINED</th>
                            <th style={{ padding: '12px 20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>GRADE</th>
                            <th style={{ padding: '12px 20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>RESULT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {examsData[selectedExam].subjects.map((res, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '16px 20px', fontWeight: 700 }}>{res.subject}</td>
                              <td style={{ padding: '16px 20px', fontWeight: 600 }}>{res.max}</td>
                              <td style={{ padding: '16px 20px', fontWeight: 800 }}>{res.obtained}</td>
                              <td style={{ padding: '16px 20px', fontWeight: 900, color: 'var(--primary)' }}>{res.grade}</td>
                              <td style={{ padding: '16px 20px' }}>
                                <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 900, backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>{res.result}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Performance Analytics */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div className="card" style={{ padding: '24px' }}>
                         <h4 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: 800 }}>Term Comparison</h4>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {examsData[selectedExam].comparison.map((term, i) => (
                              <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
                                  <span>{term.term}</span>
                                  <span>{term.score}%</span>
                                </div>
                                <div style={{ height: '8px', backgroundColor: 'var(--bg-body)', borderRadius: '10px', overflow: 'hidden' }}>
                                  <motion.div key={selectedExam} initial={{ width: 0 }} animate={{ width: `${term.score}%` }} transition={{ duration: 1, delay: i * 0.2 }} style={{ height: '100%', backgroundColor: term.color }} />
                                </div>
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-body)', border: '1px dashed var(--border-color)' }}>
                         <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 800 }}>Teacher's Remarks</h4>
                         <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.6 }}>
                           {examsData[selectedExam].remarks}
                         </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'library' && (
                <motion.div key="library" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Library Usage & Records</h3>
                    <div style={{ padding: '8px 16px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Member ID: <span style={{ color: 'var(--primary)' }}>LIB-2026-004</span>
                    </div>
                  </div>

                  {/* Library Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
                    {[
                      { label: 'Books Borrowed', value: '12', color: 'var(--primary)', icon: <BookOpen size={20} /> },
                      { label: 'Currently With Student', value: '2', color: 'var(--warning)', icon: <Clock size={20} /> },
                      { label: 'Total Fines Paid', value: '$25.00', color: 'var(--success)', icon: <CreditCard size={20} /> }
                    ].map((stat, i) => (
                      <div key={i} className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-body)', border: 'none', textAlign: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>{stat.icon}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{stat.label}</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', fontWeight: 800 }}>Currently Borrowed Books</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-body)' }}>
                          <th style={{ padding: '12px 20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>BOOK TITLE</th>
                          <th style={{ padding: '12px 20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>AUTHOR</th>
                          <th style={{ padding: '12px 20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>ISSUE DATE</th>
                          <th style={{ padding: '12px 20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>DUE DATE</th>
                          <th style={{ padding: '12px 20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { title: 'Advanced Quantum Physics', author: 'Dr. Robert Smith', issue: '01 May 2026', due: '15 May 2026', status: 'Active', color: 'var(--primary)' },
                          { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', issue: '28 Apr 2026', due: '12 May 2026', status: 'Active', color: 'var(--primary)' },
                          { title: 'Organic Chemistry Vol 1', author: 'Paula Bruice', issue: '10 Apr 2026', due: '24 Apr 2026', status: 'Returned', color: 'var(--success)' },
                          { title: 'Mathematical Methods', author: 'Boas', issue: '01 Apr 2026', due: '15 Apr 2026', status: 'Returned', color: 'var(--success)' },
                          { title: 'Data Structures with C++', author: 'Sahni', issue: '15 Mar 2026', due: '30 Mar 2026', status: 'Overdue', color: 'var(--danger)' },
                          { title: 'Brief History of Time', author: 'Stephen Hawking', issue: '01 Mar 2026', due: '15 Mar 2026', status: 'Returned', color: 'var(--success)' },
                        ].map((book, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '16px 20px', fontWeight: 700 }}>{book.title}</td>
                            <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>{book.author}</td>
                            <td style={{ padding: '16px 20px', fontWeight: 600 }}>{book.issue}</td>
                            <td style={{ padding: '16px 20px', fontWeight: 600, color: book.status === 'Overdue' ? 'var(--danger)' : 'var(--text-muted)' }}>{book.due}</td>
                            <td style={{ padding: '16px 20px' }}>
                              <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 900, backgroundColor: `${book.color}15`, color: book.color }}>{book.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'leaves' && (
                <motion.div key="leaves" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Leave Applications</h3>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => {
                        setLeaveForm({
                          type: 'Sick Leave',
                          from: new Date().toISOString().split('T')[0],
                          to: new Date().toISOString().split('T')[0],
                          reason: ''
                        });
                        setLeaveSubmittingStep('input');
                        setShowLeaveModal(true);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <CalendarDays size={18} /> Apply for Leave
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                    {[
                      { label: 'Total Leaves', value: leavesList.length, color: 'var(--primary)' },
                      { label: 'Approved', value: leavesList.filter(l => l.status === 'Approved').length, color: 'var(--success)' },
                      { label: 'Pending', value: leavesList.filter(l => l.status === 'Pending').length, color: 'var(--warning)' },
                      { label: 'Rejected', value: leavesList.filter(l => l.status === 'Rejected').length, color: 'var(--danger)' }
                    ].map((stat, i) => (
                      <div key={i} style={{ padding: '20px', backgroundColor: 'var(--bg-body)', borderRadius: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-body)' }}>
                          <th style={{ padding: '16px 20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>LEAVE TYPE</th>
                          <th style={{ padding: '16px 20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>FROM</th>
                          <th style={{ padding: '16px 20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>TO</th>
                          <th style={{ padding: '16px 20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>REASON</th>
                          <th style={{ padding: '16px 20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leavesList.map((leave, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '16px 20px', fontWeight: 700 }}>{leave.type}</td>
                            <td style={{ padding: '16px 20px' }}>{leave.from}</td>
                            <td style={{ padding: '16px 20px' }}>{leave.to}</td>
                            <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{leave.reason}</td>
                            <td style={{ padding: '16px 20px' }}>
                              <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 900, backgroundColor: `${leave.color}15`, color: leave.color }}>{leave.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'documents' && (
                <motion.div key="documents" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Student Document Vault</h3>
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        setUploadForm({
                          name: '',
                          type: 'PDF',
                          file: null
                        });
                        setUploadStep('input');
                        setShowUploadModal(true);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Upload size={18} /> Upload New Document
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
                    {documentsList.map((doc, i) => {
                      const isDownloading = downloadingDoc === doc.name;
                      return (
                        <div 
                          key={i} 
                          className="card hover-scale" 
                          style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }} 
                          onClick={() => handleDownload(doc.name, doc.type)}
                        >
                          <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                            <FileText size={24} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '4px' }}>{doc.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{doc.type} • {doc.size} • {doc.date}</div>
                          </div>
                          <div 
                            style={{ display: 'flex', gap: '8px' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button 
                              onClick={() => setPreviewDoc(doc)}
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '8px', backgroundColor: 'var(--bg-body)', transition: 'all 0.2s' }}
                              title={`Preview ${doc.name}`}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                              <Eye size={14} />
                            </button>

                            <button 
                              onClick={() => handleDownload(doc.name, doc.type)}
                              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '8px', backgroundColor: 'var(--bg-body)', transition: 'all 0.2s' }}
                              disabled={downloadingDoc !== null}
                              title={`Download ${doc.name}`}
                            >
                              {isDownloading ? (
                                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                              ) : (
                                <Download size={14} />
                              )}
                            </button>

                            <button 
                              onClick={() => {
                                setDocToDelete(doc);
                                setDeleteStep('confirm');
                              }}
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '8px', backgroundColor: 'var(--bg-body)', transition: 'all 0.2s' }}
                              title={`Delete ${doc.name}`}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

          {/* Placeholder for other tabs (Already implemented logic, but styled) */}
          {activeTab !== 'details' && activeTab !== 'attendance' && activeTab !== 'fees' && activeTab !== 'exams' && activeTab !== 'library' && activeTab !== 'leaves' && activeTab !== 'documents' && (
             <motion.div key="other" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="card" style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--bg-card)' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                    {tabs.find(t => t.id === activeTab)?.icon}
                  </div>
                  <h3 style={{ margin: 0 }}>{tabs.find(t => t.id === activeTab)?.label} Records</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Detailed data for this section is currently being synchronized.</p>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upgraded Suspend Student Modal */}
      <AnimatePresence>
        {showSuspendModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (suspensionStep !== 'processing') setShowSuspendModal(false);
            }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              backgroundColor: 'rgba(15, 23, 42, 0.45)', 
              backdropFilter: 'blur(16px)', 
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                width: '100%', maxWidth: '450px', backgroundColor: 'var(--bg-card)', 
                borderRadius: '30px', border: '1px solid var(--border-color)', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {suspensionStep === 'confirm' && (
                <div style={{ padding: '32px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldAlert size={20} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Suspend Student</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Deactivate registry & school privileges</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowSuspendModal(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 300 }}
                    >
                      &times;
                    </button>
                  </div>

                  {/* Warning Info */}
                  <div style={{ 
                    padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '16px', 
                    border: '1px solid rgba(239, 68, 68, 0.1)', marginBottom: '24px', display: 'flex', gap: '12px'
                  }}>
                    <ShieldAlert size={20} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Confirm Disciplinary Action</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        You are about to suspend <strong>{student.name}</strong>. This deactivates institutional access tokens, attendance checks, and modules immediately.
                      </div>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>SUSPENSION REASON</label>
                      <select 
                        className="form-input" 
                        value={suspensionReason} 
                        onChange={(e) => setSuspensionReason(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 600 }}
                      >
                        <option value="">Select a reason...</option>
                        <option value="Disciplinary Action">Disciplinary Action</option>
                        <option value="Low Attendance">Low Attendance</option>
                        <option value="Unpaid Fees">Unpaid Fees</option>
                        <option value="Academic Probation">Academic Probation</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>DURATION</label>
                      <select 
                        className="form-input" 
                        value={suspensionDuration} 
                        onChange={(e) => setSuspensionDuration(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 600 }}
                      >
                        <option value="3 Days">3 Days</option>
                        <option value="1 Week">1 Week</option>
                        <option value="2 Weeks">2 Weeks</option>
                        <option value="1 Month">1 Month</option>
                        <option value="Indefinite">Indefinite</option>
                      </select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      className="btn" 
                      onClick={() => setShowSuspendModal(false)}
                      style={{ flex: 1, backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={handleConfirmSuspend}
                      disabled={!suspensionReason}
                      style={{ 
                        flex: 1.5, 
                        backgroundColor: 'var(--danger)', 
                        border: 'none',
                        color: 'white',
                        cursor: !suspensionReason ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: !suspensionReason ? 0.5 : 1
                      }}
                    >
                      <ShieldAlert size={16} /> Confirm Suspension
                    </button>
                  </div>
                </div>
              )}

              {suspensionStep === 'processing' && (
                <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '28px' }}>
                    <div style={{ 
                      boxSizing: 'border-box', position: 'absolute', width: '80px', height: '80px',
                      border: '4px solid var(--border-color)', borderRadius: '50%'
                    }} />
                    <div style={{ 
                      boxSizing: 'border-box', position: 'absolute', width: '80px', height: '80px',
                      border: '4px solid var(--danger)', borderRadius: '50%',
                      borderTopColor: 'transparent', animation: 'spin 1s linear infinite'
                    }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--danger)' }}>
                      <Loader2 size={28} style={{ animation: 'spin 2s linear infinite' }} />
                    </div>
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800 }}>Enforcing Disciplinary Block</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px', margin: 0, minHeight: '3em' }}>{suspensionMsg}</p>
                </div>
              )}

              {suspensionStep === 'success' && (
                <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}
                  >
                    <ShieldAlert size={48} />
                  </motion.div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: 800 }}>Suspension Activated</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '320px', margin: '0 0 32px 0' }}>
                    <strong>{student.name}</strong> has been suspended successfully. Account access is now blocked.
                  </p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => {
                      setShowSuspendModal(false);
                      setTimeout(() => {
                        setSuspensionStep('confirm');
                        setSuspensionReason('');
                      }, 300);
                    }}
                    style={{ width: '100%', backgroundColor: 'var(--danger)', border: 'none', color: 'white' }}
                  >
                    Return to Profile
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lift Suspension Reinstatement Modal */}
      <AnimatePresence>
        {showReinstateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (reinstateStep !== 'processing') setShowReinstateModal(false);
            }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              backgroundColor: 'rgba(15, 23, 42, 0.45)', 
              backdropFilter: 'blur(16px)', 
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-card)', 
                borderRadius: '30px', border: '1px solid var(--border-color)', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {reinstateStep === 'confirm' && (
                <div style={{ padding: '32px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CircleCheck size={20} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Lift Suspension</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Reinstate student active privileges</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowReinstateModal(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 300 }}
                    >
                      &times;
                    </button>
                  </div>

                  {/* Warning Info */}
                  <div style={{ 
                    padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: '16px', 
                    border: '1px solid rgba(16, 185, 129, 0.1)', marginBottom: '24px', display: 'flex', gap: '12px'
                  }}>
                    <CircleCheck size={20} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Authorize Restoration</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        You are about to lift the suspension for <strong>{student.name}</strong>. This will reinstate full access to classrooms, learning modules, and active academic registers.
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>REINSTATEMENT GROUNDS</label>
                      <select 
                        className="form-input" 
                        value={reinstateReason} 
                        onChange={(e) => setReinstateReason(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 600 }}
                      >
                        <option value="Term Completed">Suspension Term Completed</option>
                        <option value="Good Behavior">Exemplary Behavioral Review</option>
                        <option value="Administrative Pardon">Administrative Pardon / Appeal Approved</option>
                        <option value="Inaccurate Charge">Correction of Registry Record</option>
                      </select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      className="btn" 
                      onClick={() => setShowReinstateModal(false)}
                      style={{ flex: 1, backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={handleConfirmReinstate}
                      style={{ 
                        flex: 1.5, 
                        backgroundColor: 'var(--success)', 
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <CircleCheck size={16} /> Authorize Restoration
                    </button>
                  </div>
                </div>
              )}

              {reinstateStep === 'processing' && (
                <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '28px' }}>
                    <div style={{ 
                      boxSizing: 'border-box', position: 'absolute', width: '80px', height: '80px',
                      border: '4px solid var(--border-color)', borderRadius: '50%'
                    }} />
                    <div style={{ 
                      boxSizing: 'border-box', position: 'absolute', width: '80px', height: '80px',
                      border: '4px solid var(--success)', borderRadius: '50%',
                      borderTopColor: 'transparent', animation: 'spin 1s linear infinite'
                    }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--success)' }}>
                      <Loader2 size={28} style={{ animation: 'spin 2s linear infinite' }} />
                    </div>
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800 }}>Restoring Registry Status</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px', margin: 0, minHeight: '3em' }}>{reinstateMsg}</p>
                </div>
              )}

              {reinstateStep === 'success' && (
                <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}
                  >
                    <CircleCheck size={48} />
                  </motion.div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: 800 }}>Suspension Lifted</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '320px', margin: '0 0 32px 0' }}>
                    <strong>{student.name}</strong> has been successfully reinstated. All institutional accesses are fully active.
                  </p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => {
                      setShowReinstateModal(false);
                      setTimeout(() => {
                        setReinstateStep('confirm');
                        setReinstateReason('Term Completed');
                      }, 300);
                    }}
                    style={{ width: '100%', backgroundColor: 'var(--success)', border: 'none', color: 'white' }}
                  >
                    Return to Profile
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fee Checkout Secure Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (paymentStep !== 'processing') setShowPaymentModal(false);
            }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              backgroundColor: 'rgba(15, 23, 42, 0.45)', 
              backdropFilter: 'blur(16px)', 
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                width: '100%', maxWidth: '520px', backgroundColor: 'var(--bg-card)', 
                borderRadius: '30px', border: '1px solid var(--border-color)', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {paymentStep === 'input' && (
                <div style={{ padding: '32px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(72, 128, 255, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Lock size={20} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Secure Checkout</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SSL Encrypted Payment Gateway</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowPaymentModal(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 300 }}
                    >
                      &times;
                    </button>
                  </div>

                  {/* Invoice Summary Subcard */}
                  <div style={{ padding: '20px', backgroundColor: 'var(--bg-body)', borderRadius: '20px', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>INVOICE</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 800 }}>#INV-PEND</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Tuition Fee (June)</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Grade 10 - Academic 2025-26</div>
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--danger)' }}>$450.00</div>
                    </div>
                  </div>

                  {/* Payment Method Selector Grid */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>PAYMENT METHOD</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      {[
                        { id: 'card', name: 'Credit Card', icon: <CreditCard size={18} /> },
                        { id: 'bank', name: 'Bank Transfer', icon: <Landmark size={18} /> },
                        { id: 'paypal', name: 'PayPal', icon: <Wallet size={18} /> }
                      ].map(method => {
                        const isSelected = paymentMethod === method.id;
                        return (
                          <div 
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id)}
                            style={{
                              padding: '16px 12px',
                              borderRadius: '16px',
                              border: isSelected ? `2px solid ${student.color}` : '1px solid var(--border-color)',
                              backgroundColor: isSelected ? `${student.color}05` : 'transparent',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              textAlign: 'center'
                            }}
                          >
                            <div style={{ color: isSelected ? student.color : 'var(--text-muted)' }}>{method.icon}</div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isSelected ? 'var(--text-main)' : 'var(--text-muted)' }}>{method.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payment Details Inputs */}
                  {paymentMethod === 'card' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>CARDHOLDER NAME</label>
                        <input 
                          type="text"
                          className="form-input"
                          placeholder="John Fox"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 600 }}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>CARD NUMBER</label>
                        <div style={{ position: 'relative' }}>
                          <input 
                            type="text"
                            className="form-input"
                            placeholder="4111 2222 3333 4444"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            style={{ width: '100%', padding: '12px 16px', paddingRight: '80px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 600 }}
                          />
                          <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--primary)', backgroundColor: 'rgba(72, 128, 255, 0.1)', padding: '4px 8px', borderRadius: '6px' }}>
                            {getCardType()}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>EXPIRY DATE</label>
                          <input 
                            type="text"
                            className="form-input"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 600, textAlign: 'center' }}
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>CVV CODE</label>
                          <input 
                            type="password"
                            className="form-input"
                            placeholder="***"
                            value={cardCvv}
                            onChange={handleCvvChange}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 600, textAlign: 'center' }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : paymentMethod === 'bank' ? (
                    <div style={{ padding: '24px', backgroundColor: 'var(--bg-body)', borderRadius: '20px', border: '1px solid var(--border-color)', marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Direct Bank Transfer Account:</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <div><strong style={{ color: 'var(--text-main)' }}>Bank Name:</strong> Global Trust Bank</div>
                        <div><strong style={{ color: 'var(--text-main)' }}>Account Number:</strong> 8877665544</div>
                        <div><strong style={{ color: 'var(--text-main)' }}>IFSC Routing:</strong> GTB0001234</div>
                        <div><strong style={{ color: 'var(--text-main)' }}>Reference ID:</strong> ADM-2026-004-INV-PEND</div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontStyle: 'italic', marginTop: '4px' }}>
                        * Mock instant verification clears payment instantly on submission.
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '24px', backgroundColor: 'var(--bg-body)', borderRadius: '20px', border: '1px solid var(--border-color)', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ fontWeight: 800, color: '#0070ba', fontSize: '1.2rem' }}>PayPal Secure Gateway</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        You will be logged in securely as <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>robert.fox@edupro.edu</span> to authorize the transaction.
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      className="btn" 
                      onClick={() => setShowPaymentModal(false)}
                      style={{ flex: 1, backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={handleConfirmPayment}
                      disabled={paymentMethod === 'card' && (!cardName || cardNumber.length < 19 || cardExpiry.length < 5 || cardCvv.length < 3)}
                      style={{ 
                        flex: 1.5, 
                        backgroundColor: 'var(--success)', 
                        border: 'none',
                        opacity: paymentMethod === 'card' && (!cardName || cardNumber.length < 19 || cardExpiry.length < 5 || cardCvv.length < 3) ? 0.5 : 1,
                        cursor: paymentMethod === 'card' && (!cardName || cardNumber.length < 19 || cardExpiry.length < 5 || cardCvv.length < 3) ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Lock size={16} /> Confirm Secure Payment
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === 'processing' && (
                <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '28px' }}>
                    <div style={{ 
                      boxSizing: 'border-box', position: 'absolute', width: '80px', height: '80px',
                      border: '4px solid var(--border-color)', borderRadius: '50%'
                    }} />
                    <div style={{ 
                      boxSizing: 'border-box', position: 'absolute', width: '80px', height: '80px',
                      border: `4px solid ${student.color}`, borderRadius: '50%',
                      borderTopColor: 'transparent', animation: 'spin 1s linear infinite'
                    }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: student.color }}>
                      <Lock size={28} />
                    </div>
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800 }}>Processing Secure Transaction</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px', margin: 0, minHeight: '3em' }}>{processingMsg}</p>
                </div>
              )}

              {paymentStep === 'success' && (
                <div style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  {/* Success SVG Checkmark Ring */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
                    style={{ 
                      width: '84px', height: '84px', borderRadius: '50%', 
                      backgroundColor: 'rgba(40, 167, 69, 0.1)', color: 'var(--success)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      marginBottom: '24px', border: '2px solid rgba(40, 167, 69, 0.2)' 
                    }}
                  >
                    <motion.svg 
                      width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  </motion.div>

                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: 900, color: 'var(--success)' }}>Payment Successful!</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 24px 0' }}>Invoice #INV-PEND has been cleared in full.</p>

                  <div style={{ width: '100%', padding: '20px', backgroundColor: 'var(--bg-body)', borderRadius: '20px', border: '1px solid var(--border-color)', marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Amount Paid:</span>
                      <strong style={{ fontWeight: 800 }}>$450.00</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Method:</span>
                      <strong style={{ fontWeight: 700 }}>{paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'bank' ? 'Bank Transfer' : 'PayPal'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Transaction Ref:</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>TXN-{Math.floor(10000000 + Math.random() * 90000000)}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                    <button 
                      className="btn" 
                      onClick={() => handleDownloadReceipt('#INV-PEND', 'Tuition Fee (June)', '$450.00')}
                      style={{ flex: 1, backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <Download size={16} /> Download Receipt
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => setShowPaymentModal(false)}
                      style={{ flex: 1, backgroundColor: 'var(--primary)', border: 'none' }}
                    >
                      Close & Return
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apply for Leave Modal */}
      <AnimatePresence>
        {showLeaveModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (leaveSubmittingStep !== 'processing') setShowLeaveModal(false);
            }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              backgroundColor: 'rgba(15, 23, 42, 0.45)', 
              backdropFilter: 'blur(16px)', 
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-card)', 
                borderRadius: '30px', border: '1px solid var(--border-color)', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {leaveSubmittingStep === 'input' && (
                <div style={{ padding: '32px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(72, 128, 255, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CalendarDays size={20} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Apply for Leave</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>File an institutional leave petition</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowLeaveModal(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 300 }}
                    >
                      &times;
                    </button>
                  </div>

                  {/* Form */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>LEAVE CATEGORY</label>
                      <select 
                        className="form-input" 
                        value={leaveForm.type} 
                        onChange={(e) => setLeaveForm(prev => ({ ...prev, type: e.target.value }))}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 600 }}
                      >
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Medical">Medical Leave</option>
                        <option value="Personal">Personal Leave</option>
                        <option value="Emergency">Emergency Leave</option>
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>FROM DATE</label>
                        <input 
                          type="date"
                          className="form-input"
                          value={leaveForm.from}
                          onChange={(e) => setLeaveForm(prev => ({ ...prev, from: e.target.value }))}
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 600 }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>TO DATE</label>
                        <input 
                          type="date"
                          className="form-input"
                          value={leaveForm.to}
                          onChange={(e) => setLeaveForm(prev => ({ ...prev, to: e.target.value }))}
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 600 }}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>REASON / EXPLANATION</label>
                      <textarea 
                        className="form-input"
                        rows={3}
                        placeholder="Please describe the detailed reason for your leave request..."
                        value={leaveForm.reason}
                        onChange={(e) => setLeaveForm(prev => ({ ...prev, reason: e.target.value }))}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 600, resize: 'none', fontFamily: 'inherit' }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      className="btn" 
                      onClick={() => setShowLeaveModal(false)}
                      style={{ flex: 1, backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={handleConfirmLeaveSubmit}
                      disabled={!leaveForm.reason.trim()}
                      style={{ 
                        flex: 1.5, 
                        backgroundColor: 'var(--primary)', 
                        border: 'none',
                        opacity: !leaveForm.reason.trim() ? 0.5 : 1,
                        cursor: !leaveForm.reason.trim() ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <CalendarDays size={16} /> Submit Request
                    </button>
                  </div>
                </div>
              )}

              {leaveSubmittingStep === 'processing' && (
                <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '28px' }}>
                    <div style={{ 
                      boxSizing: 'border-box', position: 'absolute', width: '80px', height: '80px',
                      border: '4px solid var(--border-color)', borderRadius: '50%'
                    }} />
                    <div style={{ 
                      boxSizing: 'border-box', position: 'absolute', width: '80px', height: '80px',
                      border: `4px solid ${student.color}`, borderRadius: '50%',
                      borderTopColor: 'transparent', animation: 'spin 1s linear infinite'
                    }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: student.color }}>
                      <CalendarDays size={28} />
                    </div>
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800 }}>Filing Leave Petition</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px', margin: 0, minHeight: '3em' }}>{leaveProcessingMsg}</p>
                </div>
              )}

              {leaveSubmittingStep === 'success' && (
                <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}
                  >
                    <CircleCheck size={48} />
                  </motion.div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: 900 }}>Request Registered</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '340px', margin: '0 0 32px 0', lineHeight: 1.6 }}>
                    Your leave request for <strong style={{ color: 'var(--text-main)' }}>{leaveForm.type}</strong> has been successfully filed with the school administration and is now <span style={{ color: 'var(--warning)', fontWeight: 800 }}>Pending</span> approval.
                  </p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setShowLeaveModal(false)}
                    style={{ backgroundColor: 'var(--success)', border: 'none', width: '100%', maxWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    Return to Leaves
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student Document Vault Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (uploadStep !== 'processing') setShowUploadModal(false);
            }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              backgroundColor: 'rgba(15, 23, 42, 0.45)', 
              backdropFilter: 'blur(16px)', 
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-card)', 
                borderRadius: '30px', border: '1px solid var(--border-color)', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {uploadStep === 'input' && (
                <div style={{ padding: '32px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(72, 128, 255, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Upload size={20} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Upload Document</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Securely store credentials in your vault</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowUploadModal(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 300 }}
                    >
                      &times;
                    </button>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div 
                    onClick={() => setUploadForm({ name: 'Report Card Draft', type: 'PDF', file: { name: 'report_card_draft.pdf', size: '1.5 MB' } })}
                    style={{ 
                      border: '2px dashed var(--border-color)', 
                      borderRadius: '20px', 
                      padding: '32px 20px', 
                      textAlign: 'center', 
                      cursor: 'pointer', 
                      backgroundColor: uploadForm.file ? 'rgba(72, 128, 255, 0.03)' : 'var(--bg-body)',
                      borderColor: uploadForm.file ? 'var(--primary)' : 'var(--border-color)',
                      transition: 'all 0.2s ease',
                      marginBottom: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px'
                    }}
                  >
                    {uploadForm.file ? (
                      <>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(72, 128, 255, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={24} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>{uploadForm.file.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{uploadForm.file.size} • Ready for upload</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Upload size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>Drag & drop file here</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>or <span style={{ color: 'var(--primary)', fontWeight: 700 }}>browse files</span> to simulate selection</div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Inputs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>DOCUMENT NAME</label>
                      <input 
                        type="text"
                        className="form-input"
                        placeholder="e.g. Term 1 Report Card"
                        value={uploadForm.name}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 600, color: 'var(--text-main)' }}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>DOCUMENT TYPE</label>
                      <select 
                        className="form-input" 
                        value={uploadForm.type} 
                        onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 600, color: 'var(--text-main)' }}
                      >
                        <option value="PDF">PDF Document (.pdf)</option>
                        <option value="JPG">JPEG Image (.jpg)</option>
                        <option value="PNG">PNG Image (.png)</option>
                      </select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      className="btn" 
                      onClick={() => setShowUploadModal(false)}
                      style={{ flex: 1, backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={handleConfirmUpload}
                      disabled={!uploadForm.file || !uploadForm.name.trim()}
                      style={{ 
                        flex: 1.5, 
                        backgroundColor: 'var(--primary)', 
                        border: 'none',
                        opacity: (!uploadForm.file || !uploadForm.name.trim()) ? 0.5 : 1,
                        cursor: (!uploadForm.file || !uploadForm.name.trim()) ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Upload size={16} /> Upload to Vault
                    </button>
                  </div>
                </div>
              )}

              {uploadStep === 'processing' && (
                <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '28px' }}>
                    <div style={{ 
                      boxSizing: 'border-box', position: 'absolute', width: '80px', height: '80px',
                      border: '4px solid var(--border-color)', borderRadius: '50%'
                    }} />
                    <div style={{ 
                      boxSizing: 'border-box', position: 'absolute', width: '80px', height: '80px',
                      border: `4px solid ${student.color || 'var(--primary)'}`, borderRadius: '50%',
                      borderTopColor: 'transparent', animation: 'spin 1s linear infinite'
                    }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: student.color || 'var(--primary)' }}>
                      <Shield size={28} />
                    </div>
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800 }}>Securing Vault Connection</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px', margin: 0, minHeight: '3em' }}>{uploadProcessingMsg}</p>
                </div>
              )}

              {uploadStep === 'success' && (
                <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}
                  >
                    <CircleCheck size={48} />
                  </motion.div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: 900 }}>Document Vaulted</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '340px', margin: '0 0 32px 0', lineHeight: 1.6 }}>
                    Your document <strong style={{ color: 'var(--text-main)' }}>{uploadForm.name}</strong> has been encrypted and synced successfully across the vault nodes.
                  </p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setShowUploadModal(false)}
                    style={{ backgroundColor: 'var(--success)', border: 'none', width: '100%', maxWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    Close & Return
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

        </div> {/* Closing Right Column */}
      </div> {/* Closing Asymmetric Profile Workspace */}

      {/* Student Document Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewDoc(null)}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              backgroundColor: 'rgba(15, 23, 42, 0.45)', 
              backdropFilter: 'blur(16px)', 
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                width: '100%', maxWidth: '650px', backgroundColor: 'var(--bg-card)', 
                borderRadius: '30px', border: '1px solid var(--border-color)', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              <div style={{ padding: '32px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(72, 128, 255, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{previewDoc.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{previewDoc.type} • {previewDoc.size} • Vaulted on {previewDoc.date}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setPreviewDoc(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 300 }}
                  >
                    &times;
                  </button>
                </div>

                {/* Simulated Scanned Frame Document Preview */}
                <div 
                  style={{ 
                    backgroundColor: 'var(--bg-body)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '20px', 
                    padding: '40px 24px', 
                    marginBottom: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Security background watermarks */}
                  <div style={{ position: 'absolute', top: '-20%', left: '-10%', transform: 'rotate(-25deg)', fontSize: '4.5rem', fontWeight: 900, color: 'rgba(72, 128, 255, 0.02)', userSelect: 'none', pointerEvents: 'none' }}>
                    SECURE VAULT
                  </div>

                  <div style={{ 
                    width: '100%', 
                    maxWidth: '420px', 
                    backgroundColor: 'var(--bg-card)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '16px', 
                    padding: '24px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    position: 'relative'
                  }}>
                    {/* Concentric Seals & Header info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed var(--border-color)', paddingBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>EDUPRO GLOBAL VAULT</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: '2px', color: 'var(--text-main)' }}>DIGITAL CREDENTIAL CERTIFICATE</div>
                      </div>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(72, 128, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <Lock size={14} />
                      </div>
                    </div>

                    {/* Metadata details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>DOC SCHEME:</span>
                        <strong style={{ color: 'var(--text-main)' }}>{previewDoc.type} DOCUMENT</strong>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>IDENTIFIER:</span>
                        <strong style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>SHA256:{previewDoc.name.replace(/\s+/g, '').substring(0, 10).toUpperCase()}-NODE</strong>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>INDEX SIZE:</span>
                        <strong style={{ color: 'var(--text-main)' }}>{previewDoc.size}</strong>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>STORAGE IPFS:</span>
                        <strong style={{ color: 'var(--text-main)', fontFamily: 'monospace', fontSize: '0.7rem' }}>QmYwAPzwh356X4A43pX6zQ55Z9p...</strong>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>SIGNATURE:</span>
                        <span style={{ color: 'var(--success)', fontWeight: 800 }}>VERIFIED / SECURED</span>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '8px' }}>
                      This represents an authenticated digital duplicate verified on the cluster node.
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    className="btn" 
                    onClick={() => setPreviewDoc(null)}
                    style={{ flex: 1, backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                  >
                    Close Preview
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => {
                      handleDownload(previewDoc.name, previewDoc.type);
                      setPreviewDoc(null);
                    }}
                    style={{ 
                      flex: 1.2, 
                      backgroundColor: 'var(--primary)', 
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Download size={16} /> Download Copy
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student Document Delete Confirmation Modal */}
      <AnimatePresence>
        {docToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (deleteStep !== 'processing') setDocToDelete(null);
            }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              backgroundColor: 'rgba(15, 23, 42, 0.45)', 
              backdropFilter: 'blur(16px)', 
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-card)', 
                borderRadius: '30px', border: '1px solid var(--border-color)', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {deleteStep === 'confirm' && (
                <div style={{ padding: '32px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={20} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Decommission Document</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Remove item from secure vault index</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setDocToDelete(null)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 300 }}
                    >
                      &times;
                    </button>
                  </div>

                  <div style={{ marginBottom: '28px', backgroundColor: 'var(--bg-body)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--danger)', fontWeight: 800, fontSize: '0.9rem' }}>
                      <ShieldAlert size={18} /> IRREVERSIBLE DESTRUCTION DIRECTIVE
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      You are about to cryptographically purge and declassify <strong style={{ color: 'var(--text-main)' }}>{docToDelete.name}</strong> ({docToDelete.size}) from the student credential index. Once authorized, this index block will be zero-filled.
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      className="btn" 
                      onClick={() => setDocToDelete(null)}
                      style={{ flex: 1, backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                    >
                      Abort Directives
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={handleConfirmDelete}
                      style={{ 
                        flex: 1.5, 
                        backgroundColor: 'var(--danger)', 
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        color: '#fff'
                      }}
                    >
                      <Trash2 size={16} /> Authorize Deletion
                    </button>
                  </div>
                </div>
              )}

              {deleteStep === 'processing' && (
                <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '28px' }}>
                    <div style={{ 
                      boxSizing: 'border-box', position: 'absolute', width: '80px', height: '80px',
                      border: '4px solid var(--border-color)', borderRadius: '50%'
                    }} />
                    <div style={{ 
                      boxSizing: 'border-box', position: 'absolute', width: '80px', height: '80px',
                      border: '4px solid var(--danger)', borderRadius: '50%',
                      borderTopColor: 'transparent', animation: 'spin 1s linear infinite'
                    }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--danger)' }}>
                      <ShieldAlert size={28} />
                    </div>
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800 }}>Decommissioning Cluster Index</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px', margin: 0, minHeight: '3em' }}>{deleteProcessingMsg}</p>
                </div>
              )}

              {deleteStep === 'success' && (
                <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}
                  >
                    <CircleCheck size={48} />
                  </motion.div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: 900 }}>Cryptographic Purge Success</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '340px', margin: '0 0 32px 0', lineHeight: 1.6 }}>
                    The digital file hash has been completely zeroed, index lists updated, and changes replicated across standard storage arrays.
                  </p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setDocToDelete(null)}
                    style={{ backgroundColor: 'var(--success)', border: 'none', width: '100%', maxWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    Return to Vault
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastRenderer toast={toast} onClose={hideToast} />
    </motion.div>
  );
};

export default StudentDetails;
