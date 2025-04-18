
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Prediction {
  id: string;
  customerId: string;
  probability: number;
  predictedAt: string;
  datasetName: string;
}

interface RecentPredictionsTableProps {
  predictions: Prediction[];
}

const RecentPredictionsTable = ({ predictions }: RecentPredictionsTableProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getChurnRiskBadge = (probability: number) => {
    if (probability < 0.3) {
      return <Badge variant="outline" className="bg-success-light text-success-dark">Low</Badge>;
    } else if (probability < 0.6) {
      return <Badge variant="outline" className="bg-warning-light text-warning-dark">Medium</Badge>;
    } else {
      return <Badge variant="outline" className="bg-error-light text-error-dark">High</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Predictions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer ID</TableHead>
              <TableHead>Churn Risk</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Dataset</TableHead>
              <TableHead className="text-right">Predicted At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {predictions.map((prediction) => (
              <TableRow key={prediction.id}>
                <TableCell className="font-medium">{prediction.customerId}</TableCell>
                <TableCell>{getChurnRiskBadge(prediction.probability)}</TableCell>
                <TableCell>{(prediction.probability * 100).toFixed(1)}%</TableCell>
                <TableCell>{prediction.datasetName}</TableCell>
                <TableCell className="text-right">{formatDate(prediction.predictedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentPredictionsTable;
