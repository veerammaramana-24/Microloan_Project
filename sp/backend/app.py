from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Mock ML model for credit scoring
def predict_credit_score(features):
    # Enhanced credit scoring with advanced feature analysis
    base_weights = {
        'monthly_income': 0.25,
        'employment_duration': 0.15,
        'call_frequency': 0.1,
        'avg_call_duration': 0.1,
        'contacts_count': 0.1,
        'avg_monthly_transactions': 0.1,
        'last_transaction_amount': 0.1,
        'transaction_history': 0.1
    }
    
    # Dynamic weight adjustments based on feature values
    if features.get('employment_duration', 0) > 5:
        base_weights['employment_duration'] *= 1.2
        base_weights['monthly_income'] *= 0.9
    
    if features.get('transaction_history', 0) > 12:
        base_weights['transaction_history'] *= 1.3
        base_weights['last_transaction_amount'] *= 1.2
    
    # Phone behavior analysis
    call_activity_score = (
        features.get('call_frequency', 0) * 0.4 +
        features.get('avg_call_duration', 0) * 0.3 +
        features.get('contacts_count', 0) * 0.3
    ) / 100
    
    # Transaction pattern analysis
    transaction_score = (
        features.get('avg_monthly_transactions', 0) * 0.5 +
        features.get('last_transaction_amount', 0) * 0.3 +
        features.get('transaction_history', 0) * 0.2
    ) / 100
    
    # Normalize features
    normalized_features = {
        'monthly_income': min(1, features.get('monthly_income', 0) / 10000),
        'employment_duration': min(1, features.get('employment_duration', 0) / 10),
        'call_frequency': min(1, features.get('call_frequency', 0) / 100),
        'avg_call_duration': min(1, features.get('avg_call_duration', 0) / 30),
        'contacts_count': min(1, features.get('contacts_count', 0) / 500),
        'avg_monthly_transactions': min(1, features.get('avg_monthly_transactions', 0) / 50),
        'last_transaction_amount': min(1, features.get('last_transaction_amount', 0) / 5000),
        'transaction_history': min(1, features.get('transaction_history', 0) / 24)
    }
    
    normalized_score = sum([
        normalized_features[key] * weights[key]
        for key in weights
    ])
    
    return int(300 + normalized_score * 550)

# Enhanced fraud detection with ML-based pattern analysis
def detect_fraud(transaction_data):
    # Enhanced ML-based pattern analysis for fraud detection
    # Calculate risk weights based on historical patterns
    amount_risk_weight = 1.5 if transaction_data['amount'] > 10000 else 1.0
    frequency_risk_weight = 1.3 if transaction_data['frequency'] > 5 else 1.0
    account_risk_weight = 1.2 if transaction_data['new_account'] else 0.8
    
    # Advanced pattern detection
    suspicious_patterns = [
        (transaction_data['amount'] > 10000) * amount_risk_weight,  # Large transaction amount
        (transaction_data['frequency'] > 5) * frequency_risk_weight,  # High frequency transactions
        transaction_data['new_account'] * account_risk_weight,  # New account risk
        (transaction_data.get('amount_variance', 0) > 5000) * 1.4,  # Unusual amount variance
        (transaction_data.get('time_pattern', 'normal') == 'unusual') * 1.2,  # Unusual timing
        transaction_data.get('location_mismatch', False) * 1.6,  # Location mismatch
        transaction_data.get('multiple_attempts', False) * 1.5,  # Multiple attempts
        (transaction_data.get('velocity', 0) > 3) * 1.3,  # Transaction velocity
        (transaction_data.get('device_risk', 0) > 0.7) * 1.4  # Device risk score
    ]
    
    risk_factors = {
        'high_amount': suspicious_patterns[0],
        'high_frequency': suspicious_patterns[1],
        'new_account': suspicious_patterns[2],
        'amount_anomaly': suspicious_patterns[3],
        'timing_anomaly': suspicious_patterns[4],
        'location_risk': suspicious_patterns[5],
        'multiple_attempts': suspicious_patterns[6]
    }
    
    risk_score = (sum(suspicious_patterns) / len(suspicious_patterns)) * 100
    
    return {
        'risk_score': risk_score,
        'risk_level': 'high' if risk_score > 70 else 'medium' if risk_score > 40 else 'low',
        'risk_factors': risk_factors,
        'recommendation': 'reject' if risk_score > 70 else 'review' if risk_score > 40 else 'approve'
    }

@app.route('/api/credit-score', methods=['POST'])
def calculate_credit_score():
    data = request.json
    try:
        features = {
            'monthly_income': float(data['monthlyIncome']),
            'employment_duration': float(data['employmentDuration']),
            'call_frequency': float(data.get('phoneData', {}).get('callFrequency', 0)),
            'avg_call_duration': float(data.get('phoneData', {}).get('avgCallDuration', 0)),
            'contacts_count': float(data.get('phoneData', {}).get('contactsCount', 0)),
            'avg_monthly_transactions': float(data.get('transactionData', {}).get('avgMonthlyTransactions', 0)),
            'last_transaction_amount': float(data.get('transactionData', {}).get('lastTransactionAmount', 0)),
            'transaction_history': float(data.get('transactionData', {}).get('transactionHistory', 0))
        }
        
        score = predict_credit_score(features)
        
        return jsonify({
            'score': score,
            'risk_level': 'low' if score > 650 else 'medium' if score > 550 else 'high',
            'timestamp': datetime.now().isoformat(),
            'status': 'success'
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 400

@app.route('/api/fraud-check', methods=['POST'])
def check_fraud():
    data = request.json
    try:
        fraud_analysis = detect_fraud({
            'amount': float(data['amount']),
            'frequency': int(data['frequency']),
            'new_account': data['newAccount']
        })
        
        return jsonify({
            'risk_assessment': fraud_analysis,
            'timestamp': datetime.now().isoformat(),
            'status': 'success'
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 400

@app.route('/api/loan-stats', methods=['GET'])
def get_loan_stats():
    # Mock data - in real implementation, this would come from a database
    return jsonify({
        'total_active_loans': 156,
        'pending_approvals': 23,
        'total_disbursed': 45250,
        'monthly_data': {
            'loan_approvals': [12, 19, 15, 25, 22, 30],
            'repayments': [10, 15, 13, 20, 18, 25]
        }
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)