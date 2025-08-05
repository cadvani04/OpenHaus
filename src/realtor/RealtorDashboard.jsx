import React, { useState, useEffect } from 'react';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  PlusIcon,
  BellIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import AgreementList from './components/AgreementList';
import CreateAgreement from './components/CreateAgreement';
import ClientManagement from './components/ClientManagement';
import OpenHouseManager from './components/OpenHouseManager';
import Analytics from './components/Analytics';

const RealtorDashboard = () => {
  const { user, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState('agreements');
  const [realtor, setRealtor] = useState(null);
  const [agreements, setAgreements] = useState([]);
  const [clients, setClients] = useState([]);
  const [openHouses, setOpenHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Set realtor data from authenticated user
      setRealtor({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone || '',
        company: user.company_name || '',
        license: user.license_number || '',
        state: user.state || '',
        avatar: `https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=${user.first_name.charAt(0)}${user.last_name.charAt(0)}`
      });

      // Load real agreements from API
      try {
        console.log('🔄 Loading agreements from API...');
        const response = await api.agreements.getUserAgreements();
        console.log('✅ Agreements loaded successfully:', response);
        setAgreements(response.agreements || []);
        setError(null);
      } catch (error) {
        console.error('❌ Failed to load agreements:', error);
        console.error('Error details:', error.message, error.stack);
        setAgreements([]);
        setError(`Failed to load agreements: ${error.message}`);
      }

      // For now, use mock data for clients and open houses
      // TODO: Implement real API endpoints for these
      const mockClients = [
        {
          id: 'client-1',
          name: 'Sam Wilson',
          phone: '(555) 987-6543',
          email: 'sam.wilson@email.com',
          status: 'active',
          lastContact: '2024-01-15T10:45:00Z',
          agreements: 2,
          propertiesViewed: 3
        },
        {
          id: 'client-2',
          name: 'Maria Garcia',
          phone: '(555) 456-7890',
          email: 'maria.garcia@email.com',
          status: 'prospect',
          lastContact: '2024-01-14T14:25:00Z',
          agreements: 1,
          propertiesViewed: 1
        }
      ];

      const mockOpenHouses = [
        {
          id: 'oh-1',
          address: '123 Main St, San Francisco, CA',
          date: '2024-01-20T14:00:00Z',
          duration: 120,
          status: 'upcoming',
          attendees: 0,
          agreements: []
        },
        {
          id: 'oh-2',
          address: '456 Oak Ave, San Francisco, CA',
          date: '2024-01-18T10:00:00Z',
          duration: 120,
          status: 'completed',
          attendees: 8,
          agreements: ['agreement-2']
        }
      ];

      setClients(mockClients);
      setOpenHouses(mockOpenHouses);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgreement = (newAgreement) => {
    setAgreements(prev => [newAgreement, ...prev]);
    setCurrentTab('agreements');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'signed': return 'bg-green-100 text-green-800';
      case 'viewed': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'signed': return '✓';
      case 'viewed': return '👁️';
      case 'sent': return '📤';
      default: return '⏳';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HomeShow</h1>
                <p className="text-sm text-gray-500">Realtor Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <BellIcon className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <img 
                  src={realtor?.avatar} 
                  alt={realtor?.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">{realtor?.name}</span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Agreements</p>
                <p className="text-2xl font-bold text-gray-900">{agreements.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold text-gray-900">{clients.filter(c => c.status === 'active').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <HomeIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open Houses</p>
                <p className="text-2xl font-bold text-gray-900">{openHouses.filter(oh => oh.status === 'upcoming').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sign Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((agreements.filter(a => a.status === 'signed').length / agreements.length) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'agreements', name: 'Agreements', icon: DocumentTextIcon },
                { id: 'clients', name: 'Clients', icon: UserGroupIcon },
                { id: 'openhouses', name: 'Open Houses', icon: HomeIcon },
                { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    currentTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow">
          {currentTab === 'agreements' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Agreements</h2>
                <button
                  onClick={() => setCurrentTab('create')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Send Agreement</span>
                </button>
              </div>
              <AgreementList agreements={agreements} />
            </div>
          )}
          
          {currentTab === 'clients' && (
            <div className="p-6">
              <ClientManagement clients={clients} agreements={agreements} />
            </div>
          )}
          
          {currentTab === 'openhouses' && (
            <div className="p-6">
              <OpenHouseManager 
                openHouses={openHouses} 
                agreements={agreements}
                onUpdateOpenHouse={(updated) => {
                  setOpenHouses(prev => prev.map(oh => oh.id === updated.id ? updated : oh));
                }}
              />
            </div>
          )}
          
          {currentTab === 'analytics' && (
            <div className="p-6">
              <Analytics agreements={agreements} clients={clients} openHouses={openHouses} />
            </div>
          )}
          
          {currentTab === 'create' && (
            <div className="p-6">
              <CreateAgreement 
                realtor={realtor}
                onAgreementCreated={handleCreateAgreement}
                onCancel={() => setCurrentTab('agreements')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealtorDashboard; 