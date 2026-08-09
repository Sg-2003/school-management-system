import React, { useState, useEffect } from 'react';
import { useToast, ToastRenderer } from '../hooks/useToast';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Award, ShieldCheck, Clock, FileText, Edit, MoreVertical, ChevronLeft, Download, Building, CheckCircle2, Plus, ArrowUpRight, DollarSign, X, Save, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import ActionDropdown from '../components/ActionDropdown';

const EmployeeDetails = () => {
  const { toast, showToast: showToastNotification, hideToast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Professional Information');
  const [employee, setEmployee] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [documentsList, setDocumentsList] = useState([
     { name: 'Employment Contract', type: 'PDF Document', size: '1.2 MB', date: 'Jan 10, 2021', status: 'Verified' },
     { name: 'PhD Certificate', type: 'Scanned Image', size: '2.4 MB', date: 'Jan 12, 2021', status: 'Verified' },
     { name: 'Identity Proof (Aadhaar Card)', type: 'PDF Document', size: '0.8 MB', date: 'Jan 10, 2021', status: 'Verified' },
     { name: 'Experience Certificate', type: 'PDF Document', size: '1.5 MB', date: 'Feb 05, 2021', status: 'Pending' },
     { name: 'Background Check', type: 'Official Report', size: '0.5 MB', date: 'Jan 15, 2021', status: 'Verified' }
  ]);

  const downloadPayslip = (month) => {
    if (!employee) return;
    const headers = ['Category', 'Amount'];
    const rows = [
      ['Basic Salary', '$6,000.00'],
      ['HRA', '$1,200.00'],
      ['Conveyance', '$300.00'],
      ['Special Allowance', '$583.33'],
      ['Gross Pay', employee.salary || '$8,083.33 / month'],
      ['Income Tax', '-$800.00'],
      ['Provident Fund', '-$200.00'],
      ['Health Insurance', '-$50.00'],
      ['Net Take-home', '$7,033.33']
    ];
    const csvContent = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Payslip_${employee.name.replace(/\s+/g, '_')}_${month.replace(/\s+/g, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToastNotification(`Payslip for ${month} downloaded successfully!`, 'success', 'Payroll System');
  };

  const downloadDocument = (doc) => {
    const content = `Mock document content for ${doc.name}\nType: ${doc.type}\nVerified: ${doc.status}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.name.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToastNotification(`${doc.name} downloaded successfully.`, 'success', 'Document Center');
  };

  const viewDocument = (doc) => {
    if (!employee) return;
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>${doc.name}</title><style>body{font-family:sans-serif;padding:40px;color:#1e293b;background:#f8fafc}</style></head>
      <body>
        <div style="max-width:600px;margin:50px auto;background:white;padding:40px;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.05)">
          <h2 style="color:#4880FF;margin-top:0">${doc.name}</h2>
          <hr style="border:0;border-top:1px solid #e2e8f0;margin:20px 0">
          <p><strong>Document Type:</strong> ${doc.type}</p>
          <p><strong>File Size:</strong> ${doc.size}</p>
          <p><strong>Verification Date:</strong> ${doc.date}</p>
          <p><strong>Status:</strong> <span style="color:${doc.status === 'Verified' ? '#10B981' : '#F59E0B'}">${doc.status}</span></p>
          <p style="margin-top:40px;font-style:italic;color:#64748b">This is an officially verified institutional record for ${employee.name}.</p>
        </div>
      </body></html>
    `);
    win.document.close();
    showToastNotification(`Viewing ${doc.name} in a new tab.`, 'info', 'Document Center');
  };

  const handleUploadClick = () => {
    document.getElementById('doc-upload-input')?.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDoc = {
        name: file.name.split('.').slice(0, -1).join('.') || file.name,
        type: file.type || 'Unknown Document',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'Verified'
      };
      setDocumentsList(prev => [...prev, newDoc]);
      showToastNotification(`Successfully uploaded ${file.name}!`, 'success', 'Document Center');
    }
  };

  // Form states for editing
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editType, setEditType] = useState('');
  const [editSalary, setEditSalary] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editBiography, setEditBiography] = useState('');

  // Fetch employee from unified registry
  useEffect(() => {
    const version = localStorage.getItem('employees_version');
    const stored = localStorage.getItem('employees');
    if (version !== '2026-v2') {
      localStorage.removeItem('employees');
      localStorage.setItem('employees_version', '2026-v2');
    }
    let empList = [];
    
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
        biography: 'Dr. Malhotra has been a cornerstone of the Mathematics department for over 4 years. He specializes in advanced calculus and linear algebra, contributing significantly to the curriculum development and student mentorship programs.',
        education: [
          { degree: 'Ph.D. in Pure Mathematics', institution: 'IIT Bombay', year: '2018', result: 'GPA 9.8/10' },
          { degree: 'M.Sc. in Mathematics', institution: 'IIT Delhi', year: '2014', result: 'GPA 9.5/10' },
          { degree: 'B.Sc. in Physics & Math', institution: 'IISc Bangalore', year: '2012', result: 'First Class with Distinction' }
        ],
        workExperience: [
          { role: 'Associate Professor', organization: 'BITS Pilani', period: '2018 - 2021', description: 'Led research in quantum topology and supervised 5 Ph.D. candidates.' },
          { role: 'Research Fellow', organization: 'TIFR Mumbai', period: '2015 - 2018', description: 'Contributed to the development of novel algebraic structures.' },
          { role: 'Teaching Assistant', organization: 'IISc Bangalore', period: '2012 - 2014', description: 'Assisted in undergraduate calculus and linear algebra courses.' }
        ]
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
        biography: 'Sunita Rao coordinates departmental synchronization, scheduling, and administrative logistics.',
        education: [
          { degree: 'MBA in Operations', institution: 'FMS Delhi', year: '2020', result: 'GPA 8.8/10' },
          { degree: 'B.BA in Management', institution: 'Delhi University', year: '2016', result: 'First Class' }
        ],
        workExperience: [
          { role: 'Operations Officer', organization: 'Apex Administrative Services', period: '2020 - 2022', description: 'Coordinated inter-departmental logistics and records archiving.' }
        ]
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
        biography: 'Amit ensures campus hardware, server integration, and secure networking capabilities are functioning.',
        education: [
          { degree: 'B.Tech in Computer Engineering', institution: 'BITS Pilani', year: '2019', result: 'First Class' }
        ],
        workExperience: [
          { role: 'IT Support Engineer', organization: 'NextGen Solutions', period: '2019 - 2023', description: 'Maintained enterprise networking frameworks and system firewalls.' }
        ]
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
        biography: 'Priya Patel works to coordinate student support, mental wellbeing, and career guidance programs.',
        education: [
          { degree: 'M.Sc. in Child Psychology', institution: 'MS University Vadodara', year: '2021', result: 'GPA 9.0/10' }
        ],
        workExperience: [
          { role: 'Counseling Fellow', organization: 'DPS Ahmedabad', period: '2021 - 2024', description: 'Provided one-on-one counseling services and student mentoring.' }
        ]
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
        biography: 'Rajinder coordinates institutional logistics, transport routing, and vehicle registry logs.',
        education: [
          { degree: 'B.Tech in Logistics & Supply Chain', institution: 'Amity University', year: '2018', result: 'GPA 8.5/10' }
        ],
        workExperience: [
          { role: 'Logistics Coordinator', organization: 'Transit Corp India', period: '2018 - 2022', description: 'Scheduled fleet operations and managed vehicle compliance logs.' }
        ]
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
        biography: 'Meeta designs culinary menus and directs cafeteria kitchen staff.',
        education: [
          { degree: 'Diploma in Culinary Arts', institution: 'IHM Pusa', year: '2016', result: 'Distinction' }
        ],
        workExperience: [
          { role: 'Sous Chef', organization: 'The Oberoi Group', period: '2016 - 2021', description: 'Prepared upscale menus and managed kitchen safety standards.' }
        ]
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
        biography: 'Sameer maintains institution servers, cloud frameworks, and hardware systems.',
        education: [
          { degree: 'B.Tech in Computer Science', institution: 'VJTI Mumbai', year: '2020', result: 'First Class' }
        ],
        workExperience: [
          { role: 'System Administrator', organization: 'CloudTech India', period: '2020 - 2023', description: 'Administered enterprise network architectures and cloud backups.' }
        ]
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
        biography: 'Ananya coordinates staff recruitments, files, benefits registry, and organizational culture.',
        education: [
          { degree: 'B.A. in Human Resources', institution: 'Christ University', year: '2019', result: 'GPA 8.2/10' }
        ],
        workExperience: [
          { role: 'HR Generalist', organization: 'Staffing Source Ltd.', period: '2019 - 2022', description: 'Conducted interviews, onboarding procedures, and payroll sync.' }
        ]
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
        biography: 'Sohan leads maintenance personnel and facilities repair/renovations.',
        education: [
          { degree: 'Vocational Diploma in Building Tech', institution: 'ITI Jaipur', year: '2015', result: 'Certified Operator' }
        ],
        workExperience: [
          { role: 'Maintenance Lead', organization: 'Metro Facilities India', period: '2015 - 2021', description: 'Supervised building plumbing, electrical repairs, and structure maintenance.' }
        ]
      }
    ];
    
    const currentStored = localStorage.getItem('employees');
    if (currentStored) {
      const parsed = JSON.parse(currentStored);
      if (parsed.length < 9) {
        localStorage.setItem('employees', JSON.stringify(defaultEmployees));
        empList = defaultEmployees;
      } else {
        empList = parsed;
      }
    } else {
      empList = defaultEmployees;
      localStorage.setItem('employees', JSON.stringify(empList));
    }

    let currentEmp = empList.find(e => e.id === id);
    if (!currentEmp) {
      // Dynamic fallback based on ID so it's guaranteed to be unique and different
      const idNum = id ? id.replace(/\D/g, '') : '999';
      currentEmp = {
        id: id || 'EMP-2026-999',
        name: `Employee ${id || ''}`,
        role: 'Staff Member',
        department: 'General Support',
        type: 'Full-time',
        status: 'On Duty',
        joiningDate: '01 Jan 2026',
        email: `emp.${idNum}@school.edu`,
        phone: `+91 98765 ${idNum.padStart(5, '0')}`,
        address: 'Sector 62, Noida, UP 201301',
        salary: '₹5,00,000 / annum',
        biography: `Staff member at school, registered under ID ${id}.`,
        education: [
          { degree: 'B.Sc. in General Education', institution: 'Delhi University', year: '2018', result: 'Second Class' }
        ],
        workExperience: [
          { role: 'Assistant Analyst', organization: 'Delhi Educational Services', period: '2018 - 2021', description: 'Archived roster lists and coordinated support scheduling.' }
        ]
      };
    }
    
    // Safety check for dynamic listings
    if (currentEmp) {
      // Ensure nested fields are initialized
      const hydratedEmp = {
        ...currentEmp,
        education: currentEmp.education || [
          { degree: 'B.Sc. in General Education', institution: 'Delhi University', year: '2018', result: 'Second Class' }
        ],
        workExperience: currentEmp.workExperience || [
          { role: 'Assistant Analyst', organization: 'Delhi Educational Services', period: '2018 - 2021', description: 'Archived roster lists and coordinated support scheduling.' }
        ]
      };
      
      setEmployee(hydratedEmp);
      setEditName(hydratedEmp.name || '');
      setEditRole(hydratedEmp.role || '');
      setEditDept(hydratedEmp.department || hydratedEmp.dept || '');
      setEditType(hydratedEmp.type || '');
      setEditSalary(hydratedEmp.salary || '');
      setEditEmail(hydratedEmp.email || '');
      setEditPhone(hydratedEmp.phone || '');
      setEditAddress(hydratedEmp.address || '');
      setEditBiography(hydratedEmp.biography || '');
    }
  }, [id]);

  const handleSave = () => {
    if (!editName.trim()) {
      showToastNotification('Name field is required.', 'error', 'Validation Error');
      return;
    }

    const stored = localStorage.getItem('employees');
    if (stored) {
      const empList = JSON.parse(stored);
      const index = empList.findIndex(e => e.id === employee.id);
      
      if (index !== -1) {
        const updatedEmp = {
          ...empList[index],
          name: editName,
          role: editRole,
          department: editDept,
          type: editType,
          salary: editSalary,
          email: editEmail,
          phone: editPhone,
          address: editAddress,
          biography: editBiography
        };
        
        empList[index] = updatedEmp;
        localStorage.setItem('employees', JSON.stringify(empList));
        setEmployee(prev => ({ ...prev, ...updatedEmp }));
        
        setToastMessage("Staff profile synchronized successfully!");
        setShowToast(true);
        setIsEditOpen(false);
        setTimeout(() => setShowToast(false), 3000);
      }
    }
  };

  if (!employee) {
    return (
      <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
        <p style={{ fontWeight: 800, color: 'var(--text-muted)' }}>Resolving staff profile...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <style>
        {`
          .drawer-label {
            display: block; 
            fontSize: 0.75rem; 
            fontWeight: 800; 
            color: var(--text-muted); 
            marginBottom: 6px; 
            textTransform: uppercase;
          }
          .drawer-input {
            width: 100%; 
            padding: 12px 16px; 
            borderRadius: 10px; 
            border: 1px solid var(--border-color); 
            backgroundColor: var(--bg-body); 
            outline: none; 
            fontWeight: 600; 
            color: var(--text-main);
            transition: 0.2s border-color;
          }
          .drawer-input:focus {
            border-color: var(--primary);
          }
          [data-theme='dark'] .drawer-input {
            background-color: var(--bg-body, #0f172a) !important;
            color: var(--text-main, #ffffff) !important;
            border-color: var(--border-color, rgba(255, 255, 255, 0.15)) !important;
          }
          [data-theme='dark'] .drawer-input option {
            background-color: var(--bg-card, #1e293b) !important;
            color: var(--text-main, #ffffff) !important;
          }
        `}
      </style>
      
      {/* Toast Alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{ 
              position: 'fixed', bottom: '40px', right: '40px', zIndex: 1300,
              backgroundColor: 'var(--success)', color: 'white', padding: '16px 24px',
              borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)', fontWeight: 700
            }}
          >
            <ShieldCheck size={20} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
         <button 
           className="icon-btn" 
           onClick={() => navigate('/dashboard/employees')}
           style={{ backgroundColor: 'var(--bg-card)', cursor: 'pointer' }}
         >
           <ChevronLeft size={20} />
         </button>
         <div>
            <h1 className="page-title" style={{ marginBottom: '4px' }}>Employee Profile</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Home / HRM / Employees / {employee.name}</p>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '32px' }}>
         {/* Left Column: Profile Overview */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '40px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
               <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 24px' }}>
                  <div style={{ 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '32px', 
                    backgroundColor: 'var(--primary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px -10px var(--primary)',
                    border: '3px solid var(--bg-card)'
                  }}>
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(employee.name)}`}
                      alt={employee.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', backgroundColor: '#10B981', color: 'white', padding: '6px', borderRadius: '12px', border: '4px solid var(--bg-card)' }}>
                     <ShieldCheck size={16} />
                  </div>
               </div>
               <h2 style={{ fontSize: '1.5rem', fontWeight: 950, marginBottom: '4px' }}>{employee.name}</h2>
               <p style={{ color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '24px' }}>{employee.role}</p>
               
               <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setIsEditOpen(true)}
                    style={{ padding: '10px 20px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Edit size={16} /> Edit Profile
                  </button>
                  <ActionDropdown
                    items={[
                      { label: 'Export Profile Card', icon: <Download size={15} />, onClick: () => {
                          const csvContent = `Field,Detail\nID,${employee.id}\nName,${employee.name}\nRole,${employee.role}\nDepartment,${employee.department}\nType,${employee.type}\nEmail,${employee.email}\nPhone,${employee.phone}\nAddress,${employee.address}`;
                          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `Profile_${employee.name.replace(/\s+/g, '_')}.csv`;
                          link.click();
                          URL.revokeObjectURL(url);
                          showToastNotification('Profile card exported successfully.', 'success', 'HR Systems');
                        }
                      },
                      { label: 'Toggle Flag Exception', icon: <Flag size={15} />, onClick: () => {
                          showToastNotification('Employee record flagged for review.', 'info', 'HR Systems');
                        }
                      },
                      { divider: true },
                      { label: 'Deactivate Staff Record', icon: <X size={15} />, danger: true, onClick: () => {
                          showToastNotification('Deactivation command submitted to HR Admin.', 'error', 'Authorization Required');
                        }
                      }
                    ]}
                  />
               </div>
            </div>

            <div className="card" style={{ padding: '28px', border: '1px solid var(--border-color)' }}>
               <h3 style={{ fontSize: '1rem', fontWeight: 950, marginBottom: '20px' }}>Contact Information</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                     <div style={{ color: 'var(--primary)' }}><Mail size={18} /></div>
                     <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>EMAIL ADDRESS</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{employee.email}</div>
                     </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                     <div style={{ color: 'var(--primary)' }}><Phone size={18} /></div>
                     <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>PHONE NUMBER</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{employee.phone}</div>
                     </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                     <div style={{ color: 'var(--primary)' }}><MapPin size={18} /></div>
                     <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>CAMPUS OFFICE</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{employee.address}</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Column: Details & Tabs */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="card" style={{ padding: '0', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
               <div style={{ padding: '0 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '32px' }}>
                  {['Professional Information', 'Education & Experience', 'Payroll & Benefits', 'Documents'].map((tab) => (
                     <div 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{ 
                           padding: '24px 0', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer',
                           color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                           borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent'
                        }}
                     >{tab}</div>
                  ))}
               </div>
               
               <div style={{ padding: '40px' }}>
                  {activeTab === 'Professional Information' && (
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        <div>
                           <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '1px' }}>Employment Details</h4>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px dashed var(--border-color)' }}>
                                 <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Employee ID</span>
                                 <span style={{ fontWeight: 800 }}>{employee.id}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px dashed var(--border-color)' }}>
                                 <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Department</span>
                                 <span style={{ fontWeight: 800 }}>{employee.department}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px dashed var(--border-color)' }}>
                                 <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Designation</span>
                                 <span style={{ fontWeight: 800 }}>{employee.role}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                 <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Contract Type</span>
                                 <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{employee.type}</span>
                              </div>
                           </div>
                        </div>
                        <div>
                           <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '1px' }}>Biography & Background</h4>
                           <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.8', color: 'var(--text-muted)', fontWeight: 600 }}>{employee.biography}</p>
                           <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <CheckCircle2 size={20} color="#10B981" />
                              <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Verified by Institutional HR Council</span>
                           </div>
                        </div>
                     </div>
                  )}

                  {activeTab === 'Education & Experience' && (
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        <div>
                           <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '1px' }}>Academic History</h4>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                              {employee.education.map((edu, idx) => (
                                 <div key={idx} style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                    <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px' }}>{edu.degree}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '4px' }}>{edu.institution}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                       <span>Class of {edu.year}</span>
                                       <span>{edu.result}</span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div>
                           <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '1px' }}>Work Experience</h4>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                              {employee.workExperience.map((exp, idx) => (
                                 <div key={idx} style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid var(--primary-light)' }}>
                                    <div style={{ position: 'absolute', left: '-7px', top: '0', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary)', border: '2px solid white' }}></div>
                                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{exp.role}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '4px' }}>{exp.organization}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '8px' }}>{exp.period}</div>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', fontWeight: 600 }}>{exp.description}</p>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  )}

                  {activeTab === 'Payroll & Benefits' && (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                           <div>
                              <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '1px' }}>Salary Breakdown</h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                 {[
                                    { label: 'Basic Salary', value: '$6,000.00' },
                                    { label: 'House Rent Allowance (HRA)', value: '$1,200.00' },
                                    { label: 'Conveyance Allowance', value: '$300.00' },
                                    { label: 'Special Allowance', value: '$583.33' }
                                 ].map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                                       <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.label}</span>
                                       <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{item.value}</span>
                                    </div>
                                 ))}
                                 <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', padding: '16px', backgroundColor: 'var(--primary-light)', borderRadius: '12px' }}>
                                    <span style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '1rem' }}>Gross Monthly Salary</span>
                                    <span style={{ fontWeight: 950, color: 'var(--primary)', fontSize: '1rem' }}>{employee.salary.includes('/') ? employee.salary.split(' ')[0] : employee.salary}</span>
                                 </div>
                              </div>
                           </div>
                           <div>
                              <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '1px' }}>Deductions & Net Pay</h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                 {[
                                    { label: 'Income Tax (TDS)', value: '-$800.00', color: '#EF4444' },
                                    { label: 'Provident Fund (PF)', value: '-$200.00', color: '#EF4444' },
                                    { label: 'Health Insurance', value: '-$50.00', color: '#EF4444' }
                                 ].map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                                       <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.label}</span>
                                       <span style={{ fontWeight: 800, fontSize: '0.9rem', color: item.color }}>{item.value}</span>
                                    </div>
                                 ))}
                                 <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                    <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>Net Monthly Take-home</span>
                                    <span style={{ fontWeight: 950, fontSize: '1.1rem', color: 'var(--primary)' }}>$7,033.33</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div>
                           <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '1px' }}>Payment Repository</h4>
                           <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                              <thead>
                                 <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-body)' }}>
                                    <th style={{ padding: '12px 20px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>PAYMENT CYCLE</th>
                                    <th style={{ padding: '12px 20px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>METHOD</th>
                                    <th style={{ padding: '12px 20px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>STATUS</th>
                                    <th style={{ padding: '12px 20px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'right' }}>ACTION</th>
                                 </tr>
                              </thead>
                              <tbody>
                                  {['May 2026', 'April 2026', 'March 2026'].map((month, idx) => (
                                     <tr key={idx} style={{ borderTop: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.85rem' }}>{month}</td>
                                        <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Bank Transfer (**** 4291)</td>
                                        <td style={{ padding: '16px 20px' }}>
                                           <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 900, backgroundColor: '#10B98115', color: '#10B981' }}>DISBURSED</span>
                                        </td>
                                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                           <button 
                                             onClick={() => downloadPayslip(month)}
                                             className="icon-btn" 
                                             style={{ width: '32px', height: '32px', backgroundColor: 'var(--bg-body)', cursor: 'pointer' }}
                                             title="Download Payslip"
                                           >
                                             <Download size={14} />
                                           </button>
                                        </td>
                                     </tr>
                                  ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  )}

                  {activeTab === 'Documents' && (
                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        <div style={{ gridColumn: '1 / -1', marginBottom: '8px' }}>
                           <div style={{ padding: '16px 24px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <ShieldCheck size={20} className="text-primary" />
                              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>Institutional Document Policy: All uploaded documents are encrypted and accessible only by HR Administrators and Legal Council.</span>
                           </div>
                        </div>
                        {documentsList.map((doc, idx) => (
                           <div key={idx} className="card" style={{ padding: '20px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', display: 'flex', flexDirection: 'column', gap: '20px', transition: '0.3s' }}>
                              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                 <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg-body)', color: 'var(--primary)', border: '1px solid var(--border-color)' }}>
                                    <FileText size={24} />
                                 </div>
                                 <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 900, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '2px' }}>{doc.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>{doc.type} • {doc.size}</div>
                                 </div>
                              </div>
                              
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: doc.status === 'Verified' ? '#10B981' : '#F59E0B' }}></div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>{doc.status}</span>
                                 </div>
                                 <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                      onClick={() => downloadDocument(doc)}
                                      className="icon-btn" 
                                      style={{ width: '32px', height: '32px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer' }} 
                                      title="Download"
                                    >
                                      <Download size={14} />
                                    </button>
                                    <button 
                                      onClick={() => viewDocument(doc)}
                                      className="icon-btn" 
                                      style={{ width: '32px', height: '32px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer' }} 
                                      title="View"
                                    >
                                      <ArrowUpRight size={14} />
                                    </button>
                                 </div>
                              </div>
                           </div>
                        ))}
                        <div 
                           onClick={handleUploadClick}
                           style={{ border: '2px dashed var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '8px' }}
                        >
                           <Plus size={24} className="text-muted" />
                           <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)' }}>Upload New Document</span>
                           <input 
                             type="file" 
                             id="doc-upload-input" 
                             style={{ display: 'none' }} 
                             onChange={handleFileUpload} 
                           />
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>

      {/* Edit Drawer Overlay */}
      <AnimatePresence>
        {isEditOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', justifyContent: 'flex-end' }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsEditOpen(false)} 
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                width: '520px', height: '100%', backgroundColor: 'var(--bg-card)', 
                padding: '40px', position: 'relative', boxShadow: 'var(--shadow-2xl)', 
                display: 'flex', flexDirection: 'column', zIndex: 1210, overflow: 'hidden'
              }}
            >
              {/* Drawer Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-main)', margin: 0 }}>Edit Staff Record</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>Update biographical and operational details for {employee.id}</p>
                </div>
                <button 
                  onClick={() => setIsEditOpen(false)} 
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Form Body */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', paddingRight: '4px', paddingBottom: '20px' }}>
                
                {/* Section: Biographical Info */}
                <div>
                  <h3 style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>Biographical Info</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <span className="drawer-label">Full Legal Name</span>
                      <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="drawer-input" 
                      />
                    </div>
                    <div>
                      <span className="drawer-label">Biography & Context</span>
                      <textarea 
                        value={editBiography}
                        onChange={(e) => setEditBiography(e.target.value)}
                        rows={3}
                        className="drawer-input"
                        style={{ resize: 'none', lineHeight: '1.6' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Job Assignment */}
                <div>
                  <h3 style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>Job & Designation</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <span className="drawer-label">Designation / Role</span>
                      <input 
                        type="text" 
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="drawer-input" 
                      />
                    </div>
                    <div>
                      <span className="drawer-label">Department</span>
                      <input 
                        type="text" 
                        value={editDept}
                        onChange={(e) => setEditDept(e.target.value)}
                        className="drawer-input" 
                      />
                    </div>
                    <div>
                      <span className="drawer-label">Contract Type</span>
                      <select 
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                        className="drawer-input"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Visiting">Visiting Faculty</option>
                      </select>
                    </div>
                    <div>
                      <span className="drawer-label">Annual Salary</span>
                      <input 
                        type="text" 
                        value={editSalary}
                        onChange={(e) => setEditSalary(e.target.value)}
                        className="drawer-input" 
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Contact Coordinates */}
                <div>
                  <h3 style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>Contact Coordinates</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <span className="drawer-label">Email Address</span>
                        <input 
                          type="email" 
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="drawer-input" 
                        />
                      </div>
                      <div>
                        <span className="drawer-label">Phone Number</span>
                        <input 
                          type="text" 
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="drawer-input" 
                        />
                      </div>
                    </div>
                    <div>
                      <span className="drawer-label">Campus Office / Desk Location</span>
                      <input 
                        type="text" 
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        className="drawer-input" 
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '24px', backgroundColor: 'var(--bg-card)' }}>
                <button 
                  onClick={() => setIsEditOpen(false)} 
                  style={{ 
                    flex: 1, 
                    padding: '14px', 
                    borderRadius: '12px', 
                    border: '1px solid var(--border-color)', 
                    backgroundColor: 'transparent', 
                    color: 'var(--text-main)', 
                    fontWeight: 800, 
                    cursor: 'pointer', 
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' 
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                    e.currentTarget.style.color = '#EF4444';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-main)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Discard
                </button>
                <button 
                  onClick={handleSave} 
                  style={{ 
                    flex: 1, 
                    padding: '14px', 
                    borderRadius: '12px', 
                    border: 'none', 
                    backgroundColor: 'var(--primary)', 
                    color: 'white', 
                    fontWeight: 950, 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px', 
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 12px rgba(72,128,255,0.2)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(72,128,255,0.35)';
                    e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(72,128,255,0.2)';
                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                  }}
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ToastRenderer toast={toast} onClose={hideToast} />
    </div>
  );
};

export default EmployeeDetails;
