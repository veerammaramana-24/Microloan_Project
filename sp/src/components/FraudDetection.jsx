import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Rating,
  FormControlLabel,
  Checkbox
} from '@mui/material';

const FraudDetection = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    frequency: '1',
    newAccount: true
  });
  const [errors, setErrors] = useState({
    amount: ''
  });

  const validateAmount = (value) => {
    if (!value) return 'Amount is required';
    if (isNaN(value)) return 'Please enter a valid number';
    if (value <= 0) return 'Amount must be greater than 0';
    if (value > 1000000) return 'Amount exceeds maximum limit';
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      const error = validateAmount(value);
      setErrors(prev => ({ ...prev, amount: error }));
    }
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.amount) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/fraud-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          frequency: parseInt(formData.frequency),
          newAccount: formData.newAccount
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to perform fraud check');
      }

      if (data.status === 'success' && data.risk_assessment) {
        const { risk_score, risk_level, risk_factors, recommendation } = data.risk_assessment;
        setResult({
          status: 'success',
          risk_score,
          risk_level,
          risk_factors,
          recommendation
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error performing fraud check:', error);
      setResult({
        status: 'error',
        message: error.message || 'An unexpected error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score > 70) return 'error.main';
    if (score > 40) return 'warning.main';
    return 'success.main';
  };

  const getRiskFactorSeverity = (value) => {
    if (value > 1.3) return 'error';
    if (value > 1.0) return 'warning';
    return 'success';
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4, minHeight: '80vh' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
          Fraud Detection System
        </Typography>
        
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, boxShadow: 3, mb: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Transaction Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  error={!!errors.amount}
                  helperText={errors.amount || "Enter the transaction amount (max: 1,000,000)"}
                  inputProps={{
                    min: 0,
                    max: 1000000,
                    step: 0.01
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Transaction Frequency"
                  name="frequency"
                  type="number"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  required
                  helperText="Number of transactions in the past 24 hours"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.newAccount}
                      onChange={handleCheckboxChange}
                      name="newAccount"
                    />
                  }
                  label="This is a new account"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  fullWidth
                >
                  {loading ? <CircularProgress size={24} /> : 'Check for Fraud'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {result && result.status !== 'error' && (
          <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" gutterBottom>
              Risk Assessment Results
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="h6">Risk Score</Typography>
                  <Typography 
                    variant="h3" 
                    sx={{ color: getRiskColor(result.risk_score) }}
                  >
                    {Math.round(result.risk_score)}%
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    Risk Level: {result.risk_level.toUpperCase()}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  Risk Factors
                </Typography>
                <List>
                  {Object.entries(result.risk_factors).map(([factor, value]) => (
                    <React.Fragment key={factor}>
                      <ListItem>
                        <ListItemText
                          primary={factor.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                          secondary={
                            <Rating
                              value={value}
                              max={2}
                              precision={0.1}
                              readOnly
                              sx={{
                                '& .MuiRating-iconFilled': {
                                  color: getRiskColor(value * 50)
                                }
                              }}
                            />
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </Grid>
              
              <Grid item xs={12}>
                <Alert severity={getRiskFactorSeverity(result.risk_score / 50)}>
                  <Typography variant="subtitle1">
                    Recommendation: {result.recommendation.toUpperCase()}
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </Paper>
        )}

        {result && result.status === 'error' && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {result.message}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default FraudDetection;