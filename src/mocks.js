// MSW setup for mocking API endpoints
import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';

// Example handlers (expand as needed)
export const handlers = [
  // Mock login endpoint
  http.post('/api/login', async ({ request }) => {
    const { email, password } = await request.json();
    if (email && email.endsWith('@fpt.edu.vn')) {
      if (email === 'leader@fpt.edu.vn') {
        return HttpResponse.json({
          token: 'mock-token',
          user: { email, role: 'leader' },
        }, { status: 200 });
      }
      if (email === 'admin@fpt.edu.vn') {
        return HttpResponse.json({
          token: 'mock-token',
          user: { email, role: 'admin' },
        }, { status: 200 });
      }
      if (email.includes('lecturer')) {
        return HttpResponse.json({
          token: 'mock-token',
          user: { email, role: 'lecturer' },
        }, { status: 200 });
      }
      if (email.includes('academic')) {
        return HttpResponse.json({
          token: 'mock-token',
          user: { email, role: 'academic' },
        }, { status: 200 });
      }
      if ([
        'member1@fpt.edu.vn',
        'member2@fpt.edu.vn',
        'member3@fpt.edu.vn',
      ].includes(email)) {
        return HttpResponse.json({
          token: 'mock-token',
          user: { email, role: 'member' },
        }, { status: 200 });
      }
      return HttpResponse.json({
        token: 'mock-token',
        user: { email, role: 'student' },
      }, { status: 200 });
    }
    return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }),
];

let mockGroups = [
  {
    name: 'IOT Group 2',
    leader: 'leader2@fpt.edu.vn',
    lecturer: 'lecturer2@fpt.edu.vn',
    members: ['singlemember@fpt.edu.vn'],
  },
  {
    name: 'IOT Group 3',
    leader: 'leader3@fpt.edu.vn',
    lecturer: 'lecturer3@fpt.edu.vn',
    members: ['studentx@fpt.edu.vn'],
  },
];
let groupIdCounter = 1;

handlers.push(
  // Create group
  http.post('/api/groups', async ({ request }) => {
    const { name } = await request.json();
    if (!name) {
      return HttpResponse.json({ message: 'Group name required' }, { status: 400 });
    }
    const group = {
      id: groupIdCounter++,
      name,
      leader: 'leader@fpt.edu.vn',
      members: ['student1@fpt.edu.vn'],
      code: Math.random().toString(36).substring(2, 8),
    };
    mockGroups.push(group);
    return HttpResponse.json({ group }, { status: 201 });
  }),

  // Join group
  http.post('/api/groups/join', async ({ request }) => {
    const { code } = await request.json();
    const group = mockGroups.find(g => g.code === code);
    if (!group) {
      return HttpResponse.json({ message: 'Group not found' }, { status: 404 });
    }
    if (!group.members.includes('student2@fpt.edu.vn')) {
      group.members.push('student2@fpt.edu.vn');
    }
    return HttpResponse.json({ group }, { status: 200 });
  })
);

let mockWallet = {
  balance: 100000,
  transactions: [
    { type: 'deposit', amount: 100000, date: new Date().toLocaleString() },
  ],
};

handlers.push(
  // Get wallet
  http.get('/api/wallet', () => {
    return HttpResponse.json({ wallet: mockWallet }, { status: 200 });
  }),
  // Deposit
  http.post('/api/wallet/deposit', () => {
    mockWallet.balance += 100000;
    mockWallet.transactions.unshift({
      type: 'deposit', amount: 100000, date: new Date().toLocaleString(),
    });
    return HttpResponse.json({ wallet: mockWallet }, { status: 200 });
  }),
  // Penalty
  http.post('/api/wallet/penalty', () => {
    mockWallet.balance -= 10000;
    mockWallet.transactions.unshift({
      type: 'penalty', amount: 10000, date: new Date().toLocaleString(),
    });
    return HttpResponse.json({ wallet: mockWallet }, { status: 200 });
  })
);

