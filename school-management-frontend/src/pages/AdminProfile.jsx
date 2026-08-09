import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Shield, ShieldCheck, Key, 
  Clock, Activity, MapPin, Calendar, Camera,
  Edit, Bell, Globe, Lock, CheckCircle, Award, Settings, X, Loader2, Save
} from 'lucide-react';

import indianMan1 from '../assets/indian_man_portrait_1.png';
const eleanorAvatar = indianMan1;


const AdminProfile = () => {
  const navigate = useNavigate();
  
  // State variables for interactive elements
  const [avatar, setAvatar] = useState(eleanorAvatar);
  const [coverImage, setCoverImage] = useState(null);
  const [toast, setToast] = useState(null);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Credentials Form State
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirmPass: ''
  });

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Trigger feedback toasts
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Profile data
  const adminData = {
    name: 'Aarav Sharma',
    role: 'Super Admin',
    id: 'ADM-2026-001',
    email: 'admin@school.com',
    phone: '+91 98765 43210',
    location: 'Delhi, India',
    joinDate: '12 January 2024',
    lastLogin: '10 mins ago',
    permissions: ['Full Access', 'Financial Management', 'System Config', 'User Control']
  };

  // Handle Avatar Selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        triggerToast("Profile picture updated successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Cover Selection
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
        triggerToast("Cover banner updated successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Credentials Save
  const handleUpdateCredentials = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.newPass || !passwords.confirmPass) {
      triggerToast("Please fill in all password fields.", "error");
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      triggerToast("New password and confirmation do not match.", "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowCredentialsModal(false);
      setPasswords({ current: '', newPass: '', confirmPass: '' });
      triggerToast("Security credentials successfully updated!", "success");
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      style={{ paddingBottom: '40px', position: 'relative' }}
    >
      
      {/* Dynamic Feedback Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{ 
              position: 'fixed', 
              top: '24px', 
              right: '24px', 
              zIndex: 9999, 
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)',
              padding: '16px 24px',
              borderRadius: '20px',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              backgroundColor: toast.type === 'success' ? '#10b98125' : '#ef444425',
              color: toast.type === 'success' ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {toast.type === 'success' ? <CheckCircle size={16} /> : <X size={16} />}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{toast.type === 'success' ? 'Action Completed' : 'Action Failed'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{toast.message}</div>
            </div>
            <button 
              onClick={() => setToast(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '12px' }}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Inputs for Interactive Photo Changes */}
      <input 
        type="file" 
        ref={avatarInputRef} 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={handleAvatarChange}
      />
      <input 
        type="file" 
        ref={coverInputRef} 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={handleCoverChange}
      />

      {/* Profile Header Card */}
      <div className="card" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', border: 'none', marginBottom: '32px' }}>
         <div style={{ 
           height: '180px', 
           backgroundImage: coverImage ? `url(${coverImage})` : 'none',
           backgroundColor: coverImage ? 'transparent' : 'var(--primary)', 
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           position: 'relative',
           transition: 'all 0.3s ease'
         }}>
            <div style={{ position: 'absolute', bottom: '-60px', left: '40px', display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
               <div style={{ 
                 width: '120px', height: '120px', borderRadius: '32px', backgroundColor: 'white', 
                 padding: '6px', boxShadow: 'var(--shadow-lg)', position: 'relative'
               }}>
                  <div style={{ 
                    width: '100%', height: '100%', borderRadius: '26px', backgroundColor: 'var(--primary-light)', 
                    overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    border: '4px solid white' 
                  }}>
                    <img 
                      src={avatar} 
                      alt={adminData.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <button 
                    onClick={() => avatarInputRef.current.click()}
                    style={{ 
                      position: 'absolute', bottom: '8px', right: '8px', width: '32px', height: '32px', 
                      borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: 'none', 
                      boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      cursor: 'pointer', color: 'var(--primary)', transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Camera size={16} />
                  </button>
               </div>
               <div style={{ marginBottom: '12px' }}>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>{adminData.name}</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem' }}>
                     <ShieldCheck size={16} /> {adminData.role}
                  </div>
               </div>
            </div>
            <button 
              onClick={() => coverInputRef.current.click()}
              className="btn" 
              style={{ position: 'absolute', bottom: '20px', right: '30px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 800 }}
            >
               <Edit size={18} /> Edit Cover
            </button>
         </div>
         <div style={{ height: '80px' }}></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
         
         {/* Left Column - Quick Info */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="card" style={{ padding: '24px' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <User size={18} color="var(--primary)" /> Profile Info
               </h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    { icon: <Mail size={16} />, label: 'Email Address', value: adminData.email },
                    { icon: <Phone size={16} />, label: 'Phone Number', value: adminData.phone },
                    { icon: <MapPin size={16} />, label: 'Location', value: adminData.location },
                    { icon: <Calendar size={16} />, label: 'Joined On', value: adminData.joinDate }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '14px' }}>
                       <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{item.icon}</div>
                       <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>{item.label}</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.value}</div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="card" style={{ padding: '24px', backgroundColor: 'var(--primary)', color: 'white', border: 'none' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Award size={18} /> Achievements
               </h3>
               <p style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '20px' }}>
                  Supervising over 40 faculty members and managing institutional growth since 2024.
               </p>
               <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800 }}>Admin of Year</div>
                  <div style={{ padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800 }}>Certified Expert</div>
               </div>
            </div>
         </div>

         {/* Right Column - Security & Activity */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Permissions & Security */}
            <div className="card" style={{ padding: '24px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                     <Lock size={18} color="#f59e0b" /> Access & Security
                  </h3>
                  <button 
                    onClick={() => setShowCredentialsModal(true)}
                    className="btn" 
                    style={{ padding: '8px 16px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.8rem' }}
                  >
                    Update Credentials
                  </button>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                     <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>Active Permissions</div>
                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {adminData.permissions.map((p, i) => (
                           <span key={i} style={{ padding: '6px 12px', backgroundColor: 'var(--bg-body)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid var(--border-color)' }}>
                              {p}
                           </span>
                        ))}
                     </div>
                  </div>
                  <div>
                     <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>Security Status</div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                           <CheckCircle size={16} color="var(--success)" />
                           <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>2FA Authentication Enabled</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                           <Clock size={16} color="var(--primary)" />
                           <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Last Login: {adminData.lastLogin}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="card" style={{ padding: '24px' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Activity size={18} color="var(--danger)" /> Recent Log Actions
               </h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {[
                    { action: 'Updated System Settings', target: 'School Profile', time: '2 hours ago', icon: <Settings size={14} />, color: '#4880FF' },
                    { action: 'Approved Leave Request', target: 'Robert Fox', time: '4 hours ago', icon: <CheckCircle size={14} />, color: '#10B981' },
                    { action: 'Modified Fee Structure', target: 'Admission 2026', time: 'Yesterday', icon: <Globe size={14} />, color: '#F59E0B' },
                    { action: 'Added New Faculty', target: 'Physics Dept', time: '2 days ago', icon: <User size={14} />, color: '#8B5CF6' }
                  ].map((log, i) => (
                    <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: i === 3 ? 'none' : '1px solid var(--border-color)' }}>
                       <div style={{ 
                         width: '36px', height: '36px', borderRadius: '10px', backgroundColor: `${log.color}15`, 
                         color: log.color, display: 'flex', alignItems: 'center', justifyContent: 'center' 
                       }}>
                          {log.icon}
                       </div>
                       <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{log.action}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Target: {log.target}</div>
                       </div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>{log.time}</div>
                    </div>
                  ))}
               </div>
               <button 
                 onClick={() => {
                   triggerToast("Redirecting to access audit logs...", "info");
                   setTimeout(() => navigate('/dashboard/security-logs'), 800);
                 }}
                 className="btn" 
                 style={{ width: '100%', marginTop: '16px', backgroundColor: 'var(--bg-body)', color: 'var(--text-muted)', fontWeight: 800 }}
               >
                  VIEW FULL SYSTEM LOG
               </button>
            </div>

         </div>

      </div>

      {/* Interactive Credentials Change Modal */}
      <AnimatePresence>
        {showCredentialsModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            
            {/* Modal Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCredentialsModal(false)}
              style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                backgroundColor: 'rgba(15,23,42,0.6)', 
                backdropFilter: 'blur(8px)',
                zIndex: -1
              }} 
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '32px',
                padding: '40px',
                width: '450px',
                maxWidth: '100%',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-xl)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Key size={20} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>Update Credentials</h3>
                </div>
                <button 
                  onClick={() => setShowCredentialsModal(false)}
                  style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleUpdateCredentials} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Current Password</label>
                  <input 
                    type="password"
                    value={passwords.current}
                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600, outline: 'none' }}
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>New Password</label>
                  <input 
                    type="password"
                    value={passwords.newPass}
                    onChange={e => setPasswords({ ...passwords, newPass: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600, outline: 'none' }}
                    placeholder="Minimum 8 characters"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Confirm New Password</label>
                  <input 
                    type="password"
                    value={passwords.confirmPass}
                    onChange={e => setPasswords({ ...passwords, confirmPass: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600, outline: 'none' }}
                    placeholder="Repeat new password"
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button 
                    type="button"
                    onClick={() => setShowCredentialsModal(false)}
                    style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    style={{ 
                      flex: 2, padding: '14px', borderRadius: '14px', border: 'none', 
                      backgroundColor: 'var(--primary)', color: 'white', fontWeight: 800, 
                      fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', 
                      justifyContent: 'center', gap: '8px' 
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Updating...
                      </>
                    ) : (
                      <>
                        <Save size={16} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default AdminProfile;
