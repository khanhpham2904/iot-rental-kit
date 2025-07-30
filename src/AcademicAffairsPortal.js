import React, { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Card,
  Table,
  Button,
  Input,
  Select,
  Modal,
  Form,
  message,
  Tag,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Tooltip,
  Avatar,
  Badge,
  Divider,
  List,
  Timeline,
  Progress,
  Switch,
  DatePicker,
  Upload,
  Drawer,
  Tabs,
  Alert,
  Descriptions,
  Steps,
  Result,
  Empty,
  Skeleton,
  Spin,
  notification
} from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  ReadOutlined,
  BookOutlined,
  LogoutOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  DownloadOutlined,
  UploadOutlined,
  SearchOutlined,
  FilterOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  BellOutlined,
  MailOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  TrophyOutlined,
  SafetyCertificateOutlined,
  BugOutlined,
  BuildOutlined,
  CarOutlined,
  HomeOutlined,
  ExperimentOutlined,
  RobotOutlined,
  WifiOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  HeartOutlined,
  StarOutlined,
  LikeOutlined,
  DislikeOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CheckOutlined,
  StopOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StepForwardOutlined,
  StepBackwardOutlined,
  FastForwardOutlined,
  FastBackwardOutlined,
  ShuffleOutlined,
  RetweetOutlined,
  SwapOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LoadingOutlined,
  RollbackOutlined,
  WalletOutlined,
  ArrowLeftOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { 
  mockSemesters, 
  mockStudents, 
  mockLecturers, 
  mockClasses, 
  mockEnrollments, 
  mockAcademicAssignments, 
  mockLogs 
} from './mocks';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Helper functions
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeInOut" }
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'approved':
    case 'completed':
      return 'success';
    case 'pending':
    case 'in_progress':
      return 'warning';
    case 'inactive':
    case 'rejected':
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

