import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, UserCheck, UserX, Clock, Save, FileText, 
  Search, ListFilter, Download, ChevronLeft, ChevronRight, 
  Users, AlertCircle, Home, CircleCheck, Info, Filter, MoreVertical, Loader2,
  Eye, Edit2, Flag, Trash2, X, CheckCircle2, SlidersHorizontal, RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ActionDropdown from '../components/ActionDropdown';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Seed data ────────────────────────────────────────────────────
const INITIAL_DATA = [
  { id: 'AD52365', name: 'Priya Malhotra',  dept: 'Mathematics', role: 'Senior Teacher',    status: 'P', time: '08:45 AM', avatar: 'PM', color: '#4880FF', remark: '' },
  { id: 'AD52366', name: 'Rajesh Kumar',    dept: 'Physics',     role: 'Head of Dept',      status: 'L', time: '09:15 AM', avatar: 'RK', color: '#10B981', remark: '' },
  { id: 'AD52367', name: 'Sunita Sharma',   dept: 'English',     role: 'Assistant Teacher', status: 'A', time: '-',        avatar: 'SS', color: '#F59E0B', remark: '' },
  { id: 'AD52368', name: 'Vikram Nair',     dept: 'Chemistry',   role: 'Lecturer',          status: 'P', time: '08:50 AM', avatar: 'VN', color: '#8B5CF6', remark: '' },
  { id: 'AD52370', name: 'Meena Iyer',      dept: 'Biology',     role: 'Senior Teacher',    status: 'H', time: '08:45 AM', avatar: 'MI', color: '#EF4444', remark: '' },
  { id: 'AD52371', name: 'Arun Pandey',     dept: 'CS',          role: 'Lab Instructor',    status: 'P', time: '08:55 AM', avatar: 'AP', color: '#4880FF', remark: '' },
  { id: 'AD52372', name: 'Kavya Reddy',     dept: 'Geography',   role: 'Senior Teacher',    status: 'P', time: '08:40 AM', avatar: 'KR', color: '#10B981', remark: '' },
];

const DEPTS = ['All', 'Mathematics', 'Physics', 'English', 'Chemistry', 'Biology', 'CS', 'Geography'];
const ROLES = ['All', 'Senior Teacher', 'Head of Dept', 'Assistant Teacher', 'Lecturer', 'Lab Instructor'];
const STATUS_OPTIONS = [
  { id: 'P', label: 'Present', color: 'var(--success)' },
  { id: 'L', label: 'Late',    color: 'var(--warning)' },
  { id: 'A', label: 'Absent',  color: 'var(--danger)'  },
  { id: 'H', label: 'Half',    color: 'var(--primary)' }
];

