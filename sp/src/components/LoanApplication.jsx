import React, { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, CircularProgress, Alert, FormControlLabel, Checkbox } from '@mui/material';

const LoanApplication = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    monthlyIncome: '',
    employmentDuration: '',
    loanAmount: '',
    purpose: '',
    newAccount: true
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
    setLoading(true);
    
    try {
      // First, get credit score
      const creditResponse = await fetch('http://localhost:5000/api/credit-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monthlyIncome: formData.monthlyIncome,
          employmentDuration: formData.employmentDuration,
          amount: formData.loanAmount,
          frequency: 1,
          newAccount: formData.newAccount
        })
      });

      if (!creditResponse.ok) {
        throw new Error('Failed to calculate credit score');
      }

      const creditData = await creditResponse.json();
      
      // Then, check for fraud
      const fraudResponse = await fetch('http://localhost:5000/api/fraud-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: formData.loanAmount,
          frequency: 1,
          newAccount: formData.newAccount
        })
      });

      if (!fraudResponse.ok) {
        throw new Error('Failed to perform fraud check');
      }

      const fraudData = await fraudResponse.json();
      
      setResult({
        creditScore: creditData.score,
        riskScore: fraudData.risk_assessment.risk_score,
        status: creditData.score > 600 && fraudData.risk_assessment.risk_score < 50 ? 'approved' : 'rejected'
      });
    } catch (error) {
      console.error('Error processing loan application:', error);
      setResult({
        status: 'error',
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4, minHeight: '80vh' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
          Loan Application
        </Typography>
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, boxShadow: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Monthly Income"
              name="monthlyIncome"
              type="number"
              value={formData.monthlyIncome}
              onChange={handleInputChange}
              margin="normal"
              required
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
            />
            <TextField
              fullWidth
              label="Loan Amount"
              name="loanAmount"
              type="number"
              value={formData.loanAmount}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Loan Purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.newAccount}
                  onChange={handleCheckboxChange}
                  name="newAccount"
                />
              }
              label="This is my first loan"
              sx={{ mt: 2 }}
            />
            <Box sx={{ mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Application'}
              </Button>
            </Box>
          </form>

          {result && (
            <Box sx={{ mt: 4 }}>
              <Alert severity={result.status === 'approved' ? 'success' : result.status === 'rejected' ? 'error' : 'warning'}>
                <Typography variant="h6">
                  Application {result.status === 'approved' ? 'Approved!' : result.status === 'rejected' ? 'Rejected' : 'Error'}
                </Typography>
                {result.status !== 'error' ? (
                  <>
                    <Typography>Credit Score: {result.creditScore}</Typography>
                    <Typography>Risk Score: {result.riskScore.toFixed(2)}%</Typography>
                  </>
                ) : (
                  <Typography>{result.message}</Typography>
                )}
              </Alert>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default LoanApplication;