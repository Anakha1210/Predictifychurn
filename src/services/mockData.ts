
export const mockPredictions = [
  {
    id: '1',
    customerId: 'CUST-7823',
    probability: 0.82,
    predictedAt: '2023-09-15T10:30:00',
    datasetName: 'Q3 Customer Data'
  },
  {
    id: '2',
    customerId: 'CUST-5219',
    probability: 0.25,
    predictedAt: '2023-09-15T09:45:00',
    datasetName: 'Q3 Customer Data'
  },
  {
    id: '3',
    customerId: 'CUST-3064',
    probability: 0.54,
    predictedAt: '2023-09-14T16:20:00',
    datasetName: 'Q3 Customer Data'
  },
  {
    id: '4',
    customerId: 'CUST-9401',
    probability: 0.91,
    predictedAt: '2023-09-14T14:15:00',
    datasetName: 'Q3 Customer Data'
  },
  {
    id: '5',
    customerId: 'CUST-2175',
    probability: 0.08,
    predictedAt: '2023-09-14T11:50:00',
    datasetName: 'Q2 Customer Data'
  }
];

export const mockChurnFactors = [
  { factor: 'Contract Type (Month-to-Month)', influence: 78 },
  { factor: 'Tenure (Less than 12 months)', influence: 65 },
  { factor: 'Monthly Charges (High)', influence: 52 },
  { factor: 'Technical Support (No)', influence: 47 },
  { factor: 'Internet Service (Fiber optic)', influence: 39 },
  { factor: 'Payment Method (Electronic check)', influence: 31 }
];

export const mockCustomerSegments = [
  { name: 'High Risk', value: 245, color: '#ff4d4f' },
  { name: 'Medium Risk', value: 378, color: '#faad14' },
  { name: 'Low Risk', value: 631, color: '#52c41a' },
  { name: 'New Customers', value: 156, color: '#1890ff' }
];

export const mockDatasets = [
  {
    id: '1',
    name: 'Q3 Customer Data',
    description: 'Customer data from July to September 2023',
    recordCount: 2500,
    createdAt: '2023-09-10T08:15:00',
    status: 'processed'
  },
  {
    id: '2',
    name: 'Q2 Customer Data',
    description: 'Customer data from April to June 2023',
    recordCount: 2350,
    createdAt: '2023-06-15T11:30:00',
    status: 'processed'
  },
  {
    id: '3',
    name: 'New Signups 2023',
    description: 'Customers who signed up this year',
    recordCount: 850,
    createdAt: '2023-08-22T14:45:00',
    status: 'processed'
  }
];
