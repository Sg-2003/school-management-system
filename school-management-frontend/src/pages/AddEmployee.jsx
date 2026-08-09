import React, { useState } from 'react';
import { useToast, ToastRenderer } from '../hooks/useToast';
import { 
  User, Mail, Phone, MapPin, Calendar, Briefcase, Award, 
  ShieldCheck, Clock, FileText, Save, X, Image as ImageIcon, 
  Building, ChevronRight, CheckCircle2, Wallet, Plus, History, 
  Fingerprint, Upload, Folder, Trash2, Check, CloudUpload
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Personal Info
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  
  // Interactive Avatar/Photo Upload
  const [avatar, setAvatar] = useState('');

  // Step 2: Job & Payroll Info
  const [dept, setDept] = useState('Mathematics');
  const [designation, setDesignation] = useState('Professor');
  const [contract, setContract] = useState('Full-time (On-Site)');
  const [shift, setShift] = useState('Morning (08:00 - 16:00)');
  const [joiningDate, setJoiningDate] = useState('2026-05-24');
  const [salary, setSalary] = useState('');
  const [bankAccName, setBankAccName] = useState('');
  const [bankAccNum, setBankAccNum] = useState('');
  const [bankName, setBankName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Direct Deposit (ACH)');

  // Step 3: Stateful Dynamic Qualifications List
  const [educationList, setEducationList] = useState([
     { degree: 'Master of Science', institution: 'State University', year: '2021', result: 'GPA 3.8', transcriptFile: null },
     { degree: 'Bachelor of Technology', institution: 'National Institute', year: '2017', result: 'First Class', transcriptFile: null }
  ]);

  // Step 3: Stateful Dynamic Experience List
  const [workHistory, setWorkHistory] = useState([
     { company: 'Previous High School', role: 'Lecturer', startDate: '2021-09-01', endDate: '2025-06-30', isCurrent: false }
  ]);

  // Step 4: Stateful Dynamic Document Vault List
  const [vaultDocuments, setVaultDocuments] = useState([
     { name: 'Official Onboarding Contract', required: true, file: null },
     { name: 'Degree Certificates & Credentials', required: true, file: null },
     { name: 'National Identity Proof (ID/Passport)', required: true, file: null },
     { name: 'Background Clearance Check', required: false, file: null },
     { name: 'Past Service Experience Letters', required: false, file: null },
     { name: 'Medical Fitness Certificate', required: false, file: null }
  ]);

  const steps = [
    { id: 1, label: 'Basic Information', icon: <User size={18} /> },
    { id: 2, label: 'Job & Payroll', icon: <Briefcase size={18} /> },
    { id: 3, label: 'Academic & Career', icon: <Award size={18} /> },
    { id: 4, label: 'ID & Documents', icon: <FileText size={18} /> }
  ];

  // Photo upload reader
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Qualifications list actions
  const handleAddQualification = () => {
    setEducationList([...educationList, { degree: '', institution: '', year: '', result: '', transcriptFile: null }]);
  };

  const handleUpdateQualification = (index, field, value) => {
    const updated = [...educationList];
    updated[index][field] = value;
    setEducationList(updated);
  };

  const handleRemoveQualification = (index) => {
    if (educationList.length === 1) return;
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  const handleTranscriptChange = (index, e) => {
     const file = e.target.files[0];
     if (file) {
        const updated = [...educationList];
        updated[index].transcriptFile = file.name;
        setEducationList(updated);
     }
  };

  // Employment list actions
  const handleAddEmployment = () => {
    setWorkHistory([...workHistory, { company: '', role: '', startDate: '', endDate: '', isCurrent: false }]);
  };

  const handleUpdateEmployment = (index, field, value) => {
    const updated = [...workHistory];
    updated[index][field] = value;
    setWorkHistory(updated);
  };

  const handleRemoveEmployment = (index) => {
    if (workHistory.length === 1) return;
    setWorkHistory(workHistory.filter((_, i) => i !== index));
  };

  // Document Vault list actions
  const handleVaultDocChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...vaultDocuments];
      updated[index].file = file.name;
      setVaultDocuments(updated);
    }
  };

  const handleRemoveVaultDoc = (index) => {
    const updated = [...vaultDocuments];
    updated[index].file = null;
    setVaultDocuments(updated);
  };

  const handleCompleteRegistration = () => {
    if (!name.trim()) {
      showToast('Name field is required in Step 1.', 'error', 'Validation Error');
      setCurrentStep(1);
      return;
    }

    const stored = localStorage.getItem('employees');
    let empList = [];
    if (stored) {
      empList = JSON.parse(stored);
    }

    // Dynamic ID calculation
    let maxId = 4;
    empList.forEach(e => {
      const parsed = parseInt(e.id.split('-').pop());
      if (!isNaN(parsed) && parsed > maxId) {
        maxId = parsed;
      }
    });
    const newIdNum = maxId + 1;
    const formattedId = `EMP-2026-${String(newIdNum).padStart(3, '0')}`;

    const newEmployee = {
      id: formattedId,
      name: name,
      role: designation,
      department: dept,
      type: contract.includes('Full-time') ? 'Full-time' : (contract.includes('Part-time') ? 'Part-time' : 'Contract'),
      status: 'On Duty',
      joiningDate: joiningDate ? new Date(joiningDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '24 May 2026',
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@school.edu`,
      phone: phone || '+1 234-567-8999',
      address: `${address || 'Academic Circle'}, ${city || 'Science District'}, ${state || 'NY'} ${zip || '10001'}`,
      salary: salary ? `$${parseFloat(salary).toLocaleString()} / annum` : '$65,000 / annum',
      biography: `Joined as a ${designation} in ${dept} department. Specialized in institutional instruction and operations.`,
      avatar: avatar || null,
      education: educationList,
      workExperience: workHistory.map(w => ({
         role: w.role,
         organization: w.company,
         period: `${w.startDate ? new Date(w.startDate).getFullYear() : ''} - ${w.isCurrent ? 'Present' : (w.endDate ? new Date(w.endDate).getFullYear() : '')}`,
         description: `Served as ${w.role} at ${w.company}.`
      }))
    };

    empList.push(newEmployee);
    localStorage.setItem('employees', JSON.stringify(empList));

    // Sync Step 4 uploaded files to the central Staff Document Repository
    const uploadedDocs = vaultDocuments.filter(d => d.file !== null);
    if (uploadedDocs.length > 0) {
      const storedDocs = localStorage.getItem('staff_documents_v2');
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
          name: `${name} - ${ud.name}`,
          type: docType,
          staff: name,
          dept: dept,
          date: new Date().toISOString().split('T')[0],
          size: `${(Math.random() * 1.5 + 0.5).toFixed(1)} MB`
        };
        docList.unshift(newDoc);
      });

      localStorage.setItem('staff_documents_v2', JSON.stringify(docList));
    }

    showToast(`Staff successfully onboarded! Assigned ID: ${formattedId}`, 'success', 'Registration Complete');
    navigate('/dashboard/employees');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="page-title" style={{ marginBottom: '8px' }}>Staff Registration</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Onboard new institutional personnel by providing professional, personal, and administrative details.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '40px' }}>
         {/* Progress Navigation */}
         <div style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
            <div className="card" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
               {steps.map((step, i) => (
                  <div key={i} style={{ 
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 0',
                      borderBottom: i === steps.length - 1 ? 'none' : '1px solid var(--border-color)',
                      opacity: currentStep === step.id ? 1 : 0.5,
                      color: currentStep >= step.id ? 'var(--primary)' : 'var(--text-main)'
                  }}>
                      <div style={{ 
                         width: '36px', height: '36px', borderRadius: '12px', 
                         backgroundColor: currentStep === step.id ? 'var(--primary)' : (currentStep > step.id ? 'var(--primary-light)' : 'var(--bg-body)'),
                         color: currentStep === step.id ? 'white' : (currentStep > step.id ? 'var(--primary)' : 'var(--text-muted)'), 
                         display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem'
                      }}>{currentStep > step.id ? <CheckCircle2 size={20} /> : step.id}</div>
                      <div>
                         <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Step 0{step.id}</div>
                         <div style={{ fontWeight: currentStep === step.id ? 900 : 700, fontSize: '0.95rem' }}>{step.label}</div>
                      </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Registration Form */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {currentStep === 1 && (
               <div className="card" style={{ padding: '40px', border: '1px solid var(--border-color)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <User size={24} className="text-primary" /> Personal Identity
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '40px', marginBottom: '40px' }}>
                     {/* Functional Photo Upload block */}
                     <div>
                        <input 
                           type="file" 
                           id="avatar-photo-upload" 
                           accept="image/*" 
                           onChange={handlePhotoUpload} 
                           style={{ display: 'none' }} 
                        />
                        <div 
                           onClick={() => document.getElementById('avatar-photo-upload').click()}
                           style={{ 
                              width: '150px', height: '150px', borderRadius: '32px', 
                              border: '2px dashed var(--border-color)', display: 'flex', 
                              flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                              backgroundColor: 'var(--bg-body)', cursor: 'pointer', overflow: 'hidden', position: 'relative'
                           }}
                        >
                           {avatar ? (
                              <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           ) : (
                              <>
                                 <ImageIcon size={32} className="text-muted" style={{ marginBottom: '8px' }} />
                                 <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>UPLOAD PHOTO</span>
                              </>
                           )}
                        </div>
                     </div>
                     
                     <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Full Legal Name</label>
                           <input 
                             type="text" 
                             placeholder="e.g. John Doe" 
                             value={name}
                             onChange={(e) => setName(e.target.value)}
                             style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                           />
                        </div>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Gender</label>
                           <select 
                             value={gender}
                             onChange={(e) => setGender(e.target.value)}
                             style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                           >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                           </select>
                        </div>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Date of Birth</label>
                           <input 
                             type="date" 
                             value={dob}
                             onChange={(e) => setDob(e.target.value)}
                             style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                           />
                        </div>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Personal Email</label>
                           <input 
                             type="email" 
                             placeholder="john.doe@gmail.com" 
                             value={email}
                             onChange={(e) => setEmail(e.target.value)}
                             style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                           />
                        </div>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Phone Number</label>
                           <input 
                             type="text" 
                             placeholder="+1 234-567-8900" 
                             value={phone}
                             onChange={(e) => setPhone(e.target.value)}
                             style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                           />
                        </div>
                     </div>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <MapPin size={24} className="text-primary" /> Permanent Address
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '24px' }}>
                     <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Residential Street Address</label>
                        <input 
                           type="text" 
                           placeholder="House No, Street, Landmark" 
                           value={address}
                           onChange={(e) => setAddress(e.target.value)}
                           style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                        />
                     </div>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>City</label>
                        <input 
                           type="text" 
                           placeholder="City" 
                           value={city}
                           onChange={(e) => setCity(e.target.value)}
                           style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                        />
                     </div>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>State / Province</label>
                        <input 
                           type="text" 
                           placeholder="State" 
                           value={state}
                           onChange={(e) => setState(e.target.value)}
                           style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                        />
                     </div>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Zip Code</label>
                        <input 
                           type="text" 
                           placeholder="Zip" 
                           value={zip}
                           onChange={(e) => setZip(e.target.value)}
                           style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                        />
                     </div>
                  </div>
               </div>
            )}

            {currentStep === 2 && (
               <div className="card" style={{ padding: '40px', border: '1px solid var(--border-color)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <Building size={24} className="text-primary" /> Institutional Assignment
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Department</label>
                        <select 
                           value={dept}
                           onChange={(e) => setDept(e.target.value)}
                           style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                        >
                           <option value="Mathematics">Mathematics</option>
                           <option value="Physics">Physics</option>
                           <option value="Computer Science">Computer Science</option>
                           <option value="Administration">Administration</option>
                           <option value="Technical">Technical</option>
                        </select>
                     </div>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Designation</label>
                        <select 
                           value={designation}
                           onChange={(e) => setDesignation(e.target.value)}
                           style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                        >
                           <option value="Professor">Professor</option>
                           <option value="Associate Professor">Associate Professor</option>
                           <option value="Admin Coordinator">Admin Coordinator</option>
                           <option value="IT Specialist">IT Specialist</option>
                           <option value="Counselor">Counselor</option>
                        </select>
                     </div>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Contract Type</label>
                        <select 
                           value={contract}
                           onChange={(e) => setContract(e.target.value)}
                           style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                        >
                           <option value="Full-time (On-Site)">Full-time (On-Site)</option>
                           <option value="Part-time">Part-time</option>
                           <option value="Contractual">Contractual</option>
                           <option value="Visiting Faculty">Visiting Faculty</option>
                        </select>
                     </div>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Working Shift</label>
                        <select 
                           value={shift}
                           onChange={(e) => setShift(e.target.value)}
                           style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                        >
                           <option value="Morning (08:00 - 16:00)">Morning (08:00 - 16:00)</option>
                           <option value="Evening (14:00 - 22:00)">Evening (14:00 - 22:00)</option>
                           <option value="Night Shift">Night Shift</option>
                        </select>
                     </div>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Date of Joining</label>
                        <input 
                           type="date" 
                           value={joiningDate}
                           onChange={(e) => setJoiningDate(e.target.value)}
                           style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                        />
                     </div>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <Wallet size={24} className="text-primary" /> Payroll & Financials
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Basic Annual Salary ($)</label>
                        <input 
                           type="number" 
                           placeholder="e.g. 60000" 
                           value={salary}
                           onChange={(e) => setSalary(e.target.value)}
                           style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 900 }} 
                        />
                     </div>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Bank Account Name</label>
                        <input 
                           type="text" 
                           placeholder="As per bank record" 
                           value={bankAccName}
                           onChange={(e) => setBankAccName(e.target.value)}
                           style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                        />
                     </div>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Account Number / IBAN</label>
                        <input 
                           type="text" 
                           placeholder="0000 0000 0000 0000" 
                           value={bankAccNum}
                           onChange={(e) => setBankAccNum(e.target.value)}
                           style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                        />
                     </div>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Bank Name</label>
                        <input 
                           type="text" 
                           placeholder="Institutional Bank Partner" 
                           value={bankName}
                           onChange={(e) => setBankName(e.target.value)}
                           style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                        />
                     </div>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Tax ID / SSN</label>
                        <input 
                           type="text" 
                           placeholder="For payroll deductions" 
                           value={taxId}
                           onChange={(e) => setTaxId(e.target.value)}
                           style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                        />
                     </div>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Salary Payment Method</label>
                        <select 
                           value={paymentMethod}
                           onChange={(e) => setPaymentMethod(e.target.value)}
                           style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                        >
                           <option value="Direct Deposit (ACH)">Direct Deposit (ACH)</option>
                           <option value="Physical Check">Physical Check</option>
                           <option value="Cash Disbursement">Cash Disbursement</option>
                        </select>
                     </div>
                  </div>
               </div>
            )}

            {currentStep === 3 && (
               <div className="card" style={{ padding: '40px', border: '1px solid var(--border-color)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <Award size={24} className="text-primary" /> Academic Qualifications
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
                     {educationList.map((edu, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '20px', padding: '24px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)', position: 'relative' }}>
                           <div style={{ gridColumn: '1 / 3' }}>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Degree / Certificate Name</label>
                              <input 
                                 type="text" 
                                 placeholder="e.g. Master of Computer Science" 
                                 value={edu.degree}
                                 onChange={(e) => handleUpdateQualification(idx, 'degree', e.target.value)}
                                 style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                              />
                           </div>
                           <div style={{ gridColumn: '3 / -1' }}>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Institution / University</label>
                              <input 
                                 type="text" 
                                 placeholder="University Name" 
                                 value={edu.institution}
                                 onChange={(e) => handleUpdateQualification(idx, 'institution', e.target.value)}
                                 style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                              />
                           </div>
                           <div>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Passing Year</label>
                              <input 
                                 type="text" 
                                 placeholder="YYYY" 
                                 value={edu.year}
                                 onChange={(e) => handleUpdateQualification(idx, 'year', e.target.value)}
                                 style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontWeight: 600, textAlign: 'center' }} 
                              />
                           </div>
                           <div>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Percentage / GPA</label>
                              <input 
                                 type="text" 
                                 placeholder="e.g. 3.8 / 4.0" 
                                 value={edu.result}
                                 onChange={(e) => handleUpdateQualification(idx, 'result', e.target.value)}
                                 style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontWeight: 600, textAlign: 'center' }} 
                              />
                           </div>
                           
                           {/* Supporting Transcript Upload Button */}
                           <div style={{ gridColumn: '3 / -1', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                              <input 
                                 type="file" 
                                 id={`transcript-upload-${idx}`} 
                                 onChange={(e) => handleTranscriptChange(idx, e)}
                                 style={{ display: 'none' }}
                              />
                              <button 
                                 type="button"
                                 onClick={() => document.getElementById(`transcript-upload-${idx}`).click()}
                                 style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px dashed var(--border-color)', background: 'none', color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                              >
                                 {edu.transcriptFile ? `UPLOADED: ${edu.transcriptFile.slice(0, 18)}...` : '+ UPLOAD SUPPORTING TRANSCRIPT'}
                              </button>
                              
                              {educationList.length > 1 && (
                                 <button 
                                    type="button" 
                                    onClick={() => handleRemoveQualification(idx)}
                                    style={{ padding: '12px', border: 'none', backgroundColor: '#ef444415', color: '#ef4444', borderRadius: '10px', cursor: 'pointer' }}
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              )}
                           </div>
                        </div>
                     ))}
                     <button type="button" onClick={handleAddQualification} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Add Another Qualification
                     </button>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <History size={24} className="text-primary" /> Professional Experience
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                     {workHistory.map((work, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', padding: '24px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)', position: 'relative' }}>
                           <div style={{ gridColumn: '1 / 3' }}>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Previous Organization Name</label>
                              <input 
                                 type="text" 
                                 placeholder="Company / Institution Name" 
                                 value={work.company}
                                 onChange={(e) => handleUpdateEmployment(idx, 'company', e.target.value)}
                                 style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                              />
                           </div>
                           <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                              <div style={{ flex: 1 }}>
                                 <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Designation</label>
                                 <input 
                                    type="text" 
                                    placeholder="Role held" 
                                    value={work.role}
                                    onChange={(e) => handleUpdateEmployment(idx, 'role', e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                                 />
                              </div>
                              {workHistory.length > 1 && (
                                 <button 
                                    type="button" 
                                    onClick={() => handleRemoveEmployment(idx)}
                                    style={{ padding: '12px', border: 'none', backgroundColor: '#ef444415', color: '#ef4444', borderRadius: '10px', cursor: 'pointer' }}
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              )}
                           </div>
                           <div>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Start Date</label>
                              <input 
                                 type="date" 
                                 value={work.startDate}
                                 onChange={(e) => handleUpdateEmployment(idx, 'startDate', e.target.value)}
                                 style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                              />
                           </div>
                           <div>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>End Date</label>
                              <input 
                                 type="date" 
                                 value={work.endDate}
                                 disabled={work.isCurrent}
                                 onChange={(e) => handleUpdateEmployment(idx, 'endDate', e.target.value)}
                                 style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontWeight: 600, opacity: work.isCurrent ? 0.4 : 1 }} 
                              />
                           </div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input 
                                 type="checkbox" 
                                 id={`current-job-${idx}`} 
                                 checked={work.isCurrent}
                                 onChange={(e) => handleUpdateEmployment(idx, 'isCurrent', e.target.checked)}
                              />
                              <label htmlFor={`current-job-${idx}`} style={{ fontSize: '0.8rem', fontWeight: 700 }}>Currently Working Here</label>
                           </div>
                        </div>
                     ))}
                     <button type="button" onClick={handleAddEmployment} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Add Previous Employment
                     </button>
                  </div>
               </div>
            )}

            {currentStep === 4 && (
               <div className="card" style={{ padding: '40px', border: '1px solid var(--border-color)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <Fingerprint size={24} className="text-primary" /> Identity & Verification
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Primary ID Type</label>
                        <select style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}>
                           <option>Social Security Number (SSN)</option>
                           <option>Passport</option>
                           <option>National ID / Voter ID</option>
                           <option>Driver's License</option>
                        </select>
                     </div>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Identification Number</label>
                        <input type="text" placeholder="Enter ID number" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 800 }} />
                     </div>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Expiry Date (if applicable)</label>
                        <input type="date" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} />
                     </div>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <Folder size={24} className="text-primary" /> Staff Document Vault
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                     {vaultDocuments.map((doc, idx) => (
                        <div key={idx} style={{ position: 'relative' }}>
                           <input 
                              type="file" 
                              id={`vault-doc-upload-${idx}`} 
                              onChange={(e) => handleVaultDocChange(idx, e)}
                              style={{ display: 'none' }}
                           />
                           <div 
                              onClick={() => !doc.file && document.getElementById(`vault-doc-upload-${idx}`).click()}
                              style={{ 
                                 padding: '24px', borderRadius: '16px', border: '2px dashed var(--border-color)', 
                                 backgroundColor: doc.file ? 'var(--primary-light)' : 'var(--bg-body)',
                                 display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', 
                                 cursor: doc.file ? 'default' : 'pointer', transition: '0.2s',
                                 position: 'relative', overflow: 'hidden'
                              }}
                           >
                              {doc.file ? <Check size={24} className="text-primary" /> : <Upload size={24} className="text-muted" />}
                              <div style={{ textAlign: 'center' }}>
                                 <div style={{ fontWeight: 800, fontSize: '0.9rem', color: doc.file ? 'var(--primary)' : 'var(--text-main)' }}>
                                    {doc.name} {doc.required && !doc.file && <span style={{ color: 'var(--danger)' }}>*</span>}
                                 </div>
                                 <div style={{ fontSize: '0.7rem', color: doc.file ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700 }}>
                                    {doc.file ? `Loaded: ${doc.file.slice(0, 24)}` : 'Click to browse or drag and drop'}
                                 </div>
                              </div>
                              {doc.file && (
                                 <button 
                                    type="button" 
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       handleRemoveVaultDoc(idx);
                                    }}
                                    style={{ 
                                       position: 'absolute', top: '10px', right: '10px', 
                                       border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' 
                                    }}
                                    title="Delete Attachment"
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>

                  <div style={{ marginTop: '40px', padding: '24px', backgroundColor: 'var(--primary-light)', borderRadius: '16px', border: '1px solid var(--primary)', display: 'flex', gap: '16px' }}>
                     <ShieldCheck size={24} className="text-primary" />
                     <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '4px' }}>Data Compliance Notice</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', opacity: 0.8, lineHeight: '1.5' }}>
                           By completing this registration, you confirm that all provided identification and documentation have been verified against original copies. All files will be encrypted and stored in the institutional secure vault.
                        </p>
                      </div>
                  </div>
               </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
               <button 
                  onClick={() => currentStep > 1 && setCurrentStep(prev => prev - 1)}
                  className="btn" style={{ padding: '14px 32px', borderRadius: '16px', border: '1px solid var(--border-color)', fontWeight: 800, visibility: currentStep === 1 ? 'hidden' : 'visible' }}
               >PREVIOUS</button>
               <button 
                  onClick={() => {
                     if (currentStep === 4) {
                        handleCompleteRegistration();
                     } else {
                        setCurrentStep(prev => prev + 1);
                     }
                  }}
                  className="btn btn-primary" style={{ padding: '14px 40px', borderRadius: '16px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}
               >
                  {currentStep === 4 ? 'COMPLETE REGISTRATION' : 'SAVE & CONTINUE'} <ChevronRight size={18} />
               </button>
            </div>
         </div>
      </div>
      <ToastRenderer toast={toast} onClose={hideToast} />
    </div>
  );
};

export default AddEmployee;