function AcademicAffairsPortal({ user, onLogout }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  
  // Academic data
  const [semesters, setSemesters] = useState(mockSemesters);
  const [classes, setClasses] = useState(mockClasses);
  const [students, setStudents] = useState(mockStudents);
  const [lecturers, setLecturers] = useState(mockLecturers);
  const [enrollments, setEnrollments] = useState(mockEnrollments);
  const [assignments, setAssignments] = useState(mockAcademicAssignments);
  const [logs, setLogs] = useState(mockLogs);
  
  // Modal states
  const [semesterModal, setSemesterModal] = useState({ visible: false, mode: 'add', data: {} });
  const [classModal, setClassModal] = useState({ visible: false, mode: 'add', data: {} });
  const [studentModal, setStudentModal] = useState({ visible: false, mode: 'add', data: {} });
  const [lecturerModal, setLecturerModal] = useState({ visible: false, mode: 'add', data: {} });
  const [enrollmentModal, setEnrollmentModal] = useState({ visible: false, data: {} });
  const [assignmentModal, setAssignmentModal] = useState({ visible: false, data: {} });
  
  // Form instances
  const [semesterForm] = Form.useForm();
  const [classForm] = Form.useForm();
  const [studentForm] = Form.useForm();
  const [lecturerForm] = Form.useForm();
  const [enrollmentForm] = Form.useForm();
  const [assignmentForm] = Form.useForm();

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Data is already loaded from mocks
      setLoading(false);
    } catch (error) {
      message.error('Failed to load data');
      setLoading(false);
    }
  };

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'semesters', icon: <ReadOutlined />, label: 'Semesters' },
    { key: 'classes', icon: <BookOutlined />, label: 'Classes' },
    { key: 'students', icon: <UserOutlined />, label: 'Students' },
    { key: 'lecturers', icon: <TeamOutlined />, label: 'Lecturers' },
    { key: 'enrollments', icon: <UserOutlined />, label: 'Enrollments' },
    { key: 'assignments', icon: <BookOutlined />, label: 'Assignments' },
    { key: 'logs', icon: <HistoryOutlined />, label: 'Log History' },
  ];

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
  };

  if (!user) return null;

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Sidebar */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="light"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          position: 'fixed',
          height: '100vh',
          zIndex: 1000,
          left: 0,
          top: 0,
          borderRight: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        {/* Logo Section */}
        <motion.div 
          style={{ 
            height: 80, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            margin: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title level={4} style={{ margin: 0, color: '#fff', fontWeight: 'bold' }}>
            {collapsed ? 'ACA' : 'Academic Affairs'}
          </Title>
        </motion.div>
        
        {/* Navigation Menu */}
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ 
            borderRight: 0,
            background: 'transparent',
            padding: '0 16px'
          }}
        />
      </Sider>
      
      {/* Main Content Area */}
      <Layout style={{ 
        marginLeft: collapsed ? 80 : 200, 
        transition: 'margin-left 0.3s ease-in-out',
        background: 'transparent'
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Header style={{ 
            padding: '0 32px', 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 999,
            borderBottom: '1px solid rgba(255,255,255,0.2)',
            height: 80
          }}>
            {/* Left Section */}
            <Space size="large">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{ 
                    fontSize: '18px', 
                    width: 48, 
                    height: 48,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea'
                  }}
                />
              </motion.div>
              <motion.div
                key={selectedKey}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Title level={2} style={{ margin: 0, color: '#2c3e50', fontWeight: 'bold' }}>
                  {menuItems.find(item => item.key === selectedKey)?.label}
                </Title>
              </motion.div>
            </Space>
            
            {/* Right Section */}
            <Space size="large">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge count={3} size="small" style={{ cursor: 'pointer' }}>
                  <div style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <BellOutlined />
                  </div>
                </Badge>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Avatar 
                  icon={<UserOutlined />} 
                  size={48}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: '3px solid rgba(255,255,255,0.3)'
                  }}
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  type="primary"
                  icon={<LogoutOutlined />} 
                  onClick={onLogout}
                  style={{
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    height: 40,
                    padding: '0 20px',
                    fontWeight: 'bold'
                  }}
                >
                  Logout
                </Button>
              </motion.div>
            </Space>
          </Header>
        </motion.div>
        
        {/* Content Area */}
        <Content style={{ 
          margin: '24px', 
          padding: '32px', 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          minHeight: 280,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Spin 
            spinning={loading}
            tip="Loading data..."
            size="large"
            indicator={
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <LoadingOutlined style={{ fontSize: 24 }} />
              </motion.div>
            }
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedKey}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                {selectedKey === 'dashboard' && <DashboardContent semesters={semesters} classes={classes} students={students} lecturers={lecturers} enrollments={enrollments} />}
                {selectedKey === 'semesters' && <SemesterManagement semesters={semesters} setSemesters={setSemesters} semesterModal={semesterModal} setSemesterModal={setSemesterModal} semesterForm={semesterForm} />}
                {selectedKey === 'classes' && <ClassManagement classes={classes} setClasses={setClasses} classModal={classModal} setClassModal={setClassModal} classForm={classForm} semesters={semesters} lecturers={lecturers} />}
                {selectedKey === 'students' && <StudentManagement students={students} setStudents={setStudents} studentModal={studentModal} setStudentModal={setStudentModal} studentForm={studentForm} />}
                {selectedKey === 'lecturers' && <LecturerManagement lecturers={lecturers} setLecturers={setLecturers} lecturerModal={lecturerModal} setLecturerModal={setLecturerModal} lecturerForm={lecturerForm} />}
                {selectedKey === 'enrollments' && <EnrollmentManagement enrollments={enrollments} setEnrollments={setEnrollments} enrollmentModal={enrollmentModal} setEnrollmentModal={setEnrollmentModal} enrollmentForm={enrollmentForm} students={students} classes={classes} semesters={semesters} />}
                {selectedKey === 'assignments' && <AssignmentManagement assignments={assignments} setAssignments={setAssignments} assignmentModal={assignmentModal} setAssignmentModal={setAssignmentModal} assignmentForm={assignmentForm} lecturers={lecturers} classes={classes} semesters={semesters} />}
                {selectedKey === 'logs' && <LogHistory logs={logs} />}
              </motion.div>
            </AnimatePresence>
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
}

