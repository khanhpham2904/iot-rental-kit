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
  notification, 
  Transfer, 
  Popconfirm, 
  Radio, 
  Checkbox,
  InputNumber
} from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import QRCode from 'qrcode';
import { saveAs } from 'file-saver';
import {
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  ToolOutlined,
  ShoppingOutlined,
  FileTextOutlined,
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
  BookOutlined,
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
  SwapLeftOutlined,
  SwapRightOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
  RollbackOutlined,
  EnterOutlined,
  ExportOutlined,
  ImportOutlined,
  SaveOutlined,
  PrinterOutlined,
  ScanOutlined,
  QrcodeOutlined,
  BarcodeOutlined,
  KeyOutlined,
  LockOutlined,
  UnlockOutlined,
  SafetyOutlined,
  ShieldOutlined,
  FireOutlined,
  ThunderboltFilled,
  CloudOutlined,
  CloudFilled,
  CloudDownloadOutlined,
  CloudUploadOutlined,
  CloudSyncOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  HddOutlined,
  UsbOutlined,
  ApiOutlined,
  CodeOutlined,
  BugFilled,
  CodeFilled,
  ExperimentFilled,
  ToolFilled,
  BuildFilled,
  CarFilled,
  HomeFilled,
  BookFilled,
  RobotFilled,
  WifiFilled,
  ThunderboltFilled as ThunderboltFilledIcon,
  BulbFilled,
  HeartFilled,
  StarFilled,
  LikeFilled,
  DislikeFilled,
  QuestionCircleFilled,
  InfoCircleFilled,
  WarningFilled,
  CheckCircleFilled,
  StopFilled,
  PlayCircleFilled,
  PauseCircleFilled,
  StepForwardFilled,
  StepBackwardFilled,
  FastForwardFilled,
  FastBackwardFilled,
  ShuffleFilled,
  RetweetFilled,
  SwapFilled,
  SwapLeftFilled,
  SwapRightFilled,
  ArrowUpFilled,
  ArrowDownFilled,
  ArrowLeftFilled,
  ArrowRightFilled,
  DoubleLeftFilled,
  DoubleRightFilled,
  VerticalLeftFilled,
  VerticalRightFilled,
  RollbackFilled,
  EnterFilled,
  ExportFilled,
  ImportFilled,
  SaveFilled,
  PrinterFilled,
  ScanFilled,
  QrcodeFilled,
  BarcodeFilled,
  KeyFilled,
  LockFilled,
  UnlockFilled,
  SafetyFilled,
  ShieldFilled,
  FireFilled,
  CloudFilled as CloudFilledIcon,
  CloudDownloadFilled,
  CloudUploadFilled,
  CloudSyncFilled,
  CloudServerFilled,
  DatabaseFilled,
  HddFilled,
  UsbFilled,
  ApiFilled,
  CodeFilled as CodeFilledIcon,
  LoadingOutlined
} from '@ant-design/icons';
import { mockKits, mockGroups, mockUsers, mockRentalRequests, mockRefundRequests, mockRolePermissions, mockSystemStats, mockMaintenanceSchedule } from './mocks';

const { Header, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Step } = Steps;
const { RangePicker } = DatePicker;

