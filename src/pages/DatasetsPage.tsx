
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileSpreadsheet, 
  Download, 
  Trash2, 
  Calendar, 
  Database,
  GitBranch,
  Loader2
} from 'lucide-react';
import { fetchDatasets, deleteDataset } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import PostgreSQLSchema from '@/components/PostgreSQLSchema';
import { useNavigate } from 'react-router-dom';

interface Dataset {
  id: number;
  name: string;
  description: string;
  actual_record_count: number;
  status: string;
  created_at: string;
}

const DatasetsPage = () => {
  const [showSchema, setShowSchema] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [datasetToDelete, setDatasetToDelete] = useState<Dataset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDatasets = async () => {
      try {
        const data = await fetchDatasets();
        setDatasets(data);
      } catch (error) {
        console.error('Error loading datasets:', error);
        setError(error instanceof Error ? error.message : 'Failed to load datasets');
      } finally {
        setLoading(false);
      }
    };
    
    loadDatasets();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <Badge className="bg-warning-light text-warning-dark border-warning">Processing</Badge>;
      case 'processed':
        return <Badge className="bg-success-light text-success-dark border-success">Processed</Badge>;
      case 'error':
        return <Badge className="bg-error-light text-error-dark border-error">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleDeleteClick = (dataset: Dataset) => {
    setDatasetToDelete(dataset);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!datasetToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteDataset(datasetToDelete.id);
      setDatasets(datasets.filter(d => d.id !== datasetToDelete.id));
      toast({
        title: "Dataset deleted",
        description: `${datasetToDelete.name} has been successfully deleted.`,
      });
    } catch (error) {
      console.error('Error deleting dataset:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete dataset',
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setDatasetToDelete(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto py-6 block">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Datasets</h1>
            <p className="text-gray-500 mt-1">
              Manage your customer data for churn prediction analysis
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={() => setShowSchema(true)}
            >
              <GitBranch className="mr-2 h-4 w-4" />
              View Database Schema
            </Button>
            <Button 
              className="flex items-center"
              onClick={() => navigate('/upload')}
            >
              <Database className="mr-2 h-4 w-4" />
              New Dataset
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading datasets...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-destructive">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : datasets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No datasets found. Create your first dataset to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  datasets.map((dataset) => (
                    <TableRow key={dataset.id}>
                      <TableCell>
                        <div className="flex items-start">
                          <FileSpreadsheet className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <div className="font-medium">{dataset.name}</div>
                            <div className="text-sm text-gray-500">{dataset.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{dataset.actual_record_count ? dataset.actual_record_count.toLocaleString() : '0'}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {formatDate(dataset.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(dataset.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDeleteClick(dataset)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      
      <Dialog open={showSchema} onOpenChange={setShowSchema}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Database Schema Design</DialogTitle>
          </DialogHeader>
          <PostgreSQLSchema />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Dataset</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{datasetToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DatasetsPage;
