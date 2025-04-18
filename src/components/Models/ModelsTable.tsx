import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, FileText, Trash2 } from 'lucide-react';

interface Model {
  id: number;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  lastTrained: string;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
}

interface ModelsTableProps {
  models: Model[];
  onDeleteModel?: (modelId: number) => void;
}

const ModelsTable: React.FC<ModelsTableProps> = ({ models, onDeleteModel }) => {
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateStr));
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-success-light text-success-dark border-success">Active</Badge>;
      case 'training':
        return <Badge className="bg-warning-light text-warning-dark border-warning">Training</Badge>;
      case 'error':
        return <Badge className="bg-error-light text-error-dark border-error">Error</Badge>;
      default:
        return <Badge variant="outline">Inactive</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Accuracy</TableHead>
          <TableHead>Last Trained</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {models.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              No models found. Create your first model to get started.
            </TableCell>
          </TableRow>
        ) : (
          models.map((model) => (
            <TableRow key={model.id}>
              <TableCell>
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <div className="font-medium">{model.name}</div>
                    <div className="text-sm text-gray-500">{model.type}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{model.type}</TableCell>
              <TableCell>
                {model.metrics ? (
                  <span className="font-medium">
                    {(model.metrics.accuracy * 100).toFixed(1)}%
                  </span>
                ) : (
                  'N/A'
                )}
              </TableCell>
              <TableCell>{formatDate(model.lastTrained)}</TableCell>
              <TableCell>{getStatusBadge(model.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/models/${model.id}`)}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">View</span>
                  </Button>
                  {onDeleteModel && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteModel(model.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ModelsTable;