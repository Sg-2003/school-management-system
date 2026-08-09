import React, { useState } from 'react';
import { 
  CreditCard, Search, Filter, Plus, MoreVertical, Star, 
  DollarSign, Clock, CheckCircle2, FileText, ChevronRight,
  User, Wallet, ArrowUpRight, TrendingUp, AlertCircle,
  BarChart, Zap, Building, Save, Printer, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart as ReBarChart, Bar, Cell 
} from 'recharts';
import { useToast, ToastRenderer } from '../hooks/useToast';
import devonAvatar from '../assets/devon_avatar.png';
import janeAvatar from '../assets/jane_avatar.png';
import eleanorAvatar from '../assets/eleanor_avatar.png';
import ninaPatelAvatar from '../assets/nina_patel_avatar.png';

const getStudentAvatar = (studentName) => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(studentName)}`;
};

const FeesCollection = () => {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Interactive payment panel states
  const [selectedMethod, setSelectedMethod] = useState('Cash');
  const [collectAmount, setCollectAmount] = useState('');
  
  // Broadcast reminder state
  const [isSendingReminders, setIsSendingReminders] = useState(false);

  // Generate Invoice Modal states
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceStudent, setInvoiceStudent] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceCategory, setInvoiceCategory] = useState('Tuition');

  const [studentList, setStudentList] = useState(() => {
    const stored = localStorage.getItem('students_fees_v2');
    const initial = [
      { id: 'STU-2026-001', name: 'Aman Verma', class: '10A', balance: '₹25,000', status: 'Partially Paid', lastPayment: '2026-04-12' },
      { id: 'STU-2026-002', name: 'Neha Sharma', class: '10B', balance: '₹0', status: 'Fully Paid', lastPayment: '2026-05-01' },
      { id: 'STU-2026-003', name: 'Abhishek Singh', class: '09A', balance: '₹75,000', status: 'Unpaid', lastPayment: '-' },
      { id: 'STU-2026-004', name: 'Priya Patel', class: '12C', balance: '₹15,000', status: 'Partially Paid', lastPayment: '2026-05-02' },
      { id: 'STU-2026-005', name: 'Rajinder Singh', class: '11A', balance: '₹35,000', status: 'Unpaid', lastPayment: '-' },
      { id: 'STU-2026-006', name: 'Divya Joshi', class: '08B', balance: '₹0', status: 'Fully Paid', lastPayment: '2026-04-28' },
      { id: 'STU-2026-007', name: 'Rahul Kapoor', class: '10A', balance: '₹50,000', status: 'Partially Paid', lastPayment: '2026-05-03' },
      { id: 'STU-2026-008', name: 'Meera Patel', class: '12B', balance: '₹90,000', status: 'Unpaid', lastPayment: '-' },
      { id: 'STU-2026-009', name: 'Kabir Sen', class: '09C', balance: '₹18,000', status: 'Partially Paid', lastPayment: '2026-05-01' },
      { id: 'STU-2026-010', name: 'Ananya Iyer', class: '11B', balance: '₹0', status: 'Fully Paid', lastPayment: '2026-05-05' },
      { id: 'STU-2026-011', name: 'Rohan Das', class: '10B', balance: '₹25,000', status: 'Unpaid', lastPayment: '-' },
      { id: 'STU-2026-012', name: 'Neha Sharma', class: '12A', balance: '₹7,000', status: 'Partially Paid', lastPayment: '2026-04-30' },
    ];
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map(s => {
            if (s.id === 'STU-2026-001' && s.name !== 'Aman Verma') {
              return { ...s, name: 'Aman Verma' };
            }
            if (s.id === 'STU-2026-006' && s.name !== 'Divya Joshi') {
              return { ...s, name: 'Divya Joshi' };
            }
            return s;
          });
        }
      } catch (e) {}
    }
    localStorage.setItem('students_fees_v2', JSON.stringify(initial));
    return initial;
  });

  // Lazy load activities log
  const [activities, setActivities] = useState(() => {
    const stored = localStorage.getItem('fees_recent_activity_v2');
    if (stored) {
      return JSON.parse(stored);
    } else {
      const initial = [
        { id: 'TRX-9821', student: 'Rohan Das', amount: '₹25,000', time: '12m ago' },
        { id: 'TRX-9820', student: 'Aditi Nair', amount: '₹25,000', time: '45m ago' },
      ];
      localStorage.setItem('fees_recent_activity_v2', JSON.stringify(initial));
      return initial;
    }
  });

  const velocityData = [
    { time: '08:00', amount: 0 },
    { time: '09:00', amount: 1200 },
    { time: '10:00', amount: 2800 },
    { time: '11:00', amount: 4500 },
    { time: '12:00', amount: 5200 },
    { time: '13:00', amount: 5200 },
    { time: '14:00', amount: 6800 },
    { time: '15:00', amount: 8450 },
    { time: '16:00', amount: 8450 },
  ];

  const classData = [
    { name: 'Class 9', collected: 12500, total: 15000 },
    { name: 'Class 10', collected: 18400, total: 20000 },
    { name: 'Class 11', collected: 15600, total: 22000 },
    { name: 'Class 12', collected: 21000, total: 25000 },
  ];

  const comparisonData = [
    { month: 'Jan', collection: 45000, discount: 5000 },
    { month: 'Feb', collection: 52000, discount: 6200 },
    { month: 'Mar', collection: 48000, discount: 4800 },
    { month: 'Apr', collection: 61000, discount: 7500 },
    { month: 'May', collection: 55000, discount: 5900 },
    { month: 'Jun', collection: 67000, discount: 8200 },
  ];

  // Print Daily Log handler
  const handlePrintDailyLog = () => {
    const summaryRows = [
      ['Fees Collection Daily Activity Log', 'Date: ' + new Date().toLocaleDateString()],
      [],
      ['Recent Fee Transactions Ledger', ''],
      ['Transaction ID', 'Student Profile', 'Amount Collected', 'Elapsed Time'],
      ...activities.map(a => [a.id, a.student, a.amount, a.time])
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += summaryRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `daily_fees_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Daily fee activity log downloaded successfully!', 'success', 'Log Exported');
  };

  // Row printing receipt handler
  const handlePrintTrxReceipt = (trx) => {
    const receiptText = `
=============================================
           INSTITUTIONAL FEE RECEIPT
=============================================
Transaction ID:   ${trx.id}
Student Name:     ${trx.student}
Amount Paid:      ${trx.amount}
Payment Date:     ${new Date().toLocaleDateString()}
Status:           VERIFIED & SECURED

Authorized Stamp: School Management System
=============================================
`;
    const element = document.createElement("a");
    const file = new Blob([receiptText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `receipt_${trx.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    showToast(`Transaction receipt ${trx.id} downloaded successfully!`, 'success', 'Receipt Downloaded');
  };

  // Confirm Payment handler
  const handleConfirmPayment = () => {
    if (!selectedStudent || !collectAmount) return;
    const amountVal = parseFloat(collectAmount) || 0;
    if (amountVal <= 0) {
      showToast('Please enter a valid payment amount.', 'warning', 'Validation Error');
      return;
    }
    
    const currentBal = parseFloat(selectedStudent.balance.replace(/[^0-9.]/g, '')) || 0;
    if (amountVal > currentBal) {
      showToast(`Payment amount ($${amountVal}) cannot exceed outstanding balance ($${currentBal}).`, 'error', 'Exceeds Balance');
      return;
    }

    const newBal = currentBal - amountVal;
    const formattedNewBal = '$' + newBal.toLocaleString('en-US', { minimumFractionDigits: 2 });
    
    const updatedList = studentList.map(s => {
      if (s.id === selectedStudent.id) {
        return {
          ...s,
          balance: formattedNewBal,
          status: newBal === 0 ? 'Fully Paid' : 'Partially Paid',
          lastPayment: new Date().toISOString().split('T')[0]
        };
      }
      return s;
    });
    
    setStudentList(updatedList);
    localStorage.setItem('students_fees_v2', JSON.stringify(updatedList));

    setSelectedStudent(prev => ({
      ...prev,
      balance: formattedNewBal,
      status: newBal === 0 ? 'Fully Paid' : 'Partially Paid',
      lastPayment: new Date().toISOString().split('T')[0]
    }));

    const newTrxId = `TRX-${Math.floor(9800 + Math.random()*199)}`;
    const newActivity = {
      id: newTrxId,
      student: selectedStudent.name,
      amount: '$' + amountVal.toLocaleString('en-US', { minimumFractionDigits: 2 }),
      time: 'Just now'
    };
    
    const updatedActivities = [newActivity, ...activities];
    setActivities(updatedActivities);
    localStorage.setItem('fees_recent_activity', JSON.stringify(updatedActivities));

    const storedTrx = localStorage.getItem('institutional_transactions');
    const masterTrx = storedTrx ? JSON.parse(storedTrx) : [];
    const updatedMasterTrx = [
      {
        id: newTrxId,
        title: `Fee Payment - ${selectedStudent.name}`,
        category: 'Academic',
        amount: '$' + amountVal.toLocaleString('en-US', { minimumFractionDigits: 2 }),
        type: 'Income',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        method: selectedMethod
      },
      ...masterTrx
    ];
    localStorage.setItem('institutional_transactions', JSON.stringify(updatedMasterTrx));

    showToast(`Payment of $${amountVal.toLocaleString()} processed for ${selectedStudent.name}!`, 'success', 'Payment Confirmed');
    setCollectAmount('');
  };

  // Generate Invoice handler
  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!invoiceStudent || !invoiceAmount) return;
    const amountVal = parseFloat(invoiceAmount) || 0;
    if (amountVal <= 0) {
      showToast('Please enter a valid amount.', 'warning', 'Validation Error');
      return;
    }

    const target = studentList.find(s => s.name.toLowerCase().includes(invoiceStudent.toLowerCase()) || s.id.toLowerCase() === invoiceStudent.toLowerCase());
    if (!target) {
      showToast('Student profile not found. Please provide an active student name or ID.', 'error', 'Not Found');
      return;
    }

    const currentBal = parseFloat(target.balance.replace(/[^0-9.]/g, '')) || 0;
    const newBal = currentBal + amountVal;
    const formattedNewBal = '$' + newBal.toLocaleString('en-US', { minimumFractionDigits: 2 });

    const updatedList = studentList.map(s => {
      if (s.id === target.id) {
        return {
          ...s,
          balance: formattedNewBal,
          status: 'Partially Paid'
        };
      }
      return s;
    });

    setStudentList(updatedList);
    localStorage.setItem('students_fees_v2', JSON.stringify(updatedList));

    if (selectedStudent && selectedStudent.id === target.id) {
      setSelectedStudent(prev => ({
        ...prev,
        balance: formattedNewBal,
        status: 'Partially Paid'
      }));
    }

    showToast(`Invoice for ₹${amountVal.toLocaleString()} issued for ${target.name}. Dues updated to ${formattedNewBal}.`, 'success', 'Invoice Created');
    setShowInvoiceModal(false);
    setInvoiceStudent('');
    setInvoiceAmount('');
  };

  // Send reminders handler
  const handleSendAllReminders = () => {
    setIsSendingReminders(true);
    setTimeout(() => {
      setIsSendingReminders(false);
      showToast('Critical reminders broadcasted to all students with outstanding balances!', 'success', 'Reminders Sent');
    }, 1200);
  };

  // Filter students based on search input query
  const filteredStudents = studentList.filter(stu => 
    stu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stu.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stu.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--success)', marginBottom: '8px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--success-light)', borderRadius: '10px' }}>
               <Wallet size={20} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Institutional Finance</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 950, margin: 0, letterSpacing: '-1px' }}>Fees Collection</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px', fontWeight: 600 }}>Process student payments, manage invoices, and track revenue streams.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button 
              onClick={handlePrintDailyLog}
              className="btn" 
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
           >
              <Printer size={18} /> PRINT DAILY LOG
           </button>
           <button 
              onClick={() => setShowInvoiceModal(true)}
              className="btn btn-primary" 
              style={{ padding: '12px 28px', fontWeight: 900, boxShadow: '0 4px 12px rgba(72, 128, 255, 0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
           >
              <Plus size={18} /> GENERATE INVOICE
           </button>
        </div>
      </div>

      {/* 1. Summary Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
         {[
           { label: 'Today\'s Collection', value: '$8,450', change: '+12%', isPositive: true, color: 'var(--primary)' },
           { label: 'Pending Dues', value: '$24,200', change: '-5%', isPositive: false, color: '#EF4444' },
           { label: 'Active Discounts', value: '42', change: '+2', isPositive: true, color: '#F59E0B' },
           { label: 'Revenue Growth', value: '$125.4k', change: '+18%', isPositive: true, color: '#10B981' }
         ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
               <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 950 }}>{stat.value}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 900, color: stat.isPositive ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                     {stat.isPositive ? <ArrowUpRight size={14} /> : <TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} />}
                     {stat.change}
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* 2. Primary Collection Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }}>
         {/* Left Side: Student Selection */}
         <div className="card" style={{ padding: '0', borderRadius: '32px', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)' }}>
               <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '16px', top: '13px', color: 'var(--text-muted)' }} />
                  <input 
                     type="text" 
                     placeholder="Search student by name, ID or roll number..." 
                     style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
            </div>
            
            <div style={{ padding: '12px', maxHeight: '500px', overflowY: 'auto' }}>
               {filteredStudents.length > 0 ? (
                  filteredStudents.map((stu) => (
                     <motion.div 
                        key={stu.id}
                        whileHover={{ x: 5, backgroundColor: 'var(--bg-body)' }}
                        onClick={() => setSelectedStudent(stu)}
                        style={{ 
                           padding: '20px', 
                           borderRadius: '20px', 
                           cursor: 'pointer',
                           display: 'flex',
                           justifyContent: 'space-between',
                           alignItems: 'center',
                           backgroundColor: selectedStudent?.id === stu.id ? 'var(--primary-light)' : 'transparent',
                           transition: '0.2s'
                        }}
                     >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                           <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--primary)', overflow: 'hidden', flexShrink: 0 }}>
                              {getStudentAvatar(stu.name) ? (
                                 <img 
                                    src={getStudentAvatar(stu.name)} 
                                    alt={stu.name} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                 />
                              ) : (
                                 stu.name.charAt(0)
                              )}
                           </div>
                           <div>
                              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>{stu.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{stu.id} • Class {stu.class}</div>
                           </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                           <div style={{ fontSize: '1rem', fontWeight: 950, color: stu.balance === '$0.00' ? 'var(--success)' : '#EF4444' }}>{stu.balance}</div>
                           <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Balance Due</div>
                        </div>
                     </motion.div>
                  ))
               ) : (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                     No students found matching your search.
                  </div>
               )}
            </div>
         </div>

         {/* Right Side: Collection Panel */}
         <div className="card" style={{ padding: '32px', borderRadius: '32px', height: 'fit-content', border: '2px solid var(--primary-light)', backgroundColor: 'var(--bg-card)' }}>
            {selectedStudent ? (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <h3 style={{ fontSize: '1.25rem', fontWeight: 950, margin: 0 }}>Payment Details</h3>
                     <Zap size={20} color="var(--primary)" fill="var(--primary)" />
                  </div>

                  <div style={{ padding: '20px', borderRadius: '24px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                     <div style={{ width: '52px', height: '52px', borderRadius: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, color: 'var(--primary)', overflow: 'hidden', flexShrink: 0 }}>
                        {getStudentAvatar(selectedStudent.name) ? (
                           <img 
                              src={getStudentAvatar(selectedStudent.name)} 
                              alt={selectedStudent.name} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                           />
                        ) : (
                           selectedStudent.name.charAt(0)
                        )}
                     </div>
                     <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase' }}>Paying For</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)' }}>{selectedStudent.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Outstanding: <span style={{ color: '#EF4444', fontWeight: 850 }}>{selectedStudent.balance}</span></div>
                     </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                     <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Amount to Collect</label>
                        <div style={{ position: 'relative' }}>
                           <DollarSign size={18} style={{ position: 'absolute', left: '16px', top: '13px', color: 'var(--text-muted)' }} />
                           <input 
                              type="number" 
                              placeholder="0.00" 
                              value={collectAmount}
                              onChange={(e) => setCollectAmount(e.target.value)}
                              style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 900, fontSize: '1.2rem' }}
                           />
                        </div>
                     </div>

                     <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Payment Method</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                           {['Cash', 'Online', 'Bank', 'Cheque'].map(m => (
                              <button 
                                 key={m} 
                                 type="button"
                                 onClick={() => setSelectedMethod(m)}
                                 className="btn" 
                                 style={{ 
                                    backgroundColor: selectedMethod === m ? 'var(--primary)' : 'var(--bg-body)', 
                                    color: selectedMethod === m ? 'white' : 'var(--text-main)', 
                                    border: selectedMethod === m ? '1px solid var(--primary)' : '1px solid var(--border-color)', 
                                    fontWeight: 800, 
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    transition: '0.2s'
                                 }}
                              >
                                 {m}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div style={{ padding: '20px', borderRadius: '24px', backgroundColor: 'var(--primary-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>GRAND TOTAL</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--primary)' }}>
                           {collectAmount ? '$' + parseFloat(collectAmount).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '$0.00'}
                        </div>
                     </div>
                     <button 
                        onClick={handleConfirmPayment}
                        className="btn btn-primary" 
                        style={{ padding: '12px 24px', fontWeight: 955, cursor: 'pointer' }}
                     >
                        CONFIRM
                     </button>
                  </div>
               </div>
            ) : (
               <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <AlertCircle size={48} color="var(--text-muted)" style={{ marginBottom: '20px', margin: '0 auto' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '8px' }}>No Student Selected</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Please search and select a student from the list to process fees.</p>
               </div>
            )}
         </div>
      </div>

      {/* 3. Analytics Section 1: Velocity & Class Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
         {/* Collection Velocity Chart */}
         <div className="card" style={{ padding: '32px', borderRadius: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 950, margin: 0 }}>Hourly Collection Velocity</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Real-time revenue progression during current business hours.</p>
               </div>
               <div style={{ padding: '6px 14px', backgroundColor: 'var(--success-light)', color: 'var(--success)', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900 }}>
                  LIVE TRACKING
               </div>
            </div>
            <div style={{ height: '220px', width: '100%' }}>
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={velocityData}>
                     <defs>
                        <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                           <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                     <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--text-muted)' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--text-muted)' }} tickFormatter={(v) => `$${v/1000}k`} />
                     <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-xl)' }} />
                     <Area type="step" dataKey="amount" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorVelocity)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Class-wise Breakdown */}
         <div className="card" style={{ padding: '32px', borderRadius: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '24px' }}>Class Breakdown</h3>
            <div style={{ height: '220px', width: '100%' }}>
               <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={classData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: 'var(--text-muted)' }} />
                     <YAxis hide />
                     <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                     <Bar dataKey="collected" radius={[6, 6, 0, 0]} barSize={30}>
                        {classData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--primary)' : '#8B5CF6'} />
                        ))}
                     </Bar>
                  </ReBarChart>
               </ResponsiveContainer>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
               <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>HIGHEST</div>
                  <div style={{ fontWeight: 900, color: 'var(--primary)' }}>Class 12 ($21k)</div>
               </div>
               <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>LOWEST</div>
                  <div style={{ fontWeight: 900, color: '#8B5CF6' }}>Class 9 ($12.5k)</div>
               </div>
            </div>
         </div>
      </div>

      {/* 4. Analytics Section 2: Risk & Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
         {/* High Dues Risk Monitoring */}
         <div className="card" style={{ padding: '32px', borderRadius: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 950, margin: 0 }}>Risk Monitoring</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Top priority outstanding profiles.</p>
               </div>
            </div>
            <div style={{ height: '250px', width: '100%' }}>
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                     { month: 'Jan', 'Alex': 1200, 'Sarah': 900, 'Michael': 1500, 'Emily': 600, 'Robert': 1100 },
                     { month: 'Feb', 'Alex': 1100, 'Sarah': 850, 'Michael': 1400, 'Emily': 550, 'Robert': 1000 },
                     { month: 'Mar', 'Alex': 1000, 'Sarah': 800, 'Michael': 1300, 'Emily': 500, 'Robert': 900 },
                     { month: 'Apr', 'Alex': 900, 'Sarah': 750, 'Michael': 1200, 'Emily': 450, 'Robert': 800 },
                     { month: 'May', 'Alex': 800, 'Sarah': 700, 'Michael': 1100, 'Emily': 400, 'Robert': 700 },
                     { month: 'Jun', 'Alex': 700, 'Sarah': 650, 'Michael': 1000, 'Emily': 350, 'Robert': 600 },
                  ]}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                     <Tooltip />
                     <Area type="monotone" dataKey="Alex" stackId="1" stroke="#4880FF" fill="#4880FF" fillOpacity={0.4} />
                     <Area type="monotone" dataKey="Sarah" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.4} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Collection vs Discount */}
         <div className="card" style={{ padding: '32px', borderRadius: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '24px' }}>Revenue vs Concession</h3>
            <div style={{ height: '250px', width: '100%' }}>
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={comparisonData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                     <Tooltip />
                     <Area type="monotone" dataKey="collection" stackId="1" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
                     <Area type="monotone" dataKey="discount" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.4} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* 5. Historical Activity & Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
         {/* Recent Activity Ledger */}
         <div className="card" style={{ padding: '0', borderRadius: '32px', overflow: 'hidden' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-body)' }}>
               <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 950, margin: 0 }}>Recent Activity Ledger</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, margin: 0 }}>Live stream of transactions processed.</p>
               </div>
               <button 
                  onClick={() => navigate('/dashboard/transactions')}
                  className="btn" 
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
               >
                  VIEW ALL
               </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: 'var(--bg-card)' }}>
                     <tr style={{ textAlign: 'left' }}>
                        <th style={{ padding: '16px 32px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>TRX ID</th>
                        <th style={{ padding: '16px 32px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>STUDENT</th>
                        <th style={{ padding: '16px 32px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>AMOUNT</th>
                        <th style={{ padding: '16px 32px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>ACTION</th>
                     </tr>
                  </thead>
                  <tbody>
                     {activities.map((trx, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                           <td style={{ padding: '20px 32px', fontWeight: 700, color: 'var(--primary)' }}>{trx.id}</td>
                           <td style={{ padding: '20px 32px' }}>
                              <div style={{ fontWeight: 800 }}>{trx.student}</div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{trx.time}</div>
                           </td>
                           <td style={{ padding: '20px 32px', fontWeight: 900 }}>{trx.amount}</td>
                           <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                              <button 
                                 onClick={() => handlePrintTrxReceipt(trx)}
                                 style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '6px', backgroundColor: 'var(--bg-body)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                 title="Print Receipt"
                              >
                                 <Printer size={16} />
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Institutional Reminders */}
         <div className="card" style={{ padding: '32px', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#EF444415', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertCircle size={20} />
               </div>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 950, margin: 0 }}>Critical Reminders</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {[
                  { title: 'Hostel Fees', count: '12 Students', priority: 'High' },
                  { title: 'Transport Dues', count: '8 Students', priority: 'Medium' },
               ].map((rem, i) => (
                  <div key={i} style={{ padding: '16px', borderRadius: '20px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{rem.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rem.count}</div>
                     </div>
                     <span style={{ fontSize: '0.65rem', fontWeight: 900, padding: '4px 8px', borderRadius: '6px', backgroundColor: '#EF444415', color: '#EF4444' }}>
                        {rem.priority.toUpperCase()}
                     </span>
                  </div>
               ))}
            </div>

            <button 
               onClick={handleSendAllReminders}
               disabled={isSendingReminders}
               className="btn btn-primary" 
               style={{ width: '100%', padding: '14px', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
               {isSendingReminders ? 'SENDING...' : 'SEND ALL'}
            </button>
         </div>
      </div>

      {/* Generate Invoice Modal */}
      <AnimatePresence>
        {showInvoiceModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: '24px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowInvoiceModal(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '500px', position: 'relative', boxShadow: 'var(--shadow-2xl)' }}
            >
              <button 
                onClick={() => setShowInvoiceModal(false)}
                style={{ position: 'absolute', top: '32px', right: '32px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '8px', borderRadius: '10px', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Close"
              >
                <X size={20} />
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '8px' }}>
                <Plus size={24} />
                <span style={{ fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Billing Center</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>Generate Student Invoice</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Issue a new fee balance or special category charge to a student profile.</p>

              <form onSubmit={handleCreateInvoice} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Select Student (Name or ID)</label>
                  <select 
                     required
                     value={invoiceStudent}
                     onChange={(e) => setInvoiceStudent(e.target.value)}
                     style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600, cursor: 'pointer' }}
                  >
                     <option value="">Select Student</option>
                     {studentList.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                     ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Invoice Fee Head Category</label>
                  <select 
                     value={invoiceCategory}
                     onChange={(e) => setInvoiceCategory(e.target.value)}
                     style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600, cursor: 'pointer' }}
                  >
                     <option value="Tuition">Tuition Fees</option>
                     <option value="Transport">Transport Charge</option>
                     <option value="Hostel">Hostel Accommodation</option>
                     <option value="Library">Library & Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Invoice Amount (USD)</label>
                  <input 
                     type="number" 
                     required
                     placeholder="e.g. 500" 
                     value={invoiceAmount}
                     onChange={(e) => setInvoiceAmount(e.target.value)}
                     style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                  />
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <button type="button" className="btn" onClick={() => setShowInvoiceModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 800 }}>Discard</button>
                  <button 
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                  >
                    Create Invoice
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
      <ToastRenderer toast={toast} onClose={hideToast} />
    </>
  );
};

export default FeesCollection;
