import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Coins, TrendingUp, TrendingDown, Clock, Search, Filter, Download, MoreVertical, CheckCircle2, AlertCircle, Calendar, ArrowUpRight, BarChart3, CreditCard, ShieldCheck, HeartPulse, PieChart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast, ToastRenderer } from '../hooks/useToast';

const Payroll = () => {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  // Lazy initialize state connected to localStorage & employee directories
  const [payrollList, setPayrollList] = useState(() => {
    const stored = localStorage.getItem('staff_payrolls_v2');
    let basePayrolls = [];
    if (stored) {
      basePayrolls = JSON.parse(stored);
    } else {
      basePayrolls = [
        { id: 'PAY-2026-05-01', name: 'Dr. Rajesh Malhotra', role: 'Professor', salary: '$7,083', status: 'Paid', date: '01 May 2026', method: 'Direct Deposit', dept: 'Mathematics' },
        { id: 'PAY-2026-05-02', name: 'Sunita Rao', role: 'Admin', salary: '$4,500', status: 'Paid', date: '01 May 2026', method: 'Bank Transfer', dept: 'Administration' },
        { id: 'PAY-2026-05-03', name: 'Amit Bose', role: 'IT Lead', salary: '$5,200', status: 'Pending', date: '--', method: 'Institutional Bank', dept: 'Technical' },
        { id: 'PAY-2026-05-04', name: 'Priya Patel', role: 'Counselor', salary: '$3,800', status: 'Paid', date: '01 May 2026', method: 'Direct Deposit', dept: 'Student Welfare' },
      ];
    }

    // Automatically check for newly registered employees from AddEmployee/StaffRegistration
    const employeesStored = localStorage.getItem('employees');
    if (employeesStored) {
      const employees = JSON.parse(employeesStored);
      employees.forEach(emp => {
        // If employee doesn't have a payroll record yet
        const hasRecord = basePayrolls.some(p => p.name === emp.name || p.id.includes(emp.id));
        if (!hasRecord) {
          // Parse monthly salary (e.g. "$65,000 / annum" -> $5,416)
          let numSalary = 5000;
          if (emp.salary) {
            const cleanSalary = emp.salary.replace(/[^0-9]/g, '');
            const parsedSalary = parseInt(cleanSalary);
            if (!isNaN(parsedSalary) && parsedSalary > 0) {
              numSalary = Math.round(parsedSalary / 12);
            }
          }
          basePayrolls.push({
            id: `PAY-2026-05-${Math.floor(10 + Math.random() * 89)}`,
            name: emp.name,
            role: emp.role || 'Staff Member',
            salary: `$${numSalary.toLocaleString()}`,
            status: 'Pending',
            date: '--',
            method: 'Direct Deposit',
            dept: emp.department || 'General'
          });
        }
      });
    }

    localStorage.setItem('staff_payrolls_v2', JSON.stringify(basePayrolls));
    return basePayrolls;
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [showFilterPopover, setShowFilterPopover] = useState(false);

  const departments = ['All', 'Mathematics', 'Administration', 'Technical', 'Student Welfare', 'General'];

  // Benefit Programs state loaded from localStorage
  const [benefits, setBenefits] = useState(() => {
    const stored = localStorage.getItem('benefit_programs');
    if (stored) {
      return JSON.parse(stored);
    } else {
      const initialBenefits = [
        { label: 'Health & Dental', val: '92% Active', color: '#10B981', details: 'Institutional healthcare plan, covers 80% dental and medical expenses.', active: true },
        { label: 'Life Insurance', val: '88% Active', color: '#6366F1', details: 'Term-life insurance up to 3x annual base salary.', active: true },
        { label: 'Retirement (401k)', val: '142 Enrolled', color: '#F59E0B', details: '4% basic matching institutional fund matching scheme.', active: true },
        { label: 'Paid Time Off', val: 'Avg. 15 Days', color: '#EF4444', details: '15 annual days standard paid time off with roll-over allowance.', active: true }
      ];
      localStorage.setItem('benefit_programs', JSON.stringify(initialBenefits));
      return initialBenefits;
    }
  });

  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState(null);

  // Dynamic KPI Metrics calculations
  const totalPaid = payrollList
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + parseInt(p.salary.replace(/[^0-9]/g, '') || 0), 0);

  const totalPending = payrollList
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + parseInt(p.salary.replace(/[^0-9]/g, '') || 0), 0);

  const pendingCount = payrollList.filter(p => p.status === 'Pending').length;

  const benefitsContribution = Math.round(totalPaid * 0.188); // simulated fixed institutional benefits contribution
  const taxReserves = Math.round(totalPaid * 0.117); // simulated federal compliance tax reserves

  // Filtering engine
  const filteredPayrolls = payrollList.filter(pay => {
    const matchesSearch = 
      pay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || pay.status === statusFilter;
    const matchesDept = deptFilter === 'All' || pay.dept === deptFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  // Payslip generator & download
  const handleDownloadPayslip = (pay) => {
    const baseSalary = parseInt(pay.salary.replace(/[^0-9]/g, ''));
    const grossSalary = isNaN(baseSalary) ? 5000 : baseSalary;
    
    const taxDeductions = Math.round(grossSalary * 0.117);
    const healthDeductions = 150;
    const retirementDeductions = Math.round(grossSalary * 0.04);
    const netSalary = grossSalary - taxDeductions - healthDeductions - retirementDeductions;

    const payslipContent = `EduPro Elite Academy - Official Payslip
==================================================
DISBURSEMENT ID: ${pay.id}
EMPLOYEE NAME:   ${pay.name}
DESIGNATION:     ${pay.role}
DEPARTMENT:      ${pay.dept || 'Mathematics'}
PAYMENT MONTH:   May 2026
PAYMENT STATUS:  ${pay.status}
DISBURSE DATE:   ${pay.date === '--' ? 'Pending Processing Cycle' : pay.date}
PAYMENT METHOD:  ${pay.method}
==================================================
EARNINGS LEDGER:
Basic Base Earnings:          $${grossSalary.toLocaleString()}
==================================================
DEDUCTIONS VAULT:
Federal Income Tax (11.7%):   -$${taxDeductions.toLocaleString()}
Health Insurance Premium:    -$${healthDeductions}
Retirement (401k) Pension:   -$${retirementDeductions.toLocaleString()}
--------------------------------------------------
TOTAL INSTITUTIONAL NET PAY:  $${netSalary.toLocaleString()}
==================================================
SECURE COMPLIANCE:
Verified by EduPro Elite Automated Treasury Handshake
Digital Ledger Hash: SHA-${Math.floor(100000 + Math.random() * 900000)}
All transactions are encrypted under cryptographic compliance.`;

    const blob = new Blob([payslipContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Payslip_${pay.name.replace(/\s+/g, '_')}_May2026.txt`);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // CSV Ledger exporter
  const handleExportLedger = () => {
    let csv = 'Pay ID,Staff Member,Role,Department,Net Monthly Salary,Status,Disbursement Date,Payment Method\n';
    filteredPayrolls.forEach(p => {
      const escapedName = p.name.replace(/"/g, '""');
      const escapedRole = p.role.replace(/"/g, '""');
      const escapedDept = (p.dept || 'General').replace(/"/g, '""');
      csv += `"${p.id}","${escapedName}","${escapedRole}","${escapedDept}","${p.salary}","${p.status}","${p.date}","${p.method}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Payroll_Ledger_May2026.csv`);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
    <div style={{ padding: '20px', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Payroll & Institutional Benefits</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Comprehensive oversight of staff compensation, health benefits, and retirement schemes.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button 
              onClick={handleExportLedger}
              className="btn" 
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
           >
              <Download size={18} /> EXPORT LEDGER
           </button>
           <button 
              onClick={() => navigate('/dashboard/payroll-generate')}
              className="btn btn-primary" 
              style={{ padding: '12px 28px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 900 }}
           >
              <Coins size={18} /> GENERATE PAYROLL
           </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
         {[
           { label: 'Total Monthly Payout', value: `$${totalPaid.toLocaleString()}`, change: '+2.5% from April', icon: <Wallet size={20} />, color: 'var(--primary)' },
           { label: 'Benefits Contribution', value: `$${benefitsContribution.toLocaleString()}`, change: 'Fixed Institutional Rate', icon: <HeartPulse size={20} />, color: '#10B981' },
           { label: 'Outstanding Payments', value: `$${totalPending.toLocaleString()}`, change: `${pendingCount} staff members`, icon: <AlertCircle size={20} />, color: '#F59E0B' },
           { label: 'Tax Reserves', value: `$${taxReserves.toLocaleString()}`, change: 'Quarterly compliance', icon: <ShieldCheck size={20} />, color: '#6366F1' }
         ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: `${stat.color}15`, color: stat.color }}>{stat.icon}</div>
               </div>
               <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{stat.label}</div>
               <div style={{ fontSize: '1.75rem', fontWeight: 950, marginBottom: '4px' }}>{stat.value}</div>
               <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>{stat.change}</div>
            </div>
         ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px', marginBottom: '32px' }}>
         <div className="card" style={{ padding: '0', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ padding: '24px 32px', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: 950, margin: 0 }}>Monthly Salary Disbursement</h3>
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                     <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                     <input 
                        type="text" 
                        placeholder="Search staff..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: '8px 12px 8px 36px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontSize: '0.85rem' }} 
                     />
                  </div>
                  <div style={{ position: 'relative' }}>
                     <button 
                        onClick={() => setShowFilterPopover(!showFilterPopover)}
                        className="btn" 
                        style={{ border: '1px solid var(--border-color)', backgroundColor: showFilterPopover ? 'var(--primary-light)' : 'var(--bg-body)', color: showFilterPopover ? 'var(--primary)' : 'var(--text-main)', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                     >
                        <Filter size={14} /> FILTER
                        {(statusFilter !== 'All' || deptFilter !== 'All') && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>}
                     </button>
                     
                     <AnimatePresence>
                        {showFilterPopover && (
                           <motion.div 
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 8 }}
                              style={{ position: 'absolute', top: '110%', right: 0, zIndex: 100, width: '220px', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}
                           >
                              <div>
                                 <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Status</label>
                                 <select 
                                    value={statusFilter} 
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 700 }}
                                 >
                                    <option value="All">All Statuses</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Pending">Pending</option>
                                 </select>
                              </div>
                              <div>
                                 <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Department</label>
                                 <select 
                                    value={deptFilter} 
                                    onChange={(e) => setDeptFilter(e.target.value)}
                                    style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 700 }}
                                 >
                                    {departments.map(d => (
                                       <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
                                    ))}
                                 </select>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                 <button 
                                    onClick={() => {
                                       setStatusFilter('All');
                                       setDeptFilter('All');
                                       setShowFilterPopover(false);
                                    }}
                                    style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 850, cursor: 'pointer' }}
                                 >
                                    Reset
                                 </button>
                                 <button 
                                    onClick={() => setShowFilterPopover(false)}
                                    style={{ border: 'none', backgroundColor: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 850, cursor: 'pointer' }}
                                 >
                                    Apply
                                 </button>
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                  <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-card)' }}>
                     <th style={{ padding: '16px 32px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>PAY ID</th>
                     <th style={{ padding: '16px 32px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>STAFF MEMBER</th>
                     <th style={{ padding: '16px 32px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>NET SALARY</th>
                     <th style={{ padding: '16px 32px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>STATUS</th>
                     <th style={{ padding: '16px 32px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'right' }}>ACTION</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredPayrolls.length > 0 ? (
                     filteredPayrolls.map((pay, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', transition: '0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                           <td style={{ padding: '20px 32px', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.8rem' }}>{pay.id}</td>
                           <td style={{ padding: '20px 32px' }}>
                              <div style={{ fontWeight: 800 }}>{pay.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{pay.role}</div>
                           </td>
                           <td style={{ padding: '20px 32px', fontWeight: 950, color: 'var(--primary)' }}>{pay.salary}</td>
                           <td style={{ padding: '20px 32px' }}>
                              <span style={{ 
                                 padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 900,
                                 backgroundColor: pay.status === 'Paid' ? '#10B98115' : '#EF444415',
                                 color: pay.status === 'Paid' ? '#10B981' : '#EF4444'
                              }}>{pay.status.toUpperCase()}</span>
                           </td>
                           <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                              <button 
                                 onClick={() => handleDownloadPayslip(pay)}
                                 className="icon-btn" 
                                 style={{ backgroundColor: 'var(--bg-body)', cursor: 'pointer' }} 
                                 title="Download Payslip"
                              >
                                 <Download size={16} />
                              </button>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                           No payroll records match your criteria.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '28px', border: '1px solid var(--border-color)' }}>
               <h3 style={{ fontSize: '1rem', fontWeight: 950, marginBottom: '20px' }}>Benefit Programs</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {benefits.map((benefit, idx) => (
                     <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: benefit.active ? 1 : 0.5 }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: benefit.color }}></div>
                        <div style={{ flex: 1, fontWeight: 700, fontSize: '0.85rem' }}>{benefit.label}</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-muted)' }}>{benefit.val}</div>
                     </div>
                  ))}
               </div>
               <button 
                  onClick={() => setShowBenefitsModal(true)}
                  className="btn" 
                  style={{ width: '100%', marginTop: '24px', padding: '12px', border: '1px solid var(--border-color)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
               >
                  MANAGE POLICIES
               </button>
            </div>

            <div className="card" style={{ padding: '28px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)' }}>
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                  <PieChart size={20} className="text-primary" />
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 950 }}>Distribution</h4>
               </div>
               <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden', display: 'flex', marginBottom: '12px' }}>
                  <div style={{ width: '65%', backgroundColor: 'var(--primary)' }}></div>
                  <div style={{ width: '25%', backgroundColor: '#10B981' }}></div>
                  <div style={{ width: '10%', backgroundColor: '#F59E0B' }}></div>
               </div>
               <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                     <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--primary)' }}></div> ACADEMIC
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                     <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#10B981' }}></div> ADMIN
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                     <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#F59E0B' }}></div> TECH
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 3. BENEFIT POLICIES MANAGEMENT MODAL */}
      <AnimatePresence>
         {showBenefitsModal && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1100, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  style={{ width: '100%', maxWidth: '640px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-color)', padding: '32px', boxShadow: 'var(--shadow-2xl)', position: 'relative', color: 'var(--text-main)' }}
               >
                  <button 
                     onClick={() => {
                        setShowBenefitsModal(false);
                        setEditingBenefit(null);
                     }}
                     style={{ position: 'absolute', top: '24px', right: '24px', border: 'none', background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                     <X size={20} />
                  </button>
                  
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '8px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><HeartPulse size={22} color="#10B981" /> Institutional Benefits Manager</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Configure medical, life insurance, retirement brackets, and custom payroll incentives.</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', minHeight: '320px' }}>
                     {/* Left: benefits program list with toggles */}
                     <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Schemes</span>
                        {benefits.map((b, i) => (
                           <div 
                              key={i} 
                              onClick={() => setEditingBenefit(b)}
                              style={{ 
                                 display: 'flex', flexDirection: 'column', padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                                 backgroundColor: editingBenefit?.label === b.label ? 'var(--primary-light)' : 'var(--bg-body)',
                                 border: '1px solid ' + (editingBenefit?.label === b.label ? 'var(--primary)' : 'transparent'),
                                 transition: '0.15s'
                              }}
                           >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: b.color }}></div>
                                 <span style={{ fontWeight: 800, fontSize: '0.8rem', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.label}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                                 <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{b.val}</span>
                                 <span style={{ color: b.active ? '#10B981' : '#EF4444', fontWeight: 900 }}>{b.active ? 'ACTIVE' : 'SUSPENDED'}</span>
                              </div>
                           </div>
                        ))}
                        <button 
                           onClick={() => setEditingBenefit({ label: '', val: '', color: '#10B981', details: '', active: true, isNew: true })}
                           style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px dashed var(--border-color)', background: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', marginTop: '10px' }}
                        >
                           + Add Custom Scheme
                        </button>
                     </div>

                     {/* Right: details pane or add new scheme */}
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {editingBenefit ? (
                           <form onSubmit={(e) => {
                              e.preventDefault();
                              let updated = [];
                              if (editingBenefit.isNew) {
                                 if (!editingBenefit.label.trim()) return;
                                 updated = [...benefits, { ...editingBenefit, isNew: undefined }];
                              } else {
                                 updated = benefits.map(b => b.label === editingBenefit.label ? editingBenefit : b);
                              }
                              setBenefits(updated);
                              localStorage.setItem('benefit_programs', JSON.stringify(updated));
                              setEditingBenefit(null);
                              showToast('Benefits program configuration synced successfully.', 'success', 'Config Saved');
                           }} style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
                              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                 {editingBenefit.isNew ? 'New Custom Scheme' : 'Edit Configuration'}
                              </span>
                              <div>
                                 <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '4px' }}>SCHEME NAME</label>
                                 <input 
                                    type="text" 
                                    required
                                    disabled={!editingBenefit.isNew}
                                    value={editingBenefit.label}
                                    onChange={(e) => setEditingBenefit({ ...editingBenefit, label: e.target.value })}
                                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 700 }}
                                 />
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '10px' }}>
                                 <div>
                                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '4px' }}>COVERAGE STATUS / TEXT</label>
                                    <input 
                                       type="text" 
                                       required
                                       value={editingBenefit.val}
                                       placeholder="e.g. 95% Active"
                                       onChange={(e) => setEditingBenefit({ ...editingBenefit, val: e.target.value })}
                                       style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 700 }}
                                    />
                                 </div>
                                 <div>
                                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '4px' }}>COLOR</label>
                                    <select 
                                       value={editingBenefit.color}
                                       onChange={(e) => setEditingBenefit({ ...editingBenefit, color: e.target.value })}
                                       style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 700 }}
                                    >
                                       <option value="#10B981">Green</option>
                                       <option value="#6366F1">Blue</option>
                                       <option value="#F59E0B">Yellow</option>
                                       <option value="#EF4444">Red</option>
                                       <option value="#8B5CF6">Purple</option>
                                    </select>
                                 </div>
                              </div>
                              <div>
                                 <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '4px' }}>SCHEME DESCRIPTION & COVERAGE DETAIL</label>
                                 <textarea 
                                    rows="3"
                                    required
                                    value={editingBenefit.details}
                                    onChange={(e) => setEditingBenefit({ ...editingBenefit, details: e.target.value })}
                                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 600, outline: 'none', resize: 'none' }}
                                 />
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                 <input 
                                    type="checkbox" 
                                    id="benefit-active-toggle"
                                    checked={editingBenefit.active}
                                    onChange={(e) => setEditingBenefit({ ...editingBenefit, active: e.target.checked })}
                                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                                 />
                                 <label htmlFor="benefit-active-toggle" style={{ fontSize: '0.75rem', fontWeight: 800 }}>Enable Institutional Enrollment</label>
                              </div>
                              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                 {!editingBenefit.isNew && (
                                    <button 
                                       type="button"
                                       onClick={() => {
                                          const updated = benefits.filter(b => b.label !== editingBenefit.label);
                                          setBenefits(updated);
                                          localStorage.setItem('benefit_programs', JSON.stringify(updated));
                                          setEditingBenefit(null);
                                          showToast('Benefits program deleted.', 'success', 'Scheme Removed');
                                       }}
                                       style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ef4444', backgroundColor: 'transparent', color: '#ef4444', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                                    >
                                       Delete
                                    </button>
                                 )}
                                 <button 
                                    type="submit"
                                    style={{ flex: 1, padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 900, fontSize: '0.75rem', cursor: 'pointer' }}
                                 >
                                    Save Scheme Configuration
                                 </button>
                              </div>
                           </form>
                        ) : (
                           <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                              <HeartPulse size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                              <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>Select a Benefit Program</span>
                              <span style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '4px' }}>Click on any program on the left to edit rates, descriptions, or status brackets.</span>
                           </div>
                        )}
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
      <ToastRenderer toast={toast} onClose={hideToast} />
    </>
  );
};

export default Payroll;
