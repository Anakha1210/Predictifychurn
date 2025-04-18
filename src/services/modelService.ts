
import axios from 'axios';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5001/api';

export interface Model {
  id: number;
  name: string;
  type: string;
  status: string;
  description: string;
  features?: string[];
  createdAt: string;
  lastTrained: string;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    aucRoc: number;
  };
  featureImportance?: {
    feature: string;
    importance: number;
  }[];
  confusionMatrix?: {
    name: string;
    value: number;
    color: string;
  }[];
  rocCurve?: {
    fpr: number;
    tpr: number;
  }[];
}

export const modelService = {
  async getModels(): Promise<Model[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.get(`${API_URL}/models`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  },

  async getModelById(id: number): Promise<Model> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.get(`${API_URL}/models/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching model ${id}:`, error);
      throw error;
    }
  },

  async runModelOnDataset(modelId: number, datasetId: number): Promise<{ metrics: Model['metrics'] }> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.post(`${API_URL}/models/${modelId}/train`, 
        { datasetId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error retraining model ${modelId}:`, error);
      throw error;
    }
  },
};
