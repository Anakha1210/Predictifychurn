
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2, Loader2, BarChart4 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { predictionModelService, ModelPredictionResult } from '@/services/predictionModelService';
import { fetchDatasets } from '@/services/api';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Dataset {
  id: number;
  name: string;
  record_count: number;
  status: string;
}

const MODEL_TYPES = [
  { value: 'logistic_regression', label: 'Logistic Regression' },
  { value: 'decision_tree', label: 'Decision Tree' },
];

const formSchema = z.object({
  modelName: z.string().min(3, { message: "Model name must be at least 3 characters" }),
  modelDescription: z.string().optional(),
  modelType: z.string().min(1, { message: "Please select a model type" }),
  datasetId: z.string().min(1, { message: "Please select a dataset" }),
});

type FormValues = z.infer<typeof formSchema>;

interface ModelTrainingFormProps {
  onModelTrained?: () => void;
}

const ModelTrainingForm = ({ onModelTrained }: ModelTrainingFormProps) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [results, setResults] = useState<ModelPredictionResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modelName: '',
      modelDescription: '',
      modelType: '',
      datasetId: '',
    }
  });

  // Fetch available datasets
  useEffect(() => {
    const loadDatasets = async () => {
      try {
        const data = await fetchDatasets();
        setDatasets(data.filter((dataset: Dataset) => dataset.status === 'processed'));
      } catch (error) {
        console.error('Error fetching datasets:', error);
        toast({
          title: "Error",
          description: "Failed to fetch available datasets. Please check your server connection.",
          variant: "destructive"
        });
      }
    };

    loadDatasets();
  }, []);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setStatus('loading');
    
    try {
      // First create the model based on selected type
      let modelId: number;
      
      if (values.modelType === 'logistic_regression') {
        const result = await predictionModelService.createLogisticRegressionModel(
          values.modelName, 
          values.modelDescription || ''
        );
        modelId = result;
      } else {
        const result = await predictionModelService.createDecisionTreeModel(
          values.modelName, 
          values.modelDescription || ''
        );
        modelId = result;
      }

      // Run the selected model on the chosen dataset
      const trainingResult = await predictionModelService.runModel(
        modelId,
        parseInt(values.datasetId)
      );

      setResults(trainingResult);
      setStatus('success');
      
      toast({
        title: "Model trained successfully",
        description: `${values.modelType.replace('_', ' ')} model trained with ${(trainingResult.metrics.accuracy * 100).toFixed(1)}% accuracy`,
      });
      
      // Notify parent component about successful model training
      if (onModelTrained) {
        onModelTrained();
      }
      
    } catch (error) {
      console.error('Error training model:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
      
      toast({
        title: "Training failed",
        description: error instanceof Error ? error.message : "Failed to train model on dataset. Check server connection.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderResults = () => {
    if (!results) return null;

    return (
      <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold mb-3">Model Training Results</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded border">
            <p className="text-sm text-slate-500">Accuracy</p>
            <p className="text-2xl font-bold">{(results.metrics.accuracy * 100).toFixed(2)}%</p>
          </div>
          <div className="bg-white p-3 rounded border">
            <p className="text-sm text-slate-500">Precision</p>
            <p className="text-2xl font-bold">{(results.metrics.precision * 100).toFixed(2)}%</p>
          </div>
          <div className="bg-white p-3 rounded border">
            <p className="text-sm text-slate-500">Recall</p>
            <p className="text-2xl font-bold">{(results.metrics.recall * 100).toFixed(2)}%</p>
          </div>
          <div className="bg-white p-3 rounded border">
            <p className="text-sm text-slate-500">F1 Score</p>
            <p className="text-2xl font-bold">{(results.metrics.f1Score * 100).toFixed(2)}%</p>
          </div>
        </div>
        
        <div className="mt-3 text-sm text-slate-600">
          <p>Processed {results.predictionCount} customer records</p>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="modelName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="My Churn Prediction Model"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="modelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Type</FormLabel>
                    <Select 
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select model type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MODEL_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="modelDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of this model's purpose..."
                      className="resize-none h-20"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="datasetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Training Dataset</FormLabel>
                  <Select
                    disabled={isLoading || datasets.length === 0}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a dataset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {datasets.length > 0 ? (
                        datasets.map((dataset) => (
                          <SelectItem key={dataset.id} value={dataset.id.toString()}>
                            {dataset.name} ({dataset.record_count} records)
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-datasets" disabled>
                          No processed datasets available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {datasets.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      You need to upload and process a dataset first
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {status === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            {status === 'success' && (
              <Alert className="bg-green-50 border-green-400 text-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  Model trained successfully!
                </AlertDescription>
              </Alert>
            )}
            
            {renderResults()}
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading || datasets.length === 0} 
                className="min-w-[150px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Training...
                  </>
                ) : (
                  <>
                    <BarChart4 className="mr-2 h-4 w-4" />
                    Train Model
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ModelTrainingForm;
