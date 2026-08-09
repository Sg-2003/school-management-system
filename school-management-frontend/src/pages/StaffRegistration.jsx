/* EduPro Elite - StaffRegistration v1.0 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Briefcase, Calendar, 
  Shield, CreditCard, Upload, ChevronRight, CheckCircle2,
  FileText, Camera, Building2, UserPlus, Fingerprint,
  Smartphone, Lock, Heart, Globe, Award, BookOpen,
  ArrowRight, ShieldCheck, Zap, Sparkles, Clock, Layers, Trash2, Check,
  AlertCircle, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InputField = ({ label, icon: Icon, type = "text", placeholder, value, onChange }) => (
  <div style={{ marginBottom: '24px' }}>
    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
        <Icon size={18} />
      </div>
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ 
          width: '100%', 
          padding: '16px 16px 16px 48px', 
          borderRadius: '16px', 
          border: '1px solid var(--border-color)', 
          backgroundColor: 'var(--bg-body)',
          fontSize: '1rem', 
          fontWeight: 600, 
          color: 'var(--text-main)',
          outline: 'none',
          transition: '0.3s'
        }}
        onFocus={(e) => e.target.style.borderColor = '#6366f1'}
        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
      />
    </div>
  </div>
);

const SectionHeader = ({ title, desc, icon: Icon, color }) => (
  <div style={{ marginBottom: '32px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
    <div style={{ width: '56px', height: '56px', borderRadius: '18px', backgroundColor: `${color}10`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={28} />
    </div>
    <div>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0', fontWeight: 500 }}>{desc}</p>
    </div>
  </div>
);

const StaffRegistration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(null);

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
  
  // Registration form states
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    role: '', department: '', startDate: '', salary: '',
    emergencyContact: '', bloodGroup: '', address: '', password: ''
  });
  
  const [photo, setPhoto] = useState(null);
  
  const [qualifications, setQualifications] = useState([
    { degree: 'Master of Science (M.Sc)', institution: 'Oxford University', year: '2020' }
  ]);
  
  const [previousEmployment, setPreviousEmployment] = useState([
    { company: 'St. Mary High School', role: 'Mathematics Lecturer', duration: '2021 - 2024' }
  ]);
  
  const [documents, setDocuments] = useState([
    { name: 'Post-Graduate Degree Certificate', file: null },
    { name: 'Official Identity Card (Passport/ID)', file: null },
    { name: 'Previous Employment Clearance Letter', file: null }
  ]);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // Handle biometric photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        showToast("Biometric headshot profile uploaded and verified.", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Dynamic Qualification record
  const handleAddQualification = () => {
    setQualifications([...qualifications, { degree: '', institution: '', year: '' }]);
  };

  const handleUpdateQualification = (index, field, value) => {
    const updated = [...qualifications];
    updated[index][field] = value;
    setQualifications(updated);
  };

  const handleRemoveQualification = (index) => {
    if (qualifications.length === 1) return;
    setQualifications(qualifications.filter((_, i) => i !== index));
  };

  // Add Dynamic Previous Employment record
  const handleAddEmployment = () => {
    setPreviousEmployment([...previousEmployment, { company: '', role: '', duration: '' }]);
  };

  const handleUpdateEmployment = (index, field, value) => {
    const updated = [...previousEmployment];
    updated[index][field] = value;
    setPreviousEmployment(updated);
  };

  const handleRemoveEmployment = (index) => {
    if (previousEmployment.length === 1) return;
    setPreviousEmployment(previousEmployment.filter((_, i) => i !== index));
  };

  // Handle document file upload simulation
  const handleDocumentChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...documents];
      updated[index].file = file.name;
      setDocuments(updated);
      showToast(`Document "${documents[index].name}" uploaded successfully.`, "success");
    }
  };

  const handleAddDocumentType = () => {
    const docName = prompt("Enter custom document name to upload (e.g. Recommendation Letter):");
    if (docName && docName.trim()) {
      setDocuments([...documents, { name: docName.trim(), file: null }]);
      showToast(`Custom verification slot for "${docName.trim()}" added.`, "success");
    } else if (docName !== null) {
      showToast("Document name cannot be blank.", "error");
    }
  };

  const handleRemoveDocument = (index) => {
    const docName = documents[index].name;
    const updated = [...documents];
    updated[index].file = null;
    setDocuments(updated);
    showToast(`Verification document "${docName}" removed.`, "info");
  };

  // Onboard new employee to database storage
  const handleFinalizeRegistration = () => {
    if (!formData.firstName || !formData.lastName) {
      showToast("Please provide a First and Last name under Step 1.", "error");
      setStep(1);
      return;
    }

    const stored = localStorage.getItem('employees');
    const employeeList = stored ? JSON.parse(stored) : [];
    
    // Auto-create a brand new elite employee record
    const newEmployee = {
      id: `EMP-2026-0${employeeList.length + 5}`,
      name: `${formData.firstName} ${formData.lastName}`,
      role: formData.role || 'Professor / Specialist',
      department: formData.department || 'Mathematics',
      type: 'Full-time',
      status: 'On Duty',
      joiningDate: formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '24 May 2026',
      email: formData.email || `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@school.edu`,
      phone: formData.phone || '+1 234-567-8900',
      address: formData.address || '742 Evergreen Terrace, NY',
      salary: formData.salary || '$70,000 / annum',
      biography: `elite faculty onboarded. Qualifications include: ${qualifications.map(q => `${q.degree} from ${q.institution} (${q.year})`).join(', ')}. Experience includes: ${previousEmployment.map(p => `${p.role} at ${p.company} (${p.duration})`).join(', ')}.`
    };
    
    const updated = [newEmployee, ...employeeList];
    localStorage.setItem('employees', JSON.stringify(updated));

    // Sync Step 4 uploaded files to the central Staff Document Repository
    const uploadedDocs = documents.filter(d => d.file !== null);
    if (uploadedDocs.length > 0) {
      const storedDocs = localStorage.getItem('staff_documents');
      let docList = [];
      if (storedDocs) {
        docList = JSON.parse(storedDocs);
      } else {
        // Initial core database seeding
        docList = [
          { id: 'DOC-1021', name: 'Dr. Rajesh Malhotra - Contract', type: 'Employment Contract', staff: 'Rajesh Malhotra', dept: 'Mathematics', date: '2021-01-12', size: '1.2 MB' },
          { id: 'DOC-1022', name: 'Sunita Rao - Degree', type: 'Academic Credential', staff: 'Sunita Rao', dept: 'Administration', date: '2022-03-05', size: '2.4 MB' },
          { id: 'DOC-1023', name: 'Amit Bose - ID Proof', type: 'Identification', staff: 'Amit Bose', dept: 'Technical', date: '2023-09-15', size: '0.8 MB' },
          { id: 'DOC-1024', name: 'Priya Patel - Experience', type: 'Experience Certificate', staff: 'Priya Patel', dept: 'Student Welfare', date: '2024-02-20', size: '1.5 MB' },
          { id: 'DOC-1025', name: 'Institutional Policy 2026', type: 'Legal/Policy', staff: 'System', dept: 'General', date: '2026-01-01', size: '3.1 MB' }
        ];
      }

      uploadedDocs.forEach(ud => {
        let docType = 'Employment Contract';
        const docNameLower = ud.name.toLowerCase();
        if (docNameLower.includes('degree') || docNameLower.includes('credential') || docNameLower.includes('transcript')) {
          docType = 'Academic Credential';
        } else if (docNameLower.includes('identity') || docNameLower.includes('id') || docNameLower.includes('passport') || docNameLower.includes('medical')) {
          docType = 'Identification';
        } else if (docNameLower.includes('experience') || docNameLower.includes('employment') || docNameLower.includes('letter')) {
          docType = 'Experience Certificate';
        } else if (docNameLower.includes('clearance') || docNameLower.includes('background') || docNameLower.includes('policy') || docNameLower.includes('contract')) {
          docType = 'Legal/Policy';
        }

        const newDoc = {
          id: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
          name: `${formData.firstName} ${formData.lastName} - ${ud.name}`,
          type: docType,
          staff: `${formData.firstName} ${formData.lastName}`,
          dept: formData.department || 'Mathematics',
          date: new Date().toISOString().split('T')[0],
          size: `${(Math.random() * 1.5 + 0.5).toFixed(1)} MB`
        };
        docList.unshift(newDoc);
      });

      localStorage.setItem('staff_documents', JSON.stringify(docList));
    }

    setIsSubmitted(true);
    setTimeout(() => navigate('/dashboard/employees'), 4000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-body)', padding: '40px' }}>
      
      {/* Background Decor */}
      <div style={{ position: 'fixed', top: 0, right: 0, width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
 
      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        {/* Header Area */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--text-main)', color: 'var(--bg-body)', borderRadius: '40px', fontSize: '0.8rem', fontWeight: 950, letterSpacing: '1px', marginBottom: '20px' }}>
              <UserPlus size={14} color="#f59e0b" /> STAFF ONBOARDING SYSTEM v2.0
            </div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-3px', lineHeight: 1, margin: 0 }}>
              Onboard <span style={{ color: '#6366f1' }}>Elite Talent</span>
            </h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>STEP {step} OF 4</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4].map(s => (
                <div key={s} style={{ width: '35px', height: '6px', borderRadius: '3px', backgroundColor: s <= step ? '#6366f1' : 'var(--border-color)', transition: '0.3s' }} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px', alignItems: 'start' }}>
          
          {/* Main Form Area */}
          <form onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={step}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                style={{ backgroundColor: 'var(--bg-card)', padding: '48px', borderRadius: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.03)', border: '1px solid var(--border-color)' }}
              >
                {step === 1 && (
                  <div>
                    <SectionHeader 
                      title="Professional Identity" 
                      desc="Establish the primary credentials and contact vectors for the new faculty member."
                      icon={Fingerprint}
                      color="#6366f1"
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <InputField 
                        label="First Name" icon={User} placeholder="e.g. Jonathan" 
                        value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      />
                      <InputField 
                        label="Last Name" icon={User} placeholder="e.g. Wick" 
                        value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      />
                    </div>
                    <InputField 
                      label="Institutional Email" icon={Mail} placeholder="name@edupro.elite" 
                      value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <InputField 
                        label="Primary Phone" icon={Smartphone} placeholder="+1 (555) 000-0000" 
                        value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                      <InputField 
                        label="Emergency Vector" icon={Heart} placeholder="Name / Number" 
                        value={formData.emergencyContact} onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        if (!formData.firstName || !formData.lastName) {
                          showToast("Please provide a First and Last name to proceed.", "error");
                          return;
                        }
                        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                          showToast("Please enter a valid email address.", "error");
                          return;
                        }
                        nextStep();
                      }} 
                      style={{ marginTop: '24px', width: '100%', padding: '18px', borderRadius: '18px', backgroundColor: 'var(--text-main)', color: 'var(--bg-body)', border: 'none', fontWeight: 950, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                    >
                      Continue to Qualifications & Experience <ArrowRight size={20} />
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <SectionHeader 
                      title="Qualifications & Background" 
                      desc="Detail academic milestones and professional tenure statefully."
                      icon={BookOpen}
                      color="#ec4899"
                    />

                    {/* Qualifications Array list */}
                    <div style={{ marginBottom: '40px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontWeight: 900, color: 'var(--text-main)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Award size={18} color="#ec4899" /> Academic Degrees</h4>
                        <button type="button" onClick={handleAddQualification} style={{ border: 'none', background: '#ec489912', color: '#ec4899', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>+ Add Qualification</button>
                      </div>
                      
                      {qualifications.map((q, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', backgroundColor: 'var(--bg-body)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)', marginBottom: '16px', position: 'relative' }}>
                          <div style={{ flex: 2 }}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px' }}>DEGREE / CERTIFICATE</label>
                            <input 
                              type="text" 
                              value={q.degree}
                              onChange={(e) => handleUpdateQualification(idx, 'degree', e.target.value)}
                              placeholder="e.g. M.Sc Computer Science" 
                              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', fontWeight: 600, fontSize: '0.85rem', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}
                            />
                          </div>
                          <div style={{ flex: 2 }}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px' }}>INSTITUTION</label>
                            <input 
                              type="text" 
                              value={q.institution}
                              onChange={(e) => handleUpdateQualification(idx, 'institution', e.target.value)}
                              placeholder="e.g. Stanford University" 
                              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', fontWeight: 600, fontSize: '0.85rem', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}
                            />
                          </div>
                          <div style={{ width: '90px' }}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px' }}>YEAR</label>
                            <input 
                              type="text" 
                              value={q.year}
                              onChange={(e) => handleUpdateQualification(idx, 'year', e.target.value)}
                              placeholder="e.g. 2022" 
                              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', fontWeight: 600, fontSize: '0.85rem', textAlign: 'center', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleRemoveQualification(idx)}
                            disabled={qualifications.length === 1}
                            style={{ 
                              padding: '12px', border: 'none', backgroundColor: '#ef444410', color: '#ef4444', 
                              borderRadius: '10px', cursor: qualifications.length === 1 ? 'not-allowed' : 'pointer', opacity: qualifications.length === 1 ? 0.3 : 1
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Previous Employment Array list */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontWeight: 900, color: 'var(--text-main)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Building2 size={18} color="#ec4899" /> Professional History</h4>
                        <button type="button" onClick={handleAddEmployment} style={{ border: 'none', background: '#ec489912', color: '#ec4899', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>+ Add Experience</button>
                      </div>
                      
                      {previousEmployment.map((p, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', backgroundColor: 'var(--bg-body)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                          <div style={{ flex: 2 }}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px' }}>COMPANY / INSTITUTION</label>
                            <input 
                              type="text" 
                              value={p.company}
                              onChange={(e) => handleUpdateEmployment(idx, 'company', e.target.value)}
                              placeholder="e.g. Royal Academy" 
                              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', fontWeight: 600, fontSize: '0.85rem', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}
                            />
                          </div>
                          <div style={{ flex: 2 }}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px' }}>ROLE / TITLE</label>
                            <input 
                              type="text" 
                              value={p.role}
                              onChange={(e) => handleUpdateEmployment(idx, 'role', e.target.value)}
                              placeholder="e.g. Assistant Professor" 
                              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', fontWeight: 600, fontSize: '0.85rem', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}
                            />
                          </div>
                          <div style={{ width: '110px' }}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px' }}>DURATION</label>
                            <input 
                              type="text" 
                              value={p.duration}
                              onChange={(e) => handleUpdateEmployment(idx, 'duration', e.target.value)}
                              placeholder="e.g. 2018 - 2021" 
                              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', fontWeight: 600, fontSize: '0.85rem', textAlign: 'center', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleRemoveEmployment(idx)}
                            disabled={previousEmployment.length === 1}
                            style={{ 
                              padding: '12px', border: 'none', backgroundColor: '#ef444410', color: '#ef4444', 
                              borderRadius: '10px', cursor: previousEmployment.length === 1 ? 'not-allowed' : 'pointer', opacity: previousEmployment.length === 1 ? 0.3 : 1
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '36px' }}>
                      <button type="button" onClick={prevStep} style={{ flex: 1, padding: '18px', borderRadius: '18px', backgroundColor: 'var(--bg-card)', border: '2px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 950, cursor: 'pointer' }}>Back</button>
                      <button type="button" onClick={nextStep} style={{ flex: 2, padding: '18px', borderRadius: '18px', backgroundColor: 'var(--text-main)', color: 'var(--bg-body)', border: 'none', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        Continue to Assignment <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <SectionHeader 
                      title="Organizational Placement" 
                      desc="Define the role, department, and contractual parameters for institutional integration."
                      icon={Building2}
                      color="#10b981"
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <InputField 
                        label="Designation" icon={Award} placeholder="e.g. Senior Lecturer" 
                        value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                      />
                      <InputField 
                        label="Department" icon={Layers} placeholder="e.g. Theoretical Physics" 
                        value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <InputField 
                        label="Onboarding Date" icon={Calendar} type="date" 
                        value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      />
                      <InputField 
                        label="Salary Bracket" icon={CreditCard} placeholder="e.g. $85,000 /yr" 
                        value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                      <button type="button" onClick={prevStep} style={{ flex: 1, padding: '18px', borderRadius: '18px', backgroundColor: 'var(--bg-card)', border: '2px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 950, cursor: 'pointer' }}>Back</button>
                      <button type="button" onClick={nextStep} style={{ flex: 2, padding: '18px', borderRadius: '18px', backgroundColor: 'var(--text-main)', color: 'var(--bg-body)', border: 'none', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        Continue to Security & Documents <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <SectionHeader 
                      title="Security, Bio & Document Verification" 
                      desc="Finalize institutional credentials and upload mandatory verified certifications."
                      icon={ShieldCheck}
                      color="#f59e0b"
                    />
                    
                    {/* Live Headshot Upload Block */}
                    <div style={{ padding: '32px', backgroundColor: 'var(--bg-body)', borderRadius: '24px', border: '2px dashed var(--border-color)', textAlign: 'center', marginBottom: '32px', position: 'relative' }}>
                      {photo ? (
                        <div>
                          <img 
                            src={photo} 
                            alt="Biometric Headshot" 
                            style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #6366f1', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.25)', marginBottom: '12px' }}
                          />
                          <div style={{ fontWeight: 900, color: 'var(--text-main)', marginBottom: '2px' }}>Verified Headshot Profile Loaded</div>
                          <button 
                            type="button" 
                            onClick={() => {
                              setPhoto(null);
                              showToast("Biometric headshot photo removed.", "info");
                            }} 
                            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                          >
                            Remove Photo
                          </button>
                        </div>
                      ) : (
                        <label htmlFor="photo-upload" style={{ cursor: 'pointer', display: 'block' }}>
                          <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: 'var(--bg-card)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}><Camera size={32} /></div>
                          <div style={{ fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>Biometric Profile Capture</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Click to upload official headshot photo (JPG/PNG)</div>
                          <input 
                            type="file" 
                            id="photo-upload" 
                            accept="image/*" 
                            onChange={handlePhotoUpload} 
                            style={{ display: 'none' }} 
                          />
                        </label>
                      )}
                    </div>

                    {/* Interactive Document upload list */}
                    <div style={{ marginBottom: '32px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h5 style={{ margin: 0, fontWeight: 900, color: 'var(--text-main)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={16} color="#f59e0b" /> Verified Credentials Upload</h5>
                        <button type="button" onClick={handleAddDocumentType} style={{ border: 'none', background: '#f59e0b12', color: '#b45309', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>+ Custom File</button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {documents.map((doc, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', border: '1px solid var(--border-color)', borderRadius: '16px', backgroundColor: 'var(--bg-body)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: doc.file ? '#10b98112' : 'var(--bg-card)', color: doc.file ? '#10b981' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {doc.file ? <Check size={16} /> : <Upload size={14} />}
                              </div>
                              <div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>{doc.name}</span>
                                <span style={{ fontSize: '0.7rem', color: doc.file ? '#10b981' : 'var(--text-muted)', fontWeight: 600 }}>{doc.file ? `Uploaded: ${doc.file}` : 'Required Attachment'}</span>
                              </div>
                            </div>
                            {doc.file ? (
                              <button 
                                type="button" 
                                onClick={() => handleRemoveDocument(idx)} 
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            ) : (
                              <label style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '8px 14px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', color: 'var(--text-main)' }}>
                                Choose File
                                <input 
                                  type="file" 
                                  onChange={(e) => handleDocumentChange(idx, e)} 
                                  style={{ display: 'none' }} 
                                />
                              </label>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <InputField 
                      label="System Password" icon={Lock} type="password" placeholder="••••••••" 
                      value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                      <button type="button" onClick={prevStep} style={{ flex: 1, padding: '18px', borderRadius: '18px', backgroundColor: 'var(--bg-card)', border: '2px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 950, cursor: 'pointer' }}>Back</button>
                      <button 
                        type="button"
                        onClick={handleFinalizeRegistration} 
                        style={{ flex: 2, padding: '18px', borderRadius: '18px', backgroundColor: '#6366f1', color: 'white', border: 'none', fontWeight: 950, cursor: 'pointer', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                      >
                        Finalize Registration <Zap size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </form>

          {/* Sidebar Insights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '40px', padding: '32px', color: 'var(--text-main)', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%)' }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 950, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}><Sparkles size={20} color="#f59e0b" /> Institutional Audit</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '24px' }}>Ensuring all faculty registrations comply with institutional standards for v6.0 core deployment.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { label: 'Security Clearance', val: 'Automatic' },
                    { label: 'Qualifications Added', val: `${qualifications.length} Registered` },
                    { label: 'Experience Records', val: `${previousEmployment.length} Listed` },
                    { label: 'Verified Documents', val: `${documents.filter(d => d.file).length} of ${documents.length}` }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>{item.label}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 950, color: '#f59e0b' }}>{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
 
            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '40px', padding: '32px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '20px' }}>Registration Status</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#10b98110', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle2 size={20} /></div>
                   <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-main)' }}>Identity Verified</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>System checks completed</div>
                   </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: photo ? '#10b98110' : 'var(--bg-body)', color: photo ? '#10b981' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}>
                      {photo ? <CheckCircle2 size={20} /> : <Camera size={20} />}
                   </div>
                   <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-main)' }}>Biometrics Captured</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{photo ? 'Photo verified and loaded' : 'Headshot upload required'}</div>
                   </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', opacity: 0.5 }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--bg-body)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={20} /></div>
                   <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-main)' }}>Background Check</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending post-onboarding</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

      {/* Success View Overlay */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.95)', 
              backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', 
              alignItems: 'center', justifyContent: 'center', textAlign: 'center' 
            }}
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ maxWidth: '450px', padding: '40px' }}>
              <div style={{ width: '100px', height: '100px', backgroundColor: '#10b981', color: 'white', borderRadius: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)' }}>
                <CheckCircle2 size={50} />
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 950, color: 'white', marginBottom: '16px', letterSpacing: '-1.5px' }}>Registration Successful!</h2>
              <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '32px', fontWeight: 500 }}>
                The credentials for <span style={{ color: 'white', fontWeight: 900 }}>{formData.firstName} {formData.lastName}</span> have been synchronized with the institutional core.
              </p>
              <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3.5 }} style={{ height: '100%', backgroundColor: '#10b981' }} />
              </div>
              <p style={{ marginTop: '16px', fontSize: '0.75rem', fontWeight: 800, color: '#6366f1', letterSpacing: '2px' }}>REDIRECTING TO STAFF REGISTRY</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffRegistration;