// Dashboard Component
const DashboardContent = ({ semesters, classes, students, lecturers, enrollments }) => (
  <div>
    <Row gutter={[24, 24]}>
      <Col xs={24} sm={12} lg={6}>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
          <Card style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <Statistic
              title="Active Semesters"
              value={semesters.filter(s => s.status === 'Active').length}
              prefix={<ReadOutlined style={{ color: '#667eea' }} />}
              valueStyle={{ color: '#667eea', fontWeight: 'bold' }}
            />
          </Card>
        </motion.div>
      </Col>
      
      <Col xs={24} sm={12} lg={6}>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
          <Card style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <Statistic
              title="Total Classes"
              value={classes.length}
              prefix={<BookOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
            />
          </Card>
        </motion.div>
      </Col>
      
      <Col xs={24} sm={12} lg={6}>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
          <Card style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <Statistic
              title="Total Students"
              value={students.length}
              prefix={<UserOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16', fontWeight: 'bold' }}
            />
          </Card>
        </motion.div>
      </Col>
      
      <Col xs={24} sm={12} lg={6}>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
          <Card style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <Statistic
              title="Total Lecturers"
              value={lecturers.length}
              prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1', fontWeight: 'bold' }}
            />
          </Card>
        </motion.div>
      </Col>
    </Row>

    <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
      <Col xs={24} lg={12}>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
          <Card title="Recent Enrollments" style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <List
              size="small"
              dataSource={enrollments.slice(0, 5)}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<UserOutlined style={{ color: '#52c41a' }} />}
                    title={item.studentName}
                    description={`Enrolled in ${item.className}`}
                  />
                  <div>{formatDate(item.enrollmentDate)}</div>
                </List.Item>
              )}
            />
          </Card>
        </motion.div>
      </Col>
      
      <Col xs={24} lg={12}>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
          <Card title="System Overview" style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <Descriptions column={1}>
              <Descriptions.Item label="Active Semesters">{semesters.filter(s => s.status === 'Active').length}</Descriptions.Item>
              <Descriptions.Item label="Total Classes">{classes.length}</Descriptions.Item>
              <Descriptions.Item label="Total Students">{students.length}</Descriptions.Item>
              <Descriptions.Item label="Total Lecturers">{lecturers.length}</Descriptions.Item>
              <Descriptions.Item label="Total Enrollments">{enrollments.length}</Descriptions.Item>
            </Descriptions>
          </Card>
        </motion.div>
      </Col>
    </Row>
  </div>
);

// Semester Management Component
const SemesterManagement = ({ semesters, setSemesters, semesterModal, setSemesterModal, semesterForm }) => (
  <div>
    <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
      <Card 
        title="Semester Management" 
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setSemesterModal({ visible: true, mode: 'add', data: {} })}>
            Add Semester
          </Button>
        }
        style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
      >
        <Table
          dataSource={semesters}
          columns={[
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
            { title: 'End Date', dataIndex: 'endDate', key: 'endDate' },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, record) => (
                <Space>
                  <Button type="primary" size="small" icon={<EditOutlined />}>
                    Edit
                  </Button>
                  <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Space>
              ),
            },
          ]}
          rowKey="id"
        />
      </Card>
    </motion.div>
  </div>
);

// Class Management Component
const ClassManagement = ({ classes, setClasses, classModal, setClassModal, classForm, semesters, lecturers }) => (
  <div>
    <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
      <Card 
        title="Class Management" 
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setClassModal({ visible: true, mode: 'add', data: {} })}>
            Add Class
          </Button>
        }
        style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
      >
        <Table
          dataSource={classes}
          columns={[
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Semester', dataIndex: 'semesterName', key: 'semesterName' },
            { title: 'Lecturer', dataIndex: 'lecturerName', key: 'lecturerName' },
            { title: 'Capacity', dataIndex: 'capacity', key: 'capacity' },
            { title: 'Enrolled', dataIndex: 'enrolledCount', key: 'enrolledCount' },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, record) => (
                <Space>
                  <Button type="primary" size="small" icon={<EditOutlined />}>
                    Edit
                  </Button>
                  <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Space>
              ),
            },
          ]}
          rowKey="id"
        />
      </Card>
    </motion.div>
  </div>
);

