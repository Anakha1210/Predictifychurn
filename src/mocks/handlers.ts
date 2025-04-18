
import { rest } from 'msw';

// Define API mock handlers
export const handlers = [
  // GET /models endpoint
  rest.get('http://localhost:5001/api/models', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          name: 'Logistic Regression Model',
          type: 'logistic_regression',
          status: 'trained',
          description: 'A model for predicting customer churn',
          createdAt: '2023-10-15T10:30:00',
          lastTrained: '2023-10-15T14:20:00',
          metrics: {
            accuracy: 0.85,
            precision: 0.82,
            recall: 0.78,
            f1Score: 0.80,
            aucRoc: 0.88
          }
        },
        {
          id: 2,
          name: 'Decision Tree Model',
          type: 'decision_tree',
          status: 'trained',
          description: 'A tree-based model for churn prediction',
          createdAt: '2023-10-16T09:15:00',
          lastTrained: '2023-10-16T11:45:00',
          metrics: {
            accuracy: 0.83,
            precision: 0.79,
            recall: 0.81,
            f1Score: 0.80,
            aucRoc: 0.85
          }
        }
      ])
    );
  }),

  // GET /models/:id endpoint
  rest.get('http://localhost:5001/api/models/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    return res(
      ctx.status(200),
      ctx.json({
        id: Number(id),
        name: id === '1' ? 'Logistic Regression Model' : 'Decision Tree Model',
        type: id === '1' ? 'logistic_regression' : 'decision_tree',
        status: 'trained',
        description: id === '1' ? 'A model for predicting customer churn' : 'A tree-based model for churn prediction',
        createdAt: id === '1' ? '2023-10-15T10:30:00' : '2023-10-16T09:15:00',
        lastTrained: id === '1' ? '2023-10-15T14:20:00' : '2023-10-16T11:45:00',
        features: ['tenure', 'monthly_charges', 'total_charges', 'contract', 'payment_method'],
        metrics: {
          accuracy: id === '1' ? 0.85 : 0.83,
          precision: id === '1' ? 0.82 : 0.79,
          recall: id === '1' ? 0.78 : 0.81,
          f1Score: id === '1' ? 0.80 : 0.80,
          aucRoc: id === '1' ? 0.88 : 0.85
        },
        featureImportance: [
          { feature: 'contract', importance: 0.35 },
          { feature: 'tenure', importance: 0.25 },
          { feature: 'monthly_charges', importance: 0.20 },
          { feature: 'total_charges', importance: 0.15 },
          { feature: 'payment_method', importance: 0.05 }
        ]
      })
    );
  }),

  // POST /models/:modelId/train endpoint
  rest.post('http://localhost:5001/api/models/:modelId/train', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        metrics: {
          accuracy: 0.87,
          precision: 0.84,
          recall: 0.80,
          f1Score: 0.82,
          aucRoc: 0.89
        }
      })
    );
  }),
];
