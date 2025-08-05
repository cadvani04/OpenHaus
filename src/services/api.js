// Detect if we're on mobile (different IP) or desktop (localhost)
const getApiBaseUrl = () => {
  console.log('🔍 URL Detection Debug:', {
    hostname: window.location.hostname,
    href: window.location.href,
    isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  });
  
  // If we're on mobile (different device), use the computer's IP
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    console.log('📱 Mobile detected, using IP address');
    return 'http://192.168.12.181:3001/api';
  }
  // If we're on desktop, use localhost
  console.log('💻 Desktop detected, using localhost');
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();
console.log('🔧 API_BASE_URL set to:', API_BASE_URL);
console.log('🔧 Current hostname:', window.location.hostname);
console.log('🔧 Current URL:', window.location.href);
console.log('🔧 User Agent:', navigator.userAgent);

// Test API connectivity immediately
console.log('🧪 Testing API connectivity...');
fetch(`${API_BASE_URL.replace('/api', '')}/api/test`)
  .then(response => response.json())
  .then(data => console.log('✅ API connectivity test successful:', data))
  .catch(error => console.error('❌ API connectivity test failed:', error));

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('homeshow_token');
};

// Helper function to set auth token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem('homeshow_token', token);
};

// Helper function to remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('homeshow_token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  console.log('🌐 Making API request:', {
    url: `${API_BASE_URL}${endpoint}`,
    method: options.method || 'GET',
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + '...' : 'none'
  });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    console.log('📡 API Response:', {
      status: response.status,
      ok: response.ok,
      data: data
    });
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      endpoint: endpoint
    });
    throw error;
  }
};

export const api = {
  // Auth endpoints
  auth: {
    register: async (userData) => {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (response.token) {
        setAuthToken(response.token);
      }
      return response;
    },

    login: async (credentials) => {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (response.token) {
        setAuthToken(response.token);
      }
      return response;
    },

    logout: () => {
      removeAuthToken();
    },

    getProfile: async () => {
      return await apiRequest('/auth/profile');
    },
  },

  // Agreement endpoints
  agreements: {
    create: async (agreementData) => {
      return await apiRequest('/agreements', {
        method: 'POST',
        body: JSON.stringify(agreementData),
      });
    },

    getUserAgreements: async () => {
      return await apiRequest('/agreements/user');
    },

    getByToken: async (token) => {
      return await apiRequest(`/agreements/public/${token}`);
    },

    markAsViewed: async (token) => {
      return await apiRequest(`/agreements/public/${token}/view`, {
        method: 'POST',
      });
    },

    sign: async (token, signatureData) => {
      return await apiRequest(`/agreements/public/${token}/sign`, {
        method: 'POST',
        body: JSON.stringify({ signature_data: signatureData }),
      });
    },

    sendSMS: async (agreementId) => {
      return await apiRequest(`/agreements/${agreementId}/send-sms`, {
        method: 'POST',
      });
    },
  },
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem('homeshow_user');
  return user ? JSON.parse(user) : null;
};

// Set current user in localStorage
export const setCurrentUser = (user) => {
  localStorage.setItem('homeshow_user', JSON.stringify(user));
};
