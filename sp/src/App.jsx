import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, ThemeProvider, createTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import LoanDashboard from './components/LoanDashboard';
import CreditScoring from './components/CreditScoring';
import LoanApplication from './components/LoanApplication';
import LoanDetails from './components/LoanDetails';
import FraudDetection from './components/FraudDetection';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar position="static" elevation={2}>
          <Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 'bold',
                letterSpacing: '0.5px'
              }}
            >
              Microloan Management System
            </Typography>
            <StyledButton color="inherit" component={Link} to="/">
              Dashboard
            </StyledButton>
            <StyledButton color="inherit" component={Link} to="/credit-scoring">
              Credit Scoring
            </StyledButton>
            <StyledButton color="inherit" component={Link} to="/apply">
              Apply for Loan
            </StyledButton>
            <StyledButton color="inherit" component={Link} to="/fraud-detection">
              Fraud Detection
            </StyledButton>
          </Toolbar>
        </AppBar>

        <Container>
          <Box sx={{ mt: 2 }}>
            <Routes>
              <Route path="/" element={<LoanDashboard />} />
              <Route path="/credit-scoring" element={<CreditScoring />} />
              <Route path="/apply" element={<LoanApplication />} />
              <Route path="/loan/:id" element={<LoanDetails />} />
              <Route path="/fraud-detection" element={<FraudDetection />} />
            </Routes>
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App
