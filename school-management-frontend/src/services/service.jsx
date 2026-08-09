import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Security Interceptor: Inject token and handle 401s
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth
export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.role);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userName', response.data.name);
        localStorage.setItem('userProfilePic', response.data.profilePic || '');
        localStorage.setItem('isAuthenticated', 'true');
    }
    return response.data;
};

export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

export const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
};

// Global Stats
export const getStats = async () => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
};

// Student Management
export const getStudents = async () => {
    const response = await axios.get(`${API_URL}/students`);
    return response.data;
};
export const addStudent = async (studentData) => {
    const response = await axios.post(`${API_URL}/students`, studentData);
    return response.data;
};
export const deleteStudent = async (studentId) => {
    const response = await axios.delete(`${API_URL}/students/${studentId}`);
    return response.data;
};

// Teacher Management
export const getTeachers = async () => {
    const response = await axios.get(`${API_URL}/teachers`);
    return response.data;
};
export const addTeacher = async (teacherData) => {
    const response = await axios.post(`${API_URL}/teachers`, teacherData);
    return response.data;
};
export const updateTeacher = async (teacherId, teacherData) => {
    const response = await axios.put(`${API_URL}/teachers/${teacherId}`, teacherData);
    return response.data;
};
export const deleteTeacher = async (teacherId) => {
    const response = await axios.delete(`${API_URL}/teachers/${teacherId}`);
    return response.data;
};

// User Management
export const getUsers = async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
};

// Admissions API
export const AdmissionsApi = {
    apply: async (data) => {
        const response = await axios.post(`${API_URL}/admissions`, data);
        return response.data;
    },
    getApplications: async () => {
        const response = await axios.get(`${API_URL}/admissions`);
        return response.data;
    }
};

// --- Unified Module APIs ---

export const getNotices = async () => {
    const response = await axios.get(`${API_URL}/notices`);
    return response.data;
};

export const NoticesApi = {
    getNotices,
    postNotice: async (data) => {
        const response = await axios.post(`${API_URL}/notices`, data);
        return response.data;
    },
    updateNotice: async (id, data) => {
        const response = await axios.put(`${API_URL}/notices/${id}`, data);
        return response.data;
    },
    deleteNotice: async (id) => {
        const response = await axios.delete(`${API_URL}/notices/${id}`);
        return response.data;
    }
};

export const AttendanceApi = {
    getRecords: async () => {
        const response = await axios.get(`${API_URL}/attendance`);
        return response.data;
    },
    markAttendance: async (data) => {
        const response = await axios.post(`${API_URL}/attendance`, data);
        return response.data;
    }
};

export const FeesApi = {
    getFeeRecords: async () => {
        const response = await axios.get(`${API_URL}/fees`);
        return response.data;
    },
    collectFee: async (data) => {
        const response = await axios.post(`${API_URL}/fees`, data);
        return response.data;
    }
};

export const TimetableApi = {
    getTimetable: async () => {
        const response = await axios.get(`${API_URL}/timetable`);
        return response.data;
    },
    updateTimetable: async (data) => {
        const response = await axios.post(`${API_URL}/timetable`, data);
        return response.data;
    }
};

export const ExamsApi = {
    getExamSchedules: async () => {
        const response = await axios.get(`${API_URL}/exams`);
        return response.data;
    },
    postResult: async (data) => {
        const response = await axios.post(`${API_URL}/exams`, data);
        return response.data;
    }
};

export const TransportApi = {
    getRoutes: async () => {
        const response = await axios.get(`${API_URL}/transport`);
        return response.data;
    },
    assignVehicle: async (data) => {
        const response = await axios.post(`${API_URL}/transport`, data);
        return response.data;
    }
};

export const HostelApi = {
    getAll: async () => {
        const response = await axios.get(`${API_URL}/hostel`);
        return response.data;
    },
    assignBed: async (data) => {
        const response = await axios.post(`${API_URL}/hostel`, data);
        return response.data;
    },
    deleteAllotment: async (id) => {
        const response = await axios.delete(`${API_URL}/hostel/${id}`);
        return response.data;
    }
};

export const DriversApi = {
    getAll: async () => {
        const response = await axios.get(`${API_URL}/drivers`);
        return response.data;
    },
    create: async (data) => {
        const response = await axios.post(`${API_URL}/drivers`, data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await axios.put(`${API_URL}/drivers/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`${API_URL}/drivers/${id}`);
        return response.data;
    }
};

export const QuizzesApi = {
    getAll: async () => {
        const response = await axios.get(`${API_URL}/quizzes`);
        return response.data;
    },
    create: async (data) => {
        const response = await axios.post(`${API_URL}/quizzes`, data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await axios.put(`${API_URL}/quizzes/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`${API_URL}/quizzes/${id}`);
        return response.data;
    }
};

export const LibraryApi = {
    getBooks: async () => {
        const response = await axios.get(`${API_URL}/library`);
        return response.data;
    },
    issueBook: async (data) => {
        const response = await axios.post(`${API_URL}/library`, data);
        return response.data;
    }
};

export const ELibraryApi = {
    getResources: async () => {
        const response = await axios.get(`${API_URL}/library`);
        return response.data;
    },
    uploadResource: async (data) => {
        const response = await axios.post(`${API_URL}/library`, data);
        return response.data;
    }
};

export const MessagingApi = {
    getMessages: async () => {
        const response = await axios.get(`${API_URL}/messages`);
        return response.data;
    },
    sendMessage: async (data) => {
        const response = await axios.post(`${API_URL}/messages`, data);
        return response.data;
    }
};

export const AssignmentsApi = {
    getAssignments: async () => {
        const response = await axios.get(`${API_URL}/timetable`);
        return response.data;
    },
    submitAssignment: async (data) => {
        const response = await axios.post(`${API_URL}/timetable`, data);
        return response.data;
    }
};

export const EventsApi = {
    getEvents: async () => {
        const response = await axios.get(`${API_URL}/notices`);
        return response.data;
    },
    createEvent: async (data) => {
        const response = await axios.post(`${API_URL}/notices`, data);
        return response.data;
    }
};