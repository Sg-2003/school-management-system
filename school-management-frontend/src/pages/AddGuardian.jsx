import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Save, User, MapPin, 
  Shield, Users, Camera, Upload,
  CheckCircle2, AlertCircle,
  Check, RotateCw, ZoomIn, ZoomOut, Loader2, Info
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const AddGuardian = ({ mode = 'add' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const [activeStep, setActiveStep] = useState(1);
  const [toast, setToast] = useState(null); // { type: 'success' | 'info', message: '' }

  // Cropper states
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropperImage, setCropperImage] = useState(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropRotation, setCropRotation] = useState(0);

  // Verification overlay state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState(0);

  // Form State initialized synchronously (best practice)
  const [formData, setFormData] = useState(() => {
    // 1. Initial Load of Guardians list in localStorage if not exist
    if (!localStorage.getItem('guardians')) {
      const defaultList = [
        {
          id: 'GDN-2026-001', name: 'Rajesh Verma', email: 'rajesh.v@example.com', phone: '+91 98765 43299',
          students: ['Aman Verma'], status: 'active', lastLogin: '2 hours ago',
          role: 'Parent', avatar: 'RV', address: 'Block C, Sector 62, Noida, UP 201301',
          relation: 'Father', occupation: 'Senior Software Architect', company: 'Tech Solutions India',
          dob: '1980-03-15', gender: 'Male', emergencyContact: '+91 98765 43290',
          username: 'rajesh_verma', img: 'https://api.dicebear.com/7.x/initials/svg?seed=Rajesh%20Verma',
          linkedStudents: [
            { id: 'STU101', name: 'Aman Verma', grade: '10A', attendance: '98%', perf: 'A+' },
            { id: 'STU108', name: 'Neha Sharma', grade: '12C', attendance: '95%', perf: 'B+' }
          ]
        },
        {
          id: 'GDN-2026-002', name: 'Meeta Devi', email: 'meeta.d@example.com', phone: '+91 98765 43296',
          students: ['Divya Joshi', 'Rohan Das'], status: 'active', lastLogin: '1 day ago',
          role: 'Guardian', avatar: 'MD', address: 'Preet Vihar, New Delhi 110092',
          relation: 'Mother', occupation: 'Principal Consultant', company: 'Devi & Associates',
          dob: '1983-07-22', gender: 'Female', emergencyContact: '+91 98765 43290',
          username: 'meeta_d', img: 'https://api.dicebear.com/7.x/initials/svg?seed=Meeta%20Devi',
          linkedStudents: [
            { id: 'STU102', name: 'Divya Joshi', grade: '11A', attendance: '92%', perf: 'A-' },
            { id: 'STU103', name: 'Rohan Das', grade: '10A', attendance: '89%', perf: 'B' }
          ]
        }
      ];
      localStorage.setItem('guardians', JSON.stringify(defaultList));
    }

    const currentId = mode === 'edit' ? (id || 'GDN-2026-001') : 'new';
    const draftKey = 'guardian_draft_' + currentId;
    const savedDraft = localStorage.getItem(draftKey);

    if (savedDraft) {
      return JSON.parse(savedDraft);
    }

    if (mode === 'edit') {
      const targetId = id || 'GDN-2026-001';
      const parsedGuardians = JSON.parse(localStorage.getItem('guardians') || '[]');
      const found = parsedGuardians.find(function(g) { return g.id === targetId; });

      if (found) {
        const names = found.name.split(' ');
        const firstName = names[0] || '';
        const lastName = names.slice(1).join(' ') || '';
        return {
          firstName: firstName,
          lastName: lastName,
          relation: found.relation || 'Father',
          occupation: found.occupation || 'Senior Software Architect',
          company: found.company || 'Tech Solutions India',
          dob: found.dob || '1980-03-15',
          gender: found.gender || 'Male',
          email: found.email || 'rajesh.v@example.com',
          phone: found.phone || '+91 98765 43299',
          address: found.address || 'Block C, Sector 62, Noida, UP 201301',
          emergencyContact: found.emergencyContact || '+91 98765 43290',
          username: found.username || 'rajesh_verma',
          password: '...',
          img: found.avatarUrl || found.img || 'https://api.dicebear.com/7.x/initials/svg?seed=Rajesh%20Verma',
          linkedStudents: found.linkedStudents || [
            { id: 'STU101', name: 'Aman Verma', grade: '10A', attendance: '98%', perf: 'A+' }
          ]
        };
      }
    }

    return {
      firstName: '',
      lastName: '',
      relation: 'Father',
      occupation: '',
      company: '',
      dob: '',
      gender: 'Male',
      email: '',
      phone: '',
      address: '',
      emergencyContact: '',
      username: '',
      password: '',
      img: '',
      linkedStudents: [
        { id: 'STU101', name: 'Aman Verma', grade: '10A', attendance: '98%', perf: 'A+' }
      ]
    };
  });

  const [hasDraft, setHasDraft] = useState(() => {
    const currentId = mode === 'edit' ? (id || 'GDN-2026-001') : 'new';
    return localStorage.getItem(`guardian_draft_${currentId}`) !== null;
  });

  // Student search/association state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Steps for progress
  const steps = [
    { id: 1, name: 'Basic Info', icon: <User size={18} /> },
    { id: 2, name: 'Contact & Address', icon: <MapPin size={18} /> },
    { id: 3, name: 'Student Link', icon: <Users size={18} /> },
    { id: 4, name: 'Credentials', icon: <Shield size={18} /> }
  ];

  // Helper to show toasts
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Toast confirmation of draft restoration on mount
  useEffect(() => {
    const currentId = mode === 'edit' ? (id || 'GDN-2026-001') : 'new';
    const draftKey = `guardian_draft_${currentId}`;
    if (localStorage.getItem(draftKey)) {
      const timer = setTimeout(() => {
        showToast('info', 'Restored draft profile from local storage.');
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [mode, id]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Draft Persistence Flow
  const handleSaveDraft = () => {
    const currentId = mode === 'edit' ? (id || 'GDN-2026-001') : 'new';
    localStorage.setItem(`guardian_draft_${currentId}`, JSON.stringify(formData));
    setHasDraft(true);
    showToast('success', 'Draft saved locally. You can resume this session later.');
  };

  const handleClearDraft = () => {
    const currentId = mode === 'edit' ? (id || 'GDN-2026-001') : 'new';
    localStorage.removeItem(`guardian_draft_${currentId}`);
    setHasDraft(false);
    showToast('info', 'Cleared saved draft.');
    if (mode !== 'edit') {
      // reset form
      setFormData({
        firstName: '',
        lastName: '',
        relation: 'Father',
        occupation: '',
        company: '',
        dob: '',
        gender: 'Male',
        email: '',
        phone: '',
        address: '',
        emergencyContact: '',
        username: '',
        password: '',
        img: '',
        linkedStudents: [
          { id: 'STU101', name: 'Aman Verma', grade: '10A', attendance: '98%', perf: 'A+' }
        ]
      });
    }
  };

  // Photo Uploader Flow
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('info', 'File exceeds 2MB limit. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCropperImage(event.target.result);
      setCropZoom(1);
      setCropRotation(0);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = () => {
    const img = new Image();
    img.src = cropperImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 300; // Circular output size
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      ctx.translate(size / 2, size / 2);
      ctx.rotate((cropRotation * Math.PI) / 180);
      
      const drawWidth = size * cropZoom;
      const drawHeight = size * cropZoom;
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

      const base64Img = canvas.toDataURL('image/jpeg', 0.85);
      handleInputChange('img', base64Img);
      setIsCropModalOpen(false);
      showToast('success', 'Profile photo adjusted and applied.');
    };
  };

  // Student association searches
  const handleStudentSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    
    // Simulate lookup of mock students
    setTimeout(() => {
      const mockStudents = [
        { id: 'STU101', name: 'Aman Verma', grade: '10A', attendance: '98%', perf: 'A+' },
        { id: 'STU108', name: 'Neha Sharma', grade: '12C', attendance: '96%', perf: 'A' },
        { id: 'STU102', name: 'Divya Joshi', grade: '11A', attendance: '92%', perf: 'A-' }
      ];
      
      const matched = mockStudents.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(matched);
      setIsSearching(false);
    }, 600);
  };

  const linkStudent = (student) => {
    if (formData.linkedStudents.some(s => s.id === student.id)) {
      showToast('info', `${student.name} is already linked.`);
      return;
    }
    setFormData(prev => ({
      ...prev,
      linkedStudents: [...prev.linkedStudents, student]
    }));
    setSearchResults([]);
    setSearchQuery('');
    showToast('success', `Linked student ${student.name} successfully.`);
  };

  const removeStudent = (studentId) => {
    setFormData(prev => ({
      ...prev,
      linkedStudents: prev.linkedStudents.filter(s => s.id !== studentId)
    }));
    showToast('info', 'Student link removed.');
  };

  // Submit / Finalize flow
  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    // Basic Validation
    if (!formData.firstName || !formData.lastName) {
      showToast('info', 'Please enter both first and last names.');
      setActiveStep(1);
      return;
    }
    if (!formData.email || !formData.phone) {
      showToast('info', 'Email and Phone number are required.');
      setActiveStep(2);
      return;
    }

    // Trigger timeline verification overlay
    setIsVerifying(true);
    setVerifyStep(0);
  };

  // Step timeline simulation
  useEffect(() => {
    if (!isVerifying) return;

    if (verifyStep < 4) {
      const timer = setTimeout(() => {
        setVerifyStep(prev => prev + 1);
      }, 1100);
      return () => clearTimeout(timer);
    } else {
      // Completed, commit the changes!
      const timer = setTimeout(() => {
        const targetId = mode === 'edit' ? (id || 'GDN-2026-001') : `GDN-2026-00${Math.floor(Math.random() * 900) + 10}`;
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        const avatarInitials = `${formData.firstName[0] || ''}${formData.lastName[0] || ''}`.toUpperCase() || 'GD';

        // 1. Update Guardians Directory
        const list = JSON.parse(localStorage.getItem('guardians') || '[]');
        const updatedRecord = {
          id: targetId,
          name: fullName,
          email: formData.email,
          phone: formData.phone,
          students: formData.linkedStudents.map(s => s.name),
          status: 'active',
          lastLogin: mode === 'edit' ? '30 mins ago' : 'Just now',
          role: formData.relation === 'Legal Guardian' ? 'Guardian' : 'Parent',
          avatar: avatarInitials,
          address: formData.address,
          relation: formData.relation,
          occupation: formData.occupation,
          company: formData.company,
          dob: formData.dob,
          gender: formData.gender,
          emergencyContact: formData.emergencyContact,
          username: formData.username || formData.email.split('@')[0],
          img: formData.img || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
          avatarUrl: formData.img || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
          linkedStudents: formData.linkedStudents
        };

        const newList = mode === 'edit'
          ? list.map(g => g.id === targetId ? updatedRecord : g)
          : [updatedRecord, ...list];
        localStorage.setItem('guardians', JSON.stringify(newList));

        // 2. Add Access Audit Log
        const logsKey = `guardian_logs_${targetId}`;
        const savedLogs = localStorage.getItem(logsKey);
        let logList = [];
        if (savedLogs) {
          try {
            logList = JSON.parse(savedLogs);
          } catch (err) {
            console.error('Failed to parse log list', err);
          }
        }
        const now = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const logEntry = {
          id: Date.now(),
          date: `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()}`,
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: mode === 'edit' ? 'Profile Updated' : 'Registration Finalized',
          ip: '192.168.1.1',
          device: 'Chrome 124 / Windows 11',
          location: 'New Delhi, IN',
          status: 'Authorized',
          iconName: mode === 'edit' ? 'Edit' : 'BadgeCheck',
          color: '#10B981',
          details: mode === 'edit' ? 'Guardian profile information updated and synchronized.' : 'Guardian profile created, 2FA initialized, and student association verified.'
        };
        localStorage.setItem(logsKey, JSON.stringify([logEntry, ...logList]));

        // 3. Clear draft
        localStorage.removeItem(`guardian_draft_${mode === 'edit' ? targetId : 'new'}`);

        // 4. Close and redirect
        setIsVerifying(false);
        if (mode === 'edit') {
          navigate(`/dashboard/guardian-details/${targetId}`);
        } else {
          navigate('/dashboard/guardian-management');
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isVerifying, verifyStep, mode, id, formData, navigate]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      
      {/* Toast popup */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed', bottom: '36px', right: '36px', zIndex: 9999,
              backgroundColor: toast.type === 'success' ? '#10B981' : '#4880FF', color: 'white',
              padding: '16px 24px', borderRadius: '16px',
              display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 10px 30px -5px rgba(0,0,0,0.25)', fontWeight: 700,
              fontSize: '0.9rem'
            }}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <Info size={20} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Image Cropping Modal --- */}
      <AnimatePresence>
        {isCropModalOpen && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px'
          }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCropModalOpen(false)}
              style={{
                position: 'absolute', inset: 0,
                backgroundColor: 'rgba(15,23,42,0.7)',
                backdropFilter: 'blur(12px)'
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              style={{
                position: 'relative', width: '100%', maxWidth: '440px',
                backgroundColor: 'var(--bg-card)', borderRadius: '24px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 25px 60px -12px rgba(0,0,0,0.35)',
                overflow: 'hidden', padding: '28px'
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={20} color="var(--primary)" /> Adjust Guardian Photo
              </h3>

              {/* Cropper Container Box */}
              <div style={{
                width: '260px', height: '260px', margin: '0 auto 24px',
                borderRadius: '24px', overflow: 'hidden',
                position: 'relative', border: '2px solid var(--border-color)',
                backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <img
                  src={cropperImage}
                  alt="Source"
                  style={{
                    maxWidth: '100%', maxHeight: '100%',
                    transform: `scale(${cropZoom}) rotate(${cropRotation}deg)`,
                    transition: 'transform 0.1s ease',
                    objectFit: 'contain'
                  }}
                />
                {/* Circular Crop Overlay Ring */}
                <div style={{
                  position: 'absolute', inset: 0,
                  border: '3px solid var(--primary)', borderRadius: '50%',
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
                  pointerEvents: 'none'
                }} />
              </div>

              {/* Cropper Zoom Control Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <ZoomOut size={16} style={{ color: 'var(--text-muted)' }} />
                <input 
                  type="range" 
                  min="1" 
                  max="3" 
                  step="0.05"
                  value={cropZoom}
                  onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                  style={{
                    flex: 1, height: '6px', borderRadius: '3px',
                    accentColor: 'var(--primary)', cursor: 'pointer'
                  }}
                />
                <ZoomIn size={16} style={{ color: 'var(--text-muted)' }} />
              </div>

              {/* Rotation buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Rotate Counter-Clockwise</span>
                <button
                  onClick={() => setCropRotation(prev => (prev + 90) % 360)}
                  className="btn"
                  style={{
                    padding: '8px 16px', borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-body)',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    fontWeight: 700, fontSize: '0.8rem'
                  }}
                >
                  <RotateCw size={14} /> Rotate 90°
                </button>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setIsCropModalOpen(false)}
                  className="btn"
                  style={{
                    flex: 1, padding: '12px', borderRadius: '12px',
                    border: '1px solid var(--border-color)', fontWeight: 800
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropSave}
                  className="btn btn-primary"
                  style={{
                    flex: 1, padding: '12px', borderRadius: '12px',
                    fontWeight: 800, justifyContent: 'center'
                  }}
                >
                  Apply & Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Verification Timeline Processing Overlay --- */}
      <AnimatePresence>
        {isVerifying && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px'
          }}>
            {/* Dark glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'absolute', inset: 0,
                backgroundColor: 'rgba(10, 15, 30, 0.88)',
                backdropFilter: 'blur(20px)'
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              style={{
                position: 'relative', width: '100%', maxWidth: '520px',
                backgroundColor: 'var(--bg-card)', borderRadius: '32px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 30px 70px -15px rgba(0,0,0,0.4)',
                padding: '40px', textAlign: 'center'
              }}
            >
              {/* Progress Bar Header */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '6px',
                backgroundColor: 'var(--bg-body)', overflow: 'hidden', borderTopLeftRadius: '32px', borderTopRightRadius: '32px'
              }}>
                <div style={{
                  width: `${(verifyStep / 4) * 100}%`, height: '100%',
                  backgroundColor: 'var(--primary)', transition: 'all 0.5s ease-in-out'
                }} />
              </div>

              {/* Pulsing loading sphere */}
              <div style={{ position: 'relative', margin: '0 auto 28px', width: '80px', height: '80px' }}>
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  animation: 'pulse 1.8s infinite ease-in-out'
                }} />
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  backgroundColor: 'var(--primary)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'white',
                  position: 'relative', zIndex: 1
                }}>
                  {verifyStep === 4 ? <CheckCircle2 size={36} /> : <Loader2 size={36} style={{ animation: 'spin 1.2s linear infinite' }} />}
                </div>
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '8px' }}>
                {verifyStep === 4 ? 'Verification Completed' : 'Enforcing Security Protocol Checks'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '32px' }}>
                {verifyStep === 4 ? 'All checks successfully completed. Writing to database.' : 'Verifying profile credentials against institutional registers.'}
              </p>

              {/* Steps timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                {[
                  { label: 'Identity Credentials Verification', sub: 'Checking standard personal details and formats.' },
                  { label: 'Two-Factor (2FA) Setup Sync', sub: 'Enforcing active token mapping rules.' },
                  { label: 'Linked Student Directory Matching', sub: 'Linking active pupils and syncing permissions.' },
                  { label: 'Core Database Handshake Sync', sub: 'Writing record values to secure storage.' }
                ].map((step, idx) => {
                  const isDone = verifyStep > idx;
                  const isCurrent = verifyStep === idx;
                  return (
                    <div key={idx} style={{
                      display: 'flex', gap: '16px', alignItems: 'flex-start',
                      opacity: isDone || isCurrent ? 1 : 0.4,
                      transition: 'opacity 0.3s'
                    }}>
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        backgroundColor: isDone ? '#10B98115' : (isCurrent ? 'var(--primary-light)' : 'var(--bg-body)'),
                        color: isDone ? '#10B981' : (isCurrent ? 'var(--primary)' : 'var(--text-muted)'),
                        border: `1px solid ${isDone ? '#10B98130' : (isCurrent ? 'var(--primary)' : 'var(--border-color)')}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '0.75rem', flexShrink: 0, marginTop: '2px'
                      }}>
                        {isDone ? <Check size={14} strokeWidth={3} /> : (idx + 1)}
                      </div>
                      <div>
                        <div style={{
                          fontSize: '0.9rem', fontWeight: 800,
                          color: isDone ? '#10B981' : (isCurrent ? 'var(--text-main)' : 'var(--text-muted)')
                        }}>
                          {step.label}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 550, marginTop: '2px' }}>
                          {step.sub}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.3); opacity: 0; }
          100% { transform: scale(1); opacity: 0.4; }
        }
      `}</style>

      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <button onClick={() => navigate(-1)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontWeight: 700, padding: 0, background: 'none', marginBottom: '12px' }}>
            <ArrowLeft size={18} /> Back to Profile
          </button>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>
            {mode === 'edit' ? 'Edit Guardian Record' : 'Register New Guardian'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
            {mode === 'edit' ? `Updating profile for ${id || 'GDN-2026-001'}` : 'Initialize a new institutional guardian account.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {hasDraft && (
            <button 
              onClick={handleClearDraft} 
              className="btn" 
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                color: '#EF4444',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                fontWeight: 700, fontSize: '0.85rem'
              }}
            >
              Clear Draft
            </button>
          )}
          <button 
            onClick={handleSaveDraft}
            className="btn" 
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontWeight: 700 }}
          >
            Save Draft
          </button>
          <button 
            onClick={handleSubmit}
            className="btn btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}
          >
             <Save size={18} /> {mode === 'edit' ? 'Update Profile' : 'Finalize Registration'}
          </button>
        </div>
      </div>

      {/* Form and Sidebar Wrapper */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
         
         {/* Form card */}
         <div className="card" style={{ padding: '40px', borderRadius: '24px' }}>
            
            {/* Horizontal step indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '40px', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
               <div style={{ position: 'absolute', top: '24px', left: '40px', right: '40px', height: '2px', backgroundColor: 'var(--bg-body)', zIndex: 0 }}>
                  <div style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%`, height: '100%', backgroundColor: 'var(--primary)', transition: '0.5s' }}></div>
               </div>
               {steps.map(step => (
                 <div key={step.id} onClick={() => setActiveStep(step.id)} style={{ position: 'relative', zIndex: 1, textAlign: 'center', cursor: 'pointer', width: '100px' }}>
                    <div style={{ 
                      width: '48px', height: '48px', borderRadius: '16px', margin: '0 auto 12px',
                      backgroundColor: activeStep >= step.id ? 'var(--primary)' : 'var(--bg-card)',
                      color: activeStep >= step.id ? 'white' : 'var(--text-muted)',
                      border: activeStep >= step.id ? 'none' : '2px solid var(--border-color)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s'
                    }}>
                       {step.icon}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: activeStep >= step.id ? 'var(--text-main)' : 'var(--text-muted)' }}>{step.name}</div>
                 </div>
               ))}
            </div>

            {/* Step 1: Basic Info */}
            {activeStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '24px' }}>Personal Information</h3>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="form-group">
                       <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>First Name</label>
                       <input 
                         type="text" 
                         className="form-input" 
                         value={formData.firstName}
                         onChange={(e) => handleInputChange('firstName', e.target.value)}
                         placeholder="e.g. Rajesh" 
                       />
                    </div>
                    <div className="form-group">
                       <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Last Name</label>
                       <input 
                         type="text" 
                         className="form-input" 
                         value={formData.lastName}
                         onChange={(e) => handleInputChange('lastName', e.target.value)}
                         placeholder="e.g. Verma" 
                       />
                    </div>
                    <div className="form-group">
                       <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Relation to Student</label>
                       <select 
                         className="form-input"
                         value={formData.relation}
                         onChange={(e) => handleInputChange('relation', e.target.value)}
                       >
                          <option>Father</option>
                          <option>Mother</option>
                          <option>Step-Parent</option>
                          <option>Relative</option>
                          <option>Legal Guardian</option>
                       </select>
                    </div>
                    <div className="form-group">
                       <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Occupation</label>
                       <input 
                         type="text" 
                         className="form-input" 
                         value={formData.occupation}
                         onChange={(e) => handleInputChange('occupation', e.target.value)}
                         placeholder="e.g. Software Engineer" 
                       />
                    </div>
                    <div className="form-group">
                       <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Company / Employer</label>
                       <input 
                         type="text" 
                         className="form-input" 
                         value={formData.company}
                         onChange={(e) => handleInputChange('company', e.target.value)}
                         placeholder="e.g. TechCorp Solutions" 
                       />
                    </div>
                    <div className="form-group">
                       <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Date of Birth</label>
                       <input 
                         type="date" 
                         className="form-input" 
                         value={formData.dob}
                         onChange={(e) => handleInputChange('dob', e.target.value)}
                       />
                    </div>
                    <div className="form-group">
                       <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Emergency Contact Number</label>
                       <input 
                         type="tel" 
                         className="form-input" 
                         value={formData.emergencyContact}
                         onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                         placeholder="e.g. +1 (234) 567-8999" 
                       />
                    </div>
                    <div className="form-group">
                       <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Gender</label>
                       <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                             <input 
                               type="radio" 
                               name="gender" 
                               checked={formData.gender === 'Male'} 
                               onChange={() => handleInputChange('gender', 'Male')}
                             /> Male
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                             <input 
                               type="radio" 
                               name="gender" 
                               checked={formData.gender === 'Female'} 
                               onChange={() => handleInputChange('gender', 'Female')}
                             /> Female
                          </label>
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}

            {/* Step 2: Contact & Address */}
            {activeStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '24px' }}>Contact & Address Details</h3>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                    <div className="form-group">
                       <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Primary Email</label>
                       <input 
                         type="email" 
                         className="form-input" 
                         value={formData.email}
                         onChange={(e) => handleInputChange('email', e.target.value)}
                         placeholder="robert.w@example.com" 
                       />
                    </div>
                    <div className="form-group">
                       <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Phone Number</label>
                       <input 
                         type="tel" 
                         className="form-input" 
                         value={formData.phone}
                         onChange={(e) => handleInputChange('phone', e.target.value)}
                         placeholder="+1 234 567 8901" 
                       />
                    </div>
                 </div>
                 <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Residential Address</label>
                    <textarea 
                      className="form-input" 
                      style={{ height: '100px', resize: 'vertical' }} 
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Full street address, city, state, zip..."
                    />
                 </div>
              </motion.div>
            )}

            {/* Step 3: Linked Students */}
            {activeStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '24px' }}>Student Association</h3>
                 <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Search Student by Name or ID</label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                       <input 
                         type="text" 
                         className="form-input" 
                         placeholder="e.g. Wilson or STU-2026..." 
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && handleStudentSearch()}
                       />
                       <button 
                         onClick={handleStudentSearch}
                         className="btn btn-primary" 
                         style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: '6px' }}
                       >
                          {isSearching ? <Loader2 size={16} style={{ animation: 'spin 1.2s linear infinite' }} /> : 'Search'}
                       </button>
                    </div>
                 </div>

                 {/* Results List */}
                 {searchResults.length > 0 && (
                   <div style={{
                     marginTop: '12px', border: '1px solid var(--border-color)',
                     borderRadius: '16px', backgroundColor: 'var(--bg-body)', overflow: 'hidden'
                   }}>
                     <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', padding: '12px 16px', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase' }}>Search Results</div>
                     {searchResults.map(student => (
                       <div 
                         key={student.id} 
                         onClick={() => linkStudent(student)}
                         style={{
                           padding: '12px 16px', display: 'flex', justifyContent: 'space-between',
                           alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid var(--border-color)',
                           transition: '0.2s', backgroundColor: 'var(--bg-card)'
                         }}
                         className="hover-row"
                       >
                         <div>
                           <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{student.name}</div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{student.id} · Grade {student.grade}</div>
                         </div>
                         <button className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: '8px' }}>Link</button>
                       </div>
                     ))}
                   </div>
                 )}

                 {/* Associated Students table/list */}
                 <div style={{ marginTop: '32px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '16px', letterSpacing: '0.5px' }}>LINKED ACTIVE STUDENTS</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                       {formData.linkedStudents.map(student => (
                         <div key={student.id} style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                               <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                                 {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                               </div>
                               <div>
                                  <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{student.name}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Grade {student.grade} ({student.id}) · Perf: {student.perf}</div>
                               </div>
                            </div>
                            <button 
                              onClick={() => removeStudent(student.id)}
                              className="btn" 
                              style={{ padding: '6px 12px', color: 'var(--danger)', border: 'none', background: 'none', fontWeight: 700, fontSize: '0.8rem' }}
                            >
                              Remove Link
                            </button>
                         </div>
                       ))}
                       {formData.linkedStudents.length === 0 && (
                         <div style={{ textAlign: 'center', padding: '24px', border: '2px dashed var(--border-color)', borderRadius: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                           No students linked to this record yet.
                         </div>
                       )}
                    </div>
                 </div>
              </motion.div>
            )}

            {/* Step 4: Access Credentials */}
            {activeStep === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '24px' }}>Access Credentials</h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group">
                       <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Username</label>
                       <input 
                         type="text" 
                         className="form-input" 
                         value={formData.username}
                         onChange={(e) => handleInputChange('username', e.target.value)}
                         placeholder="robert_wilson" 
                       />
                    </div>
                    <div className="form-group">
                       <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Password</label>
                       <input 
                         type="password" 
                         className="form-input" 
                         value={formData.password}
                         onChange={(e) => handleInputChange('password', e.target.value)}
                         placeholder="********" 
                       />
                       <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>User will be prompted to change password on first login.</p>
                    </div>
                    
                    <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)', display: 'flex', gap: '12px' }}>
                       <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0 }} />
                       <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981', lineHeight: 1.4 }}>
                         Two-Factor Authentication (2FA) will be enforced for this account by default.
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}

            {/* Bottom Form Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--border-color)' }}>
               <button 
                 className="btn" 
                 disabled={activeStep === 1}
                 onClick={() => setActiveStep(prev => prev - 1)}
                 style={{ opacity: activeStep === 1 ? 0.5 : 1, fontWeight: 800, backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}
               >
                  Previous Step
               </button>
               {activeStep < 4 ? (
                 <button className="btn btn-primary" onClick={() => setActiveStep(prev => prev + 1)} style={{ padding: '10px 32px', fontWeight: 800 }}>Next Step</button>
               ) : (
                 <button 
                   onClick={handleSubmit}
                   className="btn btn-primary" 
                   style={{ padding: '10px 32px', backgroundColor: 'var(--success)', border: 'none', fontWeight: 800 }}
                 >
                   {mode === 'edit' ? 'Update Profile' : 'Finalize Registration'}
                 </button>
               )}
            </div>
         </div>

         {/* Sidebar widgets */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Guardian Photo Card */}
            <div className="card" style={{ padding: '28px', textAlign: 'center', borderRadius: '24px' }}>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 onChange={handlePhotoSelect} 
                 style={{ display: 'none' }} 
                 accept="image/*" 
               />
               
               <div 
                 onClick={() => fileInputRef.current.click()}
                 style={{
                   width: '130px', height: '130px', borderRadius: '32px',
                   backgroundColor: 'var(--bg-body)', margin: '0 auto 20px',
                   display: 'flex', alignItems: 'center', justifyContent: 'center',
                   color: 'var(--text-muted)', border: '2px dashed var(--border-color)',
                   position: 'relative', cursor: 'pointer', overflow: 'hidden',
                   transition: 'all 0.3s'
                 }}
                 className="hover-scale"
               >
                  {formData.img ? (
                    <img 
                      src={formData.img} 
                      alt="Guardian Avatar" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <Camera size={36} />
                  )}
                  <div style={{ position: 'absolute', bottom: '6px', right: '6px', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '3px solid var(--bg-card)' }}>
                     <Upload size={14} />
                  </div>
               </div>

               <div style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '6px' }}>Guardian Photo</div>
               <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>Max 2MB. JPG or PNG.</p>
            </div>

            {/* Quick Note Card */}
            <div className="card" style={{ padding: '24px', borderRadius: '24px' }}>
               <h4 style={{ fontSize: '0.9rem', fontWeight: 900, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} color="#f59e0b" /> Quick Note
               </h4>
               <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, fontWeight: 550 }}>
                  Ensuring accurate contact details is critical for institutional emergency alerts and automated student attendance notifications.
               </p>
            </div>

         </div>
      </div>
    </motion.div>
  );
};

export default AddGuardian;
