
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const { Pool } = require('pg');

// Database Configuration
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'predictifychurn',
  password: process.env.DB_PASSWORD || 'ARV12',
  port: process.env.DB_PORT || 5432,
};

// Create a new pool instance
const pool = new Pool(dbConfig);

const runModel = async (modelType, modelId, csvPath, datasetId) => {
  try {
    // Ensure models directory exists
    const modelsDir = path.join(__dirname, 'models');
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }

    console.log(`Running ${modelType} model on dataset ${datasetId} using CSV at ${csvPath}`);
    
    // Use existing model files from ml_models directory
    const modelFiles = {
      'decision_tree': 'DT.py',
      'logistic_regression': 'LR.py'
    };

    const modelFile = modelFiles[modelType.toLowerCase()];
    if (!modelFile) {
      throw new Error(`Unsupported model type: ${modelType}`);
    }

    const scriptPath = path.join(__dirname, 'ml_models', modelFile);
    if (!fs.existsSync(scriptPath)) {
      throw new Error(`Model script not found: ${scriptPath}`);
    }
    
    // Prepare input data for Python script
    const inputData = {
      csv_path: csvPath,
      model_id: modelId,
      output_dir: modelsDir
    };
    
    return new Promise((resolve, reject) => {
      // Run Python script as a child process with timeout
      const pythonProcess = spawn('python', [scriptPath]);
      
      let output = '';
      let errorOutput = '';
      let isProcessEnded = false;
      
      // Set a timeout of 5 minutes
      const timeout = setTimeout(() => {
        if (!isProcessEnded) {
          pythonProcess.kill();
          reject(new Error('Model execution timed out after 5 minutes'));
        }
      }, 5 * 60 * 1000);

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        console.error(`Python Error: ${data}`);
      });
      
      // Handle process errors
      pythonProcess.on('error', (error) => {
        clearTimeout(timeout);
        console.error('Failed to start Python process:', error);
        reject(new Error(`Failed to start Python process: ${error.message}`));
      });

      try {
        pythonProcess.stdin.write(JSON.stringify(inputData));
        pythonProcess.stdin.end();
      } catch (error) {
        clearTimeout(timeout);
        pythonProcess.kill();
        reject(new Error(`Failed to write to Python process: ${error.message}`));
      }
      
      pythonProcess.on('close', async (code) => {
        isProcessEnded = true;
        clearTimeout(timeout);
        if (code !== 0) {
          console.error(`Python process exited with code ${code}`);
          console.error(`Error output: ${errorOutput}`);
          reject(new Error(`Model execution failed with code ${code}: ${errorOutput}`));
          return;
        }
        
        try {
          // Parse the JSON output from Python script
          const result = JSON.parse(output);
          
          // Update the model record in the database
          await pool.query(
            'UPDATE prediction_models SET accuracy = $1, updated_at = NOW() WHERE id = $2',
            [result.metrics.accuracy, modelId]
          );
          
          // Store feature importances if available
          if (result.feature_importance && result.feature_importance.length > 0) {
            // First delete any existing feature importance for this model
            await pool.query(
              'DELETE FROM feature_importance WHERE model_id = $1',
              [modelId]
            );
            
            await Promise.all(result.feature_importance.map(item => {
              return pool.query(
                'INSERT INTO feature_importance (model_id, feature_name, importance_score) VALUES ($1, $2, $3)',
                [modelId, item.feature, item.importance]
              );
            }));
          }
          
          // Store metrics in the model_metrics table
          const validMetricNames = ['precision', 'recall', 'f1_score', 'auc_roc'];
          await Promise.all(Object.entries(result.metrics)
            .filter(([name]) => validMetricNames.includes(name))
            .map(([name, value]) => {
              return pool.query(
                'INSERT INTO model_metrics (model_id, metric_name, metric_value) VALUES ($1, $2, $3) ON CONFLICT (model_id, metric_name) DO UPDATE SET metric_value = $3',
                [modelId, name, value]
              );
          }));
          
          // Store the prediction results
          await Promise.all(result.predictions.map(async (prediction) => {
            // Find the corresponding customer_data_id
            const customerResult = await pool.query(
              'SELECT id FROM customer_data WHERE customer_id = $1 AND dataset_id = $2',
              [prediction.customer_id, datasetId]
            );
            
            if (customerResult.rows.length === 0) {
              console.warn(`No customer_data found for customer_id ${prediction.customer_id} in dataset ${datasetId}`);
              return;
            }
            
            return pool.query(
              'INSERT INTO prediction_results (dataset_id, model_id, customer_data_id, customer_id, churn_probability, is_churn) VALUES ($1, $2, $3, $4, $5, $6)',
              [datasetId, modelId, customerResult.rows[0].id, prediction.customer_id, prediction.churn_probability, prediction.is_churn]
            );
          }));
          
          resolve({
            modelId: result.model_id,
            metrics: result.metrics,
            predictionsCount: result.predictions.length
          });
        } catch (err) {
          console.error('Error processing model result:', err);
          reject(err);
        }
      });
    });
  } catch (error) {
    console.error('Error in runModel:', error);
    throw error;
  }
};

module.exports = {
  runModel
};