function AdminPortal({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [kits, setKits] = useState([]);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [rentalRequests, setRentalRequests] = useState([]);
  const [refundRequests, setRefundRequests] = useState([]);
  const [maintenanceSchedule, setMaintenanceSchedule] = useState([]);
  const [systemStats, setSystemStats] = useState({});
  
  // Modal states
  const [kitModalVisible, setKitModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Import/Export states
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importType, setImportType] = useState('students');
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [groupMembersModalVisible, setGroupMembersModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  // Kit Inspection and Fine Management states
  const [kitInspectionModalVisible, setKitInspectionModalVisible] = useState(false);
  const [selectedKit, setSelectedKit] = useState(null);
  const [selectedRental, setSelectedRental] = useState(null);
  const [damageAssessment, setDamageAssessment] = useState({});
  const [fineAmount, setFineAmount] = useState(0);
  const [fines, setFines] = useState([]);
  
  // Form instances
  const [kitForm] = Form.useForm();
  const [userForm] = Form.useForm();
  const [groupForm] = Form.useForm();

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

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const sidebarVariants = {
    open: { width: 200, transition: { duration: 0.3, ease: "easeInOut" } },
    closed: { width: 80, transition: { duration: 0.3, ease: "easeInOut" } }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    hover: {
      x: 5,
      transition: { duration: 0.2 }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Simulate API calls with mock data
      console.log('Loading mock data...');
      setKits(mockKits);
      setGroups(mockGroups);
      setUsers(mockUsers);
      setRentalRequests(mockRentalRequests);
      setRefundRequests(mockRefundRequests);
      setMaintenanceSchedule(mockMaintenanceSchedule);
      setSystemStats(mockSystemStats);
      
      // Load available students for group management
      const studentUsers = mockUsers.filter(user => user.role === 'student');
      setAvailableStudents(studentUsers);
      
      console.log('Mock data loaded successfully');
    } catch (error) {
      console.error('Error loading data:', error);
      message.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Import/Export Functions
  const exportToExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(dataBlob, `${filename}.xlsx`);
  };

  const importFromExcel = (file, type) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleExportStudents = () => {
    const studentData = users.filter(user => user.role === 'student').map(user => ({
      'Student ID': user.id,
      'Name': user.name,
      'Email': user.email,
      'Role': user.role,
      'Status': user.status,
      'Created Date': user.createdAt,
      'Last Login': user.lastLogin
    }));
    exportToExcel(studentData, 'students_list');
    notification.success({
      message: 'Export Successful',
      description: 'Student list exported to Excel file',
      placement: 'topRight',
    });
  };

  const handleExportKits = () => {
    const kitData = kits.map(kit => ({
      'Kit ID': kit.id,
      'Name': kit.name,
      'Category': kit.category,
      'Quantity': kit.quantity,
      'Price': kit.price,
      'Status': kit.status,
      'Location': kit.location,
      'Description': kit.description
    }));
    exportToExcel(kitData, 'kits_list');
    notification.success({
      message: 'Export Successful',
      description: 'Kit list exported to Excel file',
      placement: 'topRight',
    });
  };

  const handleImportStudents = async (file) => {
    try {
      const importedData = await importFromExcel(file, 'students');
      const newStudents = importedData.map((student, index) => ({
        id: Date.now() + index,
        name: student.Name || student.name,
        email: student.Email || student.email,
        role: 'student',
        status: 'Active',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        password: 'default123' // Default password for imported students
      }));
      
      setUsers(prev => [...prev, ...newStudents]);
      setAvailableStudents(prev => [...prev, ...newStudents]);
      
      notification.success({
        message: 'Import Successful',
        description: `${newStudents.length} students imported successfully`,
        placement: 'topRight',
      });
    } catch (error) {
      notification.error({
        message: 'Import Failed',
        description: 'Failed to import students. Please check file format.',
        placement: 'topRight',
      });
    }
  };

  const handleImportKits = async (file) => {
    try {
      const importedData = await importFromExcel(file, 'kits');
      const newKits = importedData.map((kit, index) => ({
        id: Date.now() + index,
        name: kit.Name || kit.name,
        category: kit.Category || kit.category || 'Basic',
        quantity: parseInt(kit.Quantity || kit.quantity) || 1,
        price: parseInt(kit.Price || kit.price) || 0,
        status: 'AVAILABLE',
        location: kit.Location || kit.location || 'Lab 1',
        description: kit.Description || kit.description || '',
        lastMaintenance: new Date().toISOString(),
        nextMaintenance: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        components: []
      }));
      
      setKits(prev => [...prev, ...newKits]);
      
      notification.success({
        message: 'Import Successful',
        description: `${newKits.length} kits imported successfully`,
        placement: 'topRight',
      });
    } catch (error) {
      notification.error({
        message: 'Import Failed',
        description: 'Failed to import kits. Please check file format.',
        placement: 'topRight',
      });
    }
  };

  // Group Management Functions
  const generateRandomStudents = (groupId, count = 3) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    // Get students not already in this group or any other group
    const availableStudentsForGroup = availableStudents.filter(student => 
      !groups.some(g => 
        g.members && 
        g.members.includes(student.email)
      )
    );
    
    if (availableStudentsForGroup.length === 0) {
      notification.warning({
        message: 'No Available Students',
        description: 'All students are already assigned to groups',
        placement: 'topRight',
      });
      return;
    }
    
    const shuffled = availableStudentsForGroup.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, availableStudentsForGroup.length));
    const selectedEmails = selected.map(student => student.email);
    
    setGroups(prev => prev.map(g => 
      g.id === groupId 
        ? { ...g, members: [...(g.members || []), ...selectedEmails] }
        : g
    ));
    
    notification.success({
      message: 'Additional Students Added',
      description: `${selectedEmails.length} additional students randomly assigned to the group`,
      placement: 'topRight',
    });
  };

  const adjustGroupMembers = (group) => {
    setSelectedGroup(group);
    setSelectedStudents(group.members || []);
    setGroupMembersModalVisible(true);
  };

  const saveGroupMembers = () => {
    setGroups(prev => prev.map(group => 
      group.id === selectedGroup.id 
        ? { ...group, members: selectedStudents }
        : group
    ));
    
    setGroupMembersModalVisible(false);
    setSelectedGroup(null);
    setSelectedStudents([]);
    
    notification.success({
      message: 'Group Updated',
      description: 'Group members updated successfully',
      placement: 'topRight',
    });
  };

  const generateQRCode = async (rentalId, kitName, userName) => {
    try {
      const qrData = JSON.stringify({
        rentalId,
        kitName,
        userName,
        generatedAt: new Date().toISOString(),
        type: 'rental_approval'
      });
      
      const qrCodeDataURL = await QRCode.toDataURL(qrData);
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
    }
  };

  // Kit Inspection and Fine Management Functions
  const openKitInspection = (rental) => {
    const kit = kits.find(k => k.id === rental.kitId);
    if (!kit) {
      notification.error({
        message: 'Kit Not Found',
        description: 'The kit for this rental could not be found.',
        placement: 'topRight',
      });
      return;
    }
    
    setSelectedRental(rental);
    setSelectedKit(kit);
    setDamageAssessment({});
    setFineAmount(0);
    setKitInspectionModalVisible(true);
  };

  const handleComponentDamage = (componentName, isDamaged, damageValue = 0) => {
    setDamageAssessment(prev => ({
      ...prev,
      [componentName]: {
        damaged: isDamaged,
        value: damageValue
      }
    }));
  };

  const calculateFineAmount = () => {
    let totalFine = 0;
    Object.values(damageAssessment).forEach(component => {
      if (component.damaged) {
        totalFine += component.value;
      }
    });
    setFineAmount(totalFine);
    return totalFine;
  };

  const submitKitInspection = () => {
    const totalFine = calculateFineAmount();
    
    if (totalFine > 0) {
      // Find the group leader for this rental
      const group = groups.find(g => 
        g.members && g.members.includes(selectedRental.userEmail)
      );
      
      if (group) {
        const leaderEmail = group.leader;
        const leader = users.find(u => u.email === leaderEmail);
        
        const newFine = {
          id: Date.now(),
          rentalId: selectedRental.id,
          kitId: selectedKit.id,
          kitName: selectedKit.name,
          studentEmail: selectedRental.userEmail,
          studentName: selectedRental.userName,
          leaderEmail: leaderEmail,
          leaderName: leader ? leader.name : 'Unknown',
          damageAssessment: { ...damageAssessment },
          fineAmount: totalFine,
          status: 'pending',
          createdAt: new Date().toISOString(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        };
        
        setFines(prev => [...prev, newFine]);
        
        notification.success({
          message: 'Kit Inspection Completed',
          description: `Fine of ${totalFine.toLocaleString()} VND sent to group leader ${leader ? leader.name : leaderEmail}`,
          placement: 'topRight',
          duration: 5,
        });
      } else {
        notification.warning({
          message: 'No Group Found',
          description: 'Student is not part of any group. Fine will be sent directly to student.',
          placement: 'topRight',
        });
        
        const newFine = {
          id: Date.now(),
          rentalId: selectedRental.id,
          kitId: selectedKit.id,
          kitName: selectedKit.name,
          studentEmail: selectedRental.userEmail,
          studentName: selectedRental.userName,
          leaderEmail: selectedRental.userEmail,
          leaderName: selectedRental.userName,
          damageAssessment: { ...damageAssessment },
          fineAmount: totalFine,
          status: 'pending',
          createdAt: new Date().toISOString(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
        
        setFines(prev => [...prev, newFine]);
      }
    } else {
      notification.success({
        message: 'Kit Inspection Completed',
        description: 'No damage detected. Kit returned successfully.',
        placement: 'topRight',
      });
    }
    
    // Update rental status to returned
    setRentalRequests(prev => prev.map(rental => 
      rental.id === selectedRental.id 
        ? { ...rental, status: 'RETURNED', returnDate: new Date().toISOString() }
        : rental
    ));
    
    setKitInspectionModalVisible(false);
    setSelectedKit(null);
    setSelectedRental(null);
    setDamageAssessment({});
    setFineAmount(0);
  };





  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'kits',
      icon: <ToolOutlined />,
      label: 'Kit Management',
    },
    {
      key: 'rentals',
      icon: <ShoppingOutlined />,
      label: 'Rental Approvals',
    },
    {
      key: 'refunds',
      icon: <RollbackOutlined />,
      label: 'Refund Approvals',
    },
    {
      key: 'fines',
      icon: <DollarOutlined />,
      label: 'Fine Management',
    },
    {
      key: 'groups',
      icon: <TeamOutlined />,
      label: 'Group Management',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'User Management',
    },
    {
      key: 'maintenance',
      icon: <BuildOutlined />,
      label: 'Maintenance',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
      case 'approved':
      case 'active':
        return 'success';
      case 'pending_approval':
      case 'pending':
      case 'in progress':
        return 'warning';
      case 'rejected':
      case 'damaged':
      case 'missing':
      case 'suspended':
        return 'error';
      case 'in-use':
      case 'borrowed':
        return 'processing';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const showNotification = (type, message, description = '') => {
    notification[type]({
      message,
      description,
      placement: 'topRight',
    });
  };

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
            {collapsed ? 'IoT' : 'IoT Kit Rental'}
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
          className="custom-menu"
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
                <Badge count={5} size="small" style={{ cursor: 'pointer' }}>
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
                {selectedKey === 'dashboard' && <DashboardContent systemStats={systemStats} />}
                {selectedKey === 'kits' && <KitManagement kits={kits} setKits={setKits} handleExportKits={handleExportKits} handleImportKits={handleImportKits} />}
                {selectedKey === 'rentals' && <RentalApprovals rentalRequests={rentalRequests} setRentalRequests={setRentalRequests} generateQRCode={generateQRCode} openKitInspection={openKitInspection} />}
                {selectedKey === 'refunds' && <RefundApprovals refundRequests={refundRequests} setRefundRequests={setRefundRequests} />}
                {selectedKey === 'fines' && <FineManagement fines={fines} setFines={setFines} />}
                {selectedKey === 'groups' && <GroupManagement groups={groups} setGroups={setGroups} generateRandomStudents={generateRandomStudents} adjustGroupMembers={adjustGroupMembers} availableStudents={availableStudents} />}
                {selectedKey === 'users' && <UserManagement users={users} setUsers={setUsers} handleExportStudents={handleExportStudents} handleImportStudents={handleImportStudents} />}
                {selectedKey === 'maintenance' && <MaintenanceSchedule maintenanceSchedule={maintenanceSchedule} />}
                {selectedKey === 'settings' && <Settings />}
              </motion.div>
            </AnimatePresence>
          </Spin>
        </Content>
      </Layout>
      
      {/* Group Members Modal */}
      <Modal
        title={`Adjust Members - ${selectedGroup?.name}`}
        open={groupMembersModalVisible}
        onCancel={() => {
          setGroupMembersModalVisible(false);
          setSelectedGroup(null);
          setSelectedStudents([]);
        }}
        onOk={saveGroupMembers}
        width={800}
        centered
        destroyOnClose
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>Available Students:</Text>
          <Text type="secondary" style={{ marginLeft: 8 }}>
            Select students to add to this group
          </Text>
        </div>
        
        <Transfer
          dataSource={availableStudents.map(student => ({
            key: student.email,
            title: student.name,
            description: student.email,
            ...student
          }))}
          titles={['Available Students', 'Group Members']}
          targetKeys={selectedStudents}
          onChange={setSelectedStudents}
          render={item => (
            <div style={{ padding: '8px 0' }}>
              <div style={{ fontWeight: 'bold' }}>{item.title}</div>
              <div style={{ color: '#666', fontSize: '12px' }}>{item.description}</div>
            </div>
          )}
          listStyle={{
            width: 300,
            height: 400,
          }}
          showSearch
          filterOption={(inputValue, item) =>
            item.title.indexOf(inputValue) !== -1 || item.description.indexOf(inputValue) !== -1
          }
        />
        
        <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
          <Text strong>Current Group Members ({selectedStudents.length}):</Text>
          <div style={{ marginTop: 8 }}>
            {selectedStudents.length > 0 ? (
              selectedStudents.map(email => {
                const student = availableStudents.find(s => s.email === email);
                return (
                  <Tag key={email} style={{ margin: '4px' }}>
                    {student ? student.name : email}
                  </Tag>
                );
              })
            ) : (
              <Text type="secondary">No members selected</Text>
            )}
          </div>
        </div>
      </Modal>
      
      {/* Kit Inspection Modal */}
      <Modal
        title={`Kit Inspection - ${selectedKit?.name}`}
        open={kitInspectionModalVisible}
        onCancel={() => {
          setKitInspectionModalVisible(false);
          setSelectedKit(null);
          setSelectedRental(null);
          setDamageAssessment({});
          setFineAmount(0);
        }}
        onOk={submitKitInspection}
        width={800}
        centered
        destroyOnClose
        okText="Submit Inspection"
        cancelText="Cancel"
      >
        {selectedKit && selectedRental && (
          <div>
            <Alert
              message="Kit Return Inspection"
              description={`Inspecting kit returned by ${selectedRental.userName} (${selectedRental.userEmail})`}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Descriptions title="Rental Information" bordered column={2} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Student">{selectedRental.userName}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedRental.userEmail}</Descriptions.Item>
              <Descriptions.Item label="Kit">{selectedKit.name}</Descriptions.Item>
              <Descriptions.Item label="Rental ID">#{selectedRental.id}</Descriptions.Item>
            </Descriptions>
            
            <Divider>Component Inspection</Divider>
            
            <div style={{ marginBottom: 16 }}>
              <Text strong>Check each component for damage:</Text>
            </div>
            
            {selectedKit.components?.map((component, index) => (
              <Card 
                key={index} 
                size="small" 
                style={{ marginBottom: 8 }}
                title={
                  <Space>
                    <Text strong>{component.name}</Text>
                    <Tag color={component.condition === 'New' ? 'green' : 'orange'}>
                      {component.condition}
                    </Tag>
                  </Space>
                }
              >
                <Row gutter={16} align="middle">
                  <Col span={12}>
                    <Text>Quantity: {component.quantity}</Text>
                  </Col>
                  <Col span={12}>
                    <Space>
                      <Checkbox
                        checked={damageAssessment[component.name]?.damaged || false}
                        onChange={(e) => handleComponentDamage(component.name, e.target.checked, e.target.checked ? 50000 : 0)}
                      >
                        Damaged
                      </Checkbox>
                      {damageAssessment[component.name]?.damaged && (
                        <InputNumber
                          placeholder="Damage Value (VND)"
                          value={damageAssessment[component.name]?.value || 0}
                          onChange={(value) => handleComponentDamage(component.name, true, value || 0)}
                          style={{ width: 150 }}
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                      )}
                    </Space>
                  </Col>
                </Row>
              </Card>
            ))}
            
            <Divider />
            
            <Alert
              message={`Total Fine: ${fineAmount.toLocaleString()} VND`}
              description={
                fineAmount > 0 
                  ? "This fine will be sent to the group leader if the student is part of a group, otherwise to the student directly."
                  : "No damage detected. Kit will be returned successfully."
              }
              type={fineAmount > 0 ? "warning" : "success"}
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            {fineAmount > 0 && (
              <Alert
                message="Fine Details"
                description={
                  <div>
                    {Object.entries(damageAssessment).map(([component, assessment]) => (
                      assessment.damaged && (
                        <div key={component} style={{ marginBottom: 4 }}>
                          <Text strong>{component}:</Text> {assessment.value.toLocaleString()} VND
                        </div>
                      )
                    ))}
                  </div>
                }
                type="warning"
                showIcon
              />
            )}
          </div>
        )}
      </Modal>
    </Layout>
  );
}

// Dashboard Component
const DashboardContent = ({ systemStats }) => {
  // Animation variants for dashboard
  const statCardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -8,
      scale: 1.05,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: systemStats.totalUsers || 0,
      icon: <UserOutlined />,
      color: '#1890ff',
      suffix: 'users'
    },
    {
      title: 'Available Kits',
      value: systemStats.availableKits || 0,
      icon: <ToolOutlined />,
      color: '#52c41a',
      suffix: 'kits'
    },
    {
      title: 'Pending Approvals',
      value: systemStats.pendingApprovals || 0,
      icon: <ClockCircleOutlined />,
      color: '#faad14',
      suffix: 'requests'
    },
    {
      title: 'Monthly Revenue',
      value: systemStats.monthlyRevenue || 0,
      icon: <DollarOutlined />,
      color: '#722ed1',
      suffix: 'VND'
    }
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        {statCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <motion.div
              custom={index}
              variants={statCardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <Card
                style={{
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
                bodyStyle={{ padding: '32px' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
                  style={{
                    display: 'inline-block',
                    padding: '12px',
                    borderRadius: '50%',
                    background: `${stat.color}15`,
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ color: stat.color, fontSize: '24px' }}>
                    {stat.icon}
                  </div>
                </motion.div>
                <Statistic
                  title={
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.7, duration: 0.3 }}
                    >
                      {stat.title}
                    </motion.div>
                  }
                  value={stat.value}
                  suffix={stat.suffix}
                  valueStyle={{ 
                    color: stat.color, 
                    fontSize: '28px',
                    fontWeight: 'bold'
                  }}
                  prefix={null}
                />
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Card 
              title="Recent Activity" 
              extra={<a href="#" style={{ color: '#667eea', fontWeight: 'bold' }}>View All</a>}
              style={{
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                overflow: 'hidden'
              }}
              headStyle={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                borderBottom: 'none',
                borderRadius: '20px 20px 0 0'
              }}
            >
              <Timeline>
                {systemStats.recentActivity?.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
                  >
                    <Timeline.Item color="blue">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                      >
                        {activity.action}
                      </motion.p>
                      <motion.p 
                        style={{ fontSize: 12, color: '#999' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 + index * 0.1, duration: 0.3 }}
                      >
                        {activity.user} • {activity.time}
                      </motion.p>
                    </Timeline.Item>
                  </motion.div>
                ))}
              </Timeline>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <Card 
              title="Popular Kits" 
              extra={<a href="#" style={{ color: '#667eea', fontWeight: 'bold' }}>View All</a>}
              style={{
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                overflow: 'hidden'
              }}
              headStyle={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                borderBottom: 'none',
                borderRadius: '20px 20px 0 0'
              }}
            >
              <List
                dataSource={systemStats.popularKits || []}
                renderItem={(item, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                  >
                    <List.Item>
                      <List.Item.Meta
                        title={item.name}
                        description={`${item.rentals} rentals`}
                      />
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Tag color="blue">{item.rentals} rentals</Tag>
                      </motion.div>
                    </List.Item>
                  </motion.div>
                )}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

// Kit Management Component
const KitManagement = ({ kits, setKits, handleExportKits, handleImportKits }) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingKit, setEditingKit] = useState(null);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Button type="link" onClick={() => showKitDetails(record)}>
          {text}
        </Button>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color={category === 'Advanced' ? 'orange' : category === 'Professional' ? 'red' : 'default'}>
          {category}
        </Tag>
      )
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => price ? `${price.toLocaleString()} VND` : 'N/A'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'AVAILABLE' ? 'green' : status === 'IN-USE' ? 'orange' : 'red'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => editKit(record)}>
              Edit
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button type="default" size="small" icon={<EyeOutlined />} onClick={() => showKitDetails(record)}>
              Details
            </Button>
          </motion.div>
        </Space>
      )
    }
  ];

  const showKitDetails = (kit) => {
    Modal.info({
      title: 'Kit Details',
      width: 600,
      content: (
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Name">{kit.name}</Descriptions.Item>
          <Descriptions.Item label="Category">{kit.category}</Descriptions.Item>
          <Descriptions.Item label="Quantity">{kit.quantity}</Descriptions.Item>
          <Descriptions.Item label="Price">{kit.price ? `${kit.price.toLocaleString()} VND` : 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Status">{kit.status}</Descriptions.Item>
          <Descriptions.Item label="Location">{kit.location}</Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>{kit.description}</Descriptions.Item>
        </Descriptions>
      )
    });
  };

  const editKit = (kit) => {
    setEditingKit(kit);
    form.setFieldsValue(kit);
    setModalVisible(true);
  };

  const handleSubmit = (values) => {
    if (editingKit) {
      setKits(prev => prev.map(kit => kit.id === editingKit.id ? { ...kit, ...values } : kit));
      notification.success({
        message: 'Success',
        description: 'Kit updated successfully',
        placement: 'topRight',
        duration: 3,
      });
    } else {
      const newKit = {
        id: Date.now(),
        ...values,
        status: 'AVAILABLE'
      };
      setKits(prev => [...prev, newKit]);
      notification.success({
        message: 'Success',
        description: 'Kit added successfully',
        placement: 'topRight',
        duration: 3,
      });
    }
    setModalVisible(false);
    setEditingKit(null);
    form.resetFields();
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          title="Kit Management"
          extra={
            <Space>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload
                  accept=".xlsx,.xls"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    handleImportKits(file);
                    return false;
                  }}
                >
                  <Button 
                    icon={<ImportOutlined />}
                    style={{
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                      border: 'none',
                      fontWeight: 'bold',
                      color: '#fff'
                    }}
                  >
                    Import Kits
                  </Button>
                </Upload>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  icon={<ExportOutlined />}
                  onClick={handleExportKits}
                  style={{
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                    border: 'none',
                    fontWeight: 'bold',
                    color: '#fff'
                  }}
                >
                  Export Kits
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => setModalVisible(true)}
                  style={{
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Add Kit
                </Button>
              </motion.div>
            </Space>
          }
          style={{
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            overflow: 'hidden'
          }}
          headStyle={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            borderBottom: 'none',
            borderRadius: '20px 20px 0 0'
          }}
        >
          <Table 
            columns={columns} 
            dataSource={kits} 
            rowKey="id"
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
          />
        </Card>
      </motion.div>

      <Modal
        title={editingKit ? 'Edit Kit' : 'Add Kit'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingKit(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
        centered
        destroyOnClose
        maskClosable={false}
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Kit Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select>
              <Option value="Basic">Basic</Option>
              <Option value="Advanced">Advanced</Option>
              <Option value="Professional">Professional</Option>
            </Select>
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item name="price" label="Price">
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Space>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button type="primary" htmlType="submit">
                  {editingKit ? 'Update' : 'Add'}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={() => {
                  setModalVisible(false);
                  setEditingKit(null);
                  form.resetFields();
                }}>
                  Cancel
                </Button>
              </motion.div>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// Rental Approvals Component
const RentalApprovals = ({ rentalRequests, setRentalRequests, generateQRCode, openKitInspection }) => {
  const columns = [
    {
      title: 'Request ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => `#${id}`
    },
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div>
          <div>{record.userName}</div>
          <Text type="secondary">{record.userEmail}</Text>
        </div>
      )
    },
    {
      title: 'Kit',
      dataIndex: 'kitName',
      key: 'kitName'
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => `${duration} days`
    },
    {
      title: 'Total Cost',
      dataIndex: 'totalCost',
      key: 'totalCost',
      render: (cost) => `${cost.toLocaleString()} VND`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'PENDING_APPROVAL' ? 'orange' : status === 'APPROVED' ? 'green' : 'red'}>
          {status.replace('_', ' ')}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'PENDING_APPROVAL' ? (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={() => handleApproval(record.id, 'approve')}>
                  Approve
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button type="primary" danger size="small" icon={<CloseCircleOutlined />} onClick={() => handleApproval(record.id, 'reject')}>
                  Reject
                </Button>
              </motion.div>
            </>
          ) : record.status === 'APPROVED' || record.status === 'BORROWED' ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                type="default" 
                size="small" 
                icon={<BuildOutlined />} 
                onClick={() => openKitInspection(record)}
                style={{
                  background: 'linear-gradient(135deg, #faad14 0%, #d48806 100%)',
                  border: 'none',
                  color: '#fff'
                }}
              >
                Check Kit Status
              </Button>
            </motion.div>
          ) : null}
        </Space>
      )
    }
  ];

  const handleApproval = async (id, action) => {
    const request = rentalRequests.find(req => req.id === id);
    
    if (action === 'approve') {
      // Generate QR code for approved rental
      const qrCodeDataURL = await generateQRCode(id, request.kitName, request.userName);
      
      setRentalRequests(prev => prev.map(req => 
        req.id === id ? { 
          ...req, 
          status: 'APPROVED',
          approvedBy: 'admin@fpt.edu.vn',
          approvalDate: new Date().toISOString(),
          qrCode: qrCodeDataURL
        } : req
      ));
      
      // Show QR code in modal
      if (qrCodeDataURL) {
        Modal.info({
          title: 'Rental Approved - QR Code Generated',
          width: 400,
          content: (
            <div style={{ textAlign: 'center' }}>
              <img 
                src={qrCodeDataURL} 
                alt="QR Code" 
                style={{ width: 200, height: 200, marginBottom: 16 }}
              />
              <p><strong>Rental ID:</strong> #{id}</p>
              <p><strong>Kit:</strong> {request.kitName}</p>
              <p><strong>Student:</strong> {request.userName}</p>
              <p style={{ color: '#52c41a', fontWeight: 'bold' }}>
                QR Code has been generated for this rental approval!
              </p>
            </div>
          )
        });
      }
    } else {
      setRentalRequests(prev => prev.map(req => 
        req.id === id ? { 
          ...req, 
          status: 'REJECTED',
          approvedBy: 'admin@fpt.edu.vn',
          approvalDate: new Date().toISOString()
        } : req
      ));
    }
    
    // Animated success message
    notification.success({
      message: 'Success',
      description: `Request ${action}d successfully`,
      placement: 'topRight',
      duration: 3,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        title="Rental Request Management"
        style={{
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          overflow: 'hidden'
        }}
        headStyle={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          borderBottom: 'none',
          borderRadius: '20px 20px 0 0'
        }}
      >
        <Table 
          columns={columns} 
          dataSource={rentalRequests} 
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
        />
      </Card>
    </motion.div>
  );
};

