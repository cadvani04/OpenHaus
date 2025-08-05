import React from 'react';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ClockIcon,
  CheckCircleIcon,
  UserGroupIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const Analytics = ({ agreements, clients, openHouses }) => {
  const calculateSignRate = () => {
    if (agreements.length === 0) return 0;
    return Math.round((agreements.filter(a => a.status === 'signed').length / agreements.length) * 100);
  };

  const calculateAverageResponseTime = () => {
    const signedAgreements = agreements.filter(a => a.status === 'signed' && a.signedAt);
    if (signedAgreements.length === 0) return 0;
    
    const totalTime = signedAgreements.reduce((total, agreement) => {
      const created = new Date(agreement.createdAt);
      const signed = new Date(agreement.signedAt);
      return total + (signed - created);
    }, 0);
    
    return Math.round(totalTime / signedAgreements.length / (1000 * 60)); // minutes
  };

  const getMonthlyStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyAgreements = agreements.filter(agreement => {
      const date = new Date(agreement.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    return {
      total: monthlyAgreements.length,
      signed: monthlyAgreements.filter(a => a.status === 'signed').length,
      viewed: monthlyAgreements.filter(a => a.status === 'viewed').length,
      sent: monthlyAgreements.filter(a => a.status === 'sent').length
    };
  };

  const getTopMeetingTypes = () => {
    const typeCounts = {};
    agreements.forEach(agreement => {
      typeCounts[agreement.meetingType] = (typeCounts[agreement.meetingType] || 0) + 1;
    });
    
    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type, count]) => ({ type, count }));
  };

  const monthlyStats = getMonthlyStats();
  const topMeetingTypes = getTopMeetingTypes();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Analytics & Insights</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sign Rate</p>
              <p className="text-2xl font-bold text-gray-900">{calculateSignRate()}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{calculateAverageResponseTime()}m</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900">{clients.filter(c => c.status === 'active').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <HomeIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Houses</p>
              <p className="text-2xl font-bold text-gray-900">{openHouses.filter(oh => oh.status === 'upcoming').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">This Month's Performance</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{monthlyStats.total}</p>
              <p className="text-sm text-gray-500">Total Agreements</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{monthlyStats.signed}</p>
              <p className="text-sm text-gray-500">Signed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{monthlyStats.viewed}</p>
              <p className="text-sm text-gray-500">Viewed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{monthlyStats.sent}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Meeting Types */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Most Popular Meeting Types</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {topMeetingTypes.map((item, index) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-900">{item.type}</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {agreements.slice(0, 5).map(agreement => (
              <div key={agreement.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {agreement.status === 'signed' ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  ) : agreement.status === 'viewed' ? (
                    <ClockIcon className="w-6 h-6 text-blue-600" />
                  ) : (
                    <ClockIcon className="w-6 h-6 text-yellow-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {agreement.clientName} - {agreement.meetingType}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(agreement.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    agreement.status === 'signed' 
                      ? 'bg-green-100 text-green-800'
                      : agreement.status === 'viewed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <p className="text-sm text-gray-700">
              Send agreements within 5 minutes of meeting clients for higher sign rates
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <p className="text-sm text-gray-700">
              Follow up with clients who haven't signed within 24 hours
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <p className="text-sm text-gray-700">
              Use open house agreements to capture leads from walk-ins
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 