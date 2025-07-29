import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Box, Alert, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Chip, Stack, Grid, Divider, IconButton, Tooltip } from '@mui/material';
import { mockKits, mockGroups, mockUsers, mockRentalRequests, mockRefundRequests, mockRolePermissions, mockSystemStats, mockMaintenanceSchedule } from './mocks';

function AdminPortal({ onLogout }) {
  const [kits, setKits] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [groups, setGroups] = useState([]);
  const [moveState, setMoveState] = useState({ member: '', from: '', to: '' });
  const [importMsg, setImportMsg] = useState('');
  const [createGroupState, setCreateGroupState] = useState({ name: '', leader: '', lecturer: '' });
  const [users, setUsers] = useState([]);
  const [userDialog, setUserDialog] = useState({ open: false, mode: 'add', data: { email: '', name: '', role: '', password: '' } });
  const [selectedKit, setSelectedKit] = useState(null);
  const [kitDetailDialog, setKitDetailDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [systemStats, setSystemStats] = useState(mockSystemStats);
  const [rentalRequests, setRentalRequests] = useState(mockRentalRequests);
  const [refundRequests, setRefundRequests] = useState(mockRefundRequests);
  const [maintenanceSchedule, setMaintenanceSchedule] = useState(mockMaintenanceSchedule);

  useEffect(() => {
    // Load mock data directly instead of making API calls
    setKits(mockKits);
    setGroups(mockGroups);
    setUsers(mockUsers);
  }, []);

  const handleAddKit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      // Simulate API call with mock data
      const newKit = {
        id: kits.length + 1,
        name,
        quantity,
        price: 100000,
        status: 'AVAILABLE',
        description: `New kit: ${name}`,
        category: 'Basic',
        location: 'Lab 1',
        lastMaintenance: new Date().toISOString().split('T')[0],
        nextMaintenance: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        components: [
          { name: 'Component 1', quantity: 1, condition: 'New' },
        ],
      };
      setKits([...kits, newKit]);
      setName('');
      setQuantity(1);
      setMessage('Kit added successfully!');
    } catch (error) {
      setMessage(error.message || 'Error adding kit');
    }
  };

  const handleStatusChange = async (id, status) => {
    setMessage('');
    try {
      // Update kit status in mock data
      setKits(prevKits => prevKits.map(kit => 
        kit.id === id ? { ...kit, status } : kit
      ));
      setMessage('Status updated successfully!');
    } catch (error) {
      setMessage(error.message || 'Error updating status');
    }
  };

  const handleMoveClick = (member, from) => {
    setMoveState({ member, from, to: '' });
  };

  const handleMoveSelect = (e) => {
    setMoveState({ ...moveState, to: e.target.value });
  };

  const handleMoveConfirm = async () => {
    if (!moveState.member || !moveState.from || !moveState.to) return;
    try {
      // Simulate moving member between groups
      setGroups(prevGroups => prevGroups.map(group => {
        if (group.name === moveState.from) {
          return {
            ...group,
            members: group.members.filter(m => m !== moveState.member)
          };
        }
        if (group.name === moveState.to) {
          return {
            ...group,
            members: [...group.members, moveState.member]
          };
        }
        return group;
      }));
      setMessage('Member moved successfully!');
      setMoveState({ member: '', from: '', to: '' });
    } catch (error) {
      setMessage(error.message || 'Move failed');
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      // Simulate creating a new group
      const newGroup = {
        id: groups.length + 1,
        name: createGroupState.name,
        leader: createGroupState.leader,
        lecturer: createGroupState.lecturer,
        members: [],
      };
      setGroups([...groups, newGroup]);
      setMessage('Group created successfully!');
      setCreateGroupState({ name: '', leader: '', lecturer: '' });
    } catch (error) {
      setMessage(error.message || 'Error creating group');
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const { mode, data } = userDialog;
    
    try {
      if (mode === 'add') {
        // Simulate creating a new user
        const newUser = {
          id: users.length + 1,
          name: data.name,
          email: data.email,
          role: data.role,
          status: 'Active',
          createdAt: new Date().toISOString().split('T')[0],
          lastLogin: new Date().toISOString().split('T')[0],
        };
        setUsers([...users, newUser]);
        setMessage('User created successfully!');
      } else {
        // Simulate updating existing user
        setUsers(prevUsers => prevUsers.map(user => 
          user.id === data.id ? { ...user, ...data } : user
        ));
        setMessage('User updated successfully!');
      }
      
      setUserDialog({ open: false, mode: 'add', data: { email: '', name: '', role: '', password: '' } });
    } catch (error) {
      setMessage(error.message || 'Operation failed');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // Simulate deleting user
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
        setMessage('User deleted successfully!');
      } catch (error) {
        setMessage(error.message || 'Failed to delete user');
      }
    }
  };

  const handleImportChange = async (e) => {
    setImportMsg('');
    const file = e.target.files[0];
    if (!file) return;
    try {
      // Simulate file import
      setImportMsg('Import successful!');
      // You could add actual file processing logic here
    } catch (error) {
      setImportMsg(error.message || 'Import failed');
    }
  };

  const handleRentalApproval = async (requestId, action) => {
    try {
      if (action === 'approve') {
        // Update the rental request status
        setRentalRequests(prev => prev.map(req => 
          req.id === requestId ? { ...req, status: 'APPROVED', approvedBy: 'admin@fpt.edu.vn', approvalDate: new Date().toISOString() } : req
        ));
        setMessage('Rental request approved successfully!');
      } else {
        setRentalRequests(prev => prev.map(req => 
          req.id === requestId ? { ...req, status: 'REJECTED', approvedBy: 'admin@fpt.edu.vn', approvalDate: new Date().toISOString() } : req
        ));
        setMessage('Rental request rejected successfully!');
      }
    } catch (error) {
      setMessage(error.message || 'Error processing request');
    }
  };

  const handleRefundApproval = async (requestId, action) => {
    try {
      if (action === 'approve') {
        setRefundRequests(prev => prev.map(req => 
          req.id === requestId ? { 
            ...req, 
            status: 'approved', 
            approvedBy: 'admin@fpt.edu.vn', 
            approvalDate: new Date().toISOString(),
            qrCode: `REFUND-${new Date().getFullYear()}-${String(requestId).padStart(3, '0')}`
          } : req
        ));
        setMessage('Refund request approved! QR code generated.');
      } else {
        setRefundRequests(prev => prev.map(req => 
          req.id === requestId ? { ...req, status: 'rejected', approvedBy: 'admin@fpt.edu.vn', approvalDate: new Date().toISOString() } : req
        ));
        setMessage('Refund request rejected.');
      }
    } catch (error) {
      setMessage(error.message || 'Error processing refund request');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING_APPROVAL':
      case 'pending': return 'warning';
      case 'APPROVED':
      case 'approved': return 'success';
      case 'REJECTED':
      case 'rejected': return 'error';
      case 'BORROWED': return 'info';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderDashboard = () => (
    <Box>
      <Typography variant="h5" gutterBottom>System Overview</Typography>
      
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h4">{systemStats.totalUsers}</Typography>
              <Typography variant="body2">Total Users</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h4">{systemStats.availableKits}</Typography>
              <Typography variant="body2">Available Kits</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h4">{systemStats.pendingApprovals}</Typography>
              <Typography variant="body2">Pending Approvals</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h4">{systemStats.monthlyRevenue.toLocaleString()}</Typography>
              <Typography variant="body2">Monthly Revenue (VND)</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Activity</Typography>
              {systemStats.recentActivity.map((activity, index) => (
                <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2"><strong>{activity.action}</strong></Typography>
                  <Typography variant="caption" color="text.secondary">
                    {activity.user} • {activity.time}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Popular Kits</Typography>
              {systemStats.popularKits.map((kit, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{kit.name}</Typography>
                  <Typography variant="body2" color="primary">{kit.rentals} rentals</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderRentalApprovals = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Rental Request Management</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Request ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Kit</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Total Cost</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rentalRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>#{request.id}</TableCell>
                <TableCell>
                  <Typography variant="body2">{request.userName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {request.userEmail}
                  </Typography>
                </TableCell>
                <TableCell>{request.kitName}</TableCell>
                <TableCell>{request.duration} days</TableCell>
                <TableCell>{request.totalCost.toLocaleString()} VND</TableCell>
                <TableCell>
                  <Chip 
                    label={request.status.replace('_', ' ')} 
                    color={getStatusColor(request.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{formatDate(request.requestDate)}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {request.status === 'PENDING_APPROVAL' && (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleRentalApproval(request.id, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => handleRentalApproval(request.id, 'reject')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderRefundApprovals = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Refund Request Management</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Request ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Kit</TableCell>
              <TableCell>Original Amount</TableCell>
              <TableCell>Refund Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {refundRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>#{request.id}</TableCell>
                <TableCell>{request.userEmail}</TableCell>
                <TableCell>
                  <Chip label={request.userRole} color="primary" size="small" />
                </TableCell>
                <TableCell>{request.kitName}</TableCell>
                <TableCell>{request.originalAmount?.toLocaleString()} VND</TableCell>
                <TableCell>{request.refundAmount?.toLocaleString()} VND</TableCell>
                <TableCell>
                  <Chip 
                    label={request.status} 
                    color={getStatusColor(request.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{formatDate(request.requestDate)}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {request.status === 'pending' && (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleRefundApproval(request.id, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => handleRefundApproval(request.id, 'reject')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {request.qrCode && (
                      <Tooltip title={`QR Code: ${request.qrCode}`}>
                        <Chip label="QR Generated" color="info" size="small" />
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderMaintenanceSchedule = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Maintenance Schedule</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Kit Name</TableCell>
              <TableCell>Last Maintenance</TableCell>
              <TableCell>Next Maintenance</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Technician</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {maintenanceSchedule.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.kitName}</TableCell>
                <TableCell>{formatDate(item.lastMaintenance)}</TableCell>
                <TableCell>{formatDate(item.nextMaintenance)}</TableCell>
                <TableCell>
                  <Chip 
                    label={item.status} 
                    color={item.status === 'In Progress' ? 'warning' : 'success'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{item.technician}</TableCell>
                <TableCell>{item.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Card sx={{ p: 4, borderRadius: 4, boxShadow: 8, minWidth: 340, maxWidth: 1200, width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src={require('./logo.svg').default} alt="Logo" style={{ width: 48, marginRight: 12 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>Admin Portal</Typography>
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
            Kit Management
          </Button>
          <Button
            variant={activeTab === 'rentals' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('rentals')}
            size="small"
          >
            Rental Approvals
          </Button>
          <Button
            variant={activeTab === 'refunds' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('refunds')}
            size="small"
          >
            Refund Approvals
          </Button>
          <Button
            variant={activeTab === 'groups' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('groups')}
            size="small"
          >
            Group Management
          </Button>
          <Button
            variant={activeTab === 'users' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('users')}
            size="small"
          >
            User Management
          </Button>
          <Button
            variant={activeTab === 'maintenance' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('maintenance')}
            size="small"
          >
            Maintenance
          </Button>
        </Box>

        <CardContent>
          {message && <Alert sx={{ mb: 2 }} severity={message.includes('success') ? 'success' : 'error'}>{message}</Alert>}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && renderDashboard()}

          {/* Kit Management Tab */}
          {activeTab === 'kits' && (
            <Box>
              <Typography variant="h6" sx={{ mt: 2 }}>Kit Management</Typography>
              <form onSubmit={handleAddKit} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                <TextField label="Kit Name" value={name} onChange={e => setName(e.target.value)} required size="small" />
                <TextField label="Quantity" type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} required size="small" inputProps={{ min: 1 }} />
                <Button type="submit" variant="contained">Add Kit</Button>
              </form>
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {kits.map(kit => (
                      <TableRow key={kit.id}>
                        <TableCell>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => {
                              setSelectedKit(kit);
                              setKitDetailDialog(true);
                            }}
                          >
                            {kit.name}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={kit.category || 'N/A'} 
                            color={kit.category === 'Advanced' ? 'warning' : kit.category === 'Professional' ? 'error' : 'default'} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>{kit.quantity}</TableCell>
                        <TableCell>{kit.price ? kit.price.toLocaleString() + ' VND' : 'N/A'}</TableCell>
                        <TableCell>{kit.location || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={kit.status} 
                            color={kit.status === 'AVAILABLE' ? 'success' : kit.status === 'IN-USE' ? 'warning' : 'error'} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Select value={kit.status} size="small" onChange={e => handleStatusChange(kit.id, e.target.value)}>
                              <MenuItem value="AVAILABLE">AVAILABLE</MenuItem>
                              <MenuItem value="IN-USE">IN-USE</MenuItem>
                              <MenuItem value="DAMAGED">DAMAGED</MenuItem>
                              <MenuItem value="MISSING">MISSING</MenuItem>
                            </Select>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setSelectedKit(kit);
                                setKitDetailDialog(true);
                              }}
                            >
                              Details
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Rental Approvals Tab */}
          {activeTab === 'rentals' && renderRentalApprovals()}

          {/* Refund Approvals Tab */}
          {activeTab === 'refunds' && renderRefundApprovals()}

          {/* Group Management Tab */}
          {activeTab === 'groups' && (
            <Box>
              <Typography variant="h6" sx={{ mt: 2 }}>Group Management</Typography>
              
              {/* Create Group Form */}
              <Card sx={{ mb: 3, p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Create New Group</Typography>
                <form onSubmit={handleCreateGroup} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <TextField 
                    label="Group Name" 
                    value={createGroupState.name} 
                    onChange={e => setCreateGroupState({ ...createGroupState, name: e.target.value })} 
                    required 
                    size="small" 
                  />
                  <TextField 
                    label="Leader Email" 
                    value={createGroupState.leader} 
                    onChange={e => setCreateGroupState({ ...createGroupState, leader: e.target.value })} 
                    required
                    size="small" 
                  />
                  <TextField 
                    label="Lecturer Email" 
                    value={createGroupState.lecturer} 
                    onChange={e => setCreateGroupState({ ...createGroupState, lecturer: e.target.value })} 
                    required
                    size="small" 
                  />
                  <Button type="submit" variant="contained">Create Group</Button>
                </form>
              </Card>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Group Name</TableCell>
                      <TableCell>Leader</TableCell>
                      <TableCell>Lecturer</TableCell>
                      <TableCell>Members</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groups.map((group, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{group.name}</TableCell>
                        <TableCell>{group.leader}</TableCell>
                        <TableCell>{group.lecturer}</TableCell>
                        <TableCell>
                          <ul style={{ margin: 0, paddingLeft: 16 }}>
                            {group.members.map((member, mIdx) => (
                              <li key={mIdx} style={{ marginBottom: 4 }}>
                                {member}
                                <Button size="small" sx={{ ml: 1 }} variant="outlined" onClick={() => handleMoveClick(member, group.name)}>Move</Button>
                                {moveState.member === member && moveState.from === group.name && (
                                  <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 1 }}>
                                    <Select value={moveState.to} size="small" onChange={handleMoveSelect} sx={{ minWidth: 120 }}>
                                      <MenuItem value="">Select group</MenuItem>
                                      {groups.filter(g => g.name !== group.name).map((g, gi) => (
                                        <MenuItem key={gi} value={g.name}>{g.name}</MenuItem>
                                      ))}
                                    </Select>
                                    <Button size="small" variant="contained" sx={{ ml: 1 }} onClick={handleMoveConfirm} disabled={!moveState.to}>Confirm</Button>
                                    <Button size="small" sx={{ ml: 1 }} onClick={() => setMoveState({ member: '', from: '', to: '' })}>Cancel</Button>
                                  </Box>
                                )}
                              </li>
                            ))}
                          </ul>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <Box>
              <Typography variant="h6" sx={{ mt: 4 }}>User Management</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setUserDialog({ open: true, mode: 'add', data: { email: '', name: '', role: '', password: '' } })}
                >
                  Add User
                </Button>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Last Login</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role} 
                            color={user.role === 'admin' ? 'error' : user.role === 'lecturer' ? 'warning' : 'default'} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.status} 
                            color={user.status === 'Active' ? 'success' : user.status === 'Suspended' ? 'error' : 'default'} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>{formatDate(user.lastLogin)}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => setUserDialog({ open: true, mode: 'edit', data: user })}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Delete
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && renderMaintenanceSchedule()}
        </CardContent>
      </Card>

      {/* User Dialog */}
      <Dialog open={userDialog.open} onClose={() => setUserDialog({ ...userDialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>{userDialog.mode === 'add' ? 'Add User' : 'Edit User'}</DialogTitle>
        <form onSubmit={handleUserSubmit}>
          <DialogContent>
            <TextField
              label="Name"
              value={userDialog.data.name}
              onChange={(e) => setUserDialog({ ...userDialog, data: { ...userDialog.data, name: e.target.value } })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              type="email"
              value={userDialog.data.email}
              onChange={(e) => setUserDialog({ ...userDialog, data: { ...userDialog.data, email: e.target.value } })}
              fullWidth
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Role</InputLabel>
              <Select
                value={userDialog.data.role}
                onChange={(e) => setUserDialog({ ...userDialog, data: { ...userDialog.data, role: e.target.value } })}
                label="Role"
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="lecturer">Lecturer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="academic">Academic Affairs</MenuItem>
                <MenuItem value="leader">Leader</MenuItem>
                <MenuItem value="member">Member</MenuItem>
                <MenuItem value="parent">Parent</MenuItem>
              </Select>
            </FormControl>
            {userDialog.mode === 'add' && (
              <TextField
                label="Password"
                type="password"
                value={userDialog.data.password}
                onChange={(e) => setUserDialog({ ...userDialog, data: { ...userDialog.data, password: e.target.value } })}
                fullWidth
                margin="normal"
                required
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUserDialog({ ...userDialog, open: false })}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>

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

              <Typography variant="subtitle1" gutterBottom>Maintenance Schedule:</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <Typography><strong>Last Maintenance:</strong> {selectedKit.lastMaintenance}</Typography>
                <Typography><strong>Next Maintenance:</strong> {selectedKit.nextMaintenance}</Typography>
              </Box>

              <Typography variant="subtitle1" gutterBottom>Inventory Status:</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Typography><strong>Total Quantity:</strong> {selectedKit.quantity}</Typography>
                <Typography><strong>Current Status:</strong> 
                  <Chip 
                    label={selectedKit.status} 
                    color={selectedKit.status === 'AVAILABLE' ? 'success' : selectedKit.status === 'IN-USE' ? 'warning' : 'error'} 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setKitDetailDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminPortal; 