let mockKits = [
  { 
    id: 1, 
    name: 'Standard IoT Kit', 
    quantity: 10, 
    status: 'AVAILABLE', 
    price: 50000,
    description: 'Basic IoT development kit with Arduino Uno, breadboard, and essential sensors',
    components: [
      { name: 'Arduino Uno R3', quantity: 1, condition: 'New' },
      { name: 'Breadboard 830 points', quantity: 1, condition: 'New' },
      { name: 'Jumper wires (40 pieces)', quantity: 1, condition: 'New' },
      { name: 'LED (5 pieces)', quantity: 1, condition: 'New' },
      { name: 'Resistors (220Ω, 10 pieces)', quantity: 1, condition: 'New' },
      { name: 'Temperature sensor (DHT11)', quantity: 1, condition: 'New' },
      { name: 'Motion sensor (PIR)', quantity: 1, condition: 'New' }
    ],
    category: 'Basic',
    location: 'Lab A - Shelf 1',
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-07-15'
  },
  { 
    id: 2, 
    name: 'Advanced IoT Kit', 
    quantity: 2, 
    status: 'IN-USE', 
    price: 120000,
    description: 'Advanced IoT kit with ESP32, multiple sensors, and wireless capabilities',
    components: [
      { name: 'ESP32 Development Board', quantity: 1, condition: 'Good' },
      { name: 'OLED Display (128x64)', quantity: 1, condition: 'Good' },
      { name: 'GPS Module (NEO-6M)', quantity: 1, condition: 'Good' },
      { name: 'WiFi Module', quantity: 1, condition: 'Good' },
      { name: 'Bluetooth Module (HC-05)', quantity: 1, condition: 'Good' },
      { name: 'Soil Moisture Sensor', quantity: 1, condition: 'Good' },
      { name: 'Water Level Sensor', quantity: 1, condition: 'Good' },
      { name: 'Relay Module (4-channel)', quantity: 1, condition: 'Good' }
    ],
    category: 'Advanced',
    location: 'Lab B - Shelf 2',
    lastMaintenance: '2024-02-20',
    nextMaintenance: '2024-08-20'
  },
  { 
    id: 3, 
    name: 'Sensor Kit Pro', 
    quantity: 5, 
    status: 'AVAILABLE', 
    price: 80000,
    description: 'Professional sensor kit with high-precision sensors for research projects',
    components: [
      { name: 'High-precision Temperature Sensor (DS18B20)', quantity: 2, condition: 'New' },
      { name: 'Humidity Sensor (SHT30)', quantity: 1, condition: 'New' },
      { name: 'Pressure Sensor (BMP280)', quantity: 1, condition: 'New' },
      { name: 'Light Sensor (BH1750)', quantity: 1, condition: 'New' },
      { name: 'Sound Sensor (MAX9814)', quantity: 1, condition: 'New' },
      { name: 'Gas Sensor (MQ-2)', quantity: 1, condition: 'New' },
      { name: 'Accelerometer (MPU6050)', quantity: 1, condition: 'New' }
    ],
    category: 'Professional',
    location: 'Lab C - Shelf 3',
    lastMaintenance: '2024-03-10',
    nextMaintenance: '2024-09-10'
  },
];
let kitIdCounter = 3;

handlers.push(
  // List kits
  http.get('/api/kits', () => HttpResponse.json({ kits: mockKits }, { status: 200 })),
  
  // Add kit
  http.post('/api/kits', async ({ request }) => {
    const { name, quantity } = await request.json();
    if (!name || !quantity) {
      return HttpResponse.json({ message: 'Name and quantity required' }, { status: 400 });
    }
    const kit = { id: kitIdCounter++, name, quantity, status: 'AVAILABLE' };
    mockKits.push(kit);
    return HttpResponse.json({ kits: mockKits }, { status: 201 });
  }),

  // Update kit status
  http.post('/api/kits/:id/status', async ({ params, request }) => {
    const { id } = params;
    const { status } = await request.json();
    const kit = mockKits.find(k => k.id === Number(id));
    if (!kit) {
      return HttpResponse.json({ message: 'Kit not found' }, { status: 404 });
    }
    kit.status = status;
    return HttpResponse.json({ kits: mockKits }, { status: 200 });
  })
);

handlers.push(
  http.post('/api/kits/choose', async ({ request }) => {
    const { kitName } = await request.json();
    const kit = mockKits.find(k => k.name === kitName);
    if (!kit) {
      return HttpResponse.json({ message: 'Kit not found' }, { status: 404 });
    }
    if (kit.quantity < 1) {
      return HttpResponse.json({ message: 'Kit not available' }, { status: 400 });
    }
    kit.quantity -= 1;
    return HttpResponse.json({ kits: mockKits, message: 'Kit chosen successfully' }, { status: 200 });
  })
);

let mockSemesters = [
  { id: 1, name: 'Spring 2024' },
  { id: 2, name: 'Fall 2024' },
];
let semesterIdCounter = 3;
let mockClasses = {
  1: [{ id: 1, name: 'IOT101' }],
  2: [{ id: 2, name: 'IOT201' }],
};
let classIdCounter = 3;

handlers.push(
  // List semesters
  http.get('/api/semesters', () => HttpResponse.json({ semesters: mockSemesters }, { status: 200 })),

  // Add semester
  http.post('/api/semesters', async ({ request }) => {
    const { name } = await request.json();
    if (!name) {
      return HttpResponse.json({ message: 'Semester name required' }, { status: 400 });
    }
    const semester = { id: semesterIdCounter++, name };
    mockSemesters.push(semester);
    return HttpResponse.json({ semesters: mockSemesters }, { status: 201 });
  }),

  // List classes in a semester
  http.get('/api/semesters/:semesterId/classes', ({ params }) => {
    const { semesterId } = params;
    return HttpResponse.json({ classes: mockClasses[semesterId] || [] }, { status: 200 });
  }),

  // Add class to a semester
  http.post('/api/semesters/:semesterId/classes', async ({ params, request }) => {
    const { semesterId } = params;
    const { name } = await request.json();
    if (!name) {
      return HttpResponse.json({ message: 'Class name required' }, { status: 400 });
    }
    const newClass = { id: classIdCounter++, name };
    if (!mockClasses[semesterId]) mockClasses[semesterId] = [];
    mockClasses[semesterId].push(newClass);
    return HttpResponse.json({ classes: mockClasses[semesterId] }, { status: 201 });
  })
);

handlers.push(
  // Notifications
  http.get('/api/notifications', () => HttpResponse.json({
    notifications: [
      { message: 'Kit IOT101 is overdue', date: '2024-06-01' },
      { message: 'Penalty applied to Group 2', date: '2024-06-02' },
      { message: 'New kit added: Advanced Kit', date: '2024-06-03' },
    ],
  }, { status: 200 })),

  // Usage report
  http.get('/api/report', () => HttpResponse.json({
    report: { totalKits: 12, inUse: 3, overdue: 1 },
  }, { status: 200 }))
);

