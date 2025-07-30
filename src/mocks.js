// Mock data for all roles and portal content

// User database by role
const users = [
  {
    id: 1,
    email: 'leader@fpt.edu.vn',
    password: 'leader',
    role: 'leader',
    name: 'Leader User',
    status: 'Active',
    createdAt: '2024-01-01',
    lastLogin: '2024-05-01',
  },
  {
    id: 2,
    email: 'lecturer@fpt.edu.vn',
    password: 'lecturer',
    role: 'lecturer',
    name: 'Lecturer User',
    status: 'Active',
    createdAt: '2024-01-01',
    lastLogin: '2024-05-01',
  },
  {
    id: 3,
    email: 'admin@fpt.edu.vn',
    password: 'admin',
    role: 'admin',
    name: 'Admin User',
    status: 'Active',
    createdAt: '2024-01-01',
    lastLogin: '2024-05-01',
  },
  {
    id: 4,
    email: 'academic@fpt.edu.vn',
    password: 'academic',
    role: 'academic',
    name: 'Academic Affairs',
    status: 'Active',
    createdAt: '2024-01-01',
    lastLogin: '2024-05-01',
  },
  {
    id: 5,
    email: 'member@fpt.edu.vn',
    password: 'member',
    role: 'member',
    name: 'Member User',
    status: 'Active',
    createdAt: '2024-01-01',
    lastLogin: '2024-05-01',
  },
];

// Mock login function
export async function mockLogin(email, password) {
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password');
  return user;
}

// Mock group data
export const mockGroups = [
  {
    id: 1,
    name: 'Group 1',
    leader: 'leader@fpt.edu.vn',
    members: ['member@fpt.edu.vn'],
    lecturer: 'lecturer@fpt.edu.vn',
  },
  {
    id: 2,
    name: 'IoT Project Team',
    leader: 'leader@fpt.edu.vn',
    members: ['member@fpt.edu.vn'],
    lecturer: 'lecturer@fpt.edu.vn',
  },
  {
    id: 3,
    name: 'Advanced Robotics',
    leader: 'member@fpt.edu.vn',
    members: [],
    lecturer: 'lecturer@fpt.edu.vn',
  },
];

// Mock kits data
export const mockKits = [
  {
    id: 1,
    name: 'IoT Starter Kit',
    quantity: 5,
    price: 100000,
    status: 'AVAILABLE',
    description: 'A basic IoT kit for beginners with Arduino Uno, sensors, and breadboard.',
    category: 'Basic',
    location: 'Lab 1',
    lastMaintenance: '2024-01-01',
    nextMaintenance: '2024-06-01',
    components: [
      { name: 'Arduino Uno', quantity: 1, condition: 'New' },
      { name: 'Breadboard', quantity: 1, condition: 'New' },
      { name: 'LEDs', quantity: 10, condition: 'New' },
      { name: 'Resistors', quantity: 20, condition: 'New' },
    ],
  },
  {
    id: 2,
    name: 'Advanced IoT Kit',
    quantity: 2,
    price: 200000,
    status: 'IN-USE',
    description: 'Advanced kit for IoT projects with Raspberry Pi and multiple sensors.',
    category: 'Advanced',
    location: 'Lab 2',
    lastMaintenance: '2024-02-01',
    nextMaintenance: '2024-07-01',
    components: [
      { name: 'Raspberry Pi', quantity: 1, condition: 'Used' },
      { name: 'Sensors', quantity: 5, condition: 'New' },
      { name: 'Camera Module', quantity: 1, condition: 'New' },
      { name: 'WiFi Module', quantity: 1, condition: 'New' },
    ],
  },
  {
    id: 3,
    name: 'Professional IoT Kit',
    quantity: 1,
    price: 500000,
    status: 'AVAILABLE',
    description: 'Professional grade IoT kit for advanced projects and research.',
    category: 'Professional',
    location: 'Lab 3',
    lastMaintenance: '2024-03-01',
    nextMaintenance: '2024-08-01',
    components: [
      { name: 'ESP32', quantity: 2, condition: 'New' },
      { name: 'OLED Display', quantity: 1, condition: 'New' },
      { name: 'Motor Driver', quantity: 1, condition: 'New' },
      { name: 'GPS Module', quantity: 1, condition: 'New' },
    ],
  },
  {
    id: 4,
    name: 'Robotics Kit',
    quantity: 3,
    price: 300000,
    status: 'DAMAGED',
    description: 'Complete robotics kit with motors, chassis, and control system.',
    category: 'Advanced',
    location: 'Lab 1',
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-06-15',
    components: [
      { name: 'DC Motors', quantity: 4, condition: 'Used' },
      { name: 'Wheels', quantity: 4, condition: 'Used' },
      { name: 'Chassis', quantity: 1, condition: 'Damaged' },
      { name: 'Battery Pack', quantity: 1, condition: 'Used' },
    ],
  },
];

