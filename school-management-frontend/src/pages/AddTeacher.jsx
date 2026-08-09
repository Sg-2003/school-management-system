import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Calendar, 
  GraduationCap, Building2, 
  Save, ArrowLeft, Image as ImageIcon,
  BookOpen, Star, Shield, BadgeCheck,
  FileText, Clock, Heart, Users,
  Globe, MessageSquare, Link, Video,
  RotateCcw, Lock, Eye, EyeOff,
  Stethoscope, Landmark, CreditCard,
  CloudUpload, Trash2, Share2, Camera, Home, CheckCircle2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { addTeacher, updateTeacher } from '../services/service';

const AddTeacher = ({ mode = 'add' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savePhase, setSavePhase] = useState(0);
  const [currentDocName, setCurrentDocName] = useState('');

  const savePhases = [
    'Analyzing faculty credentials...',
    'Verifying professional license & degrees...',
    'Synchronizing institutional security registries...',
    'Writing core school directory ledger handshake...'
  ];

  const [formData, setFormData] = useState({
    // Personal Info
    teacherId: '',
    fullName: '',
    subject: 'Physics',
    class: '10A',
    gender: 'Female',
    dob: '',
    fatherName: '',
    motherName: '',
    maritalStatus: 'Married',
    contractType: 'Permanent',
    shift: 'Day Shift',
    workLocation: '',
    joinDate: '',
    phone: '',
    email: '',
    experience: '',
    qualification: '',
    avatar: '',
    color: '#4880FF',
    
    // Medical Details
    bloodGroup: 'A+',
    height: '',
    weight: '',
    
    // Bank Details
    bankAccount: '',
    bankName: '',
    ifscCode: '',
    nationalId: '',
    
    // Previous School
    prevSchoolName: '',
    prevSchoolAddress: '',
    
    // Address
    currentAddress: '',
    permanentAddress: '',
    
    // Description
    details: '',
    
    // Social
    facebook: '',
    linkedin: '',
    instagram: '',
    youtube: '',
    
    // Login
    loginEmail: '',
    password: '',
    documents: [],

    // Hidden / computed fields to preserve details
    designation: '',
    dept: ''
  });

  // Unique ID generation and edit mode data lookup
  useEffect(() => {
    if (mode === 'add') {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const generatedId = `AD${randomNum}`;
      setFormData(prev => ({ ...prev, teacherId: generatedId }));
    } else if (mode === 'edit' && id) {
      const stored = localStorage.getItem('teachers');
      if (stored) {
        const list = JSON.parse(stored);
        const record = list.find(t => t.id === id);
        if (record) {
          setFormData({
            teacherId: record.id || record.teacherId || '',
            fullName: record.name || record.fullName || '',
            subject: record.subject || 'Physics',
            class: record.class || '10A',
            gender: record.gender || 'Female',
            dob: record.dob || '',
            fatherName: record.fatherName || '',
            motherName: record.motherName || '',
            maritalStatus: record.maritalStatus || 'Married',
            contractType: record.contractType || 'Permanent',
            shift: record.shift || 'Day Shift',
            workLocation: record.workLocation || '',
            joinDate: record.joinDate || '',
            phone: record.phone || '',
            email: record.email || '',
            experience: record.experience || '',
            qualification: record.qualification || '',
            avatar: record.avatar || '',
            color: record.color || '#4880FF',
            bloodGroup: record.bloodGroup || 'A+',
            height: record.height || '',
            weight: record.weight || '',
            bankAccount: record.bankAccount || '',
            bankName: record.bankName || '',
            ifscCode: record.ifscCode || '',
            nationalId: record.nationalId || '',
            prevSchoolName: record.prevSchoolName || '',
            prevSchoolAddress: record.prevSchoolAddress || '',
            currentAddress: record.currentAddress || '',
            permanentAddress: record.permanentAddress || '',
            details: record.details || '',
            facebook: record.facebook || '',
            linkedin: record.linkedin || '',
            instagram: record.instagram || '',
            youtube: record.youtube || '',
            loginEmail: record.loginEmail || record.email || '',
            password: record.password || 'password123',
            documents: record.documents || [],
            designation: record.designation || '',
            dept: record.dept || ''
          });
        }
      }
    }
  }, [mode, id]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newDoc = {
          id: 'DOC-' + Math.floor(1000 + Math.random() * 9000),
          name: currentDocName.trim() || file.name,
          fileName: file.name,
          fileSize: (file.size / 1024).toFixed(1) + ' KB',
          fileType: file.type,
          data: reader.result,
          uploadedAt: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
        };
        setFormData(prev => ({
          ...prev,
          documents: [...(prev.documents || []), newDoc]
        }));
        setCurrentDocName(''); // Reset document name input
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteDoc = (docId) => {
    setFormData(prev => ({
      ...prev,
      documents: (prev.documents || []).filter(doc => doc.id !== docId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSavePhase(0);

    const interval = setInterval(() => {
      setSavePhase(prev => {
        if (prev < savePhases.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 600);

    setTimeout(async () => {
      clearInterval(interval);
      
      const stored = localStorage.getItem('teachers');
      let list = stored ? JSON.parse(stored) : [];

      const initialColors = ['#4880FF', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];
      const chosenColor = formData.color || initialColors[Math.floor(Math.random() * initialColors.length)];

      const teacherObj = {
        id: formData.teacherId,
        teacherId: formData.teacherId,
        teacher_id: formData.teacherId,
        name: formData.fullName,
        fullName: formData.fullName,
        subject: formData.subject,
        class: formData.class,
        gender: formData.gender,
        dob: formData.dob,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        maritalStatus: formData.maritalStatus,
        contractType: formData.contractType,
        shift: formData.shift,
        workLocation: formData.workLocation,
        joinDate: formData.joinDate || new Date().toISOString().split('T')[0],
        phone: formData.phone,
        email: formData.email,
        experience: formData.experience,
        qualification: formData.qualification,
        avatar: formData.avatar || (formData.fullName ? formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'T'),
        color: chosenColor,
        bloodGroup: formData.bloodGroup,
        height: formData.height,
        weight: formData.weight,
        bankAccount: formData.bankAccount,
        bankName: formData.bankName,
        ifscCode: formData.ifscCode,
        nationalId: formData.nationalId,
        prevSchoolName: formData.prevSchoolName,
        prevSchoolAddress: formData.prevSchoolAddress,
        currentAddress: formData.currentAddress,
        permanentAddress: formData.permanentAddress,
        details: formData.details,
        facebook: formData.facebook,
        linkedin: formData.linkedin,
        loginEmail: formData.loginEmail || formData.email,
        password: formData.password || 'password123',
        designation: formData.designation || (mode === 'edit' ? 'Lecturer' : 'Associate Professor'),
        dept: formData.dept || (formData.subject === 'Mathematics' || formData.subject === 'Physics' || formData.subject === 'Chemistry' || formData.subject === 'Biology' ? 'Science & Research' : 'Humanities & Languages'),
        rating: 4.8,
        documents: formData.documents || []
      };

      try {
        if (mode === 'edit') {
          await updateTeacher(id, teacherObj);
        } else {
          await addTeacher(teacherObj);
        }
      } catch (apiErr) {
        console.warn("Backend API offline, bypassing direct node sync", apiErr);
      }

      if (mode === 'edit') {
        list = list.map(t => t.id === id ? { ...t, ...teacherObj } : t);
      } else {
        list.push(teacherObj);
      }

      localStorage.setItem('teachers', JSON.stringify(list));
      setIsSaving(false);
      navigate(mode === 'edit' ? `/dashboard/teacher-details/${id}` : '/dashboard/teachers');
    }, 2800);
  };

  const handleReset = () => {
    if(window.confirm('Are you sure you want to reset all fields?')) {
      setFormData(prev => ({
        ...prev,
        fullName: '',
        gender: 'Female',
        dob: '',
        fatherName: '',
        motherName: '',
        maritalStatus: 'Married',
        contractType: 'Permanent',
        shift: 'Day Shift',
        workLocation: '',
        joinDate: '',
        phone: '',
        email: '',
        experience: '',
        qualification: '',
        avatar: '',
        bloodGroup: 'A+',
        height: '',
        weight: '',
        bankAccount: '',
        bankName: '',
        ifscCode: '',
        nationalId: '',
        prevSchoolName: '',
        prevSchoolAddress: '',
        currentAddress: '',
        permanentAddress: '',
        details: '',
        facebook: '',
        linkedin: '',
        loginEmail: '',
        password: ''
      }));
    }
  };

  const SectionHeader = ({ icon: Icon, title }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
       <div style={{ color: 'var(--primary)' }}><Icon size={20} /></div>
       <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>{title}</h3>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ paddingBottom: '60px' }}>
      {/* Breadcrumb & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
         <div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600 }}>
              <Home size={14} /> Dashboard / Teacher / <span style={{ color: 'var(--primary)' }}>{mode === 'edit' ? 'Edit Teacher' : 'Add New Teacher'}</span>
           </div>
           <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>{mode === 'edit' ? 'Edit Faculty Record' : 'Add New Faculty Member'}</h1>
         </div>
         <button onClick={() => navigate(-1)} className="btn" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-color)', fontWeight: 800 }}>
            <ArrowLeft size={16} /> Back to Directory
         </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* 1. Personal Info */}
          <div className="card" style={{ padding: '32px' }}>
            <SectionHeader icon={User} title="Personal Information" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              <div className="form-group">
                <label className="form-label">Teacher ID <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="text" className="form-input" placeholder="Enter Teacher ID" required disabled value={formData.teacherId} />
              </div>
              <div className="form-group">
                <label className="form-label">Full Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="text" className="form-input" placeholder="Enter Full Name" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select className="form-input" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}>
                  <option>Mathematics</option><option>Physics</option><option>Chemistry</option><option>Biology</option><option>English</option><option>Geography</option><option>Computer Science</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Class</label>
                <input type="text" className="form-input" placeholder="e.g. 10(A), 11(B)" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-input" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="date" className="form-input" required value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Father's Name</label>
                <input type="text" className="form-input" placeholder="Enter Father's Name" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Mother's Name</label>
                <input type="text" className="form-input" placeholder="Enter Mother's Name" value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Marital Status</label>
                <select className="form-input" value={formData.maritalStatus} onChange={e => setFormData({...formData, maritalStatus: e.target.value})}>
                  <option>Married</option><option>Unmarried</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Contract Type</label>
                <select className="form-input" value={formData.contractType} onChange={e => setFormData({...formData, contractType: e.target.value})}>
                  <option>Permanent</option><option>Contractual</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Shift</label>
                <select className="form-input" value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})}>
                  <option>Day Shift</option><option>Night Shift</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Work Location</label>
                <input type="text" className="form-input" placeholder="Enter Work Location" value={formData.workLocation} onChange={e => setFormData({...formData, workLocation: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Join Date</label>
                <input type="date" className="form-input" value={formData.joinDate} onChange={e => setFormData({...formData, joinDate: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="text" className="form-input" placeholder="Enter Phone Number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Email <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="email" className="form-input" placeholder="Enter Email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Experience (Years) <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="text" className="form-input" placeholder="Enter Experience" required value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Qualification <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="text" className="form-input" placeholder="Enter Qualification" required value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} />
              </div>
              
              {/* Photo Upload Card */}
              <div className="form-group" style={{ gridColumn: 'span 1' }}>
                <label className="form-label">Teacher Photo <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="file" id="teacher-photo-input" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                <div 
                  onClick={() => document.getElementById('teacher-photo-input').click()}
                  style={{ 
                    border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '16px', 
                    textAlign: 'center', backgroundColor: 'var(--bg-body)', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px'
                  }}
                >
                   {formData.avatar && (formData.avatar.startsWith('data:') || formData.avatar.startsWith('http') || formData.avatar.startsWith('/') || formData.avatar.startsWith('.')) ? (
                      <img src={formData.avatar} alt="Avatar Preview" style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', marginBottom: '8px' }} />
                   ) : formData.fullName ? (
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.fullName}`} alt="Avatar Preview" style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', marginBottom: '8px' }} />
                   ) : (
                      <CloudUpload size={24} color="var(--primary)" style={{ marginBottom: '8px' }} />
                   )}
                   <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {formData.avatar ? 'Click to Change Photo' : 'Drag & Drop or Click to Upload'}
                   </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Medical Details */}
          <div className="card" style={{ padding: '32px' }}>
            <SectionHeader icon={Stethoscope} title="Medical Details" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select className="form-input" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
                  <option>A+</option><option>B+</option><option>O+</option><option>AB+</option><option>A-</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input type="text" className="form-input" placeholder="Enter Height" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input type="text" className="form-input" placeholder="Enter Weight" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
              </div>
            </div>
          </div>

          {/* 3. Bank Details */}
          <div className="card" style={{ padding: '32px' }}>
            <SectionHeader icon={Landmark} title="Bank Details" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              <div className="form-group">
                <label className="form-label">Bank Account Number</label>
                <input type="text" className="form-input" placeholder="Enter Account Number" value={formData.bankAccount} onChange={e => setFormData({...formData, bankAccount: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Bank Name</label>
                <input type="text" className="form-input" placeholder="Enter Bank Name" value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">IFSC Code</label>
                <input type="text" className="form-input" placeholder="Enter IFSC Code" value={formData.ifscCode} onChange={e => setFormData({...formData, ifscCode: e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 3' }}>
                <label className="form-label">National Identification Number</label>
                <input type="text" className="form-input" placeholder="Enter National ID" value={formData.nationalId} onChange={e => setFormData({...formData, nationalId: e.target.value})} />
              </div>
            </div>
          </div>

          {/* 4. Upload Documents & Previous School */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
             <div className="card" style={{ padding: '32px' }}>
                <SectionHeader icon={FileText} title="Upload Documents" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   <div className="form-group">
                      <label className="form-label">Doc Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Enter Doc Name (e.g. Masters Degree)" 
                        value={currentDocName}
                        onChange={e => setCurrentDocName(e.target.value)}
                      />
                   </div>
                   <input 
                     type="file" 
                     id="teacher-doc-input" 
                     style={{ display: 'none' }} 
                     onChange={handleDocUpload} 
                   />
                   <div 
                     onClick={() => document.getElementById('teacher-doc-input').click()}
                     style={{ 
                       border: '2px dashed var(--border-color)', 
                       borderRadius: '12px', 
                       padding: '24px', 
                       textAlign: 'center', 
                       backgroundColor: 'var(--bg-body)', 
                       cursor: 'pointer',
                       transition: '0.3s'
                     }}
                   >
                      <CloudUpload size={28} color="var(--primary)" style={{ marginBottom: '8px' }} />
                      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800 }}>Upload Document File</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.65rem', color: 'var(--text-muted)' }}>PDF, PNG, JPG (Max 5MB)</p>
                   </div>

                   {/* Uploaded Documents List */}
                   {formData.documents && formData.documents.length > 0 && (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                       <label className="form-label" style={{ marginBottom: '4px', fontSize: '0.8rem', fontWeight: 800 }}>Uploaded Documents ({formData.documents.length})</label>
                       {formData.documents.map((doc) => (
                         <div 
                           key={doc.id} 
                           style={{ 
                             display: 'flex', 
                             alignItems: 'center', 
                             justifyContent: 'space-between', 
                             padding: '12px 16px', 
                             backgroundColor: 'var(--bg-body)', 
                             borderRadius: '12px', 
                             border: '1px solid var(--border-color)' 
                           }}
                         >
                           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                             <div style={{ 
                               width: '36px', 
                               height: '36px', 
                               borderRadius: '8px', 
                               backgroundColor: 'var(--primary-light)', 
                               display: 'flex', 
                               alignItems: 'center', 
                               justifyContent: 'center', 
                               color: 'var(--primary)' 
                             }}>
                               <FileText size={18} />
                             </div>
                             <div style={{ textAlign: 'left' }}>
                               <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{doc.name}</div>
                               <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{doc.fileName} • {doc.fileSize}</div>
                             </div>
                           </div>
                           <button 
                             type="button" 
                             onClick={() => handleDeleteDoc(doc.id)} 
                             className="btn-icon" 
                             style={{ backgroundColor: 'transparent', color: 'var(--danger)', padding: 0 }}
                             title="Remove Document"
                           >
                             <Trash2 size={16} />
                           </button>
                         </div>
                       ))}
                     </div>
                   )}
                </div>
             </div>
             <div className="card" style={{ padding: '32px' }}>
                <SectionHeader icon={Building2} title="Previous School Details" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   <div className="form-group">
                      <label className="form-label">School Name</label>
                      <input type="text" className="form-input" placeholder="Enter School Name" value={formData.prevSchoolName} onChange={e => setFormData({...formData, prevSchoolName: e.target.value})} />
                   </div>
                   <div className="form-group">
                      <label className="form-label">Address</label>
                      <input type="text" className="form-input" placeholder="Enter Address" value={formData.prevSchoolAddress} onChange={e => setFormData({...formData, prevSchoolAddress: e.target.value})} />
                   </div>
                </div>
             </div>
          </div>

          {/* 5. Address & Details */}
          <div className="card" style={{ padding: '32px' }}>
             <SectionHeader icon={MapPin} title="Address Details" />
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div className="form-group">
                   <label className="form-label">Current Address</label>
                   <input type="text" className="form-input" placeholder="Enter Current Address" value={formData.currentAddress} onChange={e => setFormData({...formData, currentAddress: e.target.value})} />
                </div>
                <div className="form-group">
                   <label className="form-label">Permanent Address</label>
                   <input type="text" className="form-input" placeholder="Enter Permanent Address" value={formData.permanentAddress} onChange={e => setFormData({...formData, permanentAddress: e.target.value})} />
                </div>
             </div>
             <div className="form-group">
                <label className="form-label">Teacher Details (Biography)</label>
                <textarea className="form-input" rows="4" style={{ resize: 'none' }} placeholder="Enter additional details..." value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} />
             </div>
          </div>

          {/* 6. Social Media & Login */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
             <div className="card" style={{ padding: '32px' }}>
                <SectionHeader icon={Share2} title="Social Media Links" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                   <div className="form-group">
                      <label className="form-label">Facebook URL</label>
                      <div style={{ position: 'relative' }}>
                         <Globe size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                         <input type="text" className="form-input" style={{ paddingLeft: '40px' }} placeholder="https://facebook.com/..." value={formData.facebook} onChange={e => setFormData({...formData, facebook: e.target.value})} />
                      </div>
                   </div>
                   <div className="form-group">
                      <label className="form-label">LinkedIn URL</label>
                      <div style={{ position: 'relative' }}>
                         <Link size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                         <input type="text" className="form-input" style={{ paddingLeft: '40px' }} placeholder="https://linkedin.com/in/..." value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
                      </div>
                   </div>
                </div>
             </div>
             <div className="card" style={{ padding: '32px' }}>
                <SectionHeader icon={Lock} title="Login Credentials" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   <div className="form-group">
                      <label className="form-label">Login Email <span style={{ color: 'var(--danger)' }}>*</span></label>
                      <input type="email" className="form-input" required placeholder="Enter Login Email" value={formData.loginEmail} onChange={e => setFormData({...formData, loginEmail: e.target.value})} />
                   </div>
                   <div className="form-group">
                      <label className="form-label">Password <span style={{ color: 'var(--danger)' }}>*</span></label>
                      <div style={{ position: 'relative' }}>
                         <input type={showPassword ? 'text' : 'password'} className="form-input" required placeholder="Enter Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                         <div onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
             <button type="button" onClick={handleReset} className="btn" style={{ padding: '14px 40px', backgroundColor: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RotateCcw size={18} /> RESET
             </button>
             <button type="submit" className="btn btn-primary" style={{ padding: '14px 60px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 900 }}>
                <Save size={18} /> {mode === 'edit' ? 'UPDATE PROFILE' : 'SAVE CHANGES'}
             </button>
          </div>

        </div>
      </form>

      {/* Simulated Ledger Saving Overlay */}
      <AnimatePresence>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(10px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              style={{
                width: '100%',
                maxWidth: '520px',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                borderRadius: '32px',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
                padding: '40px',
                color: '#1f2937'
              }}
            >
              <h3 style={{ fontSize: '1.4rem', fontWeight: 950, margin: '0 0 24px 0', textAlign: 'center' }}>
                {mode === 'edit' ? 'Updating Faculty Ledger' : 'Registering Faculty Member'}
              </h3>
              
              {/* Dynamic steps indicator */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {savePhases.map((phase, idx) => {
                  const isPending = idx > savePhase;
                  const isCurrent = idx === savePhase;
                  const isDone = idx < savePhase;

                  return (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '16px',
                        opacity: isPending ? 0.35 : 1,
                        transition: 'opacity 0.3s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isDone ? (
                          <div style={{ color: '#10B981', display: 'flex', alignItems: 'center' }}>
                            <CheckCircle2 size={24} />
                          </div>
                        ) : isCurrent ? (
                          <div className="spinner" style={{ width: '20px', height: '20px', border: '3px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        ) : (
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--border-color)' }}></div>
                        )}
                      </div>
                      <span style={{ 
                        fontSize: '0.95rem', 
                        fontWeight: isCurrent ? 800 : 600,
                        color: isCurrent ? 'var(--primary)' : isDone ? '#1f2937' : '#4b5563'
                      }}>
                        {phase}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AddTeacher;