// Mock endpoint for lecturer Excel import
handlers.push(
  http.post('/api/lecturer/import', async ({ request }) => {
    // Simulate file check
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return HttpResponse.json({ message: 'Invalid file upload' }, { status: 400 });
    }
    // Simulate success
    return HttpResponse.json({ message: 'Excel file imported successfully (mock).' }, { status: 200 });
  })
);

handlers.push(
  http.get('/api/groups/student', ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    // Mock group: leader is leader@fpt.edu.vn, members are member1, member2, member3
    const group = {
      name: 'IOT Group 1',
      leader: 'leader@fpt.edu.vn',
      lecturer: 'lecturer1@fpt.edu.vn',
      members: [
        'member1@fpt.edu.vn',
        'member2@fpt.edu.vn',
        'member3@fpt.edu.vn',
      ],
    };
    if (email === 'leader@fpt.edu.vn' || group.members.includes(email)) {
      return HttpResponse.json({ group }, { status: 200 });
    }
    return HttpResponse.json({ group: null }, { status: 200 });
  })
);

handlers.push(
  http.get('/api/kits/available', () => {
    // Mock available kits
    return HttpResponse.json({
      kits: mockKits.filter(k => k.status === 'AVAILABLE').map(k => ({ name: k.name, quantity: k.quantity, price: k.price, status: k.status })),
    }, { status: 200 });
  })
);

handlers.push(
  http.get('/api/groups/all', () => {
    // Return all groups (use mockGroups and the hardcoded group)
    const groups = [
      {
        name: 'IOT Group 1',
        leader: 'leader@fpt.edu.vn',
        lecturer: 'lecturer1@fpt.edu.vn',
        members: [
          'member1@fpt.edu.vn',
          'member2@fpt.edu.vn',
          'member3@fpt.edu.vn',
        ],
      },
      ...mockGroups,
    ];
    return HttpResponse.json({ groups }, { status: 200 });
  })
);

handlers.push(
  http.post('/api/groups/move-member', async ({ request }) => {
    const { memberEmail, fromGroup, toGroup } = await request.json();
    let moved = false;
    // Try to move in hardcoded group
    if (fromGroup === 'IOT Group 1') {
      const idx = mockGroups.findIndex(g => g.name === toGroup);
      if (idx !== -1) {
        // Remove from hardcoded group
        // (simulate by not actually mutating the hardcoded group)
        // Add to mockGroups group
        if (!mockGroups[idx].members.includes(memberEmail)) {
          mockGroups[idx].members.push(memberEmail);
          moved = true;
        }
      }
    } else {
      // Move between mockGroups
      const fromIdx = mockGroups.findIndex(g => g.name === fromGroup);
      const toIdx = mockGroups.findIndex(g => g.name === toGroup);
      if (fromIdx !== -1 && toIdx !== -1) {
        const memberIdx = mockGroups[fromIdx].members.indexOf(memberEmail);
        if (memberIdx !== -1) {
          mockGroups[fromIdx].members.splice(memberIdx, 1);
          if (!mockGroups[toIdx].members.includes(memberEmail)) {
            mockGroups[toIdx].members.push(memberEmail);
            moved = true;
          }
        }
      }
    }
    if (moved) {
      return HttpResponse.json({ success: true, groups: [
        {
          name: 'IOT Group 1',
          leader: 'leader@fpt.edu.vn',
          lecturer: 'lecturer1@fpt.edu.vn',
          members: [
            'member1@fpt.edu.vn',
            'member2@fpt.edu.vn',
            'member3@fpt.edu.vn',
          ],
        },
        ...mockGroups,
      ] }, { status: 200 });
    } else {
      return HttpResponse.json({ success: false, message: 'Move failed' }, { status: 400 });
    }
  })
);

handlers.push(
  http.post('/api/groups/add-member', async ({ request }) => {
    const { groupName, memberEmail } = await request.json();
    let updated = false;
    let error = '';
    if (groupName === 'IOT Group 1') {
      return HttpResponse.json({ success: false, message: 'Cannot add to this group in mock.' }, { status: 400 });
    } else {
      const group = mockGroups.find(g => g.name === groupName);
      if (group) {
        if (group.members.length >= 4) {
          error = 'Group already has maximum 4 members.';
        } else if (!group.members.includes(memberEmail)) {
          group.members.push(memberEmail);
          updated = true;
        }
      }
    }
    if (updated) {
      return HttpResponse.json({ success: true, groups: [
        {
          name: 'IOT Group 1',
          leader: 'leader@fpt.edu.vn',
          lecturer: 'lecturer1@fpt.edu.vn',
          members: [
            'member1@fpt.edu.vn',
            'member2@fpt.edu.vn',
            'member3@fpt.edu.vn',
          ],
        },
        ...mockGroups,
      ] }, { status: 200 });
    } else {
      return HttpResponse.json({ success: false, message: error || 'Add member failed' }, { status: 400 });
    }
  })
);

handlers.push(
  http.post('/api/groups/remove-member', async ({ request }) => {
    const { groupName, memberEmail } = await request.json();
    let updated = false;
    if (groupName === 'IOT Group 1') {
      return HttpResponse.json({ success: false, message: 'Cannot remove from this group in mock.' }, { status: 400 });
    } else {
      const group = mockGroups.find(g => g.name === groupName);
      if (group && group.leader !== memberEmail) {
        const idx = group.members.indexOf(memberEmail);
        if (idx !== -1) {
          group.members.splice(idx, 1);
          updated = true;
        }
      }
    }
    if (updated) {
      return HttpResponse.json({ success: true, groups: [
        {
          name: 'IOT Group 1',
          leader: 'leader@fpt.edu.vn',
          lecturer: 'lecturer1@fpt.edu.vn',
          members: [
            'member1@fpt.edu.vn',
            'member2@fpt.edu.vn',
            'member3@fpt.edu.vn',
          ],
        },
        ...mockGroups,
      ] }, { status: 200 });
    } else {
      return HttpResponse.json({ success: false, message: 'Remove member failed' }, { status: 400 });
    }
  })
);

