import React, { useState, useMemo } from 'react';
import { 
  CreditCard, Search, Filter, Download, Printer, 
  MoreVertical, CheckCircle2, Clock, AlertCircle,
  FileText, TrendingUp, DollarSign, Calendar, X,
  Eye, ChevronDown, Tag, Hash, User, Building2,
  BadgeCheck, Banknote, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────
   SEED DATA – tagged by session
───────────────────────────────────────── */
const SEED_RECORDS = [
  // ── Current Session ──
  { id: '#INV-9821', student: 'Rohan Das',         roll: 'ADM-2026-004', type: 'Tuition Fee',  amount: 450.00, date: '05 May 2026', status: 'Paid',    method: 'Online',        session: 'Current Session' },
  { id: '#INV-9820', student: 'Aditi Nair',        roll: 'ADM-2026-012', type: 'Tuition Fee',  amount: 450.00, date: '05 May 2026', status: 'Paid',    method: 'Cash',          session: 'Current Session' },
  { id: '#INV-9819', student: 'Rahul Kapoor',      roll: 'ADM-2026-045', type: 'Tuition Fee',  amount: 450.00, date: '04 May 2026', status: 'Pending', method: '-',             session: 'Current Session' },
  { id: '#INV-9818', student: 'Divya Joshi',       roll: 'ADM-2026-089', type: 'Transport Fee',amount: 80.00,  date: '04 May 2026', status: 'Paid',    method: 'Online',        session: 'Current Session' },
  { id: '#INV-9817', student: 'Kabir Sen',         roll: 'ADM-2026-023', type: 'Tuition Fee',  amount: 450.00, date: '03 May 2026', status: 'Paid',    method: 'Bank Transfer', session: 'Current Session' },
  { id: '#INV-9816', student: 'Ananya Iyer',       roll: 'ADM-2026-067', type: 'Library Fine', amount: 15.00,  date: '02 May 2026', status: 'Paid',    method: 'Cash',          session: 'Current Session' },
  { id: '#INV-9815', student: 'Rohan Das',         roll: 'ADM-2026-011', type: 'Tuition Fee',  amount: 450.00, date: '02 May 2026', status: 'Paid',    method: 'Online',        session: 'Current Session' },
  { id: '#INV-9814', student: 'Neha Sharma',       roll: 'ADM-2026-034', type: 'Tuition Fee',  amount: 450.00, date: '01 May 2026', status: 'Unpaid',  method: '-',             session: 'Current Session' },
  { id: '#INV-9813', student: 'Aman Verma',        roll: 'ADM-2026-018', type: 'Hostel Fee',   amount: 300.00, date: '30 Apr 2026', status: 'Paid',    method: 'Online',        session: 'Current Session' },
  { id: '#INV-9812', student: 'Arjun Reddy',       roll: 'ADM-2026-055', type: 'Transport Fee',amount: 80.00,  date: '29 Apr 2026', status: 'Unpaid',  method: '-',             session: 'Current Session' },
  { id: '#INV-9811', student: 'Aditi Nair',        roll: 'ADM-2026-072', type: 'Hostel Fee',   amount: 300.00, date: '28 Apr 2026', status: 'Pending', method: '-',             session: 'Current Session' },
  { id: '#INV-9810', student: 'Karan Mehta',       roll: 'ADM-2026-031', type: 'Tuition Fee',  amount: 450.00, date: '27 Apr 2026', status: 'Paid',    method: 'Cash',          session: 'Current Session' },
  // ── Last Session ──
  { id: '#INV-8742', student: 'Meera Patel',       roll: 'ADM-2025-002', type: 'Tuition Fee',  amount: 420.00, date: '15 Dec 2025', status: 'Paid',    method: 'Online',        session: 'Last Session' },
  { id: '#INV-8741', student: 'Abhishek Singh',    roll: 'ADM-2025-003', type: 'Hostel Fee',   amount: 300.00, date: '14 Dec 2025', status: 'Paid',    method: 'Bank Transfer', session: 'Last Session' },
  { id: '#INV-8740', student: 'Aanya Sharma',      roll: 'ADM-2025-001', type: 'Tuition Fee',  amount: 420.00, date: '12 Dec 2025', status: 'Paid',    method: 'Online',        session: 'Last Session' },
  { id: '#INV-8739', student: 'Priya Patel',       roll: 'ADM-2025-007', type: 'Transport Fee',amount: 75.00,  date: '10 Dec 2025', status: 'Paid',    method: 'Cash',          session: 'Last Session' },
  { id: '#INV-8738', student: 'Rajinder Singh',    roll: 'ADM-2025-009', type: 'Tuition Fee',  amount: 420.00, date: '08 Dec 2025', status: 'Unpaid',  method: '-',             session: 'Last Session' },
  { id: '#INV-8737', student: 'Vihaan Joshi',      roll: 'ADM-2025-014', type: 'Library Fine', amount: 12.00,  date: '05 Dec 2025', status: 'Paid',    method: 'Cash',          session: 'Last Session' },
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const fmt = (n) =>
  '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 });

const STATUS_COLOR = {
  Paid:    { bg: 'var(--success-light)', color: 'var(--success)' },
  Pending: { bg: 'var(--warning-light)', color: 'var(--warning)' },
  Unpaid:  { bg: 'var(--danger-light)',  color: 'var(--danger)'  },
};

const TYPE_KEYS = {
  Tuition:   (t) => t.toLowerCase().includes('tuition'),
  Transport: (t) => t.toLowerCase().includes('transport'),
  Hostel:    (t) => t.toLowerCase().includes('hostel'),
  Library:   (t) => t.toLowerCase().includes('library'),
};

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
const FeesRecord = () => {
  /* ── Persistent records list ── */
  const [records, setRecords] = useState(() => {
    try {
      const stored = localStorage.getItem('fees_records_history');
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    localStorage.setItem('fees_records_history', JSON.stringify(SEED_RECORDS));
    return SEED_RECORDS;
  });

  /* ── UI state ── */
  const [searchQuery,       setSearchQuery]       = useState('');
  const [selectedSession,   setSelectedSession]   = useState('Current Session');
  const [selectedStatus,    setSelectedStatus]    = useState('All');
  const [selectedType,      setSelectedType]      = useState('All');
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [showSummaryModal,  setShowSummaryModal]  = useState(false);
  const [activeInvoice,     setActiveInvoice]     = useState(null);

  /* ── Derived: session slice ── */
  const sessionRecords = useMemo(
    () => records.filter((r) => r.session === selectedSession),
    [records, selectedSession]
  );

  /* ── Derived: filtered records ── */
  const filteredRecords = useMemo(() => {
    return sessionRecords.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        r.student.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.roll.toLowerCase().includes(q);

      const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
      const matchesType =
        selectedType === 'All' || (TYPE_KEYS[selectedType] && TYPE_KEYS[selectedType](r.type));

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [sessionRecords, searchQuery, selectedStatus, selectedType]);

  /* ── Derived: reactive stats from session slice ── */
  const stats = useMemo(() => {
    const paidAmt   = sessionRecords.filter(r => r.status === 'Paid').reduce((s, r) => s + r.amount, 0);
    const pendingAmt= sessionRecords.filter(r => r.status !== 'Paid').reduce((s, r) => s + r.amount, 0);
    const scholarship = paidAmt * 0.042; // 4.2% simulated bursary discount pool
    const invoices  = sessionRecords.length;

    // Compare vs. opposite session for change badge
    const other = records.filter(r => r.session !== selectedSession);
    const otherPaid = other.filter(r => r.status === 'Paid').reduce((s, r) => s + r.amount, 0);
    const paidChange = otherPaid > 0 ? (((paidAmt - otherPaid) / otherPaid) * 100).toFixed(1) : '0.0';

    return [
      { label: 'Total Collection', value: fmt(paidAmt),    change: `${paidChange >= 0 ? '+' : ''}${paidChange}%`, isPositive: parseFloat(paidChange) >= 0, icon: <DollarSign size={20}/>, color: 'var(--primary)' },
      { label: 'Pending Fees',     value: fmt(pendingAmt), change: pendingAmt > 0 ? '▲ Due' : '✓ Clear',          isPositive: pendingAmt === 0,              icon: <Clock size={20}/>,       color: 'var(--warning)' },
      { label: 'Scholarships',     value: fmt(scholarship),change: '+4.2%',                                        isPositive: true,                           icon: <TrendingUp size={20}/>,  color: 'var(--success)' },
      { label: 'Invoices Issued',  value: String(invoices),change: `${invoices} total`,                            isPositive: true,                           icon: <FileText size={20}/>,    color: '#8b5cf6' },
    ];
  }, [sessionRecords, records, selectedSession]);

  /* ── Derived: summary breakdown for Collection Summary Modal ── */
  const summaryBreakdown = useMemo(() => {
    const paid = sessionRecords.filter(r => r.status === 'Paid');
    const gross = paid.reduce((s, r) => s + r.amount, 0);
    const categories = [
      { label: 'Tuition Fees',         key: 'Tuition',   color: 'var(--primary)' },
      { label: 'Transport Channels',   key: 'Transport',  color: 'var(--warning)' },
      { label: 'Hostel Accommodations',key: 'Hostel',     color: 'var(--success)' },
      { label: 'Library & Fines',      key: 'Library',    color: '#8b5cf6'        },
    ];
    return {
      gross,
      scholarship: gross * 0.042,
      items: categories.map(({ label, key, color }) => {
        const sum = paid.filter(r => TYPE_KEYS[key] && TYPE_KEYS[key](r.type)).reduce((s, r) => s + r.amount, 0);
        const pct = gross > 0 ? Math.round((sum / gross) * 100) : 0;
        return { label, sum, pct, color };
      }),
    };
  }, [sessionRecords]);

  /* ── Handlers ── */
  const handleExportData = () => {
    const rows = [
      ['Fees Records History Archive', `Session: ${selectedSession}`],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['Invoice ID', 'Student Name', 'Roll Number', 'Fee Category', 'Amount', 'Date Issued', 'Status', 'Payment Method'],
      ...filteredRecords.map(r => [r.id, r.student, r.roll, r.type, fmt(r.amount), r.date, r.status, r.method]),
    ];
    const csv = 'data:text/csv;charset=utf-8,' + rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), { href: encodeURI(csv), download: `fees_archive_${selectedSession.replace(/\s+/g, '_')}.csv` });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const handleDownloadReceipt = (record) => {
    const txt = `
=============================================
         INSTITUTIONAL FEE INVOICE RECEIPT
=============================================
Invoice ID    : ${record.id}
Student Name  : ${record.student}
Roll Number   : ${record.roll}
Fee Category  : ${record.type}
Amount Due    : ${fmt(record.amount)}
Date Issued   : ${record.date}
Status        : ${record.status.toUpperCase()}
Payment Method: ${record.method}
Session       : ${record.session}

Authorized – School Finance & Accounts Dept.
Generated On  : ${new Date().toLocaleString()}
=============================================
`;
    const blob = new Blob([txt], { type: 'text/plain' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `invoice_${record.id.replace('#','')}.txt` });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const handlePrintReceipt = (record) => {
    const win = window.open('', '_blank', 'width=680,height=800');
    win.document.write(`
      <html>
      <head>
        <title>Invoice ${record.id}</title>
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family: 'Segoe UI', sans-serif; background:#fff; color:#111; padding:48px; }
          .header { text-align:center; border-bottom:3px solid #4f46e5; padding-bottom:24px; margin-bottom:32px; }
          .logo { font-size:1.5rem; font-weight:900; color:#4f46e5; letter-spacing:2px; }
          .sub  { font-size:0.75rem; color:#6b7280; margin-top:4px; text-transform:uppercase; letter-spacing:1px; }
          h1 { font-size:1.1rem; font-weight:800; margin:16px 0 4px; }
          .badge { display:inline-block; padding:4px 12px; border-radius:20px; font-size:0.7rem; font-weight:800;
            background:${record.status==='Paid'?'#dcfce7':record.status==='Pending'?'#fef9c3':'#fee2e2'};
            color:${record.status==='Paid'?'#16a34a':record.status==='Pending'?'#ca8a04':'#dc2626'}; }
          table { width:100%; margin-top:24px; border-collapse:collapse; }
          td { padding:12px 16px; border-bottom:1px solid #e5e7eb; font-size:0.85rem; }
          td:first-child { font-weight:700; color:#6b7280; width:160px; }
          td:last-child  { font-weight:800; color:#111; }
          .total-row td { background:#f9fafb; font-size:1rem; }
          .footer { margin-top:40px; text-align:center; font-size:0.72rem; color:#9ca3af; border-top:1px solid #e5e7eb; padding-top:20px; }
          .watermark { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-30deg);
            font-size:5rem; font-weight:900; color:${record.status==='Paid'?'rgba(22,163,74,0.06)':'rgba(239,68,68,0.06)'}; pointer-events:none; z-index:0; }
          @media print { .watermark { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
        </style>
      </head>
      <body>
        <div class="watermark">${record.status.toUpperCase()}</div>
        <div class="header">
          <div class="logo">🏫 SCHOOL FINANCE</div>
          <div class="sub">Official Fee Invoice Receipt</div>
          <h1>${record.id}</h1>
          <span class="badge">${record.status}</span>
        </div>
        <table>
          <tr><td>Student Name</td><td>${record.student}</td></tr>
          <tr><td>Roll Number</td><td>${record.roll}</td></tr>
          <tr><td>Fee Category</td><td>${record.type}</td></tr>
          <tr><td>Date Issued</td><td>${record.date}</td></tr>
          <tr><td>Session</td><td>${record.session}</td></tr>
          <tr><td>Payment Method</td><td>${record.method}</td></tr>
          <tr class="total-row"><td>Amount</td><td>${fmt(record.amount)}</td></tr>
        </table>
        <div class="footer">
          Authorized by School Accounts Dept. &nbsp;|&nbsp; Printed: ${new Date().toLocaleString()}<br/>
          This is a computer-generated receipt and is valid without a signature.
        </div>
        <script>window.onload=()=>{ window.print(); window.close(); }<\/script>
      </body>
      </html>
    `);
    win.document.close();
  };

  const activeFiltersCount = (selectedStatus !== 'All' ? 1 : 0) + (selectedType !== 'All' ? 1 : 0);

  /* ══════════════════════════════════════
     RENDER
  ══════════════════════════════════════ */
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '48px' }}
    >
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>Fees Records History</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Comprehensive archive of all school financial transactions — {selectedSession}.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleExportData}
            className="btn"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}
          >
            <Download size={16} /> Export Data
          </button>
          <button
            onClick={() => setShowSummaryModal(true)}
            className="btn btn-primary"
            style={{ padding: '11px 22px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}
          >
            <DollarSign size={16} /> Collection Summary
          </button>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card"
            style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '16px' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: `${stat.color}18`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {stat.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 900 }}>{stat.value}</span>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: stat.isPositive ? 'var(--success)' : 'var(--danger)', whiteSpace: 'nowrap' }}>{stat.change}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Main Table Card ── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>

        {/* Table Toolbar */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '380px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search student, invoice ID, roll number…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '11px 14px 11px 42px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600, fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Session Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', backgroundColor: 'var(--bg-body)', borderRadius: '10px', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
              <Calendar size={15} color="var(--primary)" />
              <select
                value={selectedSession}
                onChange={(e) => { setSelectedSession(e.target.value); setSelectedStatus('All'); setSelectedType('All'); }}
                style={{ border: 'none', backgroundColor: 'transparent', color: 'var(--text-main)', fontWeight: 700, fontSize: '0.82rem', outline: 'none', cursor: 'pointer' }}
              >
                <option value="Current Session">Current Session</option>
                <option value="Last Session">Last Session</option>
              </select>
            </div>

            {/* Filter Popover */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowFilterPopover(!showFilterPopover)}
                className="btn"
                style={{ border: `1px solid ${activeFiltersCount > 0 ? 'var(--primary)' : 'var(--border-color)'}`, backgroundColor: activeFiltersCount > 0 ? 'var(--primary-light)' : 'var(--bg-body)', color: activeFiltersCount > 0 ? 'var(--primary)' : 'var(--text-main)', fontSize: '0.82rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '9px 14px' }}
              >
                <Filter size={15} />
                Filter
                {activeFiltersCount > 0 && (
                  <span style={{ backgroundColor: 'var(--primary)', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900 }}>
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showFilterPopover && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 200, width: '230px', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', boxShadow: '0 20px 50px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: '16px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 900, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Advanced Filter</span>
                      <button onClick={() => setShowFilterPopover(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={14} /></button>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Invoice Status</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 700, outline: 'none' }}
                      >
                        <option value="All">All Statuses</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Unpaid">Unpaid</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Fee Category</label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 700, outline: 'none' }}
                      >
                        <option value="All">All Categories</option>
                        <option value="Tuition">Tuition Fees</option>
                        <option value="Transport">Transport Fees</option>
                        <option value="Hostel">Hostel Fees</option>
                        <option value="Library">Library Fines</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px solid var(--border-color)' }}>
                      <button
                        onClick={() => { setSelectedStatus('All'); setSelectedType('All'); }}
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', padding: '4px 0' }}
                      >
                        Clear All
                      </button>
                      <button
                        onClick={() => setShowFilterPopover(false)}
                        style={{ background: 'var(--primary)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

        {/* Result Count Badge */}
        {(searchQuery || selectedStatus !== 'All' || selectedType !== 'All') && (
          <div style={{ padding: '10px 24px', backgroundColor: 'var(--primary-light)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BadgeCheck size={14} color="var(--primary)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)' }}>
              {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''} matched — filtered from {sessionRecords.length} total in {selectedSession}
            </span>
            <button
              onClick={() => { setSearchQuery(''); setSelectedStatus('All'); setSelectedType('All'); }}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 900, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'var(--bg-body)' }}>
              <tr style={{ textAlign: 'left' }}>
                {['Invoice ID', 'Student', 'Fee Type', 'Amount', 'Status', 'Method', 'Actions'].map((h, i) => (
                  <th key={h} style={{ padding: '14px 20px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: i === 6 ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record, idx) => (
                    <motion.tr
                      key={record.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      style={{ borderBottom: '1px solid var(--border-color)' }}
                      className="table-row-hover"
                    >
                      <td style={{ padding: '14px 20px', fontWeight: 800, color: 'var(--primary)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{record.id}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.88rem' }}>{record.student}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>{record.roll}</div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>{record.type}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>{record.date}</div>
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: 900, color: 'var(--text-main)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{fmt(record.amount)}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.68rem', fontWeight: 800, backgroundColor: STATUS_COLOR[record.status]?.bg, color: STATUS_COLOR[record.status]?.color }}>
                          {record.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>{record.method}</td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          {/* View / Invoice Details */}
                          <button
                            onClick={() => setActiveInvoice(record)}
                            title="View Invoice"
                            style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', cursor: 'pointer' }}
                          >
                            <Eye size={13} />
                          </button>
                          {/* Print */}
                          <button
                            onClick={() => handlePrintReceipt(record)}
                            title="Print Receipt"
                            style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}
                          >
                            <Printer size={13} />
                          </button>
                          {/* Download */}
                          <button
                            onClick={() => handleDownloadReceipt(record)}
                            title="Download Invoice"
                            style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}
                          >
                            <Download size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ padding: '56px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <FileText size={36} color="var(--text-muted)" style={{ opacity: 0.4 }} />
                        <div style={{ fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.9rem' }}>No records found</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', opacity: 0.7 }}>Try adjusting your search query or filter settings.</div>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredRecords.length > 0 && (
          <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-body)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              Showing <strong style={{ color: 'var(--text-main)' }}>{filteredRecords.length}</strong> of <strong style={{ color: 'var(--text-main)' }}>{sessionRecords.length}</strong> records
            </span>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)' }}>
              Total shown: <strong style={{ color: 'var(--primary)' }}>{fmt(filteredRecords.reduce((s, r) => s + r.amount, 0))}</strong>
            </span>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          INVOICE DETAILS MODAL
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {activeInvoice && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveInvoice(null)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              style={{ backgroundColor: 'var(--bg-card)', borderRadius: '24px', width: '100%', maxWidth: '520px', position: 'relative', boxShadow: '0 40px 80px rgba(0,0,0,0.28)', overflow: 'hidden' }}
            >
              {/* Modal header banner */}
              <div style={{ background: 'linear-gradient(135deg, var(--primary), #7c3aed)', padding: '28px 32px', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <FileText size={20} color="rgba(255,255,255,0.85)" />
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Official Invoice Receipt</span>
                </div>
                <h2 style={{ color: '#fff', fontSize: '1.7rem', fontWeight: 900, margin: 0 }}>{activeInvoice.id}</h2>
                <div style={{ marginTop: '8px', display: 'inline-flex' }}>
                  <span style={{ padding: '4px 14px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 900, backgroundColor: 'rgba(255,255,255,0.18)', color: '#fff', backdropFilter: 'blur(4px)' }}>
                    {activeInvoice.status}
                  </span>
                </div>
                <button
                  onClick={() => setActiveInvoice(null)}
                  style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', color: '#fff', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Details grid */}
              <div style={{ padding: '28px 32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                  {[
                    { icon: <User size={14}/>, label: 'Student', value: activeInvoice.student },
                    { icon: <Hash size={14}/>, label: 'Roll Number', value: activeInvoice.roll },
                    { icon: <Tag size={14}/>, label: 'Fee Category', value: activeInvoice.type },
                    { icon: <Calendar size={14}/>, label: 'Date Issued', value: activeInvoice.date },
                    { icon: <Banknote size={14}/>, label: 'Payment Method', value: activeInvoice.method },
                    { icon: <Building2 size={14}/>, label: 'Session', value: activeInvoice.session },
                  ].map(({ icon, label, value }) => (
                    <div key={label} style={{ padding: '14px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        {icon}
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Amount highlight */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--primary-light), rgba(124,58,237,0.08))', border: '1px solid var(--primary)', marginBottom: '24px' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Invoice Amount</div>
                    <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--primary)', marginTop: '2px' }}>{fmt(activeInvoice.amount)}</div>
                  </div>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <DollarSign size={26} />
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => handlePrintReceipt(activeInvoice)}
                    className="btn"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', borderRadius: '12px' }}
                  >
                    <Printer size={16} /> Print Invoice
                  </button>
                  <button
                    onClick={() => handleDownloadReceipt(activeInvoice)}
                    className="btn btn-primary"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', borderRadius: '12px' }}
                  >
                    <Download size={16} /> Download TXT
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          COLLECTION SUMMARY MODAL
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {showSummaryModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowSummaryModal(false)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '560px', position: 'relative', boxShadow: '0 40px 80px rgba(0,0,0,0.25)' }}
            >
              <button
                onClick={() => setShowSummaryModal(false)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--bg-body)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '6px' }}>
                <TrendingUp size={22} />
                <span style={{ fontWeight: 900, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Financial Center</span>
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '4px' }}>Collection Summary</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '0.88rem' }}>
                Aggregated statistics for <strong>{selectedSession}</strong> — live computed from {sessionRecords.length} records.
              </p>

              {/* KPI Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div style={{ padding: '18px', backgroundColor: 'var(--bg-body)', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gross Revenue</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary)', marginTop: '4px' }}>{fmt(summaryBreakdown.gross)}</div>
                </div>
                <div style={{ padding: '18px', backgroundColor: 'var(--bg-body)', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Discounts</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--success)', marginTop: '4px' }}>{fmt(summaryBreakdown.scholarship)}</div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div style={{ padding: '20px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  Category Breakdown
                </div>
                {summaryBreakdown.items.map(({ label, sum, pct, color }) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-main)' }}>{label}</span>
                      <span style={{ fontWeight: 900, color }}>{fmt(sum)} <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>({pct}%)</span></span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '99px', backgroundColor: 'var(--border-color)', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        style={{ height: '100%', backgroundColor: color, borderRadius: '99px' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleExportData}
                  className="btn"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 800, cursor: 'pointer', borderRadius: '12px' }}
                >
                  <Download size={15} /> Export CSV
                </button>
                <button
                  onClick={() => setShowSummaryModal(false)}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '14px', fontWeight: 800, cursor: 'pointer', borderRadius: '12px' }}
                >
                  Close Summary
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FeesRecord;
