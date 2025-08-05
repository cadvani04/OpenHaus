import React, { useState } from 'react';
import { 
  UserIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  CalendarIcon,
  DocumentTextIcon,
  HomeIcon,
  PlusIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

const ClientManagement = ({ clients, agreements }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);

  const getClientAgreements = (clientId) => {
    return agreements.filter(agreement => 
      agreement.clientPhone === clients.find(c => c.id === clientId)?.phone
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
      case 'prospect':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Prospect</span>;
      case 'inactive':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredClients = clients.filter(client => {
    const matchesFilter = filter === 'all' || client.status === filter;
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sendNewAgreement = (client) => {
    // This would integrate with the CreateAgreement component
    console.log('Sending new agreement to:', client.name);
  };

  const sendMessage = (client) => {
    // This would integrate with SMS/messaging functionality
    console.log('Sending message to:', client.name);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Client Management</h2>
        <button
          onClick={() => console.log('Add new client')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex space-x-2">
          {['all', 'active', 'prospect', 'inactive'].map(status => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clients List */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Clients ({filteredClients.length})</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredClients.length === 0 ? (
                <div className="p-6 text-center">
                  <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No clients found</p>
                </div>
              ) : (
                filteredClients.map(client => {
                  const clientAgreements = getClientAgreements(client.id);
                  const signedAgreements = clientAgreements.filter(a => a.status === 'signed');
                  
                  return (
                    <div
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                        selectedClient?.id === client.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{client.name}</h4>
                        {getStatusBadge(client.status)}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <span className="flex items-center space-x-1">
                          <PhoneIcon className="w-4 h-4" />
                          <span>{client.phone}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{clientAgreements.length} agreements</span>
                        <span>{signedAgreements.length} signed</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className="lg:col-span-2">
          {selectedClient ? (
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">{selectedClient.name}</h3>
                    <p className="text-gray-500">{selectedClient.email}</p>
                  </div>
                  <div className="flex space-x-2">
                    {getStatusBadge(selectedClient.status)}
                    <button
                      onClick={() => sendMessage(selectedClient)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Send Message"
                    >
                      <ChatBubbleLeftIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{selectedClient.agreements}</p>
                    <p className="text-sm text-gray-500">Total Agreements</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedClient.propertiesViewed}</p>
                    <p className="text-sm text-gray-500">Properties Viewed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {getClientAgreements(selectedClient.id).filter(a => a.status === 'signed').length}
                    </p>
                    <p className="text-sm text-gray-500">Signed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {getClientAgreements(selectedClient.id).filter(a => a.status === 'sent').length}
                    </p>
                    <p className="text-sm text-gray-500">Pending</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => sendNewAgreement(selectedClient)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <DocumentTextIcon className="w-5 h-5" />
                    <span>Send Agreement</span>
                  </button>
                  <button
                    onClick={() => console.log('Schedule meeting with:', selectedClient.name)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <CalendarIcon className="w-5 h-5" />
                    <span>Schedule Meeting</span>
                  </button>
                </div>
              </div>

              {/* Client Agreements History */}
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Agreement History</h4>
                <div className="space-y-4">
                  {getClientAgreements(selectedClient.id).length === 0 ? (
                    <div className="text-center py-8">
                      <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No agreements yet</p>
                      <button
                        onClick={() => sendNewAgreement(selectedClient)}
                        className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Send first agreement
                      </button>
                    </div>
                  ) : (
                    getClientAgreements(selectedClient.id).map(agreement => (
                      <div key={agreement.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{agreement.meetingType}</h5>
                          <span className={`px-2 py-1 rounded text-xs ${
                            agreement.status === 'signed' 
                              ? 'bg-green-100 text-green-800' 
                              : agreement.status === 'viewed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                          <span className="flex items-center space-x-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formatDate(agreement.createdAt)}</span>
                          </span>
                          {agreement.propertyAddress && (
                            <span className="flex items-center space-x-1">
                              <HomeIcon className="w-4 h-4" />
                              <span>{agreement.propertyAddress}</span>
                            </span>
                          )}
                        </div>
                        
                        {agreement.notes && (
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {agreement.notes}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Client</h3>
              <p className="text-gray-500">Choose a client from the list to view their details and agreement history</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientManagement; 