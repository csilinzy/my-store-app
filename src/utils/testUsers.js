// src/utils/testUsers.js
/**
 * Test Users Utility
 * Provides sample user data for testing authentication functionality
 */

export const testUsers = {
  // Standard test user
  standardUser: {
    id: 1,
    email: 'test@example.com',
    password: 'TestPassword123!',
    name: 'Test User'
  },
  
  // Admin test user
  adminUser: {
    id: 2,
    email: 'admin@example.com',
    password: 'AdminPassword123!',
    name: 'Admin User',
    role: 'admin'
  },
  
  // Another regular user
  secondaryUser: {
    id: 3,
    email: 'user2@example.com',
    password: 'UserPassword123!',
    name: 'Second User'
  }
};

// Function to get a test user by type
export const getTestUser = (type = 'standardUser') => {
  console.log(`[TestUsers] Retrieving test user of type: ${type}`);
  return testUsers[type] || testUsers.standardUser;
};

// Function to validate test user credentials against stored data
export const validateTestCredentials = (email, password) => {
  console.log(`[TestUsers] Validating credentials for email: ${email}`);
  
  for (const userType in testUsers) {
    const user = testUsers[userType];
    if (user.email === email && user.password === password) {
      console.log(`[TestUsers] Valid test user found: ${user.name}`);
      return { isValid: true, user: { ...user } }; // Return a copy to prevent mutation
    }
  }
  
  console.log(`[TestUsers] Invalid credentials provided`);
  return { isValid: false, user: null };
};

// Function to get all test user emails for reference
export const getAllTestUserEmails = () => {
  console.log(`[TestUsers] Getting all test user emails`);
  return Object.values(testUsers).map(user => user.email);
};