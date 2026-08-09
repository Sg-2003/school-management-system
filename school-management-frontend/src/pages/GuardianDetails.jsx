/* eslint-disable react-hooks/purity */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast, ToastRenderer } from '../hooks/useToast';
import { 
  User, Mail, Phone, MapPin, 
  Shield, ArrowLeft, Download, Printer, Edit, 
  Home, Star, Users, 
  FileText, Briefcase, BadgeCheck,
  CircleCheck, CheckCircle2,
  Clock, Heart, Landmark, Monitor, Smartphone,
  ShieldAlert, CreditCard,
  Wallet, Search, FilterX,
  CreditCard as PaymentIcon, Lock,
  Globe2,
  ArrowRight, Copy, X
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';

import robertAvatar from '../assets/indian_man_portrait_1.png';

const GuardianDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast, showToast, hideToast } = useToast();
  const [activeTab, setActiveTab] = useState('financials');
  const [isPrinting, setIsPrinting] = useState(false);
  const [logSearch, setLogSearch] = useState('');

  const tabs = [
    { id: 'financials', label: 'Financials Ledger', icon: <Wallet size={16} /> },
    { id: 'activity', label: 'Access Logs', icon: <Shield size={16} /> }
  ];
  const [logSearchOpen, setLogSearchOpen] = useState(false);
  const [resetPwdStep, setResetPwdStep] = useState(null); // null | 'confirm' | 'processing' | 'success'
  const [tempPassword, setTempPassword] = useState('');
  const [copied, setCopied] = useState(false);

  // Edit Profile State
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [editForm, setEditForm] = useState(() => ({
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    dob: '',
    occupation: '',
    company: '',
    emergencyContact: '',
    accountType: '',
    status: '',
    relation: ''
  }));

  // --- Financial & Modal Interactive States ---
  const [activeModal, setActiveModal] = useState(null); // 'issue_invoice' | 'pay' | 'details' | 'audit' | 'export' | null
  const [paymentStep, setPaymentStep] = useState(null); // 'processing' | 'success' | null
  const [paymentStepIndex, setPaymentStepIndex] = useState(0);
  const [exportStep, setExportStep] = useState(0);
  
  const [invoiceForm, setInvoiceForm] = useState({
    studentId: 'STU-2026-045',
    type: 'Tuition Fee',
    month: 'June 2024',
    amount: '',
    dueDate: '2024-06-15'
  });
  
  const [selectedInvoices, setSelectedInvoices] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardForm, setCardForm] = useState({
    number: '',
    name: 'Robert Wilson',
    expiry: '',
    cvv: ''
  });
  const [paymentReceipt, setPaymentReceipt] = useState(null);

  // Widescreen Ledger Audit Filters
  const [auditSearch, setAuditSearch] = useState('');
  const [auditFilterStatus, setAuditFilterStatus] = useState('All');
  const [auditFilterType, setAuditFilterType] = useState('All');

  const getStoredGuardian = () => {
    const stored = localStorage.getItem('guardians');
    const targetId = id || 'GDN-2026-001';
    if (stored) {
      const list = JSON.parse(stored);
      const found = list.find(g => g.id === targetId);
      if (found) {
        return {
          id: found.id,
          name: found.name,
          relation: found.relation || 'Father',
          status: found.status === 'active' ? 'Active' : found.status === 'suspended' ? 'Suspended' : found.status === 'pending' ? 'Pending' : found.status || 'Active',
          img: found.id === 'GDN-2026-001' ? robertAvatar : (found.avatarUrl || found.img || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(found.name || found.id)}`),
          color: found.color || '#10B981',
          email: found.email || 'guardian@example.com',
          phone: found.phone || '+91 98765 43290',
          address: found.address || '123 School Lane, Noida, UP',
          gender: found.gender || 'Male',
          dob: found.dob || '01 Jan 1980',
          occupation: found.occupation || 'Professional',
          company: found.company || 'N/A',
          joiningDate: found.joiningDate || '01 Jan 2020',
          emergencyContact: found.emergencyContact || '+91 98765 43290',
          linkedStudents: found.linkedStudents || (found.students || []).map((s, i) => ({
            id: `STU-2026-0${45 + i}`,
            name: s,
            grade: '10A',
            attendance: '95%',
            perf: 'B+'
          })),
          lastActive: found.lastActive || found.lastLogin || 'Recently',
          accountType: found.accountType || 'Standard Parent Portal'
        };
      }
    }
    // Default fallback
    return {
      id: targetId,
      name: 'Rajesh Verma',
      relation: 'Father',
      status: 'Active',
      img: robertAvatar,
      color: '#4880FF',
      email: 'rajesh.v@example.com',
      phone: '+91 98765 43299',
      address: 'Block C, Sector 62, Noida, UP 201301',
      gender: 'Male',
      dob: '15 Mar 1980',
      occupation: 'Senior Software Architect',
      company: 'Tech Solutions India',
      joiningDate: '10 Jan 2020',
      emergencyContact: '+91 98765 43290',
      linkedStudents: [
        { id: 'STU101', name: 'Aman Verma', grade: '10A', attendance: '98%', perf: 'A+' },
        { id: 'STU108', name: 'Neha Sharma', grade: '12C', attendance: '95%', perf: 'B+' }
      ],
      lastActive: '2 hours ago',
      accountType: 'Premium Parent Portal'
    };
  };


  const guardian = getStoredGuardian();

  const getStoredLogs = () => {
    const targetId = id || 'GDN-2026-001';
    const key = `guardian_logs_${targetId}`;
    const stored = localStorage.getItem(key);
    
    const mapIcon = (name) => {
      const size = 18;
      switch (name) {
        case 'Globe2': return <Globe2 size={size} />;
        case 'Smartphone': return <Smartphone size={size} />;
        case 'Lock': return <Lock size={size} />;
        case 'ShieldAlert': return <ShieldAlert size={size} />;
        case 'CircleCheck': return <CircleCheck size={size} />;
        case 'BadgeCheck': return <BadgeCheck size={size} />;
        case 'Edit': return <Edit size={size} />;
        case 'User': return <User size={size} />;
        default: return <CircleCheck size={size} />;
      }
    };

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map(log => ({
          ...log,
          icon: mapIcon(log.iconName || 'CircleCheck')
        }));
      } catch (e) {
        console.error('Failed to parse logs', e);
      }
    }

    const defaultLogs = [
      { id: 1, date: '08 May 2024', time: '10:45 AM', action: 'Successful Login', ip: '192.168.1.1', device: 'Chrome 124 / Windows 11', location: 'Noida, UP', status: 'Authorized', iconName: 'Globe2', color: '#10B981', details: 'Session started from registered workplace IP.' },
      { id: 2, date: '07 May 2024', time: '02:30 PM', action: 'Student Profile View', ip: '192.168.1.1', device: 'Safari Mobile / iPhone 15', location: 'Noida, UP', status: 'Authorized', iconName: 'Smartphone', color: '#4880FF', details: 'Viewed academic performance for Aman Verma.' },
      { id: 3, date: '06 May 2024', time: '09:15 AM', action: 'Password Change', ip: '192.168.1.1', device: 'Chrome 124 / Windows 11', location: 'Noida, UP', status: 'Secure', iconName: 'Lock', color: '#F59E0B', details: 'Manual password update through dashboard settings.' },
      { id: 4, date: '05 May 2024', time: '11:20 PM', action: 'Failed Login Attempt', ip: '110.23.45.67', device: 'Firefox / Unknown OS', location: 'Moscow, RU', status: 'Blocked', iconName: 'ShieldAlert', color: '#EF4444', details: 'Suspicious login attempt blocked by institutional firewall.' },
      { id: 5, date: '04 May 2024', time: '08:10 AM', action: 'Attendance View', ip: '192.168.1.1', device: 'Chrome 124 / Windows 11', location: 'Noida, UP', status: 'Authorized', iconName: 'CircleCheck', color: '#10B981', details: 'Checked weekly attendance logs for linked students.' }
    ];

    localStorage.setItem(key, JSON.stringify(defaultLogs));
    return defaultLogs.map(log => ({ ...log, icon: mapIcon(log.iconName) }));
  };

  const [logsList, setLogsList] = useState(() => getStoredLogs());

  const [invoicesList, setInvoicesList] = useState([
    { id: 'INV-4521', month: 'May 2024', amount: 1250, dueDate: '15 May 2024', status: 'Pending', type: 'Tuition Fee', progress: 0 },
    { id: 'INV-4402', month: 'April 2024', amount: 1350, dueDate: '15 Apr 2024', status: 'Paid', type: 'Full Semester', progress: 100 },
    { id: 'INV-4288', month: 'March 2024', amount: 150, dueDate: '15 Mar 2024', status: 'Paid', type: 'Transport', progress: 100 },
    { id: 'INV-4105', month: 'Feb 2024', amount: 200, dueDate: '15 Feb 2024', status: 'Overdue', type: 'Library Fine/Misc', progress: 40 }
  ]);

  // Calculate dynamic outstanding balance
  const outstandingBalance = invoicesList
    .filter(inv => inv.status !== 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  // Compute dynamic pie data from the live state of invoices
  const pieData = (() => {
    let tuition = 8500 - 1350; // baseline tuition minus April tuition
    let transport = 1200 - 150; // baseline transport minus March transport
    let other = 450;
    
    invoicesList.forEach(inv => {
      if (inv.status === 'Paid') {
        if (inv.type.includes('Tuition') || inv.type.includes('Semester')) {
          tuition += inv.amount;
        } else if (inv.type.includes('Transport')) {
          transport += inv.amount;
        } else {
          other += inv.amount;
        }
      }
    });

    return [
      { name: 'Tuition', value: tuition, color: '#4880FF' },
      { name: 'Transport', value: transport, color: '#10B981' },
      { name: 'Other', value: other, color: '#F59E0B' },
    ];
  })();

  // Compute dynamic trend data
  const trendData = (() => {
    const baseTrend = [
      { month: 'Jan', current: 1200, prev: 1000 },
      { month: 'Feb', current: 1500, prev: 1300 },
      { month: 'Mar', current: 1100, prev: 1100 },
      { month: 'Apr', current: 1800, prev: 1400 },
      { month: 'May', current: 1300, prev: 1200 },
    ];
    
    invoicesList.forEach(inv => {
      if (inv.status === 'Paid') {
        const monthAbbr = inv.month.substring(0, 3);
        const match = baseTrend.find(b => b.month === monthAbbr);
        if (match) {
          if (inv.id !== 'INV-4402' && inv.id !== 'INV-4288') {
            match.current += inv.amount;
          }
        } else {
          const newMonthAbbr = inv.month.substring(0, 3);
          const existing = baseTrend.find(b => b.month === newMonthAbbr);
          if (existing) {
            existing.current += inv.amount;
          } else {
            baseTrend.push({ month: newMonthAbbr, current: inv.amount, prev: 800 });
          }
        }
      }
    });
    
    return baseTrend;
  })();

  // Helper to add activity log entry dynamically
  const addLogEntry = (action, status, details, color = '#10B981', icon = null) => {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()}`;
    
    const newLog = {
      id: Date.now(),
      date: dateStr,
      time: timeStr,
      action: action,
      ip: '192.168.1.1',
      device: 'Chrome 124 / Windows 11',
      location: 'Chicago, IL',
      status: status,
      icon: icon || <CircleCheck size={18} />,
      color: color,
      details: details
    };

    // Save to localStorage
    const targetId = id || 'GDN-2026-001';
    const key = `guardian_logs_${targetId}`;
    const stored = localStorage.getItem(key);
    let logList = [];
    if (stored) {
      try {
        logList = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    const serializableLog = {
      id: newLog.id,
      date: newLog.date,
      time: newLog.time,
      action: newLog.action,
      ip: newLog.ip,
      device: newLog.device,
      location: newLog.location,
      status: newLog.status,
      iconName: action.includes('Password') ? 'Lock' : (action.includes('Receipt') ? 'FileText' : 'CircleCheck'),
      color: newLog.color,
      details: newLog.details
    };
    localStorage.setItem(key, JSON.stringify([serializableLog, ...logList]));
    
    setLogsList(prev => [newLog, ...prev]);
  };

  const handleResetPassword = () => {
    setResetPwdStep('processing');
    setTimeout(() => {
      const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
      const lower = 'abcdefghjkmnpqrstuvwxyz';
      const digits = '23456789';
      const symbols = '!@#$%&*';
      const rand = (str) => str[Math.floor(Math.random() * str.length)];
      const pwd = [
        rand(upper), rand(upper),
        rand(digits), rand(digits), rand(digits), rand(digits),
        rand(symbols), rand(symbols),
        rand(lower), rand(lower), rand(lower), rand(lower)
      ].sort(() => Math.random() - 0.5).join('');
      setTempPassword(pwd);
      setResetPwdStep('success');
    }, 2000);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(tempPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const [isDownloadingHistory, setIsDownloadingHistory] = useState(false);
  const [saveProfileToast, setSaveProfileToast] = useState(false);

  const openEditProfile = () => {
    const g = getStoredGuardian();
    setEditForm({
      name: g.name,
      email: g.email,
      phone: g.phone,
      address: g.address,
      gender: g.gender,
      dob: g.dob,
      occupation: g.occupation,
      company: g.company,
      emergencyContact: g.emergencyContact,
      accountType: g.accountType,
      status: g.status,
      relation: g.relation
    });
    setEditProfileOpen(true);
  };

  const handleSaveProfile = () => {
    if (!editForm.name.trim() || !editForm.email.trim() || !editForm.phone.trim()) {
      showToast('Name, Email and Phone are required.', 'error', 'Validation Error');
      return;
    }
    setIsSavingProfile(true);
    setTimeout(() => {
      const targetId = id || 'GDN-2026-001';
      const stored = localStorage.getItem('guardians');
      let list = stored ? JSON.parse(stored) : [];
      const idx = list.findIndex(g => g.id === targetId);
      const updatedEntry = {
        ...(idx >= 0 ? list[idx] : {}),
        id: targetId,
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        address: editForm.address.trim(),
        gender: editForm.gender,
        dob: editForm.dob,
        occupation: editForm.occupation.trim(),
        company: editForm.company.trim(),
        emergencyContact: editForm.emergencyContact.trim(),
        accountType: editForm.accountType.trim(),
        status: editForm.status,
        relation: editForm.relation
      };
      if (idx >= 0) {
        list[idx] = updatedEntry;
      } else {
        list.push(updatedEntry);
      }
      localStorage.setItem('guardians', JSON.stringify(list));

      // Log the edit action
      addLogEntry(
        'Profile Updated',
        'Authorized',
        `Guardian profile data was updated by institutional admin.`,
        '#8B5CF6',
        <Edit size={18} />
      );

      setIsSavingProfile(false);
      setEditProfileOpen(false);
      setSaveProfileToast(true);
      setTimeout(() => setSaveProfileToast(false), 3500);
      // Reload to reflect changes
      setTimeout(() => window.location.reload(), 400);
    }, 1200);
  };

  const handleDownloadHistory = () => {
    setIsDownloadingHistory(true);
    setTimeout(() => {
      const lines = [
        '================================================',
        '     EDUPRO ACADEMY — SECURITY ACCESS LOG REPORT',
        '================================================',
        `Guardian Name:  ${guardian.name}`,
        `Guardian ID:    ${guardian.id}`,
        `Email:          ${guardian.email}`,
        `Account Type:   ${guardian.accountType}`,
        `Report Date:    ${new Date().toLocaleString()}`,
        `Total Entries:  ${logsList.length}`,
        '------------------------------------------------',
        '',
        ...logsList.map((log, i) => [
          `Entry #${i + 1}`,
          `  Action:    ${log.action}`,
          `  Status:    ${log.status}`,
          `  Date:      ${log.date} at ${log.time}`,
          `  IP:        ${log.ip}`,
          `  Device:    ${log.device}`,
          `  location:  ${log.location}`,
          `  Details:   ${log.details}`,
          '  - - - - - - - - - - - - - - - - - - - - - -',
        ].join('\n')),
        '',
        '================================================',
        'Confidential — For Authorized Institutional Use Only',
        '================================================',
      ].join('\n');

      const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${guardian.name.replace(/\s+/g, '_')}_Access_Log_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsDownloadingHistory(false);
    }, 900);
  };

  // --- Financial Actions Handlers ---
  const generateAndDownloadCSV = () => {
    const csvLines = [
      '================================================',
      '       EDUPRO ACADEMY — INSTITUTIONAL BILLING AUDIT',
      '================================================',
      `Guardian Name:  ${guardian.name}`,
      `Guardian ID:    ${guardian.id}`,
      `Email:          ${guardian.email}`,
      `Report Date:    ${new Date().toLocaleString()}`,
      `Total Outstanding Balance: $${outstandingBalance.toLocaleString()}`,
      '------------------------------------------------',
      'Invoice ID,Month,Type,Amount,Due Date,Status,Progress',
      ...invoicesList.map(inv => 
        `${inv.id},"${inv.month}","${inv.type}",${inv.amount},"${inv.dueDate}",${inv.status},${inv.progress}%`
      ),
      '================================================',
      'Confidential — Institutional Auditing Record',
      '================================================',
    ].join('\n');

    const blob = new Blob([csvLines], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${guardian.name.replace(/\s+/g, '_')}_Financial_Audit_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportAnalytics = () => {
    setActiveModal('export');
    setExportStep(0);

    const interval = setInterval(() => {
      setExportStep(prev => {
        if (prev < 4) {
          return prev + 1;
        } else {
          clearInterval(interval);
          
          // Generate and trigger download
          generateAndDownloadCSV();

          // Log entry
          addLogEntry(
            'Financial Export',
            'Authorized',
            'Compiled and downloaded premium financial ledger report.',
            '#4880FF',
            <Download size={18} />
          );

          return 5;
        }
      });
    }, 650);
  };

  const handleIssueInvoice = (e) => {
    e.preventDefault();
    if (!invoiceForm.amount || parseFloat(invoiceForm.amount) <= 0) {
      showToast('Please enter a valid positive amount.', 'error', 'Invalid Amount');
      return;
    }

    const student = guardian.linkedStudents.find(s => s.id === invoiceForm.studentId);
    const studentName = student ? student.name : 'Student';

    // Format date beautifully if possible
    const formattedDate = new Date(invoiceForm.dueDate).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const newInvoice = {
      id: `INV-${Math.floor(4000 + Math.random() * 6000)}`,
      month: invoiceForm.month,
      amount: parseFloat(invoiceForm.amount),
      dueDate: formattedDate,
      status: 'Pending',
      type: invoiceForm.type,
      progress: 0
    };

    setInvoicesList(prev => [newInvoice, ...prev]);

    // Log entry
    addLogEntry(
      'Invoice Issued', 
      'Pending', 
      `Issued ${newInvoice.type} of $${newInvoice.amount.toLocaleString()} for ${studentName}.`, 
      '#F59E0B', 
      <FileText size={18} />
    );

    setActiveModal(null);
    setInvoiceForm({
      studentId: 'STU-2026-045',
      type: 'Tuition Fee',
      month: 'June 2024',
      amount: '',
      dueDate: '2024-06-15'
    });
  };

  const openPaymentModal = () => {
    const initialSelection = {};
    invoicesList.forEach(inv => {
      if (inv.status !== 'Paid') {
        initialSelection[inv.id] = true;
      }
    });
    setSelectedInvoices(initialSelection);
    setPaymentReceipt(null);
    setPaymentStep(null);
    setPaymentStepIndex(0);
    setCardForm({
      number: '',
      name: 'Rajesh Verma',
      expiry: '',
      cvv: ''
    });
    setActiveModal('pay');
  };

  const openPaymentModalForInvoice = (invoiceId) => {
    setSelectedInvoices({ [invoiceId]: true });
    setPaymentReceipt(null);
    setPaymentStep(null);
    setPaymentStepIndex(0);
    setCardForm({
      number: '',
      name: 'Rajesh Verma',
      expiry: '',
      cvv: ''
    });
    setActiveModal('pay');
  };

  const handleViewReceipt = (inv) => {
    if (inv.status !== 'Paid') {
      showToast(`Invoice ${inv.id} is outstanding. Redirecting to secure payment checkout...`, 'info', 'Outstanding Invoice');
      openPaymentModalForInvoice(inv.id);
      return;
    }

    const printWindow = window.open('', '_blank', 'width=700,height=600');
    if (!printWindow) {
      showToast("Popup blocker is active. Please enable popups to print receipt.", "error");
      return;
    }
    const txId = `TXN-${inv.id.replace('INV-', '')}-${Math.floor(100000 + Math.random() * 900000)}`;
    const mockDate = new Date().toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    printWindow.document.write(`
      <html>
      <head>
        <title>Receipt — ${txId}</title>
        <style>
          body { font-family: monospace; padding: 40px; color: #1e293b; background: #fff; }
          .receipt { max-width: 500px; margin: 0 auto; border: 1px dashed #cbd5e1; padding: 24px; border-radius: 8px; }
          .title { text-align: center; margin-bottom: 24px; }
          .title h2 { margin: 0; font-size: 1.4rem; font-weight: 900; }
          .title p { margin: 4px 0 0; font-size: 0.8rem; color: #64748b; }
          .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dotted #e2e8f0; font-size: 0.9rem; }
          .total { display: flex; justify-content: space-between; font-weight: 900; font-size: 1.1rem; padding: 14px 0; border-top: 2px solid #0f172a; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="title">
            <h2>EDUPRO ACADEMY</h2>
            <p>Official Billing Settlement Receipt</p>
          </div>
          <div class="row"><span>Transaction ID:</span><strong>${txId}</strong></div>
          <div class="row"><span>Date/Time:</span><span>${mockDate}</span></div>
          <div class="row"><span>Payment Method:</span><span>Credit Card (Ending in *8901)</span></div>
          <div style="margin: 20px 0 10px; font-weight: bold; font-size: 0.85rem; color: #64748b;">Paid Items:</div>
          <div class="row"><span>${inv.id} (${inv.type})</span><span>$${inv.amount.toLocaleString()}</span></div>
          <div class="total"><span>TOTAL CHARGE:</span><span>$${inv.amount.toLocaleString()}</span></div>
          <div style="text-align: center; margin-top: 28px; font-size: 0.75rem; color: #94a3b8;">Thank you for your secure educational settlement.</div>
        </div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleProcessPayment = () => {
    const selectedIds = Object.keys(selectedInvoices).filter(id => selectedInvoices[id]);
    if (selectedIds.length === 0) {
      showToast('Please select at least one outstanding invoice to pay.', 'error', 'No Invoice Selected');
      return;
    }

    if (paymentMethod === 'card') {
      if (cardForm.number.replace(/\s/g, '').length < 15) {
        showToast('Please enter a valid credit card number.', 'error', 'Invalid Card Number');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardForm.expiry)) {
        showToast('Please enter a valid expiry date (MM/YY).', 'error', 'Invalid Expiry');
        return;
      }
      if (cardForm.cvv.length < 3) {
        showToast('Please enter a valid 3-digit CVV.', 'error', 'Invalid CVV');
        return;
      }
    }

    setPaymentStep('processing');
    setPaymentStepIndex(0);

    const steps = [
      'Establishing secure gateway connection...',
      'Authenticating bank credentials (TLS 1.3)...',
      'Synchronizing institutional transaction ledger...'
    ];

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < steps.length) {
        setPaymentStepIndex(current);
      } else {
        clearInterval(interval);
        
        // Finalize transaction
        const paidItems = invoicesList.filter(inv => selectedIds.includes(inv.id));
        const totalPaid = paidItems.reduce((sum, inv) => sum + inv.amount, 0);
        
        // Update invoicesList status
        setInvoicesList(prev => prev.map(inv => {
          if (selectedIds.includes(inv.id)) {
            return { ...inv, status: 'Paid', progress: 100 };
          }
          return inv;
        }));

        // Log entry
        const txId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
        const itemNames = paidItems.map(inv => `${inv.id} (${inv.type})`).join(', ');
        
        addLogEntry(
          'Secure Payment', 
          'Paid', 
          `Processed online payment of $${totalPaid.toLocaleString()} for: ${itemNames}. Transaction: ${txId}.`, 
          '#10B981', 
          <CreditCard size={18} />
        );

        // Generate receipt
        setPaymentReceipt({
          txId,
          date: new Date().toLocaleString(),
          items: paidItems,
          total: totalPaid,
          method: paymentMethod === 'card' 
            ? `Credit Card (Ending in *${cardForm.number.slice(-4)})` 
            : paymentMethod === 'bank' ? 'SECURE-PAY Instant Bank Transfer' : 'Apple Pay'
        });

        setPaymentStep('success');
      }
    }, 800);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      showToast("Popup blocker is active. Please enable popups to print record.", "error");
      setIsPrinting(false);
      return;
    }

    const statusColor = (status) => {
      if (status === 'Paid') return '#10B981';
      if (status === 'Overdue') return '#EF4444';
      return '#F59E0B';
    };

    const invoiceRows = invoicesList.map(inv => `
      <tr style="border-bottom:1px solid #e2e8f0;">
        <td style="padding:12px 16px;">
          <div style="font-weight:800;color:#4880FF;font-size:0.85rem;">${inv.id}</div>
          <div style="font-size:0.7rem;color:#94a3b8;">${inv.month}</div>
        </td>
        <td style="padding:12px 16px;">
          <div style="font-weight:700;font-size:0.85rem;">${inv.type}</div>
          <div style="font-size:0.7rem;color:#94a3b8;">Due: ${inv.dueDate}</div>
        </td>
        <td style="padding:12px 16px;">
          <span style="padding:4px 10px;border-radius:20px;font-size:0.65rem;font-weight:900;background:${statusColor(inv.status)}18;color:${statusColor(inv.status)};">${inv.status.toUpperCase()}</span>
        </td>
        <td style="padding:12px 16px;font-weight:900;font-size:0.95rem;">$${inv.amount.toLocaleString()}</td>
      </tr>
    `).join('');

    const studentCards = guardian.linkedStudents.map(stu => `
      <div style="padding:20px;border-radius:16px;border:1px solid #e2e8f0;background:#f8fafc;">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px;">
          <div style="width:44px;height:44px;border-radius:12px;background:#4880FF;color:white;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:0.9rem;">
            ${stu.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div style="font-weight:900;font-size:1rem;">${stu.name}</div>
            <div style="font-size:0.75rem;color:#64748b;">ID: ${stu.id} &nbsp;·&nbsp; Grade ${stu.grade}</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding-top:12px;border-top:1px solid #e2e8f0;">
          <div><div style="font-size:0.6rem;font-weight:800;color:#94a3b8;text-transform:uppercase;">Attendance</div><div style="font-size:1rem;font-weight:900;color:#10B981;">${stu.attendance}</div></div>
          <div style="text-align:right"><div style="font-size:0.6rem;font-weight:800;color:#94a3b8;text-transform:uppercase;">Performance</div><div style="font-size:1rem;font-weight:900;color:#4880FF;">${stu.perf}</div></div>
        </div>
      </div>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Guardian Record — ${guardian.name}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; background: #fff; color: #1e293b; padding: 48px; font-size: 14px; }
          .header-bar { display: flex; justify-content: space-between; align-items: center; padding-bottom: 24px; border-bottom: 3px solid #4880FF; margin-bottom: 36px; }
          .header-bar h1 { font-size: 1.6rem; font-weight: 900; color: #0f172a; }
          .header-bar p { font-size: 0.8rem; color: #64748b; font-weight: 600; margin-top: 4px; }
          .badge { padding: 6px 14px; border-radius: 20px; font-size: 0.65rem; font-weight: 900; }
          .badge-active { background: #10B98115; color: #10B981; }
          .badge-suspended { background: #EF444415; color: #EF4444; }
          .section { margin-bottom: 36px; }
          .section-title { font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 40px; }
          .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #e2e8f0; }
          .info-label { color: #64748b; font-weight: 600; }
          .info-val { font-weight: 800; }
          .student-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          table { width: 100%; border-collapse: collapse; }
          thead tr { background: #f8fafc; }
          th { padding: 12px 16px; font-size: 0.65rem; font-weight: 900; text-transform: uppercase; color: #94a3b8; text-align: left; }
          .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 0.75rem; color: #94a3b8; font-weight: 600; }
          @media print { body { padding: 32px; } }
        </style>
      </head>
      <body>
        <div class="header-bar">
          <div>
            <h1>Guardian Record — ${guardian.name}</h1>
            <p>EduPro Academy &nbsp;·&nbsp; Guardian ID: ${guardian.id} &nbsp;·&nbsp; Printed: ${new Date().toLocaleString()}</p>
          </div>
          <span class="badge badge-${guardian.status.toLowerCase()}">${guardian.status.toUpperCase()}</span>
        </div>

        <!-- Personal & Contact -->
        <div class="section">
          <div class="section-title">Personal &amp; Contact Information</div>
          <div class="info-grid">
            <div>
              <div class="info-row"><span class="info-label">Full Name</span><span class="info-val">${guardian.name}</span></div>
              <div class="info-row"><span class="info-label">Relation</span><span class="info-val">${guardian.relation}</span></div>
              <div class="info-row"><span class="info-label">Date of Birth</span><span class="info-val">${guardian.dob}</span></div>
              <div class="info-row"><span class="info-label">Gender</span><span class="info-val">${guardian.gender}</span></div>
              <div class="info-row"><span class="info-label">Joined Institution</span><span class="info-val">${guardian.joiningDate}</span></div>
            </div>
            <div>
              <div class="info-row"><span class="info-label">Email</span><span class="info-val">${guardian.email}</span></div>
              <div class="info-row"><span class="info-label">Phone</span><span class="info-val">${guardian.phone}</span></div>
              <div class="info-row"><span class="info-label">Address</span><span class="info-val">${guardian.address}</span></div>
              <div class="info-row"><span class="info-label">Emergency Contact</span><span class="info-val">${guardian.emergencyContact}</span></div>
              <div class="info-row"><span class="info-label">Account Type</span><span class="info-val">${guardian.accountType}</span></div>
            </div>
          </div>
        </div>

        <!-- Professional Info -->
        <div class="section">
          <div class="section-title">Professional Information</div>
          <div class="info-grid">
            <div>
              <div class="info-row"><span class="info-label">Occupation</span><span class="info-val">${guardian.occupation}</span></div>
              <div class="info-row"><span class="info-label">Organization</span><span class="info-val">${guardian.company}</span></div>
            </div>
            <div>
              <div class="info-row"><span class="info-label">Work Address</span><span class="info-val">Corporate Hub, Level 12</span></div>
              <div class="info-row"><span class="info-label">Office Phone</span><span class="info-val">+1 234 567 8955</span></div>
            </div>
          </div>
        </div>

        <!-- Linked Students -->
        <div class="section">
          <div class="section-title">Linked Students (${guardian.linkedStudents.length})</div>
          <div class="student-grid">${studentCards}</div>
        </div>

        <!-- Billing Ledger -->
        <div class="section">
          <div class="section-title">Billing &amp; Transaction Ledger</div>
          <table>
            <thead>
              <tr><th>Invoice</th><th>Description</th><th>Status</th><th>Amount</th></tr>
            </thead>
            <tbody>${invoiceRows}</tbody>
          </table>
        </div>

        <!-- Security -->
        <div class="section">
          <div class="section-title">Account Security Summary</div>
          <div class="info-grid">
            <div>
              <div class="info-row"><span class="info-label">2FA Status</span><span class="info-val" style="color:#10B981;">ENABLED</span></div>
              <div class="info-row"><span class="info-label">Web Portal Access</span><span class="info-val" style="color:#10B981;">ALLOWED</span></div>
            </div>
            <div>
              <div class="info-row"><span class="info-label">Last Active</span><span class="info-val">${guardian.lastActive}</span></div>
              <div class="info-row"><span class="info-label">Guardian ID</span><span class="info-val">${guardian.id}</span></div>
            </div>
          </div>
        </div>

        <div class="footer">
          <span>EduPro Academy &mdash; Institutional Guardian Record</span>
          <span>Confidential &mdash; For Authorized Use Only</span>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => setIsPrinting(false), 1500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '60px' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Reset Password Modal ── */}
      <AnimatePresence>
        {resetPwdStep && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
          }}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => resetPwdStep !== 'processing' && setResetPwdStep(null)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(8px)' }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: 'spring', damping: 26, stiffness: 340 }}
              style={{
                position: 'relative', width: '100%', maxWidth: '440px',
                backgroundColor: 'var(--bg-card)', borderRadius: '24px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 25px 60px -12px rgba(0,0,0,0.35)',
                overflow: 'hidden'
              }}
            >
              {/* Top accent */}
              <div style={{ height: '4px', background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }} />

              <div style={{ padding: '32px' }}>
                {/* Close button — hidden during processing */}
                {resetPwdStep !== 'processing' && (
                  <button
                    onClick={() => setResetPwdStep(null)}
                    style={{
                      position: 'absolute', top: '20px', right: '20px',
                      background: 'none', border: '1px solid var(--border-color)',
                      borderRadius: '10px', cursor: 'pointer', padding: '6px',
                      color: 'var(--text-muted)', backgroundColor: 'var(--bg-body)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <X size={16} />
                  </button>
                )}

                {/* ── Step: Confirm ── */}
                {resetPwdStep === 'confirm' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.08, damping: 14, stiffness: 220 }}
                      style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        backgroundColor: '#f59e0b18', color: '#f59e0b',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '24px'
                      }}
                    >
                      <Lock size={28} strokeWidth={2.5} />
                    </motion.div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 8px 0' }}>Reset Portal Password?</h3>
                    <p style={{ margin: '0 0 20px 0', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      A new temporary password will be generated and issued for
                      &nbsp;<strong style={{ color: 'var(--text-main)' }}>{guardian.name}</strong>.
                      They must change it on next login.
                    </p>

                    {/* Guardian info strip */}
                    <div style={{
                      padding: '14px 18px', borderRadius: '14px',
                      backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)',
                      display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px'
                    }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '10px',
                        backgroundColor: '#f59e0b18', color: '#f59e0b',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 900, fontSize: '0.85rem', flexShrink: 0
                      }}>
                        {guardian.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{guardian.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{guardian.email}</div>
                      </div>
                    </div>

                    <p style={{
                      padding: '12px 14px', borderRadius: '10px',
                      backgroundColor: '#f59e0b08', border: '1px solid #f59e0b30',
                      color: '#d97706', fontSize: '0.8rem', fontWeight: 700,
                      margin: '0 0 28px 0', lineHeight: 1.5
                    }}>
                      ⚠ The current password will be immediately invalidated. The guardian will be logged out of all active sessions.
                    </p>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => setResetPwdStep(null)}
                        className="btn"
                        style={{ flex: 1, padding: '13px', borderRadius: '14px', fontWeight: 800, border: '1px solid var(--border-color)' }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleResetPassword}
                        style={{
                          flex: 1, padding: '13px', borderRadius: '14px', fontWeight: 800,
                          background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                          color: 'white', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}
                      >
                        <Lock size={15} /> Reset Now
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── Step: Processing ── */}
                {resetPwdStep === 'processing' && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ padding: '20px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
                  >
                    <div style={{
                      width: '64px', height: '64px', borderRadius: '50%',
                      border: '4px solid var(--border-color)', borderTopColor: '#f59e0b',
                      animation: 'spin 0.9s linear infinite'
                    }} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Resetting Credentials</h4>
                      <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Invalidating active sessions &amp; generating secure password...
                      </p>
                    </div>
                    {/* Progress bar */}
                    <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                        style={{ height: '100%', width: '50%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)', borderRadius: '2px' }}
                      />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, margin: 0 }}>
                      Do not close this window.
                    </p>
                  </motion.div>
                )}

                {/* ── Step: Success ── */}
                {resetPwdStep === 'success' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.06, damping: 14, stiffness: 200 }}
                      style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        backgroundColor: '#10B98115', color: '#10B981',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '20px'
                      }}
                    >
                      <CheckCircle2 size={32} strokeWidth={2.5} />
                    </motion.div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0 0 6px 0' }}>Password Reset Successfully</h3>
                    <p style={{ margin: '0 0 24px 0', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                      A new temporary password has been issued for <strong style={{ color: 'var(--text-main)' }}>{guardian.name}</strong>.
                      All active sessions have been terminated.
                    </p>

                    {/* Temp password display */}
                    <div style={{
                      marginBottom: '24px', padding: '18px', borderRadius: '16px',
                      backgroundColor: 'var(--bg-body)', border: '1px dashed #10B98150'
                    }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#10B981', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>
                        Temporary Password — Share Securely
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <code style={{
                          flex: 1, fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 900,
                          letterSpacing: '2px', color: 'var(--text-main)',
                          backgroundColor: 'var(--bg-card)', padding: '10px 14px',
                          borderRadius: '10px', border: '1px solid var(--border-color)'
                        }}>
                          {tempPassword}
                        </code>
                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={handleCopyPassword}
                          style={{
                            padding: '10px 14px', borderRadius: '10px', border: 'none',
                            backgroundColor: copied ? '#10B981' : 'var(--primary)',
                            color: 'white', cursor: 'pointer', fontWeight: 800,
                            fontSize: '0.8rem', transition: 'background 0.2s',
                            display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0
                          }}
                        >
                          {copied ? <><CheckCircle2 size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                        </motion.button>
                      </div>
                    </div>

                    <div style={{
                      padding: '12px 14px', borderRadius: '10px',
                      backgroundColor: '#10B98108', border: '1px solid #10B98130',
                      fontSize: '0.8rem', fontWeight: 700, color: '#059669',
                      marginBottom: '24px', lineHeight: 1.5
                    }}>
                      ✓ Guardian will be prompted to change this password on their next login.
                    </div>

                    <button
                      onClick={() => { setResetPwdStep(null); setTempPassword(''); setCopied(false); }}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '13px', borderRadius: '14px', fontWeight: 800, justifyContent: 'center' }}
                    >
                      Done
                    </button>
                  </motion.div>
                )}
              </div>
             </motion.div>
           </div>
         )}

         {/* ── Export Progress Overlay Modal ── */}
         {activeModal === 'export' && (
           <div style={{
             position: 'fixed', inset: 0, zIndex: 9999,
             display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
           }}>
             <motion.div
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => exportStep === 5 && setActiveModal(null)}
               style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(8px)', cursor: exportStep === 5 ? 'pointer' : 'default' }}
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.92, y: 24 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.92, y: 24 }}
               transition={{ type: 'spring', damping: 26, stiffness: 340 }}
               style={{
                 position: 'relative', width: '100%', maxWidth: '480px',
                 backgroundColor: '#0f172a', borderRadius: '24px',
                 border: '1px solid rgba(255,255,255,0.1)',
                 boxShadow: '0 25px 60px -12px rgba(0,0,0,0.55)',
                 color: 'white', overflow: 'hidden'
               }}
             >
               <div style={{ height: '4px', background: 'linear-gradient(90deg, #38bdf8, #10b981)' }} />
               
               {exportStep === 5 && (
                 <button 
                   onClick={() => setActiveModal(null)} 
                   style={{ 
                     position: 'absolute', top: '20px', right: '20px', 
                     background: 'none', border: '1px solid rgba(255,255,255,0.15)', 
                     borderRadius: '10px', cursor: 'pointer', padding: '6px', 
                     color: '#94a3b8', backgroundColor: 'rgba(255,255,255,0.05)', 
                     display: 'flex', alignItems: 'center', justifyContent: 'center' 
                   }}
                 >
                   <X size={16} />
                 </button>
               )}

               <div style={{ padding: '32px', textAlign: 'center' }}>
                 {exportStep < 5 ? (
                   <>
                     <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                       <div style={{
                         width: '64px', height: '64px', borderRadius: '50%',
                         border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#38bdf8',
                         animation: 'spin 0.9s linear infinite', margin: '0 auto'
                       }} />
                     </div>
                     <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 8px 0', color: '#38bdf8' }}>Institutional Ledger Compiler</h3>
                     <p style={{ margin: '0 0 24px 0', color: '#94a3b8', fontSize: '0.85rem' }}>Compiling complete audit history and financial parameters...</p>
                     
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                       {[
                         'Aggregating transaction ledger records...',
                         'Calculating year-over-year revenue allocations...',
                         'Compiling high-fidelity audit report...',
                         'Verifying digital certificates...',
                         'Generating dynamic spreadsheet (.csv)...'
                       ].map((stepMsg, idx) => (
                         <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: exportStep >= idx ? '#38bdf8' : 'rgba(255,255,255,0.3)', transition: 'color 0.2s', fontWeight: exportStep >= idx ? 700 : 500 }}>
                           <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: exportStep > idx ? '#10B981' : exportStep === idx ? '#38bdf8' : 'rgba(255,255,255,0.2)', boxShadow: exportStep === idx ? '0 0 8px #38bdf8' : 'none' }} />
                           <span>{stepMsg}</span>
                           {exportStep > idx && <span style={{ marginLeft: 'auto', color: '#10B981', fontWeight: 900 }}>✓ Done</span>}
                           {exportStep === idx && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#38bdf8', animation: 'pulse 1s infinite' }}>Compiling...</span>}
                         </div>
                       ))}
                     </div>
                   </>
                 ) : (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.95 }} 
                     animate={{ opacity: 1, scale: 1 }} 
                     transition={{ duration: 0.3 }}
                   >
                     <motion.div
                       initial={{ scale: 0 }}
                       animate={{ scale: 1 }}
                       transition={{ type: 'spring', damping: 12, stiffness: 180, delay: 0.1 }}
                       style={{
                         width: '64px', height: '64px', borderRadius: '50%',
                         backgroundColor: 'rgba(16,185,129,0.15)', color: '#10b981',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         margin: '0 auto 20px auto', border: '1px solid rgba(16,185,129,0.3)'
                       }}
                     >
                       <CheckCircle2 size={32} strokeWidth={2.5} />
                     </motion.div>
                     
                     <h3 style={{ fontSize: '1.4rem', fontWeight: 950, margin: '0 0 8px 0', color: '#10b981' }}>Export Complete</h3>
                     <p style={{ margin: '0 0 24px 0', color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>
                       High-fidelity institutional billing ledger spreadsheet has been successfully compiled and downloaded.
                     </p>

                     {/* File Card Info */}
                     <div style={{
                       display: 'flex', alignItems: 'center', gap: '14px',
                       backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px',
                       borderRadius: '16px', border: '1px dashed rgba(56,189,248,0.3)',
                       textAlign: 'left', marginBottom: '24px'
                     }}>
                       <div style={{
                         width: '40px', height: '40px', borderRadius: '10px',
                         backgroundColor: 'rgba(56,189,248,0.1)', color: '#38bdf8',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         flexShrink: 0
                       }}>
                         <FileText size={20} />
                       </div>
                       <div style={{ overflow: 'hidden' }}>
                         <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                           {guardian.name.replace(/\s+/g, '_')}_Financial_Audit.csv
                         </div>
                         <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
                           Format: Comma-Separated Values • Size: ~3.8 KB
                         </div>
                       </div>
                     </div>

                     <div style={{ display: 'flex', gap: '12px' }}>
                       <button
                         onClick={generateAndDownloadCSV}
                         style={{
                           flex: 1, padding: '12px', borderRadius: '12px', fontWeight: 800,
                           backgroundColor: 'rgba(255,255,255,0.05)', color: 'white',
                           border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                           display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                         }}
                       >
                         <Download size={14} /> Download Again
                       </button>
                       <button
                         onClick={() => setActiveModal(null)}
                         style={{
                           flex: 1, padding: '12px', borderRadius: '12px', fontWeight: 800,
                           background: 'linear-gradient(135deg, #10b981, #059669)',
                           color: 'white', border: 'none', cursor: 'pointer'
                         }}
                       >
                         Done
                       </button>
                     </div>
                   </motion.div>
                 )}
               </div>
             </motion.div>
           </div>
         )}

         {/* ── Issue Invoice Modal ── */}
         {activeModal === 'issue_invoice' && (
           <div style={{
             position: 'fixed', inset: 0, zIndex: 9999,
             display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
           }}>
             <motion.div
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setActiveModal(null)}
               style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(10px)' }}
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.92, y: 24 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.92, y: 24 }}
               transition={{ type: 'spring', damping: 26, stiffness: 340 }}
               style={{
                 position: 'relative', width: '100%', maxWidth: '480px',
                 backgroundColor: 'var(--bg-card)', borderRadius: '24px',
                 border: '1px solid var(--border-color)',
                 boxShadow: '0 25px 60px -12px rgba(0,0,0,0.35)',
                 overflow: 'hidden'
               }}
             >
               <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />
               <div style={{ padding: '32px' }}>
                 <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: '1px solid var(--border-color)', borderRadius: '10px', cursor: 'pointer', padding: '6px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center' }}><X size={16} /></button>
                 
                 <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 6px 0' }}>Issue Institutional Invoice</h3>
                 <p style={{ margin: '0 0 24px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Create a new financial liability entry on the parent ledger.</p>
                 
                 <form onSubmit={handleIssueInvoice} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   <div>
                     <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Linked Student</label>
                     <select 
                       value={invoiceForm.studentId} 
                       onChange={e => setInvoiceForm(prev => ({ ...prev, studentId: e.target.value }))}
                       style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 700, outline: 'none' }}
                     >
                       {guardian.linkedStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                     </select>
                   </div>
                   
                   <div>
                     <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Fee Type Allocation</label>
                     <select 
                       value={invoiceForm.type} 
                       onChange={e => setInvoiceForm(prev => ({ ...prev, type: e.target.value }))}
                       style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 700, outline: 'none' }}
                     >
                       <option value="Tuition Fee">Tuition Fee</option>
                       <option value="Full Semester">Full Semester</option>
                       <option value="Transport">Transport</option>
                       <option value="Library Fine/Misc">Library Fine/Misc</option>
                       <option value="Exam Fee">Exam Fee</option>
                       <option value="Laboratory Fee">Laboratory Fee</option>
                     </select>
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                     <div>
                       <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Billing Month</label>
                       <select 
                         value={invoiceForm.month} 
                         onChange={e => setInvoiceForm(prev => ({ ...prev, month: e.target.value }))}
                         style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 700, outline: 'none' }}
                       >
                         <option value="May 2024">May 2024</option>
                         <option value="June 2024">June 2024</option>
                         <option value="July 2024">July 2024</option>
                         <option value="August 2024">August 2024</option>
                       </select>
                     </div>
                     <div>
                       <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Due Date</label>
                       <input 
                         type="date" 
                         value={invoiceForm.dueDate}
                         onChange={e => setInvoiceForm(prev => ({ ...prev, dueDate: e.target.value }))}
                         style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 700, outline: 'none' }}
                       />
                     </div>
                   </div>

                   <div>
                     <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Invoice Amount ($ USD)</label>
                     <div style={{ position: 'relative' }}>
                       <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 900, color: 'var(--text-muted)' }}>$</span>
                       <input 
                         type="number" 
                         required 
                         placeholder="0.00" 
                         value={invoiceForm.amount} 
                         onChange={e => setInvoiceForm(prev => ({ ...prev, amount: e.target.value }))}
                         style={{ width: '100%', padding: '12px 12px 12px 32px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 900, fontSize: '1.1rem', outline: 'none' }}
                       />
                     </div>
                   </div>

                   <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                     <button type="button" onClick={() => setActiveModal(null)} className="btn" style={{ flex: 1, padding: '12px', borderRadius: '12px', fontWeight: 800, border: '1px solid var(--border-color)' }}>Cancel</button>
                     <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '12px', fontWeight: 800, justifyContent: 'center' }}>Issue Entry</button>
                   </div>
                 </form>
               </div>
             </motion.div>
           </div>
         )}

         {/* ── Pay Securely Checkout Modal ── */}
         {activeModal === 'pay' && (
           <div style={{
             position: 'fixed', inset: 0, zIndex: 9999,
             display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
           }}>
             <motion.div
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => paymentStep !== 'processing' && setActiveModal(null)}
               style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(10px)' }}
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.92, y: 24 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.92, y: 24 }}
               transition={{ type: 'spring', damping: 26, stiffness: 340 }}
               style={{
                 position: 'relative', width: '100%', maxWidth: '850px',
                 backgroundColor: 'var(--bg-card)', borderRadius: '32px',
                 border: '1px solid var(--border-color)',
                 boxShadow: '0 25px 60px -12px rgba(0,0,0,0.35)',
                 overflow: 'hidden'
               }}
             >
               {paymentStep !== 'processing' && (
                 <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: '1px solid var(--border-color)', borderRadius: '10px', cursor: 'pointer', padding: '6px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', zIndex: 10 }}><X size={16} /></button>
               )}

               {paymentStep === null && (
                 <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', minHeight: '520px' }}>
                   {/* Left Side: Invoice Selector */}
                   <div style={{ padding: '36px', borderRight: '1px solid var(--border-color)' }}>
                     <h3 style={{ fontSize: '1.3rem', fontWeight: 950, margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Wallet size={20} color="var(--primary)" /> Secure Gateway Checkout</h3>
                     <p style={{ margin: '0 0 24px 0', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Select the outstanding invoices to process:</p>
                     
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '280px', overflowY: 'auto', paddingRight: '8px', marginBottom: '20px' }}>
                       {invoicesList.filter(inv => inv.status !== 'Paid').map(inv => (
                         <div 
                           key={inv.id} 
                           onClick={() => setSelectedInvoices(prev => ({ ...prev, [inv.id]: !prev[inv.id] }))}
                           style={{
                             padding: '16px', borderRadius: '16px', border: `2px solid ${selectedInvoices[inv.id] ? 'var(--primary)' : 'var(--border-color)'}`,
                             backgroundColor: selectedInvoices[inv.id] ? 'var(--primary-light)' : 'var(--bg-body)',
                             display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: '0.2s'
                           }}
                         >
                           <div style={{
                             width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${selectedInvoices[inv.id] ? 'var(--primary)' : 'var(--text-muted)'}`,
                             backgroundColor: selectedInvoices[inv.id] ? 'var(--primary)' : 'transparent',
                             display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'white'
                           }}>
                             {selectedInvoices[inv.id] && <CheckCircle2 size={12} strokeWidth={3} />}
                           </div>
                           <div style={{ flex: 1 }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                               <span style={{ fontWeight: 900, fontSize: '0.88rem', color: selectedInvoices[inv.id] ? 'var(--primary)' : 'inherit' }}>{inv.id} &nbsp;·&nbsp; <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>{inv.type}</span></span>
                               <span style={{ fontWeight: 950, fontSize: '0.95rem' }}>${inv.amount.toLocaleString()}</span>
                             </div>
                             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
                               <span>For: {inv.month}</span>
                               <span style={{ color: inv.status === 'Overdue' ? '#EF4444' : 'inherit' }}>Due: {inv.dueDate} ({inv.status})</span>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>

                     <div style={{ padding: '16px 20px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                         <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected Settlement Total</div>
                         <div style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--primary)', marginTop: '2px' }}>
                           ${invoicesList.filter(inv => selectedInvoices[inv.id]).reduce((sum, inv) => sum + inv.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                         </div>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10B981', fontWeight: 800 }}>
                         <Lock size={12} /> SECURE TLS 1.3
                       </div>
                     </div>
                   </div>

                   {/* Right Side: Payment Form */}
                   <div style={{ padding: '36px', backgroundColor: 'var(--bg-body)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                     <div>
                       <h4 style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.5px' }}>Payment Mechanism</h4>
                       <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                         {['card', 'bank'].map(method => (
                           <button 
                             key={method}
                             onClick={() => setPaymentMethod(method)}
                             style={{
                               flex: 1, padding: '10px 0', borderRadius: '10px', border: `1px solid ${paymentMethod === method ? 'var(--primary)' : 'var(--border-color)'}`,
                               backgroundColor: paymentMethod === method ? 'var(--bg-card)' : 'transparent',
                               color: paymentMethod === method ? 'var(--primary)' : 'var(--text-muted)',
                               fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                             }}
                           >
                             {method === 'card' ? <CreditCard size={14} /> : <Landmark size={14} />}
                             {method === 'card' ? 'Credit Card' : 'Bank Transfer'}
                           </button>
                         ))}
                       </div>

                       {paymentMethod === 'card' ? (
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                           {/* Premium Credit Card Graphic */}
                           <div style={{
                             width: '100%', height: '145px', borderRadius: '18px',
                             background: 'linear-gradient(135deg, #1e1e38 0%, #0c0c1e 100%)',
                             boxShadow: '0 10px 20px -5px rgba(0,0,0,0.3)', color: 'white',
                             padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                             fontFamily: 'monospace', textShadow: '0 2px 4px rgba(0,0,0,0.5)', position: 'relative'
                           }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                               <div style={{ width: '42px', height: '30px', borderRadius: '6px', backgroundColor: '#e2e8f015', border: '1px solid #cbd5e130', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                 <div style={{ width: '28px', height: '20px', borderRadius: '4px', backgroundColor: '#ffd700', opacity: 0.8 }} />
                               </div>
                               {cardForm.number.startsWith('4') ? (
                                 <span style={{ fontStyle: 'italic', fontWeight: 900, fontSize: '1.2rem', color: '#93c5fd' }}>VISA</span>
                               ) : cardForm.number.startsWith('5') ? (
                                 <span style={{ fontStyle: 'italic', fontWeight: 900, fontSize: '1.2rem', color: '#fca5a5' }}>MC</span>
                               ) : (
                                 <PaymentIcon size={24} color="#94a3b8" />
                               )}
                             </div>
                             
                             <div style={{ fontSize: '1.1rem', letterSpacing: '2.5px', color: '#f8fafc', fontWeight: 700 }}>
                               {cardForm.number || '•••• •••• •••• ••••'}
                             </div>

                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.75rem', color: '#cbd5e1' }}>
                               <div>
                                 <div style={{ fontSize: '0.55rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '2px' }}>Cardholder</div>
                                 <div style={{ fontWeight: 600, fontFamily: 'sans-serif' }}>{cardForm.name || 'ROBERT WILSON'}</div>
                               </div>
                               <div style={{ textAlign: 'right' }}>
                                 <div style={{ fontSize: '0.55rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '2px' }}>Expires</div>
                                 <div style={{ fontWeight: 600 }}>{cardForm.expiry || 'MM/YY'}</div>
                               </div>
                             </div>
                           </div>

                           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                             <input 
                               type="text" 
                               placeholder="Cardholder Name" 
                               value={cardForm.name} 
                               onChange={e => setCardForm(prev => ({ ...prev, name: e.target.value }))}
                               style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 700, fontSize: '0.85rem', outline: 'none' }}
                             />
                             <input 
                               type="text" 
                               placeholder="Card Number" 
                               maxLength={19}
                               value={cardForm.number} 
                               onChange={e => {
                                 const raw = e.target.value.replace(/\s?/g, '').replace(/\D/g, '');
                                 const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
                                 setCardForm(prev => ({ ...prev, number: formatted }));
                               }}
                               style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 900, fontSize: '0.85rem', outline: 'none' }}
                             />
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                               <input 
                                 type="text" 
                                 placeholder="Expiry (MM/YY)" 
                                 maxLength={5}
                                 value={cardForm.expiry} 
                                 onChange={e => {
                                   let val = e.target.value.replace(/\D/g, '');
                                   if (val.length > 2) {
                                     val = val.slice(0, 2) + '/' + val.slice(2, 4);
                                   }
                                   setCardForm(prev => ({ ...prev, expiry: val }));
                                 }}
                                 style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 800, fontSize: '0.85rem', outline: 'none' }}
                               />
                               <input 
                                 type="password" 
                                 placeholder="CVV" 
                                 maxLength={3}
                                 value={cardForm.cvv} 
                                 onChange={e => setCardForm(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                                 style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 800, fontSize: '0.85rem', outline: 'none' }}
                               />
                             </div>
                           </div>
                         </div>
                       ) : (
                         <div style={{ padding: '24px', borderRadius: '16px', border: '1px dashed var(--primary)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', textAlign: 'center' }}>
                           <Landmark size={36} style={{ marginBottom: '12px' }} />
                           <h5 style={{ fontWeight: 900, margin: '0 0 6px 0' }}>SECURE-PAY Instant Bank Transfer</h5>
                           <p style={{ margin: 0, fontSize: '0.75rem', lineHeight: 1.5, fontWeight: 600 }}>Login and transfer securely via institutional online banking. High-volume transfers are instantly authorized without card transaction ceilings.</p>
                         </div>
                       )}
                     </div>

                     <button 
                       onClick={handleProcessPayment} 
                       disabled={invoicesList.filter(inv => selectedInvoices[inv.id]).length === 0}
                       style={{
                         width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
                         backgroundColor: invoicesList.filter(inv => selectedInvoices[inv.id]).length === 0 ? 'var(--border-color)' : 'var(--primary)',
                         color: 'white', fontWeight: 900, fontSize: '0.9rem', cursor: invoicesList.filter(inv => selectedInvoices[inv.id]).length === 0 ? 'not-allowed' : 'pointer',
                         display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 6px 20px rgba(72,128,255,0.25)', marginTop: '24px'
                       }}
                     >
                       <Lock size={15} /> PAY SECURELY NOW
                     </button>
                   </div>
                 </div>
               )}

               {paymentStep === 'processing' && (
                 <div style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', textAlign: 'center', backgroundColor: '#0f172a', color: 'white' }}>
                   <div style={{ relative: 'relative', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid rgba(255,255,255,0.05)', borderTopColor: '#38bdf8', animation: 'spin 1s linear infinite' }} />
                     <Lock size={28} color="#38bdf8" />
                   </div>
                   
                   <div>
                     <h3 style={{ fontSize: '1.25rem', fontWeight: 950, margin: '0 0 8px 0', color: '#38bdf8' }}>Secure Encrypted Gateway</h3>
                     <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>Processing dynamic validation and ledger handshake...</p>
                   </div>

                   <div style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', backgroundColor: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                     {[
                       'Establishing secure gateway connection...',
                       'Authenticating bank credentials (TLS 1.3)...',
                       'Synchronizing institutional transaction ledger...'
                     ].map((stepMsg, idx) => (
                       <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: paymentStepIndex >= idx ? '#38bdf8' : 'rgba(255,255,255,0.25)', fontWeight: paymentStepIndex >= idx ? 700 : 500 }}>
                         <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: paymentStepIndex > idx ? '#10B981' : paymentStepIndex === idx ? '#38bdf8' : 'rgba(255,255,255,0.1)' }} />
                         <span>{stepMsg}</span>
                         {paymentStepIndex > idx && <span style={{ marginLeft: 'auto', color: '#10B981', fontWeight: 800 }}>✓ OK</span>}
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {paymentStep === 'success' && paymentReceipt && (
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr', padding: '40px', maxHeight: '580px', overflowY: 'auto' }}>
                   <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                     <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#10B98115', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                       <CheckCircle2 size={36} strokeWidth={2.5} />
                     </div>
                     <h3 style={{ fontSize: '1.3rem', fontWeight: 950, margin: '0 0 6px 0', color: '#10B981' }}>Payment Processed Successfully</h3>
                     <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Ledger records successfully synchronized. Receipt generated.</p>
                   </div>

                   {/* Receipt Block */}
                   <div style={{
                     padding: '24px', borderRadius: '20px', border: '1px dashed var(--border-color)',
                     backgroundColor: 'var(--bg-body)', margin: '0 0 28px 0', fontFamily: 'monospace', fontSize: '0.82rem'
                   }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '12px', marginBottom: '12px' }}>
                       <span style={{ fontWeight: 800 }}>TRANSACTION ID</span>
                       <span style={{ fontWeight: 950, color: 'var(--primary)' }}>{paymentReceipt.txId}</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '12px', marginBottom: '12px' }}>
                       <span style={{ fontWeight: 800 }}>TIMESTAMP</span>
                       <span>{paymentReceipt.date}</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '12px', marginBottom: '12px' }}>
                       <span style={{ fontWeight: 800 }}>PAYMENT METHOD</span>
                       <span>{paymentReceipt.method}</span>
                     </div>
                     
                     <div style={{ margin: '16px 0 12px 0', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Settled Items:</div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px dashed var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
                       {paymentReceipt.items.map(item => (
                         <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                           <span>{item.id} ({item.type})</span>
                           <span style={{ fontWeight: 900 }}>${item.amount.toLocaleString()}</span>
                         </div>
                       ))}
                     </div>
                     
                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 950 }}>
                       <span>TOTAL SETTLEMENT</span>
                       <span style={{ color: 'var(--primary)' }}>${paymentReceipt.total.toLocaleString()}</span>
                     </div>
                   </div>

                   <div style={{ display: 'flex', gap: '12px' }}>
                     <button 
                       onClick={() => {
                         const printWindow = window.open('', '_blank', 'width=700,height=600');
                         if (!printWindow) {
                           showToast("Popup blocker is active. Please enable popups to print receipt.", "error");
                           return;
                         }
                         printWindow.document.write(`
                           <html>
                           <head>
                             <title>Receipt — ${paymentReceipt.txId}</title>
                             <style>
                               body { font-family: monospace; padding: 40px; color: #1e293b; background: #fff; }
                               .receipt { max-width: 500px; margin: 0 auto; border: 1px dashed #cbd5e1; padding: 24px; border-radius: 8px; }
                               .title { text-align: center; margin-bottom: 24px; }
                               .title h2 { margin: 0; font-size: 1.4rem; font-weight: 900; }
                               .title p { margin: 4px 0 0; font-size: 0.8rem; color: #64748b; }
                               .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dotted #e2e8f0; font-size: 0.9rem; }
                               .total { display: flex; justify-content: space-between; font-weight: 900; font-size: 1.1rem; padding: 14px 0; border-top: 2px solid #0f172a; margin-top: 16px; }
                             </style>
                           </head>
                           <body>
                             <div class="receipt">
                               <div class="title">
                                 <h2>EDUPRO ACADEMY</h2>
                                 <p>Official Billing Settlement Receipt</p>
                               </div>
                               <div class="row"><span>Transaction ID:</span><strong>${paymentReceipt.txId}</strong></div>
                               <div class="row"><span>Date/Time:</span><span>${paymentReceipt.date}</span></div>
                               <div class="row"><span>Payment Method:</span><span>${paymentReceipt.method}</span></div>
                               <div style="margin: 20px 0 10px; font-weight: bold; font-size: 0.85rem; color: #64748b;">Paid Items:</div>
                               ${paymentReceipt.items.map(item => `
                                 <div class="row"><span>${item.id} (${item.type})</span><span>$${item.amount.toLocaleString()}</span></div>
                               `).join('')}
                               <div class="total"><span>TOTAL CHARGE:</span><span>$${paymentReceipt.total.toLocaleString()}</span></div>
                               <div style="text-align: center; margin-top: 28px; font-size: 0.75rem; color: #94a3b8;">Thank you for your secure educational settlement.</div>
                             </div>
                             <script>window.onload = function() { window.print(); }</script>
                           </body>
                           </html>
                         `);
                         printWindow.document.close();
                       }}
                       className="btn" 
                       style={{ flex: 1, padding: '12px', borderRadius: '12px', fontWeight: 800, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                     >
                       <Printer size={15} /> Print Receipt
                     </button>
                     <button 
                       onClick={() => {
                         // Download receipt file
                         const content = [
                           '================================================',
                           '            EDUPRO ACADEMY RECEIPT',
                           '================================================',
                           `Transaction ID: ${paymentReceipt.txId}`,
                           `Date / Time:    ${paymentReceipt.date}`,
                           `Payment Method: ${paymentReceipt.method}`,
                           '------------------------------------------------',
                           'Settled Items:',
                           ...paymentReceipt.items.map(item => 
                             ` - ${item.id}: ${item.type} ($${item.amount.toLocaleString()})`
                           ),
                           '------------------------------------------------',
                           `TOTAL SETTLED:  $${paymentReceipt.total.toLocaleString()}`,
                           '================================================',
                           'Thank you for your secure transaction.',
                           '================================================'
                         ].join('\n');
                         const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                         const url = URL.createObjectURL(blob);
                         const link = document.createElement('a');
                         link.href = url;
                         link.download = `Receipt_${paymentReceipt.txId}.txt`;
                         document.body.appendChild(link);
                         link.click();
                         document.body.removeChild(link);
                         URL.revokeObjectURL(url);
                       }}
                       className="btn" 
                       style={{ flex: 1, padding: '12px', borderRadius: '12px', fontWeight: 800, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                     >
                       <Download size={15} /> Download Copy
                     </button>
                     <button 
                       onClick={() => { setActiveModal(null); setPaymentStep(null); }}
                       className="btn btn-primary" 
                       style={{ flex: 1, padding: '12px', borderRadius: '12px', fontWeight: 800, justifyContent: 'center' }}
                     >
                       Done
                     </button>
                   </div>
                 </div>
               )}
             </motion.div>
           </div>
         )}

         {/* ── Details Modal ── */}
         {activeModal === 'details' && (
           <div style={{
             position: 'fixed', inset: 0, zIndex: 9999,
             display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
           }}>
             <motion.div
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setActiveModal(null)}
               style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(10px)' }}
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.92, y: 24 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.92, y: 24 }}
               transition={{ type: 'spring', damping: 26, stiffness: 340 }}
               style={{
                 position: 'relative', width: '100%', maxWidth: '520px',
                 backgroundColor: 'var(--bg-card)', borderRadius: '24px',
                 border: '1px solid var(--border-color)',
                 boxShadow: '0 25px 60px -12px rgba(0,0,0,0.35)',
                 overflow: 'hidden'
               }}
             >
               <div style={{ height: '4px', background: 'linear-gradient(90deg, #4880FF, #10B981)' }} />
               <div style={{ padding: '32px' }}>
                 <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: '1px solid var(--border-color)', borderRadius: '10px', cursor: 'pointer', padding: '6px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center' }}><X size={16} /></button>
                 
                 <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 6px 0' }}>Outstanding Balance Itemization</h3>
                 <p style={{ margin: '0 0 24px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Detailed itemized breakdown of academic tuition & transport liabilities.</p>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                   {invoicesList.filter(inv => inv.status !== 'Paid').map(inv => (
                     <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                       <div>
                         <div style={{ fontWeight: 900, fontSize: '0.9rem' }}>{inv.type}</div>
                         <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>Invoice: {inv.id} &nbsp;·&nbsp; Due: {inv.dueDate}</div>
                       </div>
                       <div style={{ textAlign: 'right' }}>
                         <div style={{ fontWeight: 950, fontSize: '1rem', color: inv.status === 'Overdue' ? '#EF4444' : 'inherit' }}>${inv.amount.toLocaleString()}</div>
                         <span style={{ fontSize: '0.65rem', fontWeight: 900, color: inv.status === 'Overdue' ? '#EF4444' : '#F59E0B', padding: '2px 6px', borderRadius: '6px', backgroundColor: inv.status === 'Overdue' ? '#EF444410' : '#F59E0B10', marginTop: '4px', display: 'inline-block' }}>{inv.status.toUpperCase()}</span>
                       </div>
                     </div>
                   ))}
                 </div>

                 <div style={{ display: 'flex', gap: '12px' }}>
                   <button onClick={() => setActiveModal(null)} className="btn" style={{ flex: 1, padding: '12px', borderRadius: '12px', fontWeight: 800, border: '1px solid var(--border-color)' }}>Close</button>
                   <button 
                     onClick={() => {
                       setActiveModal('pay');
                     }} 
                     className="btn btn-primary" 
                     style={{ flex: 1, padding: '12px', borderRadius: '12px', fontWeight: 800, justifyContent: 'center' }}
                   >
                     Pay Outstanding Dues
                   </button>
                 </div>
               </div>
             </motion.div>
           </div>
         )}

         {/* ── Full Audit Widescreen Modal ── */}
         {activeModal === 'audit' && (() => {
           // Search and Filter computation inside the IIFE modal scope
           const filteredAuditInvoices = invoicesList.filter(inv => {
             // Search Filter
             const q = auditSearch.toLowerCase().trim();
             const matchesSearch = !q || (
               inv.id.toLowerCase().includes(q) ||
               inv.type.toLowerCase().includes(q) ||
               inv.month.toLowerCase().includes(q) ||
               inv.status.toLowerCase().includes(q)
             );

             // Status Filter
             const matchesStatus = auditFilterStatus === 'All' || inv.status === auditFilterStatus;

             // Type Filter
             const matchesType = auditFilterType === 'All' || inv.type === auditFilterType;

             return matchesSearch && matchesStatus && matchesType;
           });

           // Stats
           const totalBilled = invoicesList.reduce((sum, inv) => sum + inv.amount, 0);
           const totalCollected = invoicesList.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
           const collectionRate = totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) : '0.0';

           return (
             <div style={{
               position: 'fixed', inset: 0, zIndex: 9999,
               display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
             }}>
               <motion.div
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 onClick={() => setActiveModal(null)}
                 style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(10px)' }}
               />
               <motion.div
                 initial={{ opacity: 0, scale: 0.95, y: 24 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95, y: 24 }}
                 transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                 style={{
                   position: 'relative', width: '100%', maxWidth: '1000px',
                   backgroundColor: 'var(--bg-card)', borderRadius: '32px',
                   border: '1px solid var(--border-color)',
                   boxShadow: '0 25px 60px -12px rgba(0,0,0,0.35)',
                   overflow: 'hidden', display: 'flex', flexDirection: 'column'
                 }}
               >
                 <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--primary), #10B981, var(--secondary))' }} />
                 <div style={{ padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
                   <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: '1px solid var(--border-color)', borderRadius: '10px', cursor: 'pointer', padding: '6px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center' }}><X size={16} /></button>
                   
                   <h3 style={{ fontSize: '1.4rem', fontWeight: 950, margin: '0 0 6px 0' }}>Widescreen Ledger Audit</h3>
                   <p style={{ margin: '0 0 28px 0', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Detailed institutional accounting verification, audit filtering, and collection metrics.</p>

                   {/* Audit Statistics Cards */}
                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
                     <div style={{ padding: '16px 20px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                       <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Collection Rate</div>
                       <div style={{ fontSize: '1.4rem', fontWeight: 950, color: '#10B981', marginTop: '2px' }}>{collectionRate}%</div>
                     </div>
                     <div style={{ padding: '16px 20px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                       <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Billed</div>
                       <div style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--text-main)', marginTop: '2px' }}>${totalBilled.toLocaleString()}</div>
                     </div>
                     <div style={{ padding: '16px 20px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                       <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Collected</div>
                       <div style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--primary)', marginTop: '2px' }}>${totalCollected.toLocaleString()}</div>
                     </div>
                     <div style={{ padding: '16px 20px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                       <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Outstanding Balance</div>
                       <div style={{ fontSize: '1.4rem', fontWeight: 950, color: '#EF4444', marginTop: '2px' }}>${outstandingBalance.toLocaleString()}</div>
                     </div>
                   </div>

                   {/* Audit Filter Toolbar */}
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                     <div style={{ position: 'relative', flex: 1 }}>
                       <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                       <input 
                         type="text" 
                         placeholder="Search ledger by invoice, type, or month..." 
                         value={auditSearch}
                         onChange={e => setAuditSearch(e.target.value)}
                         style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontSize: '0.85rem', fontWeight: 600, outline: 'none' }}
                       />
                     </div>
                     
                     <div style={{ display: 'flex', gap: '12px' }}>
                       <div>
                         <select 
                           value={auditFilterStatus} 
                           onChange={e => setAuditFilterStatus(e.target.value)}
                           style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontSize: '0.82rem', fontWeight: 700, outline: 'none' }}
                         >
                           <option value="All">All Statuses</option>
                           <option value="Paid">Paid</option>
                           <option value="Pending">Pending</option>
                           <option value="Overdue">Overdue</option>
                         </select>
                       </div>
                       
                       <div>
                         <select 
                           value={auditFilterType} 
                           onChange={e => setAuditFilterType(e.target.value)}
                           style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontSize: '0.82rem', fontWeight: 700, outline: 'none' }}
                         >
                           <option value="All">All Types</option>
                           <option value="Tuition Fee">Tuition Fee</option>
                           <option value="Full Semester">Full Semester</option>
                           <option value="Transport">Transport</option>
                           <option value="Library Fine/Misc">Library Fine/Misc</option>
                         </select>
                       </div>

                       <button 
                         onClick={() => {
                           const csvContent = [
                             'Invoice ID,Billing Month,Description,Ledger Status,Amount,Due Date',
                             ...filteredAuditInvoices.map(inv => `${inv.id},"${inv.month}","${inv.type}",${inv.status},${inv.amount},"${inv.dueDate}"`)
                           ].join('\n');
                           const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
                           const url = URL.createObjectURL(blob);
                           const link = document.createElement('a');
                           link.href = url;
                           link.download = `Filtered_Audit_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
                           document.body.appendChild(link);
                           link.click();
                           document.body.removeChild(link);
                           URL.revokeObjectURL(url);
                         }}
                         className="btn" 
                         style={{ fontSize: '0.82rem', fontWeight: 800, backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', gap: '6px' }}
                       >
                         <Download size={14} /> Export CSV
                       </button>
                       
                       <button 
                         onClick={() => {
                           const printWindow = window.open('', '_blank', 'width=900,height=700');
                           if (!printWindow) {
                             showToast("Popup blocker is active. Please enable popups to print statement.", "error");
                             return;
                           }
                           const rows = filteredAuditInvoices.map(inv => `
                             <tr style="border-bottom:1px solid #e2e8f0;">
                               <td style="padding:12px;">${inv.id}</td>
                               <td style="padding:12px;">${inv.month}</td>
                               <td style="padding:12px;">${inv.type}</td>
                               <td style="padding:12px;">${inv.status}</td>
                               <td style="padding:12px;">$${inv.amount.toLocaleString()}</td>
                               <td style="padding:12px;">${inv.dueDate}</td>
                             </tr>
                           `).join('');
                           printWindow.document.write(`
                             <html>
                             <head>
                               <title>Ledger Audit Report</title>
                               <style>
                                 body { font-family: sans-serif; padding: 40px; }
                                 table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                 th { border-bottom: 2px solid #0f172a; padding: 12px; text-align: left; font-size: 0.8rem; text-transform: uppercase; color: #64748b; }
                               </style>
                             </head>
                             <body>
                               <h2>Institutional Ledger Audit Report</h2>
                               <p>Filtered List &nbsp;·&nbsp; Total Items: ${filteredAuditInvoices.length}</p>
                               <table>
                                 <thead>
                                   <tr><th>Invoice</th><th>Month</th><th>Type</th><th>Status</th><th>Amount</th><th>Due Date</th></tr>
                                 </thead>
                                 <tbody>${rows}</tbody>
                               </table>
                               <script>window.onload = function() { window.print(); }</script>
                             </body>
                             </html>
                           `);
                           printWindow.document.close();
                         }}
                         className="btn" 
                         style={{ fontSize: '0.82rem', fontWeight: 800, backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', gap: '6px' }}
                       >
                         <Printer size={14} /> Print
                       </button>
                     </div>
                   </div>

                   {/* Audit Table */}
                   <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)' }}>
                     <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                       <thead style={{ backgroundColor: 'var(--bg-card)' }}>
                         <tr style={{ textAlign: 'left' }}>
                           <th style={{ padding: '12px 20px', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 950, textTransform: 'uppercase' }}>Invoice</th>
                           <th style={{ padding: '12px 20px', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 950, textTransform: 'uppercase' }}>Billing Month</th>
                           <th style={{ padding: '12px 20px', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 950, textTransform: 'uppercase' }}>Description</th>
                           <th style={{ padding: '12px 20px', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 950, textTransform: 'uppercase' }}>Ledger Status</th>
                           <th style={{ padding: '12px 20px', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 950, textTransform: 'uppercase' }}>Amount</th>
                           <th style={{ padding: '12px 20px', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 950, textTransform: 'uppercase', textAlign: 'right' }}>Due Date</th>
                         </tr>
                       </thead>
                       <tbody>
                         {filteredAuditInvoices.length > 0 ? (
                           filteredAuditInvoices.map((inv, i) => (
                             <tr key={i} style={{ borderBottom: i === filteredAuditInvoices.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                               <td style={{ padding: '14px 20px', fontSize: '0.85rem', fontWeight: 900, color: 'var(--primary)' }}>{inv.id}</td>
                               <td style={{ padding: '14px 20px', fontSize: '0.85rem', fontWeight: 700 }}>{inv.month}</td>
                               <td style={{ padding: '14px 20px', fontSize: '0.85rem', fontWeight: 800 }}>{inv.type}</td>
                               <td style={{ padding: '14px 20px' }}>
                                 <span style={{ fontSize: '0.7rem', fontWeight: 950, color: inv.status === 'Paid' ? '#10B981' : inv.status === 'Overdue' ? '#EF4444' : '#F59E0B', padding: '4px 10px', borderRadius: '12px', backgroundColor: inv.status === 'Paid' ? '#10B98110' : inv.status === 'Overdue' ? '#EF444410' : '#F59E0B10' }}>
                                   {inv.status.toUpperCase()}
                                 </span>
                               </td>
                               <td style={{ padding: '14px 20px', fontWeight: 950, fontSize: '0.92rem' }}>${inv.amount.toLocaleString()}</td>
                               <td style={{ padding: '14px 20px', textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{inv.dueDate}</td>
                             </tr>
                           ))
                         ) : (
                           <tr>
                             <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                               No ledger records match the current filter and search conditions.
                             </td>
                           </tr>
                         )}
                       </tbody>
                     </table>
                   </div>
                 </div>
               </motion.div>
             </div>
           );
         })()}
       </AnimatePresence>

       {/* ── Save Profile Success Toast ── */}
       <AnimatePresence>
         {saveProfileToast && (
           <motion.div
             initial={{ opacity: 0, y: 60, scale: 0.95 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, y: 20, scale: 0.95 }}
             style={{
               position: 'fixed', bottom: '36px', right: '36px', zIndex: 9999,
               background: 'linear-gradient(135deg, var(--primary), #8B5CF6)',
               color: 'white', padding: '16px 24px', borderRadius: '20px',
               display: 'flex', alignItems: 'center', gap: '12px',
               boxShadow: '0 12px 30px -6px rgba(139,92,246,0.55)', fontWeight: 700,
               fontSize: '0.95rem'
             }}
           >
             <CheckCircle2 size={20} />
             <span>Guardian profile updated successfully!</span>
           </motion.div>
         )}
       </AnimatePresence>

       {/* ── Edit Profile Drawer ── */}
       <AnimatePresence>
         {editProfileOpen && (
           <div style={{ position: 'fixed', inset: 0, zIndex: 9998, display: 'flex', justifyContent: 'flex-end' }}>
             {/* Backdrop */}
             <motion.div
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => !isSavingProfile && setEditProfileOpen(false)}
               style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(8px)' }}
             />
             {/* Drawer */}
             <motion.div
               initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 28, stiffness: 220 }}
               style={{
                 position: 'relative', width: '520px', height: '100%',
                 backgroundColor: 'var(--bg-card)',
                 boxShadow: '-20px 0 60px rgba(0,0,0,0.25)',
                 display: 'flex', flexDirection: 'column', overflow: 'hidden'
               }}
             >
               {/* Top accent */}
               <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--primary), #8B5CF6)' }} />

               {/* Drawer Header */}
               <div style={{ padding: '28px 32px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                   <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>Edit Guardian Profile</h3>
                   <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Update profile information for <strong style={{ color: 'var(--text-main)' }}>{guardian.name}</strong></p>
                 </div>
                 <button
                   onClick={() => !isSavingProfile && setEditProfileOpen(false)}
                   style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '10px', cursor: 'pointer', padding: '8px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center' }}
                 >
                   <X size={16} />
                 </button>
               </div>

               {/* Scrollable Form */}
               <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                 {/* Section: Identity */}
                 <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                   <User size={13} /> Identity
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                   <div>
                     <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Full Name *</label>
                     <input
                       value={editForm.name}
                       onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                       placeholder="e.g. Rajesh Verma"
                       style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 700, outline: 'none', color: 'var(--text-main)', fontSize: '0.9rem' }}
                     />
                   </div>
                   <div>
                     <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Relation</label>
                     <select
                       value={editForm.relation}
                       onChange={e => setEditForm(p => ({ ...p, relation: e.target.value }))}
                       style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 700, outline: 'none', color: 'var(--text-main)' }}
                     >
                       {['Father', 'Mother', 'Guardian', 'Grandparent', 'Uncle', 'Aunt', 'Sibling', 'Other'].map(r => (
                         <option key={r} value={r}>{r}</option>
                       ))}
                     </select>
                   </div>
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                   <div>
                     <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Gender</label>
                     <select
                       value={editForm.gender}
                       onChange={e => setEditForm(p => ({ ...p, gender: e.target.value }))}
                       style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 700, outline: 'none', color: 'var(--text-main)' }}
                     >
                       {['Male', 'Female', 'Other', 'Prefer not to say'].map(g => (
                         <option key={g} value={g}>{g}</option>
                       ))}
                     </select>
                   </div>
                   <div>
                     <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Date of Birth</label>
                     <input
                       value={editForm.dob}
                       onChange={e => setEditForm(p => ({ ...p, dob: e.target.value }))}
                       placeholder="e.g. 15 Mar 1980"
                       style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 700, outline: 'none', color: 'var(--text-main)', fontSize: '0.9rem' }}
                     />
                   </div>
                 </div>

                 {/* Section: Contact */}
                 <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                   <Phone size={13} /> Contact Information
                 </div>

                 <div>
                   <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Email Address *</label>
                   <input
                     type="email"
                     value={editForm.email}
                     onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                     placeholder="guardian@example.com"
                     style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 700, outline: 'none', color: 'var(--text-main)', fontSize: '0.9rem' }}
                   />
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                   <div>
                     <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Phone *</label>
                     <input
                       value={editForm.phone}
                       onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))}
                       placeholder="+1 234 567 8901"
                       style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 700, outline: 'none', color: 'var(--text-main)', fontSize: '0.9rem' }}
                     />
                   </div>
                   <div>
                     <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Emergency Contact</label>
                     <input
                       value={editForm.emergencyContact}
                       onChange={e => setEditForm(p => ({ ...p, emergencyContact: e.target.value }))}
                       placeholder="+1 234 567 8999"
                       style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 700, outline: 'none', color: 'var(--text-main)', fontSize: '0.9rem' }}
                     />
                   </div>
                 </div>

                 <div>
                   <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Home Address</label>
                   <input
                     value={editForm.address}
                     onChange={e => setEditForm(p => ({ ...p, address: e.target.value }))}
                     placeholder="123 Oak Lane, City, State"
                     style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 700, outline: 'none', color: 'var(--text-main)', fontSize: '0.9rem' }}
                   />
                 </div>

                 {/* Section: Professional */}
                 <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                   <Briefcase size={13} /> Professional
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                   <div>
                     <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Occupation</label>
                     <input
                       value={editForm.occupation}
                       onChange={e => setEditForm(p => ({ ...p, occupation: e.target.value }))}
                       placeholder="e.g. Senior Engineer"
                       style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 700, outline: 'none', color: 'var(--text-main)', fontSize: '0.9rem' }}
                     />
                   </div>
                   <div>
                     <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Organization</label>
                     <input
                       value={editForm.company}
                       onChange={e => setEditForm(p => ({ ...p, company: e.target.value }))}
                       placeholder="e.g. TechCorp Solutions"
                       style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 700, outline: 'none', color: 'var(--text-main)', fontSize: '0.9rem' }}
                     />
                   </div>
                 </div>

                 {/* Section: Account */}
                 <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                   <Shield size={13} /> Account Settings
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                   <div>
                     <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Status</label>
                     <select
                       value={editForm.status}
                       onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}
                       style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 700, outline: 'none', color: 'var(--text-main)' }}
                     >
                       {['Active', 'Suspended', 'Pending'].map(s => (
                         <option key={s} value={s}>{s}</option>
                       ))}
                     </select>
                   </div>
                   <div>
                     <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Account Type</label>
                     <select
                       value={editForm.accountType}
                       onChange={e => setEditForm(p => ({ ...p, accountType: e.target.value }))}
                       style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 700, outline: 'none', color: 'var(--text-main)' }}
                     >
                       {['Premium Parent Portal', 'Standard Parent Portal', 'Guardian Access', 'Read-Only Access'].map(t => (
                         <option key={t} value={t}>{t}</option>
                       ))}
                     </select>
                   </div>
                 </div>
               </div>

               {/* Footer Actions */}
               <div style={{ padding: '20px 32px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px', backgroundColor: 'var(--bg-body)' }}>
                 <button
                   onClick={() => !isSavingProfile && setEditProfileOpen(false)}
                   disabled={isSavingProfile}
                   className="btn"
                   style={{ flex: 1, padding: '14px', borderRadius: '14px', fontWeight: 800, border: '1px solid var(--border-color)', opacity: isSavingProfile ? 0.5 : 1 }}
                 >
                   Cancel
                 </button>
                 <motion.button
                   onClick={handleSaveProfile}
                   disabled={isSavingProfile}
                   whileHover={!isSavingProfile ? { scale: 1.03, boxShadow: '0 10px 20px -6px rgba(139,92,246,0.5)' } : {}}
                   whileTap={!isSavingProfile ? { scale: 0.97 } : {}}
                   style={{
                     flex: 2, padding: '14px', borderRadius: '14px', border: 'none', fontWeight: 900,
                     background: 'linear-gradient(135deg, var(--primary) 0%, #8B5CF6 100%)',
                     color: 'white', cursor: isSavingProfile ? 'not-allowed' : 'pointer',
                     display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                     opacity: isSavingProfile ? 0.85 : 1,
                     boxShadow: '0 6px 16px -4px rgba(139,92,246,0.35)'
                   }}
                 >
                   {isSavingProfile ? (
                     <>
                       <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.35)', borderTopColor: 'white', animation: 'spin 0.8s linear infinite' }} />
                       Saving Changes...
                     </>
                   ) : (
                     <><CheckCircle2 size={16} /> Save Changes</>
                   )}
                 </motion.button>
               </div>
             </motion.div>
           </div>
         )}
       </AnimatePresence>

      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => navigate(-1)} className="btn-icon" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
               <ArrowLeft size={18} />
            </button>
            <div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  <Home size={12} /> Dashboard / Guardians / <span style={{ color: 'var(--primary)' }}>Details</span>
               </div>
               <h2 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0 }}>Guardian Records</h2>
            </div>
         </div>
         <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn"
              onClick={handlePrint}
              disabled={isPrinting}
              style={{
                backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '8px',
                opacity: isPrinting ? 0.7 : 1, cursor: isPrinting ? 'not-allowed' : 'pointer'
              }}
            >
              {isPrinting ? (
                <>
                  <div style={{ width: '15px', height: '15px', border: '2px solid #cbd5e1', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Preparing...
                </>
              ) : (
                <><Printer size={18} /> Print Record</>
              )}
            </button>
            <motion.button
              whileHover={{ scale: 1.04, translateY: -2, boxShadow: '0 12px 24px -6px rgba(139,92,246,0.45)' }}
              whileTap={{ scale: 0.96 }}
              onClick={openEditProfile}
              style={{
                padding: '12px 24px', borderRadius: '14px', border: 'none', fontWeight: 800,
                background: 'linear-gradient(135deg, var(--primary) 0%, #8B5CF6 100%)',
                color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 6px 16px -4px rgba(139,92,246,0.35)'
              }}
            >
              <Edit size={16} /> Edit Profile
            </motion.button>
         </div>
      </div>

      {/* 2-Column Split Administrative Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '32px', alignItems: 'start' }}>
         {/* Left Column - Guardian Identity & Overwatch Console */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Professional Slate Identity Badge */}
            <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '24px', background: 'var(--bg-card)', position: 'relative' }}>
               {/* Premium Slate Banner */}
               <div style={{ height: '110px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '16px', right: '16px', padding: '4px 10px', borderRadius: '20px', backgroundColor: '#10B98115', border: '1px solid #10B98130', color: '#10B981', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase' }}>
                     {guardian.status}
                  </div>
               </div>
               
               {/* Guardian Main Info */}
               <div style={{ padding: '0 24px 24px', marginTop: '-48px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ position: 'relative', marginBottom: '16px' }}>
                     <img src={guardian.img} alt={guardian.name} style={{ width: '96px', height: '96px', borderRadius: '24px', border: '4px solid var(--bg-card)', boxShadow: 'var(--shadow-lg)', objectFit: 'cover' }} />
                     <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary)', border: '3px solid var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BadgeCheck size={14} color="white" />
                     </div>
                  </div>
                  
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px 0' }}>{guardian.name}</h3>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                     <Users size={12} /> {guardian.relation} Portal
                  </div>

                  {/* Micro-Contact Details */}
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'left', marginBottom: '24px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <Mail size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
                        <span style={{ fontWeight: 600 }}>{guardian.email}</span>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Phone size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
                        <span style={{ fontWeight: 600 }}>{guardian.phone}</span>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <MapPin size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
                        <span style={{ fontWeight: 600, whiteSpace: 'normal', lineHeight: '1.3' }}>{guardian.address}</span>
                     </div>
                  </div>

                  {/* Personal Data Section */}
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', marginBottom: '24px' }}>
                     <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>PERSONAL DATA</div>
                     {[
                        { label: 'Guardian ID', val: guardian.id },
                        { label: 'Date of Birth', val: guardian.dob },
                        { label: 'Gender', val: guardian.gender },
                        { label: 'Joined Date', val: guardian.joiningDate },
                        { label: 'Account Type', val: guardian.accountType }
                     ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                           <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{item.label}</span>
                           <span style={{ fontWeight: 800 }}>{item.val}</span>
                        </div>
                     ))}
                  </div>

                  {/* Professional & Employment details */}
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                     <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>PROFESSIONAL & EMPLOYMENT</div>
                     {[
                        { label: 'Occupation', val: guardian.occupation },
                        { label: 'Organization', val: guardian.company },
                        { label: 'Work Address', val: 'Corporate Hub, Level 12' },
                        { label: 'Office Phone', val: '+1 234 567 8955' }
                     ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                           <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{item.label}</span>
                           <span style={{ fontWeight: 800 }}>{item.val}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Family Overwatch Card */}
            <div className="card" style={{ padding: '24px', border: '1px solid var(--border-color)', borderRadius: '24px', background: 'var(--bg-card)' }}>
               <h3 style={{ fontSize: '1rem', fontWeight: 950, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                  <Users size={18} color="var(--primary)" /> Family Overwatch
               </h3>
               <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '-8px', marginBottom: '20px', lineHeight: '1.4' }}>
                  Real-time status tracking and direct academic synchronization for linked students.
               </p>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {guardian.linkedStudents.map((stu, i) => (
                     <div key={i} style={{ padding: '16px', borderRadius: '18px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.75rem' }}>
                                 {stu.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                 <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{stu.name}</div>
                                 <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>ID: {stu.id}</div>
                              </div>
                           </div>
                           <span style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-card)', fontSize: '0.65rem', fontWeight: 900, color: 'var(--primary)', border: '1px solid var(--border-color)' }}>
                              {stu.grade}
                           </span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                           <div>
                              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800 }}>ATTENDANCE</div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 950, color: '#10B981' }}>{stu.attendance}</div>
                           </div>
                           <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800 }}>PERFORMANCE</div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 950, color: 'var(--primary)' }}>{stu.perf}</div>
                           </div>
                        </div>
                        
                        <button 
                           onClick={() => navigate("/dashboard/student-details/" + stu.id)} 
                           className="btn" 
                           style={{ 
                              width: '100%', padding: '8px', borderRadius: '10px', backgroundColor: 'var(--bg-card)', 
                              color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', border: '1px solid var(--border-color)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' 
                           }}
                        >
                           Open Profile <ArrowRight size={12} />
                        </button>
                     </div>
                  ))}
               </div>
            </div>

            {/* Security Tools Card */}
            <div className="card" style={{ padding: '24px', border: '1px solid var(--border-color)', borderRadius: '24px', background: 'var(--bg-card)' }}>
               <h3 style={{ fontSize: '1rem', fontWeight: 950, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={18} color="var(--primary)" /> Portal Security
               </h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                     <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>2FA Authorization</span>
                     <span style={{ fontWeight: 900, color: '#10B981' }}>ENABLED</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                     <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Web Access Mode</span>
                     <span style={{ fontWeight: 900, color: '#10B981' }}>ALLOWED</span>
                  </div>
                  <button
                     className="btn"
                     onClick={() => setResetPwdStep('confirm')}
                     style={{
                        width: '100%', marginTop: '8px',
                        backgroundColor: 'var(--bg-body)', color: 'var(--danger)',
                        border: '1px solid #EF444430', fontWeight: 800, fontSize: '0.78rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        cursor: 'pointer', borderRadius: '10px', padding: '10px'
                     }}
                  >
                     <Lock size={14} /> RESET PASSWORD
                  </button>
               </div>
            </div>

            {/* Emergency Contact Card */}
            <div className="card" style={{ padding: '24px', border: '1px solid var(--border-color)', borderRadius: '24px', background: 'var(--bg-card)' }}>
               <h3 style={{ fontSize: '1rem', fontWeight: 950, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={18} color="#EF4444" /> Emergency Info
               </h3>
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#EF444410', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', flexShrink: 0 }}>
                     <Phone size={20} />
                  </div>
                  <div>
                     <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>PRIMARY CONTACT</div>
                     <div style={{ fontSize: '1rem', fontWeight: 950 }}>{guardian.emergencyContact}</div>
                  </div>
               </div>
            </div>

         </div>

         {/* Right Column - Administrative & Ledger Console */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Tabs Selector */}
            <div className="card" style={{ padding: '6px', borderRadius: '18px', display: 'flex', gap: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
               {tabs.map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   style={{ 
                     flex: 1, padding: '12px 0', borderRadius: '14px', border: 'none',
                     backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                     color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                     display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                     cursor: 'pointer', transition: '0.3s', fontWeight: 800, fontSize: '0.85rem'
                   }}
                 >
                   {tab.icon} {tab.label}
                 </button>
               ))}
            </div>

            {/* Display Console View */}
            <div className="card" style={{ padding: '40px', minHeight: '500px', border: '1px solid var(--border-color)', borderRadius: '24px', background: 'var(--bg-card)' }}>
               <AnimatePresence mode="wait">
                  {activeTab === 'activity' && (() => {
                     const filteredLogs = logsList.filter(log => {
                       if (!logSearch.trim()) return true;
                       const q = logSearch.toLowerCase();
                       return (
                         log.action.toLowerCase().includes(q) ||
                         log.status.toLowerCase().includes(q) ||
                         log.device.toLowerCase().includes(q) ||
                         log.ip.toLowerCase().includes(q) ||
                         log.location.toLowerCase().includes(q) ||
                         log.details.toLowerCase().includes(q) ||
                         log.date.toLowerCase().includes(q)
                       );
                     });

                     return (
                     <motion.div key="activity" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                           <div>
                              <h3 style={{ fontSize: '1.4rem', fontWeight: 950, margin: 0 }}>Security Access Logs</h3>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
                                 Real-time institutional access monitoring
                                 {logSearch && (
                                   <span style={{ marginLeft: '10px', color: 'var(--primary)', fontWeight: 800 }}>
                                     — {filteredLogs.length} result{filteredLogs.length !== 1 ? 's' : ''} for &ldquo;{logSearch}&rdquo;
                                   </span>
                                 )}
                               </p>
                           </div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {/* Animated search bar */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AnimatePresence>
                                  {logSearchOpen && (
                                    <motion.div
                                      initial={{ width: 0, opacity: 0 }}
                                      animate={{ width: '240px', opacity: 1 }}
                                      exit={{ width: 0, opacity: 0 }}
                                      transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                                      style={{ overflow: 'hidden' }}
                                    >
                                      <div style={{ position: 'relative' }}>
                                        <Search size={14} style={{
                                          position: 'absolute', left: '12px', top: '50%',
                                          transform: 'translateY(-50%)', color: 'var(--text-muted)'
                                        }} />
                                        <input
                                          autoFocus
                                          type="text"
                                          placeholder="Search logs..."
                                          value={logSearch}
                                          onChange={e => setLogSearch(e.target.value)}
                                          onKeyDown={e => { if (e.key === 'Escape') { setLogSearch(''); setLogSearchOpen(false); } }}
                                          style={{
                                            width: '100%', padding: '9px 12px 9px 36px',
                                            borderRadius: '12px', border: '1px solid var(--primary)',
                                            backgroundColor: 'var(--bg-body)', fontSize: '0.85rem',
                                            fontWeight: 600, outline: 'none',
                                            boxShadow: '0 0 0 3px var(--primary-light)'
                                          }}
                                        />
                                        {logSearch && (
                                          <button
                                            onClick={() => setLogSearch('')}
                                            style={{
                                              position: 'absolute', right: '10px', top: '50%',
                                              transform: 'translateY(-50%)', background: 'none',
                                              border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                                              display: 'flex', alignItems: 'center', padding: '2px'
                                            }}
                                          >
                                            <FilterX size={14} />
                                          </button>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                                <button
                                  className="btn-icon"
                                  onClick={() => {
                                    if (logSearchOpen) { setLogSearch(''); }
                                    setLogSearchOpen(prev => !prev);
                                  }}
                                  style={{
                                    backgroundColor: logSearchOpen ? 'var(--primary-light)' : 'var(--bg-body)',
                                    color: logSearchOpen ? 'var(--primary)' : 'inherit',
                                    border: logSearchOpen ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                                    transition: '0.2s'
                                  }}
                                  title={logSearchOpen ? 'Close search' : 'Search logs'}
                                 >
                                  <Search size={18} />
                                </button>
                              </div>
                              <button
                                onClick={handleDownloadHistory}
                                disabled={isDownloadingHistory}
                                className="btn"
                                style={{
                                  fontSize: '0.8rem', backgroundColor: 'var(--bg-body)', fontWeight: 800,
                                  display: 'flex', alignItems: 'center', gap: '8px',
                                  opacity: isDownloadingHistory ? 0.7 : 1,
                                  cursor: isDownloadingHistory ? 'not-allowed' : 'pointer'
                                }}
                              >
                                {isDownloadingHistory ? (
                                  <>
                                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #cbd5e1', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite' }} />
                                    Exporting...
                                  </>
                                ) : (
                                  <><Download size={15} /> DOWNLOAD HISTORY</>
                                )}
                              </button>
                           </div>
                        </div>

                        {/* Animated search result count pill */}
                        <AnimatePresence>
                          {logSearch && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginBottom: '20px' }}
                              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                              style={{
                                padding: '10px 16px', borderRadius: '12px',
                                backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)',
                                display: 'flex', alignItems: 'center', gap: '10px',
                                fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)',
                                overflow: 'hidden'
                              }}
                            >
                              <Search size={14} />
                              Showing <strong>{filteredLogs.length}</strong> of <strong>{logsList.length}</strong> log entries matching &ldquo;{logSearch}&rdquo;
                              <button
                                onClick={() => { setLogSearch(''); setLogSearchOpen(false); }}
                                style={{
                                  marginLeft: 'auto', background: 'none', border: 'none',
                                  cursor: 'pointer', color: 'var(--primary)', display: 'flex',
                                  alignItems: 'center', fontWeight: 800, fontSize: '0.8rem', gap: '4px'
                                }}
                              >
                                <FilterX size={14} /> Clear
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Timeline */}
                        <AnimatePresence mode="popLayout">
                          {filteredLogs.length > 0 ? (
                            filteredLogs.map((log, i) => (
                              <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ delay: i * 0.04 }}
                                style={{ display: 'flex', gap: '24px', position: 'relative' }}
                              >
                                {/* Timeline Connector */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                   <div style={{
                                     width: '40px', height: '40px', borderRadius: '12px',
                                     backgroundColor: log.status === 'Blocked' ? '#EF444415' : 'var(--bg-body)',
                                     color: log.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                     border: '1px solid ' + (log.status === 'Blocked' ? '#EF444420' : 'var(--border-color)'),
                                     zIndex: 1
                                   }}>
                                      {log.icon}
                                   </div>
                                   {i !== filteredLogs.length - 1 && (
                                     <div style={{ width: '2px', flex: 1, backgroundColor: 'var(--border-color)', margin: '4px 0' }}></div>
                                   )}
                                </div>

                                {/* Content Card */}
                                <div style={{ flex: 1, paddingBottom: '32px' }}>
                                   <div className="hover-row" style={{ padding: '20px', borderRadius: '20px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', transition: '0.3s' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                         <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                               <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: log.status === 'Blocked' ? '#EF4444' : 'var(--text-main)' }}>{log.action}</h4>
                                               <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 950, backgroundColor: log.color + '15', color: log.color }}>
                                                 {log.status.toUpperCase()}
                                               </span>
                                            </div>
                                            <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.5 }}>{log.details}</p>
                                         </div>
                                         <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '16px' }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{log.date}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>{log.time}</div>
                                         </div>
                                      </div>
                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', marginTop: '4px' }}>
                                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                                            <Globe2 size={14} color="var(--primary)" /> {log.ip}
                                         </div>
                                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                                            <Monitor size={14} color="var(--primary)" /> {log.device}
                                         </div>
                                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                                            <MapPin size={14} color="var(--primary)" /> {log.location}
                                         </div>
                                      </div>
                                   </div>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              style={{
                                padding: '60px 32px', textAlign: 'center',
                                borderRadius: '20px', border: '2px dashed var(--border-color)',
                                backgroundColor: 'var(--bg-body)'
                              }}
                            >
                              <Search size={36} style={{ color: 'var(--text-muted)', opacity: 0.35, marginBottom: '16px' }} />
                              <p style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '4px' }}>No logs match &ldquo;{logSearch}&rdquo;</p>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Try a different keyword — action name, IP, device, or location.</p>
                              <button
                                onClick={() => setLogSearch('')}
                                style={{ marginTop: '16px', padding: '8px 20px', borderRadius: '10px', border: '1px solid var(--primary)', color: 'var(--primary)', background: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
                              >
                                Clear Search
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                     </motion.div>
                     );
                  })()}

                  {activeTab === 'financials' && (
                    <motion.div key="finance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                          <div>
                             <h3 style={{ fontSize: '1.4rem', fontWeight: 950, margin: 0 }}>Financial Analytics Dashboard</h3>
                             <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>Institutional statistical billing & revenue monitoring</p>
                          </div>
                          <div style={{ display: 'flex', gap: '12px' }}>
                             <button onClick={handleExportAnalytics} className="btn" style={{ fontSize: '0.85rem', fontWeight: 800, backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Download size={16} /> EXPORT ANALYTICS
                             </button>
                             <button onClick={() => setActiveModal('issue_invoice')} className="btn btn-primary" style={{ fontSize: '0.85rem', fontWeight: 800 }}>ISSUE INVOICE</button>
                          </div>
                       </div>

                       {/* Elite Statistical Grid */}
                       <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', marginBottom: '24px' }}>
                          {/* Outstanding Balance Hero */}
                          <div style={{ 
                            padding: '32px', borderRadius: '32px', 
                            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                            color: 'white', position: 'relative', overflow: 'hidden',
                            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                            minHeight: '300px'
                          }}>
                             <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                             <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                   <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <PaymentIcon size={24} color="#38bdf8" />
                                   </div>
                                   <div style={{ padding: '6px 12px', borderRadius: '10px', backgroundColor: '#EF444415', border: '1px solid #EF444430', color: '#EF4444', fontSize: '0.7rem', fontWeight: 900 }}>DUE IMMEDIATELY</div>
                                </div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>CURRENT PAYABLE BALANCE</div>
                                <div style={{ fontSize: '2.8rem', fontWeight: 950, margin: '4px 0 24px' }}>{"$" + outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                             </div>
                             <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={openPaymentModal} className="btn btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '14px', fontWeight: 900, backgroundColor: '#38bdf8', color: '#0f172a', border: 'none' }}>PAY SECURELY</button>
                                <button onClick={() => setActiveModal('details')} className="btn" style={{ padding: '12px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 800 }}>DETAILS</button>
                             </div>
                          </div>

                          {/* Statistical Pie Chart (Recharts) */}
                          <div className="card" style={{ padding: '24px', borderRadius: '32px', display: 'flex', flexDirection: 'column', background: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                             <h4 style={{ fontSize: '0.85rem', fontWeight: 950, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>Revenue Allocation</h4>
                             <div style={{ flex: 1, width: '100%', minHeight: '180px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                   <PieChart>
                                      <Pie
                                         data={pieData}
                                         innerRadius={45}
                                         outerRadius={65}
                                         paddingAngle={5}
                                         dataKey="value"
                                      >
                                         {pieData.map((entry, index) => (
                                            <Cell key={"cell-" + index} fill={entry.color} />
                                         ))}
                                      </Pie>
                                      <Tooltip />
                                   </PieChart>
                                </ResponsiveContainer>
                             </div>
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '12px' }}>
                                {pieData.map((item, i) => (
                                  <div key={i} style={{ textAlign: 'center' }}>
                                     <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)' }}>{item.name}</div>
                                     <div style={{ fontSize: '0.8rem', fontWeight: 950, color: item.color }}>{((item.value / 10150) * 100).toFixed(0)}%</div>
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>

                       {/* Statistical Bar Chart (Recharts) */}
                       <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', marginBottom: '24px' }}>
                          <div className="card" style={{ padding: '24px', borderRadius: '32px', background: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div>
                                   <h4 style={{ fontSize: '1rem', fontWeight: 950, margin: 0 }}>Institutional Spending Trend</h4>
                                   <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>Statistical YoY Growth Analytics</p>
                                </div>
                             </div>
                             
                             <div style={{ height: '220px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                   <BarChart data={trendData}>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                      <XAxis 
                                        dataKey="month" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--text-muted)' }}
                                      />
                                      <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--text-muted)' }}
                                        tickFormatter={(value) => "$" + value}
                                      />
                                      <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                                        cursor={{ fill: 'var(--bg-body)', opacity: 0.4 }}
                                      />
                                      <Bar dataKey="current" name="2024 Revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={16} />
                                      <Bar dataKey="prev" name="2023 Revenue" fill="#CBD5E1" radius={[4, 4, 0, 0]} barSize={16} />
                                      <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                                   </BarChart>
                                </ResponsiveContainer>
                             </div>
                          </div>

                          <div className="card" style={{ padding: '24px', borderRadius: '32px', background: 'linear-gradient(135deg, #10B98105 0%, #05966905 100%)', border: '1px solid var(--border-color)' }}>
                             <h4 style={{ fontSize: '0.95rem', fontWeight: 950, marginBottom: '20px' }}>Incentive Performance</h4>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {[
                                  { label: 'Merit Award', val: '15%', color: '#10B981', icon: <Star size={14} /> },
                                  { label: 'Sibling Grant', val: '$200', color: '#10B981', icon: <Users size={14} /> }
                                ].map((item, i) => (
                                  <div key={i} style={{ padding: '12px 16px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: item.color + "10", color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>{item.label}</div>
                                     </div>
                                     <div style={{ fontSize: '0.85rem', fontWeight: 950, color: item.color }}>-{item.val}</div>
                                  </div>
                                ))}
                             </div>
                             <div style={{ marginTop: '24px', padding: '16px', borderRadius: '16px', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px dashed #10B98130' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#059669', textTransform: 'uppercase', marginBottom: '4px' }}>YTD SAVINGS</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 950, color: '#059669' }}>$1,850.00</div>
                             </div>
                          </div>
                       </div>

                       {/* Elite Transaction Ledger */}
                       <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '24px', background: 'var(--bg-body)' }}>
                          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <h4 style={{ fontSize: '1rem', fontWeight: 950, margin: 0 }}>Institutional Transaction Ledger</h4>
                             <button onClick={() => setActiveModal('audit')} className="btn" style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                FULL AUDIT <ArrowRight size={14} />
                             </button>
                          </div>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                             <thead style={{ backgroundColor: 'var(--bg-card)' }}>
                                <tr style={{ textAlign: 'left' }}>
                                   <th style={{ padding: '14px 24px', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 950, textTransform: 'uppercase' }}>Invoice</th>
                                   <th style={{ padding: '14px 24px', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 950, textTransform: 'uppercase' }}>Description</th>
                                   <th style={{ padding: '14px 24px', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 950, textTransform: 'uppercase' }}>Ledger Status</th>
                                   <th style={{ padding: '14px 24px', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 950, textTransform: 'uppercase' }}>Amount</th>
                                   <th style={{ padding: '14px 24px', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 950, textTransform: 'uppercase', textAlign: 'right' }}>Receipt</th>
                                </tr>
                             </thead>
                             <tbody>
                                {invoicesList.map((inv, i) => (
                                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                     <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--primary)' }}>{inv.id}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>{inv.month}</div>
                                     </td>
                                     <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{inv.type}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Due: {inv.dueDate}</div>
                                     </td>
                                     <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                           <div style={{ width: '80px', height: '6px', backgroundColor: 'var(--bg-card)', borderRadius: '10px' }}>
                                              <div style={{ 
                                                width: inv.progress + "%", height: '100%', 
                                                backgroundColor: inv.status === 'Paid' ? '#10B981' : inv.status === 'Overdue' ? '#EF4444' : '#F59E0B', 
                                                borderRadius: '10px' 
                                              }}></div>
                                           </div>
                                           <span style={{ fontSize: '0.7rem', fontWeight: 950, color: inv.status === 'Paid' ? '#10B981' : inv.status === 'Overdue' ? '#EF4444' : '#F59E0B' }}>
                                              {inv.status.toUpperCase()}
                                           </span>
                                        </div>
                                     </td>
                                     <td style={{ padding: '16px 24px', fontWeight: 950, fontSize: '0.95rem' }}>{"$" + inv.amount.toLocaleString()}</td>
                                     <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <button 
                                           onClick={() => handleViewReceipt(inv)}
                                           title={inv.status === 'Paid' ? 'View/Print Receipt' : 'Complete Secure Settlement'}
                                           className="btn-icon-sm" 
                                           style={{ backgroundColor: 'var(--bg-card)', padding: '6px', borderRadius: '8px' }}
                                         >
                                           <FileText size={16} />
                                        </button>
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
      <ToastRenderer toast={toast} onClose={hideToast} />
    </motion.div>
  );
};

export default GuardianDetails;