// Student Management Component
const StudentManagement = ({ students, setStudents, studentModal, setStudentModal, studentForm }) => (
  <div>
    <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
      <Card 
        title="Student Management" 
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setStudentModal({ visible: true, mode: 'add', data: {} })}>
            Add Student
          </Button>
        }
        style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
      >
        <Table
          dataSource={students}
          columns={[
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Email', dataIndex: 'email', key: 'email' },
            { title: 'Student ID', dataIndex: 'studentId', key: 'studentId' },
            { title: 'Major', dataIndex: 'major', key: 'major' },
            { title: 'Enrollment Date', dataIndex: 'enrollmentDate', key: 'enrollmentDate' },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, record) => (
                <Space>
                  <Button type="primary" size="small" icon={<EditOutlined />}>
                    Edit
                  </Button>
                  <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Space>
              ),
            },
          ]}
          rowKey="id"
        />
      </Card>
    </motion.div>
  </div>
);

// Lecturer Management Component
const LecturerManagement = ({ lecturers, setLecturers, lecturerModal, setLecturerModal, lecturerForm }) => (
  <div>
    <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
      <Card 
        title="Lecturer Management" 
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setLecturerModal({ visible: true, mode: 'add', data: {} })}>
            Add Lecturer
          </Button>
        }
        style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
      >
        <Table
          dataSource={lecturers}
          columns={[
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Email', dataIndex: 'email', key: 'email' },
            { title: 'Department', dataIndex: 'department', key: 'department' },
            { title: 'Specialization', dataIndex: 'specialization', key: 'specialization' },
            { title: 'Hire Date', dataIndex: 'hireDate', key: 'hireDate' },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, record) => (
                <Space>
                  <Button type="primary" size="small" icon={<EditOutlined />}>
                    Edit
                  </Button>
                  <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Space>
              ),
            },
          ]}
          rowKey="id"
        />
      </Card>
    </motion.div>
  </div>
);

// Enrollment Management Component
const EnrollmentManagement = ({ enrollments, setEnrollments, enrollmentModal, setEnrollmentModal, enrollmentForm, students, classes, semesters }) => (
  <div>
    <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
      <Card 
        title="Enrollment Management" 
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setEnrollmentModal({ visible: true, data: {} })}>
            Add Enrollment
          </Button>
        }
        style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
      >
        <Table
          dataSource={enrollments}
          columns={[
            { title: 'Student', dataIndex: 'studentName', key: 'studentName' },
            { title: 'Class', dataIndex: 'className', key: 'className' },
            { title: 'Semester', dataIndex: 'semesterName', key: 'semesterName' },
            { title: 'Enrollment Date', dataIndex: 'enrollmentDate', key: 'enrollmentDate' },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, record) => (
                <Space>
                  <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
                    Unenroll
                  </Button>
                </Space>
              ),
            },
          ]}
          rowKey="id"
        />
      </Card>
    </motion.div>
  </div>
);

// Assignment Management Component
const AssignmentManagement = ({ assignments, setAssignments, assignmentModal, setAssignmentModal, assignmentForm, lecturers, classes, semesters }) => (
  <div>
    <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
      <Card 
        title="Assignment Management" 
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAssignmentModal({ visible: true, data: {} })}>
            Add Assignment
          </Button>
        }
        style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
      >
        <Table
          dataSource={assignments}
          columns={[
            { title: 'Lecturer', dataIndex: 'lecturerName', key: 'lecturerName' },
            { title: 'Class', dataIndex: 'className', key: 'className' },
            { title: 'Semester', dataIndex: 'semesterName', key: 'semesterName' },
            { title: 'Assignment Date', dataIndex: 'assignmentDate', key: 'assignmentDate' },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, record) => (
                <Space>
                  <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
                    Remove
                  </Button>
                </Space>
              ),
            },
          ]}
          rowKey="id"
        />
      </Card>
    </motion.div>
  </div>
);

// Log History Component
const LogHistory = ({ logs }) => (
  <div>
    <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
      <Card title="Log History" style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Table
          dataSource={logs}
          columns={[
            { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
            { title: 'Action', dataIndex: 'action', key: 'action' },
            { title: 'User', dataIndex: 'user', key: 'user' },
            { title: 'Details', dataIndex: 'details', key: 'details' },
          ]}
          rowKey="id"
        />
      </Card>
    </motion.div>
  </div>
);

export default AcademicAffairsPortal; 