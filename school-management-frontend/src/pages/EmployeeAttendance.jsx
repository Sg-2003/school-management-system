import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, UserCheck, UserX, Clock, Save, 
  Search, Download, ChevronLeft, ChevronRight, 
  Users, Home, Filter, Briefcase, Loader2,
  Eye, Edit2, Flag, Trash2, X, CheckCircle2,
  SlidersHorizontal, RotateCcw, CheckCircle, UserX as UserXIcon,
  Building2, ShieldCheck, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ActionDropdown from '../components/ActionDropdown';

// ─── Constants ────────────────────────────────────────────────────────────────
const INITIAL_DATA = [
  { id: 'EMP-2026-001', name: 'Dr. Rajesh Malhotra', dept: 'Mathematics',    role: 'Senior Professor',  status: 'P', time: '08:30 AM', avatar: 'RM', color: '#4880FF', remark: '' },
  { id: 'EMP-2026-002', name: 'Sunita Rao',          dept: 'Administration', role: 'Admin Coordinator', status: 'L', time: '09:05 AM', avatar: 'SR', color: '#10B981', remark: '' },
  { id: 'EMP-2026-003', name: 'Amit Bose',           dept: 'Technical',      role: 'IT Specialist',     status: 'P', time: '08:20 AM', avatar: 'AB', color: '#F59E0B', remark: '' },
  { id: 'EMP-2026-004', name: 'Priya Patel',         dept: 'Student Welfare',role: 'Counselor',         status: 'A', time: '-',        avatar: 'PP', color: '#8B5CF6', remark: '' },
  { id: 'EMP-2026-005', name: 'Rajinder Singh',      dept: 'Transport',      role: 'Logistics Head',    status: 'P', time: '08:45 AM', avatar: 'RS', color: '#EF4444', remark: '' },
  { id: 'EMP-2026-006', name: 'Meeta Devi',          dept: 'Cafeteria',      role: 'Chef Manager',      status: 'H', time: '08:40 AM', avatar: 'MD', color: '#4880FF', remark: '' },
  { id: 'EMP-2026-007', name: 'Sameer Khan',         dept: 'IT Support',     role: 'Systems Admin',     status: 'P', time: '08:50 AM', avatar: 'SK', color: '#10B981', remark: '' },
  { id: 'EMP-2026-008', name: 'Ananya Iyer',         dept: 'Administration', role: 'HR Coordinator',    status: 'P', time: '08:35 AM', avatar: 'AI', color: '#8B5CF6', remark: '' },
  { id: 'EMP-2026-009', name: 'Sohan Lal',           dept: 'Maintenance',    role: 'Tech Supervisor',   status: 'A', time: '-',        avatar: 'SL', color: '#EF4444', remark: '' },
];

const DEPTS    = ['All', 'Administration', 'Maintenance', 'Mathematics', 'Technical', 'Student Welfare', 'Transport', 'Cafeteria', 'IT Support'];
const ROLES    = ['All', 'Senior Professor', 'Admin Coordinator', 'IT Specialist', 'Counselor', 'Logistics Head', 'Chef Manager', 'Systems Admin', 'HR Coordinator', 'Tech Supervisor'];
const STATUSES = [
  { id: 'All', label: 'All',     color: 'var(--primary)' },
  { id: 'P',   label: 'Present', color: 'var(--success)' },
  { id: 'L',   label: 'Late',    color: 'var(--warning)' },
  { id: 'A',   label: 'Absent',  color: 'var(--danger)'  },
  { id: 'H',   label: 'Half',    color: '#8B5CF6'        },
];

const PAGE_SIZE = 6;

