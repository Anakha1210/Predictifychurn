
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ModelTrainingForm from '@/components/Models/ModelTrainingForm';
import ModelsHistory from '@/components/Models/ModelsHistory';
import { predictionModelService } from '@/services/predictionModelService';
import { toast } from '@/hooks/use-toast';

const ModelTrainingPage = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadModels = async () => {
    try {
      const data = await predictionModelService.listModels();
      setModels(data);
    } catch (error) {
      console.error('Error loading models:', error);
      toast({
        title: "Error",
        description: "Failed to load model history. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  const handleDeleteModel = async (modelId: number) => {
    try {
      await predictionModelService.deleteModel(modelId);
      setModels(models.filter(model => model.id !== modelId));
      toast({
        title: "Success",
        description: "Model deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting model:', error);
      toast({
        title: "Error",
        description: "Failed to delete model. Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Train Prediction Model</h1>
          <p className="text-gray-500 mt-1">
            Create and train a machine learning model to predict customer churn
          </p>
        </div>
        
        <ModelTrainingForm onModelTrained={loadModels} />
        
        {loading ? (
          <div className="mt-8 text-center">
            <p>Loading model history...</p>
          </div>
        ) : (
          <ModelsHistory 
            models={models} 
            onDeleteModel={handleDeleteModel}
          />
        )}

        <div className="mt-8 mx-auto max-w-3xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Model Types</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Logistic Regression</h3>
              <p className="text-sm text-gray-700">
                A statistical model that uses a logistic function to model a binary dependent variable. 
                Ideal for binary classification problems like churn prediction.
              </p>
              <ul className="mt-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="text-brand-400 mr-2">•</span>
                  <span>Good for understanding feature importance</span>
                </li>
                <li className="flex items-center">
                  <span className="text-brand-400 mr-2">•</span>
                  <span>Works well with smaller datasets</span>
                </li>
                <li className="flex items-center">
                  <span className="text-brand-400 mr-2">•</span>
                  <span>Provides probability estimates</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Decision Tree</h3>
              <p className="text-sm text-gray-700">
                A decision support tool that uses a tree-like model of decisions and their possible 
                consequences, including chance event outcomes and utility.
              </p>
              <ul className="mt-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="text-brand-400 mr-2">•</span>
                  <span>Easy to interpret and visualize</span>
                </li>
                <li className="flex items-center">
                  <span className="text-brand-400 mr-2">•</span>
                  <span>Captures non-linear patterns</span>
                </li>
                <li className="flex items-center">
                  <span className="text-brand-400 mr-2">•</span>
                  <span>Handles mixed data types well</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModelTrainingPage;