// Mock wallet data
export const mockWallet = {
  balance: 500000,
  transactions: [
    { type: 'Deposit', amount: 100000, date: '2024-04-01' },
    { type: 'Rental', amount: -100000, date: '2024-04-02' },
  ],
};

// Mock notifications for admin
export const mockNotifications = [
  { message: 'New rental request submitted', date: '2024-05-01' },
  { message: 'Refund request pending', date: '2024-05-02' },
  { message: 'Kit maintenance due', date: '2024-05-03' },
  { message: 'New user registration', date: '2024-05-04' },
];

// Mock report for admin
export const mockReport = {
  totalKits: 10,
  inUse: 3,
  overdue: 1,
  totalUsers: 150,
  activeRentals: 8,
  pendingApprovals: 5,
};

// Mock assignments for academic
export const mockAssignments = [
  { lecturerId: 'lecturer@fpt.edu.vn', classId: 'CSE101', semesterId: '2024A' },
];

// Mock users for AdminPortal user management
export const mockUsers = users;

// Mock rental requests for admin approval
export const mockRentalRequests = [
  {
    id: 1,
    userId: 3,
    userName: 'Student User',
    userEmail: 'student@fpt.edu.vn',
    userRole: 'student',
    kitId: 1,
    kitName: 'IoT Starter Kit',
    duration: 7,
    startDate: '2024-05-10',
    endDate: '2024-05-17',
    totalCost: 70000,
    status: 'PENDING_APPROVAL',
    requestDate: '2024-05-01',
    reason: 'For IoT project assignment',
    purpose: 'Academic project',
    approvedBy: null,
    approvalDate: null,
  },
  {
    id: 2,
    userId: 8,
    userName: 'John Doe',
    userEmail: 'john.doe@fpt.edu.vn',
    userRole: 'student',
    kitId: 2,
    kitName: 'Advanced IoT Kit',
    duration: 14,
    startDate: '2024-05-15',
    endDate: '2024-05-29',
    totalCost: 280000,
    status: 'APPROVED',
    requestDate: '2024-05-02',
    reason: 'Research project on smart home automation',
    purpose: 'Research',
    approvedBy: 'admin@fpt.edu.vn',
    approvalDate: '2024-05-03',
  },
  {
    id: 3,
    userId: 9,
    userName: 'Jane Smith',
    userEmail: 'jane.smith@fpt.edu.vn',
    userRole: 'lecturer',
    kitId: 3,
    kitName: 'Professional IoT Kit',
    duration: 30,
    startDate: '2024-05-20',
    endDate: '2024-06-19',
    totalCost: 500000,
    status: 'BORROWED',
    requestDate: '2024-05-03',
    reason: 'Advanced IoT course development',
    purpose: 'Teaching',
    approvedBy: 'admin@fpt.edu.vn',
    approvalDate: '2024-05-04',
  },
  {
    id: 4,
    userId: 4,
    userName: 'Leader User',
    userEmail: 'leader@fpt.edu.vn',
    userRole: 'leader',
    kitId: 1,
    kitName: 'IoT Starter Kit',
    duration: 5,
    startDate: '2024-05-25',
    endDate: '2024-05-30',
    totalCost: 50000,
    status: 'PENDING_APPROVAL',
    requestDate: '2024-05-04',
    reason: 'Group project demonstration',
    purpose: 'Academic project',
    approvedBy: null,
    approvalDate: null,
  },
  {
    id: 5,
    userId: 7,
    userName: 'Parent User',
    userEmail: 'parent@fpt.edu.vn',
    userRole: 'parent',
    kitId: 4,
    kitName: 'Robotics Kit',
    duration: 10,
    startDate: '2024-05-30',
    endDate: '2024-06-09',
    totalCost: 300000,
    status: 'REJECTED',
    requestDate: '2024-05-05',
    reason: 'Kit currently under maintenance',
    purpose: 'Personal project',
    approvedBy: 'admin@fpt.edu.vn',
    approvalDate: '2024-05-06',
  },
];