// Excel import endpoints for lecturers
handlers.push(
  http.post('/api/students/import', async ({ request }) => {
    const { students } = await request.json();
    if (!students || !Array.isArray(students)) {
      return HttpResponse.json({ message: 'Invalid students data' }, { status: 400 });
    }
    
    // Mock processing of imported students
    const processedCount = students.length;
    return HttpResponse.json({ 
      success: true, 
      message: `Successfully imported ${processedCount} students`,
      importedCount: processedCount 
    }, { status: 200 });
  })
);

handlers.push(
  http.post('/api/kits/import', async ({ request }) => {
    const { kits } = await request.json();
    if (!kits || !Array.isArray(kits)) {
      return HttpResponse.json({ message: 'Invalid kits data' }, { status: 400 });
    }
    
    // Mock processing of imported kits
    const processedCount = kits.length;
    return HttpResponse.json({ 
      success: true, 
      message: `Successfully imported ${processedCount} kits`,
      importedCount: processedCount 
    }, { status: 200 });
  })
);

// Academic Affairs API endpoints
let mockAcademicData = {
  semesters: [
    { id: 1, name: 'Spring 2024', startDate: '2024-01-15', endDate: '2024-05-15', status: 'Active' },
    { id: 2, name: 'Fall 2024', startDate: '2024-08-20', endDate: '2024-12-20', status: 'Upcoming' }
  ],
  classes: [
    { id: 1, name: 'IOT101 - Introduction to IoT', semesterId: 1, lecturerId: 1, capacity: 30, enrolledCount: 25, semesterName: 'Spring 2024', lecturerName: 'Dr. Smith' },
    { id: 2, name: 'IOT201 - Advanced IoT Development', semesterId: 1, lecturerId: 2, capacity: 25, enrolledCount: 20, semesterName: 'Spring 2024', lecturerName: 'Dr. Johnson' },
    { id: 3, name: 'IOT301 - IoT Security', semesterId: 2, lecturerId: 1, capacity: 20, enrolledCount: 0, semesterName: 'Fall 2024', lecturerName: 'Dr. Smith' }
  ],
  students: [
    { id: 1, studentId: 'STU001', name: 'John Doe', email: 'john.doe@fpt.edu.vn', major: 'Computer Science', status: 'Active' },
    { id: 2, studentId: 'STU002', name: 'Jane Smith', email: 'jane.smith@fpt.edu.vn', major: 'Information Technology', status: 'Active' },
    { id: 3, studentId: 'STU003', name: 'Bob Wilson', email: 'bob.wilson@fpt.edu.vn', major: 'Computer Science', status: 'Active' }
  ],
  lecturers: [
    { id: 1, name: 'Dr. Smith', email: 'smith@fpt.edu.vn', department: 'Computer Science', specialization: 'IoT & Embedded Systems', status: 'Active' },
    { id: 2, name: 'Dr. Johnson', email: 'johnson@fpt.edu.vn', department: 'Information Technology', specialization: 'Network Security', status: 'Active' },
    { id: 3, name: 'Dr. Brown', email: 'brown@fpt.edu.vn', department: 'Computer Science', specialization: 'Software Engineering', status: 'Active' }
  ],
  enrollments: [
    { id: 1, studentId: 1, classId: 1, semesterId: 1, studentName: 'John Doe', className: 'IOT101 - Introduction to IoT', semesterName: 'Spring 2024', enrollmentDate: '2024-01-10', status: 'Enrolled' },
    { id: 2, studentId: 2, classId: 1, semesterId: 1, studentName: 'Jane Smith', className: 'IOT101 - Introduction to IoT', semesterName: 'Spring 2024', enrollmentDate: '2024-01-12', status: 'Enrolled' },
    { id: 3, studentId: 1, classId: 2, semesterId: 1, studentName: 'John Doe', className: 'IOT201 - Advanced IoT Development', semesterName: 'Spring 2024', enrollmentDate: '2024-01-15', status: 'Enrolled' }
  ],
  assignments: [
    { id: 1, lecturerId: 1, classId: 1, semesterId: 1, lecturerName: 'Dr. Smith', className: 'IOT101 - Introduction to IoT', semesterName: 'Spring 2024', assignmentDate: '2024-01-05' },
    { id: 2, lecturerId: 2, classId: 2, semesterId: 1, lecturerName: 'Dr. Johnson', className: 'IOT201 - Advanced IoT Development', semesterName: 'Spring 2024', assignmentDate: '2024-01-08' }
  ],
  logs: [
    { id: 1, timestamp: '2024-01-15 10:30:00', user: 'academic@fpt.edu.vn', action: 'Created Semester', details: 'Spring 2024 semester created', status: 'Success' },
    { id: 2, timestamp: '2024-01-16 14:20:00', user: 'academic@fpt.edu.vn', action: 'Enrolled Student', details: 'John Doe enrolled in IOT101', status: 'Success' },
    { id: 3, timestamp: '2024-01-17 09:15:00', user: 'academic@fpt.edu.vn', action: 'Assigned Lecturer', details: 'Dr. Smith assigned to IOT101', status: 'Success' }
  ]
};

