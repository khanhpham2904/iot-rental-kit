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
      console.log('Mock data loaded successfully');
    } catch (error) {
      console.error('Error loading data:', error);
      message.error('Failed to load data');
    } finally {
      setLoading(false);
    }
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
                {selectedKey === 'kits' && <KitManagement kits={kits} setKits={setKits} />}
                {selectedKey === 'rentals' && <RentalApprovals rentalRequests={rentalRequests} setRentalRequests={setRentalRequests} />}
                {selectedKey === 'refunds' && <RefundApprovals refundRequests={refundRequests} setRefundRequests={setRefundRequests} />}
                {selectedKey === 'groups' && <GroupManagement groups={groups} setGroups={setGroups} />}
                {selectedKey === 'users' && <UserManagement users={users} setUsers={setUsers} />}
                {selectedKey === 'maintenance' && <MaintenanceSchedule maintenanceSchedule={maintenanceSchedule} />}
                {selectedKey === 'settings' && <Settings />}
              </motion.div>
            </AnimatePresence>
          </Spin>
        </Content>
      </Layout>
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
const KitManagement = ({ kits, setKits }) => {
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
const RentalApprovals = ({ rentalRequests, setRentalRequests }) => {
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
        record.status === 'PENDING_APPROVAL' ? (
          <Space>
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
          </Space>
        ) : null
      )
    }
  ];

  const handleApproval = (id, action) => {
    setRentalRequests(prev => prev.map(req => 
      req.id === id ? { 
        ...req, 
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        approvedBy: 'admin@fpt.edu.vn',
        approvalDate: new Date().toISOString()
      } : req
    ));
    
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

// Group Management Component
const GroupManagement = ({ groups, setGroups }) => {
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
    }
  ];

  const handleSubmit = (values) => {
    const newGroup = {
      id: Date.now(),
      ...values,
      members: []
    };
    setGroups(prev => [...prev, newGroup]);
    notification.success({
      message: 'Success',
      description: 'Group created successfully',
      placement: 'topRight',
      duration: 3,
    });
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
                Create Group
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
          <Form.Item name="leader" label="Leader Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lecturer" label="Lecturer Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create
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
const UserManagement = ({ users, setUsers }) => {
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