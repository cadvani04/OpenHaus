import React from 'react';

const SuccessScreen = ({ signedAgreement, onBackToForm }) => {
  const downloadPDF = () => {
    // In production, this would generate and download the PDF
    console.log('Downloading PDF for agreement:', signedAgreement?.id);
    // You would implement PDF generation here using jsPDF
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 text-center">
        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Agreement Signed!</h1>
        <p className="text-green-100">
          Your meeting agreement has been successfully signed and submitted.
        </p>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Agreement Details</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Agreement ID:</span>
              <span className="font-mono">{signedAgreement?.id || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Signed:</span>
              <span>{signedAgreement?.signedAt ? new Date(signedAgreement.signedAt).toLocaleString() : new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Meeting Type:</span>
              <span>{signedAgreement?.meetingType || 'Meeting Agreement'}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• You'll receive a confirmation email</li>
            <li>• Your realtor will contact you soon</li>
            <li>• Download your copy of the agreement below</li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={downloadPDF}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Download PDF Copy
          </button>
          
          <button
            onClick={onBackToForm}
            className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            View Agreement Again
          </button>
        </div>
        
        <div className="text-center text-xs text-gray-500 pt-4 border-t">
          <p>This agreement is legally binding and compliant with ESIGN Act</p>
          <p className="mt-1">Powered by HomeShow</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen; 