// Mock refund requests for admin approval
export const mockRefundRequests = [
  {
    id: 1,
    userId: 3,
    userEmail: 'student@fpt.edu.vn',
    userRole: 'student',
    rentalId: 2,
    kitName: 'Advanced IoT Kit',
    originalAmount: 280000,
    refundAmount: 280000,
    refundReason: 'Project completed early, returning kit ahead of schedule',
    requestDate: '2024-05-10',
    refundDate: '2024-05-12',
    dueDate: '2024-05-29',
    status: 'pending',
    damageAssessment: null,
    approvedBy: null,
    approvalDate: null,
    qrCode: null,
  },
  {
    id: 2,
    userId: 8,
    userEmail: 'john.doe@fpt.edu.vn',
    userRole: 'student',
    rentalId: 3,
    kitName: 'Professional IoT Kit',
    originalAmount: 500000,
    refundAmount: 450000,
    refundReason: 'Kit returned with minor damage to one component',
    requestDate: '2024-05-15',
    refundDate: '2024-05-18',
    dueDate: '2024-06-19',
    status: 'approved',
    damageAssessment: {
      'ESP32': { damaged: 1, value: 100000 },
      'OLED Display': { damaged: 0, value: 50000 },
    },
    approvedBy: 'admin@fpt.edu.vn',
    approvalDate: '2024-05-19',
    qrCode: 'REFUND-2024-001',
  },
  {
    id: 3,
    userId: 9,
    userEmail: 'jane.smith@fpt.edu.vn',
    userRole: 'lecturer',
    rentalId: 4,
    kitName: 'IoT Starter Kit',
    originalAmount: 50000,
    refundAmount: 0,
    refundReason: 'Kit returned late with significant damage',
    requestDate: '2024-05-20',
    refundDate: '2024-06-05',
    dueDate: '2024-05-30',
    status: 'rejected',
    damageAssessment: {
      'Arduino Uno': { damaged: 1, value: 80000 },
      'Breadboard': { damaged: 1, value: 20000 },
    },
    approvedBy: 'admin@fpt.edu.vn',
    approvalDate: '2024-05-21',
    qrCode: null,
  },
  {
    id: 4,
    userId: 4,
    userEmail: 'leader@fpt.edu.vn',
    userRole: 'leader',
    rentalId: 5,
    kitName: 'Robotics Kit',
    originalAmount: 300000,
    refundAmount: 300000,
    refundReason: 'Project cancelled due to technical issues',
    requestDate: '2024-05-25',
    refundDate: '2024-05-26',
    dueDate: '2024-06-09',
    status: 'pending',
    damageAssessment: null,
    approvedBy: null,
    approvalDate: null,
    qrCode: null,
  },
];

