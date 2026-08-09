import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, Search, Filter, MoreVertical, 
  Building, Bed, Calendar, CheckCircle, ShieldAlert,
  ArrowRight, X, UserCheck, LayoutGrid, List as ListIcon,
  SlidersHorizontal, ChevronDown, Check
} from 'lucide-react';
import { 
  RoomAppearanceModal, getRoomAppearance, applyRoomAppearanceStyles 
} from '../components/RoomAppearanceModal';
import { HostelApi } from '../services/service';
import indianMan1 from '../assets/indian_man_portrait_1.png';
import indianMan2 from '../assets/indian_man_portrait_2.png';
import indianWoman1 from '../assets/indian_woman_portrait_1.png';
import indianWoman2 from '../assets/indian_woman_portrait_2.png';

const ALLOTMENT_AVATARS = {
  'Aman Verma': indianMan1,
  'Neha Sharma': indianWoman2,
  'Rohan Das': indianMan2,
  'Divya Joshi': indianWoman1,
  'Rajesh Kumar': indianMan1,
  'Default': indianMan2
};

const DEFAULT_STUDENTS = [
  { student_id: 'STU101', name: 'Aman Verma', gender: 'Male', class_id: '10', section: 'A', avatar: indianMan1 },
  { student_id: 'STU102', name: 'Divya Joshi', gender: 'Female', class_id: '11', section: 'A', avatar: indianWoman1 },
  { student_id: 'STU103', name: 'Rohan Das', gender: 'Male', class_id: '10', section: 'A', avatar: indianMan2 },
  { student_id: 'STU104', name: 'Karan Mehta', gender: 'Male', class_id: '12', section: 'B', avatar: indianMan1 },
  { student_id: 'STU105', name: 'Isha Sen', gender: 'Female', class_id: '10', section: 'A', avatar: indianWoman2 },
  { student_id: 'STU106', name: 'Aditi Nair', gender: 'Female', class_id: '09', section: 'C', avatar: indianWoman1 },
  { student_id: 'STU107', name: 'Rahul Kapoor', gender: 'Male', class_id: '11', section: 'B', avatar: indianMan2 },
  { student_id: 'STU108', name: 'Neha Sharma', gender: 'Female', class_id: '12', section: 'A', avatar: indianWoman2 },
  { student_id: 'STU109', name: 'Riya Banerjee', gender: 'Female', class_id: '10', section: 'D', avatar: indianWoman1 },
  { student_id: 'STU110', name: 'Arjun Reddy', gender: 'Male', class_id: '11', section: 'A', avatar: indianMan1 },
  { student_id: 'STU212', name: 'Kavita Krishnan', gender: 'Female', class_id: '11', section: 'A', avatar: indianWoman2 },
  { student_id: 'STU213', name: 'Abhishek Singh', gender: 'Male', class_id: '10', section: 'B', avatar: indianMan1 },
  { student_id: 'STU214', name: 'Meera Patel', gender: 'Female', class_id: '12', section: 'C', avatar: indianWoman1 },
  { student_id: 'STU215', name: 'Nisha Patel', gender: 'Female', class_id: '09', section: 'A', avatar: indianWoman2 },
  { student_id: 'STU216', name: 'Sameer Khan', gender: 'Male', class_id: '10', section: 'C', avatar: indianMan2 }
];

const RAW_MOCK_STUDENTS_POOL = [
  { name: 'Aarav Gupta', id: 'ADM-2026-001', class: '10-A', avatar: '', gender: 'Male' },
  { name: 'Aaradhya Sen', id: 'ADM-2026-002', class: '10-B', avatar: '', gender: 'Female' },
  { name: 'Kabir Nair', id: 'ADM-2026-003', class: '11-A', avatar: '', gender: 'Male' },
  { name: 'Ananya Rao', id: 'ADM-2026-004', class: '12-C', avatar: '', gender: 'Female' },
  { name: 'Vihaan Joshi', id: 'ADM-2026-005', class: '9-B', avatar: '', gender: 'Male' },
  { name: 'Diya Mehta', id: 'ADM-2026-006', class: '10-C', avatar: '', gender: 'Female' },
  { name: 'Advik Reddy', id: 'ADM-2026-007', class: '11-B', avatar: '', gender: 'Male' },
  { name: 'Ishaanvi Bose', id: 'ADM-2026-008', class: '12-A', avatar: '', gender: 'Female' },
  { name: 'Reyansh Patel', id: 'ADM-2026-009', class: '9-A', avatar: '', gender: 'Male' },
  { name: 'Myra Iyer', id: 'ADM-2026-010', class: '10-A', avatar: '', gender: 'Female' },
  { name: 'Atharv Singh', id: 'ADM-2026-011', class: '11-C', avatar: '', gender: 'Male' },
  { name: 'Aadya Sharma', id: 'ADM-2026-012', class: '12-B', avatar: '', gender: 'Female' },
  { name: 'Shaurya Verma', id: 'ADM-2026-013', class: '10-B', avatar: '', gender: 'Male' },
  { name: 'Avani Krishnan', id: 'ADM-2026-014', class: '11-A', avatar: '', gender: 'Female' },
  { name: 'Ishaan Kapoor', id: 'ADM-2026-015', class: '12-A', avatar: '', gender: 'Male' },
  { name: 'Saisha Mukherjee', id: 'ADM-2026-016', class: '9-B', avatar: '', gender: 'Female' },
  { name: 'Rudra Dubey', id: 'ADM-2026-017', class: '10-C', avatar: '', gender: 'Male' },
  { name: 'Prisha Choudhury', id: 'ADM-2026-018', class: '11-C', avatar: '', gender: 'Female' },
  { name: 'Kian Saxena', id: 'ADM-2026-019', class: '12-C', avatar: '', gender: 'Male' },
  { name: 'Riya Chatterjee', id: 'ADM-2026-020', class: '10-A', avatar: '', gender: 'Female' },
  { name: 'Aravind Menon', id: 'ADM-2026-021', class: '11-B', avatar: '', gender: 'Male' },
  { name: 'Sneha Deshmukh', id: 'ADM-2026-022', class: '12-B', avatar: '', gender: 'Female' },
  { name: 'Devendra Mishra', id: 'ADM-2026-023', class: '9-C', avatar: '', gender: 'Male' },
  { name: 'Tanvi Bhatia', id: 'ADM-2026-024', class: '10-B', avatar: '', gender: 'Female' },
  { name: 'Ranveer Gill', id: 'ADM-2026-025', class: '11-A', avatar: '', gender: 'Male' },
  { name: 'Divya Khanna', id: 'ADM-2026-026', class: '12-A', avatar: '', gender: 'Female' },
  { name: 'Arjun Ranawat', id: 'ADM-2026-027', class: '10-C', avatar: '', gender: 'Male' },
  { name: 'Meera Roy', id: 'ADM-2026-028', class: '11-C', avatar: '', gender: 'Female' },
  { name: 'Yashwardhan Rathore', id: 'ADM-2026-029', class: '12-C', avatar: '', gender: 'Male' },
  { name: 'Shruti Pillai', id: 'ADM-2026-030', class: '9-A', avatar: '', gender: 'Female' },
  { name: 'Aditya Gokhale', id: 'ADM-2026-031', class: '10-A', avatar: '', gender: 'Male' },
  { name: 'Kavya Hegde', id: 'ADM-2026-032', class: '11-B', avatar: '', gender: 'Female' },
  { name: 'Vivek Trivedi', id: 'ADM-2026-033', class: '12-B', avatar: '', gender: 'Male' },
  { name: 'Neela Saxena', id: 'ADM-2026-034', class: '10-B', avatar: '', gender: 'Female' },
  { name: 'Harish Rawat', id: 'ADM-2026-035', class: '11-A', avatar: '', gender: 'Male' },
  { name: 'Bhavna Chauhan', id: 'ADM-2026-036', class: '12-A', avatar: '', gender: 'Female' },
  { name: 'Chirag Shetty', id: 'ADM-2026-037', class: '9-B', avatar: '', gender: 'Male' },
  { name: 'Kiara Malhotra', id: 'ADM-2026-038', class: '10-C', avatar: '', gender: 'Female' },
  { name: 'Chetan Pandey', id: 'ADM-2026-039', class: '11-C', avatar: '', gender: 'Male' },
  { name: 'Jyoti Kulkarni', id: 'ADM-2026-040', class: '12-C', avatar: '', gender: 'Female' },
  { name: 'Gautam Varma', id: 'ADM-2026-041', class: '10-A', avatar: '', gender: 'Male' },
  { name: 'Janvi Ahluwalia', id: 'ADM-2026-042', class: '11-B', avatar: '', gender: 'Female' },
  { name: 'Siddharth Nambiar', id: 'ADM-2026-043', class: '12-B', avatar: '', gender: 'Male' },
  { name: 'Esha Deol', id: 'ADM-2026-044', class: '9-C', avatar: '', gender: 'Female' },
  { name: 'Lakshya Mahajan', id: 'ADM-2026-045', class: '10-B', avatar: '', gender: 'Male' },
  { name: 'Geeta Johri', id: 'ADM-2026-046', class: '11-A', avatar: '', gender: 'Female' },
  { name: 'Jatin Sodhi', id: 'ADM-2026-047', class: '12-A', avatar: '', gender: 'Male' },
  { name: 'Gauri Sen', id: 'ADM-2026-048', class: '10-C', avatar: '', gender: 'Female' },
  { name: 'Jaspreet Singh', id: 'ADM-2026-049', class: '11-C', avatar: '', gender: 'Male' },
  { name: 'Shikha Agrawal', id: 'ADM-2026-050', class: '12-C', avatar: '', gender: 'Female' }
];

