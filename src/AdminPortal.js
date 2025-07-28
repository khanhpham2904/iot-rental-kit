import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Box, Alert, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Chip, Stack } from '@mui/material';
import { kitAPI, groupAPI, userAPI } from './api';

function AdminPortal() {
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

  const fetchKits = async () => {
    try {
      const data = await kitAPI.getKits();
      setKits(data.kits);
    } catch (error) {
      console.error('Error fetching kits:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const data = await groupAPI.getGroups();
      setGroups(data.groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await userAPI.getUsers();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddKit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const data = await kitAPI.createKit({ name, quantity });
      setKits(data.kits);
      setName('');
      setQuantity(1);
      setMessage('Kit added!');
    } catch (error) {
      setMessage(error.message || 'Error adding kit');
    }
  };

  const handleStatusChange = async (id, status) => {
    setMessage('');
    try {
      const data = await kitAPI.updateKitStatus(id, status);
      setKits(data.kits);
      setMessage('Status updated!');
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
      const data = await groupAPI.moveMember(moveState.member, moveState.from, moveState.to);
      setGroups(data.groups);
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
      await groupAPI.createGroup({
        name: createGroupState.name,
        leader: createGroupState.leader,
        lecturer: createGroupState.lecturer,
      });
      setMessage('Group created successfully!');
      setCreateGroupState({ name: '', leader: '', lecturer: '' });
      fetchGroups();
    } catch (error) {
      setMessage(error.message || 'Error creating group');
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const { mode, data } = userDialog;
    
    try {
      if (mode === 'add') {
        await userAPI.createUser(data);
      } else {
        await userAPI.updateUser(data.id, data);
      }
      
      setMessage(`User ${mode === 'add' ? 'created' : 'updated'} successfully!`);
      setUserDialog({ open: false, mode: 'add', data: { email: '', name: '', role: '', password: '' } });
      fetchUsers();
    } catch (error) {
      setMessage(error.message || 'Operation failed');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.deleteUser(id);
        setMessage('User deleted successfully!');
        fetchUsers();
      } catch (error) {
        setMessage(error.message || 'Failed to delete user');
      }
    }
  };

  const handleImportChange = async (e) => {
    setImportMsg('');
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const data = await groupAPI.importGroups(formData);
      setImportMsg('Import successful!');
      fetchGroups();
    } catch (error) {
      setImportMsg(error.message || 'Import failed');
    }
  };

  useEffect(() => {
    fetchKits();
    fetchGroups();
    fetchUsers();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Card sx={{ maxWidth: 700, width: '100%', mb: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>Admin (Librarian) Dashboard</Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => window.location.href = '/admin/rental-approval'}
            >
              Manage Rental Requests
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => window.location.href = '/admin/refund-approval'}
            >
              Manage Refund Requests
            </Button>
          </Box>
          <Typography variant="h6" sx={{ mt: 2 }}>Kit Management</Typography>
          <form onSubmit={handleAddKit} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <TextField label="Kit Name" value={name} onChange={e => setName(e.target.value)} required size="small" />
            <TextField label="Quantity" type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} required size="small" inputProps={{ min: 1 }} />
            <Button type="submit" variant="contained">Add Kit</Button>
          </form>
          {message && <Alert sx={{ mb: 2 }} severity={message.includes('success') ? 'success' : 'error'}>{message}</Alert>}
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
          
          {/* User Management Section */}
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
                        color={user.status === 'Active' ? 'success' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
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