// Mock role permissions for access control
export const mockRolePermissions = {
  admin: {
    canCreateUsers: true,
    canDeleteUsers: true,
    canEditUsers: true,
    canManageKits: true,
    canApproveRentals: true,
    canApproveRefunds: true,
    canViewReports: true,
    canManageGroups: true,
    canAccessAdminPortal: true,
  },
  lecturer: {
    canCreateUsers: false,
    canDeleteUsers: false,
    canEditUsers: false,
    canManageKits: false,
    canApproveRentals: false,
    canApproveRefunds: false,
    canViewReports: true,
    canManageGroups: true,
    canAccessAdminPortal: false,
  },
  student: {
    canCreateUsers: false,
    canDeleteUsers: false,
    canEditUsers: false,
    canManageKits: false,
    canApproveRentals: false,
    canApproveRefunds: false,
    canViewReports: false,
    canManageGroups: false,
    canAccessAdminPortal: false,
  },
  leader: {
    canCreateUsers: false,
    canDeleteUsers: false,
    canEditUsers: false,
    canManageKits: false,
    canApproveRentals: false,
    canApproveRefunds: false,
    canViewReports: false,
    canManageGroups: true,
    canAccessAdminPortal: false,
  },
  academic: {
    canCreateUsers: true,
    canDeleteUsers: false,
    canEditUsers: true,
    canManageKits: false,
    canApproveRentals: false,
    canApproveRefunds: false,
    canViewReports: true,
    canManageGroups: false,
    canAccessAdminPortal: false,
  },
  member: {
    canCreateUsers: false,
    canDeleteUsers: false,
    canEditUsers: false,
    canManageKits: false,
    canApproveRentals: false,
    canApproveRefunds: false,
    canViewReports: false,
    canManageGroups: false,
    canAccessAdminPortal: false,
  },
  parent: {
    canCreateUsers: false,
    canDeleteUsers: false,
    canEditUsers: false,
    canManageKits: false,
    canApproveRentals: false,
    canApproveRefunds: false,
    canViewReports: false,
    canManageGroups: false,
    canAccessAdminPortal: false,
  },
};

// Mock system statistics for admin dashboard
export const mockSystemStats = {
  totalUsers: 150,
  activeUsers: 120,
  totalKits: 25,
  availableKits: 15,
  rentedKits: 8,
  damagedKits: 2,
  totalRentals: 45,
  pendingApprovals: 5,
  totalRevenue: 2500000,
  monthlyRevenue: 500000,
  popularKits: [
    { name: 'IoT Starter Kit', rentals: 15 },
    { name: 'Advanced IoT Kit', rentals: 12 },
    { name: 'Robotics Kit', rentals: 8 },
  ],
  recentActivity: [
    { action: 'New rental request', user: 'student@fpt.edu.vn', time: '2024-05-01 10:30' },
    { action: 'Kit returned', user: 'lecturer@fpt.edu.vn', time: '2024-05-01 09:15' },
    { action: 'Refund approved', user: 'admin@fpt.edu.vn', time: '2024-05-01 08:45' },
    { action: 'New user registered', user: 'john.doe@fpt.edu.vn', time: '2024-05-01 08:30' },
  ],
};

// Mock maintenance schedule
export const mockMaintenanceSchedule = [
  {
    id: 1,
    kitId: 1,
    kitName: 'IoT Starter Kit',
    lastMaintenance: '2024-01-01',
    nextMaintenance: '2024-06-01',
    status: 'Scheduled',
    technician: 'Tech Team A',
    notes: 'Regular maintenance check',
  },
  {
    id: 2,
    kitId: 2,
    kitName: 'Advanced IoT Kit',
    lastMaintenance: '2024-02-01',
    nextMaintenance: '2024-07-01',
    status: 'Scheduled',
    technician: 'Tech Team B',
    notes: 'Component replacement needed',
  },
  {
    id: 3,
    kitId: 4,
    kitName: 'Robotics Kit',
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-06-15',
    status: 'In Progress',
    technician: 'Tech Team A',
    notes: 'Chassis repair in progress',
  },
];

// You can expand these mocks as needed for each portal/component.

