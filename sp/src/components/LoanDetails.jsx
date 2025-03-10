import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Paper, Typography, Grid, Chip, LinearProgress, Divider } from '@mui/material';

const LoanDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [loanData, setLoanData] = useState(null);

  useEffect(() => {
    // Mock data - in a real app, this would fetch from an API
    const fetchLoanDetails = () => {
      setLoading(true);
      // Simulating API call
      setTimeout(() => {
        setLoanData({
          id: id,
          borrower: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            creditScore: 720
          },
          loan: {
            amount: 5000,
            purpose: 'Business Expansion',
            term: 12,
            interestRate: 8.5,
            monthlyPayment: 440.45,
            status: 'active',
            disbursementDate: '2024-01-15',
            nextPaymentDate: '2024-02-15'
          },
          payments: {
            total: 12,
            completed: 1,
            onTime: 1,
            late: 0
          }
        });
        setLoading(false);
      }, 1000);
    };

    fetchLoanDetails();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4 }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  if (!loanData) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" color="error">
            Loan not found
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Loan Details
        </Typography>

        <Grid container spacing={3}>
          {/* Borrower Information */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Borrower Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Name</Typography>
                  <Typography variant="body1">{loanData.borrower.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography variant="body1">{loanData.borrower.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Credit Score</Typography>
                  <Typography variant="body1">{loanData.borrower.creditScore}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Loan Information */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Loan Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Amount</Typography>
                  <Typography variant="body1">${loanData.loan.amount.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Purpose</Typography>
                  <Typography variant="body1">{loanData.loan.purpose}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Term (months)</Typography>
                  <Typography variant="body1">{loanData.loan.term}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Interest Rate</Typography>
                  <Typography variant="body1">{loanData.loan.interestRate}%</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Monthly Payment</Typography>
                  <Typography variant="body1">${loanData.loan.monthlyPayment.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Status</Typography>
                  <Chip
                    label={loanData.loan.status.toUpperCase()}
                    color={loanData.loan.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Payment History */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Payment History
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2">Total Payments</Typography>
                  <Typography variant="body1">{loanData.payments.completed} of {loanData.payments.total}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2">On-Time Payments</Typography>
                  <Typography variant="body1">{loanData.payments.onTime}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2">Late Payments</Typography>
                  <Typography variant="body1">{loanData.payments.late}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Next Payment Due</Typography>
                    <Typography variant="body1">{new Date(loanData.loan.nextPaymentDate).toLocaleDateString()}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LoanDetails;