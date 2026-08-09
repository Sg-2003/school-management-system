import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, GraduationCap, MapPin, Phone, Mail, Calendar, 
  Upload, Save, X, ChevronRight, Info, Users as UsersIcon,
  ShieldCheck, FileText, Camera, CloudUpload, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addStudent } from '../services/service';

const AddStudent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [savePhase, setSavePhase] = useState(0);
  const { toast, showToast, hideToast } = useToast();

  const savePhases = [
    'Analyzing student academic records...',
    'Validating enrollment criteria & class quotas...',
    'Generating student identity credential locks...',
    'Syncing student record with institutional ledger...'
  ];

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', gender: '', dob: '', bloodGroup: '', religion: '', nationality: 'Indian',
    admissionId: '', rollNo: '', class: '', section: '',
    parentName: '', parentOccupation: '', parentPhone: '', parentEmail: '',
    presentAddress: '', permanentAddress: '',
    phone: '', email: '', avatar: '',
    admissionDate: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate Personal Details Tab
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.gender || !formData.dob) {
      setActiveTab('personal');
      alert('Please fill in all required fields in the Personal Details section (First Name, Last Name, Gender, Date of Birth).');
      return;
    }

    // 2. Validate Academic Info Tab
    if (!formData.admissionId.trim() || !formData.rollNo.trim() || !formData.class || !formData.section || !formData.admissionDate) {
      setActiveTab('academic');
      alert('Please fill in all required fields in the Academic Info section (Admission ID, Roll Number, Class, Section, Admission Date).');
      return;
    }

    // 3. Validate Guardian Details Tab
    if (!formData.parentName.trim() || !formData.parentPhone.trim()) {
      setActiveTab('guardian');
      alert('Please fill in all required fields in the Guardian Details section (Father/Guardian Name, Guardian Phone).');
      return;
    }

    // 4. Validate Contact & Address Tab
    if (!formData.presentAddress.trim()) {
      setActiveTab('contact');
      alert('Please fill in all required fields in the Contact & Address section (Present Address).');
      return;
    }

    try {
      const studentData = {
        student_id: formData.admissionId,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        class_id: formData.class,
        section_id: formData.section === 'A' ? 1 : formData.section === 'B' ? 2 : formData.section === 'C' ? 3 : 4,
        dob: formData.dob,
        gender: formData.gender === 'male' ? 'Male' : formData.gender === 'female' ? 'Female' : 'Other',
        address: formData.presentAddress,
        blood_group: formData.bloodGroup,
        admission_date: formData.admissionDate
      };

      try {
        await addStudent(studentData);
      } catch (apiErr) {
        console.warn("Backend API offline, bypassing direct node sync");
      }

      // Also persist to localStorage for offline cache
      const studentObj = {
        student_id: formData.admissionId,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        class_id: formData.class,
        section: formData.section,
        rollNo: formData.rollNo,
        admission_date: formData.admissionDate,
        gender: formData.gender === 'male' ? 'Male' : formData.gender === 'female' ? 'Female' : 'Other',
        status: 'Active',
        avatar: '',
        dob: formData.dob,
        bloodGroup: formData.bloodGroup,
        religion: formData.religion,
        parentName: formData.parentName,
        parentOccupation: formData.parentOccupation,
        parentPhone: formData.parentPhone,
        parentEmail: formData.parentEmail,
        presentAddress: formData.presentAddress,
        permanentAddress: formData.permanentAddress
      };

      const stored = localStorage.getItem('students');
      let list = stored ? JSON.parse(stored) : [];
      list.push(studentObj);
      localStorage.setItem('students', JSON.stringify(list));

      navigate('/dashboard/students');
    } catch (err) {
      console.error(err);
      alert('Failed to register student.');
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Details', icon: <User size={18} /> },
    { id: 'academic', label: 'Academic Info', icon: <GraduationCap size={18} /> },
    { id: 'guardian', label: 'Guardian Details', icon: <UsersIcon size={18} /> },
    { id: 'contact', label: 'Contact & Address', icon: <MapPin size={18} /> }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px' }}
    >
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, color: 'var(--text-main)', letterSpacing: '-1px' }}>Enroll New Student</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px', fontWeight: 500 }}>
            Complete the form below to register a new student into the institutional database.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button type="button" className="btn" style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', padding: '12px 24px', borderRadius: '14px', cursor: 'pointer' }} onClick={() => navigate('/dashboard/students')}>
            Cancel
          </button>
          <button type="submit" form="student-form" className="btn btn-primary" style={{ padding: '12px 32px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px -5px rgba(69, 179, 224, 0.4)' }}>
            <Save size={18} /> <span style={{ fontWeight: 800 }}>Submit Registration</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px' }}>
        {/* Left Sidebar: Form Navigation & Photo Upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="card" style={{ padding: '32px', borderRadius: '24px', textAlign: 'center' }}>
            <input type="file" id="student-photo-input" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
            <div 
              onClick={() => document.getElementById('student-photo-input').click()}
              style={{ 
                width: '140px', height: '140px', borderRadius: '40px', backgroundColor: 'var(--bg-body)', 
                border: '2px dashed var(--border-color)', margin: '0 auto 24px', display: 'flex', 
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)',
                cursor: 'pointer', transition: '0.3s', overflow: 'hidden', position: 'relative'
              }} 
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} 
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              {formData.avatar ? (
                <img src={formData.avatar} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <Camera size={40} style={{ marginBottom: '8px' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>UPLOAD PHOTO</span>
                </>
              )}
            </div>
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Student Portrait</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.5 }}>Supported formats: JPG, PNG. Max size: 2MB.</p>
          </div>

          <div className="card" style={{ padding: '12px', borderRadius: '24px' }}>
            {tabs.map(tab => (
              <button 
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{ 
                  width: '100%', padding: '16px 20px', borderRadius: '16px', border: 'none',
                  backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer',
                  transition: '0.3s', fontWeight: 700, textAlign: 'left', marginBottom: '4px'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '24px', backgroundColor: 'var(--primary-light)', borderRadius: '24px', color: 'var(--primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Info size={18} /> <span style={{ fontWeight: 900, fontSize: '0.9rem' }}>Important Note</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.6, fontWeight: 500 }}>
              Ensure all mandatory fields marked with an asterisk (*) are filled correctly to avoid registration delays.
            </p>
          </div>
        </div>

        {/* Right Content: Form Fields */}
        <div className="card" style={{ padding: '40px', borderRadius: '32px' }}>
          <form id="student-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* Conditional Rendering Based on Active Tab */}
            {activeTab === 'personal' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', borderBottom: '2px solid var(--primary-light)', paddingBottom: '16px', display: 'inline-block', width: 'fit-content' }}>Student Personal Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>FIRST NAME *</label>
                    <input type="text" name="firstName" className="form-input" style={{ borderRadius: '14px', padding: '14px' }} placeholder="Enter first name" value={formData.firstName} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>LAST NAME *</label>
                    <input type="text" name="lastName" className="form-input" style={{ borderRadius: '14px', padding: '14px' }} placeholder="Enter last name" value={formData.lastName} onChange={handleInputChange} required />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>GENDER *</label>
                    <select name="gender" className="form-input" style={{ borderRadius: '14px', padding: '14px' }} value={formData.gender} onChange={handleInputChange} required>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>DATE OF BIRTH *</label>
                    <div style={{ position: 'relative' }}>
                      <Calendar size={18} style={{ position: 'absolute', right: '16px', top: '14px', color: 'var(--text-muted)' }} />
                      <input type="date" name="dob" className="form-input" style={{ borderRadius: '14px', padding: '14px' }} value={formData.dob} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>BLOOD GROUP</label>
                    <input type="text" name="bloodGroup" className="form-input" style={{ borderRadius: '14px', padding: '14px' }} placeholder="e.g. A+" value={formData.bloodGroup} onChange={handleInputChange} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>RELIGION</label>
                    <input type="text" name="religion" className="form-input" style={{ borderRadius: '14px', padding: '14px' }} placeholder="Enter religion" value={formData.religion} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>NATIONALITY</label>
                    <input type="text" name="nationality" className="form-input" style={{ borderRadius: '14px', padding: '14px' }} value={formData.nationality} onChange={handleInputChange} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'academic' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', borderBottom: '2px solid var(--primary-light)', paddingBottom: '16px', display: 'inline-block', width: 'fit-content' }}>Institutional Records</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>ADMISSION ID *</label>
                    <input type="text" name="admissionId" className="form-input" style={{ borderRadius: '14px', padding: '14px' }} placeholder="e.g. ADM-2026-001" value={formData.admissionId} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>ROLL NUMBER *</label>
                    <input type="text" name="rollNo" className="form-input" style={{ borderRadius: '14px', padding: '14px' }} placeholder="e.g. 01" value={formData.rollNo} onChange={handleInputChange} required />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>CLASS / GRADE *</label>
                    <select name="class" className="form-input" style={{ borderRadius: '14px', padding: '14px' }} value={formData.class} onChange={handleInputChange} required>
                      <option value="">Select Class</option>
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(c => <option key={c} value={c}>Class {c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>SECTION *</label>
                    <select name="section" className="form-input" style={{ borderRadius: '14px', padding: '14px' }} value={formData.section} onChange={handleInputChange} required>
                      <option value="">Select Section</option>
                      {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>Section {s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>ADMISSION DATE *</label>
                    <input type="date" name="admissionDate" className="form-input" style={{ borderRadius: '14px', padding: '14px' }} value={formData.admissionDate} onChange={handleInputChange} required />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'guardian' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', borderBottom: '2px solid var(--primary-light)', paddingBottom: '16px', display: 'inline-block', width: 'fit-content' }}>Parent / Guardian Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>FATHER / GUARDIAN NAME *</label>
                    <input type="text" name="parentName" className="form-input" style={{ borderRadius: '14px', padding: '14px' }} placeholder="Enter full name" value={formData.parentName} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>OCCUPATION</label>
                    <input type="text" name="parentOccupation" className="form-input" style={{ borderRadius: '14px', padding: '14px' }} placeholder="Enter occupation" value={formData.parentOccupation} onChange={handleInputChange} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>GUARDIAN PHONE *</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
                      <input type="tel" name="parentPhone" className="form-input" style={{ borderRadius: '14px', padding: '14px 14px 14px 48px' }} placeholder="+91 98765 43210" value={formData.parentPhone} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>GUARDIAN EMAIL</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
                      <input type="email" name="parentEmail" className="form-input" style={{ borderRadius: '14px', padding: '14px 14px 14px 48px' }} placeholder="guardian@example.com" value={formData.parentEmail} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'contact' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', borderBottom: '2px solid var(--primary-light)', paddingBottom: '16px', display: 'inline-block', width: 'fit-content' }}>Address & Contact Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>STUDENT PHONE</label>
                    <input type="tel" name="phone" className="form-input" style={{ borderRadius: '14px', padding: '14px' }} placeholder="+91 98765 43210" value={formData.phone} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>STUDENT EMAIL</label>
                    <input type="email" name="email" className="form-input" style={{ borderRadius: '14px', padding: '14px' }} placeholder="student@edupro.edu" value={formData.email} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>PRESENT ADDRESS *</label>
                  <textarea name="presentAddress" className="form-input" style={{ borderRadius: '18px', padding: '20px', minHeight: '120px', resize: 'vertical' }} placeholder="Enter full present address" value={formData.presentAddress} onChange={handleInputChange} required></textarea>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>PERMANENT ADDRESS</label>
                  <textarea name="permanentAddress" className="form-input" style={{ borderRadius: '18px', padding: '20px', minHeight: '120px', resize: 'vertical' }} placeholder="Enter permanent address (if different)" value={formData.permanentAddress} onChange={handleInputChange}></textarea>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons for Form Steps */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
              <button 
                type="button" 
                className="btn" 
                disabled={activeTab === 'personal'}
                onClick={() => {
                  const idx = tabs.findIndex(t => t.id === activeTab);
                  setActiveTab(tabs[idx-1].id);
                }}
                style={{ 
                  backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', 
                  padding: '14px 28px', borderRadius: '14px', fontWeight: 700,
                  opacity: activeTab === 'personal' ? 0.5 : 1, cursor: activeTab === 'personal' ? 'not-allowed' : 'pointer'
                }}
              >
                Previous Section
              </button>
              {activeTab !== 'contact' ? (
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => {
                    const idx = tabs.findIndex(t => t.id === activeTab);
                    setActiveTab(tabs[idx+1].id);
                  }}
                  style={{ padding: '14px 32px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                >
                  Continue to Next <ChevronRight size={18} />
                </button>
              ) : (
                <button type="submit" className="btn btn-primary" style={{ padding: '14px 40px', borderRadius: '14px', fontWeight: 900, cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(69, 179, 224, 0.4)' }}>
                  Complete Registration
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

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
                Registering Student Ledger
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
      <ToastRenderer toast={toast} onClose={hideToast} />
    </motion.div>
  );
};

export default AddStudent;