// Mock academic data for Academic Affairs Portal
export const mockSemesters = [
  {
    id: 1,
    name: 'Fall 2024',
    startDate: '2024-09-01',
    endDate: '2024-12-20',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Spring 2025',
    startDate: '2025-01-15',
    endDate: '2025-05-10',
    status: 'Upcoming'
  },
  {
    id: 3,
    name: 'Summer 2024',
    startDate: '2024-06-01',
    endDate: '2024-08-15',
    status: 'Completed'
  }
];

export const mockStudents = [
  {
    id: 1,
    studentId: 'SE123456',
    name: 'Nguyen Van A',
    email: 'student1@fpt.edu.vn',
    major: 'Software Engineering',
    status: 'Active',
    enrollmentDate: '2024-09-01'
  },
  {
    id: 2,
    studentId: 'SE123457',
    name: 'Tran Thi B',
    email: 'student2@fpt.edu.vn',
    major: 'Software Engineering',
    status: 'Active',
    enrollmentDate: '2024-09-01'
  },
  {
    id: 3,
    studentId: 'AI123458',
    name: 'Le Van C',
    email: 'student3@fpt.edu.vn',
    major: 'Artificial Intelligence',
    status: 'Active',
    enrollmentDate: '2024-09-01'
  },
  {
    id: 4,
    studentId: 'AI123459',
    name: 'Pham Thi D',
    email: 'student4@fpt.edu.vn',
    major: 'Artificial Intelligence',
    status: 'Active',
    enrollmentDate: '2024-09-01'
  },
  {
    id: 5,
    studentId: 'IT123460',
    name: 'Hoang Van E',
    email: 'student5@fpt.edu.vn',
    major: 'Information Technology',
    status: 'Active',
    enrollmentDate: '2024-09-01'
  }
];

export const mockLecturers = [
  {
    id: 1,
    name: 'Dr. Nguyen Van Lecturer',
    email: 'lecturer@fpt.edu.vn',
    department: 'Software Engineering',
    specialization: 'Web Development',
    status: 'Active',
    hireDate: '2020-01-15'
  },
  {
    id: 2,
    name: 'Dr. Tran Thi Professor',
    email: 'professor@fpt.edu.vn',
    department: 'Artificial Intelligence',
    specialization: 'Machine Learning',
    status: 'Active',
    hireDate: '2019-03-20'
  },
  {
    id: 3,
    name: 'Dr. Le Van Assistant',
    email: 'assistant@fpt.edu.vn',
    department: 'Information Technology',
    specialization: 'Database Systems',
    status: 'Active',
    hireDate: '2021-08-10'
  }
];

export const mockClasses = [
  {
    id: 1,
    name: 'Web Development Fundamentals',
    semesterId: 1,
    semesterName: 'Fall 2024',
    lecturerId: 1,
    lecturerName: 'Dr. Nguyen Van Lecturer',
    capacity: 30,
    enrolledCount: 25,
    status: 'Active'
  },
  {
    id: 2,
    name: 'Machine Learning Basics',
    semesterId: 1,
    semesterName: 'Fall 2024',
    lecturerId: 2,
    lecturerName: 'Dr. Tran Thi Professor',
    capacity: 25,
    enrolledCount: 20,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Database Design',
    semesterId: 1,
    semesterName: 'Fall 2024',
    lecturerId: 3,
    lecturerName: 'Dr. Le Van Assistant',
    capacity: 35,
    enrolledCount: 30,
    status: 'Active'
  },
  {
    id: 4,
    name: 'Advanced Web Development',
    semesterId: 2,
    semesterName: 'Spring 2025',
    lecturerId: 1,
    lecturerName: 'Dr. Nguyen Van Lecturer',
    capacity: 25,
    enrolledCount: 0,
    status: 'Upcoming'
  }
];