let academicIdCounter = {
  semesters: 3,
  classes: 4,
  students: 4,
  lecturers: 4,
  enrollments: 4,
  assignments: 3,
  logs: 4
};

// Semester CRUD endpoints
handlers.push(
  http.get('/api/academic/semesters', () => {
    return HttpResponse.json({ semesters: mockAcademicData.semesters }, { status: 200 });
  }),
  
  http.post('/api/academic/semesters', async ({ request }) => {
    const data = await request.json();
    const newSemester = { 
      id: academicIdCounter.semesters++, 
      ...data, 
      status: 'Active' 
    };
    mockAcademicData.semesters.push(newSemester);
    return HttpResponse.json({ semesters: mockAcademicData.semesters }, { status: 201 });
  }),
  
  http.put('/api/academic/semesters/:id', async ({ params, request }) => {
    const { id } = params;
    const data = await request.json();
    const index = mockAcademicData.semesters.findIndex(s => s.id === Number(id));
    if (index !== -1) {
      mockAcademicData.semesters[index] = { ...mockAcademicData.semesters[index], ...data };
      return HttpResponse.json({ semesters: mockAcademicData.semesters }, { status: 200 });
    }
    return HttpResponse.json({ message: 'Semester not found' }, { status: 404 });
  }),
  
  http.delete('/api/academic/semesters/:id', async ({ params }) => {
    const { id } = params;
    const index = mockAcademicData.semesters.findIndex(s => s.id === Number(id));
    if (index !== -1) {
      mockAcademicData.semesters.splice(index, 1);
      return HttpResponse.json({ semesters: mockAcademicData.semesters }, { status: 200 });
    }
    return HttpResponse.json({ message: 'Semester not found' }, { status: 404 });
  })
);

// Class CRUD endpoints
handlers.push(
  http.get('/api/academic/classes', () => {
    return HttpResponse.json({ classes: mockAcademicData.classes }, { status: 200 });
  }),
  
  http.post('/api/academic/classes', async ({ request }) => {
    const data = await request.json();
    const semester = mockAcademicData.semesters.find(s => s.id === Number(data.semesterId));
    const lecturer = mockAcademicData.lecturers.find(l => l.id === Number(data.lecturerId));
    const newClass = { 
      id: academicIdCounter.classes++, 
      ...data,
      enrolledCount: 0,
      semesterName: semester?.name || '',
      lecturerName: lecturer?.name || ''
    };
    mockAcademicData.classes.push(newClass);
    return HttpResponse.json({ classes: mockAcademicData.classes }, { status: 201 });
  }),
  
  http.put('/api/academic/classes/:id', async ({ params, request }) => {
    const { id } = params;
    const data = await request.json();
    const index = mockAcademicData.classes.findIndex(c => c.id === Number(id));
    if (index !== -1) {
      mockAcademicData.classes[index] = { ...mockAcademicData.classes[index], ...data };
      return HttpResponse.json({ classes: mockAcademicData.classes }, { status: 200 });
    }
    return HttpResponse.json({ message: 'Class not found' }, { status: 404 });
  }),
  
  http.delete('/api/academic/classes/:id', async ({ params }) => {
    const { id } = params;
    const index = mockAcademicData.classes.findIndex(c => c.id === Number(id));
    if (index !== -1) {
      mockAcademicData.classes.splice(index, 1);
      return HttpResponse.json({ classes: mockAcademicData.classes }, { status: 200 });
    }
    return HttpResponse.json({ message: 'Class not found' }, { status: 404 });
  })
);

// Student CRUD endpoints
handlers.push(
  http.get('/api/academic/students', () => {
    return HttpResponse.json({ students: mockAcademicData.students }, { status: 200 });
  }),
  
  http.post('/api/academic/students', async ({ request }) => {
    const data = await request.json();
    const newStudent = { 
      id: academicIdCounter.students++, 
      ...data, 
      status: 'Active' 
    };
    mockAcademicData.students.push(newStudent);
    return HttpResponse.json({ students: mockAcademicData.students }, { status: 201 });
  }),
  
  http.put('/api/academic/students/:id', async ({ params, request }) => {
    const { id } = params;
    const data = await request.json();
    const index = mockAcademicData.students.findIndex(s => s.id === Number(id));
    if (index !== -1) {
      mockAcademicData.students[index] = { ...mockAcademicData.students[index], ...data };
      return HttpResponse.json({ students: mockAcademicData.students }, { status: 200 });
    }
    return HttpResponse.json({ message: 'Student not found' }, { status: 404 });
  }),
  
  http.delete('/api/academic/students/:id', async ({ params }) => {
    const { id } = params;
    const index = mockAcademicData.students.findIndex(s => s.id === Number(id));
    if (index !== -1) {
      mockAcademicData.students.splice(index, 1);
      return HttpResponse.json({ students: mockAcademicData.students }, { status: 200 });
    }
    return HttpResponse.json({ message: 'Student not found' }, { status: 404 });
  })
);

