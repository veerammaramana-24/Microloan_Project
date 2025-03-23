
# Microloan Management System

A modern web application for managing microloans with AI-powered credit scoring and fraud detection capabilities.

## Features

- **Loan Application Processing**: User-friendly interface for loan applications with real-time validation
- **AI Credit Scoring**: Advanced credit assessment using multiple data points including:
  - Income and employment history
  - Phone usage patterns
  - Transaction history
- **Fraud Detection System**: Real-time fraud risk assessment with ML-based pattern analysis
- **Interactive Dashboard**: Visual representation of loan statistics and performance metrics
- **Detailed Loan Management**: Comprehensive view of individual loan details and payment tracking

## Tech Stack

### Frontend
- React.js with Vite
- Material-UI (MUI) for UI components
- React Router for navigation
- Chart.js for data visualization

### Backend
- Flask (Python)
- ML models for credit scoring and fraud detection
- CORS support for cross-origin requests

## Installation

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8 or higher
- pip (Python package manager)

### Frontend Setup

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd sp
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install Python dependencies:
   ```bash
   pip install flask flask-cors
   ```
4. Start the Flask server:
   ```bash
   python app.py
   ```

## Usage

1. **Dashboard**: Access the main dashboard at http://localhost:5173/ to view loan statistics and performance metrics

2. **Loan Application**: 
   - Navigate to "Apply for Loan"
   - Fill in required information
   - Submit application for instant decision

3. **Credit Scoring**:
   - Access credit scoring module
   - Input customer data for credit assessment
   - View detailed credit analysis

4. **Fraud Detection**:
   - Use the fraud detection system
   - Input transaction details
   - Get real-time risk assessment

## API Endpoints

### Credit Scoring
```
POST /api/credit-score
```
Calculates credit score based on provided data points.

**Request Body:**
```json
{
  "monthlyIncome": number,
  "employmentDuration": number,
  "phoneData": {
    "callFrequency": number,
    "avgCallDuration": number,
    "contactsCount": number
  },
  "transactionData": {
    "avgMonthlyTransactions": number,
    "lastTransactionAmount": number,
    "transactionHistory": number
  }
}
```

### Fraud Detection
```
POST /api/fraud-check
```
Performs fraud risk assessment on transactions.

**Request Body:**
```json
{
  "amount": number,
  "frequency": number,
  "newAccount": boolean
}
```

## Development

- Frontend development server runs on port 5173
- Backend API server runs on port 5000
- Enable CORS is handled for development environment

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
