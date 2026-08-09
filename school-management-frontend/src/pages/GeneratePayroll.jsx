import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Building, Users, Settings2, Calculator, Save, FileText, CheckCircle2, ChevronRight, AlertCircle, DollarSign, Download, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast, ToastRenderer } from '../hooks/useToast';

const GeneratePayroll = () => {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedMonth, setSelectedMonth] = useState('May 2026');

  // Load staff payrolls from localStorage
  const [payrollList, setPayrollList] = useState(() => {
    const stored = localStorage.getItem('staff_payrolls_v2');
    if (stored) {
      return JSON.parse(stored);
    } else {
      const initial = [
        { id: 'PAY-2026-05-01', name: 'Dr. Rajesh Malhotra', role: 'Professor', salary: '$7,083', status: 'Paid', date: '01 May 2026', method: 'Direct Deposit', dept: 'Mathematics' },
        { id: 'PAY-2026-05-02', name: 'Sunita Rao', role: 'Admin', salary: '$4,500', status: 'Paid', date: '01 May 2026', method: 'Bank Transfer', dept: 'Administration' },
        { id: 'PAY-2026-05-03', name: 'Amit Bose', role: 'IT Lead', salary: '$5,200', status: 'Pending', date: '--', method: 'Institutional Bank', dept: 'Technical' },
        { id: 'PAY-2026-05-04', name: 'Priya Patel', role: 'Counselor', salary: '$3,800', status: 'Paid', date: '01 May 2026', method: 'Direct Deposit', dept: 'Student Welfare' },
      ];
      localStorage.setItem('staff_payrolls_v2', JSON.stringify(initial));
      return initial;
    }
  });

  // Checkbox parameters for dynamic calculations
  const [includeBasic, setIncludeBasic] = useState(true);
  const [applyTax, setApplyTax] = useState(true);
  const [addBonuses, setAddBonuses] = useState(false);
  const [autoEmail, setAutoEmail] = useState(true);

  // Success view overlay state
  const [isSuccess, setIsSuccess] = useState(false);

  // Mapping function to calculate dynamic compensation
  const mapPayrollPreview = (p) => {
    const origSalaryVal = parseInt(p.salary.replace(/[^0-9]/g, '') || 5000);
    
    // Base salary depends on Include Basic checkbox and Add Bonuses checkbox
    const base = (includeBasic ? origSalaryVal : 0) + (addBonuses ? 500 : 0);
    
    // Deductions depend on Apply Tax checkbox (11.7% tax + 150 standard benefit premium if base salary > 0)
    const deductions = (applyTax ? Math.round(base * 0.117) : 0) + (base > 0 ? 150 : 0);
    
    const net = base - deductions;
    const status = p.status === 'Paid' ? 'Processed' : 'Ready';
    
    return {
      ...p,
      base,
      deductions,
      net,
      status
    };
  };

  // Department filter matcher
  const filteredPreviews = payrollList
    .filter(p => {
      if (selectedDept === 'All Departments') return true;
      if (selectedDept === 'Academic Staff') return p.role === 'Professor' || p.dept === 'Mathematics' || p.dept === 'Physics' || p.dept === 'Computer Science';
      if (selectedDept === 'Administration') return p.role === 'Admin' || p.dept === 'Administration';
      if (selectedDept === 'Technical & IT') return p.role === 'IT Lead' || p.dept === 'Technical';
      return true;
    })
    .map(mapPayrollPreview);

  // Summary counts
  const totalEmployees = filteredPreviews.length;
  const totalGross = filteredPreviews.reduce((sum, e) => sum + e.base, 0);
  const totalDeductions = filteredPreviews.reduce((sum, e) => sum + e.deductions, 0);
  const totalNet = totalGross - totalDeductions;

  // Recalculation simulation alert
  const handleRecalculate = () => {
    showToast("Recalculating ledger previews with active parameters...", "info", "Recalculating");
  };

  // Process and save payroll execution
  const handleExecutePayroll = () => {
    if (totalEmployees === 0) {
      showToast("No staff members to process in selected parameters.", "error", "No Staff Processed");
      return;
    }

    const updatedPayrolls = payrollList.map(p => {
      // Determine if employee falls inside active target department
      const isTargetDept = 
        selectedDept === 'All Departments' ||
        (selectedDept === 'Academic Staff' && (p.role === 'Professor' || p.dept === 'Mathematics' || p.dept === 'Physics' || p.dept === 'Computer Science')) ||
        (selectedDept === 'Administration' && (p.role === 'Admin' || p.dept === 'Administration')) ||
        (selectedDept === 'Technical & IT' && (p.role === 'IT Lead' || p.dept === 'Technical'));
      
      if (isTargetDept && p.status === 'Pending') {
        const preview = mapPayrollPreview(p);
        return {
          ...p,
          status: 'Paid',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          salary: `$${preview.net.toLocaleString()}` // Lock in net payout
        };
      }
      return p;
    });

    localStorage.setItem('staff_payrolls_v2', JSON.stringify(updatedPayrolls));
    setIsSuccess(true);
    setTimeout(() => {
      navigate('/dashboard/payroll');
    }, 3000);
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Generate Payroll</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Automate salary calculations, apply institutional deductions, and process monthly disbursements.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
         {/* Main Form Area */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="card" style={{ padding: '32px', border: '1px solid var(--border-color)' }}>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Settings2 size={24} className="text-primary" /> Payroll Configuration
               </h3>
               
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                  <div>
                     <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Payroll Cycle (Month/Year)</label>
                     <div style={{ position: 'relative' }}>
                        <Calendar size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <select 
                           value={selectedMonth} 
                           onChange={(e) => setSelectedMonth(e.target.value)}
                           style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 800, appearance: 'none', cursor: 'pointer' }}
                        >
                           <option>May 2026</option>
                           <option>April 2026</option>
                           <option>March 2026</option>
                        </select>
                     </div>
                  </div>
                  <div>
                     <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Target Department</label>
                     <div style={{ position: 'relative' }}>
                        <Building size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <select 
                           value={selectedDept} 
                           onChange={(e) => setSelectedDept(e.target.value)}
                           style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 800, appearance: 'none', cursor: 'pointer' }}
                        >
                           <option>All Departments</option>
                           <option>Academic Staff</option>
                           <option>Administration</option>
                           <option>Technical & IT</option>
                        </select>
                     </div>
                  </div>
               </div>

               <div style={{ padding: '20px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-main)', textTransform: 'uppercase' }}>Calculation Parameters</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                     <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input 
                           type="checkbox" 
                           checked={includeBasic} 
                           onChange={(e) => setIncludeBasic(e.target.checked)}
                           style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }} 
                        />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Include Basic Salary</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input 
                           type="checkbox" 
                           checked={applyTax} 
                           onChange={(e) => setApplyTax(e.target.checked)}
                           style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }} 
                        />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Apply Standard Tax Deductions</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input 
                           type="checkbox" 
                           checked={addBonuses} 
                           onChange={(e) => setAddBonuses(e.target.checked)}
                           style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }} 
                        />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Add Performance Bonuses</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input 
                           type="checkbox" 
                           checked={autoEmail} 
                           onChange={(e) => setAutoEmail(e.target.checked)}
                           style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }} 
                        />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Auto-Email Payslips</span>
                      </label>
                  </div>
               </div>
            </div>

            {/* Preview Table */}
            <div className="card" style={{ padding: '0', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
               <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                     <h3 style={{ fontSize: '1.1rem', fontWeight: 950, margin: 0 }}>Processing Preview</h3>
                     <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Review calculated amounts before final generation.</p>
                  </div>
                  <button 
                     onClick={handleRecalculate}
                     className="btn" 
                     style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                     <Calculator size={14} /> RECALCULATE
                  </button>
               </div>
               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                     <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-body)' }}>
                        <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>EMPLOYEE</th>
                        <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'right' }}>BASE</th>
                        <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'right' }}>DEDUCTIONS</th>
                        <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textAlign: 'right' }}>NET PAY</th>
                        <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'center' }}>STATUS</th>
                     </tr>
                  </thead>
                  <tbody>
                     {filteredPreviews.length > 0 ? (
                        filteredPreviews.map((emp, i) => (
                           <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '16px 24px' }}>
                                 <div style={{ fontWeight: 800 }}>{emp.name}</div>
                                 <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{emp.id} • {emp.role}</div>
                              </td>
                              <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 700 }}>${emp.base.toLocaleString()}</td>
                              <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 700, color: '#EF4444' }}>-${emp.deductions.toLocaleString()}</td>
                              <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 950, color: 'var(--primary)', fontSize: '1.1rem' }}>${emp.net.toLocaleString()}</td>
                              <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                 {emp.status === 'Ready' ? (
                                    <CheckCircle2 size={18} color="#10B981" style={{ margin: '0 auto' }} />
                                 ) : (
                                    <CheckCircle2 size={18} color="#10B981" style={{ margin: '0 auto', opacity: 0.5 }} />
                                 )}
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                              No staff records match target department.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Right Sidebar: Summary & Action */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '32px', border: '1px solid var(--border-color)', backgroundColor: 'var(--primary)', color: 'white' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '24px', opacity: 0.9 }}>Disbursement Summary</h3>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ fontSize: '0.85rem', fontWeight: 700, opacity: 0.8 }}>Employees Processed</span>
                     <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>{totalEmployees}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ fontSize: '0.85rem', fontWeight: 700, opacity: 0.8 }}>Total Gross Pay</span>
                     <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>${totalGross.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ fontSize: '0.85rem', fontWeight: 700, opacity: 0.8 }}>Total Deductions</span>
                     <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FDA4AF' }}>-${totalDeductions.toLocaleString()}</span>
                  </div>
                  <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                     <span style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Net Payout</span>
                     <span style={{ fontSize: '2rem', fontWeight: 950 }}>${totalNet.toLocaleString()}</span>
                  </div>
               </div>

               <button 
                  onClick={handleExecutePayroll}
                  className="btn" 
                  style={{ width: '100%', padding: '16px', borderRadius: '12px', backgroundColor: 'white', color: 'var(--primary)', fontWeight: 950, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', cursor: 'pointer' }}
               >
                  <Play size={20} fill="currentColor" /> EXECUTE PAYROLL
               </button>
               <p style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, opacity: 0.7, marginTop: '16px', marginBottom: 0 }}>This action will finalize the ledger and queue bank transfers if configured.</p>
            </div>

            <div className="card" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
               <h4 style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>Validation Checks</h4>
               <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                     <CheckCircle2 size={16} color="#10B981" style={{ marginTop: '2px', flexShrink: 0 }} />
                     <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: '1.4' }}>All attendance records verified and synced.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                     <CheckCircle2 size={16} color="#10B981" style={{ marginTop: '2px', flexShrink: 0 }} />
                     <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: '1.4' }}>Leave deductions calculated accurately.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                     <CheckCircle2 size={16} color="#10B981" style={{ marginTop: '2px', flexShrink: 0 }} />
                     <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: '1.4' }}>All banking details validated securely.</span>
                  </li>
               </ul>
            </div>
         </div>
      </div>

      {/* Success View Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.95)', 
              backdropFilter: 'blur(20px)', zIndex: 1200, display: 'flex', 
              alignItems: 'center', justifyContent: 'center', textAlign: 'center' 
            }}
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ maxWidth: '480px', padding: '40px' }}>
              <div style={{ width: '100px', height: '100px', backgroundColor: '#10b981', color: 'white', borderRadius: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)' }}>
                <CheckCircle2 size={50} />
              </div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 950, color: 'white', marginBottom: '16px', letterSpacing: '-1px' }}>Payroll Executed!</h2>
              <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '32px', fontWeight: 500 }}>
                Processed salary disbursements for <span style={{ color: 'white', fontWeight: 900 }}>{totalEmployees} staff members</span> matching the {selectedDept} filter.
              </p>
              <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3 }} style={{ height: '100%', backgroundColor: '#10b981' }} />
              </div>
              <p style={{ marginTop: '16px', fontSize: '0.75rem', fontWeight: 800, color: '#6366f1', letterSpacing: '2px' }}>REDIRECTING TO DISBURSEMENT LEDGER</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastRenderer toast={toast} onClose={hideToast} />
    </div>
  );
};

export default GeneratePayroll;