// Refund Approvals Component
const RefundApprovals = ({ refundRequests, setRefundRequests }) => {
  const columns = [
    {
      title: 'Request ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => `#${id}`
    },
    {
      title: 'User',
      dataIndex: 'userEmail',
      key: 'userEmail'
    },
    {
      title: 'Role',
      dataIndex: 'userRole',
      key: 'userRole',
      render: (role) => <Tag color="blue">{role}</Tag>
    },
    {
      title: 'Kit',
      dataIndex: 'kitName',
      key: 'kitName'
    },
    {
      title: 'Refund Amount',
      dataIndex: 'refundAmount',
      key: 'refundAmount',
      render: (amount) => `${amount?.toLocaleString()} VND`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'pending' ? 'orange' : status === 'approved' ? 'green' : 'red'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        record.status === 'pending' ? (
          <Space>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={() => handleRefundApproval(record.id, 'approve')}>
                Approve
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button type="primary" danger size="small" icon={<CloseCircleOutlined />} onClick={() => handleRefundApproval(record.id, 'reject')}>
                Reject
              </Button>
            </motion.div>
          </Space>
        ) : record.qrCode ? (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Tag color="blue">QR Generated</Tag>
          </motion.div>
        ) : null
      )
    }
  ];

  const handleRefundApproval = (id, action) => {
    setRefundRequests(prev => prev.map(req => 
      req.id === id ? { 
        ...req, 
        status: action === 'approve' ? 'approved' : 'rejected',
        approvedBy: 'admin@fpt.edu.vn',
        approvalDate: new Date().toISOString(),
        qrCode: action === 'approve' ? `REFUND-${new Date().getFullYear()}-${String(id).padStart(3, '0')}` : null
      } : req
    ));
    
    notification.success({
      message: 'Success',
      description: `Refund request ${action}d successfully`,
      placement: 'topRight',
      duration: 3,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        title="Refund Request Management"
        style={{
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          overflow: 'hidden'
        }}
        headStyle={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          borderBottom: 'none',
          borderRadius: '20px 20px 0 0'
        }}
      >
        <Table 
          columns={columns} 
          dataSource={refundRequests} 
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
        />
      </Card>
    </motion.div>
  );
};

