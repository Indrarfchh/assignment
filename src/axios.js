// axiosConfig.js
import axios from 'axios';

// Utility functions to manage cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function deleteCookie(name) {
  document.cookie = `${name}=; Max-Age=0; path=/;`;
}

// Create an Axios instance for general API requests
const axiosInstance = axios.create({
  baseURL: 'http://192.168.0.245:8080/hrmsapplication',
});

// Create a separate Axios instance for auth-related requests to avoid interceptors
const authAxios = axios.create({
  baseURL: 'http://192.168.0.245:8080/hrmsapplication',
});

// Flags and queues to manage token refreshing
let isRefreshing = false;
let failedQueue = [];

// Function to process the failed requests queue
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to add the access token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Access token remains in localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error response is 401 (Unauthorized)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If a refresh is already in progress, queue the request
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            // After token is refreshed, retry the original request with the new token
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      // Mark the request to prevent infinite loops
      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getCookie('refreshtoken'); // Retrieve refreshToken from cookie

      if (!refreshToken) {
        // If no refresh token is available, redirect to login
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        console.log('Attempting to refresh token...');

        // Make the refresh token request using the authAxios instance
        const response = await authAxios.post('/authentication/refreshToken', {
          refreshToken: refreshToken,
        });

        // Ensure the response contains the new token
        if (response.status === 200) {
          const newToken = response.data.token; // Adjust based on your API response

          // Store the new token
          localStorage.setItem('Token', newToken);

          // Update the default Authorization header
          axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;

          // Update the original request's Authorization header
          originalRequest.headers['Authorization'] = 'Bearer ' + newToken;

          // Process the failed queue
          processQueue(null, newToken);

          console.log('Token refreshed successfully.');

          // Retry the original request with the new token
          return axiosInstance(originalRequest);
        } else {
          // If response is not 200, consider the refresh failed
          throw new Error('Failed to refresh token.');
        }
      } catch (err) {
        console.error('Token refresh failed:', err);
        processQueue(err, null);
        // Optionally, redirect to login if refresh fails
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // If the error was not 401, or the request has already been retried, reject it
    return Promise.reject(error);
  }
);

export default axiosInstance;
