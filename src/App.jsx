import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import RealtorInfo from './components/RealtorInfo';
import AgreementForm from './components/AgreementForm';
import SuccessScreen from './components/SuccessScreen';
import RealtorDashboard from './realtor/RealtorDashboard';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import './styles/index.css';

function AppContent() {
  const { user, isAuthenticated, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState('form');
  const [agreementData, setAgreementData] = useState(null);
  const [signedAgreement, setSignedAgreement] = useState(null);
  const [isRealtorMode, setIsRealtorMode] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  // Check if this is a public agreement link
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      // This is a public agreement link - load the agreement
      loadAgreementByToken(token);
    }
    // If no token and not authenticated, show login form (handled in render logic)
  }, []);

  const loadAgreementByToken = async (token) => {
    try {
      // Use the same API base URL logic as the api service
      const apiBaseUrl = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' 
        ? 'http://192.168.12.181:3001/api' 
        : 'http://localhost:3001/api';
      
      const response = await fetch(`${apiBaseUrl}/agreements/public/${token}`);
      const data = await response.json();
      
      if (response.ok) {
        setAgreementData({
          ...data.agreement,
          realtor: data.realtor
        });
        setCurrentStep('form');
      } else {
        console.error('Failed to load agreement:', data.error);
      }
    } catch (error) {
      console.error('Error loading agreement:', error);
    }
  };

  const handleAgreementSigned = async (signatureData) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        // Use the same API base URL logic as the api service
        const apiBaseUrl = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' 
          ? 'http://192.168.12.181:3001/api' 
          : 'http://localhost:3001/api';
        
        const response = await fetch(`${apiBaseUrl}/agreements/public/${token}/sign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ signature_data: signatureData }),
        });
        
        if (response.ok) {
          setSignedAgreement(signatureData);
          setCurrentStep('success');
        } else {
          console.error('Failed to sign agreement');
        }
      }
    } catch (error) {
      console.error('Error signing agreement:', error);
    }
  };

  // Show loading spinner while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // Show authentication forms if not authenticated and no agreement token
  if (!isAuthenticated && !agreementData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
        {authMode === 'login' ? (
          <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </div>
    );
  }

  // Show realtor dashboard if authenticated
  if (isAuthenticated) {
    return <RealtorDashboard />;
  }

  // Show loading spinner while agreement data is loading
  if (!agreementData && currentStep === 'form') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // Show public agreement form (for demo or public links)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {currentStep === 'form' && (
            <>
              <RealtorInfo realtor={agreementData?.realtor} />
              <AgreementForm 
                agreementData={agreementData} 
                onSigned={handleAgreementSigned} 
              />
            </>
          )}

          {currentStep === 'success' && (
            <SuccessScreen signedAgreement={signedAgreement} />
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;