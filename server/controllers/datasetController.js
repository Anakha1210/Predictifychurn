
const fs = require('fs');
const csvParser = require('csv-parser');
const pool = require('../config/db');

// Upload a new dataset
const uploadDataset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    const { datasetName, description } = req.body;
    const filePath = req.file.path;
    
    // Hard-coded user_id for now (you should replace this with actual user auth)
    const userId = 1;  
    
    // Insert dataset record
    const datasetResult = await pool.query(
      'INSERT INTO datasets (user_id, name, description, file_path, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [userId, datasetName, description, filePath, 'processing']
    );
    
    const datasetId = datasetResult.rows[0].id;
    
    // Process the CSV file and insert records into customer_data
    let recordCount = 0;
    let hasError = false;
    let processedRows = [];
    let errorCount = 0;
    
    // Create a stream to process the CSV file
    const stream = fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        try {
          // Map CSV columns to database fields
          // Generate a unique customer ID if none exists in the dataset
          const customerId = row.CustomerID || row.customer_id || `CUST-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
          
          const customerData = {
            customer_id: customerId, // Ensure customer_id is never null
            gender: row.Gender || row.gender,
            senior_citizen: row.SeniorCitizen === '1' || row.SeniorCitizen === 'Yes' || row.senior_citizen === 'Yes',
            partner: row.Partner === 'Yes' || row.partner === 'Yes',
            dependents: row.Dependents === 'Yes' || row.dependents === 'Yes',
            tenure: parseInt(row.Tenure || row.tenure) || 0,
            phone_service: row.PhoneService === 'Yes' || row.phone_service === 'Yes',
            multiple_lines: row.MultipleLines || row.multiple_lines,
            internet_service: row.InternetService || row.internet_service,
            online_security: row.OnlineSecurity || row.online_security,
            online_backup: row.OnlineBackup || row.online_backup,
            device_protection: row.DeviceProtection || row.device_protection,
            tech_support: row.TechSupport || row.tech_support,
            streaming_tv: row.StreamingTV || row.streaming_tv,
            streaming_movies: row.StreamingMovies || row.streaming_movies,
            contract: row.Contract || row.contract,
            paperless_billing: row.PaperlessBilling === 'Yes' || row.paperless_billing === 'Yes',
            payment_method: row.PaymentMethod || row.payment_method,
            monthly_charges: parseFloat(row.MonthlyCharges || row.monthly_charges) || 0,
            total_charges: parseFloat(row.TotalCharges || row.total_charges) || 0,
            is_churned: row.Churn === 'Yes' || row.churn === 'Yes' || row.is_churned === 'Yes'
          };
          
          console.log('Processing customer data:', { 
            customerId,
            originalCustomerId: row.CustomerID || row.customer_id,
            rowKeys: Object.keys(row)
          });
          
          // Insert customer data into database
          processedRows.push([
            datasetId, customerData.customer_id, customerData.gender, customerData.senior_citizen,
            customerData.partner, customerData.dependents, customerData.tenure, 
            customerData.phone_service, customerData.multiple_lines, customerData.internet_service,
            customerData.online_security, customerData.online_backup, customerData.device_protection,
            customerData.tech_support, customerData.streaming_tv, customerData.streaming_movies,
            customerData.contract, customerData.paperless_billing, customerData.payment_method,
            customerData.monthly_charges, customerData.total_charges, customerData.is_churned
          ]);
          recordCount++;
        } catch (err) {
          console.error('Error inserting customer data row:', err);
          errorCount++;
          hasError = true;
        }
      })
      .on('end', async () => {
        try {
          // Batch insert all processed rows
          const insertQuery = `
            INSERT INTO customer_data 
            (dataset_id, customer_id, gender, senior_citizen, partner, dependents, 
             tenure, phone_service, multiple_lines, internet_service, online_security, 
             online_backup, device_protection, tech_support, streaming_tv, 
             streaming_movies, contract, paperless_billing, payment_method, 
             monthly_charges, total_charges, is_churned) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
          `;
          
          for (const row of processedRows) {
            await pool.query(insertQuery, row);
          }
          
          // Update dataset with record count, error count and status
          const status = hasError ? (recordCount > 0 ? 'processed_with_errors' : 'error') : 'processed';
          await pool.query(
            'UPDATE datasets SET status = $1, record_count = $2 WHERE id = $3',
            [status, recordCount, datasetId]
          );
          console.log(`CSV processing completed. Inserted ${recordCount} records. Status: ${status}`);
        } catch (err) {
          console.error('Error updating dataset status:', err);
          // Try to update status to error if we can't update both fields
          try {
            await pool.query('UPDATE datasets SET status = $1 WHERE id = $2', ['error', datasetId]);
          } catch (updateErr) {
            console.error('Failed to update dataset error status:', updateErr);
          }
        }
      })
      .on('error', async (err) => {
        console.error('Error processing CSV:', err);
        hasError = true;
        try {
          await pool.query('UPDATE datasets SET status = $1 WHERE id = $2', ['error', datasetId]);
        } catch (updateErr) {
          console.error('Failed to update dataset error status:', updateErr);
        }
      });

    res.json({
      status: 'success',
      message: 'File uploaded and processing started',
      dataset: {
        id: datasetId,
        name: datasetName,
        description,
        filePath,
        status: 'processing'
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'File upload failed',
      error: error.message
    });
  }
};

// Get all datasets
const getAllDatasets = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        d.id, 
        d.name, 
        d.description, 
        d.status, 
        d.created_at,
        COUNT(c.id) as actual_record_count
      FROM datasets d
      LEFT JOIN customer_data c ON d.id = c.dataset_id
      GROUP BY d.id, d.name, d.description, d.status, d.created_at
      ORDER BY d.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching datasets:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch datasets',
      error: error.message
    });
  }
};

// Delete a dataset
const deleteDataset = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if dataset exists
    const checkResult = await pool.query('SELECT * FROM datasets WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Dataset not found' 
      });
    }
    
    // Delete the dataset (cascade delete will handle customer_data deletion)
    await pool.query('DELETE FROM datasets WHERE id = $1', [id]);
    
    res.json({
      status: 'success',
      message: 'Dataset and associated data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting dataset:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to delete dataset', 
      error: error.message 
    });
  }
};

module.exports = {
  uploadDataset,
  getAllDatasets,
  deleteDataset
};
