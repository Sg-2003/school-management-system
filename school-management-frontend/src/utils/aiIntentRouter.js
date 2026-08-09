export const resolveAIIntent = (queryText) => {
  const query = queryText.toLowerCase();

  // --- Dashboard & Overviews ---
  if (query.match(/student dashboard|student portal/)) return { route: '/dashboard/student', text: 'Navigating to the Student Dashboard...' };
  if (query.match(/teacher dashboard|faculty portal/)) return { route: '/dashboard/teacher', text: 'Navigating to the Teacher Dashboard...' };
  if (query.match(/parent dashboard|guardian portal/)) return { route: '/dashboard/parent', text: 'Navigating to the Parent Dashboard...' };
  if (query.match(/lms dashboard|learning management/)) return { route: '/dashboard/lms', text: 'Navigating to the LMS Dashboard...' };
  if (query.match(/dashboard|home|overview/)) return { route: '/dashboard', text: 'Taking you to the main Dashboard...' };

  // --- Students & Admissions ---
  if (query.match(/add student|new student/)) return { route: '/dashboard/add-student', text: 'Opening the Student Admission form...' };
  if (query.match(/suspended|suspension/)) return { route: '/dashboard/suspended-students', text: 'Navigating to Suspended Students records...' };
  if (query.match(/student categor/)) return { route: '/dashboard/student-categories', text: 'Opening Student Categories...' };
  if (query.match(/student|admission|pupil/)) return { route: '/dashboard/students', text: 'Navigating to the Student Directory...' };

  // --- Guardians / Parents ---
  if (query.match(/add guardian|new guardian|add parent/)) return { route: '/dashboard/add-guardian', text: 'Opening the Add Guardian form...' };
  if (query.match(/guardian|parent/)) return { route: '/dashboard/guardians', text: 'Navigating to the Guardians list...' };

  // --- Teachers & Employees ---
  if (query.match(/add teacher|new teacher/)) return { route: '/dashboard/add-teacher', text: 'Opening the Add Teacher form...' };
  if (query.match(/teacher info|faculty info/)) return { route: '/dashboard/teacher-info', text: 'Navigating to Teacher Information...' };
  if (query.match(/teacher|faculty|staff/)) return { route: '/dashboard/teachers', text: 'Navigating to the Faculty Directory...' };
  if (query.match(/add employee|new employee/)) return { route: '/dashboard/add-employee', text: 'Opening the Add Employee form...' };
  if (query.match(/employee|staff list/)) return { route: '/dashboard/employees', text: 'Navigating to the Employee Directory...' };

  // --- Academics & Setup ---
  if (query.match(/class/)) return { route: '/dashboard/classes', text: 'Navigating to Classes management...' };
  if (query.match(/section/)) return { route: '/dashboard/sections', text: 'Navigating to Sections management...' };
  if (query.match(/subject|course/)) return { route: '/dashboard/subjects', text: 'Navigating to Subjects management...' };
  if (query.match(/classroom|room setup/)) return { route: '/dashboard/classrooms', text: 'Navigating to Classrooms setup...' };
  if (query.match(/academic|setup|term|semester/)) return { route: '/dashboard/academic-settings', text: 'Navigating to Academic Setup...' };

  // --- Attendance & Leaves ---
  if (query.match(/student attendance|check attendance|absentee/)) return { route: '/dashboard/student-attendance', text: 'Navigating to Student Attendance...' };
  if (query.match(/teacher attendance|faculty attendance/)) return { route: '/dashboard/teacher-attendance', text: 'Navigating to Teacher Attendance...' };
  if (query.match(/employee attendance|staff attendance/)) return { route: '/dashboard/employee-attendance', text: 'Navigating to Employee Attendance...' };
  if (query.match(/leave type|leave configurations/)) return { route: '/dashboard/leave-types', text: 'Opening Leave Types configuration...' };
  if (query.match(/leave request|apply leave|ask off|sick leave/)) return { route: '/dashboard/leave-request', text: 'Navigating to Leave Requests...' };
  if (query.match(/leave approved|approved leave/)) return { route: '/dashboard/leave-approved', text: 'Viewing Approved Leaves...' };
  if (query.match(/attendance|leaves/)) return { route: '/dashboard/student-attendance', text: 'Navigating to Attendance Module...' };

  // --- E-Learning (LMS) ---
  if (query.match(/assignment|homework/)) return { route: '/dashboard/assignments', text: 'Navigating to Assignments...' };
  if (query.match(/quiz|test/)) return { route: '/dashboard/quiz-center', text: 'Opening the Quiz Center...' };
  if (query.match(/e-library|digital library/)) return { route: '/dashboard/e-library', text: 'Navigating to the E-Library...' };
  if (query.match(/learning center/)) return { route: '/dashboard/learning-center', text: 'Navigating to the Learning Center...' };

  // --- Timetable & Exams ---
  if (query.match(/timetable|schedule|class routine/)) return { route: '/dashboard/timetable', text: 'Opening the Academic Timetable...' };
  if (query.match(/exam schedule|exam routine|exam date|test date/)) return { route: '/dashboard/exam-schedule', text: 'Navigating to Exam Schedules...' };
  if (query.match(/exam result|marks|score|gpa/)) return { route: '/dashboard/exam-result', text: 'Navigating to Exam Results...' };
  if (query.match(/exam|test/)) return { route: '/dashboard/exams', text: 'Navigating to the Exams portal...' };

  // --- Finances (Fees & Payroll) ---
  if (query.match(/fees collection|collect fee|pay fee|pay tuition|tuition collection/)) return { route: '/dashboard/fees-collection', text: 'Opening Fees Collection...' };
  if (query.match(/fees record|fee history|payment history|billing history/)) return { route: '/dashboard/fees-record', text: 'Navigating to Fees Records...' };
  if (query.match(/fee|payment|money|finance|invoice/)) return { route: '/dashboard/fees', text: 'Navigating to the Fees Dashboard...' };
  if (query.match(/income head/)) return { route: '/dashboard/income-head', text: 'Navigating to Income Heads...' };
  if (query.match(/income list|all income/)) return { route: '/dashboard/income-list', text: 'Navigating to Income List...' };
  if (query.match(/expense head/)) return { route: '/dashboard/expense-head', text: 'Navigating to Expense Heads...' };
  if (query.match(/expense list|all expense/)) return { route: '/dashboard/expense-list', text: 'Navigating to Expense List...' };
  if (query.match(/expense|expenditure/)) return { route: '/dashboard/expenses', text: 'Navigating to School Expenses...' };
  if (query.match(/transaction/)) return { route: '/dashboard/transactions', text: 'Navigating to Financial Transactions...' };
  if (query.match(/generate payroll|calculate salary|process payroll/)) return { route: '/dashboard/payroll-generate', text: 'Opening Payroll Generation...' };
  if (query.match(/payroll|salary|compensation/)) return { route: '/dashboard/payroll', text: 'Navigating to Payroll Management...' };

  // --- Library ---
  if (query.match(/library member/)) return { route: '/dashboard/library-members', text: 'Navigating to Library Members...' };
  if (query.match(/issue book|return book/)) return { route: '/dashboard/issue-return', text: 'Navigating to Book Issue/Return...' };
  if (query.match(/library|book/)) return { route: '/dashboard/library', text: 'Navigating to the Library Dashboard...' };

  // --- Transport & Hostel ---
  if (query.match(/transport route|bus route/)) return { route: '/dashboard/transport-routes', text: 'Opening Transport Routes...' };
  if (query.match(/vehicle/)) return { route: '/dashboard/transport-vehicles', text: 'Navigating to Vehicle Registry...' };
  if (query.match(/driver/)) return { route: '/dashboard/transport-drivers', text: 'Navigating to Transport Drivers...' };
  if (query.match(/transport|bus/)) return { route: '/dashboard/transport', text: 'Navigating to Transport Dashboard...' };
  
  if (query.match(/hostel room/)) return { route: '/dashboard/hostel-rooms', text: 'Navigating to Hostel Rooms...' };
  if (query.match(/hostel allotment|room allotment/)) return { route: '/dashboard/hostel-allotment', text: 'Opening Hostel Allotment...' };
  if (query.match(/hostel|dorm/)) return { route: '/dashboard/hostel', text: 'Navigating to Hostel Management...' };
  
  if (query.match(/mess schedule|mess menu/)) return { route: '/dashboard/mess-menu', text: 'Navigating to Mess Schedule...' };
  if (query.match(/mess attendance/)) return { route: '/dashboard/mess-attendance', text: 'Navigating to Mess Attendance...' };
  if (query.match(/mess|canteen/)) return { route: '/dashboard/mess-overview', text: 'Navigating to Mess Overview...' };

  // --- Reports ---
  if (query.match(/transport report|fleet audit|vehicle log/)) return { route: '/dashboard/reports/transport', text: 'Opening Transport Reports...' };
  if (query.match(/hostel report|mess audit|dining log/)) return { route: '/dashboard/reports/hostel', text: 'Opening Hostel & Dining Reports...' };
  if (query.match(/attendance report|leave report|absentee audit/)) return { route: '/dashboard/reports/attendance', text: 'Opening Attendance Reports...' };
  if (query.match(/inventory report|asset report|stock audit/)) return { route: '/dashboard/reports/inventory', text: 'Opening Asset & Inventory Reports...' };
  if (query.match(/academic report|grade report|academic audit/)) return { route: '/dashboard/reports/academic', text: 'Opening Academic Reports...' };
  if (query.match(/financial report|fee report|payroll report/)) return { route: '/dashboard/reports/financial', text: 'Opening Financial Reports...' };
  if (query.match(/report|analytic|audit/)) return { route: '/dashboard/reports', text: 'Navigating to the Advanced Reports Hub...' };

  // --- Settings & AI ---
  if (query.match(/asset ai|infrastructure health|maintenance/)) return { route: '/dashboard/asset-ai', text: 'Opening Infrastructure & Asset AI...' };
  if (query.match(/security ai|overwatch|compliance/)) return { route: '/dashboard/security-ai', text: 'Navigating to Neural Security Overwatch...' };
  if (query.match(/admissions ai|enrollment predict|lead audit/)) return { route: '/dashboard/admissions-ai', text: 'Opening Admissions & Enrollment AI...' };
  if (query.match(/curriculum ai|syllabus efficacy|course audit/)) return { route: '/dashboard/curriculum-ai', text: 'Navigating to Curriculum Efficacy AI...' };
  if (query.match(/ai hub|ai command|neural command/)) return { route: '/dashboard/ai-hub', text: 'Opening the Central AI Performance Hub...' };
  if (query.match(/financial performance|fiscal ai|money audit/)) return { route: '/dashboard/financial-ai', text: 'Navigating to Financial Performance AI...' };
  if (query.match(/faculty performance|teacher effectiveness/)) return { route: '/dashboard/faculty-ai', text: 'Opening Faculty Performance AI...' };
  if (query.match(/efficiency|institutional audit|optimization/)) return { route: '/dashboard/efficiency-ai', text: 'Navigating to Institutional Efficiency AI...' };
  if (query.match(/certificate/)) return { route: '/dashboard/certificates', text: 'Navigating to Certificates module...' };
  if (query.match(/performance|predict|institutional intelligence|performance intelligence/)) return { route: '/dashboard/performance', text: 'Opening Performance Predictions...' };
  if (query.match(/setting|configuration/)) return { route: '/dashboard/settings', text: 'Navigating to Institutional Settings...' };
  if (query.match(/ai|neural engine/)) return { route: '/dashboard/ai', text: 'Opening EduPro AI Dashboard...' };

  // Default Fallback
  return { route: null, text: null };
};
