const API_BASE_URL = 'http://localhost:8080';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return apiRequest('/api/auth/logout', {
      method: 'POST',
    });
  },
};

// User Management API
export const userAPI = {
  getUsers: async () => {
    return apiRequest('/api/admin/users');
  },

  createUser: async (userData) => {
    return apiRequest('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  updateUser: async (id, userData) => {
    return apiRequest(`/api/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (id) => {
    return apiRequest(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Kit Management API
export const kitAPI = {
  getKits: async () => {
    return apiRequest('/api/kits');
  },

  getAvailableKits: async () => {
    return apiRequest('/api/kits/available');
  },

  createKit: async (kitData) => {
    return apiRequest('/api/kits', {
      method: 'POST',
      body: JSON.stringify(kitData),
    });
  },

  updateKitStatus: async (id, status) => {
    return apiRequest(`/api/kits/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  },

  chooseKit: async (kitName) => {
    return apiRequest('/api/kits/choose', {
      method: 'POST',
      body: JSON.stringify({ kitName }),
    });
  },

  importKits: async (kitsData) => {
    return apiRequest('/api/kits/import', {
      method: 'POST',
      body: JSON.stringify({ kits: kitsData }),
    });
  },
};

// Group Management API
export const groupAPI = {
  getGroups: async () => {
    return apiRequest('/api/groups');
  },

  getStudentGroup: async (email) => {
    return apiRequest(`/api/groups/student?email=${encodeURIComponent(email)}`);
  },

  getLecturerGroups: async (email) => {
    return apiRequest(`/api/groups/lecturer?email=${encodeURIComponent(email)}`);
  },

  createGroup: async (groupData) => {
    return apiRequest('/api/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  },

  addMemberToGroup: async (groupName, memberEmail) => {
    return apiRequest('/api/groups/add-member', {
      method: 'POST',
      body: JSON.stringify({ groupName, memberEmail }),
    });
  },

  moveMember: async (memberEmail, fromGroup, toGroup) => {
    return apiRequest('/api/groups/move-member', {
      method: 'POST',
      body: JSON.stringify({ memberEmail, fromGroup, toGroup }),
    });
  },

  importGroups: async (formData) => {
    return apiRequest('/api/groups/import', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },
};

// Wallet API
export const walletAPI = {
  getWallet: async () => {
    return apiRequest('/api/wallet');
  },

  deposit: async () => {
    return apiRequest('/api/wallet/deposit', {
      method: 'POST',
    });
  },

  deduct: async (amount, description) => {
    return apiRequest('/api/wallet/deduct', {
      method: 'POST',
      body: JSON.stringify({ amount, description }),
    });
  },

  refund: async (amount, description) => {
    return apiRequest('/api/wallet/refund', {
      method: 'POST',
      body: JSON.stringify({ amount, description }),
    });
  },
};

// Rental API
export const rentalAPI = {
  submitRentalRequest: async (rentalData) => {
    return apiRequest('/api/rentals/request', {
      method: 'POST',
      body: JSON.stringify(rentalData),
    });
  },

  getRentalRequests: async () => {
    return apiRequest('/api/admin/rental-requests');
  },

  approveRentalRequest: async (id) => {
    return apiRequest(`/api/admin/rental-requests/${id}/approve`, {
      method: 'POST',
    });
  },

  rejectRentalRequest: async (id, reason) => {
    return apiRequest(`/api/admin/rental-requests/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
};

// Refund API
export const refundAPI = {
  submitRefundRequest: async (refundData) => {
    return apiRequest('/api/refunds/request', {
      method: 'POST',
      body: JSON.stringify(refundData),
    });
  },

  getRefundRequests: async () => {
    return apiRequest('/api/admin/refund-requests');
  },

  approveRefundRequest: async (id, damageAssessment) => {
    return apiRequest(`/api/admin/refund-requests/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ damageAssessment }),
    });
  },

  rejectRefundRequest: async (id, reason) => {
    return apiRequest(`/api/admin/refund-requests/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
};

// Notification API
export const notificationAPI = {
  sendNotification: async (notificationData) => {
    return apiRequest('/api/notifications/send', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  },

  getUserNotifications: async (userEmail) => {
    return apiRequest(`/api/notifications/${userEmail}`);
  },
};

// Student Import API
export const studentAPI = {
  importStudents: async (studentsData) => {
    return apiRequest('/api/students/import', {
      method: 'POST',
      body: JSON.stringify({ students: studentsData }),
    });
  },
};

// Academic Affairs API
export const academicAPI = {
  // Semesters
  getSemesters: async () => {
    return apiRequest('/api/academic/semesters');
  },

  createSemester: async (semesterData) => {
    return apiRequest('/api/academic/semesters', {
      method: 'POST',
      body: JSON.stringify(semesterData),
    });
  },

  updateSemester: async (id, semesterData) => {
    return apiRequest(`/api/academic/semesters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(semesterData),
    });
  },

  deleteSemester: async (id) => {
    return apiRequest(`/api/academic/semesters/${id}`, {
      method: 'DELETE',
    });
  },

  // Classes
  getClasses: async (semesterId) => {
    if (semesterId) {
      return apiRequest(`/api/academic/semesters/${semesterId}/classes`);
    } else {
      return apiRequest('/api/academic/classes');
    }
  },

  createClass: async (semesterId, classData) => {
    return apiRequest(`/api/academic/semesters/${semesterId}/classes`, {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  },

  updateClass: async (id, classData) => {
    return apiRequest(`/api/academic/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(classData),
    });
  },

  deleteClass: async (id) => {
    return apiRequest(`/api/academic/classes/${id}`, {
      method: 'DELETE',
    });
  },

  // Students
  getStudents: async () => {
    return apiRequest('/api/academic/students');
  },

  createStudent: async (studentData) => {
    return apiRequest('/api/academic/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },

  updateStudent: async (id, studentData) => {
    return apiRequest(`/api/academic/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  },

  deleteStudent: async (id) => {
    return apiRequest(`/api/academic/students/${id}`, {
      method: 'DELETE',
    });
  },

  // Lecturers
  getLecturers: async () => {
    return apiRequest('/api/academic/lecturers');
  },

  createLecturer: async (lecturerData) => {
    return apiRequest('/api/academic/lecturers', {
      method: 'POST',
      body: JSON.stringify(lecturerData),
    });
  },

  updateLecturer: async (id, lecturerData) => {
    return apiRequest(`/api/academic/lecturers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(lecturerData),
    });
  },

  deleteLecturer: async (id) => {
    return apiRequest(`/api/academic/lecturers/${id}`, {
      method: 'DELETE',
    });
  },

  // Enrollments
  getEnrollments: async () => {
    return apiRequest('/api/academic/enrollments');
  },

  createEnrollment: async (enrollmentData) => {
    return apiRequest('/api/academic/enrollments', {
      method: 'POST',
      body: JSON.stringify(enrollmentData),
    });
  },

  deleteEnrollment: async (id) => {
    return apiRequest(`/api/academic/enrollments/${id}`, {
      method: 'DELETE',
    });
  },

  // Assignments
  getAssignments: async () => {
    return apiRequest('/api/academic/assignments');
  },

  createAssignment: async (assignmentData) => {
    return apiRequest('/api/academic/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  },

  deleteAssignment: async (id) => {
    return apiRequest(`/api/academic/assignments/${id}`, {
      method: 'DELETE',
    });
  },

  // Logs
  getLogs: async () => {
    return apiRequest('/api/academic/logs');
  },
}; 