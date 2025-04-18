
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const createStorage = (directory) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '..', directory);
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Create unique filename with timestamp
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
  });
};

// File filter to only accept CSV files
const csvFileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv' || 
      file.originalname.endsWith('.csv') || 
      file.mimetype === 'application/vnd.ms-excel') {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed'), false);
  }
};

// Setup upload middleware for datasets
const datasetUpload = multer({ 
  storage: createStorage('uploads'),
  fileFilter: csvFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// File filter for model files
const modelFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pkl', '.joblib', '.h5', '.model', '.py', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  // Special handling for placeholder files used during model creation
  if (file.originalname === 'placeholder.txt' || file.mimetype === 'text/plain') {
    cb(null, true);
    return;
  }
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only model files (.pkl, .joblib, .h5, .model), Python scripts (.py), or placeholder files (.txt) are allowed'), false);
  }
};

// Setup upload middleware for models
const modelUpload = multer({
  storage: createStorage('models'),
  fileFilter: modelFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

module.exports = {
  datasetUpload,
  modelUpload
};
