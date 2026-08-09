import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, GraduationCap, Mail, Phone, 
  ChevronRight, MoreVertical, Star, ShieldCheck,
  MapPin, Clock, BookOpen, UserPlus, Grid, List, Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeacherInfo = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const storedVersion = localStorage.getItem('teachers_version');
    if (storedVersion !== '2026-v6') {
      localStorage.removeItem('teachers');
      localStorage.setItem('teachers_version', '2026-v6');
    }

    const stored = localStorage.getItem('teachers');
    if (stored) {
      setTeachers(JSON.parse(stored));
    } else {
      const defaultTeachers = [
        { id: 'AD52365', teacherId: 'AD52365', name: 'Priya Malhotra', fullName: 'Priya Malhotra', subject: 'Mathematics', class: '1(A), 2(A), 3(A)', email: 'priya.m@edupro.edu', phone: '+91 98765 43200', joinDate: '2024-01-12', status: 'Active', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Priya%20Malhotra&backgroundColor=4880FF', color: '#4880FF', designation: 'Senior Mathematics Instructor', dept: 'Science & Research', rating: 4.9, contractType: 'Permanent', shift: 'Day Shift', gender: 'Female', dob: '1985-05-12', maritalStatus: 'Married', fatherName: 'Suresh Malhotra', motherName: 'Kavita Malhotra', experience: '12 Years', qualification: 'Ph.D. in Mathematics', currentAddress: 'B-12, Vasant Kunj, New Delhi, DL 110070', permanentAddress: 'B-12, Vasant Kunj, New Delhi, DL 110070', details: 'Dedicated mathematics educator with over a decade of experience in teaching theoretical and applied mathematical concepts.', bloodGroup: 'A+', height: '165', weight: '60', bankAccount: '9876543210123', bankName: 'State Bank of India', ifscCode: 'SBIN0001234', nationalId: 'AADMP1234A', prevSchoolName: 'Delhi Public School, R.K. Puram', prevSchoolAddress: 'New Delhi, DL', facebook: '', linkedin: '', exp: '12 yrs' },
        { id: 'AD52366', teacherId: 'AD52366', name: 'Rajesh Kumar', fullName: 'Rajesh Kumar', subject: 'Physics', class: '4(B), 5(A)', email: 'rajesh.k@edupro.edu', phone: '+91 98765 43201', joinDate: '2024-02-15', status: 'Active', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Rajesh%20Kumar&backgroundColor=10B981', color: '#10B981', designation: 'Physics Lecturer', dept: 'Science & Research', rating: 4.8, contractType: 'Permanent', shift: 'Day Shift', gender: 'Male', dob: '1988-08-20', maritalStatus: 'Married', fatherName: 'Ramesh Kumar', motherName: 'Sunita Kumar', experience: '8 Years', qualification: 'M.Sc. in Physics', currentAddress: 'Flat 3B, Salt Lake, Kolkata, WB 700091', permanentAddress: 'Flat 3B, Salt Lake, Kolkata, WB 700091', details: 'Enthusiastic physics teacher specializing in thermodynamics and electromagnetism experiments.', bloodGroup: 'B+', height: '178', weight: '75', bankAccount: '9876543210124', bankName: 'Punjab National Bank', ifscCode: 'PUNB0001234', nationalId: 'AADKR1234B', prevSchoolName: "St. Xavier's School, Kolkata", prevSchoolAddress: 'Kolkata, WB', facebook: '', linkedin: '', exp: '8 yrs' },
        { id: 'AD52367', teacherId: 'AD52367', name: 'Sunita Sharma', fullName: 'Sunita Sharma', subject: 'English', class: '10(A), 11(A)', email: 'sunita.s@edupro.edu', phone: '+91 98765 43202', joinDate: '2024-03-20', status: 'Inactive', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sunita%20Sharma&backgroundColor=F59E0B', color: '#F59E0B', designation: 'Head of English Dept.', dept: 'Humanities & Languages', rating: 4.7, contractType: 'Permanent', shift: 'Day Shift', gender: 'Female', dob: '1982-11-04', maritalStatus: 'Married', fatherName: 'Vinod Sharma', motherName: 'Rekha Sharma', experience: '15 Years', qualification: 'Ph.D. in English Literature', currentAddress: 'House 14, Alkapuri, Vadodara, GJ 390007', permanentAddress: 'House 14, Alkapuri, Vadodara, GJ 390007', details: 'Expert in classical literature and academic writing instruction.', bloodGroup: 'O+', height: '160', weight: '54', bankAccount: '9876543210125', bankName: 'Bank of Baroda', ifscCode: 'BARB0001234', nationalId: 'AADSS1234C', prevSchoolName: 'Kendriya Vidyalaya, Vadodara', prevSchoolAddress: 'Vadodara, GJ', facebook: '', linkedin: '', exp: '15 yrs' },
        { id: 'AD52368', teacherId: 'AD52368', name: 'Vikram Nair', fullName: 'Vikram Nair', subject: 'Chemistry', class: '9(C), 12(A)', email: 'vikram.n@edupro.edu', phone: '+91 98765 43203', joinDate: '2024-04-05', status: 'Active', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Vikram%20Nair&backgroundColor=8B5CF6', color: '#8B5CF6', designation: 'Chemistry Instructor', dept: 'Science & Research', rating: 4.6, contractType: 'Permanent', shift: 'Day Shift', gender: 'Male', dob: '1990-03-15', maritalStatus: 'Unmarried', fatherName: 'Gopalan Nair', motherName: 'Leela Nair', experience: '6 Years', qualification: 'M.Sc. in Organic Chemistry', currentAddress: '42, Jawahar Nagar, Kochi, KL 682020', permanentAddress: '42, Jawahar Nagar, Kochi, KL 682020', details: 'Passionate about chemical reactions, safety in labs, and organic science modules.', bloodGroup: 'AB+', height: '182', weight: '80', bankAccount: '9876543210126', bankName: 'Federal Bank', ifscCode: 'FDRL0001234', nationalId: 'AADVN1234D', prevSchoolName: 'Bhavans Vidya Mandir, Kochi', prevSchoolAddress: 'Kochi, KL', facebook: '', linkedin: '', exp: '6 yrs' },
        { id: 'AD52369', teacherId: 'AD52369', name: 'Anand Joshi', fullName: 'Anand Joshi', subject: 'History', class: '6(A), 7(B)', email: 'anand.j@edupro.edu', phone: '+91 98765 43204', joinDate: '2024-05-10', status: 'Active', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Anand%20Joshi&backgroundColor=EF4444', color: '#EF4444', designation: 'Associate Professor', dept: 'Humanities & Languages', rating: 4.9, contractType: 'Permanent', shift: 'Day Shift', gender: 'Male', dob: '1979-09-25', maritalStatus: 'Married', fatherName: 'Shyam Joshi', motherName: 'Usha Joshi', experience: '20 Years', qualification: 'Ph.D. in World History', currentAddress: '7, Tilak Nagar, Jaipur, RJ 302004', permanentAddress: '7, Tilak Nagar, Jaipur, RJ 302004', details: 'Specializes in Indian history, ancient civilizations, and modern political history.', bloodGroup: 'A-', height: '175', weight: '70', bankAccount: '9876543210127', bankName: 'HDFC Bank', ifscCode: 'HDFC0001234', nationalId: 'AADAJ1234E', prevSchoolName: 'Maharaja School, Jaipur', prevSchoolAddress: 'Jaipur, RJ', facebook: '', linkedin: '' },
        { id: 'AD52370', teacherId: 'AD52370', name: 'Meena Iyer', fullName: 'Meena Iyer', subject: 'Biology', class: '8(A), 9(B)', email: 'meena.i@edupro.edu', phone: '+91 98765 43205', joinDate: '2024-06-22', status: 'Inactive', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Meena%20Iyer&backgroundColor=4880FF', color: '#4880FF', designation: 'Biology Instructor', dept: 'Science & Research', rating: 4.5, contractType: 'Contractual', shift: 'Day Shift', gender: 'Female', dob: '1992-12-12', maritalStatus: 'Unmarried', fatherName: 'Krishnamurthy Iyer', motherName: 'Gayatri Iyer', experience: '4 Years', qualification: 'M.Sc. in Botany', currentAddress: '18, RA Puram, Chennai, TN 600028', permanentAddress: '18, RA Puram, Chennai, TN 600028', details: 'Enjoys teaching plant biology, environmental science, and ecological conservation.', bloodGroup: 'O-', height: '162', weight: '58', bankAccount: '9876543210128', bankName: 'Indian Bank', ifscCode: 'IDIB0001234', nationalId: 'AADMI1234F', prevSchoolName: 'DAV School, Chennai', prevSchoolAddress: 'Chennai, TN', facebook: '', linkedin: '', exp: '4 yrs' },
        { id: 'AD52371', teacherId: 'AD52371', name: 'Arun Pandey', fullName: 'Arun Pandey', subject: 'Computer Science', class: '11(B), 12(B)', email: 'arun.p@edupro.edu', phone: '+91 98765 43206', joinDate: '2024-07-15', status: 'Active', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Arun%20Pandey&backgroundColor=10B981', color: '#10B981', designation: 'IT & CS Lead Instructor', dept: 'Technology & Computing', rating: 4.9, contractType: 'Permanent', shift: 'Day Shift', gender: 'Male', dob: '1986-06-30', maritalStatus: 'Married', fatherName: 'Dinesh Pandey', motherName: 'Savita Pandey', experience: '10 Years', qualification: 'Ph.D. in Computer Science', currentAddress: '23, Koramangala, Bangalore, KA 560034', permanentAddress: '23, Koramangala, Bangalore, KA 560034', details: 'Passionate about coding, algorithms, full-stack web development, and artificial intelligence.', bloodGroup: 'B-', height: '180', weight: '77', bankAccount: '9876543210129', bankName: 'ICICI Bank', ifscCode: 'ICIC0001234', nationalId: 'AADAP1234G', prevSchoolName: 'National Public School, Bangalore', prevSchoolAddress: 'Bangalore, KA', facebook: '', linkedin: '', exp: '10 yrs' },
        { id: 'AD52372', teacherId: 'AD52372', name: 'Kavya Reddy', fullName: 'Kavya Reddy', subject: 'Geography', class: '5(B), 6(C)', email: 'kavya.r@edupro.edu', phone: '+91 98765 43207', joinDate: '2024-08-30', status: 'Active', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Kavya%20Reddy&backgroundColor=F59E0B', color: '#F59E0B', designation: 'Geography Instructor', dept: 'Humanities & Languages', rating: 4.7, contractType: 'Permanent', shift: 'Day Shift', gender: 'Female', dob: '1984-04-18', maritalStatus: 'Married', fatherName: 'Ramana Reddy', motherName: 'Padmavathi Reddy', experience: '11 Years', qualification: 'M.A. in Geography', currentAddress: '5-9, Banjara Hills, Hyderabad, TS 500034', permanentAddress: '5-9, Banjara Hills, Hyderabad, TS 500034', details: 'Engages students with geographic information systems (GIS) and Indian map reading modules.', bloodGroup: 'O+', height: '168', weight: '62', bankAccount: '9876543210130', bankName: 'Axis Bank', ifscCode: 'UTIB0001234', nationalId: 'AADKR1234H', prevSchoolName: 'Hyderabad Public School', prevSchoolAddress: 'Hyderabad, TS', facebook: '', linkedin: '' }
      ];
      localStorage.setItem('teachers', JSON.stringify(defaultTeachers));
      setTeachers(defaultTeachers);
    }
  }, []);

  const handlePhotoUpload = (e, teacherId) => {
    e.stopPropagation();
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const stored = localStorage.getItem('teachers');
        if (stored) {
          let list = JSON.parse(stored);
          list = list.map(t => {
            if (t.id === teacherId) {
              return { ...t, avatar: reader.result, img: reader.result };
            }
            return t;
          });
          localStorage.setItem('teachers', JSON.stringify(list));
          setTeachers(list);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredTeachers = teachers.filter(t => 
    (filterSubject === 'All' || t.dept === filterSubject || (filterSubject === 'IT' && t.dept === 'Technology & Computing')) &&
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ paddingBottom: '40px' }}>
      <style>{`
        .avatar-container {
          position: relative;
          display: inline-block;
          cursor: pointer;
        }
        .avatar-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 80px;
          height: 80px;
          border-radius: 16px;
          border: 4px solid white;
          box-sizing: border-box;
          background-color: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          color: white;
          z-index: 10;
        }
        .avatar-container:hover .avatar-overlay {
          opacity: 1;
        }
      `}</style>

      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
         <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px' }}>Faculty Information Hub</h1>
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Detailed visual overview of institutional teaching staff.</p>
         </div>
         <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn" onClick={() => navigate('/dashboard/teachers')} style={{ backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
               <List size={18} /> Table View
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard/add-teacher')} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
               <UserPlus size={18} /> Add New Faculty
            </button>
         </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '20px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div className="search-bar" style={{ width: '300px' }}>
               <Search size={18} className="text-muted" />
               <input 
                  type="text" 
                  placeholder="Search by name or ID..." 
                  className="search-input" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
            <select 
              className="form-input" 
              style={{ width: '180px', marginBottom: 0 }}
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
               <option value="All">All Departments</option>
               <option value="Science">Science</option>
               <option value="Math">Mathematics</option>
               <option value="Arts">Arts</option>
               <option value="IT">IT</option>
            </select>
         </div>
         <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 700 }}>
            Showing {filteredTeachers.length} results
         </div>
      </div>

      {/* Grid View */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
         {filteredTeachers.map((t, i) => (
           <motion.div 
             key={t.id}
             whileHover={{ y: -8 }}
             className="card"
             style={{ padding: '0', overflow: 'hidden', cursor: 'pointer' }}
             onClick={() => navigate(`/dashboard/teacher-details/${t.id}`)}
           >
              <div style={{ height: '80px', backgroundColor: t.color || 'var(--primary-light)', position: 'relative' }}>
                 <div style={{ position: 'absolute', right: '12px', top: '12px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 900,
                      backgroundColor: t.status === 'Active' ? '#10B98120' : '#F59E0B20',
                      color: t.status === 'Active' ? '#10B981' : '#F59E0B',
                      border: `1px solid ${t.status === 'Active' ? '#10B981' : '#F59E0B'}40`
                    }}>
                      {(t.status || 'Active').toUpperCase()}
                    </span>
                 </div>
              </div>
              <div style={{ padding: '0 24px 24px 24px', marginTop: '-40px', textAlign: 'center' }}>
                 <div className="avatar-container" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="file" 
                      id={`file-input-${t.id}`} 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={(e) => handlePhotoUpload(e, t.id)}
                    />
                    <img 
                      src={t.avatar || t.img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`} 
                      alt={t.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`;
                      }}
                      style={{ width: '80px', height: '80px', borderRadius: '16px', border: '4px solid white', boxShadow: 'var(--shadow-sm)', objectFit: 'cover' }} 
                    />
                    <div 
                      className="avatar-overlay" 
                      onClick={() => document.getElementById(`file-input-${t.id}`).click()}
                      title="Update Profile Picture"
                    >
                       <Camera size={18} color="white" />
                    </div>
                    <div style={{ position: 'absolute', bottom: '0', right: '-4px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', zIndex: 11 }}>
                       <ShieldCheck size={14} color="var(--primary)" />
                    </div>
                 </div>
                 
                 <h3 style={{ margin: '16px 0 4px 0', fontSize: '1.1rem', fontWeight: 900 }}>{t.name}</h3>
                 <p style={{ margin: '0 0 16px 0', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 800 }}>{t.subject}</p>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ padding: '10px', backgroundColor: 'var(--bg-body)', borderRadius: '12px' }}>
                       <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Experience</div>
                       <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{t.experience || t.exp || '8 yrs'}</div>
                    </div>
                    <div style={{ padding: '10px', backgroundColor: 'var(--bg-body)', borderRadius: '12px' }}>
                       <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Rating</div>
                       <div style={{ fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                          <Star size={12} fill="#F59E0B" color="#F59E0B" /> {t.rating || 4.8}
                       </div>
                    </div>
                 </div>

                 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                       <Mail size={14} /> {t.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                       <Clock size={14} /> Available: 09:00 - 15:00
                    </div>
                 </div>

                 <button className="btn" style={{ width: '100%', marginTop: '24px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 900, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    VIEW FULL PROFILE <ChevronRight size={16} />
                 </button>
              </div>
           </motion.div>
         ))}
      </div>
    </motion.div>
  );
};

export default TeacherInfo;