// Lecturer CRUD endpoints
handlers.push(
  http.get('/api/academic/lecturers', () => {
    return HttpResponse.json({ lecturers: mockAcademicData.lecturers }, { status: 200 });
  }),
  
  http.post('/api/academic/lecturers', async ({ request }) => {
    const data = await request.json();
    const newLecturer = { 
      id: academicIdCounter.lecturers++, 
      ...data, 
      status: 'Active' 
    };
    mockAcademicData.lecturers.push(newLecturer);
    return HttpResponse.json({ lecturers: mockAcademicData.lecturers }, { status: 201 });
  }),
  
  http.put('/api/academic/lecturers/:id', async ({ params, request }) => {
    const { id } = params;
    const data = await request.json();
    const index = mockAcademicData.lecturers.findIndex(l => l.id === Number(id));
    if (index !== -1) {
      mockAcademicData.lecturers[index] = { ...mockAcademicData.lecturers[index], ...data };
      return HttpResponse.json({ lecturers: mockAcademicData.lecturers }, { status: 200 });
    }
    return HttpResponse.json({ message: 'Lecturer not found' }, { status: 404 });
  }),
  
  http.delete('/api/academic/lecturers/:id', async ({ params }) => {
    const { id } = params;
    const index = mockAcademicData.lecturers.findIndex(l => l.id === Number(id));
    if (index !== -1) {
      mockAcademicData.lecturers.splice(index, 1);
      return HttpResponse.json({ lecturers: mockAcademicData.lecturers }, { status: 200 });
    }
    return HttpResponse.json({ message: 'Lecturer not found' }, { status: 404 });
  })
);

// Enrollment management endpoints
handlers.push(
  http.get('/api/academic/enrollments', () => {
    return HttpResponse.json({ enrollments: mockAcademicData.enrollments }, { status: 200 });
  }),
  
  http.post('/api/academic/enrollments', async ({ request }) => {
    const data = await request.json();
    const student = mockAcademicData.students.find(s => s.id === Number(data.studentId));
    const cls = mockAcademicData.classes.find(c => c.id === Number(data.classId));
    const semester = mockAcademicData.semesters.find(s => s.id === Number(data.semesterId));
    
    if (!student || !cls || !semester) {
      return HttpResponse.json({ message: 'Invalid student, class, or semester' }, { status: 400 });
    }
    
    const newEnrollment = { 
      id: academicIdCounter.enrollments++, 
      ...data,
      studentName: student.name,
      className: cls.name,
      semesterName: semester.name,
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'Enrolled'
    };
    mockAcademicData.enrollments.push(newEnrollment);
    
    // Update class enrollment count
    const classIndex = mockAcademicData.classes.findIndex(c => c.id === Number(data.classId));
    if (classIndex !== -1) {
      mockAcademicData.classes[classIndex].enrolledCount += 1;
    }
    
    return HttpResponse.json({ enrollments: mockAcademicData.enrollments }, { status: 201 });
  }),
  
  http.delete('/api/academic/enrollments/:id', async ({ params }) => {
    const { id } = params;
    const enrollment = mockAcademicData.enrollments.find(e => e.id === Number(id));
    const index = mockAcademicData.enrollments.findIndex(e => e.id === Number(id));
    
    if (index !== -1) {
      mockAcademicData.enrollments.splice(index, 1);
      
      // Update class enrollment count
      if (enrollment) {
        const classIndex = mockAcademicData.classes.findIndex(c => c.id === Number(enrollment.classId));
        if (classIndex !== -1) {
          mockAcademicData.classes[classIndex].enrolledCount = Math.max(0, mockAcademicData.classes[classIndex].enrolledCount - 1);
        }
      }
      
      return HttpResponse.json({ enrollments: mockAcademicData.enrollments }, { status: 200 });
    }
    return HttpResponse.json({ message: 'Enrollment not found' }, { status: 404 });
  })
);

// Assignment management endpoints
handlers.push(
  http.get('/api/academic/assignments', () => {
    return HttpResponse.json({ assignments: mockAcademicData.assignments }, { status: 200 });
  }),
  
  http.post('/api/academic/assignments', async ({ request }) => {
    const data = await request.json();
    const lecturer = mockAcademicData.lecturers.find(l => l.id === Number(data.lecturerId));
    const cls = mockAcademicData.classes.find(c => c.id === Number(data.classId));
    const semester = mockAcademicData.semesters.find(s => s.id === Number(data.semesterId));
    
    if (!lecturer || !cls || !semester) {
      return HttpResponse.json({ message: 'Invalid lecturer, class, or semester' }, { status: 400 });
    }
    
    const newAssignment = { 
      id: academicIdCounter.assignments++, 
      ...data,
      lecturerName: lecturer.name,
      className: cls.name,
      semesterName: semester.name,
      assignmentDate: new Date().toISOString().split('T')[0]
    };
    mockAcademicData.assignments.push(newAssignment);
    return HttpResponse.json({ assignments: mockAcademicData.assignments }, { status: 201 });
  }),
  
  http.delete('/api/academic/assignments/:id', async ({ params }) => {
    const { id } = params;
    const index = mockAcademicData.assignments.findIndex(a => a.id === Number(id));
    if (index !== -1) {
      mockAcademicData.assignments.splice(index, 1);
      return HttpResponse.json({ assignments: mockAcademicData.assignments }, { status: 200 });
    }
    return HttpResponse.json({ message: 'Assignment not found' }, { status: 404 });
  })
);

// Log history endpoint
handlers.push(
  http.get('/api/academic/logs', () => {
    return HttpResponse.json({ logs: mockAcademicData.logs }, { status: 200 });
  })
);

// Admin user management endpoints
let mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@fpt.edu.vn', role: 'admin', status: 'Active' },
  { id: 2, name: 'Lecturer User', email: 'lecturer@fpt.edu.vn', role: 'lecturer', status: 'Active' },
  { id: 3, name: 'Academic User', email: 'academic@fpt.edu.vn', role: 'academic', status: 'Active' }
];

