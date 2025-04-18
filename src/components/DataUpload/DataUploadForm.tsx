
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileType, AlertCircle, CheckCircle2, Loader, CaptionsOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5001/api';

const DataUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [datasetName, setDatasetName] = useState('');
  const [description, setDescription] = useState('');
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'validating' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-generate a name based on the file if the user hasn't entered one
      if (!datasetName) {
        setDatasetName(selectedFile.name.split('.')[0]);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    const trimmedName = datasetName.trim();
    console.log(trimmedName);
    if (!trimmedName) {
      toast({
        title: "Missing dataset name",
        description: "Please provide a name for your dataset",
        variant: "destructive"
      });
      return;
    }

    // Start uploading
    setUploadState('uploading');
    setProgress(0);
    
    try {
      // Create form data to send
      const formData = new FormData();
      formData.append('file', file);
      formData.append('datasetName', trimmedName);
      formData.append('description', description || '');

      // Send file to server with authentication token
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/datasets/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        }
      });

      if (response.data.status === 'success') {
        setUploadState('success');
        toast({
          title: "Upload successful",
          description: "Your dataset has been uploaded and is being processed",
        });
      } else {
        throw new Error(response.data.message || 'Unknown error');
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadState('error');
      
      let message = 'An error occurred during upload. Please try again.';
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      
      setErrorMessage(message);
      toast({
        title: "Upload failed",
        description: message,
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Upload Customer Data</CardTitle>
        <CardDescription>
          Upload your customer data in CSV format to analyze and predict churn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dataset-name">Dataset Name</Label>
            <Input 
              id="dataset-name" 
              value={datasetName} 
              onChange={(e) => setDatasetName(e.target.value)} 
              placeholder="Q2 Customer Data 2023"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Brief description of this dataset..."
              className="resize-none h-20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload File</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
              {file ? (
                <div className="flex items-center justify-center space-x-2">
                  <FileType className="h-6 w-6 text-brand-400" />
                  <span className="font-medium text-gray-700">{file.name}</span>
                  <span className="text-sm text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                </div>
              )}
              <Input 
                id="file-upload" 
                type="file" 
                accept=".csv" 
                onChange={handleFileChange} 
                className="hidden"
              />
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('file-upload')?.click()}
                className="mt-4"
              >
                Select File
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: CSV files with customer data
            </p>
          </div>
          
          {uploadState === 'uploading' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-brand-400 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {uploadState === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          {uploadState === 'success' && (
            <Alert className="bg-green-50 border-green-400 text-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>
                File uploaded successfully! Your data is now being processed.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-end">
            <Button 
              onClick={handleUpload} 
              disabled={uploadState === 'uploading'} 
              className="min-w-[120px]"
            >
              {uploadState === 'uploading' ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Uploading...
                </>
              ) : 'Upload Dataset'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataUploadForm;
