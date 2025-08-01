import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Button,
  Input,
  Form,
  message,
  Tag,
  Row,
  Col,
  Typography,
  Space,
  Avatar,
  Badge,
  Divider,
  List,
  Steps,
  Alert,
  Descriptions,
  Statistic,
  Progress,
  Switch,
  DatePicker,
  Select,
  Modal,
  Drawer,
  Tabs,
  Result,
  Empty,
  Skeleton,
  Spin,
  notification
} from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftOutlined,
  ShoppingOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  ToolOutlined,
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
  EnvironmentOutlined,
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
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LoadingOutlined,
  RollbackOutlined,
  WalletOutlined,
  GiftOutlined,
  CrownOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { rentalAPI, walletAPI } from './api';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

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

function RentalRequestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKit = location.state?.kit;
  const user = location.state?.user;

  const [currentStep, setCurrentStep] = useState(0);
  const [rentalData, setRentalData] = useState({
    reason: '',
    purpose: '',
    duration: '',
    startDate: '',
    endDate: '',
    totalCost: 0
  });
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!selectedKit || !user) {
      navigate('/');
      return;
    }
    fetchWallet();
    calculateTotalCost();
  }, [selectedKit, user, navigate]);

  const fetchWallet = async () => {
    try {
      const data = await walletAPI.getWallet();
      setWallet(data.wallet);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const calculateTotalCost = () => {
    if (selectedKit && rentalData.duration) {
      const days = parseInt(rentalData.duration);
      const dailyRate = selectedKit.price / 30; // Assuming monthly rate, convert to daily
      const total = days * dailyRate;
      setRentalData(prev => ({ ...prev, totalCost: total }));
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      // Validate rental details
      if (!rentalData.reason || !rentalData.purpose || !rentalData.duration || !rentalData.startDate || !rentalData.endDate) {
        message.error('Please fill in all required fields');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
    setStatusMessage('');
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setStatusMessage('');
  };

  const handleSubmitRental = async () => {
    setLoading(true);
    setStatusMessage('');

    try {
      // Check if wallet has enough balance
      if (wallet.balance < rentalData.totalCost) {
        message.error('Insufficient wallet balance. Please top up your wallet.');
        setLoading(false);
        return;
      }

      // Submit rental request
      await rentalAPI.submitRentalRequest({
        kitId: selectedKit.id,
        kitName: selectedKit.name,
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        reason: rentalData.reason,
        purpose: rentalData.purpose,
        duration: rentalData.duration,
        startDate: rentalData.startDate,
        endDate: rentalData.endDate,
        totalCost: rentalData.totalCost,
        status: 'PENDING_APPROVAL'
      });

      // Deduct money from wallet
      await walletAPI.deduct(rentalData.totalCost, `Rental request for ${selectedKit.name}`);
      
      message.success('Rental request submitted successfully! Waiting for admin approval.');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      message.error('Network error. Please try again.');
    }
    
    setLoading(false);
  };

  const steps = [
    {
      title: 'Rental Details',
      icon: <ShoppingOutlined />,
    },
    {
      title: 'Payment & Confirmation',
      icon: <DollarOutlined />,
    }
  ];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <Card 
              title="Kit Information" 
              style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '24px' }}
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Descriptions column={1}>
                    <Descriptions.Item label="Kit Name">{selectedKit?.name}</Descriptions.Item>
                    <Descriptions.Item label="Category">{selectedKit?.category}</Descriptions.Item>
                    <Descriptions.Item label="Daily Rate">{(selectedKit?.price / 30).toLocaleString()} VND</Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col xs={24} md={12}>
                  <Descriptions column={1}>
                    <Descriptions.Item label="Location">{selectedKit?.location}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                      <Tag color={selectedKit?.status === 'AVAILABLE' ? 'success' : 'warning'}>
                        {selectedKit?.status}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </Card>

            <Card 
              title="Rental Details" 
              style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            >
              <Form layout="vertical">
                <Row gutter={[24, 24]}>
                  <Col xs={24}>
                    <Form.Item label="Reason for Rental" required>
                      <TextArea
                        rows={3}
                        placeholder="Please explain why you need to rent this kit..."
                        value={rentalData.reason}
                        onChange={(e) => setRentalData({ ...rentalData, reason: e.target.value })}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item label="Purpose/Project Description" required>
                      <TextArea
                        rows={3}
                        placeholder="Describe your project or purpose for using this kit..."
                        value={rentalData.purpose}
                        onChange={(e) => setRentalData({ ...rentalData, purpose: e.target.value })}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label="Duration (days)" required>
                      <Input
                        type="number"
                        placeholder="Enter duration"
                        value={rentalData.duration}
                        onChange={(e) => {
                          setRentalData({ ...rentalData, duration: e.target.value });
                          setTimeout(calculateTotalCost, 100);
                        }}
                        min={1}
                        max={30}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label="Start Date" required>
                      <DatePicker
                        style={{ width: '100%' }}
                        placeholder="Select start date"
                        onChange={(date, dateString) => setRentalData({ ...rentalData, startDate: dateString })}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label="End Date" required>
                      <DatePicker
                        style={{ width: '100%' }}
                        placeholder="Select end date"
                        onChange={(date, dateString) => setRentalData({ ...rentalData, endDate: dateString })}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <Card 
              title="Payment & Confirmation" 
              style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '24px' }}
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Card title="Rental Summary" size="small">
                    <Descriptions column={1}>
                      <Descriptions.Item label="Kit">{selectedKit?.name}</Descriptions.Item>
                      <Descriptions.Item label="Duration">{rentalData.duration} days</Descriptions.Item>
                      <Descriptions.Item label="Start Date">{rentalData.startDate}</Descriptions.Item>
                      <Descriptions.Item label="End Date">{rentalData.endDate}</Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title="Cost Breakdown" size="small">
                    <Descriptions column={1}>
                      <Descriptions.Item label="Daily Rate">{(selectedKit?.price / 30).toLocaleString()} VND</Descriptions.Item>
                      <Descriptions.Item label="Total Cost">{rentalData.totalCost.toLocaleString()} VND</Descriptions.Item>
                      <Descriptions.Item label="Current Balance">{wallet.balance.toLocaleString()} VND</Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
              </Row>
            </Card>

            <Card 
              title="Wallet Status" 
              style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '24px' }}
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                  <Statistic
                    title="Current Balance"
                    value={wallet.balance}
                    prefix={<DollarOutlined />}
                    suffix="VND"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Statistic
                    title="Required Amount"
                    value={rentalData.totalCost}
                    prefix={<DollarOutlined />}
                    suffix="VND"
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Statistic
                    title="Remaining Balance"
                    value={wallet.balance - rentalData.totalCost}
                    prefix={<DollarOutlined />}
                    suffix="VND"
                    valueStyle={{ color: wallet.balance >= rentalData.totalCost ? '#52c41a' : '#f5222d' }}
                  />
                </Col>
              </Row>
              
              <Divider />
              
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Text>Balance Status:</Text>
                  <Tag color={wallet.balance >= rentalData.totalCost ? 'success' : 'error'}>
                    {wallet.balance >= rentalData.totalCost ? 'Sufficient' : 'Insufficient'}
                  </Tag>
                </div>
                
                {wallet.balance < rentalData.totalCost && (
                  <Alert
                    message="Insufficient Balance"
                    description={`You need ${(rentalData.totalCost - wallet.balance).toLocaleString()} VND more to complete this rental.`}
                    type="warning"
                    showIcon
                  />
                )}
              </Space>
            </Card>

            <Card 
              title="Terms & Conditions" 
              style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            >
              <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                By confirming this rental request, you agree to:
              </Text>
              <List
                size="small"
                dataSource={[
                  `Pay the total amount of ${rentalData.totalCost.toLocaleString()} VND`,
                  `Return the kit by ${rentalData.endDate}`,
                  'Use the kit only for the stated purpose',
                  'Report any damage or issues immediately'
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Text>• {item}</Text>
                  </List.Item>
                )}
              />
            </Card>
          </motion.div>
        );
      default:
        return <Empty description="Unknown step" />;
    }
  };

  if (!selectedKit || !user) {
    return (
      <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <Empty description="No kit selected. Redirecting..." />
            </Card>
          </motion.div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
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
          <Space size="large">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Title level={2} style={{ margin: 0, color: '#2c3e50', fontWeight: 'bold' }}>
                Kit Rental Request
              </Title>
            </motion.div>
          </Space>
          
          <Space size="large">
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
                onClick={() => navigate('/')}
                style={{
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  height: 40,
                  padding: '0 20px',
                  fontWeight: 'bold'
                }}
              >
                Back to Home
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
          tip="Processing request..."
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
              key={currentStep}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              {/* Steps */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Card style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
                  <Steps current={currentStep} items={steps} />
                </Card>
              </motion.div>

              {/* Step Content */}
              {getStepContent(currentStep)}

              {/* Navigation Buttons */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between' }}
              >
                <Button
                  disabled={currentStep === 0}
                  onClick={handleBack}
                  icon={<ArrowLeftOutlined />}
                  size="large"
                  style={{ borderRadius: '12px' }}
                >
                  Back
                </Button>
                
                <Space>
                  {currentStep === steps.length - 1 ? (
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleSubmitRental}
                      disabled={loading || wallet.balance < rentalData.totalCost}
                      icon={<CheckCircleOutlined />}
                      style={{
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      {loading ? 'Submitting...' : 'Submit Rental Request'}
                    </Button>
                  ) : (
                    <Button 
                      type="primary" 
                      onClick={handleNext}
                      size="large"
                      icon={<StepForwardOutlined />}
                      style={{
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Space>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </Spin>
      </Content>
    </Layout>
  );
}

export default RentalRequestPage; 