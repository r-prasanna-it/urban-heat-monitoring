const express = require('express');
const router = express.Router();
const {
  getHotspots,
  getHotspotById,
  createHotspot,
  updateHotspot,
  deleteHotspot,
} = require('../controllers/hotspotController');

router.route('/')
  .get(getHotspots)
  .post(createHotspot);

router.route('/:id')
  .get(getHotspotById)
  .put(updateHotspot)
  .delete(deleteHotspot);

module.exports = router;
