const express = require('express');
const router = express.Router();
const {
  getGreenCovers,
  getGreenCoverById,
  createGreenCover,
  updateGreenCover,
  deleteGreenCover,
} = require('../controllers/greenCoverController');

router.route('/')
  .get(getGreenCovers)
  .post(createGreenCover);

router.route('/:id')
  .get(getGreenCoverById)
  .put(updateGreenCover)
  .delete(deleteGreenCover);

module.exports = router;