const MOCK_STUDENTS_POOL = RAW_MOCK_STUDENTS_POOL.map(s => {
  const isMale = s.gender === 'Male';
  const nameCode = (s.name || '').charCodeAt(0) || 0;
  let avatarAsset = isMale ? indianMan1 : indianWoman1;
  if (isMale) {
    avatarAsset = nameCode % 2 === 0 ? indianMan1 : indianMan2;
  } else {
    avatarAsset = nameCode % 2 === 0 ? indianWoman1 : indianWoman2;
  }
  return { ...s, avatar: avatarAsset };
});

const SEED_ROOMS = [
  { id: 1, room_no: '101', floor: '1st', type: 'Premium', capacity: 2, occupied: 2, status: 'Full', amenities: ['AC', 'Attached Bath'] },
  { id: 2, room_no: '102', floor: '1st', type: 'Standard', capacity: 4, occupied: 3, status: 'Available', amenities: ['Fan', 'Shared Bath'] },
  { id: 3, room_no: '103', floor: '1st', type: 'Standard', capacity: 4, occupied: 4, status: 'Full', amenities: ['Fan', 'Shared Bath'] },
  { id: 4, room_no: '201', floor: '2nd', type: 'Premium', capacity: 2, occupied: 1, status: 'Available', amenities: ['AC', 'Attached Bath'] },
  { id: 5, room_no: '202', floor: '2nd', type: 'Economy', capacity: 6, occupied: 5, status: 'Available', amenities: ['Fan', 'Shared Bath'] },
  { id: 6, room_no: '203', floor: '2nd', type: 'Standard', capacity: 4, occupied: 0, status: 'Empty', amenities: ['Fan', 'Shared Bath'] },
  { id: 7, room_no: '301', floor: '3rd', type: 'Premium', capacity: 2, occupied: 2, status: 'Full', amenities: ['AC', 'Attached Bath', 'Balcony'] },
  { id: 8, room_no: '302', floor: '3rd', type: 'Standard', capacity: 4, occupied: 2, status: 'Available', amenities: ['Fan', 'Shared Bath'] },
  { id: 9, room_no: '303', floor: '3rd', type: 'Economy', capacity: 8, occupied: 7, status: 'Available', amenities: ['Fan', 'Large Locker'] },
  { id: 10, room_no: '401', floor: '4th', type: 'Premium', capacity: 1, occupied: 0, status: 'Empty', amenities: ['AC', 'Single Bed', 'TV'] },
  { id: 11, room_no: '402', floor: '4th', type: 'Standard', capacity: 4, occupied: 1, status: 'Available', amenities: ['Fan', 'Shared Bath'] },
  { id: 12, room_no: '403', floor: '4th', type: 'Economy', capacity: 4, occupied: 4, status: 'Full', amenities: ['Fan', 'Shared Bath'] },
];

const populateRoomsWithUniqueStudents = (roomsList) => {
  let poolIdx = 0;
  return roomsList.map(room => {
    const occupants = [];
    const count = room.occupied || 0;
    for (let i = 0; i < count; i++) {
      if (poolIdx < MOCK_STUDENTS_POOL.length) {
        occupants.push(MOCK_STUDENTS_POOL[poolIdx]);
        poolIdx++;
      } else {
        const randId = Math.floor(100 + Math.random() * 900);
        occupants.push({
          name: `Student #${randId}`,
          id: `ADM-2026-${randId}`,
          class: '10-A',
          avatar: indianMan2,
          gender: 'Male'
        });
      }
    }
    return {
      ...room,
      occupants
    };
  });
};

