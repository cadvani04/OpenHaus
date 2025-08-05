import React, { useState } from 'react';
import { 
  EyeIcon, 
  DocumentArrowDownIcon,
  PhoneIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { api } from '../../services/api';

const AgreementList = ({ agreements }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'signed':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'viewed':
        return <EyeIcon className="w-5 h-5 text-blue-600" />;
      case 'sent':
        return <PaperAirplaneIcon className="w-5 h-5 text-yellow-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'signed': return 'bg-green-100 text-green-800';
      case 'viewed': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'signed': return 'Signed';
      case 'viewed': return 'Viewed';
      case 'sent': return 'Sent';
      default: return 'Pending';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredAgreements = agreements.filter(agreement => {
    const matchesFilter = filter === 'all' || agreement.status === filter;
    const clientName = agreement.client_name || agreement.clientName || '';
    const clientPhone = agreement.client_phone || agreement.clientPhone || '';
    const meetingType = agreement.meeting_type || agreement.meetingType || '';
    
    const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clientPhone.includes(searchTerm) ||
                         meetingType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const downloadPDF = (agreement) => {
    // In production, this would generate and download the PDF
    console.log('Downloading PDF for agreement:', agreement.id);
  };

  const resendAgreement = async (agreement) => {
    try {
      const result = await api.agreements.sendSMS(agreement.id);
      
      if (result.sms && result.sms.sent) {
        alert(`✅ SMS sent successfully!\n\nMessage ID: ${result.sms.messageId}\n\nClient: ${agreement.client_name || agreement.clientName}\nPhone: ${agreement.client_phone || agreement.clientPhone}`);
      } else {
        alert(`❌ Failed to send SMS.\n\nError: ${result.sms?.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      alert('Failed to send SMS. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by client name, phone, or meeting type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex space-x-2">
          {['all', 'sent', 'viewed', 'signed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Agreements List */}
      <div className="space-y-4">
        {filteredAgreements.length === 0 ? (
          <div className="text-center py-12">
            <DocumentArrowDownIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No agreements found</h3>
            <p className="text-gray-500">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start by sending your first agreement'
              }
            </p>
          </div>
        ) : (
          filteredAgreements.map(agreement => (
            <div key={agreement.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getStatusIcon(agreement.status)}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{agreement.client_name || agreement.clientName}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <PhoneIcon className="w-4 h-4" />
                          <span>{agreement.client_phone || agreement.clientPhone}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{formatDate(agreement.created_at || agreement.createdAt)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Meeting Type:</span>
                      <p className="font-medium text-gray-900">{agreement.meeting_type || agreement.meetingType}</p>
                    </div>
                    {agreement.propertyAddress && (
                      <div>
                        <span className="text-sm text-gray-500">Property:</span>
                        <p className="font-medium text-gray-900">{agreement.propertyAddress}</p>
                      </div>
                    )}
                  </div>

                  {agreement.notes && (
                    <div className="mb-4">
                      <span className="text-sm text-gray-500">Notes:</span>
                      <p className="text-gray-700">{agreement.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end space-y-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agreement.status)}`}>
                    {getStatusText(agreement.status)}
                  </span>
                  
                  <div className="flex space-x-2">
                    {agreement.status === 'signed' && (
                      <button
                        onClick={() => downloadPDF(agreement)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Download PDF"
                      >
                        <DocumentArrowDownIcon className="w-5 h-5" />
                      </button>
                    )}
                    
                    {agreement.status === 'sent' && (
                      <button
                        onClick={() => resendAgreement(agreement)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Resend Agreement"
                      >
                        <PaperAirplaneIcon className="w-5 h-5" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => console.log('View agreement details:', agreement.id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="View Details"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Created: {formatDate(agreement.created_at || agreement.createdAt)}</span>
                  {agreement.sent_at && <span>• Sent: {formatDate(agreement.sent_at)}</span>}
                  {agreement.viewed_at && <span>• Viewed: {formatDate(agreement.viewed_at)}</span>}
                  {agreement.signed_at && <span>• Signed: {formatDate(agreement.signed_at)}</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{agreements.length}</p>
            <p className="text-sm text-gray-500">Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">{agreements.filter(a => a.status === 'sent').length}</p>
            <p className="text-sm text-gray-500">Sent</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{agreements.filter(a => a.status === 'viewed').length}</p>
            <p className="text-sm text-gray-500">Viewed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{agreements.filter(a => a.status === 'signed').length}</p>
            <p className="text-sm text-gray-500">Signed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementList; 