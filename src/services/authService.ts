import {apiClient} from './apiClient';

export const login = async (userData: {email: string; password: string}) => {
  try {
    return apiClient.post('/auth/login', userData);
  } catch (error) {
    console.error('Login failed', error);
    return;
  }
};

export const logout = async () => {
  try {
    return apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout failed', error);
    return;
  }
};

export const validateToken = async () => {
  try {
    return apiClient.get('/auth/validate-token');
  } catch (error) {
    console.warn('Validation check failed', error);
    return;
  }
};

export const forgotPassword = async (userData: {email: string}) => {
  try {
    return apiClient.post('/auth/forgot-password', userData);
  } catch (error) {
    console.warn('Forgot password request failed', error);
    return;
  }
};

export const resetPassword = async (
  password: string,
  token: string,
  requestId: string
) => {
  try {
    return apiClient.post('/auth/reset-password', {
      password,
      token,
      requestId,
    });
  } catch (error) {
    console.warn('Reset password request failed', error);
    return;
  }
};
