import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, UserPlus, Search, Filter, Download, Mail, Phone, 
  MoreHorizontal, GraduationCap, ArrowUpRight, CircleCheck, X
} from 'lucide-react';
import { getStudents, addStudent, deleteStudent } from '../services/service';
import Table from '../components/Table';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast, ToastRenderer } from '../hooks/useToast';
import studentAvatar from '../assets/student_avatar.png';
import indianMan1 from '../assets/indian_man_portrait_1.png';
import indianMan2 from '../assets/indian_man_portrait_2.png';
import indianWoman1 from '../assets/indian_woman_portrait_1.png';
import indianWoman2 from '../assets/indian_woman_portrait_2.png';

const Students = () => {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [students, setStudents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newStudent, setNewStudent] = useState({ student_id: '', name: '', email: '', phone: '', class_id: '' });
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let data = [];
      try {
        data = await getStudents();
      } catch (e) {
        console.warn("Backend API offline, utilizing fallback cache/mock data");
      }

      // Only seed defaults if the backend returned data OR if localStorage is empty
      const storedStudents = localStorage.getItem('students');

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
        { student_id: 'STU212', name: 'Kavita Krishnan', email: 'kavita.k@example.com', phone: '+91 98765 43220', class_id: '11', section: 'A', rollNo: '03', admission_date: '2026-11-14', gender: 'Female', status: 'Suspended', avatar: indianWoman2, dob: '2009-11-14', bloodGroup: 'A+', religion: 'Hinduism', parentName: 'Gopal Krishnan', parentOccupation: 'Doctor', parentPhone: '+91 98765 43220', parentEmail: 'gopal.k@example.com', presentAddress: 'Indiranagar, Bangalore, KA', permanentAddress: 'Indiranagar, Bangalore, KA' },
        { student_id: '1', name: 'Devendra Mishra', email: 'devendra.mishra@edupro.edu', phone: '+91 98765 43221', class_id: '10', section: 'A', rollNo: '15', admission_date: '2026-09-01', gender: 'Male', status: 'Active', avatar: indianMan2, dob: '2010-02-15', bloodGroup: 'B+', religion: 'Hinduism', parentName: 'Kailash Mishra', parentOccupation: 'Business', parentPhone: '+91 98765 43221', parentEmail: 'kailash.m@example.com', presentAddress: 'Gomti Nagar, Lucknow, UP', permanentAddress: 'Gomti Nagar, Lucknow, UP' },
        { student_id: 'STU213', name: 'Abhishek Singh', email: 'abhishek.singh@example.com', phone: '+91 98765 43222', class_id: '10', section: 'B', rollNo: '22', admission_date: '2026-09-01', gender: 'Male', status: 'Suspended', avatar: indianMan1, dob: '2010-02-15', bloodGroup: 'B+', religion: 'Hinduism', parentName: 'Vijay Singh', parentOccupation: 'Teacher', parentPhone: '+91 98765 43222', parentEmail: 'vijay.s@example.com', presentAddress: 'Civil Lines, Jaipur, RJ', permanentAddress: 'Civil Lines, Jaipur, RJ' },
        { student_id: 'STU214', name: 'Meera Patel', email: 'meera.patel@example.com', phone: '+91 98765 43223', class_id: '12', section: 'C', rollNo: '05', admission_date: '2026-10-12', gender: 'Female', status: 'Suspended', avatar: indianWoman1, dob: '2009-07-20', bloodGroup: 'AB+', religion: 'Hinduism', parentName: 'Dinesh Patel', parentOccupation: 'Engineer', parentPhone: '+91 98765 43223', parentEmail: 'dinesh.p@example.com', presentAddress: 'Satellite, Ahmedabad, GJ', permanentAddress: 'Satellite, Ahmedabad, GJ' },
        { student_id: 'STU215', name: 'Nisha Patel', email: 'nisha.patel@example.com', phone: '+91 98765 43224', class_id: '9', section: 'A', rollNo: '10', admission_date: '2026-08-20', gender: 'Female', status: 'Suspended', avatar: indianWoman2, dob: '2009-12-05', bloodGroup: 'O-', religion: 'Hinduism', parentName: 'Pravin Patel', parentOccupation: 'Nurse', parentPhone: '+91 98765 43224', parentEmail: 'pravin.p@example.com', presentAddress: 'Vastrapur, Ahmedabad, GJ', permanentAddress: 'Vastrapur, Ahmedabad, GJ' },
        { student_id: 'STU216', name: 'Sameer Khan', email: 'sameer.khan@example.com', phone: '+91 98765 43225', class_id: '10', section: 'C', rollNo: '07', admission_date: '2026-09-15', gender: 'Male', status: 'Suspended', avatar: indianMan2, dob: '2008-11-22', bloodGroup: 'B-', religion: 'Islam', parentName: 'Salim Khan', parentOccupation: 'Business Owner', parentPhone: '+91 98765 43225', parentEmail: 'salim.k@example.com', presentAddress: 'Bandra, Mumbai, MH', permanentAddress: 'Bandra, Mumbai, MH' }
      ];

      // CRITICAL: use API data if available; otherwise use existing localStorage; only fall back to defaults if nothing stored
      let listToUse;
      if (data && data.length > 0) {
        listToUse = data;
      } else if (storedStudents) {
        listToUse = JSON.parse(storedStudents);
      } else {
        listToUse = defaultList;
      }

      const parsed = listToUse.map(s => {
        if (s.student_id === 'STU101' || s.name === 'Aman Verma') {
          return { ...s, avatar: indianMan1 };
        }
        if (s.student_id === 'STU213' || s.name === 'Abhishek Singh') {
          return { ...s, avatar: indianMan1 };
        }
        if (s.student_id === '1' || s.name === 'Devendra Mishra') {
          return { ...s, avatar: indianMan2 };
        }
        if (s.student_id === 'STU-2026-001') {
          return { ...s, avatar: indianMan1 };
        }
        return s;
      });
      setStudents(parsed);
      localStorage.setItem('students', JSON.stringify(parsed));
    } catch (err) { 
      console.error(err);
    } finally { 
      setLoading(false); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      try {
        await addStudent(newStudent);
      } catch (apiErr) {
        console.warn("Backend API offline, bypassing direct node sync");
      }
      
      const studentObj = {
        student_id: newStudent.student_id,
        name: newStudent.name,
        email: newStudent.email,
        phone: newStudent.phone,
        class_id: newStudent.class_id,
        section: 'A',
        rollNo: '15',
        admission_date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        gender: 'Male',
        status: 'Active',
        avatar: '',
        dob: '2010-05-15',
        bloodGroup: 'O+',
        religion: 'Hinduism',
        parentName: 'Parent Contact',
        parentOccupation: 'Engineer',
        parentPhone: newStudent.phone,
        parentEmail: newStudent.email,
        presentAddress: 'Sector 12, Dwarka, New Delhi',
        permanentAddress: 'Sector 12, Dwarka, New Delhi'
      };

      const stored = localStorage.getItem('students');
      let list = stored ? JSON.parse(stored) : [];
      list.push(studentObj);
      localStorage.setItem('students', JSON.stringify(list));

      setShowAddModal(false);
      fetchData();
      setNewStudent({ student_id: '', name: '', email: '', phone: '', class_id: '' });
    } catch (err) { 
      console.error(err);
      showToast('Failed to add student. Please try again.', 'error', 'Error');
    }
  };

  const columns = [
    { 
      header: 'Student', 
      key: 'name',
      render: (row) => (
        <div 
          onClick={() => navigate(`/dashboard/student-details/${row.student_id}`)}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          className="hover-primary"
        >
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '12px', 
            backgroundColor: row.gender?.toLowerCase() === 'female' ? 'var(--success-light)' : 'var(--primary-light)', 
            color: row.gender?.toLowerCase() === 'female' ? 'var(--success)' : 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontWeight: 800, fontSize: '0.9rem', overflow: 'hidden'
          }}>
            {row.avatar ? (
              <img 
                src={row.avatar} 
                alt={row.name} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.name}`;
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : row.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{row.student_id}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Contact Info', 
      key: 'email',
      render: (row) => (
        <div style={{ fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}><Mail size={12} /> {row.email}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginTop: '4px' }}><Phone size={12} /> {row.phone}</div>
        </div>
      )
    },
    { 
      header: 'Class', 
      key: 'class_id',
      render: (row) => (
        <span style={{ 
          padding: '6px 12px', backgroundColor: 'var(--bg-body)', 
          borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)' 
        }}>
          Class {row.class_id}
        </span>
      )
    },
    { 
      header: 'Admission Date', 
      key: 'admission_date',
      render: (row) => (
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {row.admission_date || 'May 07, 2026'}
        </span>
      )
    },
    { 
      header: 'Status', 
      key: 'status',
      render: (row) => {
        const isRed = row.status === 'Inactive' || row.status === 'Suspended';
        return (
          <span style={{ 
            padding: '4px 10px', 
            backgroundColor: isRed ? 'rgba(220, 53, 69, 0.1)' : 'rgba(40, 167, 69, 0.1)', 
            color: isRed ? 'var(--danger)' : 'var(--success)', 
            borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 
          }}>
            {row.status || 'Active'}
          </span>
        );
      }
    }
  ];

  const [activeFilter, setActiveFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.student_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || 
                         s.status === activeFilter || 
                         `Class ${s.class_id}` === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const [selectedQuickView, setSelectedQuickView] = useState(null);

  const exportToCSV = () => {
    const headers = ['Student ID', 'Name', 'Email', 'Phone', 'Class', 'Admission Date', 'Gender', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(s => [
        s.student_id,
        `"${s.name}"`,
        s.email,
        s.phone,
        s.class_id,
        s.admission_date || 'N/A',
        s.gender,
        s.status || 'Active'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `students_list_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      style={{ paddingBottom: '40px', position: 'relative' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>Student Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Directory of all enrolled students and their academic records.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn" 
            onClick={exportToCSV}
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={18} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard/add-student')}>
            <UserPlus size={18} /> Enroll Student
          </button>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '16px', opacity: 0.1 }}>
            <Users size={80} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={22} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Enrollment</span>
            </div>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>{students.length}</h2>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6' }}>♂ {students.filter(s => s.gender === 'Male').length} Boys</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ec4899' }}>♀ {students.filter(s => s.gender === 'Female').length} Girls</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '16px', opacity: 0.1 }}>
            <GraduationCap size={80} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircleCheck size={22} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Attendance</span>
            </div>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>98.2%</h2>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>↑ 2.4% from last month</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '16px', opacity: 0.1 }}>
            <ArrowUpRight size={80} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserPlus size={22} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>New Admissions</span>
            </div>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>12</h2>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Registered this semester</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px', marginBottom: '24px', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by name, ID, or email..." 
              style={{ paddingLeft: '48px' }} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <button 
              className="btn" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{ 
                backgroundColor: activeFilter !== 'All' ? 'var(--primary-light)' : 'var(--bg-body)', 
                border: '1px solid var(--border-color)',
                color: activeFilter !== 'All' ? 'var(--primary)' : 'inherit',
                display: 'flex', alignItems: 'center', gap: '8px',
                fontWeight: 700
              }}
            >
              <Filter size={18} /> {activeFilter === 'All' ? 'Filter' : activeFilter}
            </button>
            
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{ 
                    position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                    backgroundColor: 'var(--bg-card)', borderRadius: '12px', 
                    boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)',
                    padding: '8px', zIndex: 100, width: '200px'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', padding: '8px', textTransform: 'uppercase' }}>Status</div>
                  {['All', 'Active', 'Inactive'].map(f => (
                    <div 
                      key={f}
                      onClick={() => { setActiveFilter(f); setIsFilterOpen(false); }}
                      style={{ 
                        padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                        backgroundColor: activeFilter === f ? 'var(--primary-light)' : 'transparent',
                        color: activeFilter === f ? 'var(--primary)' : 'var(--text-main)'
                      }}
                    >
                      {f}
                    </div>
                  ))}
                  <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 0' }} />
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', padding: '8px', textTransform: 'uppercase' }}>Class</div>
                  {['Class 09', 'Class 10', 'Class 11', 'Class 12'].map(f => (
                    <div 
                      key={f}
                      onClick={() => { setActiveFilter(f); setIsFilterOpen(false); }}
                      style={{ 
                        padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                        backgroundColor: activeFilter === f ? 'var(--primary-light)' : 'transparent',
                        color: activeFilter === f ? 'var(--primary)' : 'var(--text-main)'
                      }}
                    >
                      {f}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Table 
        columns={columns} 
        data={filteredStudents} 
        loading={loading}
        onView={(row) => setSelectedQuickView(row)}
        onEdit={(row) => navigate(`/dashboard/edit-student/${row.student_id}`)}
        onDelete={(row) => setStudentToDelete(row)}
      />

      {/* Quick View Side Panel */}
      <AnimatePresence>
        {selectedQuickView && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedQuickView(null)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', zIndex: 1000 }}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', 
                backgroundColor: 'var(--bg-card)', zIndex: 1001, boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                display: 'flex', flexDirection: 'column', padding: '32px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h3 style={{ margin: 0 }}>Student Preview</h3>
                <button onClick={() => setSelectedQuickView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ 
                  width: '100px', height: '100px', borderRadius: '30px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900, marginBottom: '16px',
                  overflow: 'hidden'
                }}>
                  {selectedQuickView.avatar ? (
                    <img 
                      src={selectedQuickView.avatar} 
                      alt={selectedQuickView.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedQuickView.name}`;
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    selectedQuickView.name.charAt(0)
                  )}
                </div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>{selectedQuickView.name}</h2>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontWeight: 600 }}>ID: #{selectedQuickView.student_id}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Class</div>
                  <div style={{ fontWeight: 800, color: 'var(--primary)' }}>Class {selectedQuickView.class_id}</div>
                </div>
                <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Gender</div>
                  <div style={{ fontWeight: 800 }}>{selectedQuickView.gender}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Contact Details</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                      <div style={{ color: 'var(--primary)' }}><Mail size={16} /></div>
                      <span style={{ fontWeight: 600 }}>{selectedQuickView.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                      <div style={{ color: 'var(--primary)' }}><Phone size={16} /></div>
                      <span style={{ fontWeight: 600 }}>{selectedQuickView.phone}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
                  <button 
                    onClick={() => navigate(`/dashboard/student-details/${selectedQuickView.student_id}`)}
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '14px', borderRadius: '14px', fontWeight: 800 }}
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Enroll Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card" 
            style={{ width: '90%', maxWidth: '500px', padding: '32px' }}
          >
            <h2 style={{ marginBottom: '8px', fontWeight: 900 }}>Enroll New Student</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.9rem' }}>Fill in the details to add a new student to the institution.</p>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>STUDENT ID</label>
                  <input type="text" className="form-input" placeholder="STU101" required value={newStudent.student_id} onChange={(e) => setNewStudent({...newStudent, student_id: e.target.value})} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>FULL NAME</label>
                  <input type="text" className="form-input" placeholder="John Doe" required value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>EMAIL ADDRESS</label>
                <input type="email" className="form-input" placeholder="john@school.edu" required value={newStudent.email} onChange={(e) => setNewStudent({...newStudent, email: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>PHONE NUMBER</label>
                  <input type="tel" className="form-input" placeholder="+1 234 567" required value={newStudent.phone} onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>CLASS ASSIGNMENT</label>
                  <input type="number" className="form-input" placeholder="10" required value={newStudent.class_id} onChange={(e) => setNewStudent({...newStudent, class_id: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="button" className="btn" style={{ flex: 1, backgroundColor: 'var(--bg-body)' }} onClick={() => setShowAddModal(false)}>Discard</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Confirm Enrollment</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {studentToDelete && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card" 
              style={{ width: '90%', maxWidth: '450px', padding: '32px', border: '1px solid rgba(220, 53, 69, 0.2)' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ 
                  width: '60px', height: '60px', borderRadius: '20px', 
                  backgroundColor: 'rgba(220, 53, 69, 0.1)', color: 'var(--danger)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  margin: '0 auto 16px auto' 
                }}>
                  <X size={32} />
                </div>
                <h2 style={{ margin: '0 0 8px 0', fontWeight: 900, fontSize: '1.4rem' }}>Delete Student</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                  Are you sure you want to delete <strong style={{ color: 'var(--text-main)' }}>{studentToDelete.name}</strong>? All of their academic records, attendance, and fee history will be permanently erased. This action cannot be undone.
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <button 
                  type="button" 
                  className="btn" 
                  style={{ flex: 1, backgroundColor: 'var(--bg-body)' }} 
                  onClick={() => setStudentToDelete(null)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn" 
                  style={{ flex: 1, backgroundColor: 'var(--danger)', color: '#fff' }} 
                  onClick={async () => {
                    try {
                      try {
                        await deleteStudent(studentToDelete.student_id);
                      } catch (apiErr) {
                        console.warn("Backend API offline, bypassing direct node deletion");
                      }
                      
                      const stored = localStorage.getItem('students');
                      if (stored) {
                        const list = JSON.parse(stored);
                        const filtered = list.filter(s => s.student_id !== studentToDelete.student_id);
                        localStorage.setItem('students', JSON.stringify(filtered));
                      }
                      setStudentToDelete(null);
                      fetchData();
                    } catch (err) {
                      console.error(err);
                      setStudentToDelete(null);
                    }
                  }}
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
      <ToastRenderer toast={toast} onClose={hideToast} />
    </>
  );
};

export default Students;

