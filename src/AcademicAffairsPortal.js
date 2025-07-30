import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar
} from '@mui/material';
import { Edit, Delete, Add, Visibility, History, School, Class, People, Person, Assignment, History as HistoryIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  mockSemesters, 
  mockStudents, 
  mockLecturers, 
  mockClasses, 
  mockEnrollments, 
  mockAcademicAssignments, 
  mockLogs 
} from './mocks';

function AcademicAffairsPortal({ user, onLogout }) {
  // State for different sections
  const [activeTab, setActiveTab] = useState('semesters');
  const [message, setMessage] = useState('');
  
  // Semester management
  const [semesters, setSemesters] = useState(mockSemesters);
  const [semesterDialog, setSemesterDialog] = useState({ open: false, mode: 'add', data: { name: '', startDate: '', endDate: '' } });
  
  // Class management
  const [classes, setClasses] = useState(mockClasses);
  const [classDialog, setClassDialog] = useState({ open: false, mode: 'add', data: { name: '', semesterId: '', lecturerId: '', capacity: '' } });
  
  // Student management
  const [students, setStudents] = useState(mockStudents);
  const [studentDialog, setStudentDialog] = useState({ open: false, mode: 'add', data: { email: '', name: '', studentId: '', major: '' } });
  
  // Lecturer management
  const [lecturers, setLecturers] = useState(mockLecturers);
  const [lecturerDialog, setLecturerDialog] = useState({ open: false, mode: 'add', data: { email: '', name: '', department: '', specialization: '' } });
  
  // Enrollment management
  const [enrollments, setEnrollments] = useState(mockEnrollments);
  const [enrollmentDialog, setEnrollmentDialog] = useState({ open: false, data: { studentId: '', classId: '', semesterId: '' } });
  
  // Log history
  const [logs, setLogs] = useState(mockLogs);
  
  // Assignment management
  const [assignments, setAssignments] = useState(mockAcademicAssignments);
  const [assignmentDialog, setAssignmentDialog] = useState({ open: false, data: { lecturerId: '', classId: '', semesterId: '' } });

  if (!user) return null;

  const drawerWidth = 220;
  const navItems = [
    { key: 'semesters', label: 'Semesters', icon: <School /> },
    { key: 'classes', label: 'Classes', icon: <Class /> },
    { key: 'students', label: 'Students', icon: <People /> },
    { key: 'lecturers', label: 'Lecturers', icon: <Person /> },
    { key: 'enrollments', label: 'Enrollments', icon: <Assignment /> },
    { key: 'assignments', label: 'Assignments', icon: <Assignment /> },
    { key: 'logs', label: 'Log History', icon: <HistoryIcon /> },
  ];
  
  // Semester CRUD operations
  const handleSemesterSubmit = async (e) => {
    e.preventDefault();
    const { mode, data } = semesterDialog;
    
    try {
      if (mode === 'add') {
        const newSemester = {
          id: semesters.length + 1,
          ...data,
          status: 'Active'
        };
        setSemesters([...semesters, newSemester]);
        setMessage('Semester created successfully!');
      } else {
        setSemesters(prevSemesters => prevSemesters.map(semester => 
          semester.id === data.id ? { ...semester, ...data } : semester
        ));
        setMessage('Semester updated successfully!');
      }
      
      setSemesterDialog({ open: false, mode: 'add', data: { name: '', startDate: '', endDate: '' } });
    } catch (error) {
      setMessage(error.message || 'Operation failed');
    }
  };

  const handleDeleteSemester = async (id) => {
    if (window.confirm('Are you sure you want to delete this semester?')) {
      try {
        setSemesters(prevSemesters => prevSemesters.filter(semester => semester.id !== id));
        setMessage('Semester deleted successfully!');
      } catch (error) {
        setMessage(error.message || 'Failed to delete semester');
      }
    }
  };

  // Class CRUD operations
  const handleClassSubmit = async (e) => {
    e.preventDefault();
    const { mode, data } = classDialog;
    
    try {
      if (mode === 'add') {
        const selectedSemester = semesters.find(s => s.id === parseInt(data.semesterId));
        const selectedLecturer = lecturers.find(l => l.id === parseInt(data.lecturerId));
        
        const newClass = {
          id: classes.length + 1,
          name: data.name,
          semesterId: parseInt(data.semesterId),
          semesterName: selectedSemester?.name || '',
          lecturerId: parseInt(data.lecturerId),
          lecturerName: selectedLecturer?.name || '',
          capacity: parseInt(data.capacity),
          enrolledCount: 0,
          status: 'Active'
        };
        setClasses([...classes, newClass]);
        setMessage('Class created successfully!');
      } else {
        setClasses(prevClasses => prevClasses.map(cls => 
          cls.id === data.id ? { ...cls, ...data } : cls
        ));
        setMessage('Class updated successfully!');
      }
      
      setClassDialog({ open: false, mode: 'add', data: { name: '', semesterId: '', lecturerId: '', capacity: '' } });
    } catch (error) {
      setMessage(error.message || 'Operation failed');
    }
  };

  const handleDeleteClass = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        setClasses(prevClasses => prevClasses.filter(cls => cls.id !== id));
        setMessage('Class deleted successfully!');
      } catch (error) {
        setMessage(error.message || 'Failed to delete class');
      }
    }
  };

  // Student CRUD operations
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    const { mode, data } = studentDialog;
    
    try {
      if (mode === 'add') {
        const newStudent = {
          id: students.length + 1,
          ...data,
          status: 'Active',
          enrollmentDate: new Date().toISOString().split('T')[0]
        };
        setStudents([...students, newStudent]);
        setMessage('Student created successfully!');
      } else {
        setStudents(prevStudents => prevStudents.map(student => 
          student.id === data.id ? { ...student, ...data } : student
        ));
        setMessage('Student updated successfully!');
      }
      
      setStudentDialog({ open: false, mode: 'add', data: { email: '', name: '', studentId: '', major: '' } });
    } catch (error) {
      setMessage(error.message || 'Operation failed');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        setStudents(prevStudents => prevStudents.filter(student => student.id !== id));
        setMessage('Student deleted successfully!');
      } catch (error) {
        setMessage(error.message || 'Failed to delete student');
      }
    }
  };

  // Lecturer CRUD operations
  const handleLecturerSubmit = async (e) => {
    e.preventDefault();
    const { mode, data } = lecturerDialog;
    
    try {
      if (mode === 'add') {
        const newLecturer = {
          id: lecturers.length + 1,
          ...data,
          status: 'Active',
          hireDate: new Date().toISOString().split('T')[0]
        };
        setLecturers([...lecturers, newLecturer]);
        setMessage('Lecturer created successfully!');
      } else {
        setLecturers(prevLecturers => prevLecturers.map(lecturer => 
          lecturer.id === data.id ? { ...lecturer, ...data } : lecturer
        ));
        setMessage('Lecturer updated successfully!');
      }
      
      setLecturerDialog({ open: false, mode: 'add', data: { email: '', name: '', department: '', specialization: '' } });
    } catch (error) {
      setMessage(error.message || 'Operation failed');
    }
  };

  const handleDeleteLecturer = async (id) => {
    if (window.confirm('Are you sure you want to delete this lecturer?')) {
      try {
        setLecturers(prevLecturers => prevLecturers.filter(lecturer => lecturer.id !== id));
        setMessage('Lecturer deleted successfully!');
      } catch (error) {
        setMessage(error.message || 'Failed to delete lecturer');
      }
    }
  };

  // Enrollment management
  const handleEnrollmentSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const selectedStudent = students.find(s => s.id === parseInt(enrollmentDialog.data.studentId));
      const selectedClass = classes.find(c => c.id === parseInt(enrollmentDialog.data.classId));
      const selectedSemester = semesters.find(s => s.id === parseInt(enrollmentDialog.data.semesterId));
      
      const newEnrollment = {
        id: enrollments.length + 1,
        studentId: parseInt(enrollmentDialog.data.studentId),
        studentName: selectedStudent?.name || '',
        classId: parseInt(enrollmentDialog.data.classId),
        className: selectedClass?.name || '',
        semesterId: parseInt(enrollmentDialog.data.semesterId),
        semesterName: selectedSemester?.name || '',
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'Enrolled'
      };
      
      setEnrollments([...enrollments, newEnrollment]);
      setMessage('Student enrolled successfully!');
      setEnrollmentDialog({ open: false, data: { studentId: '', classId: '', semesterId: '' } });
    } catch (error) {
      setMessage(error.message || 'Enrollment failed');
    }
  };

  const handleUnenroll = async (enrollmentId) => {
    if (window.confirm('Are you sure you want to unenroll this student?')) {
      try {
        setEnrollments(prevEnrollments => prevEnrollments.filter(enrollment => enrollment.id !== enrollmentId));
        setMessage('Student unenrolled successfully!');
      } catch (error) {
        setMessage(error.message || 'Failed to unenroll student');
      }
    }
  };

  // Assignment management
  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const selectedLecturer = lecturers.find(l => l.id === parseInt(assignmentDialog.data.lecturerId));
      const selectedClass = classes.find(c => c.id === parseInt(assignmentDialog.data.classId));
      const selectedSemester = semesters.find(s => s.id === parseInt(assignmentDialog.data.semesterId));
      
      const newAssignment = {
        id: assignments.length + 1,
        lecturerId: parseInt(assignmentDialog.data.lecturerId),
        lecturerName: selectedLecturer?.name || '',
        classId: parseInt(assignmentDialog.data.classId),
        className: selectedClass?.name || '',
        semesterId: parseInt(assignmentDialog.data.semesterId),
        semesterName: selectedSemester?.name || '',
        assignmentDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      };
      
      setAssignments([...assignments, newAssignment]);
      setMessage('Lecturer assigned successfully!');
      setAssignmentDialog({ open: false, data: { lecturerId: '', classId: '', semesterId: '' } });
    } catch (error) {
      setMessage(error.message || 'Assignment failed');
    }
  };

  const handleRemoveAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to remove this assignment?')) {
      try {
        setAssignments(prevAssignments => prevAssignments.filter(assignment => assignment.id !== assignmentId));
        setMessage('Assignment removed successfully!');
      } catch (error) {
        setMessage(error.message || 'Failed to remove assignment');
      }
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index} style={{ paddingTop: 20 }}>
      {value === index && children}
    </div>
  );

  const renderSemesters = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Semester Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setSemesterDialog({ open: true, mode: 'add', data: { name: '', startDate: '', endDate: '' } })}
        >
          Add Semester
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {semesters.map((semester) => (
              <TableRow key={semester.id}>
                <TableCell>{semester.name}</TableCell>
                <TableCell>{semester.startDate}</TableCell>
                <TableCell>{semester.endDate}</TableCell>
                <TableCell>
                  <Chip 
                    label={semester.status} 
                    color={semester.status === 'Active' ? 'success' : 'default'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => setSemesterDialog({ open: true, mode: 'edit', data: semester })}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteSemester(semester.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderClasses = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Class Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setClassDialog({ open: true, mode: 'add', data: { name: '', semesterId: '', lecturerId: '', capacity: '' } })}
        >
          Add Class
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Lecturer</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell>{cls.name}</TableCell>
                <TableCell>{semesters.find(s => s.id === cls.semesterId)?.name || 'N/A'}</TableCell>
                <TableCell>{lecturers.find(l => l.id === cls.lecturerId)?.name || 'N/A'}</TableCell>
                <TableCell>{cls.capacity}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => setClassDialog({ open: true, mode: 'edit', data: cls })}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClass(cls.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderStudents = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Student Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setStudentDialog({ open: true, mode: 'add', data: { email: '', name: '', studentId: '', major: '' } })}
        >
          Add Student
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Student ID</TableCell>
              <TableCell>Major</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>{student.major}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => setStudentDialog({ open: true, mode: 'edit', data: student })}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderLecturers = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Lecturer Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setLecturerDialog({ open: true, mode: 'add', data: { email: '', name: '', department: '', specialization: '' } })}
        >
          Add Lecturer
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lecturers.map((lecturer) => (
              <TableRow key={lecturer.id}>
                <TableCell>{lecturer.name}</TableCell>
                <TableCell>{lecturer.email}</TableCell>
                <TableCell>{lecturer.department}</TableCell>
                <TableCell>{lecturer.specialization}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => setLecturerDialog({ open: true, mode: 'edit', data: lecturer })}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteLecturer(lecturer.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderEnrollments = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Enrollment Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setEnrollmentDialog({ open: true, data: { studentId: '', classId: '', semesterId: '' } })}
        >
          Add Enrollment
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollments.map((enrollment) => (
              <TableRow key={enrollment.id}>
                <TableCell>{students.find(s => s.id === enrollment.studentId)?.name || 'N/A'}</TableCell>
                <TableCell>{classes.find(c => c.id === enrollment.classId)?.name || 'N/A'}</TableCell>
                <TableCell>{semesters.find(s => s.id === enrollment.semesterId)?.name || 'N/A'}</TableCell>
                <TableCell>
                  <Tooltip title="Remove">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleUnenroll(enrollment.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderAssignments = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Assignment Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAssignmentDialog({ open: true, data: { lecturerId: '', classId: '', semesterId: '' } })}
        >
          Add Assignment
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Lecturer</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>{lecturers.find(l => l.id === assignment.lecturerId)?.name || 'N/A'}</TableCell>
                <TableCell>{classes.find(c => c.id === assignment.classId)?.name || 'N/A'}</TableCell>
                <TableCell>{semesters.find(s => s.id === assignment.semesterId)?.name || 'N/A'}</TableCell>
                <TableCell>
                  <Tooltip title="Remove">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveAssignment(assignment.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderLogs = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Log History</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>{log.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const tabContentVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -40, transition: { duration: 0.3 } },
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      {/* Side Navigation */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', background: '#fff', borderRight: '1px solid #e0e0e0' },
        }}
      >
        <Toolbar sx={{ minHeight: 80 }} />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                selected={activeTab === item.key}
                onClick={() => setActiveTab(item.key)}
                sx={{ borderRadius: 2, mx: 1, my: 0.5 }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, bgcolor: '#f5f7fa', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <AppBar position="fixed" color="inherit" elevation={2} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: '#fff' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: 80 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <img src={require('./logo.svg').default} alt="Logo" style={{ width: 48, marginRight: 12 }} />
              <Typography variant="h4" fontWeight={700} color="primary" sx={{ letterSpacing: 1 }}>Academic Affairs Portal</Typography>
            </Box>
            <Button variant="outlined" color="primary" onClick={onLogout} sx={{ fontWeight: 700 }}>Logout</Button>
          </Toolbar>
        </AppBar>
        {/* Spacer for AppBar */}
        <Toolbar sx={{ minHeight: 80 }} />
        {/* Dashboard Container */}
        <Box sx={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <Box sx={{ width: '100%', maxWidth: 1200, px: 2 }}>
            {message && <Alert sx={{ mb: 2 }} severity="info" onClose={() => setMessage('')}>{message}</Alert>}
            <AnimatePresence mode="wait">
              {activeTab === 'semesters' && (
                <motion.div
                  key="semesters"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {renderSemesters()}
                </motion.div>
              )}
              {activeTab === 'classes' && (
                <motion.div
                  key="classes"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {renderClasses()}
                </motion.div>
              )}
              {activeTab === 'students' && (
                <motion.div
                  key="students"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {renderStudents()}
                </motion.div>
              )}
              {activeTab === 'lecturers' && (
                <motion.div
                  key="lecturers"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {renderLecturers()}
                </motion.div>
              )}
              {activeTab === 'enrollments' && (
                <motion.div
                  key="enrollments"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {renderEnrollments()}
                </motion.div>
              )}
              {activeTab === 'assignments' && (
                <motion.div
                  key="assignments"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {renderAssignments()}
                </motion.div>
              )}
              {activeTab === 'logs' && (
                <motion.div
                  key="logs"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {renderLogs()}
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </Box>

      {/* Semester Dialog */}
      <Dialog open={semesterDialog.open} onClose={() => setSemesterDialog({ ...semesterDialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>{semesterDialog.mode === 'add' ? 'Add Semester' : 'Edit Semester'}</DialogTitle>
        <form onSubmit={handleSemesterSubmit}>
          <DialogContent>
            <TextField
              label="Semester Name"
              value={semesterDialog.data.name}
              onChange={(e) => setSemesterDialog({ ...semesterDialog, data: { ...semesterDialog.data, name: e.target.value } })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Start Date"
              type="date"
              value={semesterDialog.data.startDate}
              onChange={(e) => setSemesterDialog({ ...semesterDialog, data: { ...semesterDialog.data, startDate: e.target.value } })}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={semesterDialog.data.endDate}
              onChange={(e) => setSemesterDialog({ ...semesterDialog, data: { ...semesterDialog.data, endDate: e.target.value } })}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSemesterDialog({ ...semesterDialog, open: false })}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Class Dialog */}
      <Dialog open={classDialog.open} onClose={() => setClassDialog({ ...classDialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>{classDialog.mode === 'add' ? 'Add Class' : 'Edit Class'}</DialogTitle>
        <form onSubmit={handleClassSubmit}>
          <DialogContent>
            <TextField
              label="Class Name"
              value={classDialog.data.name}
              onChange={(e) => setClassDialog({ ...classDialog, data: { ...classDialog.data, name: e.target.value } })}
              fullWidth
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Semester</InputLabel>
              <Select
                value={classDialog.data.semesterId}
                onChange={(e) => setClassDialog({ ...classDialog, data: { ...classDialog.data, semesterId: e.target.value } })}
                label="Semester"
              >
                {semesters.map((semester) => (
                  <MenuItem key={semester.id} value={semester.id}>{semester.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Lecturer</InputLabel>
              <Select
                value={classDialog.data.lecturerId}
                onChange={(e) => setClassDialog({ ...classDialog, data: { ...classDialog.data, lecturerId: e.target.value } })}
                label="Lecturer"
              >
                {lecturers.map((lecturer) => (
                  <MenuItem key={lecturer.id} value={lecturer.id}>{lecturer.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Capacity"
              type="number"
              value={classDialog.data.capacity}
              onChange={(e) => setClassDialog({ ...classDialog, data: { ...classDialog.data, capacity: e.target.value } })}
              fullWidth
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setClassDialog({ ...classDialog, open: false })}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Student Dialog */}
      <Dialog open={studentDialog.open} onClose={() => setStudentDialog({ ...studentDialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>{studentDialog.mode === 'add' ? 'Add Student' : 'Edit Student'}</DialogTitle>
        <form onSubmit={handleStudentSubmit}>
          <DialogContent>
            <TextField
              label="Student ID"
              value={studentDialog.data.studentId}
              onChange={(e) => setStudentDialog({ ...studentDialog, data: { ...studentDialog.data, studentId: e.target.value } })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Name"
              value={studentDialog.data.name}
              onChange={(e) => setStudentDialog({ ...studentDialog, data: { ...studentDialog.data, name: e.target.value } })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              type="email"
              value={studentDialog.data.email}
              onChange={(e) => setStudentDialog({ ...studentDialog, data: { ...studentDialog.data, email: e.target.value } })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Major"
              value={studentDialog.data.major}
              onChange={(e) => setStudentDialog({ ...studentDialog, data: { ...studentDialog.data, major: e.target.value } })}
              fullWidth
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStudentDialog({ ...studentDialog, open: false })}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Lecturer Dialog */}
      <Dialog open={lecturerDialog.open} onClose={() => setLecturerDialog({ ...lecturerDialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>{lecturerDialog.mode === 'add' ? 'Add Lecturer' : 'Edit Lecturer'}</DialogTitle>
        <form onSubmit={handleLecturerSubmit}>
          <DialogContent>
            <TextField
              label="Name"
              value={lecturerDialog.data.name}
              onChange={(e) => setLecturerDialog({ ...lecturerDialog, data: { ...lecturerDialog.data, name: e.target.value } })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              type="email"
              value={lecturerDialog.data.email}
              onChange={(e) => setLecturerDialog({ ...lecturerDialog, data: { ...lecturerDialog.data, email: e.target.value } })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Department"
              value={lecturerDialog.data.department}
              onChange={(e) => setLecturerDialog({ ...lecturerDialog, data: { ...lecturerDialog.data, department: e.target.value } })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Specialization"
              value={lecturerDialog.data.specialization}
              onChange={(e) => setLecturerDialog({ ...lecturerDialog, data: { ...lecturerDialog.data, specialization: e.target.value } })}
              fullWidth
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLecturerDialog({ ...lecturerDialog, open: false })}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Enrollment Dialog */}
      <Dialog open={enrollmentDialog.open} onClose={() => setEnrollmentDialog({ ...enrollmentDialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>Enroll Student</DialogTitle>
        <form onSubmit={handleEnrollmentSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Student</InputLabel>
              <Select
                value={enrollmentDialog.data.studentId}
                onChange={(e) => setEnrollmentDialog({ ...enrollmentDialog, data: { ...enrollmentDialog.data, studentId: e.target.value } })}
                label="Student"
              >
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>{student.name} ({student.studentId})</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Class</InputLabel>
              <Select
                value={enrollmentDialog.data.classId}
                onChange={(e) => setEnrollmentDialog({ ...enrollmentDialog, data: { ...enrollmentDialog.data, classId: e.target.value } })}
                label="Class"
              >
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Semester</InputLabel>
              <Select
                value={enrollmentDialog.data.semesterId}
                onChange={(e) => setEnrollmentDialog({ ...enrollmentDialog, data: { ...enrollmentDialog.data, semesterId: e.target.value } })}
                label="Semester"
              >
                {semesters.map((semester) => (
                  <MenuItem key={semester.id} value={semester.id}>{semester.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEnrollmentDialog({ ...enrollmentDialog, open: false })}>Cancel</Button>
            <Button type="submit" variant="contained">Enroll</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog open={assignmentDialog.open} onClose={() => setAssignmentDialog({ ...assignmentDialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Lecturer to Class</DialogTitle>
        <form onSubmit={handleAssignmentSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Lecturer</InputLabel>
              <Select
                value={assignmentDialog.data.lecturerId}
                onChange={(e) => setAssignmentDialog({ ...assignmentDialog, data: { ...assignmentDialog.data, lecturerId: e.target.value } })}
                label="Lecturer"
              >
                {lecturers.map((lecturer) => (
                  <MenuItem key={lecturer.id} value={lecturer.id}>{lecturer.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Class</InputLabel>
              <Select
                value={assignmentDialog.data.classId}
                onChange={(e) => setAssignmentDialog({ ...assignmentDialog, data: { ...assignmentDialog.data, classId: e.target.value } })}
                label="Class"
              >
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Semester</InputLabel>
              <Select
                value={assignmentDialog.data.semesterId}
                onChange={(e) => setAssignmentDialog({ ...assignmentDialog, data: { ...assignmentDialog.data, semesterId: e.target.value } })}
                label="Semester"
              >
                {semesters.map((semester) => (
                  <MenuItem key={semester.id} value={semester.id}>{semester.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAssignmentDialog({ ...assignmentDialog, open: false })}>Cancel</Button>
            <Button type="submit" variant="contained">Assign</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default AcademicAffairsPortal; 