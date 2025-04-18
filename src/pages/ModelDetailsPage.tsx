import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, FileText, BarChart3, PieChartIcon, Code } from 'lucide-react';
import { modelService, Model } from '@/services/modelService';
import { toast } from '@/hooks/use-toast';

const ModelDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const modelId = id ? parseInt(id) : 1;
  
  const { data: modelData, isLoading, isError, error } = useQuery({
    queryKey: ['model', modelId],
    queryFn: () => modelService.getModelById(modelId),
    retry: 1,
    refetchOnWindowFocus: false,
  });
  
  // Format percentage for display
  const formatPercent = (value: number | string) => {
    if (typeof value === 'number') {
      return `${(value * 100).toFixed(1)}%`;
    }
    return value;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 container py-6 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-2">Loading model details...</h2>
            <div className="animate-pulse-gentle w-48 h-2 bg-gray-300 rounded-full mx-auto"></div>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !modelData) {
    console.error('Model details error:', error);
    toast({
      title: "Error",
      description: "Failed to load model details. Please try again later.",
      variant: "destructive"
    });
    
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 container py-6 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium text-red-600 mb-2">Error loading model details</h2>
            <p>Could not retrieve model information. Please try again later.</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const { 
    name, 
    type, 
    status, 
    createdAt, 
    lastTrained, 
    metrics, 
    featureImportance, 
    confusionMatrix,
    rocCurve 
  } = modelData;

  // Calculate churn rate from confusion matrix using total dataset
  const calculateChurnRate = () => {
    const truePositives = confusionMatrix.find(m => m.name === 'True Positive')?.value || 0;
    const falseNegatives = confusionMatrix.find(m => m.name === 'False Negative')?.value || 0;
    const falsePositives = confusionMatrix.find(m => m.name === 'False Positive')?.value || 0;
    const trueNegatives = confusionMatrix.find(m => m.name === 'True Negative')?.value || 0;
    const totalCustomers = truePositives + falseNegatives + falsePositives + trueNegatives;
    const totalChurned = truePositives + falseNegatives;
    return totalChurned / totalCustomers;
  };

  // Create metrics array for display
  const metricsArray = [
    { name: 'Churn Rate', value: calculateChurnRate() },
    { name: 'Accuracy', value: metrics.accuracy },
    { name: 'Precision', value: metrics.precision },
    { name: 'Recall', value: metrics.recall },
    { name: 'F1-Score', value: metrics.f1Score },
    { name: 'AUC-ROC', value: metrics.aucRoc },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 container py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            <div className="flex items-center mt-2 space-x-2">
              <Badge className={status === 'Active' ? "bg-success text-success-foreground" : "bg-gray-100 text-gray-800"}>
                {status}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">{type}</Badge>
              <p className="text-gray-500">Created on {createdAt}</p>
              <p className="text-gray-500">•</p>
              <p className="text-gray-500">Last trained {lastTrained}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>View Source (.py)</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Retrain</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Churn Rate Formula</CardTitle>
            <CardDescription>Understanding how customer churn is calculated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="font-mono text-sm">
                Churn Rate (%) = (Number of Customers Lost During Period / Number of Customers at Start of Period) × 100
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {metricsArray.map((metric) => (
            <Card key={metric.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPercent(metric.value)}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="features" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Feature Importance</span>
            </TabsTrigger>
            <TabsTrigger value="confusion" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              <span>Confusion Matrix</span>
            </TabsTrigger>
            <TabsTrigger value="roc" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>ROC Curve</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Feature Importance</CardTitle>
                <CardDescription>Key factors that influence customer churn predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={featureImportance}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <YAxis dataKey="feature" type="category" width={100} />
                      <RechartsTooltip formatter={(value) => [`${value}%`, 'Importance']} />
                      <Bar dataKey="importance" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="confusion">
            <Card>
              <CardHeader>
                <CardTitle>Confusion Matrix</CardTitle>
                <CardDescription>Visualization of the model's prediction accuracy</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="h-[400px] w-full max-w-md">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={confusionMatrix}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value, percent }) => {
                          if (typeof percent === 'number') {
                            return `${name}: ${value} (${(percent * 100).toFixed(1)}%)`;
                          }
                          return `${name}: ${value}`;
                        }}
                      >
                        {confusionMatrix.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => [value, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-success/10 border border-success/30 p-4 rounded-md">
                    <p className="font-medium text-success-foreground">True Negative</p>
                    <p className="text-sm text-gray-600">Correctly predicted not to churn</p>
                  </div>
                  <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-md">
                    <p className="font-medium text-yellow-800">False Positive</p>
                    <p className="text-sm text-gray-600">Incorrectly predicted to churn</p>
                  </div>
                  <div className="bg-red-100 border border-red-300 p-4 rounded-md">
                    <p className="font-medium text-red-800">False Negative</p>
                    <p className="text-sm text-gray-600">Incorrectly predicted not to churn</p>
                  </div>
                  <div className="bg-blue-100 border border-blue-300 p-4 rounded-md">
                    <p className="font-medium text-blue-800">True Positive</p>
                    <p className="text-sm text-gray-600">Correctly predicted to churn</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="roc">
            <Card>
              <CardHeader>
                <CardTitle>ROC Curve</CardTitle>
                <CardDescription>Receiver Operating Characteristic curve showing model performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={rocCurve}
                      margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="fpr" 
                        type="number" 
                        domain={[0, 1]} 
                        tickFormatter={(value) => typeof value === 'number' ? value.toFixed(1) : value} 
                        label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -15 }}
                      />
                      <YAxis 
                        domain={[0, 1]} 
                        tickFormatter={(value) => typeof value === 'number' ? value.toFixed(1) : value} 
                        label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft' }}
                      />
                      <RechartsTooltip 
                        formatter={(value) => {
                          if (typeof value === 'number') {
                            return [value.toFixed(2), ''];
                          }
                          return [value, ''];
                        }}
                        labelFormatter={(label) => `FPR: ${typeof label === 'number' ? label.toFixed(2) : label}`}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Line 
                        name={`ROC Curve (AUC = ${metrics.aucRoc.toFixed(2)})` }
                        type="monotone" 
                        dataKey="tpr" 
                        stroke="#3b82f6" 
                        strokeWidth={2} 
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        name="Random Classifier" 
                        type="monotone" 
                        data={[{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }]} 
                        dataKey="tpr" 
                        stroke="#d1d5db" 
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ModelDetailsPage;