// ─── Component ────────────────────────────────────────────────────
const TeacherAttendance = () => {
  const navigate = useNavigate();
  const [teachersList, setTeachersList] = useState([]);
  
  useEffect(() => {
    const stored = localStorage.getItem('teachers');
    if (stored) {
      setTeachersList(JSON.parse(stored));
    }
  }, []);

  const [date, setDate]               = useState(new Date().toISOString().split('T')[0]);
  const [department, setDepartment]   = useState('All');
  const [roleFilter, setRoleFilter]   = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Snapshot for discard
  const original = useRef(INITIAL_DATA.map(d => ({ ...d })));
  const [attendanceData, setAttendanceData] = useState(() =>
    INITIAL_DATA.map(d => ({ ...d }))
  );

  // Save/discard UX
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  // ── Stats (dynamic) ─────────────────────────────────────────────
  const stats = [
    { label: 'Total Staff',    value: attendanceData.length.toString(), icon: <Users size={20} />, color: 'var(--primary)' },
    { label: 'Present Today',  value: attendanceData.filter(d => d.status === 'P').length.toString(), icon: <UserCheck size={20} />, color: 'var(--success)' },
    { label: 'Late Arrival',   value: attendanceData.filter(d => d.status === 'L').length.toString(), icon: <Clock size={20} />,     color: 'var(--warning)' },
    { label: 'Absent',         value: attendanceData.filter(d => d.status === 'A').length.toString(), icon: <UserX size={20} />,     color: 'var(--danger)'  },
  ];

  // ── Actions ──────────────────────────────────────────────────────
  const updateStatus = (id, newStatus) => {
    setAttendanceData(prev => prev.map(item =>
      item.id === id ? { ...item, status: newStatus, time: newStatus === 'P' ? '08:45 AM' : newStatus === 'L' ? '09:15 AM' : '-' } : item
    ));
  };

  const updateRemark = (id, remark) => {
    setAttendanceData(prev => prev.map(item => item.id === id ? { ...item, remark } : item));
  };

  const toggleFlag = (id) => {
    setAttendanceData(prev => prev.map(item =>
      item.id === id ? { ...item, flagged: !item.flagged } : item
    ));
  };

  const markAllPresent = () => {
    setAttendanceData(prev => prev.map(item => ({ ...item, status: 'P', time: '08:45 AM' })));
    showToast('All staff marked as Present');
  };

  const handleDiscard = () => {
    setAttendanceData(original.current.map(d => ({ ...d })));
    setSearchQuery('');
    setDepartment('All');
    setRoleFilter('All');
    setStatusFilter('All');
    setShowMoreFilters(false);
    showToast('All changes discarded', 'warn');
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      // Persist to localStorage
      const key = `teacher_attendance_${date}`;
      localStorage.setItem(key, JSON.stringify(attendanceData));
      // Update snapshot so further discards go to saved state
      original.current = attendanceData.map(d => ({ ...d }));
      setIsSaving(false);
      setSaveSuccess(true);
      showToast(`Attendance for ${new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })} saved successfully!`);
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 1200);
  };

  const handleExportLog = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ['Staff ID', 'Staff Name', 'Department', 'Role', 'Status', 'Check-In Time', 'Remarks'];
      const statusMap = { P: 'Present', L: 'Late', A: 'Absent', H: 'Half Day' };
      const rows = attendanceData.map(item => [
        item.id, item.name, item.dept, item.role,
        statusMap[item.status] || item.status, item.time, item.remark || '-'
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Staff_Attendance_${date}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsExporting(false);
      showToast('Attendance log exported as CSV!');
    }, 900);
  };

  // ── Date navigation ──────────────────────────────────────────────
  const shiftDate = (days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split('T')[0]);
  };

  // ── Filtering ─────────────────────────────────────────────────────
  const filtered = attendanceData.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
    const matchDept   = department === 'All'    || s.dept === department;
    const matchRole   = roleFilter === 'All'    || s.role === roleFilter;
    const matchStatus = statusFilter === 'All'  || s.status === statusFilter;
    return matchSearch && matchDept && matchRole && matchStatus;
  });

  const activeFilterCount = [department !== 'All', roleFilter !== 'All', statusFilter !== 'All', searchQuery !== ''].filter(Boolean).length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -28 }}
            style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, padding: '14px 22px',
              borderRadius: '14px', fontWeight: 800, fontSize: '0.88rem',
              background: toast.type === 'warn' ? 'var(--warning)' : toast.type === 'error' ? 'var(--danger)' : 'var(--primary)',
              color: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>Staff Attendance</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px', fontWeight: 600 }}>
            <Home size={14} /> Dashboard / <span style={{ color: 'var(--primary)' }}>Staff Attendance</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn" onClick={handleExportLog} disabled={isExporting}
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isExporting ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={18} />}
            {isExporting ? 'Exporting...' : 'Export Log'}
          </button>
          <button className="btn btn-primary" onClick={markAllPresent} style={{ fontWeight: 800 }}>
            Mark All Present
          </button>
        </div>
      </div>

      {/* ── Dynamic Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        {stats.map((s, i) => (
          <div key={i} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '16px', backgroundColor: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{s.label}</div>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px', fontWeight: 800, fontSize: '0.9rem', minWidth: '180px', justifyContent: 'center' }}>
                <Calendar size={16} color="var(--primary)" />
                {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <button className="btn-icon" onClick={() => shiftDate(1)} style={{ backgroundColor: 'transparent' }} title="Next day">
                <ChevronRight size={18} />
              </button>
            </div>
            <input type="date" className="form-input" style={{ width: '150px' }} value={date}
              onChange={(e) => setDate(e.target.value)} />
          </div>

          {/* Right: search + dept + More Filters */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Search staff..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ padding: '10px 12px 10px 36px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', outline: 'none', fontWeight: 600, fontSize: '0.85rem', width: '180px' }} />
            </div>

            {/* Dept select */}
            <select className="form-input" style={{ width: '175px' }} value={department}
              onChange={(e) => setDepartment(e.target.value)}>
              {DEPTS.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
            </select>

            {/* More Filters toggle */}
            <button
              onClick={() => setShowMoreFilters(f => !f)}
              className="btn"
              style={{
                padding: '10px 18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: showMoreFilters || activeFilterCount > 0 ? 'var(--primary-light)' : 'var(--bg-body)',
                border: `1px solid ${showMoreFilters || activeFilterCount > 0 ? 'var(--primary)' : 'var(--border-color)'}`,
                color: showMoreFilters || activeFilterCount > 0 ? 'var(--primary)' : 'var(--text-main)',
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

        {/* ── Expandable More Filters Panel ── */}
        <AnimatePresence>
          {showMoreFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 20 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.22 }}
              style={{ overflow: 'hidden', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'end' }}>
                {/* Role Filter */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Filter by Role</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {ROLES.map(r => (
                      <button key={r} onClick={() => setRoleFilter(r)}
                        style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, transition: 'all 0.15s',
                          borderColor: roleFilter === r ? 'var(--primary)' : 'var(--border-color)',
                          backgroundColor: roleFilter === r ? 'var(--primary-light)' : 'var(--bg-body)',
                          color: roleFilter === r ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Filter by Status</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[{ id: 'All', label: 'All', color: 'var(--primary)' }, ...STATUS_OPTIONS].map(s => (
                      <button key={s.id} onClick={() => setStatusFilter(s.id)}
                        style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800, transition: 'all 0.15s',
                          borderColor: statusFilter === s.id ? s.color : 'var(--border-color)',
                          backgroundColor: statusFilter === s.id ? `${s.color}15` : 'var(--bg-body)',
                          color: statusFilter === s.id ? s.color : 'var(--text-muted)' }}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {activeFilterCount > 0 && (
                    <button onClick={() => { setRoleFilter('All'); setStatusFilter('All'); setDepartment('All'); setSearchQuery(''); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                        backgroundColor: 'rgba(239,68,68,0.08)', color: 'var(--danger)', fontWeight: 800, fontSize: '0.8rem' }}>
                      <X size={14} /> Clear All Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Active filter summary */}
              {activeFilterCount > 0 && (
                <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)' }}>
                  <Filter size={13} />
                  Showing <strong>{filtered.length}</strong> of {attendanceData.length} staff members
                  {department !== 'All' && <span style={{ padding: '3px 10px', borderRadius: '20px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>{department}</span>}
                  {roleFilter !== 'All' && <span style={{ padding: '3px 10px', borderRadius: '20px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>{roleFilter}</span>}
                  {statusFilter !== 'All' && <span style={{ padding: '3px 10px', borderRadius: '20px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>Status: {statusFilter}</span>}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Attendance Table ── */}
      <div className="card" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>STAFF NAME</th>
                <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>DEPT / ROLE</th>
                <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>ATTENDANCE STATUS</th>
                <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>CHECK-IN</th>
                <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>REMARKS</th>
                <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                    No staff members match the active filters.
                  </td>
                </tr>
              ) : filtered.map((staff) => {
                const matchedTeacher = teachersList.find(t => t.name.toLowerCase() === staff.name.toLowerCase());
                const staffAvatar = matchedTeacher?.avatar || matchedTeacher?.img;
                return (
                  <motion.tr key={staff.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ borderBottom: '1px solid var(--border-color)', transition: '0.2s' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: '12px', backgroundColor: `${staff.color}15`, 
                          color: staff.color, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          fontSize: '0.9rem', fontWeight: 900, overflow: 'hidden'
                        }}>
                          <img 
                            src={staffAvatar && staffAvatar.startsWith('data:') ? staffAvatar : `https://images.unsplash.com/photo-${[
                              '1494790108377-be9c29b29330',
                              '1507003211169-0a1dd7228f2d',
                              '1438761681033-6461ffad8d80',
                              '1517841905240-472988babdf9',
                              '1544005313-94ddf0286df2',
                              '1534528741775-53994a69daeb',
                              '1539571696357-5a69c17a67c6',
                              '1500648767791-00dcc994a43e',
                              '1506794778202-cad84cf45f1d',
                              '1522075469751-3a6694fb2f61',
                              '1524504388940-b1c1722653e1',
                              '1531746020798-e6953c6e8e04'
                            ][((parseInt(staff.id.replace(/\D/g, '')) || 0) % 12)]}?w=150&h=150&fit=crop`} 
                            alt={staff.name} 
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.name}`;
                            }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {staff.name}
                            {staff.flagged && <Flag size={12} fill="var(--danger)" color="var(--danger)" style={{ flexShrink: 0 }} />}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{staff.id}</div>
                        </div>
                      </div>
                    </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{staff.dept}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{staff.role}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-body)', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
                      {STATUS_OPTIONS.map(btn => (
                        <button key={btn.id} onClick={() => updateStatus(staff.id, btn.id)}
                          style={{ padding: '6px 12px', borderRadius: '8px', border: 'none',
                            backgroundColor: staff.status === btn.id ? btn.color : 'transparent',
                            color: staff.status === btn.id ? 'white' : 'var(--text-muted)',
                            fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', transition: '0.2s' }}>
                          {btn.id}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.85rem', color: staff.status === 'L' ? 'var(--warning)' : 'var(--text-main)' }}>
                      <Clock size={14} /> {staff.time}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <input
                      type="text"
                      id={`remark-input-${staff.id}`}
                      placeholder="Add remark..."
                      value={staff.remark}
                      onChange={e => updateRemark(staff.id, e.target.value)}
                      style={{ border: '1px solid transparent', backgroundColor: 'transparent', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', outline: 'none', width: '100%', borderRadius: '8px', padding: '4px 8px', transition: '0.2s' }}
                      onFocus={e => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.backgroundColor = 'var(--bg-body)'; }}
                      onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.backgroundColor = 'transparent'; }}
                    />
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <ActionDropdown
                      items={[
                        { label: 'View Profile',    icon: <Eye size={15} />,   onClick: () => navigate(`/dashboard/teacher-details/${staff.id}`) },
                        { label: 'Edit Remark',     icon: <Edit2 size={15} />, onClick: () => document.getElementById(`remark-input-${staff.id}`)?.focus() },
                        { label: staff.flagged ? 'Unflag Exception' : 'Flag Exception',  icon: <Flag size={15} />,  onClick: () => toggleFlag(staff.id) },
                        { divider: true },
                        { label: 'Mark Absent',     icon: <UserX size={15} />,  danger: true, onClick: () => updateStatus(staff.id, 'A') },
                      ]}
                    />
                  </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Footer: Discard + Update ── */}
        <div style={{ padding: '20px 24px', backgroundColor: 'var(--bg-body)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '14px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, marginRight: 'auto' }}>
            <Info size={16} color="var(--primary)" />
            Attendance data saved to the secure faculty ledger · {filtered.length} records shown
          </div>

          {/* Discard Changes */}
          <button
            onClick={handleDiscard}
            className="btn"
            style={{ padding: '11px 28px', fontWeight: 800, backgroundColor: 'transparent', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <RotateCcw size={16} /> Discard Changes
          </button>

          {/* Update Attendance */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary"
            style={{ padding: '11px 36px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: saveSuccess ? 'var(--success)' : undefined,
              borderColor: saveSuccess ? 'var(--success)' : undefined,
              transition: 'background-color 0.3s' }}>
            {isSaving ? (
              <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
            ) : saveSuccess ? (
              <><CheckCircle2 size={18} /> Saved!</>
            ) : (
              <><Save size={18} /> Update Attendance</>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TeacherAttendance;