// Fine Management Component
const FineManagement = ({ fines, setFines }) => {
  const columns = [
    {
      title: 'Fine ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => `#${id}`
    },
    {
      title: 'Kit',
      dataIndex: 'kitName',
      key: 'kitName'
    },
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (name, record) => (
        <div>
          <div>{name}</div>
          <Text type="secondary">{record.studentEmail}</Text>
        </div>
      )
    },
    {
      title: 'Group Leader',
      dataIndex: 'leaderName',
      key: 'leaderName',
      render: (name, record) => (
        <div>
          <div>{name}</div>
          <Text type="secondary">{record.leaderEmail}</Text>
        </div>
      )
    },
    {
      title: 'Fine Amount',
      dataIndex: 'fineAmount',
      key: 'fineAmount',
      render: (amount) => (
        <Text strong style={{ color: '#cf1322' }}>
          {amount.toLocaleString()} VND
        </Text>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'paid' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="primary" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => showFineDetails(record)}
            >
              Details
            </Button>
          </motion.div>
          {record.status === 'pending' && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                type="default" 
                size="small" 
                icon={<CheckCircleOutlined />}
                onClick={() => markAsPaid(record.id)}
                style={{
                  background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                  border: 'none',
                  color: '#fff'
                }}
              >
                Mark Paid
              </Button>
            </motion.div>
          )}
        </Space>
      )
    }
  ];

  const showFineDetails = (fine) => {
    Modal.info({
      title: 'Fine Details',
      width: 600,
      content: (
        <div>
          <Descriptions bordered column={2} style={{ marginBottom: 16 }}>
            <Descriptions.Item label="Fine ID">#{fine.id}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={fine.status === 'paid' ? 'green' : 'orange'}>
                {fine.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Kit">{fine.kitName}</Descriptions.Item>
            <Descriptions.Item label="Student">{fine.studentName}</Descriptions.Item>
            <Descriptions.Item label="Group Leader">{fine.leaderName}</Descriptions.Item>
            <Descriptions.Item label="Fine Amount">
              <Text strong style={{ color: '#cf1322' }}>
                {fine.fineAmount.toLocaleString()} VND
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Created">{new Date(fine.createdAt).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Due Date">{new Date(fine.dueDate).toLocaleString()}</Descriptions.Item>
          </Descriptions>
          
          <Divider>Damage Assessment</Divider>
          
          {Object.entries(fine.damageAssessment).map(([component, assessment]) => (
            assessment.damaged && (
              <Card key={component} size="small" style={{ marginBottom: 8 }}>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong>{component}</Text>
                  </Col>
                  <Col>
                    <Text type="danger">{assessment.value.toLocaleString()} VND</Text>
                  </Col>
                </Row>
              </Card>
            )
          ))}
        </div>
      )
    });
  };

  const markAsPaid = (fineId) => {
    setFines(prev => prev.map(fine => 
      fine.id === fineId 
        ? { ...fine, status: 'paid', paidDate: new Date().toISOString() }
        : fine
    ));
    
    notification.success({
      message: 'Fine Marked as Paid',
      description: 'The fine has been successfully marked as paid.',
      placement: 'topRight',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        title="Fine Management"
        style={{
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          overflow: 'hidden'
        }}
        headStyle={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          borderBottom: 'none',
          borderRadius: '20px 20px 0 0'
        }}
      >
        <Table 
          columns={columns} 
          dataSource={fines} 
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
        />
      </Card>
    </motion.div>
  );
};

// Group Management Component
const GroupManagement = ({ groups, setGroups, generateRandomStudents, adjustGroupMembers, availableStudents }) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);

  const columns = [
    {
      title: 'Group Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Leader',
      dataIndex: 'leader',
      key: 'leader'
    },
    {
      title: 'Lecturer',
      dataIndex: 'lecturer',
      key: 'lecturer'
    },
    {
      title: 'Members',
      dataIndex: 'members',
      key: 'members',
      render: (members) => (
        <div>
          {members?.map((member, index) => (
            <Tag key={index} style={{ marginBottom: 4 }}>{member}</Tag>
          ))}
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="primary" 
              size="small" 
              icon={<UserOutlined />}
              onClick={() => generateRandomStudents(record.id, 2)}
              style={{
                background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                border: 'none'
              }}
            >
              Add More Students
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="default" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => adjustGroupMembers(record)}
            >
              Adjust Members
            </Button>
          </motion.div>
        </Space>
      )
    }
  ];

  const handleSubmit = (values) => {
    // Get available students for random assignment
    const availableStudentsForGroup = availableStudents.filter(student => 
      !groups.some(group => 
        group.members && 
        group.members.includes(student.email)
      )
    );
    
    let newGroup = {
      id: Date.now(),
      ...values,
      members: []
    };
    
    // If there are available students, assign them randomly
    if (availableStudentsForGroup.length > 0) {
      const shuffled = availableStudentsForGroup.sort(() => 0.5 - Math.random());
      const selectedCount = Math.min(3, availableStudentsForGroup.length); // Assign up to 3 students
      const selectedStudents = shuffled.slice(0, selectedCount);
      const selectedEmails = selectedStudents.map(student => student.email);
      
      // First student becomes the leader
      const leaderEmail = selectedEmails[0];
      
      newGroup = {
        ...newGroup,
        leader: leaderEmail,
        members: selectedEmails
      };
      
      // Update the group with the new leader
      setGroups(prev => [...prev, newGroup]);
      
      notification.success({
        message: 'Group Created Successfully',
        description: `Group created with ${selectedEmails.length} random members. ${selectedStudents[0].name} assigned as leader.`,
        placement: 'topRight',
        duration: 4,
      });
    } else {
      // No available students, create group without members
      setGroups(prev => [...prev, newGroup]);
      notification.warning({
        message: 'Group Created',
        description: 'Group created successfully, but no students are available for assignment.',
        placement: 'topRight',
        duration: 4,
      });
    }
    
    setModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          title="Group Management"
          extra={
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => setModalVisible(true)}
                style={{
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  fontWeight: 'bold'
                }}
              >
                Create Group with Random Members
              </Button>
            </motion.div>
          }
          style={{
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            overflow: 'hidden'
          }}
          headStyle={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            borderBottom: 'none',
            borderRadius: '20px 20px 0 0'
          }}
        >
          <Table 
            columns={columns} 
            dataSource={groups} 
            rowKey="id"
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
          />
        </Card>
      </motion.div>

      <Modal
        title="Create New Group"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Group Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lecturer" label="Lecturer Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Alert
            message="Automatic Member Assignment"
            description="When you create a group, the system will automatically assign up to 3 random available students. The first assigned student will become the group leader."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Group with Random Members
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// User Management Component
const UserManagement = ({ users, setUsers, handleExportStudents, handleImportStudents }) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : role === 'lecturer' ? 'orange' : 'blue'}>
          {role}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => editUser(record)}>
              Edit
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />} onClick={() => deleteUser(record.id)}>
              Delete
            </Button>
          </motion.div>
        </Space>
      )
    }
  ];

  const editUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  const deleteUser = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setUsers(prev => prev.filter(user => user.id !== id));
        notification.success({
          message: 'Success',
          description: 'User deleted successfully',
          placement: 'topRight',
          duration: 3,
        });
      }
    });
  };

  const handleSubmit = (values) => {
    if (editingUser) {
      setUsers(prev => prev.map(user => user.id === editingUser.id ? { ...user, ...values } : user));
      notification.success({
        message: 'Success',
        description: 'User updated successfully',
        placement: 'topRight',
        duration: 3,
      });
    } else {
      const newUser = {
        id: Date.now(),
        ...values,
        status: 'Active',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      setUsers(prev => [...prev, newUser]);
      notification.success({
        message: 'Success',
        description: 'User created successfully',
        placement: 'topRight',
        duration: 3,
      });
    }
    setModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          title="User Management"
          extra={
            <Space>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload
                  accept=".xlsx,.xls"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    handleImportStudents(file);
                    return false;
                  }}
                >
                  <Button 
                    icon={<ImportOutlined />}
                    style={{
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                      border: 'none',
                      fontWeight: 'bold',
                      color: '#fff'
                    }}
                  >
                    Import Students
                  </Button>
                </Upload>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  icon={<ExportOutlined />}
                  onClick={handleExportStudents}
                  style={{
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                    border: 'none',
                    fontWeight: 'bold',
                    color: '#fff'
                  }}
                >
                  Export Students
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => setModalVisible(true)}
                  style={{
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Add User
                </Button>
              </motion.div>
            </Space>
          }
          style={{
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            overflow: 'hidden'
          }}
          headStyle={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            borderBottom: 'none',
            borderRadius: '20px 20px 0 0'
          }}
        >
          <Table 
            columns={columns} 
            dataSource={users} 
            rowKey="id"
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
          />
        </Card>
      </motion.div>

      <Modal
        title={editingUser ? 'Edit User' : 'Add User'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select>
              <Option value="student">Student</Option>
              <Option value="lecturer">Lecturer</Option>
              <Option value="admin">Admin</Option>
              <Option value="academic">Academic Affairs</Option>
              <Option value="leader">Leader</Option>
              <Option value="member">Member</Option>
              <Option value="parent">Parent</Option>
            </Select>
          </Form.Item>
          {!editingUser && (
            <Form.Item name="password" label="Password" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Update' : 'Add'}
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingUser(null);
                form.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// Maintenance Schedule Component
const MaintenanceSchedule = ({ maintenanceSchedule }) => {
  const columns = [
    {
      title: 'Kit Name',
      dataIndex: 'kitName',
      key: 'kitName'
    },
    {
      title: 'Last Maintenance',
      dataIndex: 'lastMaintenance',
      key: 'lastMaintenance',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Next Maintenance',
      dataIndex: 'nextMaintenance',
      key: 'nextMaintenance',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'In Progress' ? 'orange' : 'green'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Technician',
      dataIndex: 'technician',
      key: 'technician'
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        title="Maintenance Schedule"
        style={{
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          overflow: 'hidden'
        }}
        headStyle={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          borderBottom: 'none',
          borderRadius: '20px 20px 0 0'
        }}
      >
        <Table 
          columns={columns} 
          dataSource={maintenanceSchedule} 
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
        />
      </Card>
    </motion.div>
  );
};

// Settings Component
const Settings = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        title="System Settings"
        style={{
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          overflow: 'hidden'
        }}
        headStyle={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          borderBottom: 'none',
          borderRadius: '20px 20px 0 0'
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card 
                title="General Settings" 
                size="small"
                style={{
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  overflow: 'hidden'
                }}
                headStyle={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  borderBottom: 'none',
                  borderRadius: '16px 16px 0 0'
                }}
              >
                <Form layout="vertical">
                  <Form.Item label="System Name">
                    <Input defaultValue="IoT Kit Rental System" />
                  </Form.Item>
                  <Form.Item label="Email Notifications">
                    <Switch defaultChecked />
                  </Form.Item>
                  <Form.Item label="Auto Approve Requests">
                    <Switch />
                  </Form.Item>
                </Form>
              </Card>
            </motion.div>
          </Col>
          <Col span={12}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Card 
                title="Security Settings" 
                size="small"
                style={{
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  overflow: 'hidden'
                }}
                headStyle={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  borderBottom: 'none',
                  borderRadius: '16px 16px 0 0'
                }}
              >
                <Form layout="vertical">
                  <Form.Item label="Session Timeout (minutes)">
                    <Input type="number" defaultValue={30} />
                  </Form.Item>
                  <Form.Item label="Password Policy">
                    <Select defaultValue="medium">
                      <Option value="low">Low</Option>
                      <Option value="medium">Medium</Option>
                      <Option value="high">High</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Two-Factor Authentication">
                    <Switch />
                  </Form.Item>
                </Form>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Card>
    </motion.div>
  );
};

export default AdminPortal; 