const HostelAllotment = () => {
  const defaultAllotments = [
    { id: 1, studentName: 'Aman Verma', admissionId: 'ADM-2026-001', hostel: 'Elite Boys Block A', roomNo: '101', type: 'Premium', allotDate: '2026-01-15', status: 'Active', color: '#4f46e5' },
    { id: 2, studentName: 'Neha Sharma', admissionId: 'ADM-2026-045', hostel: 'Elite Girls Block B', roomNo: '205', type: 'Standard', allotDate: '2026-01-18', status: 'Active', color: '#ec4899' },
    { id: 3, studentName: 'Rohan Das', admissionId: 'ADM-2026-089', hostel: 'Elite Boys Block A', roomNo: '302', type: 'Economy', allotDate: '2026-02-05', status: 'Active', color: '#4f46e5' },
    { id: 4, studentName: 'Divya Joshi', admissionId: 'ADM-2026-122', hostel: 'Elite Girls Block B', roomNo: '102', type: 'Premium', allotDate: '2026-02-10', status: 'Active', color: '#ec4899' },
    { id: 5, studentName: 'Rajesh Kumar', admissionId: 'ADM-2026-156', hostel: 'Staff Residency', roomNo: 'S-10', type: 'Premium', allotDate: '2026-02-15', status: 'Pending', color: '#10b981' }
  ];

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENTS;
  });

  const [rooms, setRooms] = useState(() => {
    const storedVersion = localStorage.getItem('hostel_rooms_version');
    if (storedVersion !== '2026-rooms-v9') {
      localStorage.removeItem('hostel_rooms');
      localStorage.setItem('hostel_rooms_version', '2026-rooms-v9');
    }

    const saved = localStorage.getItem('hostel_rooms');
    if (saved) return JSON.parse(saved);
    const seeded = populateRoomsWithUniqueStudents(SEED_ROOMS);
    localStorage.setItem('hostel_rooms', JSON.stringify(seeded));
    return seeded;
  });

  const [allotments, setAllotments] = useState(() => {
    const storedAllotmentsVersion = localStorage.getItem('hostel_allotments_version');
    if (storedAllotmentsVersion !== '2026-allotments-v9') {
      localStorage.removeItem('hostel_allotments');
      localStorage.setItem('hostel_allotments_version', '2026-allotments-v9');
    }

    const savedAllotments = localStorage.getItem('hostel_allotments');
    const loadedAllotments = savedAllotments ? JSON.parse(savedAllotments) : [];
    
    // Read the current rooms from localStorage
    const savedRooms = localStorage.getItem('hostel_rooms');
    let currentRooms = [];
    if (savedRooms) {
      currentRooms = JSON.parse(savedRooms);
    } else {
      currentRooms = populateRoomsWithUniqueStudents(SEED_ROOMS);
      localStorage.setItem('hostel_rooms', JSON.stringify(currentRooms));
    }

    // Dynamic Synchronization on Load
    const derivedAllotments = [];
    let nextId = loadedAllotments.length > 0 ? Math.max(...loadedAllotments.map(a => a.id)) + 1 : 1;
    
    currentRooms.forEach(room => {
      if (room.occupants) {
        room.occupants.forEach(occ => {
          const existing = loadedAllotments.find(a => a.admissionId === occ.id && a.roomNo === room.room_no);
          const isFemale = occ.gender === 'Female' || ['Aaradhya Sen', 'Ananya Rao', 'Diya Mehta', 'Ishaanvi Bose', 'Aadya Sharma', 'Avani Krishnan', 'Saisha Mukherjee', 'Prisha Choudhury', 'Riya Chatterjee', 'Sneha Deshmukh', 'Tanvi Bhatia', 'Divya Khanna', 'Meera Roy', 'Shruti Pillai', 'Kavya Hegde', 'Neela Saxena', 'Bhavna Chauhan', 'Kiara Malhotra', 'Jyoti Kulkarni', 'Janvi Ahluwalia', 'Esha Deol', 'Geeta Johri', 'Gauri Sen', 'Shikha Agrawal', 'Divya Joshi', 'Isha Sen', 'Aditi Nair', 'Neha Sharma', 'Riya Banerjee', 'Kavita Krishnan', 'Meera Patel', 'Nisha Patel'].includes(occ.name);
          
          derivedAllotments.push({
            id: existing ? existing.id : nextId++,
            studentName: occ.name,
            admissionId: occ.id,
            hostel: existing ? existing.hostel : (room.room_no.startsWith('S-') ? 'Staff Residency' : (isFemale ? 'Elite Girls Block B' : 'Elite Boys Block A')),
            roomNo: room.room_no,
            type: room.type,
            allotDate: occ.allotDate || existing?.allotDate || '2026-01-15',
            status: occ.status || existing?.status || 'Active',
            color: existing ? existing.color : (room.room_no.startsWith('S-') ? '#10b981' : (isFemale ? '#ec4899' : '#4f46e5')),
            avatar: occ.avatar || existing?.avatar
          });
        });
      }
    });

    localStorage.setItem('hostel_allotments', JSON.stringify(derivedAllotments));
    return derivedAllotments;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showAllotModal, setShowAllotModal] = useState(false);
  const [editingAllotment, setEditingAllotment] = useState(null);
  const [newAllotment, setNewAllotment] = useState({
    student: '', admissionId: '', hostel: 'Elite Boys Block A', room: '', type: 'Standard', date: new Date().toISOString().split('T')[0]
  });

  const [studentSearch, setStudentSearch] = useState('');
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  
  const [roomSearch, setRoomSearch] = useState('');
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);

  const [blockFilter, setBlockFilter] = useState('All');
  const [showBlockDropdown, setShowBlockDropdown] = useState(false);

  // Quick Action Sheet and Confirm Delete states
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Toast Notification state
  const [toast, setToast] = useState(null);
  
  // Appearance Overrides State
  const [appearance, setAppearance] = useState(getRoomAppearance);
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  const [systemDark, setSystemDark] = useState(localStorage.getItem('theme') === 'dark');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // State synchronization helper that rebuilds room occupants in real-time
  const syncAllotmentsAndRooms = (updatedAllotments, currentRooms = rooms) => {
    setAllotments(updatedAllotments);
    localStorage.setItem('hostel_allotments', JSON.stringify(updatedAllotments));

    const updatedRooms = currentRooms.map(room => {
      const roomAllotments = updatedAllotments.filter(a => a.roomNo === room.room_no);
      
      const occupants = roomAllotments.map(a => {
        const student = students.find(s => s.student_id === a.admissionId || s.name === a.studentName);
        return {
          name: a.studentName,
          id: a.admissionId,
          class: student ? `${student.class_id}-${student.section || 'A'}` : '10-A',
          avatar: student?.avatar || ALLOTMENT_AVATARS[a.studentName] || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(a.studentName)}`,
          allotDate: a.allotDate,
          status: a.status
        };
      });

      const occupied = occupants.length;
      const status = occupied === room.capacity ? 'Full' : occupied === 0 ? 'Empty' : 'Available';

      return {
        ...room,
        occupied,
        occupants,
        status
      };
    });

    setRooms(updatedRooms);
    localStorage.setItem('hostel_rooms', JSON.stringify(updatedRooms));
    window.dispatchEvent(new Event('storage'));
  };

  // Sync state from LocalStorage storage events (tabs / pages cross-sync)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedRooms = localStorage.getItem('hostel_rooms');
      const savedStudents = localStorage.getItem('students');
      if (savedStudents) {
        setStudents(JSON.parse(savedStudents));
      }
      if (savedRooms) {
        const currentRooms = JSON.parse(savedRooms);
        setRooms(currentRooms);

        const savedAllotments = localStorage.getItem('hostel_allotments');
        const loadedAllotments = savedAllotments ? JSON.parse(savedAllotments) : [];
        
        const derivedAllotments = [];
        let nextId = loadedAllotments.length > 0 ? Math.max(...loadedAllotments.map(a => a.id)) + 1 : 1;
        
        currentRooms.forEach(room => {
          if (room.occupants) {
            room.occupants.forEach(occ => {
              const existing = loadedAllotments.find(a => a.admissionId === occ.id && a.roomNo === room.room_no);
              const isFemale = occ.gender === 'Female' || ['Aaradhya Sen', 'Ananya Rao', 'Diya Mehta', 'Ishaanvi Bose', 'Aadya Sharma', 'Avani Krishnan', 'Saisha Mukherjee', 'Prisha Choudhury', 'Riya Chatterjee', 'Sneha Deshmukh', 'Tanvi Bhatia', 'Divya Khanna', 'Meera Roy', 'Shruti Pillai', 'Kavya Hegde', 'Neela Saxena', 'Bhavna Chauhan', 'Kiara Malhotra', 'Jyoti Kulkarni', 'Janvi Ahluwalia', 'Esha Deol', 'Geeta Johri', 'Gauri Sen', 'Shikha Agrawal', 'Divya Joshi', 'Isha Sen', 'Aditi Nair', 'Neha Sharma', 'Riya Banerjee', 'Kavita Krishnan', 'Meera Patel', 'Nisha Patel'].includes(occ.name);
              
              derivedAllotments.push({
                id: existing ? existing.id : nextId++,
                studentName: occ.name,
                admissionId: occ.id,
                hostel: existing ? existing.hostel : (room.room_no.startsWith('S-') ? 'Staff Residency' : (isFemale ? 'Elite Girls Block B' : 'Elite Boys Block A')),
                roomNo: room.room_no,
                type: room.type,
                allotDate: occ.allotDate || existing?.allotDate || '2026-01-15',
                status: occ.status || existing?.status || 'Active',
                color: existing ? existing.color : (room.room_no.startsWith('S-') ? '#10b981' : (isFemale ? '#ec4899' : '#4f46e5')),
                avatar: occ.avatar || existing?.avatar
              });
            });
          }
        });
        setAllotments(derivedAllotments);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Live observer for color adjustments
    const observer = new MutationObserver(() => {
      setSystemDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      observer.disconnect();
    };
  }, [students]);

  // Fetch allotments from backend on mount and merge with local rooms-derived allotments
  useEffect(() => {
    HostelApi.getAll()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Map DB allotments to component shape
          const dbAllotments = data.map((row, idx) => ({
            id: row.id || idx + 1,
            studentName: row.student_id || 'Unknown',
            admissionId: row.student_id || '',
            hostel: row.block || 'Elite Boys Block A',
            roomNo: row.room_no || '',
            type: 'Standard',
            allotDate: '2026-01-15',
            status: row.fee_status === 'Paid' ? 'Active' : 'Pending',
            color: '#4f46e5'
          }));
          setAllotments(prev => {
            // Merge: prefer DB records but keep local-only ones too
            const dbIds = new Set(dbAllotments.map(a => String(a.id)));
            const localOnly = prev.filter(a => !dbIds.has(String(a.id)));
            return [...dbAllotments, ...localOnly];
          });
        }
      })
      .catch(() => { /* keep localStorage state */ });
  }, []);

  const { isDark, palette, spacing } = applyRoomAppearanceStyles(appearance, systemDark);

  const handleUpdateAllotment = (e) => {
    e.preventDefault();
    if (!newAllotment.room) {
      showToast('Please select a valid room.', 'error');
      return;
    }

    const studentObj = (students.length > 0 ? students : DEFAULT_STUDENTS).find(s => s.student_id === newAllotment.admissionId || s.name === newAllotment.student);

    const updated = allotments.map(a => a.id === editingAllotment.id ? {
      ...a,
      studentName: newAllotment.student,
      admissionId: newAllotment.admissionId,
      hostel: newAllotment.hostel,
      roomNo: newAllotment.room,
      type: newAllotment.type,
      allotDate: newAllotment.date,
      color: newAllotment.hostel.includes('Boys') ? '#4f46e5' : newAllotment.hostel.includes('Girls') ? '#ec4899' : '#10b981',
      avatar: studentObj?.avatar || a.avatar || ALLOTMENT_AVATARS[newAllotment.student] || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(newAllotment.student)}`
    } : a);

    syncAllotmentsAndRooms(updated);
    setEditingAllotment(null);
    const updatedStudentName = newAllotment.student;
    setNewAllotment({ student: '', admissionId: '', hostel: 'Elite Boys Block A', room: '', type: 'Standard', date: new Date().toISOString().split('T')[0] });
    showToast(`Residency details updated for ${updatedStudentName}!`, 'success');
  };

  const handleAddAllotment = (e) => {
    e.preventDefault();
    if (!newAllotment.student || !newAllotment.room) {
      showToast('Please select a student and room.', 'error');
      return;
    }

    const studentObj = (students.length > 0 ? students : DEFAULT_STUDENTS).find(s => s.student_id === newAllotment.admissionId || s.name === newAllotment.student);

    const allot = {
      id: allotments.length > 0 ? Math.max(...allotments.map(a => a.id)) + 1 : 1,
      studentName: newAllotment.student,
      admissionId: newAllotment.admissionId,
      hostel: newAllotment.hostel,
      roomNo: newAllotment.room,
      type: newAllotment.type,
      allotDate: newAllotment.date,
      status: 'Active',
      color: newAllotment.hostel.includes('Boys') ? '#4f46e5' : newAllotment.hostel.includes('Girls') ? '#ec4899' : '#10b981',
      avatar: studentObj?.avatar || ALLOTMENT_AVATARS[newAllotment.student] || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(newAllotment.student)}`
    };

    const updated = [allot, ...allotments];
    syncAllotmentsAndRooms(updated);

    // Sync new allotment to backend database
    HostelApi.assignBed({
      room_no: allot.roomNo,
      student_id: allot.admissionId,
      block: allot.hostel,
      fee_status: 'Paid'
    }).catch(() => {});

    setShowAllotModal(false);
    setNewAllotment({ student: '', admissionId: '', hostel: 'Elite Boys Block A', room: '', type: 'Standard', date: new Date().toISOString().split('T')[0] });
    showToast(`Allotment created successfully for ${allot.studentName}!`, 'success');
  };

  const openEditModal = (allot) => {
    setEditingAllotment(allot);
    setNewAllotment({
      student: allot.studentName,
      admissionId: allot.admissionId,
      hostel: allot.hostel,
      room: allot.roomNo,
      type: allot.type,
      date: allot.allotDate
    });
  };

  const closeModal = () => {
    setShowAllotModal(false);
    setEditingAllotment(null);
    setNewAllotment({ student: '', admissionId: '', hostel: 'Elite Boys Block A', room: '', type: 'Standard', date: new Date().toISOString().split('T')[0] });
    setStudentSearch('');
    setRoomSearch('');
    setShowStudentDropdown(false);
    setShowRoomDropdown(false);
  };

  const filteredAllotments = allotments.filter(a => {
    const matchesSearch = a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         a.admissionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = blockFilter === 'All' || a.hostel.includes(blockFilter);
    return matchesSearch && matchesBlock;
  });

  return (
    <div style={{ padding: spacing.padding, backgroundColor: palette.bgBody, color: palette.textMain, minHeight: '100vh', transition: 'all 0.4s ease' }}>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: spacing.fontSizeTitle, fontWeight: 950, color: palette.textMain, letterSpacing: '-1.5px', marginBottom: '8px', transition: 'font-size 0.3s' }}>Student Allotment</h1>
          <p style={{ color: palette.textMuted, fontSize: spacing.fontSizeSub, fontWeight: 500 }}>Manage residential assignments and unit allocation for the student body.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={() => setShowAppearanceModal(true)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 24px', 
              backgroundColor: palette.bgCard, color: palette.textMain, borderRadius: '18px', 
              border: `1px solid ${palette.borderColor}`, fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              boxShadow: palette.shadow, transition: 'all 0.3s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.backgroundColor = palette.bgBody; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.backgroundColor = palette.bgCard; }}
          >
            <SlidersHorizontal size={18} color={palette.primary} /> Customize Style
          </button>
          <button 
            onClick={() => setShowAllotModal(true)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 32px', 
              backgroundColor: palette.primary, color: 'white', borderRadius: '18px', 
              border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              boxShadow: `0 10px 20px ${palette.primaryLight}`, transition: 'all 0.3s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'brightness(1)'; }}
          >
            <UserPlus size={20} /> Allot New Student
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: spacing.gap, marginBottom: '40px' }}>
        {[
          { label: 'Total Allotted', value: allotments.length, icon: <UserCheck />, color: '#4f46e5' },
          { label: 'Active Residency', value: allotments.filter(a => a.status === 'Active').length, icon: <Building />, color: '#10b981' },
          { label: 'Pending Clearances', value: allotments.filter(a => a.status === 'Pending').length, icon: <ShieldAlert />, color: '#f59e0b' },
          { label: 'Waitlisted', value: '14', icon: <ClockIcon />, color: '#64748b' }
        ].map((stat, i) => (
          <motion.div 
            key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ 
              padding: spacing.cardPadding, 
              backgroundColor: palette.bgCard, 
              borderRadius: spacing.borderRadius, 
              border: `1.5px solid ${palette.borderColor}`, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '20px',
              boxShadow: palette.shadow,
              backdropFilter: palette.backdrop
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: `${stat.color}10`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
               <div style={{ fontSize: '1.5rem', fontWeight: 950, color: palette.textMain }}>{stat.value}</div>
               <div style={{ fontSize: '0.8rem', fontWeight: 700, color: palette.textMuted }}>{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
         <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
            <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: palette.textMuted }} size={18} />
            <input 
              type="text" placeholder="Search by student name or admission ID..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '16px 16px 16px 54px', borderRadius: '18px', border: `1.5px solid ${palette.borderColor}`, backgroundColor: palette.bgCard, color: palette.textMain, outline: 'none', fontWeight: 600 }}
            />
         </div>
         <div style={{ position: 'relative' }}>
           <button 
             onClick={() => setShowBlockDropdown(!showBlockDropdown)}
             style={{ padding: '16px 24px', borderRadius: '18px', border: `1px solid ${palette.borderColor}`, backgroundColor: showBlockDropdown ? palette.bgBody : palette.bgCard, color: palette.textMain, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: palette.shadow }}
           >
              <Filter size={18} /> {blockFilter === 'All' ? 'Filter Blocks' : `${blockFilter} Block`}
           </button>

           <AnimatePresence>
             {showBlockDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{ 
                    position: 'absolute', top: '110%', right: 0, width: '220px', 
                    backgroundColor: palette.bgCard, borderRadius: '24px', padding: '12px', 
                    boxShadow: palette.shadow, border: `1px solid ${palette.borderColor}`, zIndex: 10 
                  }}
                >
                  {['All', 'Boys', 'Girls', 'Staff'].map((block) => (
                    <button 
                      key={block}
                      onClick={() => { setBlockFilter(block); setShowBlockDropdown(false); }}
                      style={{ 
                        width: '100%', padding: '14px 20px', borderRadius: '16px', border: 'none', 
                        backgroundColor: blockFilter === block ? palette.primaryLight : 'transparent', 
                        color: blockFilter === block ? palette.primary : palette.textMuted,
                        textAlign: 'left', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      {block === 'All' ? 'All Blocks' : `${block} Blocks`}
                    </button>
                  ))}
                </motion.div>
             )}
           </AnimatePresence>
         </div>
      </div>

      {/* Allotment List */}
      <div style={{ backgroundColor: palette.bgCard, borderRadius: spacing.borderRadius, border: `1.5px solid ${palette.borderColor}`, overflow: 'hidden', boxShadow: palette.shadow, backdropFilter: palette.backdrop }}>
         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
               <tr style={{ backgroundColor: palette.bgBody, borderBottom: `1px solid ${palette.borderColor}` }}>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: palette.textMuted }}>STUDENT & ID</th>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: palette.textMuted }}>RESIDENCE BLOCK</th>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: palette.textMuted }}>UNIT TYPE</th>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: palette.textMuted }}>DATE ALLOTTED</th>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: palette.textMuted }}>STATUS</th>
                  <th style={{ padding: '24px 32px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 800, color: palette.textMuted }}>ACTIONS</th>
               </tr>
            </thead>
            <tbody>
               {filteredAllotments.map((allot, i) => (
                 <motion.tr 
                   key={allot.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                   style={{ borderBottom: `1px solid ${palette.borderColor}` }}
                 >
                    <td style={{ padding: '24px 32px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                             <img 
                                src={allot.avatar || (() => {
                                   const s = students.find(stud => stud.student_id === allot.admissionId || stud.name === allot.studentName);
                                   return s?.avatar || ALLOTMENT_AVATARS[allot.studentName] || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(allot.studentName)}`;
                                })()}
                                alt={allot.studentName}
                                onError={(e) => {
                                   e.currentTarget.style.display = 'none';
                                   const sibling = e.currentTarget.nextSibling;
                                   if (sibling) sibling.style.display = 'flex';
                                }}
                                style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover', border: `1.5px solid ${allot.color}30` }}
                             />
                             <div style={{ display: 'none', width: '40px', height: '40px', borderRadius: '12px', backgroundColor: `${allot.color}15`, color: allot.color, alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem' }}>
                                {allot.studentName.charAt(0)}
                             </div>
                          </div>
                          <div>
                             <div style={{ fontSize: '0.95rem', fontWeight: 800, color: palette.textMain }}>{allot.studentName}</div>
                             <div style={{ fontSize: '0.75rem', fontWeight: 600, color: palette.textMuted }}>{allot.admissionId}</div>
                          </div>
                       </div>
                    </td>
                    <td style={{ padding: '24px 32px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Building size={16} color={palette.textMuted} />
                          <div>
                             <div style={{ fontSize: '0.9rem', fontWeight: 700, color: palette.textMain }}>{allot.hostel}</div>
                             <div style={{ fontSize: '0.75rem', fontWeight: 800, color: palette.primary }}>Room {allot.roomNo}</div>
                          </div>
                       </div>
                    </td>
                    <td style={{ padding: '24px 32px' }}>
                       <span style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: palette.bgBody, color: palette.textMain, fontSize: '0.75rem', fontWeight: 800, border: `1px solid ${palette.borderColor}` }}>
                          {allot.type}
                       </span>
                    </td>
                    <td style={{ padding: '24px 32px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: palette.textMuted }}>
                          <Calendar size={14} /> {allot.allotDate}
                       </div>
                    </td>
                    <td style={{ padding: '24px 32px' }}>
                       <span style={{ 
                         padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 900,
                         backgroundColor: allot.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                         color: allot.status === 'Active' ? '#10b981' : '#f59e0b'
                       }}>
                          {allot.status}
                       </span>
                    </td>
                     <td style={{ padding: '24px 32px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                           <button 
                             onClick={() => openEditModal(allot)}
                             style={{ padding: '8px 16px', borderRadius: '10px', border: `1px solid ${palette.borderColor}`, backgroundColor: palette.bgCard, color: palette.primary, fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                             onMouseOver={(e) => e.currentTarget.style.backgroundColor = palette.bgBody}
                             onMouseOut={(e) => e.currentTarget.style.backgroundColor = palette.bgCard}
                           >
                              Edit
                           </button>
                           <button 
                             onClick={() => setShowActionsMenu(allot)}
                             style={{ 
                               width: '36px', 
                               height: '36px', 
                               borderRadius: '10px', 
                               border: `1px solid ${palette.borderColor}`, 
                               backgroundColor: showActionsMenu?.id === allot.id ? palette.bgBody : palette.bgCard, 
                               color: palette.textMuted, 
                               display: 'flex', 
                               alignItems: 'center', 
                               justifyContent: 'center', 
                               cursor: 'pointer',
                               transition: 'all 0.2s ease'
                             }}
                           >
                              <MoreVertical size={16} />
                           </button>
                        </div>
                     </td>
                  </motion.tr>
                ))}
             </tbody>
          </table>
       </div>

        {/* Allotment Modal (Add/Edit) */}
        <AnimatePresence>
          {(showAllotModal || editingAllotment) && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 onClick={closeModal}
                 style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}
               />
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                 style={{ 
                   position: 'relative', width: '100%', maxWidth: '500px', backgroundColor: palette.bgCard, 
                   borderRadius: spacing.borderRadius, padding: '48px', boxShadow: palette.shadow, border: `1.5px solid ${palette.borderColor}`
                 }}
               >
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 950, color: palette.textMain, marginBottom: '32px' }}>{editingAllotment ? 'Edit Residency' : 'Allot New Student'}</h2>
                  <form onSubmit={editingAllotment ? handleUpdateAllotment : handleAddAllotment} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                     
                     {/* Searchable Student Dropdown Selector */}
                     <div style={{ position: 'relative' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: palette.textMuted, marginBottom: '10px' }}>Select Student</label>
                        {editingAllotment ? (
                          <input 
                            required type="text"
                            value={newAllotment.student}
                            style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: `1px solid ${palette.borderColor}`, backgroundColor: palette.bgBody, color: palette.textMain, outline: 'none', fontWeight: 600 }}
                            disabled
                          />
                        ) : (
                          <>
                            <div 
                              onClick={() => { setShowStudentDropdown(!showStudentDropdown); setShowRoomDropdown(false); }}
                              style={{ 
                                width: '100%', padding: '16px 20px', borderRadius: '14px', border: `1px solid ${palette.borderColor}`, 
                                backgroundColor: palette.bgBody, color: newAllotment.student ? palette.textMain : palette.textMuted, 
                                outline: 'none', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' 
                              }}
                            >
                              <span>{newAllotment.student ? `${newAllotment.student} (${newAllotment.admissionId})` : 'Choose a student...'}</span>
                              <ChevronDown size={18} style={{ opacity: 0.7, transform: showStudentDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                            </div>
                            
                            <AnimatePresence>
                              {showStudentDropdown && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                  style={{ 
                                    position: 'absolute', top: '105%', left: 0, right: 0, zIndex: 1100, 
                                    backgroundColor: palette.bgCard, borderRadius: '16px', border: `1px solid ${palette.borderColor}`,
                                    boxShadow: palette.shadow, padding: '12px', maxHeight: '240px', overflowY: 'auto'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderBottom: `1px solid ${palette.borderColor}`, marginBottom: '8px' }}>
                                    <Search size={14} color={palette.textMuted} />
                                    <input 
                                      type="text" placeholder="Type to filter..."
                                      value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)}
                                      onClick={(e) => e.stopPropagation()}
                                      style={{ width: '100%', border: 'none', backgroundColor: 'transparent', outline: 'none', color: palette.textMain, fontWeight: 600, fontSize: '0.85rem' }}
                                    />
                                  </div>
                                  
                                  {(() => {
                                    const allottedStudentIds = new Set(allotments.map(a => a.admissionId));
                                    
                                    const filteredStudents = (students.length > 0 ? students : DEFAULT_STUDENTS).filter(s => {
                                      const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                                                          s.student_id.toLowerCase().includes(studentSearch.toLowerCase());
                                      const isNotAllotted = !allottedStudentIds.has(s.student_id);
                                      return matchesSearch && isNotAllotted;
                                    });
                                    
                                    if (filteredStudents.length === 0) {
                                      return <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.85rem', color: palette.textMuted }}>No unallotted students found</div>;
                                    }
                                    
                                    return filteredStudents.map(student => {
                                      const avatarUrl = student.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(student.name)}`;
                                      return (
                                        <div 
                                          key={student.student_id}
                                          onClick={() => {
                                            setNewAllotment({
                                              ...newAllotment,
                                              student: student.name,
                                              admissionId: student.student_id
                                            });
                                            setStudentSearch('');
                                            setShowStudentDropdown(false);
                                          }}
                                          style={{ 
                                            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px',
                                            cursor: 'pointer', transition: 'background-color 0.2s'
                                          }}
                                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = palette.bgBody}
                                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                          <img 
                                            src={avatarUrl} 
                                            alt={student.name}
                                            onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(student.name)}`; }}
                                            style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }}
                                          />
                                          <div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: palette.textMain }}>{student.name}</div>
                                            <div style={{ fontSize: '0.7rem', color: palette.textMuted, fontWeight: 600 }}>Class {student.class_id}-{student.section || 'A'} &bull; ID: {student.student_id}</div>
                                          </div>
                                        </div>
                                      );
                                    });
                                  })()}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        )}
                     </div>

                     {/* Searchable Room Dropdown Selector */}
                     <div style={{ position: 'relative' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: palette.textMuted, marginBottom: '10px' }}>Select Room</label>
                        <div 
                          onClick={() => { setShowRoomDropdown(!showRoomDropdown); setShowStudentDropdown(false); }}
                          style={{ 
                            width: '100%', padding: '16px 20px', borderRadius: '14px', border: `1px solid ${palette.borderColor}`, 
                            backgroundColor: palette.bgBody, color: newAllotment.room ? palette.textMain : palette.textMuted, 
                            outline: 'none', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' 
                          }}
                        >
                          <span>{newAllotment.room ? `Room ${newAllotment.room} (${newAllotment.type})` : 'Choose a room...'}</span>
                          <ChevronDown size={18} style={{ opacity: 0.7, transform: showRoomDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </div>
                        
                        <AnimatePresence>
                          {showRoomDropdown && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                              style={{ 
                                position: 'absolute', top: '105%', left: 0, right: 0, zIndex: 1100, 
                                backgroundColor: palette.bgCard, borderRadius: '16px', border: `1px solid ${palette.borderColor}`,
                                boxShadow: palette.shadow, padding: '12px', maxHeight: '240px', overflowY: 'auto'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderBottom: `1px solid ${palette.borderColor}`, marginBottom: '8px' }}>
                                <Search size={14} color={palette.textMuted} />
                                <input 
                                  type="text" placeholder="Type room number..."
                                  value={roomSearch} onChange={(e) => setRoomSearch(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  style={{ width: '100%', border: 'none', backgroundColor: 'transparent', outline: 'none', color: palette.textMain, fontWeight: 600, fontSize: '0.85rem' }}
                                />
                              </div>
                              
                              {(() => {
                                const filteredRooms = rooms.filter(room => {
                                  const matchesSearch = room.room_no.includes(roomSearch);
                                  const hasVacancy = room.occupied < room.capacity;
                                  const isCurrentRoom = editingAllotment && room.room_no === editingAllotment.roomNo;
                                  return matchesSearch && (hasVacancy || isCurrentRoom);
                                });
                                
                                if (filteredRooms.length === 0) {
                                  return <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.85rem', color: palette.textMuted }}>No vacant rooms found</div>;
                                }
                                
                                return filteredRooms.map(room => {
                                  const bedsLeft = room.capacity - room.occupied;
                                  const isCurrentRoom = editingAllotment && room.room_no === editingAllotment.roomNo;
                                  
                                  return (
                                    <div 
                                      key={room.id}
                                      onClick={() => {
                                        const studentObj = (students.length > 0 ? students : DEFAULT_STUDENTS).find(s => s.name === newAllotment.student || s.student_id === newAllotment.admissionId);
                                        const isFemale = studentObj?.gender === 'Female' || ['Aaradhya Sen', 'Ananya Rao', 'Diya Mehta', 'Ishaanvi Bose', 'Aadya Sharma', 'Avani Krishnan', 'Saisha Mukherjee', 'Prisha Choudhury', 'Riya Chatterjee', 'Sneha Deshmukh', 'Tanvi Bhatia', 'Divya Khanna', 'Meera Roy', 'Shruti Pillai', 'Kavya Hegde', 'Neela Saxena', 'Bhavna Chauhan', 'Kiara Malhotra', 'Jyoti Kulkarni', 'Janvi Ahluwalia', 'Esha Deol', 'Geeta Johri', 'Gauri Sen', 'Shikha Agrawal', 'Divya Joshi', 'Isha Sen', 'Aditi Nair', 'Neha Sharma', 'Riya Banerjee', 'Kavita Krishnan', 'Meera Patel', 'Nisha Patel'].includes(newAllotment.student);
                                        
                                        let block = 'Elite Boys Block A';
                                        if (room.room_no.startsWith('S-')) {
                                          block = 'Staff Residency';
                                        } else if (isFemale) {
                                          block = 'Elite Girls Block B';
                                        }
                                        
                                        setNewAllotment({
                                          ...newAllotment,
                                          room: room.room_no,
                                          type: room.type,
                                          hostel: block
                                        });
                                        
                                        setRoomSearch('');
                                        setShowRoomDropdown(false);
                                      }}
                                      style={{ 
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '10px',
                                        cursor: 'pointer', transition: 'background-color 0.2s'
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = palette.bgBody}
                                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                      <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: palette.textMain }}>Room {room.room_no} ({room.type})</div>
                                        <div style={{ fontSize: '0.7rem', color: palette.textMuted, fontWeight: 600 }}>{room.floor} Floor</div>
                                      </div>
                                      <div style={{ 
                                        fontSize: '0.75rem', fontWeight: 800, padding: '4px 8px', borderRadius: '6px',
                                        backgroundColor: isCurrentRoom ? 'rgba(79, 70, 229, 0.12)' : bedsLeft > 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                                        color: isCurrentRoom ? '#4f46e5' : bedsLeft > 0 ? '#10b981' : '#ef4444'
                                      }}>
                                        {isCurrentRoom ? 'Current Room' : bedsLeft === 0 ? 'Full' : `${bedsLeft} ${bedsLeft === 1 ? 'bed' : 'beds'} left`}
                                      </div>
                                    </div>
                                  );
                                });
                              })()}
                            </motion.div>
                          )}
                        </AnimatePresence>
                     </div>

                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: palette.textMuted, marginBottom: '10px' }}>Residence Block</label>
                          <input 
                            disabled type="text"
                            value={newAllotment.hostel}
                            style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: `1px solid ${palette.borderColor}`, backgroundColor: palette.bgBody, color: palette.textMain, outline: 'none', fontWeight: 700 }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: palette.textMuted, marginBottom: '10px' }}>Allotment Date</label>
                          <input 
                            required type="date"
                            value={newAllotment.date} onChange={(e) => setNewAllotment({...newAllotment, date: e.target.value})}
                            style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: `1px solid ${palette.borderColor}`, backgroundColor: palette.bgBody, color: palette.textMain, outline: 'none', fontWeight: 700 }}
                          />
                        </div>
                     </div>
                     <button type="submit" style={{ padding: '18px', backgroundColor: palette.primary, color: 'white', borderRadius: '16px', border: 'none', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', marginTop: '12px', boxShadow: `0 10px 20px ${palette.primaryLight}` }}>
                        {editingAllotment ? 'Update Residency' : 'Confirm Allotment'}
                     </button>
                  </form>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Premium Quick Actions Overlay Sheet */}
        <AnimatePresence>
          {showActionsMenu && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 900, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setShowActionsMenu(null)}
                style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)' }}
              />
              <motion.div 
                initial={{ y: '100%' }} 
                animate={{ y: 0 }} 
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{ 
                  position: 'relative', width: '100%', maxWidth: '500px', 
                  backgroundColor: palette.bgCard, borderTopLeftRadius: spacing.borderRadius, borderTopRightRadius: spacing.borderRadius, 
                  padding: '36px', boxShadow: palette.shadow, zIndex: 901,
                  border: `1px solid ${palette.borderColor}`
                }}
              >
                <div style={{ width: '40px', height: '5px', backgroundColor: palette.borderColor, borderRadius: '10px', margin: '0 auto 24px' }} />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
                  <div style={{ position: 'relative', width: '56px', height: '56px' }}>
                     <img 
                        src={showActionsMenu.avatar || (() => {
                           const s = students.find(stud => stud.student_id === showActionsMenu.admissionId || stud.name === showActionsMenu.studentName);
                           return s?.avatar || ALLOTMENT_AVATARS[showActionsMenu.studentName] || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(showActionsMenu.studentName)}`;
                        })()}
                        alt={showActionsMenu.studentName}
                        onError={(e) => {
                           e.currentTarget.style.display = 'none';
                           const sibling = e.currentTarget.nextSibling;
                           if (sibling) sibling.style.display = 'flex';
                        }}
                        style={{ width: '56px', height: '56px', borderRadius: '18px', objectFit: 'cover', border: `2px solid ${showActionsMenu.color}30` }}
                     />
                     <div style={{ display: 'none', width: '56px', height: '56px', borderRadius: '18px', backgroundColor: `${showActionsMenu.color}15`, color: showActionsMenu.color, alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.25rem' }}>
                        {showActionsMenu.studentName.charAt(0)}
                     </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: palette.textMain, margin: 0 }}>{showActionsMenu.studentName}</h3>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: palette.textMuted, margin: '4px 0 0' }}>ID: {showActionsMenu.admissionId} &bull; Room {showActionsMenu.roomNo}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button 
                    onClick={() => {
                      const target = showActionsMenu;
                      setShowActionsMenu(null);
                      openEditModal(target);
                    }}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '16px', width: '100%', 
                      padding: '16px 20px', borderRadius: '16px', border: `1px solid ${palette.borderColor}`, 
                      backgroundColor: palette.bgCard, color: palette.textMain, fontWeight: 700, fontSize: '0.95rem',
                      cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = palette.bgBody; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = palette.bgCard; }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', backgroundColor: palette.primaryLight, color: palette.primary }}>
                       <Users size={18} />
                    </span>
                    <div>
                      <div style={{ fontWeight: 800 }}>Edit Residency Details</div>
                      <div style={{ fontSize: '0.75rem', color: palette.textMuted, fontWeight: 500 }}>Modify room allocation and dates</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      const updated = allotments.map(a => a.id === showActionsMenu.id ? { ...a, status: a.status === 'Active' ? 'Pending' : 'Active' } : a);
                      syncAllotmentsAndRooms(updated);
                      const toggledTo = showActionsMenu.status === 'Active' ? 'Pending' : 'Active';
                      showToast(`Status updated to ${toggledTo} for ${showActionsMenu.studentName}`, 'success');
                      setShowActionsMenu(null);
                    }}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '16px', width: '100%', 
                      padding: '16px 20px', borderRadius: '16px', border: `1px solid ${palette.borderColor}`, 
                      backgroundColor: palette.bgCard, color: palette.textMain, fontWeight: 700, fontSize: '0.95rem',
                      cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = palette.bgBody; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = palette.bgCard; }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', backgroundColor: showActionsMenu.status === 'Active' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: showActionsMenu.status === 'Active' ? '#d97706' : '#059669' }}>
                       <CheckCircle size={18} />
                    </span>
                    <div>
                      <div style={{ fontWeight: 800 }}>Toggle Status ({showActionsMenu.status === 'Active' ? 'Set Pending' : 'Set Active'})</div>
                      <div style={{ fontSize: '0.75rem', color: palette.textMuted, fontWeight: 500 }}>Update active clearance and billing check</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      showToast(`Digital Gate Pass generated successfully for ${showActionsMenu.studentName}!`, 'success');
                      setShowActionsMenu(null);
                    }}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '16px', width: '100%', 
                      padding: '16px 20px', borderRadius: '16px', border: `1px solid ${palette.borderColor}`, 
                      backgroundColor: palette.bgCard, color: palette.textMain, fontWeight: 700, fontSize: '0.95rem',
                      cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = palette.bgBody; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = palette.bgCard; }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                       <ArrowRight size={18} />
                    </span>
                    <div>
                      <div style={{ fontWeight: 800 }}>Issue Digital Gate Pass</div>
                      <div style={{ fontSize: '0.75rem', color: palette.textMuted, fontWeight: 500 }}>Simulate issuing gate-pass clearance certificate</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      setDeleteConfirmId(showActionsMenu.id);
                      setShowActionsMenu(null);
                    }}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '16px', width: '100%', 
                      padding: '16px 20px', borderRadius: '16px', border: '1px solid #fee2e2', 
                      backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', fontWeight: 700, fontSize: '0.95rem',
                      cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fee2e2', color: '#ef4444' }}>
                       <ShieldAlert size={18} />
                    </span>
                    <div>
                      <div style={{ fontWeight: 800 }}>De-allot Resident</div>
                      <div style={{ fontSize: '0.75rem', color: '#ef444490', fontWeight: 500 }}>Permanently remove student residency</div>
                    </div>
                  </button>
                </div>

                <button 
                  onClick={() => setShowActionsMenu(null)}
                  style={{ 
                    width: '100%', padding: '14px', borderRadius: '16px', border: `1px solid ${palette.borderColor}`, 
                    backgroundColor: palette.bgBody, color: palette.textMuted, fontWeight: 800, 
                    fontSize: '0.9rem', cursor: 'pointer', marginTop: '20px'
                  }}
                >
                  Close Actions Panel
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Custom Warning Modal Overlay */}
        <AnimatePresence>
          {deleteConfirmId && (() => {
            const targetAllot = allotments.find(a => a.id === deleteConfirmId);
            if (!targetAllot) return null;
            return (
              <div style={{ position: 'fixed', inset: 0, zIndex: 1010, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setDeleteConfirmId(null)}
                  style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}
                />
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                  style={{ 
                    position: 'relative', width: '100%', maxWidth: '440px', backgroundColor: palette.bgCard, 
                    borderRadius: spacing.borderRadius, padding: '40px', boxShadow: palette.shadow,
                    textAlign: 'center', border: `1px solid ${palette.borderColor}`
                  }}
                >
                  <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                    <ShieldAlert size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: palette.textMain, marginBottom: '12px' }}>Confirm De-allotment</h3>
                  <p style={{ color: palette.textMuted, fontSize: '0.95rem', lineHeight: '1.6', fontWeight: 500, marginBottom: '32px' }}>
                    Are you absolutely sure you want to remove residential allotment for <strong style={{ color: palette.textMain, fontWeight: 800 }}>{targetAllot.studentName}</strong> ({targetAllot.admissionId})? This will de-allocate Room {targetAllot.roomNo} immediately.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <button 
                      onClick={() => setDeleteConfirmId(null)}
                      style={{ 
                        padding: '16px', borderRadius: '16px', border: `1px solid ${palette.borderColor}`, 
                        backgroundColor: palette.bgCard, color: palette.textMain, fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s ease' 
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = palette.bgBody}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = palette.bgCard}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        const updated = allotments.filter(a => a.id !== deleteConfirmId);
                        syncAllotmentsAndRooms(updated);
                        showToast(`${targetAllot.studentName} has been successfully de-allotted from Room ${targetAllot.roomNo}.`, 'success');
                        // Sync deletion to backend database
                        HostelApi.deleteAllotment(deleteConfirmId).catch(() => {});
                        setDeleteConfirmId(null);
                      }}
                      style={{ 
                        padding: '16px', borderRadius: '16px', border: 'none', 
                        backgroundColor: '#ef4444', color: 'white', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                        boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)'
                      }}
                    >
                      De-allot Resident
                    </button>
                  </div>
                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>

        {/* Toast Notification Container */}
        <AnimatePresence>
          {toast && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              style={{ 
                position: 'fixed', bottom: '32px', right: '32px', zIndex: 2000, 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', 
                backgroundColor: palette.textMain, color: palette.bgCard, borderRadius: '20px', 
                boxShadow: palette.shadow, maxWidth: '400px', border: `1px solid ${palette.borderColor}`,
                backdropFilter: palette.backdrop
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#10b98120', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={18} />
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: '1.4' }}>{toast.message}</div>
            </motion.div>
          )}
        </AnimatePresence>

      <RoomAppearanceModal 
        isOpen={showAppearanceModal} 
        onClose={() => setShowAppearanceModal(false)} 
        onChange={(updated) => setAppearance(updated)} 
      />
    </div>
  );
};

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default HostelAllotment;
