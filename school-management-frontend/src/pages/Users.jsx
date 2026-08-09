import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, Trash2, Edit3, Search, Mail, UserPlus, Filter, 
  MoreVertical, CircleCheck, CircleX, Clock, ShieldCheck,
  GraduationCap, Users as UsersIcon, Baby, LayoutDashboard, X, CheckCircle2, AlertCircle, Sparkles, Check
} from 'lucide-react';
import { getUsers } from '../services/service';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [toast, setToast] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'student', profilePic: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // User Audit Simulation States
  const [selectedAuditUser, setSelectedAuditUser] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isAuditingUser, setIsAuditingUser] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);

  const showToast = (message, type = 'success', title = null) => {
    setToast({ message, type, title });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('edupro_users_list_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        const needsSeeding = parsed.some(u => !u.profilePic && u.id <= 5);
        if (needsSeeding) {
          const seeded = parsed.map(u => {
            if (u.id === 1 && !u.profilePic) u.profilePic = 'https://api.dicebear.com/7.x/initials/svg?seed=Rajesh%20Malhotra';
            else if (u.id === 2 && !u.profilePic) u.profilePic = 'https://api.dicebear.com/7.x/initials/svg?seed=Sunita%20Rao';
            else if (u.id === 3 && !u.profilePic) u.profilePic = 'https://api.dicebear.com/7.x/initials/svg?seed=Ramesh%20Verma';
            else if (u.id === 4 && !u.profilePic) u.profilePic = 'https://api.dicebear.com/7.x/initials/svg?seed=Divya%20Joshi';
            else if (u.id === 5 && !u.profilePic) u.profilePic = 'https://api.dicebear.com/7.x/initials/svg?seed=Sanjay%20Gupta';
            return u;
          });
          localStorage.setItem('edupro_users_list_v2', JSON.stringify(seeded));
          setUsers(seeded);
          setLoading(false);
          return;
        }
        setUsers(parsed);
        setLoading(false);
        return;
      }
      const data = await getUsers();
      setUsers(data);
      localStorage.setItem('edupro_users_list_v2', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback premium mock data
      const fallback = [
        { id: 1, name: 'Rajesh Malhotra', email: 'rajesh.m@edupro.com', role: 'admin', status: 'active', lastLogin: '10 mins ago', avatar: 'RM', color: '#4f46e5', profilePic: 'https://api.dicebear.com/7.x/initials/svg?seed=Rajesh%20Malhotra' },
        { id: 2, name: 'Dr. Sunita Rao', email: 'sunita.r@edupro.com', role: 'teacher', status: 'active', lastLogin: '1 hour ago', avatar: 'SR', color: '#f59e0b', profilePic: 'https://api.dicebear.com/7.x/initials/svg?seed=Sunita%20Rao' },
        { id: 3, name: 'Ramesh Verma', email: 'ramesh.v@edupro.com', role: 'parent', status: 'active', lastLogin: '5 hours ago', avatar: 'RV', color: '#10b981', profilePic: 'https://api.dicebear.com/7.x/initials/svg?seed=Ramesh%20Verma' },
        { id: 4, name: 'Divya Joshi', email: 'divya.j@edupro.com', role: 'student', status: 'active', lastLogin: '2 days ago', avatar: 'DJ', color: '#3b82f6', profilePic: 'https://api.dicebear.com/7.x/initials/svg?seed=Divya%20Joshi' },
        { id: 5, name: 'Sanjay Gupta', email: 'sanjay.g@edupro.com', role: 'admin', status: 'suspended', lastLogin: '1 week ago', avatar: 'SG', color: '#4f46e5', profilePic: 'https://api.dicebear.com/7.x/initials/svg?seed=Sanjay%20Gupta' },
      ];
      setUsers(fallback);
      localStorage.setItem('edupro_users_list_v2', JSON.stringify(fallback));
    } finally {
      setLoading(false);
    }
  };

  const runUserAuditSimulation = (user) => {
    setSelectedAuditUser(user);
    setIsAuditingUser(true);
    setAuditProgress(0);
    setAuditLogs([]);

    const steps = [
      `Establishing secure SSL handshake pipeline to ${user.email}...`,
      `Requesting JWT authorization vector from token server...`,
      `Verifying cryptographic SHA-256 session token signatures...`,
      `Mapping geographic access nodes: Institutional Gateway Node #${Math.floor(Math.random() * 100) + 1}...`,
      `Auditing device posture: OS core patches verified. MFAs synced.`,
      `Access audit finalized. Status: SECURE & ENCRYPTED.`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setAuditLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${steps[currentStep]}`]);
        setAuditProgress(Math.round(((currentStep + 1) / steps.length) * 100));
        currentStep++;
      } else {
        clearInterval(interval);
        setIsAuditingUser(false);
        showToast(`Security audit complete for ${user.name}.`, "success", "Integrity Verified");
      }
    }, 450);
  };

  const exportToCSV = () => {
    showToast("Generating secure users ledger database...", "info", "CSV Export");
    const filteredUsers = users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'all' || u.role === activeFilter;
      return matchesSearch && matchesFilter;
    });

    const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Last Login'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(u => [u.id, u.name, u.email, u.role, u.status, u.lastLogin].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `edupro_users_${activeFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      showToast("Users ledger successfully exported.", "success", "Download Complete");
    }, 1200);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <ShieldCheck size={16} />;
      case 'teacher': return <GraduationCap size={16} />;
      case 'parent': return <Baby size={16} />;
      case 'student': return <UsersIcon size={16} />;
      default: return <User size={16} />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#4f46e5';
      case 'teacher': return '#f59e0b';
      case 'parent': return '#10b981';
      case 'student': return '#3b82f6';
      default: return '#64748b';
    }
  };

  const userColor = selectedAuditUser
    ? (selectedAuditUser.color && selectedAuditUser.color.toLowerCase() !== '#ffffff' && selectedAuditUser.color.toLowerCase() !== 'white'
        ? selectedAuditUser.color
        : getRoleColor(selectedAuditUser.role))
    : '#4880FF';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 950, margin: 0, color: 'var(--text-main)', letterSpacing: '-1.5px' }}>User Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '6px', fontWeight: 500 }}>
            Oversee system access, manage roles, and monitor user engagement across the platform.
          </p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-primary" 
          onClick={() => setIsCreatingUser(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 28px', borderRadius: '18px', boxShadow: '0 8px 16px -4px rgba(79, 70, 229, 0.4)', cursor: 'pointer', border: 'none', fontWeight: 800 }}
        >
          <UserPlus size={18} /> <span style={{ fontWeight: 800 }}>Create New User</span>
        </motion.button>
      </div>

      {/* Quick Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {[
          { id: 'all', label: 'Total Accounts', value: '1,240', icon: <LayoutDashboard size={22} />, color: '#4f46e5', change: '+12%' },
          { id: 'teacher', label: 'Active Teachers', value: '84', icon: <GraduationCap size={22} />, color: '#f59e0b', change: '+4%' },
          { id: 'parent', label: 'Guardian Portals', value: '450', icon: <Baby size={22} />, color: '#10b981', change: '+18%' },
          { id: 'student', label: 'Student Accounts', value: '860', icon: <UsersIcon size={22} />, color: '#3b82f6', change: '+25%' }
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -6, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              setActiveFilter(stat.id);
              showToast(`User list filtered by: ${stat.label}.`, "info", "Filter Active");
            }}
            className="card" 
            style={{ 
              padding: '28px', 
              borderRadius: '28px', 
              position: 'relative', 
              overflow: 'hidden', 
              cursor: 'pointer',
              border: activeFilter === stat.id ? `2px solid ${stat.color}` : '1px solid var(--border-color)',
              boxShadow: activeFilter === stat.id ? `0 10px 20px -5px ${stat.color}25` : 'none',
              transition: 'border 0.2s, box-shadow 0.2s'
            }}
          >
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', backgroundColor: `${stat.color}05`, borderRadius: '50%' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '14px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-main)' }}>{stat.value}</h3>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--success)' }}>{stat.change}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters & Actions Bar */}
      <div className="card" style={{ padding: '24px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Search users by name, email, or role..." 
              style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem', outline: 'none' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
            <button 
              className="btn" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{ border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 20px', borderRadius: '12px', fontWeight: 700, backgroundColor: activeFilter !== 'all' ? 'var(--primary-light)' : 'transparent', color: activeFilter !== 'all' ? 'var(--primary)' : 'var(--text-main)', cursor: 'pointer' }}
            >
              <Filter size={18} /> {activeFilter === 'all' ? 'Filters' : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
            </button>
            
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  style={{ position: 'absolute', top: '110%', right: 0, width: '200px', backgroundColor: 'var(--bg-card)', borderRadius: '16px', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-color)', padding: '8px', zIndex: 100 }}
                >
                  {['all', 'admin', 'teacher', 'student', 'parent'].map(f => (
                    <div 
                      key={f}
                      onClick={() => { setActiveFilter(f); setIsFilterOpen(false); showToast(`Filter updated: ${f.charAt(0).toUpperCase() + f.slice(1)}`, "info"); }}
                      style={{ padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', backgroundColor: activeFilter === f ? 'var(--primary-light)' : 'transparent', color: activeFilter === f ? 'var(--primary)' : 'var(--text-main)' }}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)} Roles
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              className="btn" 
              onClick={exportToCSV}
              style={{ border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 24px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', backgroundColor: 'transparent', color: 'var(--text-main)' }}
            >
               Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* User Table Card */}
      <div className="card" style={{ padding: '24px', borderRadius: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th style={{ padding: '0 12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>User Details</th>
              <th style={{ padding: '0 12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Role</th>
              <th style={{ padding: '0 12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
              <th style={{ padding: '0 12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Last Active</th>
              <th style={{ padding: '0 12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {users.filter(u => {
                const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesFilter = activeFilter === 'all' || u.role === activeFilter;
                return matchesSearch && matchesFilter;
              }).map((user) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  whileHover={{ scale: 1.002 }}
                >
                  <td style={{ padding: '16px 12px', backgroundColor: 'var(--bg-body)', borderRadius: '16px 0 0 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ position: 'relative', width: '46px', height: '46px', flexShrink: 0 }}>
                        <img 
                          src={user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundType=gradientLinear&fontFamily=Arial,Helvetica,sans-serif&fontSize=42&fontWeight=700`}
                          alt={user.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundType=gradientLinear&fontFamily=Arial,Helvetica,sans-serif&fontSize=42&fontWeight=700`;
                          }}
                          style={{ 
                            width: '46px', 
                            height: '46px', 
                            borderRadius: '14px', 
                            objectFit: 'cover', 
                            border: `2px solid ${user.color || '#4f46e5'}`,
                            boxShadow: `0 8px 16px ${(user.color || '#4f46e5')}30`,
                            backgroundColor: user.color || '#4f46e5'
                          }} 
                        />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>{user.name}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
                          <Mail size={12} /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px', backgroundColor: 'var(--bg-body)' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 800,
                      color: getRoleColor(user.role), backgroundColor: `${getRoleColor(user.role)}15`,
                      padding: '6px 12px', borderRadius: '10px', textTransform: 'uppercase'
                    }}>
                      {getRoleIcon(user.role)} {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px', backgroundColor: 'var(--bg-body)' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 800,
                      color: user.status === 'active' ? 'var(--success)' : 'var(--danger)',
                      backgroundColor: user.status === 'active' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                      padding: '6px 12px', borderRadius: '10px'
                    }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: user.status === 'active' ? 'var(--success)' : 'var(--danger)' }}></div>
                      {user.status === 'active' ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px', backgroundColor: 'var(--bg-body)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      <Clock size={16} /> {user.lastLogin}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px', backgroundColor: 'var(--bg-body)', borderRadius: '0 16px 16px 0', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <motion.button 
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="icon-btn" title="Edit User" 
                        onClick={() => setEditingUser(user)}
                        style={{ color: 'var(--primary)', padding: '8px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', border: 'none', cursor: 'pointer' }}
                      >
                        <Edit3 size={18} />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="icon-btn" title="Delete User" 
                        onClick={() => setIsConfirmingDelete(user)}
                        style={{ color: 'var(--danger)', padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(220, 53, 69, 0.1)', border: 'none', cursor: 'pointer' }}
                      >
                        <Trash2 size={18} />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1, backgroundColor: `${user.color}15`, color: user.color, borderColor: `${user.color}35`, boxShadow: `0 4px 12px ${user.color}15` }} 
                        whileTap={{ scale: 0.9 }}
                        className="icon-btn" title="Audit System Logs" 
                        onClick={() => runUserAuditSimulation(user)}
                        style={{ color: 'var(--text-muted)', padding: '8px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer', transition: 'all 0.2s ease' }}
                      >
                        <MoreVertical size={18} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      <AnimatePresence>
        {isCreatingUser && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCreatingUser(false)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--bg-card)', borderRadius: '32px', padding: '40px', position: 'relative', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-color)' }}
            >
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px' }}>Create New Account</h2>
                <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Provision system access for a new institutional member.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe"
                    style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Institutional Email</label>
                  <input 
                    type="email" 
                    placeholder="email@edupro.com"
                    style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Access Role</label>
                  <select 
                    style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="admin">Administrator</option>
                    <option value="teacher">Faculty / Teacher</option>
                    <option value="parent">Guardian / Parent</option>
                    <option value="student">Student</option>
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Profile Picture URL</label>
                  <input 
                    type="text" 
                    placeholder="https://images.unsplash.com/... (optional)"
                    style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                    value={newUser.profilePic}
                    onChange={(e) => setNewUser({...newUser, profilePic: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                <button 
                  className="btn" 
                  onClick={() => setIsCreatingUser(false)}
                  style={{ flex: 1, padding: '16px', borderRadius: '16px', fontWeight: 800, border: '1px solid var(--border-color)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    if (!newUser.name || !newUser.email) {
                      showToast("Please fill in all user profile details.", "error", "Missing Information");
                      return;
                    }
                    const createdUser = {
                      ...newUser,
                      id: Date.now(),
                      status: 'active',
                      lastLogin: 'Just now',
                      avatar: newUser.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U',
                      color: getRoleColor(newUser.role)
                    };
                    const updated = [createdUser, ...users];
                    setUsers(updated);
                    localStorage.setItem('edupro_users_list', JSON.stringify(updated));
                    setIsCreatingUser(false);
                    showToast(`Provisioned new ${newUser.role} account for ${newUser.name}.`, "success", "User Created");
                    setNewUser({ name: '', email: '', role: 'student', profilePic: '' });
                  }}
                  style={{ flex: 1, padding: '16px', borderRadius: '16px', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                >
                  Create Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditingUser(null)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--bg-card)', borderRadius: '32px', padding: '40px', position: 'relative', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-color)' }}
            >
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px' }}>Edit Account</h2>
                <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Update institutional profile and access levels.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Full Name</label>
                  <input 
                    type="text" 
                    style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Email Address</label>
                  <input 
                    type="email" 
                    style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Access Role</label>
                  <select 
                    style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  >
                    <option value="admin">Administrator</option>
                    <option value="teacher">Faculty / Teacher</option>
                    <option value="parent">Guardian / Parent</option>
                    <option value="student">Student</option>
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Profile Picture URL</label>
                  <input 
                    type="text" 
                    placeholder="https://images.unsplash.com/... (optional)"
                    style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                    value={editingUser.profilePic || ''}
                    onChange={(e) => setEditingUser({...editingUser, profilePic: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Account Status</label>
                  <select 
                    style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                <button 
                  className="btn" 
                  onClick={() => setEditingUser(null)}
                  style={{ flex: 1, padding: '16px', borderRadius: '16px', fontWeight: 800, border: '1px solid var(--border-color)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    const updated = users.map(u => u.id === editingUser.id ? editingUser : u);
                    setUsers(updated);
                    localStorage.setItem('edupro_users_list', JSON.stringify(updated));
                    setEditingUser(null);
                    showToast(`Updated access parameters for ${editingUser.name}.`, "success", "Account Updated");
                  }}
                  style={{ flex: 1, padding: '16px', borderRadius: '16px', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isConfirmingDelete && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsConfirmingDelete(null)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg-card)', borderRadius: '32px', padding: '40px', position: 'relative', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-color)', textAlign: 'center' }}
            >
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(220, 53, 69, 0.1)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Trash2 size={40} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px' }}>Confirm Deletion</h2>
              <p style={{ color: 'var(--text-muted)', fontWeight: 500, marginBottom: '32px' }}>
                Are you sure you want to delete <strong>{isConfirmingDelete.name}</strong>? This action cannot be undone.
              </p>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button 
                  className="btn" 
                  onClick={() => setIsConfirmingDelete(null)}
                  style={{ flex: 1, padding: '16px', borderRadius: '16px', fontWeight: 800, border: '1px solid var(--border-color)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  className="btn" 
                  onClick={() => {
                    const updated = users.filter(u => u.id !== isConfirmingDelete.id);
                    setUsers(updated);
                    localStorage.setItem('edupro_users_list', JSON.stringify(updated));
                    showToast(`Permanently revoked access for ${isConfirmingDelete.name}.`, "warning", "Account Revoked");
                    setIsConfirmingDelete(null);
                  }}
                  style={{ flex: 1, padding: '16px', borderRadius: '16px', fontWeight: 800, backgroundColor: 'var(--danger)', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* User Security Audit & Diagnostics Console */}
      <AnimatePresence>
        {selectedAuditUser && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAuditUser(null)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(12px)' }}
            />
            
             <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ 
                position: 'relative', width: '100%', maxWidth: '640px', 
                backgroundColor: '#0a0e17', borderRadius: '32px', padding: '40px', 
                boxShadow: `0 30px 100px ${userColor}25`,
                border: `1px solid ${userColor}50`,
                color: '#f8fafc',
                overflow: 'hidden',
                zIndex: 10
              }}
            >
              {/* Glow Accent */}
              <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '150px', background: `radial-gradient(circle, ${userColor}30 0%, transparent 70%)`, pointerEvents: 'none' }} />

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ position: 'relative', width: '48px', height: '48px', flexShrink: 0 }}>
                    <img 
                      src={selectedAuditUser.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedAuditUser.name)}&backgroundType=gradientLinear&fontFamily=Arial,Helvetica,sans-serif&fontSize=42&fontWeight=700`}
                      alt={selectedAuditUser.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedAuditUser.name)}&backgroundType=gradientLinear&fontFamily=Arial,Helvetica,sans-serif&fontSize=42&fontWeight=700`;
                      }}
                      style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '16px', 
                        objectFit: 'cover', 
                        border: `2px solid ${userColor}`,
                        boxShadow: `0 8px 16px ${userColor}30`,
                        backgroundColor: `${userColor}20`
                      }} 
                    />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 950, letterSpacing: '-0.5px' }}>{selectedAuditUser.name} Audit Logs</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Granular access vectors & security posture diagnostics</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAuditUser(null)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#cbd5e1' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Status Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px', position: 'relative', zIndex: 2 }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', fontWeight: 800, textTransform: 'uppercase' }}>Account Role</span>
                  <strong style={{ fontSize: '1rem', color: userColor, fontWeight: 900, textTransform: 'uppercase' }}>{selectedAuditUser.role}</strong>
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', fontWeight: 800, textTransform: 'uppercase' }}>Account Status</span>
                  <strong style={{ fontSize: '1rem', color: selectedAuditUser.status === 'active' ? '#10b981' : '#ef4444', fontWeight: 900 }}>
                    {selectedAuditUser.status === 'active' ? 'Active' : 'Suspended'}
                  </strong>
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', fontWeight: 800, textTransform: 'uppercase' }}>Security Integrity</span>
                  <strong style={{ fontSize: '1rem', color: '#10b981', fontWeight: 950 }}>Secure YTD</strong>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: '24px', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, marginBottom: '8px', color: '#cbd5e1' }}>
                  <span>Handshake & Encryption Audit</span>
                  <span style={{ color: userColor }}>{auditProgress}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${auditProgress}%` }}
                    transition={{ duration: 0.2 }}
                    style={{ height: '100%', background: `linear-gradient(90deg, ${userColor} 0%, #a855f7 100%)`, borderRadius: '100px', boxShadow: `0 0 10px ${userColor}50` }}
                  />
                </div>
              </div>

              {/* Monospace Console Log */}
              <div style={{ 
                height: '160px', backgroundColor: '#05070c', borderRadius: '20px', 
                padding: '20px', border: '1px solid rgba(255,255,255,0.08)', 
                overflowY: 'auto', display: 'flex', flexDirection: 'column', 
                gap: '8px', fontFamily: '"Fira Code", monospace, "Courier New"', fontSize: '0.8rem', 
                lineHeight: 1.5, color: '#a7f3d0', marginBottom: '28px'
              }}>
                {auditLogs.map((log, idx) => (
                  <div key={idx} style={{ 
                    color: log.includes('finalized') ? '#34d399' : log.includes('Verifying') ? '#3b82f6' : log.includes('OS core') ? '#fbbf24' : '#a7f3d0'
                  }}>
                    {log}
                  </div>
                ))}
                
                {isAuditingUser && (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center', color: userColor, fontWeight: 700, fontSize: '0.75rem', marginTop: '4px' }}>
                    <span style={{ width: '6px', height: '6px', backgroundColor: userColor, borderRadius: '50%' }}></span>
                    SCANNING CRYPTO TOKENS...
                  </div>
                )}
              </div>

              {/* Quick Admin Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Granular Access Controls</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button 
                    disabled={isAuditingUser}
                    onClick={() => {
                      const updatedStatus = selectedAuditUser.status === 'active' ? 'suspended' : 'active';
                      const updatedUser = { ...selectedAuditUser, status: updatedStatus };
                      setSelectedAuditUser(updatedUser);
                      const updatedUsers = users.map(u => u.id === selectedAuditUser.id ? updatedUser : u);
                      setUsers(updatedUsers);
                      localStorage.setItem('edupro_users_list', JSON.stringify(updatedUsers));
                      showToast(`Account for ${selectedAuditUser.name} has been ${updatedStatus}.`, updatedStatus === 'active' ? "success" : "warning", "Status Shifted");
                      setAuditLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Status Override triggered: Account marked ${updatedStatus.toUpperCase()}.`]);
                    }}
                    style={{ 
                      padding: '12px', borderRadius: '12px', 
                      border: `1px solid ${selectedAuditUser.status === 'active' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`, 
                      backgroundColor: selectedAuditUser.status === 'active' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                      color: selectedAuditUser.status === 'active' ? '#f87171' : '#34d399', 
                      fontWeight: 800, fontSize: '0.8rem', 
                      cursor: isAuditingUser ? 'not-allowed' : 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                  >
                    {selectedAuditUser.status === 'active' ? 'Suspend Session' : 'Activate Session'}
                  </button>
                  <button 
                    disabled={isAuditingUser}
                    onClick={() => {
                      showToast(`Dispatched secure password reset ticket to ${selectedAuditUser.email}.`, "success", "Ticket Emailed");
                      setAuditLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Dynamic ticket generated. Token dispatched to MFA vector.`]);
                    }}
                    style={{ 
                      padding: '12px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)', 
                      backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', fontWeight: 800, fontSize: '0.8rem', 
                      cursor: isAuditingUser ? 'not-allowed' : 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                  >
                    Force MFA / Reset
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }}>
                <button 
                  onClick={() => setSelectedAuditUser(null)}
                  style={{ padding: '14px 28px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: '#cbd5e1', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', transition: '0.2s' }}
                >
                  Close Console
                </button>
                 <motion.button 
                  whileHover={isAuditingUser ? {} : { scale: 1.05, translateY: -2, boxShadow: `0 12px 24px ${userColor}50` }}
                  whileTap={isAuditingUser ? {} : { scale: 0.95 }}
                  disabled={isAuditingUser}
                  onClick={() => runUserAuditSimulation(selectedAuditUser)}
                  className="btn"
                  style={{ 
                    padding: '14px 24px', borderRadius: '14px', border: 'none', 
                    background: `linear-gradient(135deg, ${userColor} 0%, #8B5CF6 100%)`, 
                    color: '#ffffff', 
                    fontWeight: 900, fontSize: '0.85rem', cursor: isAuditingUser ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px', 
                    boxShadow: `0 8px 20px ${userColor}35`,
                    transition: 'box-shadow 0.2s ease, opacity 0.2s ease',
                    opacity: isAuditingUser ? 0.6 : 1
                  }}
                >
                  <Sparkles size={16} style={{ animation: isAuditingUser ? 'spin 1.5s linear infinite' : 'none' }} /> 
                  <span>{isAuditingUser ? 'Auditing Telemetry...' : 'Re-run Security Audit'}</span>
                </motion.button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Glassmorphic Toast Notification Drawer */}
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
                  : toast.type === 'warning'
                  ? 'rgba(245, 158, 11, 0.15)'
                  : 'rgba(99, 102, 241, 0.15)',
                color: toast.type === 'success' 
                  ? '#34d399' 
                  : toast.type === 'error' 
                  ? '#f87171'
                  : toast.type === 'warning'
                  ? '#fbbf24'
                  : '#818cf8',
                flexShrink: 0,
              }}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 size={20} />
              ) : toast.type === 'error' ? (
                <AlertCircle size={20} />
              ) : toast.type === 'warning' ? (
                <Clock size={20} />
              ) : (
                <Sparkles size={20} />
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              {toast.title && (
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                  {toast.title}
                </h4>
              )}
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500, color: '#cbd5e1', lineHeight: 1.4 }}>
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
    </motion.div>
  );
};

export default Users;
