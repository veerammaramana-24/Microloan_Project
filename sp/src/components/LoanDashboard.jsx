import React from 'react';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LoanDashboard = () => {
  const [stats, setStats] = React.useState({
    total_active_loans: 0,
    pending_approvals: 0,
    total_disbursed: 0,
    total_repaid: 0,
    default_rate: 0,
    avg_credit_score: 0,
    monthly_data: {
      loan_approvals: [],
      repayments: [],
      defaults: [],
      avg_loan_amount: []
    }
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/loan-stats');
        if (!response.ok) {
          throw new Error('Failed to fetch loan statistics');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching loan statistics:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Loan Approvals',
        data: stats.monthly_data.loan_approvals,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Repayments',
        data: stats.monthly_data.repayments,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', mb: 3 }}>
          Loan Management Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, bgcolor: '#e3f2fd', borderRadius: 2, boxShadow: 2, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <Typography variant="h6">Total Active Loans</Typography>
              <Typography variant="h4">{stats.total_active_loans}</Typography>
              <Typography variant="body2" color="text.secondary">Current outstanding loans</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, bgcolor: '#fff3e0', borderRadius: 2, boxShadow: 2, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <Typography variant="h6">Pending Approvals</Typography>
              <Typography variant="h4">{stats.pending_approvals}</Typography>
              <Typography variant="body2" color="text.secondary">Awaiting review</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, bgcolor: '#e8f5e9', borderRadius: 2, boxShadow: 2, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <Typography variant="h6">Total Disbursed</Typography>
              <Typography variant="h4">${stats.total_disbursed.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">Total amount lent</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, bgcolor: '#fce4ec', borderRadius: 2, boxShadow: 2, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <Typography variant="h6">Default Rate</Typography>
              <Typography variant="h4">{stats.default_rate}%</Typography>
              <Typography variant="body2" color="text.secondary">30-day default rate</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom>
                Loan Performance Overview
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line data={chartData} options={{ maintainAspectRatio: false }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LoanDashboard;