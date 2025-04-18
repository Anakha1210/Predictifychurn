
const express = require('express');
const router = express.Router();
const { modelUpload } = require('../middleware/upload');
const { 
  getAllModels, 
  getModelById, 
  uploadModel, 
  runModelOnDataset 
} = require('../controllers/modelController');

// Routes for models
router.get('/', getAllModels);
router.get('/:id', getModelById);
router.post('/upload', modelUpload.single('model'), uploadModel);
router.post('/:modelId/run', runModelOnDataset);
router.post('/:modelId/train', runModelOnDataset); // Add an alias for training endpoint

module.exports = router;
