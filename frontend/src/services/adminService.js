// Admin API service functions

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

// Fetch admin statistics
export const fetchAdminStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch admin stats');
    }

    return data.stats;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
};

// Fetch all users (with pagination)
export const fetchAdminUsers = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users?page=${page}&limit=${limit}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch users');
    }

    return {
      users: data.users,
      pagination: data.pagination
    };
  } catch (error) {
    console.error('Error fetching admin users:', error);
    throw error;
  }
};

// Get user details by ID
export const fetchUserDetails = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch user details');
    }

    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

// Update user status (activate/deactivate)
export const updateUserStatus = async (userId, isActive) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to update user status');
    }

    return data.user;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

// Format chart data for recharts
export const formatChartData = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) return [];
  
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return apiData.map(item => ({
    month: monthNames[item._id.month - 1] || `Month ${item._id.month}`,
    users: item.count || 0,
    sessions: item.count || 0
  }));
};

// Mock data fallback
export const getMockAdminStats = () => ({
  totalUsers: 1248,
  totalSessions: 3426,
  usersByMonth: [
    { month: 'Jan', users: 186, sessions: 423 },
    { month: 'Feb', users: 305, sessions: 512 },
    { month: 'Mar', users: 237, sessions: 681 },
    { month: 'Apr', users: 273, sessions: 734 },
    { month: 'May', users: 209, sessions: 592 },
    { month: 'Jun', users: 214, sessions: 648 },
  ],
  sessionsByMonth: [
    { month: 'Jan', sessions: 423 },
    { month: 'Feb', sessions: 512 },
    { month: 'Mar', sessions: 681 },
    { month: 'Apr', sessions: 734 },
    { month: 'May', sessions: 592 },
    { month: 'Jun', sessions: 648 },
  ],
  recentUsers: [
    { name: 'John Doe', email: 'john@example.com', createdAt: '2024-01-15' },
    { name: 'Jane Smith', email: 'jane@example.com', createdAt: '2024-01-14' },
    { name: 'Bob Johnson', email: 'bob@example.com', createdAt: '2024-01-13' },
    { name: 'Alice Wilson', email: 'alice@example.com', createdAt: '2024-01-12' },
    { name: 'Mike Davis', email: 'mike@example.com', createdAt: '2024-01-11' },
  ]
});

// Fetch admin feedback with pagination and filters
export const fetchAdminFeedback = async (page = 1, limit = 10, status = 'all', search = '') => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status !== 'all') {
      params.append('status', status);
    }

    if (search.trim()) {
      params.append('search', search.trim());
    }

    const response = await fetch(`${API_BASE_URL}/admin/feedback?${params}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch feedback');
    }

    return {
      feedback: data.feedback,
      pagination: data.pagination
    };
  } catch (error) {
    console.error('Error fetching admin feedback:', error);
    throw error;
  }
};

// Update feedback status
export const updateFeedbackStatus = async (feedbackId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/feedback/${feedbackId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to update feedback status');
    }

    return data.feedback;
  } catch (error) {
    console.error('Error updating feedback status:', error);
    throw error;
  }
};

// Fetch admin sessions with pagination and filters
export const fetchAdminSessions = async (page = 1, limit = 10, status = 'all', search = '') => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status !== 'all') {
      params.append('status', status);
    }

    if (search.trim()) {
      params.append('search', search.trim());
    }

    const response = await fetch(`${API_BASE_URL}/admin/sessions?${params}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch sessions');
    }

    return {
      sessions: data.sessions,
      pagination: data.pagination
    };
  } catch (error) {
    console.error('Error fetching admin sessions:', error);
    throw error;
  }
};

// Update session status
export const updateSessionStatus = async (userId, sessionId, isActive) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/sessions/${userId}/${sessionId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to update session status');
    }

    return data;
  } catch (error) {
    console.error('Error updating session status:', error);
    throw error;
  }
};