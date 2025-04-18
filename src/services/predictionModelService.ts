
import axios from 'axios';

// Use the same API_URL approach as in the api.ts file
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5001/api';

export interface PredictionModel {
  id?: number;
  name: string;
  description?: string;
  modelType: string;
  filePath: string;
  accuracy?: number;
  isActive?: boolean;
  status?: string;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  aucRoc: number;
}

export interface ModelPredictionResult {
  status: string;
  message: string;
  metrics: ModelMetrics;
  predictionCount: number;
}

export const predictionModelService = {
  async uploadModel(modelData: FormData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      const response = await axios.post(`${API_URL}/models/upload`, modelData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading prediction model:', error);
      throw error;
    }
  },

  async listModels() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      const response = await axios.get(`${API_URL}/models`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching prediction models:', error);
      throw error;
    }
  },

  async runModel(modelId: number, datasetId: number): Promise<ModelPredictionResult> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      console.log(`Running model ${modelId} on dataset ${datasetId} with token`);
      const response = await axios.post(`${API_URL}/models/${modelId}/run`, { datasetId }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error running prediction model:', error);
      throw error;
    }
  },
  
  async createLogisticRegressionModel(name: string, description: string): Promise<number> {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('modelType', 'logistic_regression');
      
      // Add a placeholder file since the backend expects one
      const placeholderFile = new File(['placeholder'], 'placeholder.txt', { type: 'text/plain' });
      formData.append('model', placeholderFile);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.post(`${API_URL}/models/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response.data.modelId;
    } catch (error) {
      console.error('Error creating logistic regression model:', error);
      throw error;
    }
  },
  
  async createDecisionTreeModel(name: string, description: string): Promise<number> {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('modelType', 'decision_tree');
      
      // Add a placeholder file since the backend expects one
      const placeholderFile = new File(['placeholder'], 'placeholder.txt', { type: 'text/plain' });
      formData.append('model', placeholderFile);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.post(`${API_URL}/models/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response.data.modelId;
    } catch (error) {
      console.error('Error creating decision tree model:', error);
      throw error;
    }
  },
  
  async deleteModel(modelId: number): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      await axios.delete(`${API_URL}/models/${modelId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error deleting prediction model:', error);
      throw error;
    }
  },
};
