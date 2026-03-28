import { getTestUser, validateTestCredentials } from './utils/testUsers';

// Get the standard test user
const user = getTestUser('standardUser');

// Validate credentials
const { isValid, user: validatedUser } = validateTestCredentials('test@example.com', 'TestPassword123!');