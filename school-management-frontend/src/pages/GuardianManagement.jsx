import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, UserPlus, Search, Filter, Mail, Phone, Shield, 
  Key, RefreshCw, Trash2, MoreVertical, CircleCheck, 
  CircleX, Clock, Link as LinkIcon, ExternalLink
} from 'lucide-react';
import indianMan1 from '../assets/indian_man_portrait_1.png';
import indianMan2 from '../assets/indian_man_portrait_2.png';
import indianWoman1 from '../assets/indian_woman_portrait_1.png';
import indianWoman2 from '../assets/indian_woman_portrait_2.png';

const GuardianManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const guardians = [
    { 
      id: 1, name: 'Rajesh Verma', email: 'rajesh.v@example.com', phone: '+91 98765 43299', 
      students: ['Aman Verma'], status: 'active', lastLogin: '2 hours ago', 
      role: 'parent', avatar: 'RV', avatarUrl: indianMan1 
    },
    { 
      id: 2, name: 'Meeta Devi', email: 'meeta.d@example.com', phone: '+91 98765 43296', 
      students: ['Divya Joshi'], status: 'active', lastLogin: '1 day ago', 
      role: 'guardian', avatar: 'MD', avatarUrl: indianWoman1
    },
    { 
      id: 3, name: 'Sanjay Gupta', email: 'sanjay.g@example.com', phone: '+91 98765 43297', 
      students: ['Karan Mehta'], status: 'suspended', lastLogin: '5 days ago', 
      role: 'parent', avatar: 'SG', avatarUrl: indianMan2
    },
    { 
      id: 4, name: 'Priya Patel', email: 'priya.p@example.com', phone: '+91 98765 43294', 
      students: ['Neha Sharma'], status: 'active', lastLogin: '30 mins ago', 
      role: 'parent', avatar: 'PP', avatarUrl: indianWoman2
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>Guardian Login Administration</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>Manage parent/guardian accounts, login credentials, and student associations.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px' }}>
            <UserPlus size={18} /> Invite Guardian
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {[
          { label: 'Total Guardians', value: '840', color: 'var(--primary)', icon: Users },
          { label: 'Active Sessions', value: '124', color: 'var(--success)', icon: Activity },
          { label: 'Pending Invites', value: '15', color: '#f59e0b', icon: Clock },
          { label: 'Suspended Accounts', value: '3', color: 'var(--danger)', icon: Shield }
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon && <stat.icon size={20} />}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>{stat.label}</p>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="card" style={{ padding: '24px', borderRadius: '20px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', gap: '20px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, phone or student..." 
              style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 500 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn" style={{ border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px' }}>
              <Filter size={18} /> Filter
            </button>
            <button className="btn" style={{ border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px' }}>
              <RefreshCw size={18} /> Sync
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th style={{ padding: '0 12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Guardian Details</th>
                <th style={{ padding: '0 12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Linked Students</th>
                <th style={{ padding: '0 12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Login Status</th>
                <th style={{ padding: '0 12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Last Active</th>
                <th style={{ padding: '0 12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {guardians.map(guardian => (
                <tr key={guardian.id}>
                  <td style={{ padding: '16px 12px', backgroundColor: 'var(--bg-body)', borderRadius: '16px 0 0 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, overflow: 'hidden' }}>
                        {guardian.avatarUrl ? (
                          <img src={guardian.avatarUrl} alt={guardian.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : guardian.avatar}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>{guardian.name}</h4>
                        <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{guardian.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px', backgroundColor: 'var(--bg-body)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {guardian.students.map((student, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>
                          <LinkIcon size={12} /> {student}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px', backgroundColor: 'var(--bg-body)' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800,
                      color: guardian.status === 'active' ? 'var(--success)' : 'var(--danger)',
                      backgroundColor: guardian.status === 'active' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                      padding: '4px 10px', borderRadius: '8px', textTransform: 'capitalize'
                    }}>
                      {guardian.status === 'active' ? <CircleCheck size={12} /> : <CircleX size={12} />}
                      {guardian.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px', backgroundColor: 'var(--bg-body)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      <Clock size={14} /> {guardian.lastLogin}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px', backgroundColor: 'var(--bg-body)', borderRadius: '0 16px 16px 0', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button className="icon-btn" title="Reset Password" style={{ color: '#f59e0b', padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}><Key size={18} /></button>
                      <button className="icon-btn" title="View Details" style={{ color: 'var(--primary)', padding: '8px', borderRadius: '10px', backgroundColor: 'var(--primary-light)' }}><ExternalLink size={18} /></button>
                      <button className="icon-btn" title="Delete Account" style={{ color: 'var(--danger)', padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(220, 53, 69, 0.1)' }}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action Footer */}
      <div className="card" style={{ padding: '20px', borderRadius: '20px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--primary-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Shield size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>Security Audit Required</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>There are 12 guardian accounts without two-factor authentication enabled.</p>
          </div>
        </div>
        <button className="btn btn-primary" style={{ padding: '8px 20px', borderRadius: '10px' }}>Run Security Check</button>
      </div>
    </motion.div>
  );
};

const Activity = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);

export default GuardianManagement;
