import React, { useState } from 'react';
import { 
  ArrowLeftIcon, 
  PaperAirplaneIcon,
  UserIcon,
  PhoneIcon,
  HomeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { api } from '../../services/api';

const CreateAgreement = ({ realtor, onAgreementCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    meetingType: 'Buyer Consultation',
    propertyAddress: '',
    notes: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const meetingTypes = [
    'Buyer Consultation',
    'Listing Consultation',
    'Open House Agreement',
    'Property Tour Agreement'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendAgreement = async () => {
    if (!formData.clientName || !formData.clientPhone) {
      alert('Please fill in client name and phone number');
      return;
    }

    setIsSending(true);

    try {
      // Create agreement via API
      const agreementData = {
        client_name: formData.clientName,
        client_phone: formData.clientPhone,
        client_email: '', // Optional
        meeting_type: formData.meetingType,
        state: realtor.state || 'CA',
        agreement_text: `This is a ${formData.meetingType.toLowerCase()} agreement between ${realtor.name} and ${formData.clientName}. ${formData.notes ? `Notes: ${formData.notes}` : ''}`
      };

      const response = await api.agreements.create(agreementData);
      
      console.log('Agreement created:', response);
      
      // Show SMS status
      if (response.sms && response.sms.sent) {
        alert(`✅ Agreement sent successfully!\n\nSMS Status: Sent\nMessage ID: ${response.sms.messageId}\n\nClient: ${formData.clientName}\nPhone: ${formData.clientPhone}`);
      } else {
        alert(`⚠️ Agreement created but SMS failed to send.\n\nError: ${response.sms?.error || 'Unknown error'}\n\nYou can manually send the SMS link: ${window.location.origin}?token=${response.agreement.security_token}`);
      }
      
      // Add the new agreement to the list
      const newAgreement = {
        id: response.agreement.id,
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        meetingType: formData.meetingType,
        status: 'sent',
        createdAt: new Date().toISOString(),
        security_token: response.agreement.security_token,
        expires_at: response.agreement.expires_at,
        smsSent: response.sms?.sent || false
      };
      
      onAgreementCreated(newAgreement);
    } catch (error) {
      console.error('Error creating agreement:', error);
      alert('Failed to create agreement. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const generateSMSPreview = () => {
    const message = `Hi ${formData.clientName}, please review and sign the ${formData.meetingType.toLowerCase()} agreement for our meeting: ${formData.propertyAddress ? `at ${formData.propertyAddress}` : ''} [secure link] - HomeShow`;
    return message;
  };

  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPreviewMode(false)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Form</span>
          </button>
          <h2 className="text-lg font-medium text-gray-900">Preview & Send</h2>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">SMS Preview</h3>
          <div className="bg-white border rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700">{generateSMSPreview()}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Client Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>
                  <span className="ml-2 font-medium">{formData.clientName}</span>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <span className="ml-2 font-medium">{formData.clientPhone}</span>
                </div>
                <div>
                  <span className="text-gray-500">Meeting Type:</span>
                  <span className="ml-2 font-medium">{formData.meetingType}</span>
                </div>
                {formData.propertyAddress && (
                  <div>
                    <span className="text-gray-500">Property:</span>
                    <span className="ml-2 font-medium">{formData.propertyAddress}</span>
                  </div>
                )}
              </div>
            </div>

            {formData.notes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                <p className="text-sm text-gray-700 bg-white border rounded-lg p-3">{formData.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setPreviewMode(false)}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300"
          >
            Edit
          </button>
          <button
            onClick={handleSendAgreement}
            disabled={isSending}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center space-x-2"
          >
            {isSending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="w-5 h-5" />
                <span>Send Agreement</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Agreements</span>
        </button>
        <h2 className="text-lg font-medium text-gray-900">Send New Agreement</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Name *
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter client name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Phone Number *
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleInputChange}
                className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(555) 123-4567"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Type
            </label>
            <select
              name="meetingType"
              value={formData.meetingType}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {meetingTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Address (Optional)
            </label>
            <div className="relative">
              <HomeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="propertyAddress"
                value={formData.propertyAddress}
                onChange={handleInputChange}
                className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123 Main St, City, State"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add any additional notes for the client..."
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <DocumentTextIcon className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Client receives SMS with secure link</li>
                  <li>• They can review and sign on their phone</li>
                  <li>• You'll get notified when they sign</li>
                  <li>• Agreement is stored for compliance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-900 mb-2">Legal Compliance</h3>
            <p className="text-sm text-yellow-800">
              This agreement will include state-specific legal disclaimers and comply with ESIGN Act requirements for electronic signatures.
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 pt-6 border-t">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={() => setPreviewMode(true)}
          disabled={!formData.clientName || !formData.clientPhone}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
        >
          Preview & Send
        </button>
      </div>
    </div>
  );
};

export default CreateAgreement; 