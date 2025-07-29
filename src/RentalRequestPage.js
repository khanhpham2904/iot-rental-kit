import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { rentalAPI, walletAPI } from './api';

function RentalRequestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKit = location.state?.kit;
  const user = location.state?.user;

  const [activeStep, setActiveStep] = useState(0);
  const [rentalData, setRentalData] = useState({
    reason: '',
    purpose: '',
    duration: '',
    startDate: '',
    endDate: '',
    totalCost: 0
  });
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
    if (activeStep === 0) {
      // Validate rental details
      if (!rentalData.reason || !rentalData.purpose || !rentalData.duration || !rentalData.startDate || !rentalData.endDate) {
        setMessage('Please fill in all required fields');
        return;
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
    setMessage('');
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setMessage('');
  };

  const handleSubmitRental = async () => {
    setLoading(true);
    setMessage('');

    try {
      // Check if wallet has enough balance
      if (wallet.balance < rentalData.totalCost) {
        setMessage('Insufficient wallet balance. Please top up your wallet.');
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
      
      setMessage('Rental request submitted successfully! Waiting for admin approval.');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      setMessage('Network error. Please try again.');
    }
    
    setLoading(false);
  };

  const steps = ['Rental Details', 'Payment & Confirmation'];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Kit Information</Typography>
            <Card sx={{ mb: 3, p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Kit Name:</strong> {selectedKit?.name}</Typography>
                  <Typography><strong>Category:</strong> {selectedKit?.category}</Typography>
                  <Typography><strong>Daily Rate:</strong> {(selectedKit?.price / 30).toLocaleString()} VND</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Location:</strong> {selectedKit?.location}</Typography>
                  <Typography><strong>Status:</strong> 
                    <Chip 
                      label={selectedKit?.status} 
                      color={selectedKit?.status === 'AVAILABLE' ? 'success' : 'warning'} 
                      size="small" 
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Grid>
              </Grid>
            </Card>

            <Typography variant="h6" gutterBottom>Rental Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Reason for Rental"
                  value={rentalData.reason}
                  onChange={(e) => setRentalData({ ...rentalData, reason: e.target.value })}
                  fullWidth
                  required
                  multiline
                  rows={3}
                  placeholder="Please explain why you need to rent this kit..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Purpose/Project Description"
                  value={rentalData.purpose}
                  onChange={(e) => setRentalData({ ...rentalData, purpose: e.target.value })}
                  fullWidth
                  required
                  multiline
                  rows={3}
                  placeholder="Describe your project or purpose for using this kit..."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Duration (days)"
                  type="number"
                  value={rentalData.duration}
                  onChange={(e) => {
                    setRentalData({ ...rentalData, duration: e.target.value });
                    setTimeout(calculateTotalCost, 100);
                  }}
                  fullWidth
                  required
                  inputProps={{ min: 1, max: 30 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={rentalData.startDate}
                  onChange={(e) => setRentalData({ ...rentalData, startDate: e.target.value })}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="End Date"
                  type="date"
                  value={rentalData.endDate}
                  onChange={(e) => setRentalData({ ...rentalData, endDate: e.target.value })}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Payment & Confirmation</Typography>
            
            <Card sx={{ mb: 3, p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Rental Summary</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Kit:</strong> {selectedKit?.name}</Typography>
                  <Typography><strong>Duration:</strong> {rentalData.duration} days</Typography>
                  <Typography><strong>Start Date:</strong> {rentalData.startDate}</Typography>
                  <Typography><strong>End Date:</strong> {rentalData.endDate}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Daily Rate:</strong> {(selectedKit?.price / 30).toLocaleString()} VND</Typography>
                  <Typography><strong>Total Cost:</strong> {rentalData.totalCost.toLocaleString()} VND</Typography>
                  <Typography><strong>Current Balance:</strong> {wallet.balance.toLocaleString()} VND</Typography>
                </Grid>
              </Grid>
            </Card>

            <Card sx={{ mb: 3, p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Wallet Status</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography>Balance: {wallet.balance.toLocaleString()} VND</Typography>
                <Chip 
                  label={wallet.balance >= rentalData.totalCost ? 'Sufficient' : 'Insufficient'} 
                  color={wallet.balance >= rentalData.totalCost ? 'success' : 'error'} 
                  size="small"
                />
              </Box>
              {wallet.balance < rentalData.totalCost && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Insufficient balance. You need {(rentalData.totalCost - wallet.balance).toLocaleString()} VND more.
                </Alert>
              )}
            </Card>

            <Typography variant="body2" color="text.secondary" paragraph>
              By confirming this rental request, you agree to:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 3 }}>
              <li>Pay the total amount of {rentalData.totalCost.toLocaleString()} VND</li>
              <li>Return the kit by {rentalData.endDate}</li>
              <li>Use the kit only for the stated purpose</li>
              <li>Report any damage or issues immediately</li>
            </Box>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  if (!selectedKit || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>No kit selected. Redirecting...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Card sx={{ maxWidth: 800, width: '100%' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Kit Rental Request
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {message && (
            <Alert sx={{ mb: 2 }} severity={message.includes('success') ? 'success' : 'error'}>
              {message}
            </Alert>
          )}

          <Box sx={{ mt: 2, mb: 1 }}>
            {getStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmitRental}
                  disabled={loading || wallet.balance < rentalData.totalCost}
                >
                  {loading ? 'Submitting...' : 'Submit Rental Request'}
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default RentalRequestPage; 