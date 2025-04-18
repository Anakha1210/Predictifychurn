
const express = require('express');
const router = express.Router();
const { datasetUpload } = require('../middleware/upload');
const { uploadDataset, getAllDatasets, deleteDataset } = require('../controllers/datasetController');

// Routes for datasets
router.post('/upload', datasetUpload.single('file'), uploadDataset);
router.get('/', getAllDatasets);
router.delete('/:id', deleteDataset);

module.exports = router;
