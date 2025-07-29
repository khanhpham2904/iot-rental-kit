import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import AdminPortal from './AdminPortal';
import AcademicAffairsPortal from './AcademicAffairsPortal';
import RentalRequestPage from './RentalRequestPage';
import AdminRentalApprovalPage from './AdminRentalApprovalPage';
import AdminRefundApprovalPage from './AdminRefundApprovalPage';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import * as XLSX from 'xlsx';
import { mockLogin, mockGroups, mockKits, mockWallet, mockNotifications, mockReport, mockAssignments } from './mocks';
import { 
  kitAPI, 
  groupAPI, 
  walletAPI, 
  rentalAPI, 
  refundAPI, 
  studentAPI 
} from './api';

function Home({ onLogin, user }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await mockLogin(email, password);
      onLogin(user);
      if (user.role === 'student') {
        navigate('/group');
      } else if (user.role === 'lecturer') {
        navigate('/lecturer');
      } else if (user.role === 'member') {
        navigate('/');
      } else if (user.role === 'admin') {
        navigate('/');
      } else if (user.role === 'academic') {
        navigate('/');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  if (user) {
    return (
      <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4, borderRadius: 4, boxShadow: 6 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight={700}>Welcome, {user.email}</Typography>
          <Typography variant="body1">Role: {user.role}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Card sx={{ p: 4, borderRadius: 4, boxShadow: 8, minWidth: 340, maxWidth: 400, width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <img src={require('./logo.svg').default} alt="Logo" style={{ width: 64, marginBottom: 12 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom>Login</Typography>
        </Box>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <TextField
            label="Email (@fpt.edu.vn)"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            size="medium"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            size="medium"
            fullWidth
            sx={{ mb: 2 }}
          />
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ borderRadius: 2, fontWeight: 700, fontSize: '1.1rem', py: 1.2 }}
          >
            Login
          </Button>
        </form>
      </Card>
    </Box>
  );
}
function StudentPortal({ user }) {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Use mockGroups for student
    const found = mockGroups.find(g => g.members.includes(user.email) || g.leader === user.email);
    setGroup(found || null);
    setLoading(false);
  }, [user]);

  if (loading) return <Typography>Loading group info...</Typography>;
  if (!group) {
    return <Card sx={{ maxWidth: 500, mx: 'auto', mt: 6 }}><CardContent><Typography variant="h5">No Group</Typography><Typography>You are not in any group yet.</Typography></CardContent></Card>;
  }
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Card sx={{ maxWidth: 500, width: '100%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Group Information</Typography>
          <Typography variant="h6">Group: {group.name}</Typography>
          <Typography>Leader: {group.leader}</Typography>
          <Typography>Members: {group.members.join(', ')}</Typography>
          {group.lecturer && <Typography>Lecturer: {group.lecturer}</Typography>}
        </CardContent>
      </Card>
    </Box>
  );
}
function LeaderPortal({ user, onLogout }) {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(mockWallet);
  const [message, setMessage] = useState('');
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kits, setKits] = useState(mockKits);
  const [kitsLoading, setKitsLoading] = useState(false);
  const [selectedKit, setSelectedKit] = useState(null);
  const [kitDetailDialog, setKitDetailDialog] = useState(false);
  const [refundDialog, setRefundDialog] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [refundDate, setRefundDate] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    setLoading(true);
    // Use mockGroups for leader
    const found = mockGroups.find(g => g.leader === user.email);
    setGroup(found || null);
    setLoading(false);
  }, [user]);

  const handleDeposit = async () => {
    setMessage('');
    try {
      // Simulate deposit
      setWallet(prev => ({
        ...prev,
        balance: prev.balance + 100000,
        transactions: [...prev.transactions, {
          type: 'Deposit',
          amount: 100000,
          date: new Date().toISOString().split('T')[0]
        }]
      }));
      setMessage('Deposit successful!');
    } catch (error) {
      setMessage(error.message || 'Deposit failed');
    }
  };

  const handleChooseKit = async (kitName) => {
    // Find the selected kit
    const selectedKit = kits.find(k => k.name === kitName);
    if (!selectedKit) {
      setMessage('Kit not found');
      return;
    }
    
    // Navigate to rental request page
    navigate('/rental-request', { 
      state: { 
        kit: selectedKit, 
        user: user 
      } 
    });
  };

  const handleRefundRequest = () => {
    setRefundDialog(true);
  };

  const handleRefundSubmit = async () => {
    if (!refundReason.trim() || !refundDate) {
      setMessage('Please fill in all fields');
      return;
    }

    try {
      // Simulate refund request submission
      setMessage('Refund request submitted successfully!');
      setRefundDialog(false);
      setRefundReason('');
      setRefundDate('');
    } catch (error) {
      setMessage(error.message || 'Failed to submit refund request');
    }
  };

  const renderDashboard = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Group Overview</Typography>
      
      {loading ? (
        <Typography>Loading group info...</Typography>
      ) : group ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white', mb: 2 }}>
              <CardContent>
                <Typography variant="h4">{group.members.length + 1}</Typography>
                <Typography variant="body2">Total Group Members</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: 'success.main', color: 'white', mb: 2 }}>
              <CardContent>
                <Typography variant="h4">{wallet.balance.toLocaleString()}</Typography>
                <Typography variant="body2">Wallet Balance (VND)</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Group Information</Typography>
                <Typography><strong>Group Name:</strong> {group.name}</Typography>
                <Typography><strong>Members:</strong> {group.members.join(', ')}</Typography>
                <Typography><strong>Lecturer:</strong> {group.lecturer}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Typography>No group found for this leader.</Typography>
      )}
    </Box>
  );

  const renderKitRental = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Kit Rental</Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>Available Kits</Typography>
      {kitsLoading ? (
        <Typography>Loading kits...</Typography>
      ) : kits.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {kits.map((k, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => {
                        setSelectedKit(k);
                        setKitDetailDialog(true);
                      }}
                    >
                      {k.name}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={k.category || 'N/A'} 
                      color={k.category === 'Advanced' ? 'warning' : k.category === 'Professional' ? 'error' : 'default'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{k.quantity}</TableCell>
                  <TableCell>{k.price ? k.price.toLocaleString() + ' VND' : 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={k.status} 
                      color={k.status === 'AVAILABLE' ? 'success' : k.status === 'IN-USE' ? 'warning' : 'error'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={k.quantity === 0 || k.status !== 'AVAILABLE'}
                      onClick={() => handleChooseKit(k.name)}
                    >
                      Rent Kit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No kits available.</Typography>
      )}
    </Box>
  );

  const renderWallet = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Wallet Management</Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" color="primary" gutterBottom>
            Balance: {wallet.balance.toLocaleString()} VND
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleDeposit}
            sx={{ mb: 2 }}
          >
            Deposit 100,000 VND
          </Button>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>Transaction History</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wallet.transactions.map((tx, idx) => (
              <TableRow key={idx}>
                <TableCell>{tx.type}</TableCell>
                <TableCell>{tx.amount.toLocaleString()} VND</TableCell>
                <TableCell>{tx.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderRefundRequests = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Refund Requests</Typography>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleRefundRequest}
        sx={{ mb: 3 }}
      >
        Request Kit Refund
      </Button>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Refund Policy</Typography>
          <Typography variant="body2" paragraph>
            • Early returns: Full refund minus damage fees<br/>
            • On-time returns: Full refund minus damage fees<br/>
            • Late returns: Penalty applied based on delay
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Card sx={{ p: 4, borderRadius: 4, boxShadow: 8, minWidth: 340, maxWidth: 1200, width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src={require('./logo.svg').default} alt="Logo" style={{ width: 48, marginRight: 12 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>Leader Portal</Typography>
          </Box>
          <Button variant="outlined" color="primary" onClick={onLogout} sx={{ fontWeight: 700 }}>Logout</Button>
        </Box>

        {/* Navigation Tabs */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          <Button
            variant={activeTab === 'dashboard' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('dashboard')}
            size="small"
          >
            Dashboard
          </Button>
          <Button
            variant={activeTab === 'kits' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('kits')}
            size="small"
          >
            Kit Rental
          </Button>
          <Button
            variant={activeTab === 'wallet' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('wallet')}
            size="small"
          >
            Wallet
          </Button>
          <Button
            variant={activeTab === 'refunds' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('refunds')}
            size="small"
          >
            Refund Requests
          </Button>
        </Box>

        <CardContent>
          {message && <Alert sx={{ mb: 2 }} severity={message.includes('success') ? 'success' : 'error'}>{message}</Alert>}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && renderDashboard()}

          {/* Kit Rental Tab */}
          {activeTab === 'kits' && renderKitRental()}

          {/* Wallet Tab */}
          {activeTab === 'wallet' && renderWallet()}

          {/* Refund Requests Tab */}
          {activeTab === 'refunds' && renderRefundRequests()}
        </CardContent>
      </Card>

      {/* Kit Detail Dialog */}
      <Dialog open={kitDetailDialog} onClose={() => setKitDetailDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Kit Details</DialogTitle>
        <DialogContent>
          {selectedKit && (
            <Box>
              <Typography variant="h6" gutterBottom>{selectedKit.name}</Typography>
              <Typography variant="body1" color="text.secondary" paragraph>{selectedKit.description}</Typography>
              
              <Typography variant="subtitle1" gutterBottom>Kit Information:</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                <Typography><strong>Category:</strong> {selectedKit.category}</Typography>
                <Typography><strong>Location:</strong> {selectedKit.location}</Typography>
                <Typography><strong>Status:</strong> {selectedKit.status}</Typography>
                <Typography><strong>Price:</strong> {selectedKit.price ? selectedKit.price.toLocaleString() + ' VND' : 'N/A'}</Typography>
                <Typography><strong>Last Maintenance:</strong> {selectedKit.lastMaintenance}</Typography>
                <Typography><strong>Next Maintenance:</strong> {selectedKit.nextMaintenance}</Typography>
              </Box>

              <Typography variant="subtitle1" gutterBottom>Components:</Typography>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Component</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Condition</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedKit.components?.map((component, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{component.name}</TableCell>
                        <TableCell>{component.quantity}</TableCell>
                        <TableCell>
                          <Chip 
                            label={component.condition} 
                            color={component.condition === 'New' ? 'success' : 'default'} 
                            size="small" 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setKitDetailDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Refund Request Dialog */}
      <Dialog open={refundDialog} onClose={() => setRefundDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request Kit Refund</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please provide details for your refund request. Late returns may incur penalties.
          </Typography>
          
          <TextField
            fullWidth
            label="Refund Reason"
            multiline
            rows={3}
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            placeholder="Explain why you want to return the kit..."
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Requested Refund Date"
            type="date"
            value={refundDate}
            onChange={(e) => setRefundDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Refund Policy:</strong><br/>
              • Early returns: Full refund minus damage fees<br/>
              • On-time returns: Full refund minus damage fees<br/>
              • Late returns: Penalty applied based on delay
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRefundDialog(false)}>Cancel</Button>
          <Button onClick={handleRefundSubmit} variant="contained" color="primary">
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
function LecturerPortal({ user, onLogout }) {
  const navigate = useNavigate();
  const [lecturerGroups, setLecturerGroups] = useState([]);
  const [message, setMessage] = useState('');
  const [importType, setImportType] = useState('');
  const [kits, setKits] = useState(mockKits);
  const [kitsLoading, setKitsLoading] = useState(false);
  const [wallet, setWallet] = useState(mockWallet);
  const [selectedKit, setSelectedKit] = useState(null);
  const [kitDetailDialog, setKitDetailDialog] = useState(false);
  const [refundDialog, setRefundDialog] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [refundDate, setRefundDate] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Use mockGroups for lecturer
    setLecturerGroups(mockGroups.filter(g => g.lecturer === user.email));
  }, [user]);

  const handleTopUp = async () => {
    setMessage('');
    try {
      // Simulate top-up
      setWallet(prev => ({
        ...prev,
        balance: prev.balance + 100000,
        transactions: [...prev.transactions, {
          type: 'Top-up',
          amount: 100000,
          date: new Date().toISOString().split('T')[0]
        }]
      }));
      setMessage('Top-up successful!');
    } catch (error) {
      setMessage(error.message || 'Top-up failed');
    }
  };

  const handleChooseKit = async (kitName) => {
    // Find the selected kit
    const selectedKit = kits.find(k => k.name === kitName);
    if (!selectedKit) {
      setMessage('Kit not found');
      return;
    }
    
    // Navigate to rental request page
    navigate('/rental-request', { 
      state: { 
        kit: selectedKit, 
        user: user 
      } 
    });
  };

  const handleRefundRequest = () => {
    setRefundDialog(true);
  };

  const handleRefundSubmit = async () => {
    if (!refundReason.trim() || !refundDate) {
      setMessage('Please fill in all fields');
      return;
    }

    try {
      // Simulate refund request submission
      setMessage('Refund request submitted successfully!');
      setRefundDialog(false);
      setRefundReason('');
      setRefundDate('');
    } catch (error) {
      setMessage(error.message || 'Failed to submit refund request');
    }
  };

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        if (type === 'students') {
          // Simulate student import
          setMessage('Students imported successfully!');
        }
      } catch (error) {
        setMessage('Error processing file');
      }
    };
    reader.readAsBinaryString(file);
  };

  const renderDashboard = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Lecturer Overview</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white', mb: 2 }}>
            <CardContent>
              <Typography variant="h4">{lecturerGroups.length}</Typography>
              <Typography variant="body2">Assigned Groups</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: 'success.main', color: 'white', mb: 2 }}>
            <CardContent>
              <Typography variant="h4">{wallet.balance.toLocaleString()}</Typography>
              <Typography variant="body2">Wallet Balance (VND)</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleRefundRequest}
                >
                  Request Kit Refund
                </Button>
                <Button
                  variant="contained"
                  component="label"
                  onClick={() => setImportType('students')}
                >
                  Import Students
                  <input
                    type="file"
                    hidden
                    accept=".xlsx,.xls"
                    onChange={(e) => handleFileUpload(e, 'students')}
                  />
                </Button>
              </Stack>
              {importType && (
                <Typography variant="body2" color="text.secondary">
                  Upload Excel file with columns: email, name, role
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderGroups = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Assigned Groups</Typography>
      {lecturerGroups.length === 0 ? (
        <Typography>You have no groups assigned as a lecturer.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Group Name</TableCell>
                <TableCell>Leader</TableCell>
                <TableCell>Members</TableCell>
                <TableCell>Member Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lecturerGroups.map((g, i) => (
                <TableRow key={i}>
                  <TableCell>{g.name}</TableCell>
                  <TableCell>{g.leader}</TableCell>
                  <TableCell>{g.members.join(', ')}</TableCell>
                  <TableCell>{g.members.length}/4</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  const renderKitRental = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Kit Rental</Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>Available Kits for Rental</Typography>
      {kitsLoading ? (
        <Typography>Loading kits...</Typography>
      ) : kits.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {kits.map((k, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => {
                        setSelectedKit(k);
                        setKitDetailDialog(true);
                      }}
                    >
                      {k.name}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={k.category || 'N/A'} 
                      color={k.category === 'Advanced' ? 'warning' : k.category === 'Professional' ? 'error' : 'default'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{k.quantity}</TableCell>
                  <TableCell>{k.price ? k.price.toLocaleString() + ' VND' : 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={k.status} 
                      color={k.status === 'AVAILABLE' ? 'success' : k.status === 'IN-USE' ? 'warning' : 'error'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={k.quantity === 0 || k.status !== 'AVAILABLE'}
                      onClick={() => handleChooseKit(k.name)}
                    >
                      Rent Kit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No kits available for rental.</Typography>
      )}
    </Box>
  );

  const renderWallet = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Wallet Management</Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" color="primary" gutterBottom>
            Balance: {wallet.balance.toLocaleString()} VND
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleTopUp}
            sx={{ mb: 2 }}
          >
            Top Up 100,000 VND
          </Button>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>Transaction History</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wallet.transactions.map((tx, idx) => (
              <TableRow key={idx}>
                <TableCell>{tx.type}</TableCell>
                <TableCell>{tx.amount.toLocaleString()} VND</TableCell>
                <TableCell>{tx.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderRefundRequests = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Refund Requests</Typography>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleRefundRequest}
        sx={{ mb: 3 }}
      >
        Request Kit Refund
      </Button>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Refund Policy</Typography>
          <Typography variant="body2" paragraph>
            • Early returns: Full refund minus damage fees<br/>
            • On-time returns: Full refund minus damage fees<br/>
            • Late returns: Penalty applied based on delay
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Card sx={{ p: 4, borderRadius: 4, boxShadow: 8, minWidth: 340, maxWidth: 1200, width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src={require('./logo.svg').default} alt="Logo" style={{ width: 48, marginRight: 12 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>Lecturer Portal</Typography>
          </Box>
          <Button variant="outlined" color="primary" onClick={onLogout} sx={{ fontWeight: 700 }}>Logout</Button>
        </Box>

        {/* Navigation Tabs */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          <Button
            variant={activeTab === 'dashboard' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('dashboard')}
            size="small"
          >
            Dashboard
          </Button>
          <Button
            variant={activeTab === 'groups' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('groups')}
            size="small"
          >
            Groups
          </Button>
          <Button
            variant={activeTab === 'kits' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('kits')}
            size="small"
          >
            Kit Rental
          </Button>
          <Button
            variant={activeTab === 'wallet' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('wallet')}
            size="small"
          >
            Wallet
          </Button>
          <Button
            variant={activeTab === 'refunds' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('refunds')}
            size="small"
          >
            Refund Requests
          </Button>
        </Box>

        <CardContent>
          {message && <Alert sx={{ mb: 2 }} severity={message.includes('success') ? 'success' : 'error'}>{message}</Alert>}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && renderDashboard()}

          {/* Groups Tab */}
          {activeTab === 'groups' && renderGroups()}

          {/* Kit Rental Tab */}
          {activeTab === 'kits' && renderKitRental()}

          {/* Wallet Tab */}
          {activeTab === 'wallet' && renderWallet()}

          {/* Refund Requests Tab */}
          {activeTab === 'refunds' && renderRefundRequests()}
        </CardContent>
      </Card>

      {/* Kit Detail Dialog */}
      <Dialog open={kitDetailDialog} onClose={() => setKitDetailDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Kit Details</DialogTitle>
        <DialogContent>
          {selectedKit && (
            <Box>
              <Typography variant="h6" gutterBottom>{selectedKit.name}</Typography>
              <Typography variant="body1" color="text.secondary" paragraph>{selectedKit.description}</Typography>
              
              <Typography variant="subtitle1" gutterBottom>Kit Information:</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                <Typography><strong>Category:</strong> {selectedKit.category}</Typography>
                <Typography><strong>Location:</strong> {selectedKit.location}</Typography>
                <Typography><strong>Status:</strong> {selectedKit.status}</Typography>
                <Typography><strong>Price:</strong> {selectedKit.price ? selectedKit.price.toLocaleString() + ' VND' : 'N/A'}</Typography>
                <Typography><strong>Last Maintenance:</strong> {selectedKit.lastMaintenance}</Typography>
                <Typography><strong>Next Maintenance:</strong> {selectedKit.nextMaintenance}</Typography>
              </Box>

              <Typography variant="subtitle1" gutterBottom>Components:</Typography>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Component</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Condition</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedKit.components?.map((component, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{component.name}</TableCell>
                        <TableCell>{component.quantity}</TableCell>
                        <TableCell>
                          <Chip 
                            label={component.condition} 
                            color={component.condition === 'New' ? 'success' : 'default'} 
                            size="small" 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setKitDetailDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Refund Request Dialog */}
      <Dialog open={refundDialog} onClose={() => setRefundDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request Kit Refund</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please provide details for your refund request. Late returns may incur penalties.
          </Typography>
          
          <TextField
            fullWidth
            label="Refund Reason"
            multiline
            rows={3}
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            placeholder="Explain why you want to return the kit..."
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Requested Refund Date"
            type="date"
            value={refundDate}
            onChange={(e) => setRefundDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Refund Policy:</strong><br/>
              • Early returns: Full refund minus damage fees<br/>
              • On-time returns: Full refund minus damage fees<br/>
              • Late returns: Penalty applied based on delay
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRefundDialog(false)}>Cancel</Button>
          <Button onClick={handleRefundSubmit} variant="contained" color="primary">
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}





function MemberPortal({ user }) {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kits, setKits] = useState(mockKits);
  const [kitsLoading, setKitsLoading] = useState(false);
  const [wallet, setWallet] = useState(mockWallet);

  useEffect(() => {
    setLoading(true);
    // Use mockGroups for member
    const found = mockGroups.find(g => g.members.includes(user.email));
    setGroup(found || null);
    setLoading(false);
  }, [user]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Card sx={{ maxWidth: 500, width: '100%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Member Portal</Typography>
          {loading ? (
            <Typography>Loading group info...</Typography>
          ) : group ? (
            <>
              <Typography variant="h6">Group: {group.name}</Typography>
              <Typography>Leader: {group.leader}</Typography>
              <Typography>Members: {group.members.join(', ')}</Typography>
              {group.lecturer && <Typography>Lecturer: {group.lecturer}</Typography>}
            </>
          ) : (
            <Typography>No group found for this member.</Typography>
          )}
          <Typography variant="h6" sx={{ mt: 2 }}>Available Kits</Typography>
          {kitsLoading ? (
            <Typography>Loading kits...</Typography>
          ) : kits.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(30,42,120,0.06)', marginBottom: 16 }}>
              <thead>
                <tr style={{ background: '#e3e9f9' }}>
                  <th style={{ padding: 8, border: '1px solid #e0e0e0' }}>Name</th>
                  <th style={{ padding: 8, border: '1px solid #e0e0e0' }}>Quantity</th>
                  <th style={{ padding: 8, border: '1px solid #e0e0e0' }}>Price</th>
                  <th style={{ padding: 8, border: '1px solid #e0e0e0' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {kits.map((k, i) => (
                  <tr key={i}>
                    <td style={{ padding: 8, border: '1px solid #e0e0e0' }}>{k.name}</td>
                    <td style={{ padding: 8, border: '1px solid #e0e0e0' }}>{k.quantity}</td>
                    <td style={{ padding: 8, border: '1px solid #e0e0e0' }}>{k.price ? k.price.toLocaleString() + ' VND' : ''}</td>
                    <td style={{ padding: 8, border: '1px solid #e0e0e0' }}>{k.status || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Typography>No kits available.</Typography>
          )}
          <Typography variant="h6" sx={{ mt: 2 }}>Wallet</Typography>
          <Typography>Balance: {wallet.balance} VND</Typography>
          <Typography variant="h6" sx={{ mt: 3 }}>Transaction History</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {wallet.transactions.map((tx, idx) => (
              <li key={idx}><Typography>{tx.type}: {tx.amount} VND ({tx.date})</Typography></li>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('student');
  const navigate = useNavigate();
  const [shouldLogout, setShouldLogout] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    setRole(userData.role || 'student');
  };
  const handleLogout = () => {
    setUser(null);
    setRole('student');
    setShouldLogout(true);
  };

  useEffect(() => {
    if (shouldLogout) {
      navigate('/');
      setShouldLogout(false);
    }
  }, [shouldLogout, navigate]);

  // English role options for banner
  const roleOptions = [
    { value: 'student', label: 'Student' },
    { value: 'lecturer', label: 'Lecturer' },
    { value: 'admin', label: 'Admin (Librarian)' },
    { value: 'academic', label: 'Academic Affairs' },
  ];

  // Only show the current role if logged in
  const visibleRoleOptions = user
    ? roleOptions.filter(opt => opt.value === role)
    : roleOptions;

  // Render the selected portal
  let portal = null;
  if (role === 'student') portal = <StudentPortal user={user} onLogout={handleLogout} />;
  if (role === 'leader') portal = <LeaderPortal user={user} onLogout={handleLogout} />;
  if (role === 'lecturer') portal = <LecturerPortal user={user} onLogout={handleLogout} />;
  if (role === 'admin') portal = <AdminPortal onLogout={handleLogout} />;
  if (role === 'academic') portal = <AcademicAffairsPortal user={user} onLogout={handleLogout} />;
  if (role === 'member') portal = <MemberPortal user={user} onLogout={handleLogout} />;
  // (parent role can be a placeholder for now)
  if (role === 'parent') portal = <Card sx={{ maxWidth: 500, mx: 'auto', mt: 6 }}><CardContent><Typography variant="h5">Phụ huynh</Typography><Typography>Chức năng đang phát triển...</Typography></CardContent></Card>;

  return (
    <>
      {/* Remove the AppBar and Toolbar with role selection */}
      <div className="appbar-spacer" />
      <Box sx={{ p: { xs: 1, sm: 2, md: 4 }, transition: 'padding 0.3s' }}>
        <Routes>
          <Route path="/" element={
            user ? (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Typography variant="body1">Logged in as: {user.email}</Typography>
                </Box>
                {portal}
              </Box>
            ) : <Home onLogin={handleLogin} user={user} />
          } />
          <Route path="/lecturer" element={<LecturerPortal user={user} onLogout={handleLogout} />} />
                  <Route path="/rental-request" element={<RentalRequestPage />} />
        <Route path="/admin/rental-approval" element={<AdminRentalApprovalPage />} />
        <Route path="/admin/refund-approval" element={<AdminRefundApprovalPage />} />
        </Routes>
      </Box>
    </>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter;
