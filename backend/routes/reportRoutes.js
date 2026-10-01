const express = require('express');
const router = express.Router();
const { getReportSummary, downloadCsvReport } = require('../controllers/reportController');

router.get('/summary', getReportSummary);
router.get('/download-csv', downloadCsvReport);

module.exports = router;
