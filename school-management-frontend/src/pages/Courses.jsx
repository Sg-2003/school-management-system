import React, { useState } from 'react';
import { useToast, ToastRenderer } from '../hooks/useToast';
import { 
  BookOpen, Search, Filter, Plus, Star, 
  Users, Clock, Play, FileText, ChevronRight, 
  GraduationCap, Globe, X, Check, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Courses = () => {
  const { toast, showToast, hideToast } = useToast();
  // Course States
  const [courses, setCourses] = useState([
    { id: 'CRS-001', name: 'Advanced React Architecture', instructor: 'Dr. Sunita Rao', students: 1250, rating: 4.9, image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format&fit=crop', category: 'Development', isPublic: true },
    { id: 'CRS-002', name: 'UI/UX Design Masterclass', instructor: 'Devi Joshi', students: 850, rating: 4.8, image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=400&auto=format&fit=crop', category: 'Design', isPublic: true },
    { id: 'CRS-003', name: 'Data Analysis with Python', instructor: 'Sanjay Gupta', students: 2100, rating: 4.7, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop', category: 'Data Science', isPublic: true },
    { id: 'CRS-004', name: 'Fullstack Web Development', instructor: 'Amit Bose', students: 1800, rating: 4.9, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400&auto=format&fit=crop', category: 'Development', isPublic: true },
    { id: 'CRS-005', name: 'Cyber Security Fundamentals', instructor: 'Rajinder Singh', students: 540, rating: 4.6, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=400&auto=format&fit=crop', category: 'Security', isPublic: false },
    { id: 'CRS-006', name: 'Digital Marketing Strategy', instructor: 'Priya Patel', students: 920, rating: 4.5, image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=400&auto=format&fit=crop', category: 'Marketing', isPublic: true },
    { id: 'CRS-007', name: 'Mobile App Dev (Flutter)', instructor: 'Karan Mehta', students: 760, rating: 4.8, image: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=400&auto=format&fit=crop', category: 'Development', isPublic: false },
    { id: 'CRS-008', name: 'Machine Learning Bootcamp', instructor: 'Aditi Nair', students: 1100, rating: 4.9, image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=400&auto=format&fit=crop', category: 'Data Science', isPublic: true },
    { id: 'CRS-009', name: 'Data Science with R', instructor: 'Dr. Sunita Sharma', students: 640, rating: 4.7, image: 'https://images.unsplash.com/photo-1518186239747-d08efaa57396?q=80&w=400&auto=format&fit=crop', category: 'Data Science', isPublic: false },
    { id: 'CRS-010', name: 'UI/UX Advanced Prototyping', instructor: 'Rohan Das', students: 430, rating: 4.8, image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=400&auto=format&fit=crop', category: 'Design', isPublic: false },
    { id: 'CRS-011', name: 'Ethical Hacking Masterclass', instructor: 'Ananya Iyer', students: 1500, rating: 4.9, image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop', category: 'Security', isPublic: true },
    { id: 'CRS-012', name: 'Blockchain Development', instructor: 'Suresh Yadav', students: 890, rating: 4.6, image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=400&auto=format&fit=crop', category: 'Development', isPublic: false },
  ]);

  // Filtering & UI State
  const [activeCategory, setActiveCategory] = useState('All Courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [publicOnly, setPublicOnly] = useState(false);
  const [starredIds, setStarredIds] = useState(['CRS-001', 'CRS-004']); // Initial starred items

  // Modals & Details Slider State
  const [activeCourseDetails, setActiveCourseDetails] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [isEnrolledMap, setIsEnrolledMap] = useState({});

  // Instructor Onboarding Form State
  const [instructorForm, setInstructorForm] = useState({ name: '', category: 'Development', concept: '', bio: '' });
  const [instructorSuccess, setInstructorSuccess] = useState(false);

  // Create Course Form State
  const [createForm, setCreateForm] = useState({
    name: '',
    instructor: '',
    category: 'Development',
    image: '',
    isPublic: true,
    hours: '40'
  });

  // Star Toggle
  const toggleStar = (courseId) => {
    setStarredIds(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Get Syllabus Preview mapping
  const getCourseSyllabus = (name) => {
    const defaultSyllabus = [
      'Introduction to Core Concepts & Environments',
      'Advanced Practical Design and Architecture',
      'Scalable Management Frameworks & Integration',
      'Project Optimization & Production Deployment'
    ];
    
    const customSyllabus = {
      'Advanced React Architecture': [
        'Component Architecture & Lifecycle Hooks',
        'State Management Scalability (Zustand & Redux)',
        'Server Components & Concurrent Mode Rendering',
        'Performance Auditing, Profiling & Tooling'
      ],
      'UI/UX Design Masterclass': [
        'User Research & Design Persona Formulation',
        'Visual Hierarchy, Layout Grids & Typography',
        'Prototyping & Micro-Interactions in Figma',
        'Design Systems Construction & Dev Handoff'
      ],
      'Data Analysis with Python': [
        'Python Foundations, NumPy & Pandas Arrays',
        'Data Ingestion, Sanitization & Preprocessing',
        'Exploratory Visualization (Matplotlib & Seaborn)',
        'Statistical Modeling & SciPy Integration'
      ]
    };
    return customSyllabus[name] || defaultSyllabus;
  };

  // Dynamic Filtering Logic
  const filteredCourses = courses.filter(course => {
    // 1. Category Filter (including special Starred filter)
    if (activeCategory === 'Starred') {
      if (!starredIds.includes(course.id)) return false;
    } else if (activeCategory !== 'All Courses' && course.category !== activeCategory) {
      return false;
    }

    // 2. Search Query Filter
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      course.name.toLowerCase().includes(query) || 
      course.instructor.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query);
    if (!matchesSearch) return false;

    // 3. Public Catalog Only Filter
    if (publicOnly && !course.isPublic) return false;

    return true;
  });

  // Handle Enrollment increase
  const handleEnrollNow = (courseId) => {
    if (isEnrolledMap[courseId]) return; // Already enrolled
    
    setCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        return { ...course, students: course.students + 1 };
      }
      return course;
    }));
    setIsEnrolledMap(prev => ({ ...prev, [courseId]: true }));
    
    // Auto-update active details if open
    if (activeCourseDetails && activeCourseDetails.id === courseId) {
      setActiveCourseDetails(prev => ({ ...prev, students: prev.students + 1 }));
    }
  };

  // Handle Create Course Submit
  const handleCreateCourseSubmit = (e) => {
    e.preventDefault();
    if (!createForm.name || !createForm.instructor) {
      showToast('Please fill out Course Name and Instructor fields.', 'warning', 'Missing Fields');
      return;
    }

    const nextIdNumber = courses.length + 1;
    const newCourse = {
      id: `CRS-${String(nextIdNumber).padStart(3, '0')}`,
      name: createForm.name,
      instructor: createForm.instructor,
      students: 0,
      rating: 5.0,
      image: createForm.image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400&auto=format&fit=crop',
      category: createForm.category,
      isPublic: createForm.isPublic
    };

    setCourses(prev => [newCourse, ...prev]);
    setShowCreateModal(false);
    
    // Reset Form
    setCreateForm({
      name: '',
      instructor: '',
      category: 'Development',
      image: '',
      isPublic: true,
      hours: '40'
    });
  };

  // Handle Onboarding Instructor application
  const handleInstructorSubmit = (e) => {
    e.preventDefault();
    if (!instructorForm.name || !instructorForm.concept) {
      showToast('Please fill out your Name and Course Concept.', 'warning', 'Missing Fields');
      return;
    }
    setInstructorSuccess(true);
    setTimeout(() => {
      setInstructorSuccess(false);
      setShowInstructorModal(false);
      setInstructorForm({ name: '', category: 'Development', concept: '', bio: '' });
    }, 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px', position: 'relative' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '8px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--primary-light)', borderRadius: '10px' }}>
               <BookOpen size={20} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {publicOnly ? 'Public Course Directory' : 'Institutional Curriculum'}
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 950, margin: 0, letterSpacing: '-1px' }}>Course Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px', fontWeight: 600 }}>Explore, manage, and monitor all active academic courses and training modules.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button 
              className="btn" 
              onClick={() => setPublicOnly(!publicOnly)}
              style={{ 
                backgroundColor: publicOnly ? 'var(--primary-light)' : 'var(--bg-card)', 
                border: publicOnly ? '1px solid var(--primary)' : '1px solid var(--border-color)', 
                color: publicOnly ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
           >
              <Globe size={18} /> {publicOnly ? 'SHOW ALL COURSES' : 'PUBLIC CATALOG ONLY'}
           </button>
           <button 
              className="btn btn-primary" 
              onClick={() => setShowCreateModal(true)}
              style={{ padding: '12px 28px', fontWeight: 900, boxShadow: '0 4px 12px rgba(72, 128, 255, 0.2)', cursor: 'pointer' }}
           >
              <Plus size={18} /> CREATE NEW COURSE
           </button>
        </div>
      </div>

      {/* Active Public Banner Indicator */}
      {publicOnly && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ 
            backgroundColor: 'var(--primary-light)', 
            border: '1px solid var(--primary)', 
            color: 'var(--primary)', 
            padding: '12px 24px', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginTop: '-12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Globe size={18} />
            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>
              Public Catalog Filter Active: Showing only open training modules.
            </span>
          </div>
          <button 
            onClick={() => setPublicOnly(false)} 
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 900 }}
          >
            Clear Filter
          </button>
        </motion.div>
      )}

      {/* Categories & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
         <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['All Courses', 'Development', 'Design', 'Data Science', 'Security', 'Marketing', 'Starred'].map((cat, i) => (
               <button 
                  key={i} 
                  onClick={() => setActiveCategory(cat)}
                  className="btn" 
                  style={{ 
                     backgroundColor: activeCategory === cat ? 'var(--primary)' : 'var(--bg-card)', 
                     color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                     border: activeCategory === cat ? 'none' : '1px solid var(--border-color)',
                     fontWeight: 800,
                     fontSize: '0.8rem',
                     cursor: 'pointer',
                     display: 'flex',
                     alignItems: 'center',
                     gap: '6px'
                  }}
               >
                  {cat === 'Starred' && <Star size={12} fill={activeCategory === cat ? 'white' : '#F59E0B'} color={activeCategory === cat ? 'white' : '#F59E0B'} />}
                  {cat}
                  {cat === 'Starred' && starredIds.length > 0 && (
                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '8px', backgroundColor: activeCategory === cat ? 'white' : 'var(--primary-light)', color: activeCategory === cat ? 'var(--primary)' : 'var(--primary)', marginLeft: '2px', fontWeight: 900 }}>
                      {starredIds.length}
                    </span>
                  )}
               </button>
            ))}
         </div>
         <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '13px', color: 'var(--text-muted)' }} />
            <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Search courses, instructors..." 
               style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', outline: 'none', fontWeight: 600, color: 'var(--text-main)' }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '16px', top: '13px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            )}
         </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div style={{ padding: '80px 24px', textAlign: 'center', backgroundColor: 'var(--bg-card)', border: '1px dashed var(--border-color)', borderRadius: '32px' }}>
          <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>No courses found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px', fontWeight: 600 }}>Try altering your search text or switching filter categories.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
           {filteredCourses.map((course) => {
              const isStarred = starredIds.includes(course.id);
              return (
                <motion.div 
                   key={course.id}
                   whileHover={{ y: -10 }}
                   className="card hover-card" 
                   style={{ padding: '0', borderRadius: '32px', overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-md)', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                    <div style={{ position: 'relative', height: '200px' }}>
                       <img 
                          src={course.image} 
                          alt={course.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          onError={(e) => {
                             e.target.src = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400&auto=format&fit=crop';
                          }}
                       />
                      <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900, backdropFilter: 'blur(4px)' }}>
                         {course.category}
                      </div>
                      <button 
                        onClick={() => toggleStar(course.id)}
                        style={{ position: 'absolute', top: '16px', right: '16px', width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isStarred ? '#F59E0B' : 'var(--text-muted)', cursor: 'pointer', boxShadow: 'var(--shadow-md)', transition: 'transform 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                         <Star size={18} fill={isStarred ? '#F59E0B' : 'none'} />
                      </button>
                   </div>
                   <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                         <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900 }}>
                            {course.instructor.split(' ').map(n => n[0]).join('')}
                         </div>
                         <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>{course.instructor}</span>
                         {course.isPublic && (
                           <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#e6f4ea', color: '#137333', marginLeft: 'auto', fontWeight: 800 }}>Public</span>
                         )}
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 950, marginBottom: '20px', lineHeight: 1.4, flex: 1, color: 'var(--text-main)' }}>{course.name}</h3>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: 'auto' }}>
                         <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                               <Users size={14} color="var(--primary)" /> {course.students}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                               <Star size={14} color="#F59E0B" fill="#F59E0B" /> {course.rating}
                            </div>
                         </div>
                         <button 
                            className="btn-icon" 
                            onClick={() => setActiveCourseDetails(course)}
                            style={{ backgroundColor: 'var(--bg-body)', cursor: 'pointer', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', transition: 'all 0.2s ease' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--primary)';
                              e.currentTarget.style.color = 'white';
                              e.currentTarget.style.borderColor = 'var(--primary)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--bg-body)';
                              e.currentTarget.style.color = 'var(--text-main)';
                              e.currentTarget.style.borderColor = 'var(--border-color)';
                            }}
                         >
                            <ChevronRight size={18} />
                         </button>
                      </div>
                   </div>
                </motion.div>
              );
           })}
        </div>
      )}

      {/* Featured Onboarding Card & Curriculum Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
         <div className="card" style={{ padding: '32px', borderRadius: '32px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1 }}>
               <GraduationCap size={200} />
            </div>
            <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
               <h2 style={{ fontSize: '1.8rem', fontWeight: 950, marginBottom: '12px' }}>Become an Instructor</h2>
               <p style={{ fontSize: '1rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '24px', maxWidth: '400px' }}>
                  Share your expertise with the next generation. Create your own course and start teaching today.
               </p>
               <button 
                 className="btn" 
                 onClick={() => setShowInstructorModal(true)}
                 style={{ backgroundColor: 'white', color: 'var(--primary)', border: 'none', fontWeight: 950, padding: '14px 32px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.transform = 'translateY(-2px)';
                   e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.transform = 'translateY(0)';
                   e.currentTarget.style.boxShadow = 'none';
                 }}
               >
                  GET STARTED NOW
               </button>
            </div>
         </div>

         <div className="card" style={{ padding: '32px', borderRadius: '32px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 950, marginBottom: '24px', color: 'var(--text-main)' }}>Curriculum Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               {[
                 { label: 'Total Courses', value: courses.length.toString(), icon: <BookOpen size={18} />, color: 'var(--primary)' },
                 { label: 'Active Students', value: (courses.reduce((sum, c) => sum + c.students, 0) / 1000).toFixed(1) + 'k', icon: <Users size={18} />, color: '#10B981' },
                 { label: 'Starred Favorites', value: starredIds.length.toString(), icon: <Star size={18} />, color: '#F59E0B' }
               ].map((stat, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           {stat.icon}
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{stat.label}</span>
                     </div>
                     <span style={{ fontWeight: 950, fontSize: '1.1rem', color: 'var(--text-main)' }}>{stat.value}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Slide-out Drawer Overlay for Course Details */}
      <AnimatePresence>
        {activeCourseDetails && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCourseDetails(null)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(8px)' }}
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                position: 'fixed', right: 0, top: 0, bottom: 0, width: '450px', maxWidth: '100%', 
                backgroundColor: 'var(--bg-card)', borderLeft: '1px solid var(--border-color)', 
                boxShadow: 'var(--shadow-2xl)', zIndex: 1001, display: 'flex', flexDirection: 'column', 
                overflowY: 'auto' 
              }}
            >
              {/* Header Image */}
              <div style={{ position: 'relative', height: '220px', width: '100%' }}>
                <img 
                  src={activeCourseDetails.image} 
                  alt={activeCourseDetails.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, bgGradient: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                <button 
                  onClick={() => setActiveCourseDetails(null)}
                  style={{ position: 'absolute', top: '16px', right: '16px', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
                <div style={{ position: 'absolute', bottom: '16px', left: '24px', right: '24px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'white', backgroundColor: 'var(--primary)', padding: '4px 10px', borderRadius: '8px', textTransform: 'uppercase' }}>
                    {activeCourseDetails.category}
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 950, color: 'white', margin: '8px 0 0' }}>{activeCourseDetails.name}</h2>
                </div>
              </div>

              {/* Content body */}
              <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                {/* Course KPIs */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>Students</span>
                    <h4 style={{ margin: '4px 0 0', fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)' }}>{activeCourseDetails.students}</h4>
                  </div>
                  <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }} />
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>Rating</span>
                    <h4 style={{ margin: '4px 0 0', fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Star size={14} fill="#F59E0B" color="#F59E0B" /> {activeCourseDetails.rating}
                    </h4>
                  </div>
                  <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }} />
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>ID</span>
                    <h4 style={{ margin: '4px 0 0', fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)' }}>{activeCourseDetails.id}</h4>
                  </div>
                </div>

                {/* Syllabus Modules preview */}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '16px', color: 'var(--text-main)' }}>Course Syllabus Overview</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {getCourseSyllabus(activeCourseDetails.name).map((module, index) => (
                      <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg-body)' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900, flexShrink: 0 }}>
                          {index + 1}
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.4 }}>{module}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructor */}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '12px', color: 'var(--text-main)' }}>Instructor Details</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', backgroundColor: 'var(--bg-body)' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem' }}>
                      {activeCourseDetails.instructor.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)' }}>{activeCourseDetails.instructor}</h4>
                      <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Senior Faculty Member at Curriculum Core</p>
                    </div>
                  </div>
                </div>

                {/* Action button: Enrollment */}
                <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                  <button 
                    onClick={() => handleEnrollNow(activeCourseDetails.id)}
                    disabled={isEnrolledMap[activeCourseDetails.id]}
                    style={{ 
                      width: '100%', padding: '16px', borderRadius: '16px', border: 'none', 
                      backgroundColor: isEnrolledMap[activeCourseDetails.id] ? '#e6f4ea' : 'var(--primary)', 
                      color: isEnrolledMap[activeCourseDetails.id] ? '#137333' : 'white', 
                      fontWeight: 900, cursor: isEnrolledMap[activeCourseDetails.id] ? 'default' : 'pointer', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                      fontSize: '1rem', boxShadow: isEnrolledMap[activeCourseDetails.id] ? 'none' : '0 6px 20px rgba(72, 128, 255, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isEnrolledMap[activeCourseDetails.id] ? (
                      <>
                        <Check size={18} /> ENROLLED SUCCESSFUL
                      </>
                    ) : (
                      <>
                        START LEARNING NOW <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create New Course Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {/* Modal Container */}
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  width: '500px', maxWidth: '95%', backgroundColor: 'var(--bg-card)', 
                  border: '1px solid var(--border-color)', borderRadius: '28px', 
                  boxShadow: 'var(--shadow-2xl)', display: 'flex', flexDirection: 'column', 
                  overflow: 'hidden'
                }}
              >
                {/* Header */}
                <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 950, margin: 0, color: 'var(--text-main)' }}>Create Academic Course</h2>
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleCreateCourseSubmit} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>COURSE NAME *</label>
                    <input 
                      type="text" 
                      value={createForm.name}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Advanced Cybersecurity Auditing"
                      style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>INSTRUCTOR NAME *</label>
                    <input 
                      type="text" 
                      value={createForm.instructor}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, instructor: e.target.value }))}
                      placeholder="e.g. Dr. Arthur Dent"
                      style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>CATEGORY</label>
                      <select 
                        value={createForm.category}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, category: e.target.value }))}
                        style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
                      >
                        {['Development', 'Design', 'Data Science', 'Security', 'Marketing'].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>DURATION (HOURS)</label>
                      <input 
                        type="number" 
                        value={createForm.hours}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, hours: e.target.value }))}
                        placeholder="e.g. 40"
                        style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>BANNER THUMBNAIL IMAGE URL</label>
                    <input 
                      type="text" 
                      value={createForm.image}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://images.unsplash.com/... (optional)"
                      style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0' }}>
                    <input 
                      type="checkbox" 
                      id="isPublicToggle"
                      checked={createForm.isPublic}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                    />
                    <label htmlFor="isPublicToggle" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', cursor: 'pointer' }}>
                      Publish to public catalog (visible to unregistered users)
                    </label>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                    <button 
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(72, 128, 255, 0.2)' }}
                    >
                      Create Course
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Become an Instructor Modal */}
      <AnimatePresence>
        {showInstructorModal && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInstructorModal(false)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {/* Modal Container */}
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  width: '500px', maxWidth: '95%', backgroundColor: 'var(--bg-card)', 
                  border: '1px solid var(--border-color)', borderRadius: '28px', 
                  boxShadow: 'var(--shadow-2xl)', display: 'flex', flexDirection: 'column', 
                  overflow: 'hidden'
                }}
              >
                {/* Header */}
                <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 955, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <GraduationCap size={20} color="var(--primary)" /> Become an Instructor
                  </h2>
                  <button 
                    onClick={() => setShowInstructorModal(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Body Content / Success Timeline */}
                <div style={{ padding: '32px' }}>
                  {instructorSuccess ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ textAlign: 'center', padding: '24px 0' }}
                    >
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#e6f4ea', color: '#137333', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <Check size={28} />
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>Application Received!</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.5, fontWeight: 600 }}>
                        Thank you, {instructorForm.name}! Our Academic Dean will review your proposal for "{instructorForm.concept}" and get back to you within 3 business days.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleInstructorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>FULL NAME *</label>
                        <input 
                          type="text" 
                          value={instructorForm.name}
                          onChange={(e) => setInstructorForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Arthur Dent"
                          style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                          required
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>YOUR EXPERTISE CATEGORY</label>
                        <select 
                          value={instructorForm.category}
                          onChange={(e) => setInstructorForm(prev => ({ ...prev, category: e.target.value }))}
                          style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
                        >
                          {['Development', 'Design', 'Data Science', 'Security', 'Marketing'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>COURSE CONCEPT TITLE *</label>
                        <input 
                          type="text" 
                          value={instructorForm.concept}
                          onChange={(e) => setInstructorForm(prev => ({ ...prev, concept: e.target.value }))}
                          placeholder="e.g. Practical Cryptography for Devs"
                          style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                          required
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>BRIEF BIO & EXPERIENCE (OPTIONAL)</label>
                        <textarea 
                          value={instructorForm.bio}
                          onChange={(e) => setInstructorForm(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="e.g. 8 years software engineering experience. Previously taught React at Bootcamps."
                          rows="3"
                          style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none', resize: 'none', fontFamily: 'inherit' }}
                        />
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                        <button 
                          type="button"
                          onClick={() => setShowInstructorModal(false)}
                          style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(72, 128, 255, 0.2)' }}
                        >
                          Submit Application
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ToastRenderer toast={toast} onClose={hideToast} />
    </motion.div>
  );
};

export default Courses;
