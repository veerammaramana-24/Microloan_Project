import React, { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';

const CreditScoring = () => {
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    employmentDuration: '',
    phoneData: {
      callFrequency: '',
      avgCallDuration: '',
      contactsCount: ''
    },
    transactionData: {
      avgMonthlyTransactions: '',
      lastTransactionAmount: '',
      transactionHistory: ''
    },
    amount: '',
    frequency: '1',
    newAccount: true
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/credit-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to calculate credit score');
      }

      const data = await response.json();
      if (data.status === 'success') {
        setScore(data.score);
      } else {
        throw new Error(data.error || 'Failed to calculate credit score');
      }
    } catch (error) {
      console.error('Error calculating credit score:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4, minHeight: '80vh' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{
            color: 'primary.main',
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 3
          }}
        >
          AI Credit Scoring
        </Typography>
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, boxShadow: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Monthly Income"
              name="monthlyIncome"
              type="number"
              value={formData.monthlyIncome}
              onChange={handleInputChange}
              margin="normal"
              required
              helperText="Your regular monthly income"
            />
            <TextField
              fullWidth
              label="Employment Duration (years)"
              name="employmentDuration"
              type="number"
              value={formData.employmentDuration}
              onChange={handleInputChange}
              margin="normal"
              required
              helperText="Number of years in current employment"
            />
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Phone Usage Data
            </Typography>
            <TextField
              fullWidth
              label="Average Monthly Calls"
              name="phoneData.callFrequency"
              type="number"
              value={formData.phoneData.callFrequency}
              onChange={handleInputChange}
              margin="normal"
              required
              helperText="Number of calls made per month"
            />
            <TextField
              fullWidth
              label="Average Call Duration (minutes)"
              name="phoneData.avgCallDuration"
              type="number"
              value={formData.phoneData.avgCallDuration}
              onChange={handleInputChange}
              margin="normal"
              required
              helperText="Average duration of calls in minutes"
            />
            <TextField
              fullWidth
              label="Number of Contacts"
              name="phoneData.contactsCount"
              type="number"
              value={formData.phoneData.contactsCount}
              onChange={handleInputChange}
              margin="normal"
              required
              helperText="Total number of unique contacts"
            />
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Transaction History
            </Typography>
            <TextField
              fullWidth
              label="Average Monthly Transactions"
              name="transactionData.avgMonthlyTransactions"
              type="number"
              value={formData.transactionData.avgMonthlyTransactions}
              onChange={handleInputChange}
              margin="normal"
              required
              helperText="Number of transactions per month"
            />
            <TextField
              fullWidth
              label="Last Transaction Amount"
              name="transactionData.lastTransactionAmount"
              type="number"
              value={formData.transactionData.lastTransactionAmount}
              onChange={handleInputChange}
              margin="normal"
              required
              helperText="Amount of your last transaction"
            />
            <TextField
              fullWidth
              label="Transaction History (months)"
              name="transactionData.transactionHistory"
              type="number"
              value={formData.transactionData.transactionHistory}
              onChange={handleInputChange}
              margin="normal"
              required
              helperText="Number of months of available transaction history"
            />
            <Box sx={{ mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Calculate Credit Score'}
              </Button>
            </Box>
          </form>

          {score && (
            <Box sx={{ mt: 4 }}>
              <Alert severity={score > 650 ? 'success' : score > 550 ? 'warning' : 'error'}>
                <Typography variant="h6">
                  Credit Score: {score}
                </Typography>
                <Typography>
                  {score > 650
                    ? 'Excellent credit score! High chance of loan approval.'
                    : score > 550
                    ? 'Fair credit score. Moderate chance of loan approval.'
                    : 'Poor credit score. Low chance of loan approval.'}
                </Typography>
              </Alert>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default CreditScoring;