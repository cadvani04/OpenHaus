import React, { useState } from 'react';
import { 
  PlusIcon, 
  CalendarIcon, 
  MapPinIcon, 
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const OpenHouseManager = ({ openHouses, agreements, onUpdateOpenHouse }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newOpenHouse, setNewOpenHouse] = useState({
    address: '',
    date: '',
    time: '',
    duration: 120,
    notes: ''
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'upcoming':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Upcoming</span>;
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const getAgreementsForOpenHouse = (openHouseId) => {
    return agreements.filter(agreement => 
      agreement.propertyAddress && 
      agreement.meetingType === 'Open House Agreement' &&
      agreement.propertyAddress.includes(openHouseId)
    );
  };

  const handleCreateOpenHouse = () => {
    const openHouse = {
      id: `oh-${Date.now()}`,
      address: newOpenHouse.address,
      date: new Date(`${newOpenHouse.date}T${newOpenHouse.time}`).toISOString(),
      duration: parseInt(newOpenHouse.duration),
      status: 'upcoming',
      attendees: 0,
      agreements: [],
      notes: newOpenHouse.notes
    };

    // In production, this would save to backend
    console.log('Creating open house:', openHouse);
    
    setShowCreateForm(false);
    setNewOpenHouse({
      address: '',
      date: '',
      time: '',
      duration: 120,
      notes: ''
    });
  };

  const sendOpenHouseAgreement = (openHouse) => {
    // This would integrate with the CreateAgreement component
    console.log('Sending open house agreement for:', openHouse.address);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Open Houses</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Schedule Open House</span>
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-gray-50 rounded-lg p-6 border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule New Open House</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Address *
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={newOpenHouse.address}
                  onChange={(e) => setNewOpenHouse(prev => ({ ...prev, address: e.target.value }))}
                  className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123 Main St, City, State"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={newOpenHouse.date}
                  onChange={(e) => setNewOpenHouse(prev => ({ ...prev, date: e.target.value }))}
                  className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="time"
                  value={newOpenHouse.time}
                  onChange={(e) => setNewOpenHouse(prev => ({ ...prev, time: e.target.value }))}
                  className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <select
                value={newOpenHouse.duration}
                onChange={(e) => setNewOpenHouse(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={newOpenHouse.notes}
              onChange={(e) => setNewOpenHouse(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any special instructions or notes..."
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setShowCreateForm(false)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateOpenHouse}
              disabled={!newOpenHouse.address || !newOpenHouse.date || !newOpenHouse.time}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
            >
              Schedule Open House
            </button>
          </div>
        </div>
      )}

      {/* Open Houses List */}
      <div className="space-y-4">
        {openHouses.length === 0 ? (
          <div className="text-center py-12">
            <HomeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No open houses scheduled</h3>
            <p className="text-gray-500">Schedule your first open house to start tracking attendees</p>
          </div>
        ) : (
          openHouses.map(openHouse => {
            const openHouseAgreements = getAgreementsForOpenHouse(openHouse.id);
            const signedAgreements = openHouseAgreements.filter(a => a.status === 'signed');
            
            return (
              <div key={openHouse.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <MapPinIcon className="w-5 h-5 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900">{openHouse.address}</h3>
                      {getStatusBadge(openHouse.status)}
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{formatDate(openHouse.date)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{formatTime(openHouse.date)} - {formatTime(new Date(new Date(openHouse.date).getTime() + openHouse.duration * 60000))}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <UserGroupIcon className="w-4 h-4" />
                        <span>{openHouse.attendees} attendees</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {openHouse.status === 'upcoming' && (
                      <button
                        onClick={() => sendOpenHouseAgreement(openHouse)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Send Agreement
                      </button>
                    )}
                    <button
                      onClick={() => console.log('View open house details:', openHouse.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {openHouse.notes && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{openHouse.notes}</p>
                  </div>
                )}

                {/* Agreements Summary */}
                {openHouseAgreements.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Agreements from this open house:</h4>
                    <div className="space-y-2">
                      {openHouseAgreements.map(agreement => (
                        <div key={agreement.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{agreement.clientName}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            agreement.status === 'signed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {agreement.status === 'signed' ? 'Signed' : 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{openHouse.attendees}</p>
                      <p className="text-xs text-gray-500">Attendees</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-600">{openHouseAgreements.length}</p>
                      <p className="text-xs text-gray-500">Agreements Sent</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">{signedAgreements.length}</p>
                      <p className="text-xs text-gray-500">Signed</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OpenHouseManager; 