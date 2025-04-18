
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PostgreSQLSchema = () => {
  const tables = [
    {
      name: "Users",
      description: "Stores user authentication and profile information",
      columns: [
        { name: "id", type: "SERIAL", constraints: "PRIMARY KEY" },
        { name: "username", type: "VARCHAR(255)", constraints: "NOT NULL UNIQUE" },
        { name: "email", type: "VARCHAR(255)", constraints: "NOT NULL UNIQUE" },
        { name: "password_hash", type: "VARCHAR(255)", constraints: "NOT NULL" },
        { name: "role", type: "VARCHAR(50)", constraints: "NOT NULL DEFAULT 'user'" },
        { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" },
        { name: "last_login", type: "TIMESTAMP", constraints: "" }
      ]
    },
    {
      name: "Datasets",
      description: "Tracks uploaded customer datasets",
      columns: [
        { name: "id", type: "SERIAL", constraints: "PRIMARY KEY" },
        { name: "user_id", type: "INTEGER", constraints: "NOT NULL REFERENCES users(id)" },
        { name: "name", type: "VARCHAR(255)", constraints: "NOT NULL" },
        { name: "description", type: "TEXT", constraints: "" },
        { name: "file_path", type: "VARCHAR(512)", constraints: "" },
        { name: "record_count", type: "INTEGER", constraints: "" },
        { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" },
        { name: "status", type: "VARCHAR(50)", constraints: "NOT NULL DEFAULT 'uploaded'" }
      ]
    },
    {
      name: "Customer Data",
      description: "Stores individual customer records from uploaded datasets",
      columns: [
        { name: "id", type: "SERIAL", constraints: "PRIMARY KEY" },
        { name: "dataset_id", type: "INTEGER", constraints: "NOT NULL REFERENCES datasets(id)" },
        { name: "customer_id", type: "VARCHAR(255)", constraints: "NOT NULL" },
        { name: "gender", type: "VARCHAR(10)", constraints: "" },
        { name: "senior_citizen", type: "BOOLEAN", constraints: "" },
        { name: "partner", type: "BOOLEAN", constraints: "" },
        { name: "dependents", type: "BOOLEAN", constraints: "" },
        { name: "tenure", type: "INTEGER", constraints: "" },
        { name: "phone_service", type: "BOOLEAN", constraints: "" },
        { name: "multiple_lines", type: "VARCHAR(50)", constraints: "" },
        { name: "internet_service", type: "VARCHAR(50)", constraints: "" },
        { name: "contract", type: "VARCHAR(50)", constraints: "" },
        { name: "monthly_charges", type: "NUMERIC(10,2)", constraints: "" },
        { name: "total_charges", type: "NUMERIC(10,2)", constraints: "" },
        { name: "is_churned", type: "BOOLEAN", constraints: "" }
      ]
    },
    {
      name: "Prediction Models",
      description: "Information about trained machine learning models",
      columns: [
        { name: "id", type: "SERIAL", constraints: "PRIMARY KEY" },
        { name: "user_id", type: "INTEGER", constraints: "NOT NULL REFERENCES users(id)" },
        { name: "name", type: "VARCHAR(255)", constraints: "NOT NULL" },
        { name: "description", type: "TEXT", constraints: "" },
        { name: "model_type", type: "VARCHAR(100)", constraints: "" },
        { name: "features", type: "TEXT[]", constraints: "" },
        { name: "accuracy", type: "NUMERIC(5,4)", constraints: "" },
        { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "Prediction Results",
      description: "Stores individual customer churn predictions",
      columns: [
        { name: "id", type: "SERIAL", constraints: "PRIMARY KEY" },
        { name: "dataset_id", type: "INTEGER", constraints: "NOT NULL REFERENCES datasets(id)" },
        { name: "model_id", type: "INTEGER", constraints: "NOT NULL REFERENCES prediction_models(id)" },
        { name: "customer_data_id", type: "INTEGER", constraints: "NOT NULL REFERENCES customer_data(id)" },
        { name: "customer_id", type: "VARCHAR(255)", constraints: "NOT NULL" },
        { name: "churn_probability", type: "NUMERIC(5,4)", constraints: "" },
        { name: "is_churn", type: "BOOLEAN", constraints: "" },
        { name: "prediction_date", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "Feature Importance",
      description: "Tracks which features are most predictive of churn",
      columns: [
        { name: "id", type: "SERIAL", constraints: "PRIMARY KEY" },
        { name: "model_id", type: "INTEGER", constraints: "NOT NULL REFERENCES prediction_models(id)" },
        { name: "feature_name", type: "VARCHAR(255)", constraints: "NOT NULL" },
        { name: "importance_score", type: "NUMERIC(5,4)", constraints: "" },
        { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "Recommendations",
      description: "AI-generated strategies to reduce churn",
      columns: [
        { name: "id", type: "SERIAL", constraints: "PRIMARY KEY" },
        { name: "user_id", type: "INTEGER", constraints: "NOT NULL REFERENCES users(id)" },
        { name: "customer_data_id", type: "INTEGER", constraints: "REFERENCES customer_data(id)" },
        { name: "recommendation_text", type: "TEXT", constraints: "NOT NULL" },
        { name: "category", type: "VARCHAR(100)", constraints: "" },
        { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" }
      ]
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">PostgreSQL Database Schema</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto px-0">
        <Tabs defaultValue="tables">
          <TabsList className="mx-6">
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tables" className="px-0">
            <div className="space-y-6 px-6">
              {tables.map((table) => (
                <div key={table.name} className="border rounded-md">
                  <div className="bg-muted px-4 py-2 border-b">
                    <h3 className="font-medium">{table.name}</h3>
                    <p className="text-sm text-muted-foreground">{table.description}</p>
                  </div>
                  <div className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Column</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Constraints</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {table.columns.map((column) => (
                          <TableRow key={`${table.name}-${column.name}`}>
                            <TableCell className="font-mono">{column.name}</TableCell>
                            <TableCell className="font-mono">{column.type}</TableCell>
                            <TableCell className="font-mono">{column.constraints}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="relationships" className="px-6">
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Foreign Key Relationships</h3>
                <ul className="space-y-2">
                  <li><span className="font-semibold">datasets.user_id</span> → <span className="font-mono">users.id</span></li>
                  <li><span className="font-semibold">customer_data.dataset_id</span> → <span className="font-mono">datasets.id</span></li>
                  <li><span className="font-semibold">prediction_models.user_id</span> → <span className="font-mono">users.id</span></li>
                  <li><span className="font-semibold">prediction_results.dataset_id</span> → <span className="font-mono">datasets.id</span></li>
                  <li><span className="font-semibold">prediction_results.model_id</span> → <span className="font-mono">prediction_models.id</span></li>
                  <li><span className="font-semibold">prediction_results.customer_data_id</span> → <span className="font-mono">customer_data.id</span></li>
                  <li><span className="font-semibold">feature_importance.model_id</span> → <span className="font-mono">prediction_models.id</span></li>
                  <li><span className="font-semibold">recommendations.user_id</span> → <span className="font-mono">users.id</span></li>
                  <li><span className="font-semibold">recommendations.customer_data_id</span> → <span className="font-mono">customer_data.id</span></li>
                </ul>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Indexes</h3>
                <ul className="space-y-2">
                  <li><span className="font-mono">idx_datasets_user_id</span> on <span className="font-semibold">datasets.user_id</span></li>
                  <li><span className="font-mono">idx_customer_data_dataset_id</span> on <span className="font-semibold">customer_data.dataset_id</span></li>
                  <li><span className="font-mono">idx_customer_data_customer_id</span> on <span className="font-semibold">customer_data.customer_id</span></li>
                  <li><span className="font-mono">idx_prediction_results_dataset_id</span> on <span className="font-semibold">prediction_results.dataset_id</span></li>
                  <li><span className="font-mono">idx_prediction_results_customer_id</span> on <span className="font-semibold">prediction_results.customer_id</span></li>
                  <li><span className="font-mono">idx_feature_importance_model_id</span> on <span className="font-semibold">feature_importance.model_id</span></li>
                </ul>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Cascade Deletes</h3>
                <p className="text-sm text-muted-foreground mb-2">The following relationships include CASCADE on delete:</p>
                <ul className="space-y-2">
                  <li>Deleting a <span className="font-semibold">user</span> will delete all their datasets, models, and recommendations</li>
                  <li>Deleting a <span className="font-semibold">dataset</span> will delete all customer data and prediction results for that dataset</li>
                  <li>Deleting a <span className="font-semibold">prediction model</span> will delete all feature importance records and prediction results for that model</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PostgreSQLSchema;