handlers.push(
  http.get('/api/admin/users', () => {
    return HttpResponse.json({ users: mockUsers }, { status: 200 });
  }),
  
  http.post('/api/admin/users', async ({ request }) => {
    const data = await request.json();
    const newUser = { 
      id: mockUsers.length + 1, 
      ...data, 
      status: 'Active' 
    };
    mockUsers.push(newUser);
    return HttpResponse.json({ users: mockUsers }, { status: 201 });
  }),
  
  http.put('/api/admin/users/:id', async ({ params, request }) => {
    const { id } = params;
    const data = await request.json();
    const index = mockUsers.findIndex(u => u.id === Number(id));
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...data };
      return HttpResponse.json({ users: mockUsers }, { status: 200 });
    }
    return HttpResponse.json({ message: 'User not found' }, { status: 404 });
  }),
  
  http.delete('/api/admin/users/:id', async ({ params }) => {
    const { id } = params;
    const index = mockUsers.findIndex(u => u.id === Number(id));
    if (index !== -1) {
      mockUsers.splice(index, 1);
      return HttpResponse.json({ users: mockUsers }, { status: 200 });
    }
    return HttpResponse.json({ message: 'User not found' }, { status: 404 });
  })
);

// Rental system mock data
let mockRentalRequests = [
  {
    id: 1,
    kitId: 1,
    kitName: 'Standard IoT Kit',
    userId: 1,
    userName: 'John Doe',
    userEmail: 'leader@fpt.edu.vn',
    userRole: 'leader',
    reason: 'Need to complete IoT project for final semester',
    purpose: 'Building a smart home automation system using Arduino and sensors',
    duration: 14,
    startDate: '2024-01-20',
    endDate: '2024-02-03',
    totalCost: 23333,
    status: 'PENDING_APPROVAL',
    requestDate: '2024-01-15',
    approvedBy: null,
    approvalDate: null
  },
  {
    id: 2,
    kitId: 2,
    kitName: 'Advanced IoT Kit',
    userId: 2,
    userName: 'Jane Smith',
    userEmail: 'lecturer@fpt.edu.vn',
    userRole: 'lecturer',
    reason: 'Research project on IoT security',
    purpose: 'Conducting research on IoT device vulnerabilities and security protocols',
    duration: 30,
    startDate: '2024-01-25',
    endDate: '2024-02-24',
    totalCost: 120000,
    status: 'APPROVED',
    requestDate: '2024-01-18',
    approvedBy: 'admin@fpt.edu.vn',
    approvalDate: '2024-01-19'
  }
];

let mockNotifications = [
  {
    id: 1,
    userId: 1,
    userEmail: 'leader@fpt.edu.vn',
    type: 'RENTAL_REQUEST',
    title: 'Rental Request Approved',
    message: 'Your rental request for Standard IoT Kit has been approved. Please collect the kit from Lab A.',
    status: 'UNREAD',
    createdAt: '2024-01-19T10:30:00Z'
  },
  {
    id: 2,
    userId: 2,
    userEmail: 'lecturer@fpt.edu.vn',
    type: 'RENTAL_REQUEST',
    title: 'Rental Request Approved',
    message: 'Your rental request for Advanced IoT Kit has been approved. Please collect the kit from Lab B.',
    status: 'UNREAD',
    createdAt: '2024-01-19T14:20:00Z'
  }
];

// Refund system mock data
let mockRefundRequests = [
  {
    id: 1,
    userEmail: 'leader1@fpt.edu.vn',
    userRole: 'leader',
    groupId: 1,
    refundReason: 'Project completed early, no longer need the kit',
    refundDate: '2024-01-15',
    requestDate: new Date().toISOString(),
    status: 'pending',
    originalAmount: 500000,
    dueDate: '2024-01-20'
  },
  {
    id: 2,
    userEmail: 'lecturer1@fpt.edu.vn',
    userRole: 'lecturer',
    refundReason: 'Course ended, returning kit',
    refundDate: '2024-01-10',
    requestDate: new Date(Date.now() - 86400000).toISOString(),
    status: 'pending',
    originalAmount: 300000,
    dueDate: '2024-01-12'
  }
];

// Rental request endpoints
handlers.push(
  http.post('/api/rentals/request', async ({ request }) => {
    const data = await request.json();
    const newRequest = {
      id: mockRentalRequests.length + 1,
      ...data,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'PENDING_APPROVAL'
    };
    mockRentalRequests.push(newRequest);
    return HttpResponse.json({ 
      success: true, 
      message: 'Rental request submitted successfully',
      request: newRequest 
    }, { status: 201 });
  }),

  http.get('/api/admin/rental-requests', () => {
    return HttpResponse.json({ requests: mockRentalRequests }, { status: 200 });
  }),

  http.post('/api/admin/rental-requests/:id/approve', async ({ params }) => {
    const { id } = params;
    const request = mockRentalRequests.find(r => r.id === Number(id));
    if (request) {
      request.status = 'APPROVED';
      request.approvedBy = 'admin@fpt.edu.vn';
      request.approvalDate = new Date().toISOString().split('T')[0];
      
      // Update kit status to BORROWED
      const kit = mockKits.find(k => k.id === request.kitId);
      if (kit) {
        kit.status = 'BORROWED';
        kit.quantity = Math.max(0, kit.quantity - 1);
      }
      
      return HttpResponse.json({ 
        success: true, 
        message: 'Rental request approved successfully',
        requests: mockRentalRequests 
      }, { status: 200 });
    }
    return HttpResponse.json({ message: 'Request not found' }, { status: 404 });
  }),

  http.post('/api/admin/rental-requests/:id/reject', async ({ params, request }) => {
    const { id } = params;
    const { reason } = await request.json();
    const rentalRequest = mockRentalRequests.find(r => r.id === Number(id));
    if (rentalRequest) {
      rentalRequest.status = 'REJECTED';
      rentalRequest.rejectionReason = reason;
      
      // Refund the money to wallet
      const walletRes = await fetch('/api/wallet/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: rentalRequest.totalCost,
          description: `Refund for rejected rental request - ${rentalRequest.kitName}`
        }),
      });
      
      return HttpResponse.json({ 
        success: true, 
        message: 'Rental request rejected successfully',
        requests: mockRentalRequests 
      }, { status: 200 });
    }
    return HttpResponse.json({ message: 'Request not found' }, { status: 404 });
  })
);

