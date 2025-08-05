import React, { useState } from 'react';
import SignaturePad from './SignaturePad';

const AgreementForm = ({ agreementData, onSigned }) => {
  const [currentStep, setCurrentStep] = useState('consent'); // 'consent', 'agreement', 'signature'
  const [consentGiven, setConsentGiven] = useState(false);
  const [signature, setSignature] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConsent = () => {
    setConsentGiven(true);
    setCurrentStep('agreement');
  };

  const handleAgreementRead = () => {
    setCurrentStep('signature');
  };

  const handleSignatureComplete = (signatureData) => {
    setSignature(signatureData);
  };

  const handleSubmit = async () => {
    if (!signature) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSigned({
        signature,
        timestamp: new Date().toISOString(),
        clientConsent: true
      });
    } catch (error) {
      console.error('Error submitting agreement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {currentStep === 'consent' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Meeting Agreement
            </h2>
            <p className="text-gray-600">
              Please review and sign the agreement for your meeting with {agreementData.realtor.name}
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">ESIGN Consent</h3>
            <p className="text-sm text-blue-800">
              By proceeding, you consent to receive and sign this agreement electronically. 
              This consent applies to all future agreements sent by {agreementData.realtor.name}.
            </p>
          </div>
          
          <button
            onClick={handleConsent}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            I Consent - Continue to Agreement
          </button>
        </div>
      )}

      {currentStep === 'agreement' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Agreement Details</h2>
            <span className="text-sm text-gray-500">
              {agreementData.meetingType}
            </span>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <div className="space-y-4 text-sm text-gray-700 whitespace-pre-line">
              {agreementData.agreementText}
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> This agreement expires on{' '}
              {new Date(agreementData.expiresAt).toLocaleDateString()}
            </p>
          </div>
          
          <button
            onClick={handleAgreementRead}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            I've Read the Agreement - Proceed to Sign
          </button>
        </div>
      )}

      {currentStep === 'signature' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Electronic Signature
            </h2>
            <p className="text-gray-600">
              Please sign below to complete the agreement
            </p>
          </div>
          
          <SignaturePad onSignatureComplete={handleSignatureComplete} />
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Legal Notice:</strong> Your electronic signature has the same legal effect as a handwritten signature.
            </p>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!signature || isSubmitting}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Agreement'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AgreementForm; 