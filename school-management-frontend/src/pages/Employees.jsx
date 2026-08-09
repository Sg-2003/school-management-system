import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreVertical, Mail, Phone, MapPin, Calendar, User, Briefcase, Award, ArrowUpRight, ExternalLink, ShieldCheck, Clock, Download, CheckCircle2, AlertCircle, Trash2, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  // Advanced filters state
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const departments = ['All', 'Mathematics', 'Administration', 'Technical', 'Student Welfare'];
  const statuses = ['All', 'On Duty', 'On Leave'];

  // Load from local storage with initial default seed
  useEffect(() => {
    const version = localStorage.getItem('employees_version');
    const stored = localStorage.getItem('employees');
    if (version !== '2026-v2') {
      localStorage.removeItem('employees');
      localStorage.setItem('employees_version', '2026-v2');
    }
    const defaultEmployees = [
      { 
        id: 'EMP-2026-001', 
        name: 'Dr. Rajesh Malhotra', 
        role: 'Senior Professor', 
        department: 'Mathematics', 
        type: 'Full-time', 
        status: 'On Duty', 
        joiningDate: '12 Jan 2021', 
        email: 'rajesh.malhotra@school.edu', 
        phone: '+91 98765 43291',
        address: '452 Academic Block, Sector 62, Noida, UP 201301',
        salary: '₹8,50,000 / annum',
        biography: 'Dr. Malhotra has been a cornerstone of the Mathematics department for over 4 years. He specializes in advanced calculus and linear algebra, contributing significantly to the curriculum development and student mentorship programs.'
      },
      { 
        id: 'EMP-2026-002', 
        name: 'Sunita Rao', 
        role: 'Admin Coordinator', 
        department: 'Administration', 
        type: 'Full-time', 
        status: 'On Duty', 
        joiningDate: '05 Mar 2022', 
        email: 'sunita.rao@school.edu', 
        phone: '+91 98765 43292',
        address: '102 Main Administration Block, New Delhi 110092',
        salary: '₹5,50,000 / annum',
        biography: 'Sunita Rao coordinates departmental synchronization, scheduling, and administrative logistics.'
      },
      { 
        id: 'EMP-2026-003', 
        name: 'Amit Bose', 
        role: 'IT Specialist', 
        department: 'Technical', 
        type: 'Contract', 
        status: 'On Leave', 
        joiningDate: '15 Sep 2023', 
        email: 'amit.bose@school.edu', 
        phone: '+91 98765 43293',
        address: 'Room 305, Tech Lab Wing, Kolkata, WB 700091',
        salary: '₹6,20,000 / annum',
        biography: 'Amit ensures campus hardware, server integration, and secure networking capabilities are functioning.'
      },
      { 
        id: 'EMP-2026-004', 
        name: 'Priya Patel', 
        role: 'Counselor', 
        department: 'Student Welfare', 
        type: 'Part-time', 
        status: 'On Duty', 
        joiningDate: '20 Feb 2024', 
        email: 'priya.patel@school.edu', 
        phone: '+91 98765 43294',
        address: 'Building C, Student Counseling Suite, Ahmedabad, GJ 380015',
        salary: '₹4,80,000 / annum',
        biography: 'Priya Patel works to coordinate student support, mental wellbeing, and career guidance programs.'
      },
      { 
        id: 'EMP-2026-005', 
        name: 'Rajinder Singh', 
        role: 'Logistics Head', 
        department: 'Transport', 
        type: 'Full-time', 
        status: 'On Duty', 
        joiningDate: '10 May 2022', 
        email: 'rajinder.singh@school.edu', 
        phone: '+91 98765 43295',
        address: 'Garage & Transport Bay, Mohali, PB 160055',
        salary: '₹5,80,000 / annum',
        biography: 'Rajinder coordinates institutional logistics, transport routing, and vehicle registry logs.'
      },
      { 
        id: 'EMP-2026-006', 
        name: 'Meeta Devi', 
        role: 'Chef Manager', 
        department: 'Cafeteria', 
        type: 'Full-time', 
        status: 'On Duty', 
        joiningDate: '18 Nov 2021', 
        email: 'meeta.devi@school.edu', 
        phone: '+91 98765 43296',
        address: 'Central Cafeteria Kitchen, Lucknow, UP 226010',
        salary: '₹5,00,000 / annum',
        biography: 'Meeta designs culinary menus and directs cafeteria kitchen staff.'
      },
      { 
        id: 'EMP-2026-007', 
        name: 'Sameer Khan', 
        role: 'Systems Admin', 
        department: 'IT Support', 
        type: 'Full-time', 
        status: 'On Duty', 
        joiningDate: '14 Feb 2023', 
        email: 'sameer.khan@school.edu', 
        phone: '+91 98765 43297',
        address: 'Server Room 202, Admin Wing, Mumbai, MH 400050',
        salary: '₹6,60,000 / annum',
        biography: 'Sameer maintains institution servers, cloud frameworks, and hardware systems.'
      },
      { 
        id: 'EMP-2026-008', 
        name: 'Ananya Iyer', 
        role: 'HR Coordinator', 
        department: 'Administration', 
        type: 'Full-time', 
        status: 'On Duty', 
        joiningDate: '09 Sep 2022', 
        email: 'ananya.iyer@school.edu', 
        phone: '+91 98765 43298',
        address: 'HR Desk, Administration Building, Bangalore, KA 560001',
        salary: '₹5,40,000 / annum',
        biography: 'Ananya coordinates staff recruitments, files, benefits registry, and organizational culture.'
      },
      { 
        id: 'EMP-2026-009', 
        name: 'Sohan Lal', 
        role: 'Tech Supervisor', 
        department: 'Maintenance', 
        type: 'Full-time', 
        status: 'On Leave', 
        joiningDate: '22 Jul 2021', 
        email: 'sohan.lal@school.edu', 
        phone: '+91 98765 43299',
        address: 'Facilities & Workshop Area, Jaipur, RJ 302001',
        salary: '₹5,20,000 / annum',
        biography: 'Sohan leads maintenance personnel and facilities repair/renovations.'
      }
    ];
    
    const currentStored = localStorage.getItem('employees');
    if (currentStored) {
      const parsed = JSON.parse(currentStored);
      if (parsed.length < 9) {
        localStorage.setItem('employees', JSON.stringify(defaultEmployees));
        setEmployees(defaultEmployees);
      } else {
        setEmployees(parsed);
      }
    } else {
      localStorage.setItem('employees', JSON.stringify(defaultEmployees));
      setEmployees(defaultEmployees);
    }
  }, []);

  // Filter employees based on search query, active tab, and advanced filters
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === 'All' 
      ? true 
      : activeTab === 'Permanent' 
        ? emp.type === 'Full-time' 
        : activeTab === 'Contract' 
          ? emp.type === 'Contract' 
          : activeTab === 'Probation' 
            ? emp.type === 'Part-time' 
            : true;

    const matchesDept = selectedDepartment === 'All' || emp.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

    return matchesSearch && matchesTab && matchesDept && matchesStatus;
  });

  // Export List Functionality
  const handleExportList = () => {
    if (filteredEmployees.length === 0) {
      showToast("No employee records found to export.", "error");
      return;
    }
    
    const headers = "Employee ID,Name,Role,Department,Type,Status,Joining Date,Email,Phone,Salary\n";
    const rows = filteredEmployees.map(emp => 
      `"${emp.id}","${emp.name.replace(/"/g, '""')}","${emp.role.replace(/"/g, '""')}","${emp.department.replace(/"/g, '""')}","${emp.type}","${emp.status}","${emp.joiningDate}","${emp.email}","${emp.phone}","${emp.salary}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `EduPro_Employee_Directory_${Date.now()}.csv`);
    a.click();
    window.URL.revokeObjectURL(url);
    showToast("Employee list exported successfully.", "success");
  };

  // Delete employee statefully
  const handleDeleteEmployee = (id, name) => {
    setDeleteConfirm({ id, name });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      const { id, name } = deleteConfirm;
      const updated = employees.filter(emp => emp.id !== id);
      setEmployees(updated);
      localStorage.setItem('employees', JSON.stringify(updated));
      showToast(`Employee ${name} removed successfully.`, "success");
      setDeleteConfirm(null);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Employee Directory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Comprehensive management of all institutional staff, faculty, and administrative personnel.</p>
        </div>
         <div style={{ display: 'flex', gap: '12px' }}>
            <button 
               onClick={handleExportList}
               className="btn" 
               style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
               <Download size={18} /> EXPORT LIST
            </button>
           <button 
              className="btn btn-primary" 
              onClick={() => navigate('/dashboard/add-employee')}
              style={{ padding: '12px 28px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 900 }}
           >
              <Plus size={18} /> ADD NEW EMPLOYEE
           </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
         {[
           { label: 'Total Employees', value: employees.length.toString(), change: '+5 this month', icon: <User size={20} />, color: 'var(--primary)' },
           { label: 'Academic Staff', value: employees.filter(e => e.role.toLowerCase().includes('professor') || e.role.toLowerCase().includes('instructor')).length.toString(), change: 'Dynamic Count', icon: <Award size={20} />, color: '#10B981' },
           { label: 'Admin & Ops', value: employees.filter(e => !e.role.toLowerCase().includes('professor') && !e.role.toLowerCase().includes('instructor')).length.toString(), change: 'Support Staff', icon: <Briefcase size={20} />, color: '#F59E0B' },
           { label: 'On Leave Today', value: employees.filter(e => e.status === 'On Leave').length.toString(), change: 'Current Rate', icon: <Clock size={20} />, color: '#EF4444' }
         ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: `${stat.color}15`, color: stat.color }}>{stat.icon}</div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', backgroundColor: 'var(--bg-body)', padding: '4px 8px', borderRadius: '20px' }}>{stat.change}</span>
               </div>
               <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{stat.label}</div>
               <div style={{ fontSize: '1.75rem', fontWeight: 950 }}>{stat.value}</div>
            </div>
         ))}
      </div>

      <div className="card" style={{ padding: '0', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
         <div style={{ padding: '24px 32px', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
               <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="Search by name, ID or department..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '320px', padding: '8px 12px 8px 36px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', outline: 'none', fontSize: '0.85rem' }} 
                  />
               </div>
               
               {/* Advanced Filter Popover */}
               <div style={{ position: 'relative' }}>
                  <button 
                     onClick={() => setShowFilterPopover(!showFilterPopover)}
                     className="btn" 
                     style={{ 
                        border: '1px solid var(--border-color)', 
                        backgroundColor: showFilterPopover ? 'var(--primary-light)' : 'var(--bg-body)', 
                        color: showFilterPopover ? 'var(--primary)' : 'var(--text-main)',
                        fontSize: '0.85rem', 
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                     }}
                  >
                     <Filter size={14} /> 
                     FILTER
                     {(selectedDepartment !== 'All' || selectedStatus !== 'All') && (
                        <span style={{
                           width: '8px',
                           height: '8px',
                           borderRadius: '50%',
                           backgroundColor: 'var(--primary)',
                           display: 'inline-block'
                        }} />
                     )}
                  </button>

                  {showFilterPopover && (
                     <div style={{
                        position: 'absolute',
                        top: '105%',
                        left: 0,
                        zIndex: 100,
                        width: '260px',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-xl)',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        marginTop: '8px'
                     }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Advanced Filters</span>
                           <button 
                              onClick={() => {
                                 setSelectedDepartment('All');
                                 setSelectedStatus('All');
                              }}
                              style={{ 
                                 border: 'none', 
                                 background: 'none', 
                                 color: 'var(--primary)', 
                                 fontSize: '0.75rem', 
                                 fontWeight: 800, 
                                 cursor: 'pointer',
                                 padding: 0
                              }}
                           >
                              Reset All
                           </button>
                        </div>

                        <div>
                           <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '6px' }}>DEPARTMENT</label>
                           <select 
                              value={selectedDepartment}
                              onChange={(e) => setSelectedDepartment(e.target.value)}
                              style={{ 
                                 width: '100%', 
                                 padding: '8px 12px', 
                                 borderRadius: '8px', 
                                 border: '1px solid var(--border-color)', 
                                 backgroundColor: 'var(--bg-body)', 
                                 color: 'var(--text-main)',
                                 fontSize: '0.85rem',
                                 outline: 'none',
                                 cursor: 'pointer'
                              }}
                           >
                              {departments.map(dept => (
                                 <option key={dept} value={dept}>{dept}</option>
                              ))}
                           </select>
                        </div>

                        <div>
                           <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '6px' }}>DUTY STATUS</label>
                           <select 
                              value={selectedStatus}
                              onChange={(e) => setSelectedStatus(e.target.value)}
                              style={{ 
                                 width: '100%', 
                                 padding: '8px 12px', 
                                 borderRadius: '8px', 
                                 border: '1px solid var(--border-color)', 
                                 backgroundColor: 'var(--bg-body)', 
                                 color: 'var(--text-main)',
                                 fontSize: '0.85rem',
                                 outline: 'none',
                                 cursor: 'pointer'
                              }}
                           >
                              {statuses.map(st => (
                                 <option key={st} value={st}>{st}</option>
                              ))}
                           </select>
                        </div>
                     </div>
                  )}
               </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
               {['All', 'Permanent', 'Contract', 'Probation'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    style={{ 
                      padding: '8px 16px', borderRadius: '8px', border: 'none', 
                      backgroundColor: activeTab === tab ? 'var(--primary-light)' : 'transparent',
                      color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                      fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer'
                    }}
                  >{tab}</button>
               ))}
            </div>
         </div>
         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
               <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-card)' }}>
                  <th style={{ padding: '16px 32px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>EMPLOYEE ID</th>
                  <th style={{ padding: '16px 32px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>EMPLOYEE NAME</th>
                  <th style={{ padding: '16px 32px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>DEPARTMENT / ROLE</th>
                  <th style={{ padding: '16px 32px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>STATUS</th>
                  <th style={{ padding: '16px 32px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'right' }}>ACTIONS</th>
               </tr>
            </thead>
            <tbody>
               {filteredEmployees.map((emp, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', transition: '0.2s' }}>
                     <td style={{ padding: '20px 32px', fontWeight: 700, color: 'var(--primary)' }}>{emp.id}</td>
                     <td style={{ padding: '20px 32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                           <div style={{ 
                              width: '40px', 
                              height: '40px', 
                              borderRadius: '10px', 
                              backgroundColor: 'var(--bg-body)', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              fontWeight: 800, 
                              color: 'var(--primary)', 
                              border: '1px solid var(--border-color)',
                              overflow: 'hidden',
                              flexShrink: 0
                            }}>
                               <img 
                                 src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(emp.name)}`}
                                 alt={emp.name} 
                                 style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                               />
                           </div>
                           <div>
                              <div style={{ fontWeight: 800 }}>{emp.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{emp.email}</div>
                           </div>
                        </div>
                     </td>
                     <td style={{ padding: '20px 32px' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{emp.role}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{emp.department}</div>
                     </td>
                     <td style={{ padding: '20px 32px' }}>
                        <span style={{ 
                           padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 900,
                           backgroundColor: emp.status === 'On Duty' ? '#10B98115' : '#EF444415',
                           color: emp.status === 'On Duty' ? '#10B981' : '#EF4444'
                        }}>{emp.status}</span>
                     </td>
                      <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                         <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button 
                              className="icon-btn" 
                              onClick={() => navigate(`/dashboard/employee-details/${emp.id}`)}
                              style={{ backgroundColor: 'var(--bg-body)' }} 
                              title="View Profile"
                            >
                              <ExternalLink size={16} />
                            </button>
                            <button 
                              className="icon-btn" 
                              onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                              style={{ backgroundColor: 'var(--bg-body)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="Remove Employee"
                            >
                              <Trash2 size={16} />
                            </button>
                         </div>
                      </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed',
              bottom: '40px',
              right: '40px',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px 24px',
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              color: '#ffffff',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              maxWidth: '400px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: toast.type === 'success' 
                  ? 'rgba(16, 185, 129, 0.15)' 
                  : toast.type === 'error' 
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'rgba(99, 102, 241, 0.15)',
                color: toast.type === 'success' 
                  ? '#34d399' 
                  : toast.type === 'error' 
                  ? '#f87171'
                  : '#818cf8',
                flexShrink: 0,
              }}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 size={20} />
              ) : toast.type === 'error' ? (
                <AlertCircle size={20} />
              ) : (
                <Sparkles size={20} />
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', lineHeight: 1.4 }}>
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => setToast(null)}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                color: '#94a3b8',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteConfirm && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
            <div style={{ position: 'absolute', inset: 0 }} onClick={() => setDeleteConfirm(null)} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', textAlign: 'center', border: '1px solid var(--border-color)', zIndex: 10 }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                <AlertCircle size={28} />
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>Remove Employee</h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.5 }}>
                Are you sure you want to remove <strong style={{ color: 'var(--text-main)' }}>{deleteConfirm.name}</strong> ({deleteConfirm.id}) from the Employee Directory? This action is permanent.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setDeleteConfirm(null)} 
                  className="btn" 
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="btn" 
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: 800, cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Employees;
