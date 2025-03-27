import {apiClient} from './apiClient';

export const register = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    return apiClient.post('/api/users', userData);
  } catch (error) {
    console.error('Registration failed', error);
    return;
  }
};

export const changePassword = async (userData: {
  oldPassword: string;
  newPassword: string;
}) => {
  try {
    return apiClient.patch('/api/users/', userData);
  } catch (error) {
    console.warn('Password update failed', error);
    return;
  }
};
