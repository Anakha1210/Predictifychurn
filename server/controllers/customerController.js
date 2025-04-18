
const pool = require('../config/db');

// Get customer data
const getCustomerData = async (req, res) => {
  try {
    const { datasetId } = req.query;
    
    let query = `
      SELECT 
        id,
        customer_id,
        gender,
        senior_citizen,
        partner,
        dependents,
        tenure,
        phone_service,
        multiple_lines,
        internet_service,
        online_security,
        online_backup,
        device_protection,
        tech_support,
        streaming_tv,
        streaming_movies,
        contract,
        paperless_billing,
        payment_method,
        monthly_charges,
        total_charges,
        is_churned,
        dataset_id,
        created_at
      FROM 
        customer_data
    `;
    
    const params = [];
    
    // Add dataset filter if provided
    if (datasetId) {
      query += ' WHERE dataset_id = $1';
      params.push(datasetId);
    }
    
    query += ' ORDER BY created_at DESC LIMIT 1000'; // Limit to prevent large result sets
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching customer data:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch customer data',
      error: error.message
    });
  }
};

module.exports = {
  getCustomerData
};