export const mockEnrollments = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Nguyen Van A',
    classId: 1,
    className: 'Web Development Fundamentals',
    semesterId: 1,
    semesterName: 'Fall 2024',
    enrollmentDate: '2024-09-01',
    status: 'Enrolled'
  },
  {
    id: 2,
    studentId: 2,
    studentName: 'Tran Thi B',
    classId: 1,
    className: 'Web Development Fundamentals',
    semesterId: 1,
    semesterName: 'Fall 2024',
    enrollmentDate: '2024-09-01',
    status: 'Enrolled'
  },
  {
    id: 3,
    studentId: 3,
    studentName: 'Le Van C',
    classId: 2,
    className: 'Machine Learning Basics',
    semesterId: 1,
    semesterName: 'Fall 2024',
    enrollmentDate: '2024-09-01',
    status: 'Enrolled'
  },
  {
    id: 4,
    studentId: 4,
    studentName: 'Pham Thi D',
    classId: 2,
    className: 'Machine Learning Basics',
    semesterId: 1,
    semesterName: 'Fall 2024',
    enrollmentDate: '2024-09-01',
    status: 'Enrolled'
  },
  {
    id: 5,
    studentId: 5,
    studentName: 'Hoang Van E',
    classId: 3,
    className: 'Database Design',
    semesterId: 1,
    semesterName: 'Fall 2024',
    enrollmentDate: '2024-09-01',
    status: 'Enrolled'
  }
];

export const mockAcademicAssignments = [
  {
    id: 1,
    lecturerId: 1,
    lecturerName: 'Dr. Nguyen Van Lecturer',
    classId: 1,
    className: 'Web Development Fundamentals',
    semesterId: 1,
    semesterName: 'Fall 2024',
    assignmentDate: '2024-08-15',
    status: 'Active'
  },
  {
    id: 2,
    lecturerId: 2,
    lecturerName: 'Dr. Tran Thi Professor',
    classId: 2,
    className: 'Machine Learning Basics',
    semesterId: 1,
    semesterName: 'Fall 2024',
    assignmentDate: '2024-08-15',
    status: 'Active'
  },
  {
    id: 3,
    lecturerId: 3,
    lecturerName: 'Dr. Le Van Assistant',
    classId: 3,
    className: 'Database Design',
    semesterId: 1,
    semesterName: 'Fall 2024',
    assignmentDate: '2024-08-15',
    status: 'Active'
  },
  {
    id: 4,
    lecturerId: 1,
    lecturerName: 'Dr. Nguyen Van Lecturer',
    classId: 4,
    className: 'Advanced Web Development',
    semesterId: 2,
    semesterName: 'Spring 2025',
    assignmentDate: '2024-12-01',
    status: 'Scheduled'
  }
];

export const mockLogs = [
  {
    id: 1,
    timestamp: '2024-01-15 09:30:00',
    user: 'academic@fpt.edu.vn',
    action: 'Created Semester',
    details: 'Fall 2024 semester created',
    status: 'Success'
  },
  {
    id: 2,
    timestamp: '2024-01-15 10:15:00',
    user: 'academic@fpt.edu.vn',
    action: 'Added Student',
    details: 'Student Nguyen Van A (SE123456) added',
    status: 'Success'
  },
  {
    id: 3,
    timestamp: '2024-01-15 11:00:00',
    user: 'academic@fpt.edu.vn',
    action: 'Assigned Lecturer',
    details: 'Dr. Nguyen Van Lecturer assigned to Web Development Fundamentals',
    status: 'Success'
  },
  {
    id: 4,
    timestamp: '2024-01-15 14:30:00',
    user: 'academic@fpt.edu.vn',
    action: 'Enrolled Student',
    details: 'Student Nguyen Van A enrolled in Web Development Fundamentals',
    status: 'Success'
  },
  {
    id: 5,
    timestamp: '2024-01-16 08:45:00',
    user: 'academic@fpt.edu.vn',
    action: 'Updated Class',
    details: 'Machine Learning Basics capacity increased to 25',
    status: 'Success'
  },
  {
    id: 6,
    timestamp: '2024-01-16 15:20:00',
    user: 'academic@fpt.edu.vn',
    action: 'Deleted Student',
    details: 'Student John Doe (SE123999) removed',
    status: 'Success'
  }
]; 