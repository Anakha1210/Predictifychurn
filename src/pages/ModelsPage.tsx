
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import ModelTrainingForm from '@/components/Models/ModelTrainingForm';
import TrainingHistoryTable from '@/components/Models/TrainingHistoryTable';
import { useQuery } from '@tanstack/react-query';
import { modelService } from '@/services/modelService';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const ModelsPage = () => {
  const { 
    data: models,
    isLoading, 
    isError,
    refetch: refetchModels
  } = useQuery({
    queryKey: ['models'],
    queryFn: modelService.getModels,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Error',
        description: 'Failed to load model data. Please try again.',
        variant: 'destructive'
      });
    }
  }, [isError]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 container py-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Train New Model</h1>
          <p className="text-muted-foreground mt-2">
            Train a machine learning model to predict customer churn using your dataset.
          </p>
        </div>

        {/* Model Training Form */}
        <ModelTrainingForm onModelTrained={() => refetchModels()} />

        <Separator className="my-8" />

        {/* Training History Section */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-6">Training History</h2>
          <TrainingHistoryTable 
            models={models || []}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default ModelsPage;
