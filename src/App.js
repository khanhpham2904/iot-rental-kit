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
import * as XLSX from 'xlsx';
import { mockLogin } from './loginMock';
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
      const data = await mockLogin(email, password);
      onLogin(data.user);
      if (data.user.role === 'student') {
        navigate('/group');
      } else if (data.user.role === 'lecturer') {
        navigate('/lecturer');
      } else if (data.user.role === 'member') {
        navigate('/');
      } else if (data.user.role === 'admin') {
        navigate('/');
      } else if (data.user.role === 'academic') {
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
      <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Welcome, {user.email}</Typography>
          <Typography variant="body1">Role: {user.role}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="login-center">
      <div className="login-card">
        <div className="login-title">Login</div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <TextField
              label="Email (@fpt.edu.vn)"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              size="small"
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              style={{ minWidth: 120 }}
            >
              Login
            </Button>
          </div>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            size="small"
              fullWidth
            />
            {error && <Alert severity="error">{error}</Alert>}
        </form>
      </div>
    </div>
  );
}
function StudentPortal({ user }) {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroup() {
      setLoading(true);
      try {
        const data = await groupAPI.getStudentGroup(user.email);
        setGroup(data.group || null);
      } catch (error) {
        setGroup(null);
      }
      setLoading(false);
    }
    if (user?.email) fetchGroup();
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
function LeaderPortal({ user }) {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [message, setMessage] = useState('');
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kits, setKits] = useState([]);
  const [kitsLoading, setKitsLoading] = useState(true);
  const [chosenKit, setChosenKit] = useState(null);
  const [shareInfo, setShareInfo] = useState(null);
  const [selectedKit, setSelectedKit] = useState(null);
  const [kitDetailDialog, setKitDetailDialog] = useState(false);
  const [refundDialog, setRefundDialog] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [refundDate, setRefundDate] = useState('');

  const fetchWallet = async () => {
    try {
      const data = await walletAPI.getWallet();
      setWallet(data.wallet);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const handleDeposit = async () => {
    setMessage('');
    try {
      const data = await walletAPI.deposit();
      setWallet(data.wallet);
      setMessage('Deposit successful!');
    } catch (error) {
      setMessage(error.message || 'Deposit failed');
    }
  };



  useEffect(() => {
    fetchWallet();
    async function fetchGroup() {
      setLoading(true);
      try {
        const data = await groupAPI.getStudentGroup(user.email);
        setGroup(data.group || null);
      } catch (error) {
        setGroup(null);
      }
      setLoading(false);
    }
    if (user?.email) fetchGroup();
    async function fetchKits() {
      setKitsLoading(true);
      try {
        const data = await kitAPI.getAvailableKits();
        setKits(data.kits || []);
      } catch (error) {
        setKits([]);
      }
      setKitsLoading(false);
    }
    fetchKits();
  }, [user]);

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
      await refundAPI.submitRefundRequest({
        userEmail: user.email,
        userRole: 'leader',
        groupId: group.id,
        refundReason,
        refundDate,
        requestDate: new Date().toISOString()
      });
      
      setMessage('Refund request submitted successfully!');
      setRefundDialog(false);
      setRefundReason('');
      setRefundDate('');
    } catch (error) {
      setMessage(error.message || 'Failed to submit refund request');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Card sx={{ maxWidth: 500, width: '100%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Leader Portal</Typography>
          {loading ? (
            <Typography>Loading group info...</Typography>
          ) : group ? (
            <>
              <Typography variant="h6" gutterBottom>Group Information</Typography>
              <Typography><strong>Group Name:</strong> {group.name}</Typography>
              <Typography><strong>Members:</strong> {group.members.join(', ')}</Typography>
              <Typography><strong>Lecturer:</strong> {group.lecturer}</Typography>
              
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleRefundRequest}
                sx={{ mt: 2, mb: 2 }}
                fullWidth
              >
                Request Kit Refund
              </Button>

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
                        <td style={{ padding: 8, border: '1px solid #e0e0e0' }}>
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
                        </td>
                    <td style={{ padding: 8, border: '1px solid #e0e0e0' }}>{k.quantity}</td>
                        <td style={{ padding: 8, border: '1px solid #e0e0e0' }}>{k.price ? k.price.toLocaleString() + ' VND' : ''}</td>
                        <td style={{ padding: 8, border: '1px solid #e0e0e0' }}>{k.status || ''}</td>
                        <td style={{ padding: 8, border: '1px solid #e0e0e0' }}>
                          <Button
                            variant="contained"
                            size="small"
                            disabled={k.quantity === 0}
                            onClick={() => handleChooseKit(k.name)}
                          >
                            Choose
                          </Button>
                        </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Typography>No kits available.</Typography>
          )}
              {shareInfo && (
                <Alert sx={{ mt: 2 }} severity="info">
                  Total price: {shareInfo.total.toLocaleString()} VND<br/>
                  Number of people in group: {shareInfo.count}<br/>
                  Each person pays: {shareInfo.perPerson.toLocaleString()} VND
                </Alert>
              )}
          <Typography variant="h6" sx={{ mt: 2 }}>Wallet</Typography>
          <Typography>Balance: {wallet.balance} VND</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Button variant="contained" onClick={handleDeposit}>Deposit 100,000 VND</Button>
          </Box>
          {message && <Alert sx={{ mt: 2 }} severity="info">{message}</Alert>}
          <Typography variant="h6" sx={{ mt: 3 }}>Transaction History</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {wallet.transactions.map((tx, idx) => (
              <li key={idx}><Typography>{tx.type}: {tx.amount} VND ({tx.date})</Typography></li>
            ))}
          </Box>
            </>
          ) : (
            <Typography>No group found for this leader.</Typography>
          )}
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
function LecturerPortal({ user }) {
  const navigate = useNavigate();
  const [lecturerGroups, setLecturerGroups] = useState([]);
  const [message, setMessage] = useState('');
  const [importType, setImportType] = useState('');
  const [kits, setKits] = useState([]);
  const [kitsLoading, setKitsLoading] = useState(true);
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [selectedKit, setSelectedKit] = useState(null);
  const [kitDetailDialog, setKitDetailDialog] = useState(false);
  const [refundDialog, setRefundDialog] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [refundDate, setRefundDate] = useState('');

  const fetchGroups = async () => {
    if (!user) {
      setLecturerGroups([]);
      return;
    }
    try {
      const data = await groupAPI.getGroups();
      setLecturerGroups((data.groups || []).filter(g => g.lecturer === user.email));
    } catch (error) {
      setLecturerGroups([]);
    }
  };

  useEffect(() => {
    if (!user) {
      setLecturerGroups([]);
        return;
      }
    fetchGroups();
    fetchKits();
    fetchWallet();
  }, [user]);

  const fetchKits = async () => {
    try {
      const data = await kitAPI.getAvailableKits();
      setKits(data.kits || []);
    } catch (error) {
      console.error('Error fetching kits:', error);
    } finally {
      setKitsLoading(false);
    }
  };

  const fetchWallet = async () => {
    try {
      const data = await walletAPI.getWallet();
      setWallet(data.wallet);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const handleTopUp = async () => {
    setMessage('');
    try {
      const data = await walletAPI.deposit();
      setWallet(data.wallet);
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
      await refundAPI.submitRefundRequest({
        userEmail: user.email,
        userRole: 'lecturer',
        refundReason,
        refundDate,
        requestDate: new Date().toISOString()
      });
      
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
          try {
            await studentAPI.importStudents(data);
            setMessage('Students imported successfully!');
          } catch (error) {
            setMessage(error.message || 'Error importing students');
          }
        }
      } catch (error) {
        setMessage('Error processing file');
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 6 }}>
      <Typography variant="h5" gutterBottom>Lecturer Portal</Typography>
      
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleRefundRequest}
        sx={{ mb: 2 }}
        fullWidth
      >
        Request Kit Refund
        </Button>
      
      {/* Excel Import Section */}
      <Card sx={{ maxWidth: 600, width: '100%', mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Import Data</Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
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

      {/* Read-only Groups Section */}
      <Typography variant="h6" sx={{ mt: 2 }}>Your Groups (Read Only)</Typography>
      {lecturerGroups.length === 0 ? (
        <Typography>You have no groups assigned as a lecturer.</Typography>
      ) : (
        <Box sx={{ width: '100%', maxWidth: 800 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(30,42,120,0.06)' }}>
            <thead>
              <tr style={{ background: '#e3e9f9' }}>
                <th style={{ padding: 8, border: '1px solid #e0e0e0' }}>Group Name</th>
                <th style={{ padding: 8, border: '1px solid #e0e0e0' }}>Leader</th>
                <th style={{ padding: 8, border: '1px solid #e0e0e0' }}>Members</th>
                <th style={{ padding: 8, border: '1px solid #e0e0e0' }}>Member Count</th>
              </tr>
            </thead>
            <tbody>
              {lecturerGroups.map((g, i) => (
                <tr key={i}>
                  <td style={{ padding: 8, border: '1px solid #e0e0e0' }}>{g.name}</td>
                  <td style={{ padding: 8, border: '1px solid #e0e0e0' }}>{g.leader}</td>
                  <td style={{ padding: 8, border: '1px solid #e0e0e0' }}>{g.members.join(', ')}</td>
                  <td style={{ padding: 8, border: '1px solid #e0e0e0' }}>{g.members.length}/4</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}
      
      {message && <Alert sx={{ mt: 2 }} severity={message.includes('success') ? 'success' : 'error'}>{message}</Alert>}

      {/* Wallet Section */}
      <Card sx={{ maxWidth: 600, width: '100%', mb: 4, mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Wallet</Typography>
          <Typography variant="h5" color="primary" gutterBottom>
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
          <Typography variant="subtitle2" gutterBottom>Transaction History:</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {wallet.transactions.map((tx, idx) => (
              <li key={idx}>
                <Typography variant="body2">
                  {tx.type}: {tx.amount.toLocaleString()} VND 
                  {tx.description && ` - ${tx.description}`}
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    ({tx.date})
                  </Typography>
                </Typography>
              </li>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Available Kits Section */}
      <Card sx={{ maxWidth: 800, width: '100%', mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Available Kits for Rental</Typography>
          {kitsLoading ? (
            <Typography>Loading kits...</Typography>
          ) : kits.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(30,42,120,0.06)' }}>
            <thead>
              <tr style={{ background: '#e3e9f9' }}>
                <th style={{ padding: 8, border: '1px solid #e0e0e0' }}>Name</th>
                  <th style={{ padding: 8, border: '1px solid #e0e0e0' }}>Category</th>
                  <th style={{ padding: 8, border: '1px solid #e0e0e0' }}>Quantity</th>
                  <th style={{ padding: 8, border: '1px solid #e0e0e0' }}>Price</th>
                  <th style={{ padding: 8, border: '1px solid #e0e0e0' }}>Status</th>
                  <th style={{ padding: 8, border: '1px solid #e0e0e0' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
                {kits.map((k, i) => (
                <tr key={i}>
                    <td style={{ padding: 8, border: '1px solid #e0e0e0' }}>
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
                    </td>
                    <td style={{ padding: 8, border: '1px solid #e0e0e0' }}>
                      <Chip 
                        label={k.category || 'N/A'} 
                        color={k.category === 'Advanced' ? 'warning' : k.category === 'Professional' ? 'error' : 'default'} 
                        size="small" 
                      />
                    </td>
                    <td style={{ padding: 8, border: '1px solid #e0e0e0' }}>{k.quantity}</td>
                    <td style={{ padding: 8, border: '1px solid #e0e0e0' }}>{k.price ? k.price.toLocaleString() + ' VND' : 'N/A'}</td>
                    <td style={{ padding: 8, border: '1px solid #e0e0e0' }}>
                      <Chip 
                        label={k.status} 
                        color={k.status === 'AVAILABLE' ? 'success' : k.status === 'IN-USE' ? 'warning' : 'error'} 
                        size="small" 
                      />
                    </td>
                    <td style={{ padding: 8, border: '1px solid #e0e0e0' }}>
                      <Button
                        variant="contained"
                        size="small"
                        disabled={k.quantity === 0 || k.status !== 'AVAILABLE'}
                        onClick={() => handleChooseKit(k.name)}
                      >
                        Rent Kit
                      </Button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
          ) : (
            <Typography>No kits available for rental.</Typography>
          )}
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



function AdminDashboardWithNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => setNotifications(data.notifications));
    fetch('/api/report')
      .then(res => res.json())
      .then(data => setReport(data.report));
  }, []);

  return (
    <div>
      <AdminPortal />
      <h3>Notifications</h3>
      <ul>
        {notifications.map((n, idx) => (
          <li key={idx}>{n.message} ({n.date})</li>
        ))}
      </ul>
      <h3>Usage Report</h3>
      {report ? (
        <div>
          <p>Total Kits: {report.totalKits}</p>
          <p>Kits In Use: {report.inUse}</p>
          <p>Overdue Items: {report.overdue}</p>
        </div>
      ) : (
        <p>Loading report...</p>
      )}
    </div>
  );
}

function MemberPortal({ user }) {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kits, setKits] = useState([]);
  const [kitsLoading, setKitsLoading] = useState(true);
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });

  useEffect(() => {
    async function fetchGroup() {
      setLoading(true);
      try {
        const data = await groupAPI.getStudentGroup(user.email);
        setGroup(data.group || null);
      } catch (error) {
        setGroup(null);
      }
      setLoading(false);
    }
    if (user?.email) fetchGroup();
    async function fetchKits() {
      setKitsLoading(true);
      try {
        const data = await kitAPI.getAvailableKits();
        setKits(data.kits || []);
      } catch (error) {
        setKits([]);
      }
      setKitsLoading(false);
    }
    fetchKits();
    async function fetchWallet() {
      try {
        const data = await walletAPI.getWallet();
        setWallet(data.wallet);
      } catch (error) {
        console.error('Error fetching wallet:', error);
      }
    }
    fetchWallet();
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
  if (role === 'student') portal = <StudentPortal user={user} />;
  if (role === 'leader') portal = <LeaderPortal user={user} />;
  if (role === 'lecturer') portal = <LecturerPortal user={user} />;
  if (role === 'admin') portal = <AdminDashboardWithNotifications />;
  if (role === 'academic') portal = <AcademicAffairsPortal />;
  if (role === 'member') portal = <MemberPortal user={user} />;
  // (parent role can be a placeholder for now)
  if (role === 'parent') portal = <Card sx={{ maxWidth: 500, mx: 'auto', mt: 6 }}><CardContent><Typography variant="h5">Phụ huynh</Typography><Typography>Chức năng đang phát triển...</Typography></CardContent></Card>;

  return (
    <>
      <AppBar position="static" sx={{ background: 'white', boxShadow: 1 }}>
        <Toolbar sx={{ justifyContent: 'flex-end', minHeight: 80 }}>
          <Stack direction="row" spacing={2}>
            {visibleRoleOptions.map(opt => (
              <Button
                key={opt.value}
                variant={role === opt.value ? 'contained' : 'outlined'}
                sx={{
                  bgcolor: role === opt.value ? '#1a237e' : 'white',
                  color: role === opt.value ? 'white' : '#1a237e',
                  fontWeight: 600,
                  fontSize: 16,
                  px: 3,
                  borderRadius: 2,
                  boxShadow: role === opt.value ? 2 : 0,
                  borderColor: '#1a237e',
                  '&:hover': {
                    bgcolor: '#3949ab',
                    color: 'white',
                  },
                }}
                onClick={() => setRole(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </Stack>
          {user && (
            <Button color="inherit" onClick={handleLogout} sx={{ ml: 2, color: '#1a237e', fontWeight: 600 }}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <div className="appbar-spacer" />
      <Box sx={{ p: 2 }}>
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
          <Route path="/lecturer" element={<LecturerPortal user={user} />} />
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
