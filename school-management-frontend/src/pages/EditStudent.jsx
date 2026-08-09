import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, GraduationCap, MapPin, Save, X, Info, Users as UsersIcon,
  Camera, ArrowLeft, RotateCw, ZoomIn, ZoomOut, Loader2, Check, CheckCircle2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import indianMan1 from '../assets/indian_man_portrait_1.png';
import indianMan2 from '../assets/indian_man_portrait_2.png';
import indianWoman1 from '../assets/indian_woman_portrait_1.png';
import indianWoman2 from '../assets/indian_woman_portrait_2.png';

const EditStudent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('personal');

  // Cropper & Adjuster modal states
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropperImage, setCropperImage] = useState(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropRotation, setCropRotation] = useState(0);

  // Verification timeline states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState(0);

  // Toast state
  const [toast, setToast] = useState(null);

  // Helper to show toast alerts
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Form State initialized dynamically from localStorage (best practice)
  const [formData, setFormData] = useState(() => {
    const storedStudents = localStorage.getItem('students');
    if (!storedStudents) {
      const defaultList = [
        { student_id: 'STU101', name: 'Aman Verma', email: 'aman.verma@edupro.edu', phone: '+91 98765 43210', class_id: '10', section: 'A', rollNo: '24', admission_date: '2026-01-12', gender: 'Male', status: 'Active', avatar: indianMan1, dob: '2010-05-12', bloodGroup: 'O+', religion: 'Hinduism', parentName: 'Ramesh Verma', parentOccupation: 'Engineer', parentPhone: '+91 98765 43210', parentEmail: 'ramesh.v@example.com', presentAddress: 'Block C, Sector 62, Noida, UP', permanentAddress: 'Block C, Sector 62, Noida, UP' },
        { student_id: 'STU102', name: 'Divya Joshi', email: 'divya.joshi@edupro.edu', phone: '+91 98765 43211', class_id: '11', section: 'A', rollNo: '12', admission_date: '2026-01-15', gender: 'Female', status: 'Active', avatar: indianWoman1, dob: '2009-08-18', bloodGroup: 'A-', religion: 'Hinduism', parentName: 'Suresh Joshi', parentOccupation: 'Executive', parentPhone: '+91 98765 43211', parentEmail: 'suresh.j@example.com', presentAddress: 'Preet Vihar, New Delhi', permanentAddress: 'Preet Vihar, New Delhi' },
        { student_id: 'STU103', name: 'Rohan Das', email: 'rohan.das@edupro.edu', phone: '+91 98765 43212', class_id: '10', section: 'A', rollNo: '08', admission_date: '2026-02-02', gender: 'Male', status: 'Active', avatar: indianMan2, dob: '2010-03-05', bloodGroup: 'B+', religion: 'Hinduism', parentName: 'Manoj Das', parentOccupation: 'Manager', parentPhone: '+91 98765 43212', parentEmail: 'manoj.d@example.com', presentAddress: 'Salt Lake, Kolkata, WB', permanentAddress: 'Salt Lake, Kolkata, WB' },
        { student_id: 'STU104', name: 'Karan Mehta', email: 'karan.mehta@school.edu', phone: '+91 98765 43213', class_id: '12', section: 'B', rollNo: '14', admission_date: '2026-02-10', gender: 'Male', status: 'Inactive', avatar: indianMan1, dob: '2008-04-12', bloodGroup: 'AB+', religion: 'Hinduism', parentName: 'Harish Mehta', parentOccupation: 'Business', parentPhone: '+91 98765 43213', parentEmail: 'harish.m@example.com', presentAddress: 'Andheri West, Mumbai, MH', permanentAddress: 'Andheri West, Mumbai, MH' },
        { student_id: 'STU105', name: 'Isha Sen', email: 'isha.sen@school.edu', phone: '+91 98765 43214', class_id: '10', section: 'A', rollNo: '15', admission_date: '2026-03-05', gender: 'Female', status: 'Active', avatar: indianWoman2, dob: '2010-09-23', bloodGroup: 'O+', religion: 'Hinduism', parentName: 'Pradip Sen', parentOccupation: 'Lawyer', parentPhone: '+91 98765 43214', parentEmail: 'pradip.s@example.com', presentAddress: 'Jayanagar, Bangalore, KA', permanentAddress: 'Jayanagar, Bangalore, KA' },
        { student_id: 'STU106', name: 'Aditi Nair', email: 'aditi.nair@school.edu', phone: '+91 98765 43215', class_id: '09', section: 'C', rollNo: '02', admission_date: '2026-03-12', gender: 'Female', status: 'Active', avatar: indianWoman1, dob: '2011-03-12', bloodGroup: 'A+', religion: 'Hinduism', parentName: 'Narayanan Nair', parentOccupation: 'Doctor', parentPhone: '+91 98765 43215', parentEmail: 'narayanan.n@example.com', presentAddress: 'Adyar, Chennai, TN', permanentAddress: 'Adyar, Chennai, TN' },
        { student_id: 'STU107', name: 'Rahul Kapoor', email: 'rahul.kapoor@school.edu', phone: '+91 98765 43216', class_id: '11', section: 'B', rollNo: '05', admission_date: '2026-04-01', gender: 'Male', status: 'Active', avatar: indianMan2, dob: '2009-04-01', bloodGroup: 'B-', religion: 'Hinduism', parentName: 'Anil Kapoor', parentOccupation: 'Accountant', parentPhone: '+91 98765 43216', parentEmail: 'anil.k@example.com', presentAddress: 'Banjara Hills, Hyderabad, TS', permanentAddress: 'Banjara Hills, Hyderabad, TS' },
        { student_id: 'STU108', name: 'Neha Sharma', email: 'neha.sharma@school.edu', phone: '+91 98765 43217', class_id: '12', section: 'A', rollNo: '07', admission_date: '2026-04-15', gender: 'Female', status: 'Active', avatar: indianWoman2, dob: '2008-04-15', bloodGroup: 'AB-', religion: 'Hinduism', parentName: 'Satish Sharma', parentOccupation: 'Architect', parentPhone: '+91 98765 43217', parentEmail: 'satish.s@example.com', presentAddress: 'Kothrud, Pune, MH', permanentAddress: 'Kothrud, Pune, MH' },
        { student_id: 'STU109', name: 'Riya Banerjee', email: 'riya.banerjee@school.edu', phone: '+91 98765 43218', class_id: '10', section: 'D', rollNo: '11', admission_date: '2026-05-01', gender: 'Female', status: 'Active', avatar: indianWoman1, dob: '2010-05-01', bloodGroup: 'O-', religion: 'Hinduism', parentName: 'Swapan Banerjee', parentOccupation: 'Teacher', parentPhone: '+91 98765 43218', parentEmail: 'swapan.b@example.com', presentAddress: 'Lake Town, Kolkata, WB', permanentAddress: 'Lake Town, Kolkata, WB' },
        { student_id: 'STU110', name: 'Arjun Reddy', email: 'arjun.reddy@school.edu', phone: '+91 98765 43219', class_id: '11', section: 'A', rollNo: '18', admission_date: '2026-05-05', gender: 'Male', status: 'Active', avatar: indianMan1, dob: '2009-05-05', bloodGroup: 'A+', religion: 'Hinduism', parentName: 'Ramana Reddy', parentOccupation: 'Dentist', parentPhone: '+91 98765 43219', parentEmail: 'ramana.r@example.com', presentAddress: 'Gachibowli, Hyderabad, TS', permanentAddress: 'Gachibowli, Hyderabad, TS' },
        { student_id: 'STU212', name: 'Kavita Krishnan', email: 'kavita.k@example.com', phone: '+91 98765 43220', class_id: '11', section: 'A', rollNo: '03', admission_date: '2026-11-14', gender: 'Female', status: 'Suspended', avatar: indianWoman2, dob: '2009-11-14', bloodGroup: 'A+', religion: 'Hinduism', parentName: 'Gopal Krishnan', parentOccupation: 'Doctor', parentPhone: '+91 98765 43220', parentEmail: 'gopal.k@example.com', presentAddress: 'Indiranagar, Bangalore, KA', permanentAddress: 'Indiranagar, Bangalore, KA' }
      ];
      localStorage.setItem('students', JSON.stringify(defaultList));
    }

    const targetId = id || 'STU101';
    const parsedStudents = JSON.parse(localStorage.getItem('students') || '[]');
    const found = parsedStudents.find(s => s.student_id === targetId);

    if (found) {
      const names = found.name.split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';
      return {
        firstName,
        lastName,
        gender: found.gender ? found.gender.toLowerCase() : 'male',
        dob: found.dob || '2010-05-15',
        bloodGroup: found.bloodGroup || 'O+',
        religion: found.religion || 'Hinduism',
        admissionId: found.student_id,
        rollNo: found.rollNo || '15',
        class: found.class_id || '10',
        section: found.section || 'A',
        parentName: found.parentName || 'Ramesh Verma',
        parentOccupation: found.parentOccupation || 'Engineer',
        parentPhone: found.parentPhone || '+91 98765 43210',
        parentEmail: found.parentEmail || 'ramesh.v@example.com',
        presentAddress: found.presentAddress || 'Block C, Sector 62, Noida, UP',
        permanentAddress: found.permanentAddress || 'Block C, Sector 62, Noida, UP',
        phone: found.phone || '+91 98765 43210',
        email: found.email || 'student@edupro.edu',
        admissionDate: found.admissionDate || found.admission_date || '2025-09-01',
        avatar: found.avatar || '',
        status: found.status || 'Active'
      };
    }

    return {
      firstName: 'Aman',
      lastName: 'Verma',
      gender: 'male',
      dob: '2010-05-15',
      bloodGroup: 'O+',
      religion: 'Hinduism',
      admissionId: targetId,
      rollNo: '15',
      class: '10',
      section: 'A',
      parentName: 'Ramesh Verma',
      parentOccupation: 'Engineer',
      parentPhone: '+91 98765 43210',
      parentEmail: 'ramesh.v@example.com',
      presentAddress: 'Block C, Sector 62, Noida, UP',
      permanentAddress: 'Block C, Sector 62, Noida, UP',
      phone: '+91 98765 43210',
      email: 'aman.verma@edupro.edu',
      admissionDate: '2025-09-01',
      avatar: indianMan1,
      status: 'Active'
    };
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Photo Uploader Handler
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
      const size = 300;
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
      setFormData(prev => ({ ...prev, avatar: base64Img }));
      setIsCropModalOpen(false);
      showToast('success', 'Profile photo cropped and applied.');
    };
  };

  // Submit and Verification Overlay Simulation
  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (!formData.firstName || !formData.lastName) {
      showToast('info', 'First Name and Last Name are required.');
      setActiveTab('personal');
      return;
    }
    if (!formData.parentName || !formData.parentPhone) {
      showToast('info', 'Parent Name and Parent Phone are required.');
      setActiveTab('guardian');
      return;
    }

    setIsVerifying(true);
    setVerifyStep(0);
  };

  useEffect(() => {
    if (!isVerifying) return;

    if (verifyStep < 4) {
      const timer = setTimeout(() => {
        setVerifyStep(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        const targetId = id || 'STU101';
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();

        const stored = localStorage.getItem('students');
        let list = [];
        if (stored) {
          list = JSON.parse(stored);
        } else {
          list = [
            { student_id: 'STU101', name: 'Aman Verma', email: 'aman.verma@edupro.edu', phone: '+91 98765 43210', class_id: '10', section: 'A', rollNo: '24', admission_date: '2026-01-12', gender: 'Male', status: 'Active', avatar: indianMan1, dob: '2010-05-12', bloodGroup: 'O+', religion: 'Hinduism', parentName: 'Ramesh Verma', parentOccupation: 'Engineer', parentPhone: '+91 98765 43210', parentEmail: 'ramesh.v@example.com', presentAddress: 'Block C, Sector 62, Noida, UP', permanentAddress: 'Block C, Sector 62, Noida, UP' },
            { student_id: 'STU102', name: 'Divya Joshi', email: 'divya.joshi@edupro.edu', phone: '+91 98765 43211', class_id: '11', section: 'A', rollNo: '12', admission_date: '2026-01-15', gender: 'Female', status: 'Active', avatar: indianWoman1, dob: '2009-08-18', bloodGroup: 'A-', religion: 'Hinduism', parentName: 'Suresh Joshi', parentOccupation: 'Executive', parentPhone: '+91 98765 43211', parentEmail: 'suresh.j@example.com', presentAddress: 'Preet Vihar, New Delhi', permanentAddress: 'Preet Vihar, New Delhi' },
            { student_id: 'STU103', name: 'Rohan Das', email: 'rohan.das@edupro.edu', phone: '+91 98765 43212', class_id: '10', section: 'A', rollNo: '08', admission_date: '2026-02-02', gender: 'Male', status: 'Active', avatar: indianMan2, dob: '2010-03-05', bloodGroup: 'B+', religion: 'Hinduism', parentName: 'Manoj Das', parentOccupation: 'Manager', parentPhone: '+91 98765 43212', parentEmail: 'manoj.d@example.com', presentAddress: 'Salt Lake, Kolkata, WB', permanentAddress: 'Salt Lake, Kolkata, WB' },
            { student_id: 'STU104', name: 'Karan Mehta', email: 'karan.mehta@school.edu', phone: '+91 98765 43213', class_id: '12', section: 'B', rollNo: '14', admission_date: '2026-02-10', gender: 'Male', status: 'Inactive', avatar: indianMan1, dob: '2008-04-12', bloodGroup: 'AB+', religion: 'Hinduism', parentName: 'Harish Mehta', parentOccupation: 'Business', parentPhone: '+91 98765 43213', parentEmail: 'harish.m@example.com', presentAddress: 'Andheri West, Mumbai, MH', permanentAddress: 'Andheri West, Mumbai, MH' },
            { student_id: 'STU105', name: 'Isha Sen', email: 'isha.sen@school.edu', phone: '+91 98765 43214', class_id: '10', section: 'A', rollNo: '15', admission_date: '2026-03-05', gender: 'Female', status: 'Active', avatar: indianWoman2, dob: '2010-09-23', bloodGroup: 'O+', religion: 'Hinduism', parentName: 'Pradip Sen', parentOccupation: 'Lawyer', parentPhone: '+91 98765 43214', parentEmail: 'pradip.s@example.com', presentAddress: 'Jayanagar, Bangalore, KA', permanentAddress: 'Jayanagar, Bangalore, KA' },
            { student_id: 'STU106', name: 'Aditi Nair', email: 'aditi.nair@school.edu', phone: '+91 98765 43215', class_id: '09', section: 'C', rollNo: '02', admission_date: '2026-03-12', gender: 'Female', status: 'Active', avatar: indianWoman1, dob: '2011-03-12', bloodGroup: 'A+', religion: 'Hinduism', parentName: 'Narayanan Nair', parentOccupation: 'Doctor', parentPhone: '+91 98765 43215', parentEmail: 'narayanan.n@example.com', presentAddress: 'Adyar, Chennai, TN', permanentAddress: 'Adyar, Chennai, TN' },
            { student_id: 'STU107', name: 'Rahul Kapoor', email: 'rahul.kapoor@school.edu', phone: '+91 98765 43216', class_id: '11', section: 'B', rollNo: '05', admission_date: '2026-04-01', gender: 'Male', status: 'Active', avatar: indianMan2, dob: '2009-04-01', bloodGroup: 'B-', religion: 'Hinduism', parentName: 'Anil Kapoor', parentOccupation: 'Accountant', parentPhone: '+91 98765 43216', parentEmail: 'anil.k@example.com', presentAddress: 'Banjara Hills, Hyderabad, TS', permanentAddress: 'Banjara Hills, Hyderabad, TS' },
            { student_id: 'STU108', name: 'Neha Sharma', email: 'neha.sharma@school.edu', phone: '+91 98765 43217', class_id: '12', section: 'A', rollNo: '07', admission_date: '2026-04-15', gender: 'Female', status: 'Active', avatar: indianWoman2, dob: '2008-04-15', bloodGroup: 'AB-', religion: 'Hinduism', parentName: 'Satish Sharma', parentOccupation: 'Architect', parentPhone: '+91 98765 43217', parentEmail: 'satish.s@example.com', presentAddress: 'Kothrud, Pune, MH', permanentAddress: 'Kothrud, Pune, MH' },
            { student_id: 'STU109', name: 'Riya Banerjee', email: 'riya.banerjee@school.edu', phone: '+91 98765 43218', class_id: '10', section: 'D', rollNo: '11', admission_date: '2026-05-01', gender: 'Female', status: 'Active', avatar: indianWoman1, dob: '2010-05-01', bloodGroup: 'O-', religion: 'Hinduism', parentName: 'Swapan Banerjee', parentOccupation: 'Teacher', parentPhone: '+91 98765 43218', parentEmail: 'swapan.b@example.com', presentAddress: 'Lake Town, Kolkata, WB', permanentAddress: 'Lake Town, Kolkata, WB' },
            { student_id: 'STU110', name: 'Arjun Reddy', email: 'arjun.reddy@school.edu', phone: '+91 98765 43219', class_id: '11', section: 'A', rollNo: '18', admission_date: '2026-05-05', gender: 'Male', status: 'Active', avatar: indianMan1, dob: '2009-05-05', bloodGroup: 'A+', religion: 'Hinduism', parentName: 'Ramana Reddy', parentOccupation: 'Dentist', parentPhone: '+91 98765 43219', parentEmail: 'ramana.r@example.com', presentAddress: 'Gachibowli, Hyderabad, TS', permanentAddress: 'Gachibowli, Hyderabad, TS' },
            { student_id: 'STU212', name: 'Kavita Krishnan', email: 'kavita.k@example.com', phone: '+91 98765 43220', class_id: '11', section: 'A', rollNo: '03', admission_date: '2026-11-14', gender: 'Female', status: 'Suspended', avatar: indianWoman2, dob: '2009-11-14', bloodGroup: 'A+', religion: 'Hinduism', parentName: 'Gopal Krishnan', parentOccupation: 'Doctor', parentPhone: '+91 98765 43220', parentEmail: 'gopal.k@example.com', presentAddress: 'Indiranagar, Bangalore, KA', permanentAddress: 'Indiranagar, Bangalore, KA' }
          ];
        }

        const updatedRecord = {
          student_id: targetId,
          name: fullName,
          email: formData.email,
          phone: formData.phone,
          class_id: formData.class,
          section: formData.section,
          rollNo: formData.rollNo,
          admission_date: formData.admissionDate,
          gender: formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1).toLowerCase(),
          status: formData.status,
          avatar: formData.avatar || (formData.gender && formData.gender.toLowerCase() === 'female' ? indianWoman1 : indianMan1),
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

        const newList = list.map(s => s.student_id === targetId ? updatedRecord : s);
        localStorage.setItem('students', JSON.stringify(newList));

        setIsVerifying(false);
        navigate(`/dashboard/student-details/${targetId}`);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isVerifying, verifyStep, id, formData, navigate]);

  const tabs = [
    { id: 'personal', label: 'Personal Details', icon: <User size={18} /> },
    { id: 'academic', label: 'Academic Info', icon: <GraduationCap size={18} /> },
    { id: 'guardian', label: 'Guardian Details', icon: <UsersIcon size={18} /> },
    { id: 'contact', label: 'Contact & Address', icon: <MapPin size={18} /> }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px' }}
    >
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            type="button"
            onClick={() => navigate(-1)}
            style={{ 
              width: '48px', height: '48px', borderRadius: '14px', border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-main)'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, color: 'var(--text-main)', letterSpacing: '-1px' }}>Edit Student Profile</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px', fontWeight: 500 }}>
              Updating records for <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{formData.firstName} {formData.lastName}</span> (ID: {formData.admissionId})
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            type="button"
            onClick={handleSubmit} 
            className="btn btn-primary" 
            style={{ padding: '12px 32px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px -5px rgba(69, 179, 224, 0.4)' }}
          >
            <Save size={18} /> <span style={{ fontWeight: 800 }}>Update Records</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px' }}>
        {/* Left Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="card" style={{ padding: '32px', borderRadius: '24px', textAlign: 'center' }}>
            <div 
              onClick={() => fileInputRef.current.click()}
              style={{ 
                width: '140px', height: '140px', borderRadius: '40px', backgroundColor: 'var(--bg-body)', 
                border: '2px dashed var(--border-color)', margin: '0 auto 24px', display: 'flex', 
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)',
                cursor: 'pointer', transition: '0.3s', overflow: 'hidden', position: 'relative'
              }}
            >
              {formData.avatar ? (
                <img src={formData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '3rem', fontWeight: 900 }}>
                  {formData.firstName.charAt(0)}
                </div>
              )}
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', opacity: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', transition: '0.3s' }} onMouseOver={(e) => e.currentTarget.style.opacity = 1} onMouseOut={(e) => e.currentTarget.style.opacity = 0}>
                <Camera size={24} />
                <span style={{ fontSize: '0.7rem', fontWeight: 800, marginTop: '4px' }}>CHANGE</span>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoSelect} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>{formData.firstName} {formData.lastName}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Active Student • Class {formData.class}</p>
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
        </div>

        {/* Right Content */}
        <div className="card" style={{ padding: '40px', borderRadius: '32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {activeTab === 'personal' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', borderBottom: '2px solid var(--primary-light)', paddingBottom: '16px', display: 'inline-block', width: 'fit-content' }}>Student Personal Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>FIRST NAME *</label>
                    <input type="text" name="firstName" className="form-input" value={formData.firstName} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>LAST NAME *</label>
                    <input type="text" name="lastName" className="form-input" value={formData.lastName} onChange={handleInputChange} required />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>GENDER *</label>
                    <select name="gender" className="form-input" value={formData.gender} onChange={handleInputChange}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>DATE OF BIRTH *</label>
                    <input type="date" name="dob" className="form-input" value={formData.dob} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>BLOOD GROUP</label>
                    <input type="text" name="bloodGroup" className="form-input" value={formData.bloodGroup} onChange={handleInputChange} />
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
                    <input type="text" name="admissionId" className="form-input" value={formData.admissionId} readOnly style={{ backgroundColor: 'var(--bg-body)', cursor: 'not-allowed' }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>ROLL NUMBER *</label>
                    <input type="text" name="rollNo" className="form-input" value={formData.rollNo} onChange={handleInputChange} required />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>CLASS / GRADE *</label>
                    <select name="class" className="form-input" value={formData.class} onChange={handleInputChange}>
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(c => <option key={c} value={c}>Class {c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>SECTION *</label>
                    <select name="section" className="form-input" value={formData.section} onChange={handleInputChange}>
                      {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>Section {s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>ADMISSION DATE</label>
                    <input type="date" name="admissionDate" className="form-input" value={formData.admissionDate} onChange={handleInputChange} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'guardian' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', borderBottom: '2px solid var(--primary-light)', paddingBottom: '16px', display: 'inline-block', width: 'fit-content' }}>Parent / Guardian Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>PARENT / GUARDIAN NAME *</label>
                    <input type="text" name="parentName" className="form-input" value={formData.parentName} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>RELATIONSHIP *</label>
                    <select name="guardianRelation" className="form-input" value={formData.guardianRelation || 'Father'} onChange={handleInputChange}>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Other">Other / Legal Guardian</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>PHONE NUMBER *</label>
                    <input type="tel" name="parentPhone" className="form-input" value={formData.parentPhone} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>EMAIL ADDRESS</label>
                    <input type="email" name="parentEmail" className="form-input" value={formData.parentEmail} onChange={handleInputChange} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>OCCUPATION</label>
                    <input type="text" name="parentOccupation" className="form-input" value={formData.parentOccupation} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>EMERGENCY CONTACT?</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '52px' }}>
                      <input type="checkbox" id="emergency" style={{ width: '20px', height: '20px', cursor: 'pointer' }} defaultChecked />
                      <label htmlFor="emergency" style={{ fontWeight: 700, cursor: 'pointer' }}>Yes, use as primary emergency contact</label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'contact' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', borderBottom: '2px solid var(--primary-light)', paddingBottom: '16px', display: 'inline-block', width: 'fit-content' }}>Contact & Address Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>STUDENT PHONE</label>
                    <input type="tel" name="phone" className="form-input" value={formData.phone} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>STUDENT EMAIL</label>
                    <input type="email" name="email" className="form-input" value={formData.email} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>PRESENT ADDRESS</label>
                  <textarea name="presentAddress" className="form-input" style={{ height: '100px', resize: 'none', padding: '16px' }} value={formData.presentAddress} onChange={handleInputChange}></textarea>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>PERMANENT ADDRESS</label>
                  <textarea name="permanentAddress" className="form-input" style={{ height: '100px', resize: 'none', padding: '16px' }} value={formData.permanentAddress} onChange={handleInputChange}></textarea>
                </div>
              </motion.div>
            )}

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '40px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <button type="button" className="btn" onClick={() => navigate(-1)} style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>Discard Changes</button>
              <button type="submit" className="btn btn-primary" style={{ padding: '14px 40px', borderRadius: '14px', fontWeight: 900 }}>Save Changes</button>
            </div>
          </form>
        </div>
      </div>

      {/* Cropper Adjuster Modal */}
      <AnimatePresence>
        {isCropModalOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                width: '100%', maxWidth: '440px', backgroundColor: 'var(--bg-card)', 
                borderRadius: '32px', border: '1px solid var(--border-color)', 
                overflow: 'hidden', color: 'var(--text-main)', boxShadow: 'var(--shadow-lg)'
              }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 955 }}>Adjust Profile Photo</h3>
                <button onClick={() => setIsCropModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                
                {/* Crop Circular Target Screen */}
                <div style={{ width: '220px', height: '220px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--primary)', position: 'relative', backgroundColor: '#0f172a' }}>
                  <img 
                    src={cropperImage} 
                    alt="Source" 
                    style={{
                      width: '100%', height: '100%', objectFit: 'contain',
                      transform: `scale(${cropZoom}) rotate(${cropRotation}deg)`,
                      transition: 'transform 0.15s ease-out'
                    }}
                  />
                </div>

                {/* Crop Slider controls */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <ZoomOut size={16} color="var(--text-muted)" />
                    <input 
                      type="range" min="1" max="3" step="0.05" 
                      value={cropZoom} 
                      onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                      style={{ flex: 1, height: '6px', borderRadius: '3px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                    />
                    <ZoomIn size={16} color="var(--primary)" />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Zoom: {cropZoom.toFixed(1)}x</span>
                    <button 
                      type="button"
                      onClick={() => setCropRotation(prev => (prev + 90) % 360)}
                      style={{
                        padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.75rem', fontWeight: 800,
                        display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
                      }}
                    >
                      <RotateCw size={14} /> Rotate 90°
                    </button>
                  </div>
                </div>

              </div>
              <div style={{ padding: '24px', backgroundColor: 'var(--bg-body)', display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setIsCropModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                <button type="button" onClick={handleCropSave} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 800, cursor: 'pointer' }}>Apply Photo</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Verification Timeline Overlay */}
      <AnimatePresence>
        {isVerifying && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div 
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              style={{
                width: '100%', maxWidth: '460px', backgroundColor: 'var(--bg-card)', 
                borderRadius: '32px', border: '1px solid var(--border-color)', 
                overflow: 'hidden', color: 'white', boxShadow: 'var(--shadow-xl)'
              }}
            >
              <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--primary), #10B981)' }} />
              
              <div style={{ padding: '40px 32px', textAlign: 'center' }}>
                {verifyStep < 4 ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
                      <Loader2 size={48} className="spin" color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 950, margin: '0 0 8px 0', color: 'var(--primary)', letterSpacing: '-0.5px' }}>Syncing Registry Nodes</h3>
                    <p style={{ margin: '0 0 32px 0', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Securing academic records and directory parameters...</p>
                    
                    {/* Steps Timeline Stack */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left', backgroundColor: 'var(--bg-body)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                      {[
                        'Validating student data models & age credentials...',
                        'Synchronizing student portal access keys...',
                        'Matching linked guardian portal permissions...',
                        'Finalizing core institutional ledger handshake...'
                      ].map((stepMsg, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem', color: verifyStep >= idx ? 'var(--primary)' : 'var(--text-muted)', transition: 'color 0.2s', fontWeight: verifyStep >= idx ? 700 : 500 }}>
                          <div style={{ 
                            width: '8px', height: '8px', borderRadius: '50%', 
                            backgroundColor: verifyStep > idx ? '#10B981' : verifyStep === idx ? 'var(--primary)' : 'var(--border-color)', 
                            boxShadow: verifyStep === idx ? '0 0 10px var(--primary)' : 'none',
                            transition: '0.3s'
                          }} />
                          <span style={{ flex: 1 }}>{stepMsg}</span>
                          {verifyStep > idx && <span style={{ color: '#10B981', fontWeight: 900, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={12} strokeWidth={3} /> Done</span>}
                          {verifyStep === idx && <span style={{ fontSize: '0.72rem', color: 'var(--primary)', animation: 'pulse 1.2s infinite' }}>Verifying...</span>}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ duration: 0.3 }}
                  >
                    <div style={{ 
                      width: '64px', height: '64px', borderRadius: '50%', 
                      backgroundColor: 'rgba(16,185,129,0.1)', color: '#10B981',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      margin: '0 auto 20px auto', border: '1px solid rgba(16,185,129,0.2)' 
                    }}>
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 950, margin: '0 0 8px 0', color: '#10B981', letterSpacing: '-0.5px' }}>Registry Synchronized</h3>
                    <p style={{ margin: '0 0 24px 0', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.5 }}>
                      Student records have been committed securely to the main institution registry node. Redirecting...
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast popup */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed', bottom: '36px', right: '36px', zIndex: 99999,
              backgroundColor: toast.type === 'success' ? '#10B981' : '#4880FF', color: 'white',
              padding: '16px 24px', borderRadius: '16px',
              display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 10px 30px -5px rgba(0,0,0,0.25)', fontWeight: 700,
              fontSize: '0.9rem'
            }}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <Info size={18} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default EditStudent;