// Wallet enhancement endpoints
handlers.push(
  http.post('/api/wallet/deduct', async ({ request }) => {
    const { amount, description } = await request.json();
    mockWallet.balance -= amount;
    mockWallet.transactions.unshift({
      type: 'deduction',
      amount: amount,
      description: description,
      date: new Date().toLocaleString(),
    });
    return HttpResponse.json({ wallet: mockWallet }, { status: 200 });
  }),

  http.post('/api/wallet/refund', async ({ request }) => {
    const { amount, description } = await request.json();
    mockWallet.balance += amount;
    mockWallet.transactions.unshift({
      type: 'refund',
      amount: amount,
      description: description,
      date: new Date().toLocaleString(),
    });
    return HttpResponse.json({ wallet: mockWallet }, { status: 200 });
  })
);

// Notification endpoints
handlers.push(
  http.post('/api/notifications/send', async ({ request }) => {
    const data = await request.json();
    const newNotification = {
      id: mockNotifications.length + 1,
      userId: data.userId || 1,
      userEmail: data.userEmail || 'user@fpt.edu.vn',
      type: data.type,
      title: data.status === 'APPROVED' ? 'Rental Request Approved' : 'Rental Request Rejected',
      message: data.status === 'APPROVED' 
        ? `Your rental request has been approved. Please collect the kit.`
        : `Your rental request has been rejected. Reason: ${data.reason || 'No reason provided'}`,
      status: 'UNREAD',
      createdAt: new Date().toISOString()
    };
    mockNotifications.push(newNotification);
    return HttpResponse.json({ 
      success: true, 
      message: 'Notification sent successfully' 
    }, { status: 200 });
  }),

  http.get('/api/notifications/:userEmail', async ({ params }) => {
    const { userEmail } = params;
    const userNotifications = mockNotifications.filter(n => n.userEmail === userEmail);
    return HttpResponse.json({ notifications: userNotifications }, { status: 200 });
  })
);

// Refund request endpoints
handlers.push(
  http.post('/api/refunds/request', async ({ request }) => {
    const data = await request.json();
    const newRefundRequest = {
      id: mockRefundRequests.length + 1,
      ...data,
      status: 'pending',
      requestDate: new Date().toISOString()
    };
    mockRefundRequests.push(newRefundRequest);
    return HttpResponse.json({ 
      success: true, 
      message: 'Refund request submitted successfully',
      request: newRefundRequest 
    }, { status: 201 });
  }),

  http.get('/api/admin/refund-requests', () => {
    return HttpResponse.json({ requests: mockRefundRequests }, { status: 200 });
  }),

  http.post('/api/admin/refund-requests/:id/approve', async ({ params, request }) => {
    const { id } = params;
    const { damageAssessment } = await request.json();
    const refundRequest = mockRefundRequests.find(r => r.id === Number(id));
    
    if (refundRequest) {
      refundRequest.status = 'approved';
      refundRequest.approvalDate = new Date().toISOString();
      refundRequest.damageAssessment = damageAssessment;
      
      // Calculate refund amount
      let damageFee = 0;
      Object.values(damageAssessment || {}).forEach(component => {
        if (component.damaged > 0) {
          damageFee += component.damaged * component.value;
        }
      });
      
      const refundAmount = Math.max(0, refundRequest.originalAmount - damageFee);
      refundRequest.refundAmount = refundAmount;
      refundRequest.damageFee = damageFee;
      
      // Generate QR code
      const qrCode = `REFUND-${refundRequest.id}-${Date.now()}`;
      refundRequest.qrCode = qrCode;
      
      return HttpResponse.json({ 
        success: true, 
        message: 'Refund request approved successfully',
        qrCode: qrCode,
        refundAmount: refundAmount,
        damageFee: damageFee,
        requests: mockRefundRequests 
      }, { status: 200 });
    }
    return HttpResponse.json({ message: 'Refund request not found' }, { status: 404 });
  }),

  http.post('/api/admin/refund-requests/:id/reject', async ({ params, request }) => {
    const { id } = params;
    const { reason } = await request.json();
    const refundRequest = mockRefundRequests.find(r => r.id === Number(id));
    
    if (refundRequest) {
      refundRequest.status = 'rejected';
      refundRequest.rejectionReason = reason;
      refundRequest.rejectionDate = new Date().toISOString();
      
      return HttpResponse.json({ 
        success: true, 
        message: 'Refund request rejected successfully',
        requests: mockRefundRequests 
      }, { status: 200 });
    }
    return HttpResponse.json({ message: 'Refund request not found' }, { status: 404 });
  })
);

export const worker = setupWorker(...handlers);