// ─── Component ────────────────────────────────────────────────────────────────
const EmployeeAttendance = () => {
  const navigate = useNavigate();
  const [date, setDate]           = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory]   = useState('All');
  const [roleFilter, setRoleFilter]     = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery]   = useState('');
  const [showFilters, setShowFilters]   = useState(false);
  const [currentPage, setCurrentPage]   = useState(1);

  // Snapshot for discard
  const originalRef = useRef([]);
  const [attendanceData, setAttendanceData] = useState([]);

  // Load unified employee roster + merge with date attendance log
  const [employeesRegistry, setEmployeesRegistry] = useState([]);

  useEffect(() => {
    const version = localStorage.getItem('employees_version');
    const stored = localStorage.getItem('employees');
    if (version !== '2026-v2') {
      localStorage.removeItem('employees');
      localStorage.setItem('employees_version', '2026-v2');
    }
    const updatedStored = localStorage.getItem('employees');
    let registryList = [];

    const defaultEmployees = [
      { id: 'EMP-2026-001', name: 'Dr. Rajesh Malhotra', role: 'Senior Professor',  department: 'Mathematics',    status: 'On Duty',  color: '#4880FF' },
      { id: 'EMP-2026-002', name: 'Sunita Rao',          role: 'Admin Coordinator', department: 'Administration', status: 'On Duty',  color: '#10B981' },
      { id: 'EMP-2026-003', name: 'Amit Bose',           role: 'IT Specialist',     department: 'Technical',      status: 'On Leave', color: '#F59E0B' },
      { id: 'EMP-2026-004', name: 'Priya Patel',         role: 'Counselor',         department: 'Student Welfare',status: 'On Duty',  color: '#8B5CF6' },
      { id: 'EMP-2026-005', name: 'Rajinder Singh',      role: 'Logistics Head',    department: 'Transport',      status: 'On Duty',  color: '#EF4444' },
      { id: 'EMP-2026-006', name: 'Meeta Devi',          role: 'Chef Manager',      department: 'Cafeteria',      status: 'On Duty',  color: '#4880FF' },
      { id: 'EMP-2026-007', name: 'Sameer Khan',         role: 'Systems Admin',     department: 'IT Support',     status: 'On Duty',  color: '#10B981' },
      { id: 'EMP-2026-008', name: 'Ananya Iyer',         role: 'HR Coordinator',    department: 'Administration', status: 'On Duty',  color: '#8B5CF6' },
      { id: 'EMP-2026-009', name: 'Sohan Lal',           role: 'Tech Supervisor',   department: 'Maintenance',    status: 'On Leave', color: '#EF4444' }
    ];

    if (updatedStored) {
      const parsed = JSON.parse(updatedStored);
      if (parsed.length < 9) {
        localStorage.setItem('employees', JSON.stringify(defaultEmployees));
        registryList = defaultEmployees;
      } else {
        registryList = parsed;
      }
    } else {
      registryList = defaultEmployees;
      localStorage.setItem('employees', JSON.stringify(registryList));
    }
    setEmployeesRegistry(registryList);
  }, []);

  // When date or employeesRegistry changes, load and self-heal attendance
  useEffect(() => {
    if (employeesRegistry.length === 0) return;

    const key = `employee_attendance_${date}`;
    const storedLog = localStorage.getItem(key);
    
    // Map registry to attendance format
    const defaultRoster = employeesRegistry.map(emp => ({
      id: emp.id,
      name: emp.name,
      dept: emp.department || emp.dept || 'General Support',
      role: emp.role || 'Staff Member',
      status: emp.status === 'On Leave' ? 'A' : 'P', // absent if generally on leave, present otherwise
      time: emp.status === 'On Leave' ? '-' : '08:30 AM',
      avatar: emp.name.split(' ').map(n => n[0]).join(''),
      color: emp.color || '#4880FF',
      remark: emp.remark || ''
    }));

    if (storedLog) {
      const parsed = JSON.parse(storedLog);
      // Merge logic: ensure newly added employees show up, and deleted ones vanish
      const merged = defaultRoster.map(regEmp => {
        const savedMatch = parsed.find(p => p.id === regEmp.id);
        if (savedMatch) {
          return {
            ...regEmp,
            status: savedMatch.status || regEmp.status,
            time: savedMatch.time || regEmp.time,
            remark: savedMatch.remark || regEmp.remark,
            flagged: savedMatch.flagged || false
          };
        }
        return regEmp;
      });
      setAttendanceData(merged);
      originalRef.current = merged.map(d => ({ ...d }));
    } else {
      setAttendanceData(defaultRoster);
      originalRef.current = defaultRoster.map(d => ({ ...d }));
    }
  }, [date, employeesRegistry]);

  // UX states
  const [isSaving,     setIsSaving]     = useState(false);
  const [saveSuccess,  setSaveSuccess]  = useState(false);
  const [isExporting,  setIsExporting]  = useState(false);
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Dynamic stats ──────────────────────────────────────────────────────────
  const stats = [
    { label: 'Total Employees', value: attendanceData.length,                              color: 'var(--primary)', icon: <Users size={20} /> },
    { label: 'On Duty',         value: attendanceData.filter(d => d.status === 'P').length, color: 'var(--success)', icon: <UserCheck size={20} /> },
    { label: 'Late Joiners',    value: attendanceData.filter(d => d.status === 'L').length, color: 'var(--warning)', icon: <Clock size={20} /> },
    { label: 'On Leave / Absent', value: attendanceData.filter(d => d.status === 'A' || d.status === 'H').length, color: 'var(--danger)', icon: <UserX size={20} /> },
  ];

  // ── Actions ────────────────────────────────────────────────────────────────
  const updateStatus = (id, newStatus) => {
    setAttendanceData(prev => prev.map(item =>
      item.id === id
        ? { ...item, status: newStatus, time: newStatus === 'P' ? '08:30 AM' : newStatus === 'L' ? '09:05 AM' : '-' }
        : item
    ));
  };

  const updateRemark = (id, remark) =>
    setAttendanceData(prev => prev.map(item => item.id === id ? { ...item, remark } : item));

  const toggleFlag = (id) => {
    setAttendanceData(prev => prev.map(item =>
      item.id === id ? { ...item, flagged: !item.flagged } : item
    ));
  };

  const markAllActive = () => {
    setAttendanceData(prev => prev.map(item => ({ ...item, status: 'P', time: '08:30 AM' })));
    showToast('All employees marked as Present');
  };

  const handleDiscard = () => {
    setAttendanceData(originalRef.current.map(d => ({ ...d })));
    setSearchQuery('');
    setCategory('All');
    setRoleFilter('All');
    setStatusFilter('All');
    setShowFilters(false);
    setCurrentPage(1);
    showToast('All changes discarded', 'warn');
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      const key = `employee_attendance_${date}`;
      localStorage.setItem(key, JSON.stringify(attendanceData));
      originalRef.current = attendanceData.map(d => ({ ...d }));
      setIsSaving(false);
      setSaveSuccess(true);
      showToast(`Employee attendance for ${new Date(date + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'long' })} saved!`);
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 1200);
  };

  const handleExportLog = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers  = ['Employee ID', 'Name', 'Department', 'Role', 'Status', 'Check-In Time', 'Remarks'];
      const statusMap = { P: 'Present', L: 'Late', A: 'Absent', H: 'Half Day' };
      const rows = attendanceData.map(e => [
        e.id, e.name, e.dept, e.role, statusMap[e.status] || e.status, e.time, e.remark || '-'
      ]);
      const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url  = URL.createObjectURL(blob);
      const a    = Object.assign(document.createElement('a'), { href: url, download: `Employee_Attendance_${date}.csv` });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsExporting(false);
      showToast('Attendance log exported!');
    }, 900);
  };

  // ── Date navigation ────────────────────────────────────────────────────────
  const shiftDate = (days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split('T')[0]);
  };

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = attendanceData.filter(e => {
    const q = searchQuery.toLowerCase();
    const mSearch = !q || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q);
    const mDept   = category === 'All'     || e.dept === category;
    const mRole   = roleFilter === 'All'   || e.role === roleFilter;
    const mStatus = statusFilter === 'All' || e.status === statusFilter;
    return mSearch && mDept && mRole && mStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const goPage     = p => setCurrentPage(Math.min(totalPages, Math.max(1, p)));

  const activeFilterCount = [category !== 'All', roleFilter !== 'All', statusFilter !== 'All', searchQuery !== ''].filter(Boolean).length;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -28 }}
            style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
              padding: '14px 22px', borderRadius: '14px', fontWeight: 800, fontSize: '0.88rem',
              background: toast.type === 'warn' ? 'var(--warning)' : toast.type === 'error' ? 'var(--danger)' : 'var(--primary)',
              color: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>Employee Attendance</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px', fontWeight: 600 }}>
            <Home size={14} /> Dashboard / <span style={{ color: 'var(--primary)' }}>Employee Attendance</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn" onClick={handleExportLog} disabled={isExporting}
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              border: '1px solid var(--border-color)', 
              color: 'var(--text-main)',
              fontWeight: 800, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: 'var(--shadow-sm)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'var(--primary-light)';
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.color = 'var(--primary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'var(--bg-card)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-main)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {isExporting
              ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              : <Download size={18} />}
            {isExporting ? 'Exporting...' : 'EXPORT CSV'}
          </button>
          <button className="btn btn-primary" onClick={markAllActive}
            style={{ 
              padding: '12px 28px', 
              fontWeight: 900, 
              boxShadow: '0 4px 12px rgba(72,128,255,0.2)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(72,128,255,0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(72,128,255,0.2)';
            }}
          >
            Mark All Active
          </button>
        </div>
      </div>

      {/* ── Dynamic Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        {stats.map((s, i) => (
          <div key={i} className="card"
            style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', border: 'none', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}
            onClick={() => { setStatusFilter(s.label === 'On Duty' ? 'P' : s.label === 'Late Joiners' ? 'L' : s.label === 'On Leave / Absent' ? 'A' : 'All'); setCurrentPage(1); }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '16px', backgroundColor: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter & Controls Card ── */}
      <div className="card" style={{ padding: '20px 24px', borderRadius: '20px', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>

          {/* Date navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-body)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <button className="btn-icon" onClick={() => shiftDate(-1)} style={{ backgroundColor: 'transparent' }} title="Previous day">
                <ChevronLeft size={18} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px', fontWeight: 800, fontSize: '0.9rem', minWidth: '190px', justifyContent: 'center' }}>
                <Calendar size={16} color="var(--primary)" />
                {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <button className="btn-icon" onClick={() => shiftDate(1)} style={{ backgroundColor: 'transparent' }} title="Next day">
                <ChevronRight size={18} />
              </button>
            </div>
            <input type="date" className="form-input" style={{ width: '150px' }}
              value={date} onChange={e => setDate(e.target.value)} />
          </div>

          {/* Search + Department + More Filters */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Search employee..." value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                style={{ padding: '10px 12px 10px 36px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', outline: 'none', fontWeight: 600, fontSize: '0.85rem', width: '180px' }} />
            </div>

            <select className="form-input" style={{ width: '175px' }}
              value={category} onChange={e => { setCategory(e.target.value); setCurrentPage(1); }}>
              {DEPTS.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
            </select>

            <button
              onClick={() => setShowFilters(f => !f)}
              className="btn"
              style={{
                padding: '10px 18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: showFilters || activeFilterCount > 0 ? 'var(--primary-light)' : 'var(--bg-body)',
                border: `1px solid ${showFilters || activeFilterCount > 0 ? 'var(--primary)' : 'var(--border-color)'}`,
                color: showFilters || activeFilterCount > 0 ? 'var(--primary)' : 'var(--text-main)',
              }}>
              <SlidersHorizontal size={16} />
              More Filters
              {activeFilterCount > 0 && (
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', fontSize: '0.65rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Expandable Filter Panel ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 20 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.22 }}
              style={{ overflow: 'hidden', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'start' }}>

                {/* Status filter */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>Filter by Status</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {STATUSES.map(s => (
                      <button key={s.id} onClick={() => { setStatusFilter(s.id); setCurrentPage(1); }}
                        style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800, transition: 'all 0.15s',
                          borderColor: statusFilter === s.id ? s.color : 'var(--border-color)',
                          backgroundColor: statusFilter === s.id ? `${s.color}15` : 'var(--bg-body)',
                          color: statusFilter === s.id ? s.color : 'var(--text-muted)' }}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Role filter */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>Filter by Role</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {['All', 'Senior Professor', 'Admin Coordinator', 'IT Specialist', 'Logistics Head', 'Systems Admin'].map(r => (
                      <button key={r} onClick={() => { setRoleFilter(r); setCurrentPage(1); }}
                        style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, transition: 'all 0.15s',
                          borderColor: roleFilter === r ? 'var(--primary)' : 'var(--border-color)',
                          backgroundColor: roleFilter === r ? 'var(--primary-light)' : 'var(--bg-body)',
                          color: roleFilter === r ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active filters summary + Clear */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textAlign: 'right' }}>
                    Showing <strong>{filtered.length}</strong> of {attendanceData.length} employees
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => { setRoleFilter('All'); setStatusFilter('All'); setCategory('All'); setSearchQuery(''); setCurrentPage(1); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                        backgroundColor: 'rgba(239,68,68,0.08)', color: 'var(--danger)', fontWeight: 800, fontSize: '0.8rem' }}>
                      <X size={14} /> Clear All Filters
                    </button>
                  )}
                  {/* Active chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-end' }}>
                    {category !== 'All' && (
                      <span style={{ padding: '4px 10px', borderRadius: '20px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 800 }}>
                        {category}
                      </span>
                    )}
                    {statusFilter !== 'All' && (
                      <span style={{ padding: '4px 10px', borderRadius: '20px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 800 }}>
                        {STATUSES.find(s => s.id === statusFilter)?.label}
                      </span>
                    )}
                    {roleFilter !== 'All' && (
                      <span style={{ padding: '4px 10px', borderRadius: '20px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 800 }}>
                        {roleFilter}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Attendance Table ── */}
      <div className="card" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-md)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-body)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '18px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Employee Name</th>
              <th style={{ padding: '18px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dept / Role</th>
              <th style={{ padding: '18px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Check-In</th>
              <th style={{ padding: '18px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center' }}>Attendance Status</th>
              <th style={{ padding: '18px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Remark</th>
              <th style={{ padding: '18px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                  No employees match the active filters.
                </td>
              </tr>
            ) : (
              paginated.map(emp => (
                <motion.tr key={emp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ borderBottom: '1px solid var(--border-color)', transition: '0.2s' }} className="hover-row">
                  {/* Name */}
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '42px', 
                        height: '42px', 
                        borderRadius: '12px', 
                        backgroundColor: `${emp.color}15`, 
                        color: emp.color, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: 900, 
                        fontSize: '0.85rem',
                        overflow: 'hidden',
                        border: '1.5px solid var(--border-color)',
                        boxShadow: 'var(--shadow-sm)',
                        flexShrink: 0
                      }}>
                        <img 
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(emp.name)}`}
                          alt={emp.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {emp.name}
                          {emp.flagged && <Flag size={12} fill="var(--danger)" color="var(--danger)" style={{ flexShrink: 0 }} />}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>{emp.id}</div>
                      </div>
                    </div>
                  </td>
                  {/* Dept/Role */}
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{emp.dept}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{emp.role}</div>
                  </td>
                  {/* Check-in */}
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.88rem',
                      color: emp.status === 'P' ? 'var(--success)' : emp.status === 'L' ? 'var(--warning)' : 'var(--text-muted)' }}>
                      <Clock size={14} /> {emp.time}
                    </div>
                  </td>
                  {/* Status buttons */}
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      {[
                        { id: 'P', label: 'PRESENT', color: 'var(--success)' },
                        { id: 'A', label: 'ABSENT',  color: 'var(--danger)'  },
                        { id: 'L', label: 'LATE',    color: 'var(--warning)' },
                        { id: 'H', label: 'HALF',    color: '#8B5CF6'        },
                      ].map(s => {
                        const isSelected = emp.status === s.id;
                        return (
                          <button key={s.id} onClick={() => updateStatus(emp.id, s.id)}
                            style={{ 
                              padding: '8px 16px', 
                              borderRadius: '11px', 
                              fontSize: '0.72rem', 
                              fontWeight: 900, 
                              border: '1px solid',
                              cursor: 'pointer',
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '6px',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              backgroundColor: isSelected ? s.color : 'var(--bg-card)',
                              color: isSelected ? 'white' : 'var(--text-muted)',
                              borderColor: isSelected ? s.color : 'var(--border-color)',
                              boxShadow: isSelected ? `0 4px 10px ${s.color}30` : 'none',
                              transform: isSelected ? 'scale(1.05)' : 'scale(1)' 
                            }}
                            onMouseEnter={e => {
                              if (!isSelected) {
                                e.currentTarget.style.backgroundColor = `${s.color}08`;
                                e.currentTarget.style.borderColor = s.color;
                                e.currentTarget.style.color = s.color;
                                e.currentTarget.style.transform = 'scale(1.03)';
                              }
                            }}
                            onMouseLeave={e => {
                              if (!isSelected) {
                                e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                e.currentTarget.style.color = 'var(--text-muted)';
                                e.currentTarget.style.transform = 'scale(1)';
                              }
                            }}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                  {/* Remark */}
                  <td style={{ padding: '18px 24px' }}>
                    <input 
                      type="text" 
                      id={`remark-input-${emp.id}`}
                      placeholder="Add remark..." 
                      value={emp.remark}
                      onChange={e => updateRemark(emp.id, e.target.value)}
                      style={{ border: '1px solid transparent', backgroundColor: 'transparent', fontSize: '0.83rem', fontWeight: 500, color: 'var(--text-muted)', outline: 'none', width: '100%', borderRadius: '8px', padding: '4px 8px', transition: '0.2s' }}
                      onFocus={e => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.backgroundColor = 'var(--bg-body)'; }}
                      onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.backgroundColor = 'transparent'; }} 
                    />
                  </td>
                  {/* Action dropdown */}
                  <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                    <ActionDropdown
                      items={[
                        { label: 'View Profile',   icon: <Eye size={15} />,        onClick: () => navigate(`/dashboard/employee-details/${emp.id}`) },
                        { label: 'Edit Remark',    icon: <Edit2 size={15} />,       onClick: () => document.getElementById(`remark-input-${emp.id}`)?.focus() },
                        { label: emp.flagged ? 'Unflag Exception' : 'Flag Exception', icon: <Flag size={15} />, onClick: () => toggleFlag(emp.id) },
                        { divider: true },
                        { label: 'Mark Absent',    icon: <UserXIcon size={15} />,   danger: true, onClick: () => updateStatus(emp.id, 'A') },
                      ]}
                    />
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>

        {/* ── Footer: Discard + Pagination + Save ── */}
        <div style={{ padding: '18px 24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          
          {/* Left: count + discard */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              Showing <strong style={{ color: 'var(--text-main)' }}>{paginated.length}</strong> of <strong style={{ color: 'var(--text-main)' }}>{filtered.length}</strong> employees
            </span>
            <button onClick={handleDiscard}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '10px 20px', 
                borderRadius: '12px', 
                border: '1px solid var(--border-color)', 
                backgroundColor: 'transparent', 
                cursor: 'pointer', 
                fontSize: '0.78rem', 
                fontWeight: 800, 
                color: 'var(--text-muted)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                e.currentTarget.style.color = '#EF4444';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <RotateCcw size={13} /> Discard Changes
            </button>
          </div>

          {/* Center: pagination */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button onClick={() => goPage(currentPage - 1)} disabled={currentPage === 1}
              className="btn-icon" style={{ backgroundColor: 'var(--bg-body)', opacity: currentPage === 1 ? 0.4 : 1 }}>
              <ChevronLeft size={17} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => goPage(p)} className="btn-icon"
                style={{ backgroundColor: p === currentPage ? 'var(--primary)' : 'var(--bg-body)', color: p === currentPage ? 'white' : 'inherit', fontWeight: 800 }}>
                {p}
              </button>
            ))}
            <button onClick={() => goPage(currentPage + 1)} disabled={currentPage === totalPages}
              className="btn-icon" style={{ backgroundColor: 'var(--bg-body)', opacity: currentPage === totalPages ? 0.4 : 1 }}>
              <ChevronRight size={17} />
            </button>
          </div>

          {/* Right: save */}
          <button onClick={handleSave} disabled={isSaving} className="btn btn-primary"
            style={{ 
              padding: '12px 36px', 
              fontWeight: 900, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              backgroundColor: saveSuccess ? 'var(--success)' : undefined,
              transition: 'background-color 0.3s',
              boxShadow: '0 4px 12px rgba(72,128,255,0.2)' 
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = saveSuccess ? '0 6px 16px rgba(16, 185, 129, 0.3)' : '0 6px 16px rgba(72,128,255,0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(72,128,255,0.2)';
            }}
          >
            {isSaving
              ? <><Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
              : saveSuccess
              ? <><CheckCircle2 size={17} /> Saved!</>
              : <><Save size={17} /> Update Attendance</>}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeAttendance;
