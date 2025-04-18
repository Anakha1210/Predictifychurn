
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Model } from '@/services/modelService';

interface TrainingHistoryTableProps {
  models: Model[];
  isLoading: boolean;
}

const TrainingHistoryTable: React.FC<TrainingHistoryTableProps> = ({ models, isLoading }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-md">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-white">
        <BarChart3 className="w-12 h-12 mx-auto text-gray-300" />
        <h3 className="mt-4 text-lg font-medium">No training history yet</h3>
        <p className="mt-1 text-gray-500">Train your first model to see results here</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <Table>
        <TableCaption>Training history of prediction models.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Model Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date Trained</TableHead>
            <TableHead>Accuracy</TableHead>
            <TableHead>Precision</TableHead>
            <TableHead>Recall</TableHead>
            <TableHead>F1 Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model) => (
            <TableRow 
              key={model.id} 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => navigate('/train-model')}
            >
              <TableCell className="font-medium">{model.name}</TableCell>
              <TableCell>{model.type}</TableCell>
              <TableCell>{formatDate(model.lastTrained)}</TableCell>
              <TableCell>{(model.metrics.accuracy * 100).toFixed(1)}%</TableCell>
              <TableCell>{(model.metrics.precision * 100).toFixed(1)}%</TableCell>
              <TableCell>{(model.metrics.recall * 100).toFixed(1)}%</TableCell>
              <TableCell>{(model.metrics.f1Score * 100).toFixed(1)}%</TableCell>
              <TableCell>
                <Badge variant={model.status === 'Active' ? 'default' : 'outline'}>
                  {model.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/models/${model.id}`);
                  }}
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TrainingHistoryTable;
