
import axios from 'axios';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and we haven't already tried to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshResponse = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (refreshResponse.data?.token) {
          // Store the new token
          localStorage.setItem('token', refreshResponse.data.token);
          
          // Update the failed request's Authorization header
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
          
          // Retry the original request
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

import { PredictionModel, ModelPredictionResult } from './predictionModelService';

export const fetchModelDetails = async (modelId: number): Promise<PredictionModel> => {
  try {
    const response = await api.get(`/models/${modelId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching model details:', error);
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Unable to connect to server. Please ensure the server is running.');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch model details. Please try again.');
  }
};

export const fetchAllModels = async (): Promise<PredictionModel[]> => {
  try {
    const response = await api.get('/models');
    if (!response.data) {
      throw new Error('No models data received from server');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching models:', error);
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Unable to connect to server. Please ensure the server is running.');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch models. Please try again.');
  }
};

export const testDatabaseConnection = async () => {
  try {
    const response = await api.get('/db-test');
    return response.data;
  } catch (error) {
    console.error('Error testing database connection:', error);
    throw error;
  }
};

export const uploadDataset = async (formData: FormData, onProgress?: (progress: number) => void) => {
  try {
    // Using the correct endpoint path that matches the server route
    const response = await axios.post(`${API_URL}/datasets/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading dataset:', error);
    throw error;
  }
};

export const fetchCustomerData = async (datasetId?: number) => {
  try {
    const url = datasetId ? `/customers?datasetId=${datasetId}` : '/customers';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer data:', error);
    throw error;
  }
};

export const fetchDatasets = async () => {
  try {
    const response = await api.get('/datasets');
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching datasets:', error);
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      throw new Error('Unable to connect to server. Please ensure the server is running and accessible.');
    }
    if (error.response?.status === 404) {
      throw new Error('Dataset endpoint not found. Please check the API configuration.');
    }
    if (error.response?.status === 500) {
      throw new Error('Server encountered an error while processing the request. Please try again later.');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch datasets. Please check your connection and try again.');
  }
};

export const deleteDataset = async (datasetId: number) => {
  try {
    const response = await api.delete(`/datasets/${datasetId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting dataset:', error);
    throw error;
  }
};

export const createLogisticRegressionModel = async (name: string, description: string) => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('modelType', 'logistic_regression');
    
    // Create a dummy file for upload
    const dummyFile = new File(['placeholder'], 'placeholder.txt', { type: 'text/plain' });
    formData.append('model', dummyFile);
    
    const response = await axios.post(`${API_URL}/models/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Logistic Regression model:', error);
    throw error;
  }
};

export const createDecisionTreeModel = async (name: string, description: string) => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('modelType', 'decision_tree');
    
    // Create a dummy file for upload
    const dummyFile = new File(['placeholder'], 'placeholder.txt', { type: 'text/plain' });
    formData.append('model', dummyFile);
    
    const response = await axios.post(`${API_URL}/models/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Decision Tree model:', error);
    throw error;
  }
};

export const runModelOnDataset = async (modelId: number, datasetId: number) => {
  try {
    const response = await api.post(`/models/${modelId}/run`, { datasetId });
    return response.data;
  } catch (error) {
    console.error('Error running model on dataset:', error);
    throw error;
  }
};

export default api;
