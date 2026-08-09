/* EduPro Elite - Ultra-Premium Financial Reports Hub v3.0 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, Download, Filter, Search, 
  ChevronRight, BarChart3, TrendingUp, DollarSign,
  PieChart, FileText, Share2, Calculator, X, 
  Activity, CheckCircle2, ShieldCheck, AlertCircle, Fingerprint, Terminal 
} from 'lucide-react';

const FinancialReports = () => {
  // --- STATE SYSTEM ---
  const [selectedType, setSelectedType] = useState('all');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [showToast, setShowToast] = useState(null);
  
  // Dynamic stats
  const [stats, setStats] = useState({
    revenueYTD: 2420000,
    collectionRate: 94.2,
    outstandingArrears: 5,
    operationalBurn: 62500
  });

  // Outstanding Arrears Triage dataset
  const [arrearsItems, setArrearsItems] = useState([
    { id: 1, name: 'Nikhil Sharma', grade: 'Grade 12-A', amount: 1200, type: 'Tuition Arrears', outreachActive: false, status: 'Unpaid' },
    { id: 2, name: 'Kiran Sharma', grade: 'Grade 10-C', amount: 450, type: 'Science Lab Dues', outreachActive: false, status: 'Unpaid' },
    { id: 3, name: 'Manish Verma', grade: 'Grade 11-B', amount: 320, type: 'Transport Fee', outreachActive: false, status: 'Unpaid' },
    { id: 4, name: 'Ekta Rawat', grade: 'Grade 9-A', amount: 600, type: 'Tuition Arrears', outreachActive: false, status: 'Unpaid' },
    { id: 5, name: 'Tejas Deshmukh', grade: 'Grade 12-B', amount: 850, type: 'Mess Subscription', outreachActive: false, status: 'Unpaid' }
  ]);

  const [triageOpen, setTriageOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [forecastingSlider, setForecastingSlider] = useState(15); // Tax Exemptions / marginal tax %
  const [growthRateSlider, setGrowthRateSlider] = useState(8); // Expected Growth %
  const [scannerProgress, setScannerProgress] = useState(null);
  const [showScanCert, setShowScanCert] = useState(false);

  // Custom Audit Sweep States
  const [auditOpen, setAuditOpen] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditStatus, setAuditStatus] = useState('idle');

  // Templates list
  const financialTemplates = [
    { title: 'Annual Revenue & Expense Audit', type: 'Fiscal', lastGen: '2 days ago' },
    { title: 'Fee Collection Reconciliation', type: 'Accounts', lastGen: '5 days ago' },
    { title: 'Staff Payroll Disbursement', type: 'HR Finance', lastGen: '1 week ago' },
    { title: 'Inventory Procurement Audit', type: 'Asset Finance', lastGen: '10 days ago' },
    { title: 'Outstanding Arrears Analysis', type: 'Collections', lastGen: '12 days ago' },
    { title: 'Institutional Liquidity Forecast', type: 'Predictive', lastGen: '2 weeks ago' },
  ];

  // Click outside to dismiss filter dropdown
  useEffect(() => {
    const dismissFilters = () => setFilterDropdownOpen(false);
    window.addEventListener('click', dismissFilters);
    return () => window.removeEventListener('click', dismissFilters);
  }, []);

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  // --- ACTIONS & EXPORTERS ---

  // 1. Dynamic template type filtering
  const handleTypeSelect = (type) => {
    setSelectedType(type);
    triggerToast(`Filter Adjusted to: ${type.toUpperCase()}`);
  };

  const filteredTemplates = selectedType === 'all' 
    ? financialTemplates 
    : financialTemplates.filter(t => t.type.toLowerCase().includes(selectedType.toLowerCase()));

  // 2. Individual CSV Compiler
  const handleDownloadCSV = (template) => {
    let headers = [];
    let rows = [];
    
    if (template.title === 'Annual Revenue & Expense Audit') {
      headers = ['Audit ID', 'Category', 'Description', 'Amount', 'Credit_Debit', 'Status', 'Verified_Date'];
      rows = [
        ['AUD-2026-001', 'Tuition', 'Q1 Tuition Collection', '850000', 'Credit', 'COMPLETED', '2026-04-15'],
        ['AUD-2026-002', 'Operations', 'HVAC System Maintenance', '24500', 'Debit', 'COMPLETED', '2026-04-18'],
        ['AUD-2026-003', 'Payroll', 'April Staff Salaries', '180000', 'Debit', 'COMPLETED', '2026-04-30'],
        ['AUD-2026-004', 'Procurement', 'Science Lab Supplies', '12300', 'Debit', 'COMPLETED', '2026-05-02'],
        ['AUD-2026-005', 'Grants', 'Federal STEM Initiative Grant', '150000', 'Credit', 'COMPLETED', '2026-05-10'],
        ['AUD-2026-006', 'Operations', 'Campus Electricity Bill', '8900', 'Debit', 'COMPLETED', '2026-05-12']
      ];
    } else if (template.title === 'Fee Collection Reconciliation') {
      headers = ['Receipt ID', 'Student ID', 'Full Name', 'Term', 'Amount Paid', 'Payment Method', 'Reconciliation'];
      rows = [
        ['REC-9821', 'STU-2024-089', 'Lakshya Verma', 'Spring 2026', '4200', 'Credit Card', 'RECONCILED'],
        ['REC-9822', 'STU-2025-112', 'Isha Sen', 'Spring 2026', '4200', 'ACH Transfer', 'RECONCILED'],
        ['REC-9823', 'STU-2024-301', 'Nikhil Sharma', 'Spring 2026', '3000', 'Check', 'PENDING_MATCH'],
        ['REC-9824', 'STU-2026-004', 'Sonal Mishra', 'Spring 2026', '4200', 'Credit Card', 'RECONCILED'],
        ['REC-9825', 'STU-2025-241', 'Lalit Bose', 'Spring 2026', '2100', 'Cash', 'RECONCILED']
      ];
    } else if (template.title === 'Staff Payroll Disbursement') {
      headers = ['Disbursement ID', 'Staff ID', 'Name', 'Department', 'Base Salary', 'Tax Deductions', 'Net Paid'];
      rows = [
        ['PAY-0526-01', 'TCH-004', 'Dr. Sunita Rao', 'Science', '6500', '975', '5525'],
        ['PAY-0526-02', 'TCH-012', 'Dr. Rajesh Malhotra', 'Mathematics', '5800', '870', '4930'],
        ['PAY-0526-03', 'TCH-044', 'Ananya Iyer', 'Languages', '4900', '735', '4165'],
        ['PAY-0526-04', 'ADM-002', 'Amit Bose', 'Administration', '7200', '1080', '6120'],
        ['PAY-0526-05', 'ADM-019', 'Meeta Devi', 'Finance', '5400', '810', '4590']
      ];
    } else if (template.title === 'Inventory Procurement Audit') {
      headers = ['Asset ID', 'Item Description', 'Vendor', 'Qty Purchased', 'Unit Cost', 'Total Cost', 'Status'];
      rows = [
        ['PRC-901', 'Dell OptiPlex Computers', 'Dell Direct', '30', '850', '25500', 'DELIVERED'],
        ['PRC-902', 'Ergonomic Desk Chairs', 'Office Depot', '60', '120', '7200', 'DELIVERED'],
        ['PRC-903', 'Interactive Smartboard v4', 'Promethean', '5', '3200', '16000', 'SHIPPED'],
        ['PRC-904', 'Fiber Optic Cable Reels', 'Belden Corp', '4', '650', '2600', 'DELIVERED'],
        ['PRC-905', 'Biology Lab Microscope Kits', 'Fisher Scientific', '12', '420', '5040', 'IN_TRANSIT']
      ];
    } else if (template.title === 'Outstanding Arrears Analysis') {
      headers = ['Invoice ID', 'Student Name', 'Grade', 'Outstanding Amount', 'Due Date', 'Outreach Level'];
      rows = arrearsItems.map((item, idx) => [
        `INV-80${idx + 1}`,
        item.name,
        item.grade,
        item.amount.toString(),
        '2026-05-15',
        item.amount > 800 ? 'Critical' : 'Moderate'
      ]);
    } else {
      headers = ['Forecast Metric', 'Current Value', 'Conservative Growth (5%)', 'Optimistic Growth (15%)', 'Variance Margin'];
      rows = [
        ['Tuition Inflow', '4200000', '4410000', '4830000', '+10%'],
        ['Operational Burn', '750000', '787500', '862500', '+5%'],
        ['Capital Reserves', '1500000', '1575000', '1725000', '+15%'],
        ['Net Margin Surplus', '3450000', '3622500', '3967500', '+12.5%']
      ];
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const formattedFilename = template.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-report.csv';
    link.setAttribute("download", formattedFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`CSV Compiled: ${formattedFilename}`);
  };

  // 3. Global Database JSON Exporter
  const handleExportAuditLog = () => {
    const fullAuditDatabase = {
      institution: 'EduPro Elite Academics',
      timestamp: new Date().toISOString(),
      integrityHash: 'SHA-256:8f4c27a92de8d2f5c276189e0231aa27d2c140a37912a2',
      statisticsYTD: {
        revenueTotal: stats.revenueYTD,
        feeCollectionRate: `${stats.collectionRate}%`,
        activeOperationalBurn: stats.operationalBurn,
        activeOutstandingArrearsCount: stats.outstandingArrears
      },
      arrearsLedger: arrearsItems,
      historicalTemplates: financialTemplates
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullAuditDatabase, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "edupro-institutional-fiscal-audit-log.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    triggerToast("Full JSON Ledger Exported Successfully");
  };

  // 4. Custom Audit Telemetry Sweep Simulation
  const executeAuditSweep = () => {
    setAuditOpen(true);
    setAuditStatus('running');
    setAuditProgress(0);
    setAuditLogs([]);

    const steps = [
      { p: 15, m: '[AUDIT] Initiating de-fragmentation of central operational ledger indices...' },
      { p: 35, m: '[AUDIT] Re-indexing tuition and fee payment receipts ledger... DONE' },
      { p: 55, m: '[AUDIT] Reconciling Q1-Q2 actual cash deposits against banking records... MATCHED' },
      { p: 75, m: '[AUDIT] Scanning asset procurement ledger keys... NO ANOMALIES FOUND' },
      { p: 90, m: '[CRYPT] Cryptographically signing central verification matrix... SECURE' },
      { p: 100, m: '[SUCCESS] Audit sweep completed. Fiscal integrity index verified: 0x8FA912F56C71D' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        setAuditProgress(step.p);
        setAuditLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${step.m}`]);
        currentStep++;
      } else {
        clearInterval(interval);
        setAuditStatus('completed');
        triggerToast('Audit Ledgers Reconciled');
      }
    }, 400);
  };

  const downloadAuditSweepKey = () => {
    const keyData = `--- BEGIN EDUPRO FISCAL SIGNATURE KEY ---\nTimestamp: ${new Date().toISOString()}\nVerification Key: 0x8FA912F56C71D\nIntegrity Status: VERIFIED SECURE\nLedgers Audited: SUCCESS\n--- END EDUPRO FISCAL SIGNATURE KEY ---`;
    const blob = new Blob([keyData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reconciled-fiscal-integrity-vault.key';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Integrity Key Downloaded");
  };

  // 5. Arrears Triage Dues Resolution
  const handleIssueOutreach = (id) => {
    setArrearsItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, outreachActive: true, status: 'Outreach Sent' };
      }
      return item;
    }));

    triggerToast("SMS & Email outreach alert dispatched to parents");

    setTimeout(() => {
      setArrearsItems(prev => prev.filter(item => {
        if (item.id === id) {
          setStats(s => ({ 
            ...s, 
            outstandingArrears: Math.max(0, s.outstandingArrears - 1),
            revenueYTD: s.revenueYTD + item.amount
          }));
          return false;
        }
        return true;
      }));
      triggerToast("Payment resolved via balance sweep!");
    }, 1500);
  };

  // 6. Tax / Liquidity Forecasting Drawer calculations
  const calculateProjections = () => {
    const growthAmount = stats.revenueYTD * (growthRateSlider / 100);
    const newTotal = stats.revenueYTD + growthAmount;
    const taxLiability = newTotal * (forecastingSlider / 100);
    const finalSurplus = newTotal - taxLiability;

    return {
      growthAmount: growthAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
      newTotal: newTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
      taxLiability: taxLiability.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
      finalSurplus: finalSurplus.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
    };
  };

  const runScannerDiagnostics = () => {
    setScannerProgress(0);
    setShowScanCert(false);
    
    let currentPct = 0;
    const scanner = setInterval(() => {
      currentPct += 10;
      setScannerProgress(currentPct);
      if (currentPct >= 100) {
        clearInterval(scanner);
        setScannerProgress(100);
        setShowScanCert(true);
        triggerToast("Fiscal Compliance Verification Complete");
      }
    }, 150);
  };

  const downloadComplianceCert = () => {
    const certText = `EDUPRO ACADEMIC COMPLIANCE VERIFICATION\n=======================================\nApproved Date: ${new Date().toLocaleDateString()}\nProjected Growth Rate: ${growthRateSlider}%\nMarginal Fiscal Reservation Rate: ${forecastingSlider}%\nVerified Financial Integrity Certificate: FCC-${Math.floor(100000 + Math.random() * 900000)}\nApproved By: Board of Fiscal Auditors & Compliance Registry\n`;
    const element = document.createElement("a");
    const file = new Blob([certText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `tax-compliance-verification-cert.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const projections = calculateProjections();

  return (
    <div style={{ padding: '32px', backgroundColor: 'var(--bg-body, #f8fafc)', minHeight: '100vh', transition: 'background-color 0.3s' }}>
      
      {/* --- FLOATING TOAST SYSTEM --- */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{ 
              position: 'fixed', 
              bottom: '40px', 
              right: '40px', 
              backgroundColor: 'var(--text-main, #0f172a)', 
              color: 'var(--bg-card, #ffffff)', 
              padding: '16px 24px', 
              borderRadius: '16px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontWeight: 800,
              fontSize: '0.9rem',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <Activity size={18} className="animate-pulse" style={{ color: '#10b981' }} />
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- DASHBOARD HEADER --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#10b98115', borderRadius: '30px', color: '#10b981', fontWeight: 800, fontSize: '0.85rem', marginBottom: '16px' }}>
            <Landmark size={16} /> FINANCIAL AUDIT HUB
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--text-main, #0f172a)', letterSpacing: '-2px', lineHeight: 1, marginBottom: '8px' }}>
            Financial <span style={{ color: '#10b981' }}>Reports</span>
          </h1>
          <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '1.1rem', fontWeight: 500 }}>
            Comprehensive fiscal auditing and predictive financial reports.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedTemplate({ title: 'Tax & Projections Forecast' });
              runScannerDiagnostics();
            }}
            style={{ 
              padding: '16px 32px', 
              borderRadius: '18px', 
              border: '1px solid var(--border-color, #e2e8f0)', 
              backgroundColor: 'var(--bg-card, #ffffff)', 
              color: 'var(--text-main, #0f172a)', 
              fontWeight: 800, 
              fontSize: '0.9rem', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Calculator size={18} style={{ color: '#10b981' }} /> Tax Calculator
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportAuditLog}
            style={{ 
              padding: '16px 32px', 
              borderRadius: '18px', 
              border: 'none', 
              backgroundColor: 'var(--text-main, #0f172a)', 
              color: 'var(--bg-card, #ffffff)', 
              fontWeight: 900, 
              fontSize: '0.9rem', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
            }}
          >
            <Download size={18} style={{ color: '#10b981' }} /> Export Audit Log
          </motion.button>
        </div>
      </div>

      {/* --- STATISTICS CARDS GRID --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '32px' }}>
        
        {/* Card 1: Total Revenue */}
        <motion.div 
          whileHover={{ y: -5 }}
          style={{ 
            backgroundColor: 'var(--bg-card, #ffffff)', 
            padding: '32px', 
            borderRadius: '32px', 
            border: '1px solid var(--border-color, #f1f5f9)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer'
          }}
          onClick={() => triggerToast("Revenue sync updated - Ledger certified secure.")}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#10b98115', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={24} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} /> +8.4% YTD
            </span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-main, #0f172a)', letterSpacing: '-1px' }}>
            ${(stats.revenueYTD / 1000000).toFixed(2)}M
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Total Revenue YTD
          </div>
        </motion.div>

        {/* Card 2: Fee Collection Rate */}
        <motion.div 
          whileHover={{ y: -5 }}
          style={{ 
            backgroundColor: 'var(--bg-card, #ffffff)', 
            padding: '32px', 
            borderRadius: '32px', 
            border: '1px solid var(--border-color, #f1f5f9)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer'
          }}
          onClick={() => triggerToast(`Fee collection index is currently at ${stats.collectionRate}%`)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#6366f115', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PieChart size={24} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6366f1', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} /> +2.1%
            </span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-main, #0f172a)', letterSpacing: '-1px' }}>
            {stats.collectionRate}%
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Fee Collection Rate
          </div>
        </motion.div>

        {/* Card 3: Outstanding Arrears & Burn (TRIAGE TRIPPED CARD) */}
        <motion.div 
          whileHover={{ y: -5 }}
          style={{ 
            backgroundColor: 'var(--bg-card, #ffffff)', 
            padding: '32px', 
            borderRadius: '32px', 
            border: stats.outstandingArrears > 0 ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-color, #f1f5f9)',
            boxShadow: stats.outstandingArrears > 0 ? '0 10px 30px rgba(245, 158, 11, 0.08)' : 'var(--shadow-sm)',
            cursor: 'pointer',
            position: 'relative'
          }}
          onClick={() => setTriageOpen(true)}
        >
          {stats.outstandingArrears > 0 && (
            <span style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '20px', 
              display: 'flex', 
              height: '10px', 
              width: '10px',
              borderRadius: '50%',
              backgroundColor: '#f59e0b'
            }}>
              <span className="animate-ping" style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#f59e0b', opacity: 0.75 }} />
            </span>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#f59e0b15', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={24} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {stats.outstandingArrears} Arrears Triage
            </span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-main, #0f172a)', letterSpacing: '-1px' }}>
            ${(stats.operationalBurn / 1000).toFixed(1)}k
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Operational Burn <span style={{ color: '#f59e0b', fontWeight: 900 }}>• Arrears Warning</span>
          </div>
        </motion.div>

      </div>

      {/* --- TEMPLATE EXPLORER MAIN SECTION --- */}
      <div style={{ backgroundColor: 'var(--bg-card, #ffffff)', borderRadius: '32px', border: '1px solid var(--border-color, #f1f5f9)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        
        {/* Template Section Sub-Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color, #f1f5f9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main, #0f172a)', margin: 0 }}>Financial Templates</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted, #64748b)', fontWeight: 550 }}>Select catalogs to run live compliance forecasts or download CSV files.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
            {/* Filter Toggle Button */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setFilterDropdownOpen(!filterDropdownOpen);
              }}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: 'var(--bg-body, #f8fafc)', 
                borderRadius: '14px', 
                color: 'var(--text-muted, #64748b)', 
                fontSize: '0.85rem', 
                fontWeight: 750, 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid var(--border-color, #e2e8f0)',
                userSelect: 'none'
              }}
            >
              <Filter size={14} /> Filter: {selectedType.toUpperCase()}
            </div>

            {/* Filter Popover Dropdown */}
            <AnimatePresence>
              {filterDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{ 
                    position: 'absolute',
                    top: '50px',
                    right: 0,
                    backgroundColor: 'var(--bg-card, #ffffff)',
                    border: '1px solid var(--border-color, #e2e8f0)',
                    borderRadius: '16px',
                    width: '180px',
                    zIndex: 100,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    overflow: 'hidden'
                  }}
                >
                  {['all', 'Fiscal', 'Accounts', 'HR Finance', 'Asset Finance', 'Collections', 'Predictive'].map((t) => (
                    <div 
                      key={t}
                      onClick={() => handleTypeSelect(t)}
                      style={{ 
                        padding: '12px 18px', 
                        fontSize: '0.8rem', 
                        fontWeight: 650, 
                        color: selectedType === t ? '#10b981' : 'var(--text-main, #0f172a)',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--border-color, #f1f5f9)',
                        backgroundColor: selectedType === t ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                        transition: '0.2s'
                      }}
                      onMouseOver={(e) => {
                        if (selectedType !== t) e.currentTarget.style.backgroundColor = 'var(--bg-body, #f8fafc)';
                      }}
                      onMouseOut={(e) => {
                        if (selectedType !== t) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {t.toUpperCase()}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Custom Audit Trigger Button */}
            <div 
              onClick={executeAuditSweep}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#10b981', 
                borderRadius: '14px', 
                color: 'white', 
                fontSize: '0.85rem', 
                fontWeight: 800, 
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Fingerprint size={14} /> Custom Audit
            </div>
          </div>
        </div>

        {/* Templates Two-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '0' }}>
          {filteredTemplates.map((template, i) => (
            <motion.div 
              key={i} 
              style={{ 
                padding: '28px 32px', 
                borderBottom: '1px solid var(--border-color, #f1f5f9)', 
                borderRight: '1px solid var(--border-color, #f1f5f9)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                transition: '0.3s', 
                cursor: 'pointer' 
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(16,185,129,0.02)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: 'var(--bg-body, #f8fafc)', border: '1px solid var(--border-color, #f1f5f9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <BarChart3 size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-main, #0f172a)', fontSize: '0.95rem' }}>{template.title}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', marginTop: '2px' }}>
                    <span style={{ color: '#10b981', fontWeight: 850 }}>{template.type}</span> • Updated: {template.lastGen}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => {
                    setSelectedTemplate(template);
                    runScannerDiagnostics();
                  }}
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border-color, #e2e8f0)', 
                    backgroundColor: 'var(--bg-card, #ffffff)', 
                    color: 'var(--text-main, #0f172a)', 
                    fontWeight: 800, 
                    fontSize: '0.75rem', 
                    cursor: 'pointer' 
                  }}
                >
                  Live Preview
                </button>
                <button 
                  onClick={() => handleDownloadCSV(template)}
                  style={{ 
                    padding: '8px 12px', 
                    borderRadius: '8px', 
                    border: 'none', 
                    backgroundColor: '#10b981', 
                    color: 'white', 
                    fontWeight: 800, 
                    fontSize: '0.75rem', 
                    cursor: 'pointer' 
                  }}
                >
                  <Download size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- FORECASTING & TAX CALCULATOR DRAWER (SLIDE OUT FROM RIGHT) --- */}
      <AnimatePresence>
        {selectedTemplate && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTemplate(null)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'black', zIndex: 990 }}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                position: 'fixed', 
                top: 0, 
                right: 0, 
                bottom: 0, 
                width: '520px', 
                backgroundColor: 'var(--bg-card, #ffffff)', 
                zIndex: 1000, 
                boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
                padding: '40px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                borderLeft: '1px solid var(--border-color, #e2e8f0)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-main, #0f172a)', margin: 0, letterSpacing: '-0.5px' }}>
                  {selectedTemplate.title}
                </h3>
                <button 
                  onClick={() => setSelectedTemplate(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted, #64748b)' }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Slider 1: Expected Growth Rate */}
              <div style={{ marginBottom: '32px', backgroundColor: 'var(--bg-body, #f8fafc)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-color, #f1f5f9)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>Projected Growth Rate</label>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#10b981' }}>{growthRateSlider}%</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="25"
                  value={growthRateSlider}
                  onChange={(e) => setGrowthRateSlider(parseInt(e.target.value))}
                  style={{ 
                    width: '100%', 
                    accentColor: '#10b981', 
                    cursor: 'pointer',
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: 'var(--border-color, #e2e8f0)'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted, #64748b)', marginTop: '8px', fontWeight: 600 }}>
                  <span>1% Min</span>
                  <span>12.5% Target</span>
                  <span>25% Max</span>
                </div>
              </div>

              {/* Slider 2: Tax / Liquidity Rate */}
              <div style={{ marginBottom: '32px', backgroundColor: 'var(--bg-body, #f8fafc)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-color, #f1f5f9)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>Marginal Fiscal Reserve Rate</label>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#10b981' }}>{forecastingSlider}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="45"
                  value={forecastingSlider}
                  onChange={(e) => setForecastingSlider(parseInt(e.target.value))}
                  style={{ 
                    width: '100%', 
                    accentColor: '#10b981', 
                    cursor: 'pointer',
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: 'var(--border-color, #e2e8f0)'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted, #64748b)', marginTop: '8px', fontWeight: 600 }}>
                  <span>0% Exemption</span>
                  <span>22.5% Balanced</span>
                  <span>45% Conservative</span>
                </div>
              </div>

              {/* Live Calculations Output Panel */}
              <div style={{ backgroundColor: 'var(--bg-body, #f8fafc)', padding: '32px', borderRadius: '28px', border: '1px solid var(--border-color, #f1f5f9)', marginBottom: '32px' }}>
                <h4 style={{ margin: '0 0 20px 0', fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-main, #0f172a)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Live Growth Projections
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted, #64748b)' }}>Projected Growth Inflow:</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>{projections.growthAmount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted, #64748b)' }}>Gross Projected Revenue:</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>{projections.newTotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted, #64748b)' }}>Fiscal Reserve Liability:</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f59e0b' }}>{projections.taxLiability}</span>
                  </div>
                  <div style={{ height: '1px', backgroundColor: 'var(--border-color, #e2e8f0)', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>Net Operational Surplus:</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 950, color: '#10b981' }}>{projections.finalSurplus}</span>
                  </div>
                </div>
              </div>

              {/* Diagnostic Integrity Scan Container */}
              <div style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '24px', color: '#10b981', fontFamily: 'monospace', fontSize: '0.8rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Terminal size={14} />
                    <span>DIAGNOSTIC INTEGRITY SCAN</span>
                  </div>
                  <span>{scannerProgress !== null ? `${scannerProgress}%` : 'READY'}</span>
                </div>

                {scannerProgress !== null && scannerProgress < 100 && (
                  <div style={{ height: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${scannerProgress}%`, height: '100%', backgroundColor: '#10b981', transition: 'width 0.15s' }} />
                  </div>
                )}

                {scannerProgress === 100 && (
                  <div style={{ color: '#34d399', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                    <CheckCircle2 size={14} /> COMPLIANCE VERIFICATION SECURED
                  </div>
                )}

                {showScanCert && (
                  <motion.button 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={downloadComplianceCert}
                    style={{ 
                      marginTop: '16px', 
                      width: '100%', 
                      padding: '12px', 
                      borderRadius: '12px', 
                      backgroundColor: 'rgba(16, 185, 129, 0.15)', 
                      border: '1px solid rgba(16, 185, 129, 0.3)', 
                      color: '#10b981', 
                      fontWeight: 800, 
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontFamily: 'sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Download size={14} /> Download Compliance Cert
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- OUTSTANDING ARREARS TRIAGE DRAWER --- */}
      <AnimatePresence>
        {triageOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setTriageOpen(false)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'black', zIndex: 990 }}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                position: 'fixed', 
                top: 0, 
                right: 0, 
                bottom: 0, 
                width: '560px', 
                backgroundColor: 'var(--bg-card, #ffffff)', 
                zIndex: 1000, 
                boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
                padding: '40px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                borderLeft: '1px solid var(--border-color, #e2e8f0)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: '#f59e0b', margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={24} /> Outstanding Arrears Triage
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted, #64748b)', fontWeight: 550 }}>
                    Students with outstanding billing bounds. Issue balance alerts below.
                  </p>
                </div>
                <button 
                  onClick={() => setTriageOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted, #64748b)' }}
                >
                  <X size={24} />
                </button>
              </div>

              {arrearsItems.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted, #64748b)', gap: '16px' }}>
                  <ShieldCheck size={48} style={{ color: '#10b981' }} />
                  <span style={{ fontWeight: 800, fontSize: '1rem' }}>All Arrears Triage Cleared!</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                  {arrearsItems.map((item) => (
                    <div 
                      key={item.id} 
                      style={{ 
                        padding: '20px', 
                        borderRadius: '20px', 
                        backgroundColor: 'var(--bg-body, #f8fafc)', 
                        border: '1px solid var(--border-color, #f1f5f9)', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center' 
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--text-main, #0f172a)', fontSize: '0.95rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', marginTop: '4px' }}>
                          {item.grade} • <span style={{ color: '#f59e0b', fontWeight: 800 }}>{item.type}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontSize: '1.15rem', fontWeight: 950, color: 'var(--text-main, #0f172a)' }}>
                          {item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                        </div>
                        <button 
                          disabled={item.outreachActive}
                          onClick={() => handleIssueOutreach(item.id)}
                          style={{ 
                            padding: '10px 16px', 
                            borderRadius: '12px', 
                            border: 'none', 
                            backgroundColor: item.outreachActive ? 'var(--border-color, #e2e8f0)' : '#f59e0b', 
                            color: item.outreachActive ? 'var(--text-muted, #64748b)' : 'white', 
                            fontWeight: 800, 
                            fontSize: '0.75rem', 
                            cursor: item.outreachActive ? 'not-allowed' : 'pointer',
                            boxShadow: item.outreachActive ? 'none' : '0 4px 12px rgba(245, 158, 11, 0.2)'
                          }}
                        >
                          {item.status}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- CUSTOM AUDIT LEDGER TELEMETRY TERMINAL (MODAL) --- */}
      <AnimatePresence>
        {auditOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (auditStatus !== 'running') setAuditOpen(false);
              }}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'black', zIndex: 990 }}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ 
                position: 'fixed', 
                top: '20%', 
                left: 'calc(50% - 300px)', 
                width: '600px', 
                backgroundColor: 'var(--bg-card, #ffffff)', 
                zIndex: 1000, 
                borderRadius: '32px', 
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                padding: '40px',
                border: '1px solid var(--border-color, #e2e8f0)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--text-main, #0f172a)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={20} style={{ color: '#10b981' }} /> Audit Ledger Terminal
                </h3>
                {auditStatus !== 'running' && (
                  <button 
                    onClick={() => setAuditOpen(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted, #64748b)' }}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Progress Sweep Bar */}
              <div style={{ height: '6px', backgroundColor: 'var(--border-color, #e2e8f0)', borderRadius: '3px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ width: `${auditProgress}%`, height: '100%', backgroundColor: '#10b981', transition: 'width 0.2s' }} />
              </div>

              {/* Terminal Logs Output Screen */}
              <div style={{ 
                backgroundColor: '#0f172a', 
                borderRadius: '20px', 
                padding: '24px', 
                minHeight: '220px', 
                maxHeight: '300px',
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: '#34d399',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                {auditLogs.length === 0 ? (
                  <span style={{ color: 'var(--text-muted, #64748b)' }}>Waiting to execute transaction integrity sweeps...</span>
                ) : (
                  auditLogs.map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))
                )}
              </div>

              {/* Download Audit Verification Certificate */}
              {auditStatus === 'completed' && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}
                >
                  <button 
                    onClick={downloadAuditSweepKey}
                    style={{ 
                      padding: '12px 24px', 
                      borderRadius: '12px', 
                      backgroundColor: 'rgba(16, 185, 129, 0.15)', 
                      border: '1px solid rgba(16, 185, 129, 0.3)', 
                      color: '#10b981', 
                      fontWeight: 800, 
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Download size={14} /> Download Fiscal Integrity Key
                  </button>
                  
                  <button 
                    onClick={() => setAuditOpen(false)}
                    style={{ 
                      padding: '12px 24px', 
                      borderRadius: '12px', 
                      backgroundColor: 'var(--text-main, #0f172a)', 
                      border: 'none', 
                      color: 'var(--bg-card, #ffffff)', 
                      fontWeight: 800, 
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Dismiss Terminal
                  </button>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default FinancialReports;
