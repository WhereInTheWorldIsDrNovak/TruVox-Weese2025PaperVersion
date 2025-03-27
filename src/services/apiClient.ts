import axios from 'axios';
import {NavigateFunction} from 'react-router-dom';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001', // localhost if running backend locally
  withCredentials: true, // include cookies in responses for authentication
  // timeout: 10000
});

// Interceptors code to add headers like auth token for pre-flight requests - enabled with withCredentials set to true.

// Interceptors code to handle axios errors globally
const setupInterceptors = (navigate: NavigateFunction) => {
  apiClient.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (error.response?.status === 403) {
        // Invalid/Expired access token or  Invalid/Expired refresh token - clear session and redirect to login
        const currentPath = window.location.pathname;
        const queryParams = window.location.search;
        // console.log(queryParams);
        if (currentPath.startsWith('/transvoice')) {
          const remainingPath = currentPath.replace('/transvoice', '');
          // console.log(remainingPath);
          navigate(`/${remainingPath}${queryParams}`);
        } else {
          // console.log(currentPath);
          navigate(`/${currentPath}${queryParams}`);
        }
        return Promise.reject(error);
      }

      if (
        error.response?.status === 401 &&
        error.response.data.message ===
          'Refresh token missing. Please log in again.'
      ) {
        // missing refreshToken
        const currentPath = window.location.pathname;
        const queryParams = window.location.search;
        // console.log(queryParams);
        if (currentPath.startsWith('/transvoice')) {
          const remainingPath = currentPath.replace('/transvoice', '');
          // console.log(remainingPath);
          navigate(`/${remainingPath}${queryParams}`);
        } else {
          // console.log(currentPath);
          navigate(`/${currentPath}${queryParams}`);
        }
        return Promise.reject(error);
      }

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        error.response.data.message === 'Access token missing' &&
        error.response.data.message !== 'User not found' &&
        error.response.data.message !== 'Invalid Password'
      ) {
        originalRequest._retry = true;
        try {
          // Call the refresh token API
          await apiClient.post('/auth/refresh-token');
          // Backend sets new accessToken in cookies, retry the original request
          return apiClient(originalRequest);
        } catch (error) {
          const refreshError = error as Error;
          console.error('Failed to refresh access token:', refreshError);
          // Refresh token is not valid
          const currentPath = window.location.pathname;
          const queryParams = window.location.search;
          // console.log(queryParams);
          if (currentPath.startsWith('/transvoice')) {
            const remainingPath = currentPath.replace('/transvoice', '');
            // console.log(remainingPath);
            navigate(`/${remainingPath}${queryParams}`);
          } else {
            // console.log(currentPath);
            navigate(`/${currentPath}${queryParams}`);
          }
          return Promise.reject(error); // Explicitly reject to stop further execution
        }
      }
      // if error is not axios errors(neither 403 nor 401/401+retry), reject the promise and let calling fun handle it.
      return Promise.reject(error);
    }
  );
};
export {apiClient, setupInterceptors};
